import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, upsertUser, getUserByOpenId } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborResponseFeedback } from "../drizzle/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { wilborMessages } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { blogArticlesData } from "./blogArticles";
import { simpleChatWithWilbor } from "./wilborChat";
import { getAnonymousUsage, incrementAnonymousUsage, checkAnonymousLimit } from "./wilborDb";
import { stripeRouter } from "./stripeRoutes";
import { stripeMultiCurrencyRouter } from "./stripeMultiCurrency";
import { whatsappRouter } from "./whatsappIntegration";
import { instagramRouter } from "./instagramIntegration";

export const appRouter = router({
  system: systemRouter,
  stripe: stripeRouter,
  currency: stripeMultiCurrencyRouter,
  whatsapp: whatsappRouter,
  instagram: instagramRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
          monthlyLimit: 5,
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
          monthlyLimit: 5,
          remaining: 5,
          isOverLimit: false,
        };
      }

      const credit = credits[0];
      const remaining = Math.max(0, credit.monthlyLimit - credit.messagesUsed);
      const isOverLimit = remaining === 0;

      return {
        plan: credit.plan,
        messagesUsed: credit.messagesUsed,
        monthlyLimit: credit.monthlyLimit,
        remaining,
        isOverLimit,
      };
    }),

    updatePlan: protectedProcedure
      .input(z.object({ plan: z.enum(["free", "premium", "manual"]) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const newLimit = input.plan === "free" ? 5 : 500;
        const periodStart = new Date();
        const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

        await db
          .update(wilborUserCredits)
          .set({
            plan: input.plan,
            monthlyLimit: newLimit,
            messagesUsed: 0,
            periodStart,
            periodEnd,
          })
          .where(eq(wilborUserCredits.userId, ctx.user.id));

        await db.insert(wilborConversionEvents).values({
          userId: ctx.user.id,
          eventType: "payment_success",
        });

        return { success: true, plan: input.plan };
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
        const usage = await getAnonymousUsage(input.fingerprint);
        const limit = 5;
        const used = usage?.messagesUsed ?? 0;
        return {
          used,
          limit,
          remaining: Math.max(0, limit - used),
          isOverLimit: used >= limit,
        };
      }),

    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        })),
        fingerprint: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        let userId: string | number;

        if (ctx.user?.id) {
          // Authenticated user logic
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
              monthlyLimit: 5,
              messagesUsed: 1, // First message
              ragMessagesUsed: 0,
              cacheHits: 0,
              totalSaved: 0,
              periodStart,
              periodEnd,
            });
          } else {
            const credit = credits[0];
            if (credit.messagesUsed >= credit.monthlyLimit) {
              await db.insert(wilborConversionEvents).values({
                userId: ctx.user.id,
                eventType: "hit_limit",
              }).catch(() => {});
              throw new Error("CREDIT_LIMIT_REACHED");
            }
            // ⚡ DEDUÇÃO ATÔMICA: Previne race condition (double-spend)
            // Usa SQL atômico para decrementar apenas se messagesUsed < monthlyLimit
            const updateResult = await db
              .update(wilborUserCredits)
              .set({ messagesUsed: sql`${wilborUserCredits.messagesUsed} + 1` })
              .where(
                and(
                  eq(wilborUserCredits.userId, ctx.user.id),
                  gt(wilborUserCredits.monthlyLimit, wilborUserCredits.messagesUsed)
                )
              );
            // Se rowsAffected === 0, os créditos acabaram no microssegundo anterior
            if ((updateResult as any)[0]?.affectedRows === 0) {
              throw new Error("CREDIT_LIMIT_REACHED");
            }
          }
        } else {
          // Anonymous user logic with fingerprint
          if (!input.fingerprint) {
            throw new Error("FINGERPRINT_REQUIRED");
          }
          
          const canChat = await checkAnonymousLimit(input.fingerprint);
          if (!canChat) {
            throw new Error("ANONYMOUS_LIMIT_REACHED");
          }
          
          await incrementAnonymousUsage(input.fingerprint);
          userId = `anon-${input.fingerprint}`;
        }

        const response = await simpleChatWithWilbor(String(userId), input.messages);
        
        // Salvar mensagem da IA no banco para rastreamento de feedback
        let aiMessageId: number | null = null;
        if (ctx.user?.id && response?.content) {
          try {
            const userMsg = input.messages[input.messages.length - 1];
            const [insertedMsg] = await db.insert(wilborMessages).values({
              conversationId: 0, // sem conversa formal
              userId: ctx.user.id,
              role: "assistant",
              content: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
            });
            aiMessageId = (insertedMsg as any)?.insertId ?? null;
          } catch (_) {}
        }
        
        return { ...response, messageId: aiMessageId };
      }),

    // ⭐ FEEDBACK DE QUALIDADE (Termômetro dos 95% de Assertividade)
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
        
        // 🚨 ALARME CEO: Se rating <= 2, notificar imediatamente
        if (input.rating <= 2) {
          try {
            const { notifyOwner } = await import("./_core/notification");
            await notifyOwner({
              title: `⚠️ Wilbor: Resposta com Nota Baixa (${input.rating}/5)`,
              content: `Uma mãe avaliou uma resposta do Wilbor com ${input.rating} estrela(s). Verifique o painel de feedback para revisar a qualidade das respostas.`,
            });
          } catch (_) {}
        }
        
        return { success: true };
      }),

    // 📊 ESTATÍSTICAS DE QUALIDADE (Dashboard CEO)
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
        assertivityPercent: avgRating > 0 ? ((avgRating / 5) * 100).toFixed(1) : '0',
        alertCEO, // true se média < 4.5 estrelas
        status: alertCEO ? '🚨 ABAIXO DA META' : '✅ DENTRO DA META',
      };
    }),

    checkExtraCredits: protectedProcedure.query(async ({ ctx }) => {
      const { canUseExtraCredits } = await import("./db");
      const result = await canUseExtraCredits(ctx.user.id);
      return result;
    }),

    getUserCreditsStatus: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCreditsStatus } = await import("./db");
      const status = await getUserCreditsStatus(ctx.user.id);
      if (!status) {
        return {
          plan: "free",
          messagesUsed: 0,
          monthlyLimit: 5,
          extraCreditsUsedReais: "0.00",
          extraCreditsLimitReais: "10.00",
          hasHitLimit: false,
          remainingLimit: 10,
        };
      }
      return status;
    }),

    // ==========================================
    // SLEEP TRACKING
    // ==========================================
    startSleep: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number() }))
      .mutation(async ({ input }) => {
        return { id: 1, sleepStart: new Date().toISOString() };
      }),

    endSleep: publicProcedure
      .input(z.object({ sleepLogId: z.number() }))
      .mutation(async ({ input }) => {
        return { success: true, durationMinutes: 45 };
      }),

    updateSleepQuality: publicProcedure
      .input(z.object({
        sleepLogId: z.number(),
        quality: z.enum(["good", "restless", "bad"]),
        notes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        return { success: true };
      }),

    getActiveSleep: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number() }))
      .query(async ({ input }) => {
        return null;
      }),

    getSleepLogs: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return [];
      }),

    predictNap: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number() }))
      .query(async ({ input }) => {
        return { suggestedTime: null, confidence: "none" };
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
      .mutation(async ({ input }) => {
        return { id: 1, success: true };
      }),

    getDiaryEntries: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return [];
      }),

    updateDiaryEntry: publicProcedure
      .input(z.object({
        entryId: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        mood: z.enum(["happy", "calm", "fussy", "crying", "sick"]).optional(),
      }))
      .mutation(async ({ input }) => {
        return { success: true };
      }),

    deleteDiaryEntry: publicProcedure
      .input(z.object({ entryId: z.number() }))
      .mutation(async ({ input }) => {
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

      const stats = {
        total: feedbacks.length,
        helpful: feedbacks.filter(f => f.helpfulness === "helpful" || f.helpfulness === "very_helpful").length,
        notHelpful: feedbacks.filter(f => f.helpfulness === "not_helpful" || f.helpfulness === "misleading").length,
        neutral: feedbacks.filter(f => f.helpfulness === "neutral").length,
        satisfactionRate: feedbacks.length > 0 ? Math.round((feedbacks.filter(f => f.helpfulness === "helpful" || f.helpfulness === "very_helpful").length / feedbacks.length) * 100) : 0,
      };

      return stats;
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
