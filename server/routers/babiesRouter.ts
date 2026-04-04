import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  wilborMilestoneContent,
  wilborDevMilestones,
  wilborDiaryEntries,
  wilborSleepLogs,
  wilborBabies,
} from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

/**
 * Router para Marcos de Desenvolvimento (Trilha) e Diário do Bebê
 * 
 * Procedures:
 * - getCurrentBabyAge: Calcular idade atual do bebê em meses
 * - getMilestones: Buscar marcos por mês
 * - getAllMilestones: Buscar todos os marcos (admin)
 * - markMilestoneAchieved: Marcar marco como atingido
 * - getDiaryLogs: Buscar registros do diário por data
 * - getDiaryLogsByType: Buscar registros por tipo
 * - createDiaryLog: Criar novo registro
 * - updateDiaryLog: Atualizar registro
 * - deleteDiaryLog: Deletar registro
 */

export const babiesRouter = router({
  // ==========================================
  // CÁLCULO DE IDADE DO BEBÊ
  // ==========================================

  /**
   * GET: Calcular a idade atual do bebê em meses
   * Usado pela MilestonesPage para abrir a trilha no mês correto automaticamente.
   * @param babyId - ID do bebê (opcional; se omitido, usa o bebê ativo do usuário)
   * @returns { ageInMonths: number, babyName: string, birthDate: string }
   */
  getCurrentBabyAge: protectedProcedure
    .input(z.object({ babyId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Buscar bebê ativo do usuário (ou o especificado)
      const conditions = [eq(wilborBabies.userId, ctx.user.id)];
      if (input.babyId) {
        conditions.push(eq(wilborBabies.id, input.babyId));
      }

      const babies = await db
        .select()
        .from(wilborBabies)
        .where(and(...conditions))
        .orderBy(wilborBabies.createdAt as any)
        .limit(1);

      if (!babies.length || !babies[0].birthDate) {
        return { ageInMonths: 6, babyName: null, birthDate: null };
      }

      const baby = babies[0];
      const birth = new Date(baby.birthDate!);
      const today = new Date();

      // Cálculo preciso de meses completos
      let months = (today.getFullYear() - birth.getFullYear()) * 12;
      months += today.getMonth() - birth.getMonth();
      if (today.getDate() < birth.getDate()) months--;

      // Clamp entre 0 e 24 para não sair da trilha
      const ageInMonths = Math.max(0, Math.min(24, months));

      return {
        ageInMonths,
        babyName: baby.name,
        birthDate: baby.birthDate ? baby.birthDate.toISOString() : null,
      };
    }),

  // ==========================================
  // MARCOS DE DESENVOLVIMENTO (Milestones)
  // ==========================================

  /**
   * GET: Buscar marcos de desenvolvimento por mês
   * @param month - Mês (6-24)
   * @returns Array de marcos para o mês especificado
   */
  getMilestones: publicProcedure
    .input(z.object({ month: z.number().min(6).max(24) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const milestones = await db
        .select()
        .from(wilborMilestoneContent)
        .where(
          and(
            eq(wilborMilestoneContent.month, input.month),
            eq(wilborMilestoneContent.isActive, "true")
          )
        )
        .orderBy(wilborMilestoneContent.order);

      return milestones;
    }),

  /**
   * GET: Buscar todos os marcos de desenvolvimento (para admin)
   * @returns Array de todos os marcos
   */
  getAllMilestones: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const milestones = await db
      .select()
      .from(wilborMilestoneContent)
      .where(eq(wilborMilestoneContent.isActive, "true"))
      .orderBy(wilborMilestoneContent.month, wilborMilestoneContent.order);

    return milestones;
  }),

  /**
   * POST: Marcar marco como atingido pelo bebê
   * @param babyId - ID do bebê
   * @param contentId - ID do conteúdo do marco
   * @param achieved - Status do marco (yes, no, partial)
   * @returns Registro criado/atualizado
   */
  markMilestoneAchieved: protectedProcedure
    .input(
      z.object({
        babyId: z.number(),
        contentId: z.number(),
        achieved: z.enum(["yes", "no", "partial"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Validar que o bebê pertence ao usuário
      const baby = await db
        .select()
        .from(wilborBabies)
        .where(
          and(
            eq(wilborBabies.id, input.babyId),
            eq(wilborBabies.userId, ctx.user.id)
          )
        );

      if (!baby.length) {
        throw new Error("Baby not found or unauthorized");
      }

      // Verificar se já existe registro
      const existing = await db
        .select()
        .from(wilborDevMilestones)
        .where(
          and(
            eq(wilborDevMilestones.babyId, input.babyId),
            eq(wilborDevMilestones.contentId, input.contentId)
          )
        );

      if (existing.length > 0) {
        // Atualizar
        const updated = await db
          .update(wilborDevMilestones)
          .set({
            achieved: input.achieved,
            achievedAt: input.achieved === "yes" ? new Date() : null,
            notes: input.notes,
          })
          .where(eq(wilborDevMilestones.id, existing[0].id));

        return updated;
      } else {
        // Criar novo
        const created = await db.insert(wilborDevMilestones).values({
          userId: ctx.user.id,
          babyId: input.babyId,
          contentId: input.contentId,
          achieved: input.achieved,
          achievedAt: input.achieved === "yes" ? new Date() : null,
          notes: input.notes,
        });

        return created;
      }
    }),

  // ==========================================
  // DIÁRIO DO BEBÊ (Baby Diary)
  // ==========================================

  /**
   * GET: Buscar registros do diário por data
   * @param date - Data para filtrar registros
   * @param babyId - ID do bebê (opcional, se não fornecido usa todos)
   * @returns Array de registros para a data especificada
   */
  getDiaryLogs: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        babyId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Definir início e fim do dia
      const dayStart = new Date(input.date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(input.date);
      dayEnd.setHours(23, 59, 59, 999);

      // Construir query

      // Filtrar por bebê se fornecido
      const conditions = [
        eq(wilborDiaryEntries.userId, ctx.user.id),
        gte(wilborDiaryEntries.entryDate, dayStart),
        lte(wilborDiaryEntries.entryDate, dayEnd)
      ];
      
      if (input.babyId) {
        conditions.push(eq(wilborDiaryEntries.babyId, input.babyId));
      }

      const logs = await db
        .select()
        .from(wilborDiaryEntries)
        .where(and(...conditions))
        .orderBy(desc(wilborDiaryEntries.createdAt));

      return logs;
    }),

  /**
   * GET: Buscar registros do diário por tipo
   * @param type - Tipo de registro (feeding, sleep, diaper, etc)
   * @param babyId - ID do bebê
   * @param limit - Limite de registros (padrão: 30)
   * @returns Array de registros do tipo especificado
   */
  getDiaryLogsByType: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        babyId: z.number(),
        limit: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const logs = await db
        .select()
        .from(wilborDiaryEntries)
        .where(
          and(
            eq(wilborDiaryEntries.userId, ctx.user.id),
            eq(wilborDiaryEntries.babyId, input.babyId),
            eq(wilborDiaryEntries.category, input.type as any)
          )
        )
        .orderBy(desc(wilborDiaryEntries.entryDate))
        .limit(input.limit);

      return logs;
    }),

  /**
   * POST: Criar novo registro no diário
   * @param babyId - ID do bebê
   * @param type - Tipo de registro
   * @param titlePt - Título em português
   * @param notePt - Nota em português
   * @param mood - Humor do bebê (opcional)
   * @returns Registro criado
   */
  createDiaryLog: protectedProcedure
    .input(
      z.object({
        babyId: z.number(),
        type: z.enum([
          "feeding",
          "sleep",
          "diaper",
          "milestone",
          "health",
          "mood",
          "general",
        ]),
        titlePt: z.string(),
        notePt: z.string().optional(),
        titleEn: z.string().optional(),
        noteEn: z.string().optional(),
        titleEs: z.string().optional(),
        noteEs: z.string().optional(),
        mood: z
          .enum(["happy", "calm", "fussy", "crying", "sick"])
          .optional(),
        entryDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Validar que o bebê pertence ao usuário
      const baby = await db
        .select()
        .from(wilborBabies)
        .where(
          and(
            eq(wilborBabies.id, input.babyId),
            eq(wilborBabies.userId, ctx.user.id)
          )
        );

      if (!baby.length) {
        throw new Error("Baby not found or unauthorized");
      }

      const created = await db.insert(wilborDiaryEntries).values({
        userId: ctx.user.id,
        babyId: input.babyId,
        category: input.type as any,
        title: input.titlePt ?? null,
        content: input.notePt ?? null,
        mood: input.mood ?? null,
        entryDate: input.entryDate || new Date(),
      });

      return created;
    }),

  /**
   * PUT: Atualizar registro do diário
   * @param id - ID do registro
   * @param data - Dados a atualizar
   * @returns Registro atualizado
   */
  updateDiaryLog: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          titlePt: z.string().optional(),
          notePt: z.string().optional(),
          titleEn: z.string().optional(),
          noteEn: z.string().optional(),
          titleEs: z.string().optional(),
          noteEs: z.string().optional(),
          mood: z
            .enum(["happy", "calm", "fussy", "crying", "sick"])
            .optional(),
          type: z
            .enum([
              "feeding",
              "sleep",
              "diaper",
              "milestone",
              "health",
              "mood",
              "general",
            ])
            .optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Validar que o registro pertence ao usuário
      const existing = await db
        .select()
        .from(wilborDiaryEntries)
        .where(
          and(
            eq(wilborDiaryEntries.id, input.id),
            eq(wilborDiaryEntries.userId, ctx.user.id)
          )
        );

      if (!existing.length) {
        throw new Error("Diary entry not found or unauthorized");
      }

      const updated = await db
        .update(wilborDiaryEntries)
        .set(input.data)
        .where(eq(wilborDiaryEntries.id, input.id));

      return updated;
    }),

  /**
   * DELETE: Deletar registro do diário
   * @param id - ID do registro
   * @returns Confirmação de sucesso
   */
  deleteDiaryLog: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Validar que o registro pertence ao usuário
      const existing = await db
        .select()
        .from(wilborDiaryEntries)
        .where(
          and(
            eq(wilborDiaryEntries.id, input.id),
            eq(wilborDiaryEntries.userId, ctx.user.id)
          )
        );

      if (!existing.length) {
        throw new Error("Diary entry not found or unauthorized");
      }

      await db
        .delete(wilborDiaryEntries)
        .where(eq(wilborDiaryEntries.id, input.id));

      return { success: true };
    }),

  // ==========================================
  // SLEEP LOGS (Registros de Sono Detalhados)
  // ==========================================

  /**
   * POST: Criar log de sono
   * @param babyId - ID do bebê
   * @param sleepStart - Hora de início do sono
   * @param sleepEnd - Hora de fim do sono (opcional)
   * @param quality - Qualidade do sono
   * @param notesPt - Notas em português
   * @returns Log criado
   */
  createSleepLog: protectedProcedure
    .input(
      z.object({
        babyId: z.number(),
        sleepStart: z.date(),
        sleepEnd: z.date().optional(),
        quality: z.enum(["good", "restless", "bad"]).optional(),
        notesPt: z.string().optional(),
        notesEn: z.string().optional(),
        notesEs: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      // Validar que o bebê pertence ao usuário
      const baby = await db
        .select()
        .from(wilborBabies)
        .where(
          and(
            eq(wilborBabies.id, input.babyId),
            eq(wilborBabies.userId, ctx.user.id)
          )
        );

      if (!baby.length) {
        throw new Error("Baby not found or unauthorized");
      }

      // Calcular duração em minutos
      let durationMinutes = undefined;
      if (input.sleepEnd) {
        durationMinutes = Math.round(
          (input.sleepEnd.getTime() - input.sleepStart.getTime()) / 60000
        );
      }

      const created = await db.insert(wilborSleepLogs).values({
        userId: ctx.user.id,
        babyId: input.babyId,
        sleepStart: input.sleepStart,
        sleepEnd: input.sleepEnd ?? null,
        durationMinutes: durationMinutes ?? null,
        quality: input.quality ?? null,
        notes: input.notesPt ?? null,
      });

      return created;
    }),

  /**
   * GET: Buscar logs de sono por bebê
   * @param babyId - ID do bebê
   * @param limit - Limite de registros (padrão: 30)
   * @returns Array de logs de sono
   */
  getSleepLogs: protectedProcedure
    .input(
      z.object({
        babyId: z.number(),
        limit: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const logs = await db
        .select()
        .from(wilborSleepLogs)
        .where(
          and(
            eq(wilborSleepLogs.userId, ctx.user.id),
            eq(wilborSleepLogs.babyId, input.babyId)
          )
        )
        .orderBy(desc(wilborSleepLogs.sleepStart))
        .limit(input.limit);

      return logs;
    }),
});
