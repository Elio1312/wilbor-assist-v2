import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, upsertUser, getUserByOpenId } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborResponseFeedback } from "../drizzle/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { wilborMessages } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { blogArticlesData } from "./blogArticles";
import { sanitizeChatMessages, simpleChatWithWilbor } from "./wilborChat";
import { getAnonymousUsage, incrementAnonymousUsage, checkAnonymousLimit } from "./wilborDb";
import { stripeRouter } from "./stripeRoutes";
import { stripeMultiCurrencyRouter } from "./stripeMultiCurrency";
import { whatsappRouter } from "./whatsappIntegration";
import { instagramRouter } from "./instagramIntegration";
import { shopRouter } from "./shopRoutes";
import { adminRouter } from "./adminRouter";
import { recipesRouter } from "./recipesRouter";
import { detectEbookIntent, buildEbookOffer } from "./ebookOfferDetector";

// ─── CORREÇÃO 1: Limite gratuito centralizado ────────────────────────────────
// Altere aqui para mudar o número de consultas gratuitas globalmente.
const FREE_CHAT_LIMIT = 2;          // Plano free: 2 consultas gratuitas
const PREMIUM_MONTHLY_LIMIT = 500;  // Plano premium: 500 mensagens/mês

// ─── CORREÇÃO 2: Rate limiting por IP para prevenir abuso ────────────────────
// Memória em processo — redefine com cada deploy (suficiente para frear bots).
// Para persistência, substitua por Redis.
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT_PER_MINUTE = 15; // máx 15 requisições/minuto por IP

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true; // permitido
  }
  if (entry.count >= IP_RATE_LIMIT_PER_MINUTE) {
    return false; // bloqueado
  }
  entry.count++;
  return true; // permitido
}

