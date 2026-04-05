import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { wilborUsers, wilborEbookPurchases, wilborEbooks, wilborUserCredits, wilborResponseFeedback } from "../drizzle/schema";
import { analyzeFeedbackTriagem } from "./lib/aiTriagem";
import { sendAdminReport } from "./lib/sendAdminReport";
import { eq, gte, sql, desc, and } from "drizzle-orm";

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
      .from(wilborEbookPurchases)
      .where(eq(wilborEbookPurchases.status, "completed"));

    // 5. Top 3 E-books mais vendidos (Renda Rápida)
    const topEbooks = await db
      .select({
        ebookId: wilborEbookPurchases.ebookId,
        salesCount: sql<number>`count(*)`,
      })
      .from(wilborEbookPurchases)
      .where(eq(wilborEbookPurchases.status, "completed"))
      .groupBy(wilborEbookPurchases.ebookId)
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

  /**
   * getWeeklyVeridicalFeedbacks: Relatório Dominical do CEO
   * Retorna apenas reclamações confirmadas pela IA na última semana
   */
  getWeeklyVeridicalFeedbacks: protectedProcedure.query(async ({ ctx }) => {
    const adminEmails = ["elio@wilbor.com", "admin@wilbor.com"];
    if (!adminEmails.includes(ctx.user.email || "")) {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return await db
      .select()
      .from(wilborResponseFeedback)
      .where(
        and(
          eq(wilborResponseFeedback.aiVerdict, "VERÍDICA"),
          gte(wilborResponseFeedback.createdAt, oneWeekAgo)
        )
      )
      .orderBy(desc(wilborResponseFeedback.createdAt));
  }),

  /**
   * triggerFeedbackTriagem: Aciona a triagem de IA em feedbacks pendentes
   * Pode ser chamado manualmente ou pelo agendamento semanal
   */
  triggerFeedbackTriagem: protectedProcedure.mutation(async ({ ctx }) => {
    const adminEmails = ["elio@wilbor.com", "admin@wilbor.com"];
    if (!adminEmails.includes(ctx.user.email || "")) {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Buscar feedbacks negativos ainda não analisados
    const pendingFeedbacks = await db
      .select()
      .from(wilborResponseFeedback)
      .where(eq(wilborResponseFeedback.aiVerdict, "pending"))
      .limit(50); // Processar em lotes de 50

    let processed = 0;
    for (const feedback of pendingFeedbacks) {
      try {
        const result = await analyzeFeedbackTriagem(
          feedback.comment || "",
          feedback.aiResponse,
          feedback.userQuestion
        );

        await db
          .update(wilborResponseFeedback)
          .set({
            aiVerdict: result.verdict,
            aiJustification: result.justification,
            status: "reviewed",
          })
          .where(eq(wilborResponseFeedback.id, feedback.id));

        processed++;
      } catch (err) {
        console.error(`[Triagem] Erro ao processar feedback ${feedback.id}:`, err);
      }
    }

    return { processed, total: pendingFeedbacks.length };
  }),

  /**
   * sendWeeklyReport: Disparado todo domingo às 21h pelo agendamento automático
   * 1. Aciona a triagem nos feedbacks pendentes
   * 2. Busca os VERÍDICOS da semana
   * 3. Envia o relatório formatado para o WhatsApp do Elio
   */
  sendWeeklyReport: protectedProcedure.mutation(async ({ ctx }) => {
    const adminEmails = ["elio@wilbor.com", "admin@wilbor.com"];
    if (!adminEmails.includes(ctx.user.email || "")) {
      throw new Error("UNAUTHORIZED");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Passo 1: Triar feedbacks pendentes
    const pendingFeedbacks = await db
      .select()
      .from(wilborResponseFeedback)
      .where(eq(wilborResponseFeedback.aiVerdict, "pending"))
      .limit(100);

    for (const feedback of pendingFeedbacks) {
      try {
        const result = await analyzeFeedbackTriagem(
          feedback.comment || "",
          feedback.aiResponse,
          feedback.userQuestion
        );
        await db
          .update(wilborResponseFeedback)
          .set({ aiVerdict: result.verdict, aiJustification: result.justification, status: "reviewed" })
          .where(eq(wilborResponseFeedback.id, feedback.id));
      } catch (err) {
        console.error(`[Triagem] Erro no feedback ${feedback.id}:`, err);
      }
    }

    // Passo 2: Buscar VERÍDICOS da última semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const veridicos = await db
      .select()
      .from(wilborResponseFeedback)
      .where(
        and(
          eq(wilborResponseFeedback.aiVerdict, "VERÍDICA"),
          gte(wilborResponseFeedback.createdAt, oneWeekAgo)
        )
      )
      .orderBy(desc(wilborResponseFeedback.createdAt));

    // Passo 3: Enviar relatório via WhatsApp
    await sendAdminReport(veridicos.map(f => ({
      id: f.id,
      userQuestion: f.userQuestion,
      aiResponse: f.aiResponse,
      comment: f.comment,
      aiJustification: f.aiJustification,
      createdAt: f.createdAt,
    })));

    return { sent: true, veridicos: veridicos.length, triaged: pendingFeedbacks.length };
  }),
});
