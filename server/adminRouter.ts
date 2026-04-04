import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { wilborUsers, wilborPurchases, wilborEbooks, wilborUserCredits } from "../drizzle/schema";
import { eq, gte, sql, desc } from "drizzle-orm";

export const adminRouter = router({
  /**
   * getBusinessMetrics: O Painel do CEO (ROI 100k/dia)
   */
  getBusinessMetrics: protectedProcedure.query(async ({ ctx }) => {
    // 1. Veto Técnico de Segurança: Apenas o Elio (Admin) acessa estes dados
    // Nota: Substitua pelo seu e-mail real para travar o acesso
    const adminEmails = ["elio@wilbor.com", "admin@wilbor.com"]; 
    if (!adminEmails.includes(ctx.user.email || "")) {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Total de Usuários Ativos (Escalabilidade)
    const activeUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(wilborUsers)
      .where(gte(wilborUsers.lastActiveAt, thirtyDaysAgo));

    // 3. Taxa de Conversão (Grátis -> Premium)
    const premiumCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.plan, "premium"));

    const totalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(wilborUsers);

    const conversionRate = totalUsers[0].count > 0 
      ? (premiumCount[0].count / totalUsers[0].count) * 100 
      : 0;

    // 4. Receita Total Convertida (BRL + USD/EUR)
    const revenue = await db
      .select({
        totalBrl: sql<number>`sum(case when currency = 'BRL' then amount else 0 end)`,
        totalUsd: sql<number>`sum(case when currency = 'USD' then amount else 0 end)`,
        totalEur: sql<number>`sum(case when currency = 'EUR' then amount else 0 end)`,
      })
      .from(wilborPurchases)
      .where(eq(wilborPurchases.status, "completed"));

    // 5. Top 3 E-books mais vendidos (Renda Rápida)
    const topEbooks = await db
      .select({
        ebookId: wilborPurchases.ebookId,
        salesCount: sql<number>`count(*)`,
      })
      .from(wilborPurchases)
      .where(eq(wilborPurchases.status, "completed"))
      .groupBy(wilborPurchases.ebookId)
      .orderBy(desc(sql`count(*)`))
      .limit(3);

    return {
      activeUsers: activeUsers[0].count,
      conversionRate: conversionRate.toFixed(2) + "%",
      revenue: {
        brl: (revenue[0].totalBrl || 0) / 100,
        usd: (revenue[0].totalUsd || 0) / 100,
        eur: (revenue[0].totalEur || 0) / 100,
      },
      topEbooks,
    };
  }),
});