export const appRouter = router({
  system: systemRouter,
  stripe: stripeRouter,
  currency: stripeMultiCurrencyRouter,
  whatsapp: whatsappRouter,
  instagram: instagramRouter,
  shop: shopRouter,
  admin: adminRouter,
  recipes: recipesRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  wilbor: router({
    getCredits: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const credits = await db
        .select()
        .from(wilborUserCredits)
        .where(eq(wilborUserCredits.userId, ctx.user.id))
        .limit(1);

      if (credits.length === 0) {
        const periodStart = new Date();
        const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
        await db.insert(wilborUserCredits).values({
          userId: ctx.user.id,
          plan: "free",
          monthlyLimit: FREE_CHAT_LIMIT,
          messagesUsed: 0,
          ragMessagesUsed: 0,
          cacheHits: 0,
          totalSaved: 0,
          periodStart,
          periodEnd,
        });
        return {
          plan: "free",
          messagesUsed: 0,
          monthlyLimit: FREE_CHAT_LIMIT,
          remaining: FREE_CHAT_LIMIT,
          isOverLimit: false,
        };
      }

      const credit = credits[0];
      const remaining = Math.max(0, credit.monthlyLimit - credit.messagesUsed);
      return {
        plan: credit.plan,
        messagesUsed: credit.messagesUsed,
        monthlyLimit: credit.monthlyLimit,
        remaining,
        isOverLimit: remaining === 0,
      };
    }),

    updatePlan: protectedProcedure
      .input(z.object({ plan: z.enum(["free", "premium", "manual"]) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const newLimit = input.plan === "free" ? FREE_CHAT_LIMIT : PREMIUM_MONTHLY_LIMIT;
        const periodStart = new Date();
        const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

        await db
          .update(wilborUserCredits)
          .set({ plan: input.plan, monthlyLimit: newLimit, messagesUsed: 0, periodStart, periodEnd })
          .where(eq(wilborUserCredits.userId, ctx.user.id));

        await db.insert(wilborConversionEvents).values({
          userId: ctx.user.id,
          eventType: "payment_success",
        });

        return { success: true, plan: input.plan };
      }),

    getBabies: protectedProcedure.query(async ({ ctx }) => {
      const { getBabiesByUser } = await import("./wilborDb");
      return await getBabiesByUser(ctx.user.id);
    }),

    trackEvent: protectedProcedure
      .input(z.object({
        eventType: z.enum(["hit_limit", "paywall_shown", "upgrade_clicked", "plans_clicked", "checkout_started", "payment_success", "payment_failed"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        await db.insert(wilborConversionEvents).values({
          userId: ctx.user.id,
          eventType: input.eventType,
        });
        return { success: true };
      }),

    getStatus: publicProcedure.query(async () => {
      return {
        status: "Wilbor-Assist v2 is ready!",
        version: "2.0.0",
        features: ["Chat IA", "Bebês", "Receitas", "Trilha", "Meu Corpo", "Sono", "Diário"]
      };
    }),

    getAnonymousCredits: publicProcedure
      .input(z.object({ fingerprint: z.string() }))
      .query(async ({ input }) => {
        // ─── CORREÇÃO 3: Validação de fingerprint ────────────────────────────
        if (!input.fingerprint || input.fingerprint.length < 8) {
          return { used: 0, limit: FREE_CHAT_LIMIT, remaining: FREE_CHAT_LIMIT, isOverLimit: false };
        }
        const usage = await getAnonymousUsage(input.fingerprint);
        const used = usage?.messagesUsed ?? 0;
        return {
          used,
          limit: FREE_CHAT_LIMIT,
          remaining: Math.max(0, FREE_CHAT_LIMIT - used),
          isOverLimit: used >= FREE_CHAT_LIMIT,
        };
      }),

    // ─── CHAT — Principal endpoint com todas as correções ────────────────────
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          // CORREÇÃO 4: Limita tamanho de cada mensagem (previne prompt injection / abuso)
          content: z.string().max(4000),
        })).max(50), // máx 50 mensagens por chamada
        fingerprint: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {

        // ─── CORREÇÃO 5: Rate limiting por IP ────────────────────────────────
        const clientIp = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()
          ?? ctx.req.socket.remoteAddress
          ?? "unknown";
        if (!checkIpRateLimit(clientIp)) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        const sanitizedMessages = sanitizeChatMessages(input.messages);
        const lastUserMsg = [...sanitizedMessages].reverse().find((m) => m.role === "user");

        if (!lastUserMsg) {
          throw new Error("EMPTY_CHAT_MESSAGES");
        }

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        let userId: string | number;

        if (ctx.user?.id) {
          // ─── USUÁRIO AUTENTICADO ──────────────────────────────────────────
          userId = ctx.user.id;
          const credits = await db
            .select()
            .from(wilborUserCredits)
            .where(eq(wilborUserCredits.userId, ctx.user.id))
            .limit(1);

          if (credits.length === 0) {
            // Primeiro acesso: cria registro com FREE_CHAT_LIMIT
            const periodStart = new Date();
            const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
            await db.insert(wilborUserCredits).values({
              userId: ctx.user.id,
              plan: "free",
              monthlyLimit: FREE_CHAT_LIMIT,
              messagesUsed: 1,
              ragMessagesUsed: 0,
              cacheHits: 0,
              totalSaved: 0,
              periodStart,
              periodEnd,
            });
          } else {
            const credit = credits[0];
            if (credit.messagesUsed >= credit.monthlyLimit) {
              // ─── CORREÇÃO 6: Registra evento de paywall sem silenciar erro ─
              try {
                await db.insert(wilborConversionEvents).values({
                  userId: ctx.user.id,
                  eventType: "hit_limit",
                });
              } catch (dbErr) {
                console.error("[wilbor.chat] Erro ao registrar hit_limit:", dbErr);
              }
              throw new Error("CREDIT_LIMIT_REACHED");
            }

            // Dedução atômica — previne race condition (double-spend)
            const updateResult = await db
              .update(wilborUserCredits)
              .set({ messagesUsed: sql`${wilborUserCredits.messagesUsed} + 1` })
              .where(
                and(
                  eq(wilborUserCredits.userId, ctx.user.id),
                  gt(wilborUserCredits.monthlyLimit, wilborUserCredits.messagesUsed)
                )
              );

            if ((updateResult as any)[0]?.affectedRows === 0) {
              throw new Error("CREDIT_LIMIT_REACHED");
            }
          }
        } else {
          // ─── USUÁRIO ANÔNIMO ──────────────────────────────────────────────
          if (!input.fingerprint || input.fingerprint.length < 8) {
            throw new Error("FINGERPRINT_REQUIRED");
          }

          const canChat = await checkAnonymousLimit(input.fingerprint);
          if (!canChat) {
            throw new Error("ANONYMOUS_LIMIT_REACHED");
          }

          await incrementAnonymousUsage(input.fingerprint);
          userId = `anon-${input.fingerprint}`;
        }

        // ─── Chama a IA ──────────────────────────────────────────────────────
        const response = await simpleChatWithWilbor(String(userId), sanitizedMessages);

        // ─── Persiste mensagem para feedback ─────────────────────────────────
        let aiMessageId: number | null = null;
        if (ctx.user?.id && response?.content) {
          try {
            const [insertedMsg] = await db.insert(wilborMessages).values({
              conversationId: 0,
              userId: ctx.user.id,
              role: "assistant",
              content: typeof response.content === "string"
                ? response.content
                : JSON.stringify(response.content),
            });
            aiMessageId = (insertedMsg as any)?.insertId ?? null;
          } catch (insertErr) {
            // CORREÇÃO 7: Loga erros que antes eram silenciados
            console.error("[wilbor.chat] Erro ao salvar mensagem IA:", insertErr);
          }
        }

        // ─── Oferta contextual de ebook ──────────────────────────────────────
        const systemMsg = sanitizedMessages.find(m => m.role === "system");
        const langMatch = systemMsg?.content?.match(/idioma[:\s]+([a-z]{2})/i)
          ?? systemMsg?.content?.match(/language[:\s]+([a-z]{2})/i);
        const detectedLang = langMatch?.[1] ?? "pt";

        const intent = detectEbookIntent(lastUserMsg.content, detectedLang);
        let ebookOffer = null;

        if (intent && ctx.user?.id) {
          try {
            const { wilborEbookPurchases } = await import("../drizzle/schema");
            const { eq: eqOp, and: andOp } = await import("drizzle-orm");
            const ebookIdForLang = `${intent}-${detectedLang}`;
            const existing = await db.select()
              .from(wilborEbookPurchases)
              .where(andOp(
                eqOp(wilborEbookPurchases.userId, ctx.user.id),
                eqOp(wilborEbookPurchases.ebookId, ebookIdForLang)
              ))
              .limit(1);
            if (existing.length === 0) {
              ebookOffer = buildEbookOffer(intent, detectedLang);
            }
          } catch (ebookErr) {
            // CORREÇÃO 7: Nunca silencia erros sem log
            console.error("[wilbor.chat] Erro ao verificar ebook purchase:", ebookErr);
          }
        } else if (intent && !ctx.user?.id) {
          ebookOffer = buildEbookOffer(intent, detectedLang);
        }

        return { ...response, messageId: aiMessageId, ebookOffer };
      }),

    submitFeedback: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db
          .update(wilborMessages)
          .set({ feedbackRating: input.rating })
          .where(eq(wilborMessages.id, input.messageId));

        if (input.rating <= 2) {
          try {
            const { notifyOwner } = await import("./_core/notification");
            await notifyOwner({
              title: `⚠️ Wilbor: Resposta com Nota Baixa (${input.rating}/5)`,
              content: `Uma mãe avaliou uma resposta do Wilbor com ${input.rating} estrela(s). Verifique o painel de feedback.`,
            });
          } catch (notifyErr) {
            console.error("[wilbor.submitFeedback] Erro ao notificar owner:", notifyErr);
          }
        }

        return { success: true };
      }),

    getQualityStats: protectedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const stats = await db
        .select({
          avgRating: sql<number>`AVG(${wilborMessages.feedbackRating})`,
          totalRated: sql<number>`COUNT(CASE WHEN ${wilborMessages.feedbackRating} IS NOT NULL THEN 1 END)`,
          totalMessages: sql<number>`COUNT(*)`,
          lowRatings: sql<number>`COUNT(CASE WHEN ${wilborMessages.feedbackRating} <= 2 THEN 1 END)`,
        })
        .from(wilborMessages)
        .where(eq(wilborMessages.role, "assistant"));

      const result = stats[0];
      const avgRating = Number(result?.avgRating ?? 0);
      const alertCEO = avgRating > 0 && avgRating < 4.5;

      return {
        avgRating: avgRating.toFixed(2),
        totalRated: Number(result?.totalRated ?? 0),
        totalMessages: Number(result?.totalMessages ?? 0),
        lowRatings: Number(result?.lowRatings ?? 0),
        assertivityPercent: avgRating > 0 ? ((avgRating / 5) * 100).toFixed(1) : "0",
        alertCEO,
        status: alertCEO ? "🚨 ABAIXO DA META" : "✅ DENTRO DA META",
      };
    }),

    checkExtraCredits: protectedProcedure.query(async ({ ctx }) => {
      const { canUseExtraCredits } = await import("./db");
      return await canUseExtraCredits(ctx.user.id);
    }),

    getUserCreditsStatus: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCreditsStatus } = await import("./db");
      const status = await getUserCreditsStatus(ctx.user.id);
      if (!status) {
        return {
          plan: "free",
          messagesUsed: 0,
          monthlyLimit: FREE_CHAT_LIMIT,
          extraCreditsUsedReais: "0.00",
          extraCreditsLimitReais: "10.00",
          hasHitLimit: false,
          remainingLimit: FREE_CHAT_LIMIT,
        };
      }
      return status;
    }),

    // ==========================================
    // SLEEP TRACKING
    // ==========================================
    startSleep: protectedProcedure
      .input(z.object({ babyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { startSleep } = await import("./wilborDb");
        return await startSleep(ctx.user.id, input.babyId);
      }),

    endSleep: protectedProcedure
      .input(z.object({ sleepLogId: z.number() }))
      .mutation(async ({ input }) => {
        const { endSleep } = await import("./wilborDb");
        return await endSleep(input.sleepLogId);
      }),

    getActiveSleep: protectedProcedure
      .input(z.object({ babyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getActiveSleep } = await import("./wilborDb");
        return await getActiveSleep(ctx.user.id, input.babyId);
      }),

    getRecentSleepLogs: protectedProcedure
      .input(z.object({ babyId: z.number(), limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const { getRecentSleepLogs } = await import("./wilborDb");
        return await getRecentSleepLogs(ctx.user.id, input.babyId, input.limit);
      }),

    updateSleepQuality: protectedProcedure
      .input(z.object({
        sleepLogId: z.number(),
        quality: z.enum(["good", "restless", "bad"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateSleepQuality } = await import("./wilborDb");
        return await updateSleepQuality(input.sleepLogId, input.quality, input.notes);
      }),

    predictNap: protectedProcedure
      .input(z.object({ babyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getBabyById, getRecentSleepLogs, predictNextNap } = await import("./wilborDb");
        const baby = await getBabyById(input.babyId);
        if (!baby?.birthDate) {
          return { suggestedTime: null, confidence: "none" };
        }
        const babyAgeDays = Math.floor(
          (Date.now() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const recentLogs = await getRecentSleepLogs(ctx.user.id, input.babyId, 10);
        return predictNextNap(recentLogs, babyAgeDays);
      }),

    // ==========================================
    // DIARY
    // ==========================================
    createDiaryEntry: publicProcedure
      .input(z.object({
        userId: z.number(),
        babyId: z.number(),
        entryDate: z.string(),
        category: z.enum(["feeding", "sleep", "diaper", "milestone", "health", "mood", "general"]).optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        mood: z.enum(["happy", "calm", "fussy", "crying", "sick"]).optional(),
      }))
      .mutation(async () => {
        return { id: 1, success: true };
      }),

    getDiaryEntries: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number(), limit: z.number().optional() }))
      .query(async () => {
        return [];
      }),

    updateDiaryEntry: publicProcedure
      .input(z.object({
        entryId: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        mood: z.enum(["happy", "calm", "fussy", "crying", "sick"]).optional(),
      }))
      .mutation(async () => {
        return { success: true };
      }),

    deleteDiaryEntry: publicProcedure
      .input(z.object({ entryId: z.number() }))
      .mutation(async () => {
        return { success: true };
      }),
  }),

  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        userQuestion: z.string(),
        aiResponse: z.string(),
        helpfulness: z.enum(["very_helpful", "helpful", "neutral", "not_helpful", "misleading"]),
        conversationId: z.number().optional(),
        kbId: z.number().optional(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        await db.insert(wilborResponseFeedback).values({
          userId: ctx.user.id,
          userQuestion: input.userQuestion,
          aiResponse: input.aiResponse,
          helpfulness: input.helpfulness,
          conversationId: input.conversationId,
          kbId: input.kbId,
          comment: input.comment,
          language: "pt",
        });
        return { success: true };
      }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const feedbacks = await db
        .select()
        .from(wilborResponseFeedback)
        .where(eq(wilborResponseFeedback.userId, ctx.user.id));
      const helpful = feedbacks.filter(f => f.helpfulness === "helpful" || f.helpfulness === "very_helpful").length;
      return {
        total: feedbacks.length,
        helpful,
        notHelpful: feedbacks.filter(f => f.helpfulness === "not_helpful" || f.helpfulness === "misleading").length,
        neutral: feedbacks.filter(f => f.helpfulness === "neutral").length,
        satisfactionRate: feedbacks.length > 0 ? Math.round((helpful / feedbacks.length) * 100) : 0,
      };
    }),
  }),

  blog: router({
    getArticles: publicProcedure.query(async () => {
      return blogArticlesData.map(article => ({
        id: article.slug,
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        readTimeMinutes: article.readTimeMinutes,
        seoKeywords: article.seoKeywords,
      }));
    }),

    getArticle: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = blogArticlesData.find(a => a.slug === input.slug);
        if (!article) throw new Error("Article not found");
        return article;
      }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return blogArticlesData
          .filter(a => a.category === input.category)
          .map(article => ({
            id: article.slug,
            slug: article.slug,
            title: article.title,
            description: article.description,
            readTimeMinutes: article.readTimeMinutes,
          }));
      }),
  }),
});

export type AppRouter = typeof appRouter;
