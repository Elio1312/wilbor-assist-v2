import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { setupGoogleOAuth } from "./googleOAuth";
import { ENV } from "./env";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeRoutes } from "../stripeWebhook";
import sitemapRouter from "../routes/sitemap";

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
  setupGoogleOAuth();

  // Google OAuth Routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=google_failed" }),
    (req, res) => {
      res.redirect("/chat");
    }
  );
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
  
  // Sitemap routes
  app.use(sitemapRouter);
  
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
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Listen on 0.0.0.0 to accept connections from all network interfaces
  // This is required for Koyeb and other cloud platforms
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
