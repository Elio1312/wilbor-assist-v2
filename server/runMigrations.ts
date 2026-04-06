/**
 * runMigrations.ts
 * Roda migrations pendentes automaticamente no startup do servidor
 * Pool (Manus) - 06/04/2026
 *
 * NOTA TiDB: Não suporta ADD COLUMN IF NOT EXISTS nem COMMENT inline no ALTER TABLE.
 * Estratégia: verificar se a coluna existe antes de tentar adicionar.
 */
import { getDb } from "./db";
import { sql } from "drizzle-orm";

async function columnExists(db: any, table: string, column: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT COUNT(*) as cnt
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ${table}
        AND COLUMN_NAME = ${column}
    `);
    // Drizzle retorna array de rows
    const rows = Array.isArray(result) ? result[0] : result?.rows ?? [];
    const count = Number(rows?.[0]?.cnt ?? rows?.[0]?.["COUNT(*)"] ?? 0);
    return count > 0;
  } catch {
    return false;
  }
}

export async function runPendingMigrations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] Database not available, skipping migrations");
    return;
  }

  // Migration 1: Adicionar feedbackRating em wilborMessages
  try {
    const exists = await columnExists(db, "wilborMessages", "feedbackRating");
    if (!exists) {
      await db.execute(sql`
        ALTER TABLE wilborMessages 
        ADD COLUMN feedbackRating INT NULL
      `);
      console.log("[Migration] feedbackRating adicionado com sucesso");
    } else {
      console.log("[Migration] feedbackRating já existe, pulando...");
    }
  } catch (err: any) {
    // Fallback: se a coluna já existir por qualquer razão, ignora
    if (
      err?.message?.includes("Duplicate column") ||
      err?.message?.includes("already exists")
    ) {
      console.log("[Migration] feedbackRating já existe (fallback), pulando...");
    } else {
      console.error("[Migration] Erro ao adicionar feedbackRating:", err?.message);
    }
  }
}
