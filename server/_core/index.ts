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
  
  // Secret route to seed milestones (temporary)
  app.get("/api/seed-milestones-secret", async (req, res) => {
    try {
      const { getDb } = await import("./db");
      const { wilborMilestoneContent } = await import("../../drizzle/schema");
      const db = await getDb();
      
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }
      
      const milestones = [
        { month: 0, category: "motor", titlePt: "Reflexo de preensão", descriptionPt: "O bebê recém-nascido fecha a mão com força ao sentir algo na palma, um reflexo inato que demonstra saúde neurológica.", titleEn: "Grasping reflex", descriptionEn: "The newborn baby tightly closes their hand when something touches their palm, an innate reflex showing neurological health.", titleEs: "Reflejo de prensión", descriptionEs: "El bebé recién nacido cierra la mano con fuerza al sentir algo en la palma, un reflejo innato que demonstra salud neurológica.", order: 1, isActive: "true" },
        { month: 1, category: "social", titlePt: "Sorriso Social", descriptionPt: "O bebê começa a sorrir em resposta a estímulos externos, especialmente o rosto e a voz dos pais.", titleEn: "Social Smile", descriptionEn: "The baby begins to smile in response to external stimuli, especially the face and voice of the parents.", titleEs: "Sonrisa Social", descriptionEs: "El bebé comienza a sonreír en respuesta a estímulos externos, especialmente el rostro y la voz de los padres.", order: 1, isActive: "true" },
        { month: 4, category: "motor", titlePt: "Rolar de bruços para as costas", descriptionPt: "O bebê ganha força cervical e abdominal suficiente para girar o corpo voluntariamente.", titleEn: "Rolling from tummy to back", descriptionEn: "The baby gains enough cervical and abdominal strength to voluntarily rotate their body.", titleEs: "Rodar de boca abajo a boca arriba", descriptionEs: "El bebé gana suficiente fuerza cervical y abdominal para girar el cuerpo voluntariamente.", order: 1, isActive: "true" },
        { month: 6, category: "cognitivo", titlePt: "Curiosidade sobre o ambiente", descriptionPt: "O bebê tenta alcançar objetos fora do seu alcance e demonstra interesse ativo em explorar texturas.", titleEn: "Curiosity about the environment", descriptionEn: "The baby tries to reach for objects out of reach and shows active interest in exploring textures.", titleEs: "Curiosidad sobre el entorno", descriptionEs: "El bebé intenta alcanzar objetos fuera de su alcance y demuestra interés activo en explorar texturas.", order: 1, isActive: "true" },
        { month: 9, category: "linguagem", titlePt: "Balbucio polissilábico", descriptionPt: "O bebê combina sons como 'ba-ba', 'da-da' e 'ma-ma' sem necessariamente atribuir significado ainda.", titleEn: "Polysyllabic babbling", descriptionEn: "The baby combines sounds like 'ba-ba', 'da-da', and 'ma-ma' without necessarily assigning meaning yet.", titleEs: "Balbuceo polisilábico", descriptionEs: "El bebé combina sonidos como 'ba-ba', 'da-da' y 'ma-ma' sin necesariamente atribuir significado aún.", order: 1, isActive: "true" },
        { month: 12, category: "motor", titlePt: "Primeiros passos independentes", descriptionPt: "Muitos bebês conseguem dar alguns passos sem apoio, demonstrando equilíbrio e controle muscular.", titleEn: "First independent steps", descriptionEn: "Many babies can take a few steps without support, demonstrating balance and muscular control.", titleEs: "Primeros pasos independientes", descriptionEs: "Muchos bebés logran dar algunos pasos sin apoyo, demostrando equilibrio y control muscular.", order: 1, isActive: "true" },
        { month: 15, category: "social", titlePt: "Imitação de tarefas domésticas", descriptionPt: "O bebê tenta imitar ações dos pais, como 'limpar' a mesa ou 'falar' ao telefone.", titleEn: "Imitation of household tasks", descriptionEn: "The baby tries to imitate parents' actions, such as 'wiping' the table or 'talking' on the phone.", titleEs: "Imitación de tareas domésticas", descriptionEs: "El bebé intenta imitar acciones de los padres, como 'limpiar' por teléfono.", order: 1, isActive: "true" },
        { month: 18, category: "linguagem", titlePt: "Vocabulário de 10 a 20 palavras", descriptionPt: "A criança já utiliza palavras isoladas para nomear objetos comuns e expressar desejos.", titleEn: "Vocabulary of 10 to 20 words", descriptionEn: "The child already uses isolated words to name common objects and express desires.", titleEs: "Vocabulario de 10 a 20 palabras", descriptionEs: "El niño ya utiliza palabras aisladas para nombrar objetos comunes y expresar deseos.", order: 1, isActive: "true" },
        { month: 24, category: "cognitivo", titlePt: "Brincadeira Simbólica", descriptionPt: "A criança utiliza objetos para representar outros (ex: um bloco vira um carrinho), demonstrando pensamento abstrato.", titleEn: "Symbolic Play", descriptionEn: "The child uses objects to represent others (e.g., a block becomes a car), demonstrating abstract thinking.", titleEs: "Juego Simbólico", descriptionEs: "El niño utiliza objetos para representar otros (ej: un bloque se convierte en un coche), demostrando pensamiento abstracto.", order: 1, isActive: "true" }
      ];
      
      await db.insert(wilborMilestoneContent).values(milestones as any);
      res.json({ success: true, message: `Successfully inserted ${milestones.length} milestones!` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

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
  server.listen(port, "0.0.0.0", async () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
    
    // Auto-seed milestones on startup
    try {
      const { getDb } = await import("./db");
      const { wilborMilestoneContent } = await import("../../drizzle/schema");
      const db = await getDb();
      
      if (db) {
        // Check if milestones already exist to avoid duplicates
        const existing = await db.select().from(wilborMilestoneContent).limit(1);
        if (existing.length === 0) {
          console.log("🌱 Auto-seeding milestones on startup...");
          const milestones = [
            { month: 0, category: "motor", titlePt: "Reflexo de preensão", descriptionPt: "O bebê recém-nascido fecha a mão com força ao sentir algo na palma, um reflexo inato que demonstra saúde neurológica.", titleEn: "Grasping reflex", descriptionEn: "The newborn baby tightly closes their hand when something touches their palm, an innate reflex showing neurological health.", titleEs: "Reflejo de prensión", descriptionEs: "El bebé recién nacido cierra la mano con fuerza al sentir algo en la palma, un reflejo innato que demonstra salud neurológica.", order: 1, isActive: "true" },
            { month: 1, category: "social", titlePt: "Sorriso Social", descriptionPt: "O bebê começa a sorrir em resposta a estímulos externos, especialmente o rosto e a voz dos pais.", titleEn: "Social Smile", descriptionEn: "The baby begins to smile in response to external stimuli, especially the face and voice of the parents.", titleEs: "Sonrisa Social", descriptionEs: "El bebé comienza a sonreír en respuesta a estímulos externos, especialmente el rostro y la voz de los padres.", order: 1, isActive: "true" },
            { month: 4, category: "motor", titlePt: "Rolar de bruços para as costas", descriptionPt: "O bebê ganha força cervical e abdominal suficiente para girar o corpo voluntariamente.", titleEn: "Rolling from tummy to back", descriptionEn: "The baby gains enough cervical and abdominal strength to voluntarily rotate their body.", titleEs: "Rodar de boca abajo a boca arriba", descriptionEs: "El bebé gana suficiente fuerza cervical y abdominal para girar el cuerpo voluntariamente.", order: 1, isActive: "true" },
            { month: 6, category: "cognitivo", titlePt: "Curiosidade sobre o ambiente", descriptionPt: "O bebê tenta alcançar objetos fora do seu alcance e demonstra interesse ativo em explorar texturas.", titleEn: "Curiosity about the environment", descriptionEn: "The baby tries to reach for objects out of reach and shows active interest in exploring textures.", titleEs: "Curiosidad sobre el entorno", descriptionEs: "El bebé intenta alcanzar objetos fuera de su alcance y demuestra interés activo en explorar texturas.", order: 1, isActive: "true" },
            { month: 9, category: "linguagem", titlePt: "Balbucio polissilábico", descriptionPt: "O bebê combina sons como 'ba-ba', 'da-da' e 'ma-ma' sem necessariamente atribuir significado ainda.", titleEn: "Polysyllabic babbling", descriptionEn: "The baby combines sounds like 'ba-ba', 'da-da', and 'ma-ma' without necessarily assigning meaning yet.", titleEs: "Balbuceo polisilábico", descriptionEs: "El bebé combina sonidos como 'ba-ba', 'da-da' y 'ma-ma' sin necesariamente atribuir significado aún.", order: 1, isActive: "true" },
            { month: 12, category: "motor", titlePt: "Primeiros passos independentes", descriptionPt: "Muitos bebês conseguem dar alguns passos sem apoio, demonstrando equilíbrio e controle muscular.", titleEn: "First independent steps", descriptionEn: "Many babies can take a few steps without support, demonstrating balance and muscular control.", titleEs: "Primeros pasos independientes", descriptionEs: "Muchos bebés logran dar algunos bebés logran dar algunos pasos sin apoyo, demostrando equilibrio y control muscular.", order: 1, isActive: "true" },
            { month: 15, category: "social", titlePt: "Imitação de tarefas domésticas", descriptionPt: "O bebê tenta imitar ações dos pais, como 'limpar' a mesa ou 'falar' ao telefone.", titleEn: "Imitation of household tasks", descriptionEn: "The baby tries to imitate parents' actions, such as 'wiping' the table or 'talking' on the phone.", titleEs: "Imitación de tareas domésticas", descriptionEs: "El bebé intenta imitar acciones de los padres, como 'limpiar' por teléfono.", order: 1, isActive: "true" },
            { month: 18, category: "linguagem", titlePt: "Vocabulário de 10 a 20 palavras", descriptionPt: "A criança já utiliza palavras isoladas para nomear objetos comuns e expressar desejos.", titleEn: "Vocabulary of 10 to 20 words", descriptionEn: "The child already uses isolated words to name common objects and express desires.", titleEs: "Vocabulario de 10 a 20 palabras", descriptionEs: "El niño ya utiliza palabras aisladas para nombrar objetos comunes y expresar deseos.", order: 1, isActive: "true" },
            { month: 24, category: "cognitivo", titlePt: "Brincadeira Simbólica", descriptionPt: "A criança utiliza objetos para representar outros (ex: um bloco vira um carrinho), demonstrando pensamento abstrato.", titleEn: "Symbolic Play", descriptionEn: "The child uses objects to represent others (e.g., a block becomes a car), demonstrating abstract thinking.", titleEs: "Juego Simbólico", descriptionEs: "El niño utiliza objetos para representar otros (ej: un bloque se convierte en un coche), demostrando pensamiento abstracto.", order: 1, isActive: "true" }
          ];
          await db.insert(wilborMilestoneContent).values(milestones as any);
          console.log(`✅ Successfully auto-seeded ${milestones.length} milestones!`);
        } else {
          console.log("✅ Milestones already exist, skipping auto-seed.");
        }
      }
    } catch (error) {
      console.error("❌ Error auto-seeding milestones:", error);
    }
  });
}

startServer().catch(console.error);
