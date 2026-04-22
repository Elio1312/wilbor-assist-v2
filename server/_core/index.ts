import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { randomUUID } from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { registerOAuthRoutes } from "./oauth";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
// import { setupGoogleOAuth } from "./googleOAuth"; // Removed: using anonymous login instead
import { ENV } from "./env";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { runPendingMigrations } from "../runMigrations";
import { serveStatic, setupVite } from "./vite";
import { registerStripeRoutes } from "../stripeWebhook";
import sitemapRouter from "../routes/sitemap";
import robotsRouter from "../routes/robots";
import { getDb, isStartupDatabaseReachable, upsertUser } from "../db";
import { wilborMilestoneContent } from "../../drizzle/schema";
import { COMPLETE_MILESTONES } from "./milestonesData";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Rodar migrations pendentes automaticamente
  await runPendingMigrations();

  const app = express();
  const server = createServer(app);
  
  // Stripe webhook MUST be registered BEFORE express.json() middleware
  // This is done in registerStripeRoutes() which uses express.raw() for webhook
  registerStripeRoutes(app);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser(ENV.sessionSecret));

  // Setup Session and Passport
  app.use(
    session({
      secret: ENV.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: ENV.isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // setupGoogleOAuth(); // Removed: using anonymous login instead

  // Google OAuth Routes (Removed - using anonymous login)
  // app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  // app.get(
  //   "/api/auth/google/callback",
  //   passport.authenticate("google", { failureRedirect: "/login?error=google_failed" }),
  //   (req, res) => {
  //     res.redirect("/chat");
  //   }
  // );
  app.get("/api/auth/anonymous", async (req, res) => {
    const redirect =
      typeof req.query.redirect === "string" && req.query.redirect.startsWith("/")
        ? req.query.redirect
        : "/dashboard";

    try {
      const guestOpenId = `guest_${randomUUID()}`;
      const guestName = "Guest";

      try {
        await upsertUser({
          openId: guestOpenId,
          name: guestName,
          lastSignedIn: new Date(),
        });
      } catch (persistError) {
        console.warn("[Auth] Guest user could not be persisted; continuing with local session", persistError);
      }

      const sessionToken = await sdk.createSessionToken(guestOpenId, {
        name: guestName,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, redirect);
    } catch (error) {
      console.error("[Auth] Anonymous login failed", error);
      res.status(500).json({ error: "Anonymous login failed" });
    }
  });

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // 301 Redirects from old domain (wilborassist-ljucsyxh.manus.space) to new domain (www.wilbor-assist.com)
  // This preserves SEO ranking and prevents duplicate content penalties
  const redirectMappings: Record<string, string> = {
    '/': '/',
    '/blog': '/blog',
    '/dashboard': '/dashboard',
    '/buy-credits': '/buy-credits',
    '/blog/bebe-nao-dorme': '/blog/bebe-nao-dorme',
    '/blog/colica-do-bebe': '/blog/colica-do-bebe',
    '/blog/febre-no-bebe': '/blog/febre-no-bebe',
    '/blog/introducao-alimentar': '/blog/introducao-alimentar',
    '/blog/depressao-pos-parto': '/blog/depressao-pos-parto',
    '/blog/vacinas-do-bebe': '/blog/vacinas-do-bebe',
    '/blog/amamentacao-pega-correta': '/blog/amamentacao-pega-correta',
    '/blog/seguranca-bebe-em-casa': '/blog/seguranca-bebe-em-casa',
    '/blog/saltos-de-desenvolvimento': '/blog/saltos-de-desenvolvimento',
    '/blog/banho-do-recem-nascido': '/blog/banho-do-recem-nascido',
  };

  // Middleware to handle 301 redirects (only when coming from old domain)
  app.use((req, res, next) => {
    const host = req.hostname || '';
    const path = req.path;
    // Only redirect if coming from old Manus domain, not from health checks or direct access
    if (host === 'wilborassist-ljucsyxh.manus.space' && redirectMappings[path]) {
      const newUrl = `https://www.wilbor-assist.com${redirectMappings[path]}`;
      res.redirect(301, newUrl);
      return;
    }
    next();
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Secret route to seed milestones (using COMPLETE milestones from milestonesData.ts)
  app.get("/api/seed-milestones-secret", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }
      // Use COMPLETE milestones (34 milestones, 0-24 months)
      await db.insert(wilborMilestoneContent).values(COMPLETE_MILESTONES as any);
      res.json({ success: true, message: `Successfully inserted ${COMPLETE_MILESTONES.length} milestones!` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


  // Sitemap and robots routes
  app.use(sitemapRouter);
  app.use(robotsRouter);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = ENV.isProduction
    ? preferredPort
    : await findAvailablePort(preferredPort);

  if (!ENV.isProduction && port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Listen on 0.0.0.0 to accept connections from all network interfaces
  // This is required for Koyeb and other cloud platforms
  server.listen(port, "0.0.0.0", async () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
    
    // Auto-seed milestones on startup
    try {
      const databaseReachable = await isStartupDatabaseReachable();
      if (!databaseReachable) {
        console.log("[Seed] Auto-seed de milestones ignorado neste startup porque o banco não respondeu.");
        return;
      }

      const db = await getDb();
      
      if (db) {
        // Check if milestones already exist to avoid duplicates
        const existing = await db.select().from(wilborMilestoneContent).limit(1);
        if (existing.length === 0) {
          console.log("🌱 Auto-seeding COMPLETE milestones on startup (34 milestones, 0-24 months)...");
          // Use COMPLETE milestones from milestonesData.ts
          await db.insert(wilborMilestoneContent).values(COMPLETE_MILESTONES as any);
          console.log(`✅ Successfully auto-seeded ${COMPLETE_MILESTONES.length} milestones!`);
        } else {
          console.log("✅ Milestones already exist, skipping auto-seed.");
        }
      }
    } catch (error: any) {
      // Tabela pode não existir ainda se db:push não foi rodado — não é crítico
      const msg = error?.message ?? String(error);
      if (msg.includes("Connection lost") || msg.includes("server closed the connection")) {
        console.log("[Seed] Auto-seed de milestones ignorado porque o banco encerrou a conexão no startup.");
      } else if (msg.includes("doesn't exist") || msg.includes("Table") || msg.includes("Failed query")) {
        console.log("[Seed] Tabela wilborMilestoneContent ainda não está disponível; auto-seed opcional foi ignorado.");
      } else {
        console.error("❌ Error auto-seeding milestones:", msg);
      }
    }
  });
}


startServer().catch(console.error);
