import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { wilborUsers, wilborBabies, wilborRecipes, wilborDevMilestones, wilborUserCredits, InsertWilborUser, InsertWilborBaby } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getOrCreateConversation, generateWilborResponse, detectEmergency } from "./wilborChat";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  // Wilbor-Assist routers
  wilbor: router({
    // User management
    getOrCreateUser: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        language: z.enum(["pt", "en", "es"]).default("pt"),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const existing = await db
          .select()
          .from(wilborUsers)
          .where(eq(wilborUsers.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          return existing[0];
        }

        await db.insert(wilborUsers).values({
          email: input.email,
          name: input.name,
          language: input.language,
        });

        const created = await db
          .select()
          .from(wilborUsers)
          .where(eq(wilborUsers.email, input.email))
          .limit(1);

        return created[0] || null;
      }),

    // Baby management
    createBaby: publicProcedure
      .input(z.object({
        userId: z.number(),
        name: z.string(),
        birthDate: z.date().optional(),
        sex: z.enum(["male", "female", "unknown"]).optional(),
        weightGrams: z.number().optional(),
        gestationalWeeks: z.number().optional(),
        syndromes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(wilborBabies).values({
          userId: input.userId,
          name: input.name,
          birthDate: input.birthDate,
          sex: input.sex || "unknown",
          weightGrams: input.weightGrams,
          gestationalWeeks: input.gestationalWeeks,
          syndromes: input.syndromes,
        });

        const created = await db
          .select()
          .from(wilborBabies)
          .where(eq(wilborBabies.userId, input.userId))
          .limit(1);

        return created[0];
      }),

    getBabies: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const babies = await db
          .select()
          .from(wilborBabies)
          .where(eq(wilborBabies.userId, input.userId));
        
        return babies || [];
      }),

    // Chat
    sendMessage: publicProcedure
      .input(z.object({
        userId: z.number(),
        babyId: z.number().nullable(),
        message: z.string(),
        category: z.enum(["sono", "colica", "salto", "alimentacao", "seguranca", "sos", "geral"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check for emergency
        const user = await db
          .select()
          .from(wilborUsers)
          .where(eq(wilborUsers.id, input.userId))
          .limit(1);

        if (user.length === 0) throw new Error("User not found");
        const language = user[0].language as "pt" | "en" | "es";

        const isEmergency = detectEmergency(input.message, language);
        if (isEmergency) {
          return {
            emergency: true,
            message: language === "pt" 
              ? "Por segurança, procure atendimento médico imediatamente!"
              : language === "en"
              ? "For safety, seek medical attention immediately!"
              : "¡Por seguridad, busca atención médica inmediatamente!",
          };
        }

        // Get or create conversation
        const conversation = await getOrCreateConversation(
          input.userId,
          input.babyId,
          input.category
        );

        // Generate response
        const response = await generateWilborResponse(
          conversation.id,
          input.userId,
          input.babyId,
          input.message,
          input.category
        );

        return {
          emergency: false,
          message: response,
          conversationId: conversation.id,
        };
      }),

    // Recipes
    getRecipes: publicProcedure
      .input(z.object({ ageMin: z.number().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        if (input.ageMin) {
          return await db
            .select()
            .from(wilborRecipes)
            .where(eq(wilborRecipes.ageMin, input.ageMin));
        }
        return await db.select().from(wilborRecipes);
      }),

    // Development milestones
    getMilestones: publicProcedure
      .input(z.object({ userId: z.number(), babyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        return await db
          .select()
          .from(wilborDevMilestones)
          .where(eq(wilborDevMilestones.userId, input.userId));
      }),
  }),
});

export type AppRouter = typeof appRouter;
