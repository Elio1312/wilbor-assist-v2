import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, upsertUser, getUserByOpenId } from "./db";

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
    // Placeholder for Wilbor-Assist routes
    // Chat, Bebês, Receitas, Trilha, etc
    getStatus: publicProcedure.query(async () => {
      return {
        status: "Wilbor-Assist v2 is ready!",
        version: "2.0.0",
        features: ["Chat IA", "Bebês", "Receitas", "Trilha", "Meu Corpo", "Sono", "Diário"]
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
