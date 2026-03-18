import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, upsertUser, getUserByOpenId } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborResponseFeedback } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { blogArticlesData } from "./blogArticles";

export const appRouter = router({
  system: systemRouter,
  
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
