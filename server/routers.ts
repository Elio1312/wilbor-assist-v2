import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, upsertUser, getUserByOpenId } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborResponseFeedback, wilborDiaryEntries, wilborDevMilestones, wilborMilestoneContent } from "../drizzle/schema";
import { eq, and, gt, sql, desc } from "drizzle-orm";
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

// ─── Limites por plano ────────────────────────────────────────────────────────
const FREE_CHAT_LIMIT     = 5;          // Free: 5 msgs/mês
const PREMIUM_MONTHLY_LIMIT = 500;      // Premium mensal: 500 msgs/mês
const ANNUAL_CHAT_LIMIT   = 999999;     // Premium anual: ilimitado (número alto = sem barreira prática)

function getLimitForPlan(plan: "free" | "premium" | "annual"): number {
  if (plan === "annual")  return ANNUAL_CHAT_LIMIT;
  if (plan === "premium") return PREMIUM_MONTHLY_LIMIT;
  return FREE_CHAT_LIMIT;
}

// ─── Rate limiting por IP ─────────────────────────────────────────────────────
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT_PER_MINUTE = 15;

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= IP_RATE_LIMIT_PER_MINUTE) return false;
  entry.count++;
  return true;
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
          isAnnual: false,
        };
      }

      const credit = credits[0];
      const isAnnual = credit.plan === "annual";
      const remaining = isAnnual ? 999999 : Math.max(0, credit.monthlyLimit - credit.messagesUsed);
      return {
        plan: credit.plan,
        messagesUsed: credit.messagesUsed,
        monthlyLimit: credit.monthlyLimit,
        remaining,
        isOverLimit: !isAnnual && remaining === 0,
        isAnnual,
      };
    }),

    // updatePlan REMOVIDO do router público.
    // Upgrade só acontece via webhook Stripe (stripeWebhook.ts).
    // Para admin: adicionar verificação role==="admin" se necessário.

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
        version: "2.1.0",
        features: ["Chat IA", "Bebês", "Receitas", "Trilha", "Meu Corpo", "Sono", "Diário"]
      };
    }),

    getAnonymousCredits: publicProcedure
      .input(z.object({ fingerprint: z.string() }))
      .query(async ({ input }) => {
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

    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string().max(4000),
        })).max(50),
        fingerprint: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {

        const clientIp = ctx.req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()
          ?? ctx.req.socket.remoteAddress
          ?? "unknown";
        if (!checkIpRateLimit(clientIp)) throw new Error("RATE_LIMIT_EXCEEDED");

        const sanitizedMessages = sanitizeChatMessages(input.messages);
        const lastUserMsg = [...sanitizedMessages].reverse().find((m) => m.role === "user");
        if (!lastUserMsg) throw new Error("EMPTY_CHAT_MESSAGES");

        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        let userId: string | number;

        if (ctx.user?.id) {
          userId = ctx.user.id;
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
              messagesUsed: 1,
              ragMessagesUsed: 0,
              cacheHits: 0,
              totalSaved: 0,
              periodStart,
              periodEnd,
            });
          } else {
            const credit = credits[0];
            const isAnnual = credit.plan === "annual";

            // Anual: nunca bloqueia — só incrementa o contador para métricas
            if (!isAnnual) {
              if (credit.messagesUsed >= credit.monthlyLimit) {
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

              // Dedução atômica — previne race condition
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
            } else {
              // Anual: incrementa só para métricas, sem bloquear
              await db
                .update(wilborUserCredits)
                .set({ messagesUsed: sql`${wilborUserCredits.messagesUsed} + 1` })
                .where(eq(wilborUserCredits.userId, ctx.user.id));
            }
          }
        } else {
          if (!input.fingerprint || input.fingerprint.length < 8) throw new Error("FINGERPRINT_REQUIRED");
          const canChat = await checkAnonymousLimit(input.fingerprint);
          if (!canChat) throw new Error("ANONYMOUS_LIMIT_REACHED");
          await incrementAnonymousUsage(input.fingerprint);
          userId = `anon-${input.fingerprint}`;
        }

        const { content: responseText, imageUrl: responseImageUrl } = await simpleChatWithWilbor(String(userId), sanitizedMessages);
        
        // Salvar mensagem da IA no banco para rastreamento de feedback)
        let aiMessageId: number | null = null;
        if (ctx.user?.id && responseText) {
          try {
            const [insertedMsg] = await db.insert(wilborMessages).values({
              conversationId: 0,
              userId: ctx.user.id,
              role: "assistant",
              content: responseText,
            });
            aiMessageId = (insertedMsg as any)?.insertId ?? null;
          } catch (insertErr) {
            console.error("[wilbor.chat] Erro ao salvar mensagem IA:", insertErr);
          }
        }

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
            if (existing.length === 0) ebookOffer = buildEbookOffer(intent, detectedLang);
          } catch (ebookErr) {
            console.error("[wilbor.chat] Erro ao verificar ebook purchase:", ebookErr);
          }
        } else if (intent && !ctx.user?.id) {
          ebookOffer = buildEbookOffer(intent, detectedLang);
        }
        return { content: responseText, messageId: aiMessageId, ebookOffer, imageUrl: responseImageUrl ?? null };
      }),

    submitFeedback: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        await db.update(wilborMessages)
          .set({ feedbackRating: input.rating })
          .where(eq(wilborMessages.id, input.messageId));
        if (input.rating <= 2) {
          try {
            const { notifyOwner } = await import("./_core/notification");
            await notifyOwner({
              title: `⚠️ Wilbor: Resposta com Nota Baixa (${input.rating}/5)`,
              content: `Uma mãe avaliou uma resposta com ${input.rating} estrela(s). Verifique o painel de feedback.`,
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
      const stats = await db.select({
        avgRating: sql<number>`AVG(${wilborMessages.feedbackRating})`,
        totalRated: sql<number>`COUNT(CASE WHEN ${wilborMessages.feedbackRating} IS NOT NULL THEN 1 END)`,
        totalMessages: sql<number>`COUNT(*)`,
        lowRatings: sql<number>`COUNT(CASE WHEN ${wilborMessages.feedbackRating} <= 2 THEN 1 END)`,
      }).from(wilborMessages).where(eq(wilborMessages.role, "assistant"));
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

    // ── SLEEP TRACKING ────────────────────────────────────────────────────────
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
        if (!baby?.birthDate) return { suggestedTime: null, confidence: "none" };
        const babyAgeDays = Math.floor(
          (Date.now() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const recentLogs = await getRecentSleepLogs(ctx.user.id, input.babyId, 10);
        return predictNextNap(recentLogs, babyAgeDays);
      }),

    // ── DIARY (corrigido — salva no banco real) ───────────────────────────────
    createDiaryEntry: protectedProcedure
      .input(z.object({
        babyId: z.number(),
        entryDate: z.string(),
        category: z.enum(["feeding", "sleep", "diaper", "milestone", "health", "mood", "general"]).optional(),
        title: z.string().max(255).optional(),
        content: z.string().max(2000).optional(),
        mood: z.enum(["happy", "calm", "fussy", "crying", "sick"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const [result] = await db.insert(wilborDiaryEntries).values({
          userId: ctx.user.id,
          babyId: input.babyId,
          entryDate: new Date(input.entryDate),
          category: input.category ?? "general",
          title: input.title,
          content: input.content,
          mood: input.mood,
        });
        return { id: (result as any).insertId, success: true };
      }),

    getDiaryEntries: protectedProcedure
      .input(z.object({
        babyId: z.number(),
        limit: z.number().min(1).max(100).default(30),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        return await db
          .select()
          .from(wilborDiaryEntries)
          .where(and(
            eq(wilborDiaryEntries.userId, ctx.user.id),
            eq(wilborDiaryEntries.babyId, input.babyId)
          ))
          .orderBy(desc(wilborDiaryEntries.entryDate))
          .limit(input.limit);
      }),

    updateDiaryEntry: protectedProcedure
      .input(z.object({
        entryId: z.number(),
        title: z.string().max(255).optional(),
        content: z.string().max(2000).optional(),
        mood: z.enum(["happy", "calm", "fussy", "crying", "sick"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        await db.update(wilborDiaryEntries)
          .set({ title: input.title, content: input.content, mood: input.mood })
          .where(and(
            eq(wilborDiaryEntries.id, input.entryId),
            eq(wilborDiaryEntries.userId, ctx.user.id)
          ));
        return { success: true };
      }),

    deleteDiaryEntry: protectedProcedure
      .input(z.object({ entryId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        await db.delete(wilborDiaryEntries)
          .where(and(
            eq(wilborDiaryEntries.id, input.entryId),
            eq(wilborDiaryEntries.userId, ctx.user.id)
          ));
        return { success: true };
      }),

    // ── TRILHA DE DESENVOLVIMENTO (Marcos) ───────────────────────────────────

    // Busca todos os marcos de conteúdo filtrados pelo idioma e mês do bebê
    getMilestoneContent: protectedProcedure
      .input(z.object({
        babyAgeMonths: z.number().min(0).max(24),
        language: z.enum(["pt", "en", "es"]).default("pt"),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Busca marcos do mês atual ±1 para contexto
        const minMonth = Math.max(0, input.babyAgeMonths - 1);
        const maxMonth = Math.min(24, input.babyAgeMonths + 1);

        const content = await db
          .select()
          .from(wilborMilestoneContent)
          .where(
            and(
              sql`${wilborMilestoneContent.month} >= ${minMonth}`,
              sql`${wilborMilestoneContent.month} <= ${maxMonth}`
            )
          )
          .orderBy(wilborMilestoneContent.month, wilborMilestoneContent.order);

        return content.map(m => ({
          id: m.id,
          month: m.month,
          category: m.category,
          title: input.language === "en" ? (m.titleEn ?? m.titlePt)
               : input.language === "es" ? (m.titleEs ?? m.titlePt)
               : m.titlePt,
          description: input.language === "en" ? (m.descriptionEn ?? m.descriptionPt)
                     : input.language === "es" ? (m.descriptionEs ?? m.descriptionPt)
                     : m.descriptionPt,
          order: m.order,
        }));
      }),

    // Busca marcos registrados do bebê (com anotações)
    getBabyMilestones: protectedProcedure
      .input(z.object({ babyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        return await db
          .select()
          .from(wilborDevMilestones)
          .where(and(
            eq(wilborDevMilestones.userId, ctx.user.id),
            eq(wilborDevMilestones.babyId, input.babyId)
          ))
          .orderBy(desc(wilborDevMilestones.achievedAt));
      }),

    // Registra ou atualiza um marco atingido
    saveMilestone: protectedProcedure
      .input(z.object({
        babyId: z.number(),
        contentId: z.number(),
        achieved: z.enum(["yes", "no", "partial"]),
        achievedAt: z.string().optional(),
        notes: z.string().max(500).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verificar se já existe registro para este marco/bebê
        const existing = await db
          .select()
          .from(wilborDevMilestones)
          .where(and(
            eq(wilborDevMilestones.userId, ctx.user.id),
            eq(wilborDevMilestones.babyId, input.babyId),
            eq(wilborDevMilestones.contentId, input.contentId)
          ))
          .limit(1);

        const achievedAt = input.achievedAt ? new Date(input.achievedAt) : new Date();

        if (existing.length > 0) {
          await db.update(wilborDevMilestones)
            .set({
              achieved: input.achieved,
              achievedAt: input.achieved === "yes" ? achievedAt : null,
              notes: input.notes ?? null,
            })
            .where(eq(wilborDevMilestones.id, existing[0].id));
          return { id: existing[0].id, updated: true };
        }

        const [inserted] = await db.insert(wilborDevMilestones).values({
          userId: ctx.user.id,
          babyId: input.babyId,
          contentId: input.contentId,
          achieved: input.achieved,
          achievedAt: input.achieved === "yes" ? achievedAt : null,
          notes: input.notes ?? null,
        });
        return { id: (inserted as any).insertId, updated: false };
      }),

    // Busca timeline completa de marcos atingidos (para visualização de evolução)
    getMilestoneTimeline: protectedProcedure
      .input(z.object({
        babyId: z.number(),
        language: z.enum(["pt", "en", "es"]).default("pt"),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // JOIN: marcos registrados + conteúdo
        const achieved = await db
          .select({
            milestoneId: wilborDevMilestones.id,
            contentId: wilborDevMilestones.contentId,
            achieved: wilborDevMilestones.achieved,
            achievedAt: wilborDevMilestones.achievedAt,
            notes: wilborDevMilestones.notes,
            month: wilborMilestoneContent.month,
            category: wilborMilestoneContent.category,
            titlePt: wilborMilestoneContent.titlePt,
            titleEn: wilborMilestoneContent.titleEn,
            titleEs: wilborMilestoneContent.titleEs,
          })
          .from(wilborDevMilestones)
          .innerJoin(
            wilborMilestoneContent,
            eq(wilborDevMilestones.contentId, wilborMilestoneContent.id)
          )
          .where(and(
            eq(wilborDevMilestones.userId, ctx.user.id),
            eq(wilborDevMilestones.babyId, input.babyId),
            eq(wilborDevMilestones.achieved, "yes")
          ))
          .orderBy(wilborDevMilestones.achievedAt);

        return achieved.map(m => ({
          milestoneId: m.milestoneId,
          contentId: m.contentId,
          achieved: m.achieved,
          achievedAt: m.achievedAt,
          notes: m.notes,
          month: m.month,
          category: m.category,
          title: input.language === "en" ? (m.titleEn ?? m.titlePt)
               : input.language === "es" ? (m.titleEs ?? m.titlePt)
               : m.titlePt,
        }));
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
      const feedbacks = await db.select().from(wilborResponseFeedback)
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
        id: article.slug, slug: article.slug, title: article.title,
        description: article.description, category: article.category,
        readTimeMinutes: article.readTimeMinutes, seoKeywords: article.seoKeywords,
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
            id: article.slug, slug: article.slug, title: article.title,
            description: article.description, readTimeMinutes: article.readTimeMinutes,
          }));
      }),
  }),
});

export type AppRouter = typeof appRouter;
