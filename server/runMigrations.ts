/**
 * runMigrations.ts
 * Roda migrations pendentes automaticamente no startup do servidor
 * Pool (Manus) - 06/04/2026
 */
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function runPendingMigrations() {
  try {
    // Migration 1: Adicionar feedbackRating em wilborMessages
    await db.execute(sql`
      ALTER TABLE wilborMessages 
      ADD COLUMN IF NOT EXISTS feedbackRating INT NULL
      COMMENT 'Rating 1-5 estrelas. NULL = sem feedback. <=2 = alarme CEO'
    `);
    console.log("[Migration] feedbackRating adicionado com sucesso");
  } catch (err: any) {
    // Coluna já existe = OK
    if (err?.message?.includes("Duplicate column")) {
      console.log("[Migration] feedbackRating já existe, pulando...");
    } else {
      console.error("[Migration] Erro:", err?.message);
    }
  }
}
