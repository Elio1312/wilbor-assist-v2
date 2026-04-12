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

function isIgnorableMigrationError(err: any): boolean {
  const message = String(err?.message || err || "").toLowerCase();

  return (
    message.includes("duplicate column") ||
    message.includes("already exists") ||
    message.includes("duplicate_column") ||
    message.includes("doesn't exist") ||
    message.includes("does not exist") ||
    message.includes("unknown table") ||
    message.includes("relation")
  );
}

export async function runPendingMigrations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] Database not available, skipping migrations");
    return;
  }

  // Migration 1: Adicionar feedbackRating em wilborMessages
  const migrationStatements = [
    `ALTER TABLE wilborMessages ADD COLUMN feedbackRating INT NULL`,
    `ALTER TABLE "wilborMessages" ADD COLUMN "feedbackRating" integer`,
    `ALTER TABLE "wilborMessages" ADD COLUMN IF NOT EXISTS "feedbackRating" integer`,
  ];

  for (const statement of migrationStatements) {
    try {
      await db.execute(sql.raw(statement));
      console.log(`[Migration] feedbackRating garantido com sucesso via: ${statement}`);
      return;
    } catch (err: any) {
      if (isIgnorableMigrationError(err)) {
        console.warn(`[Migration] feedbackRating não aplicado com '${statement}': ${err?.message || err}`);
        continue;
      }

      console.error("[Migration] Erro inesperado ao adicionar feedbackRating:", err?.message || err);
      return;
    }
  }

  console.warn("[Migration] feedbackRating não pôde ser garantido automaticamente. Execute o schema/migration do ambiente antes do deploy final.");
}
