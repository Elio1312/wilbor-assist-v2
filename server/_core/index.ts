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

// ─── URL canônica SEM www — usada em todos os redirects e logs ───────────────
const CANONICAL_URL = "https://wilbor-assist.com";

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
  await runPendingMigrations();

  const app = express();
  const server = createServer(app);

  // Stripe webhook ANTES do express.json() — obrigatório
  registerStripeRoutes(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser(ENV.sessionSecret));

  app.use(
    session({
      secret: ENV.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: ENV.isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // ─── CORREÇÃO 1: Redirect 301 www → sem-www ────────────────────────────────
  // Qualquer acesso a www.wilbor-assist.com é redirecionado permanentemente
  // para wilbor-assist.com, preservando o path e query string completos.
  // Isso resolve os 12 "Erros de redirecionamento" no Google Search Console.
  app.use((req, res, next) => {
    if (req.hostname && req.hostname.startsWith("www.")) {
      const newHost = req.hostname.slice(4); // remove "www."
      const redirectUrl = `https://${newHost}${req.originalUrl}`;
      console.log(`[www→canonical] 301 ${req.hostname}${req.originalUrl} → ${redirectUrl}`);
      return res.redirect(301, redirectUrl);
    }
    next();
  });

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

  // ─── CORREÇÃO 2: Redirect domínio antigo → canônico SEM www ────────────────
  // Corrigido: apontava para https://www.wilbor-assist.com (com www)
  // Agora aponta para https://wilbor-assist.com (sem www) — URL canônica
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

  app.use((req, res, next) => {
    const host = req.hostname || '';
    const path = req.path;
    if (host === 'wilborassist-ljucsyxh.manus.space' && redirectMappings[path]) {
      // CORREÇÃO: era https://www.wilbor-assist.com — agora usa CANONICAL_URL (sem www)
      const newUrl = `${CANONICAL_URL}${redirectMappings[path]}`;
      res.redirect(301, newUrl);
      return;
    }
    next();
  });

  registerOAuthRoutes(app);

  app.get("/api/seed-milestones-secret", async (req, res) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }
      await db.insert(wilborMilestoneContent).values(COMPLETE_MILESTONES as any);
      res.json({ success: true, message: `Successfully inserted ${COMPLETE_MILESTONES.length} milestones!` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.use(sitemapRouter);
  app.use(robotsRouter);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

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

  server.listen(port, "0.0.0.0", async () => {
    console.log(`Server running on ${CANONICAL_URL} (port ${port})`);

    try {
      const databaseReachable = await isStartupDatabaseReachable();
      if (!databaseReachable) {
        console.log("[Seed] Auto-seed ignorado — banco não respondeu no startup.");
        return;
      }

      const db = await getDb();
      if (db) {
        const existing = await db.select().from(wilborMilestoneContent).limit(1);
        if (existing.length === 0) {
          console.log("🌱 Auto-seeding milestones (34 marcos, 0-24 meses)...");
          await db.insert(wilborMilestoneContent).values(COMPLETE_MILESTONES as any);
          console.log(`✅ ${COMPLETE_MILESTONES.length} milestones inseridos.`);
        } else {
          console.log("✅ Milestones já existem, seed ignorado.");
        }
      }
    } catch (error: any) {
      const msg = error?.message ?? String(error);
      if (msg.includes("Connection lost") || msg.includes("server closed the connection")) {
        console.log("[Seed] Banco encerrou a conexão no startup — seed ignorado.");
      } else if (msg.includes("doesn't exist") || msg.includes("Table") || msg.includes("Failed query")) {
        console.log("[Seed] Tabela wilborMilestoneContent ainda não disponível — seed ignorado.");
      } else {
        console.error("❌ Erro no auto-seed de milestones:", msg);
      }
    }
  });
}

startServer().catch(err => {
  console.error("❌ Falha crítica ao iniciar o servidor:", err);
  process.exit(1);
});
