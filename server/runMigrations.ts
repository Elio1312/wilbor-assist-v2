/**
 * runMigrations.ts
 * Garante ajustes mínimos de schema automaticamente no startup do servidor.
 *
 * Estratégia econômica:
 * 1. Não depende de arquivos de migration gerados no deploy.
 * 2. Tolera ambientes parcialmente provisionados.
 * 3. Cria a tabela de milestones antes do auto-seed do startup.
 */
import { sql } from "drizzle-orm";
import { getDb } from "./db";

function getRows(result: any): any[] {
  if (Array.isArray(result)) {
    const [rows] = result;
    return Array.isArray(rows) ? rows : [];
  }

  return Array.isArray(result) ? result : [];
}

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

async function tableExists(db: any, tableName: string): Promise<boolean> {
  const result = await db.execute(sql.raw(`SHOW TABLES LIKE '${tableName}'`));
  return getRows(result).length > 0;
}

async function columnExists(db: any, tableName: string, columnName: string): Promise<boolean> {
  const result = await db.execute(sql.raw(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${columnName}'`));
  return getRows(result).length > 0;
}

async function ensureFeedbackRatingColumn(db: any) {
  const hasMessagesTable = await tableExists(db, "wilborMessages");
  if (!hasMessagesTable) {
    console.warn("[Migration] Tabela wilborMessages ausente; feedbackRating será ignorado por enquanto.");
    return;
  }

  const hasFeedbackRating = await columnExists(db, "wilborMessages", "feedbackRating");
  if (hasFeedbackRating) {
    console.log("[Migration] Coluna feedbackRating já existe em wilborMessages.");
    return;
  }

  try {
    await db.execute(sql.raw("ALTER TABLE `wilborMessages` ADD COLUMN `feedbackRating` INT NULL"));
    console.log("[Migration] Coluna feedbackRating criada com sucesso em wilborMessages.");
  } catch (err: any) {
    if (isIgnorableMigrationError(err)) {
      console.warn(`[Migration] feedbackRating não precisou ser aplicado: ${err?.message || err}`);
      return;
    }

    console.error("[Migration] Erro inesperado ao adicionar feedbackRating:", err?.message || err);
  }
}

async function ensureMilestoneContentTable(db: any) {
  try {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS \`wilborMilestoneContent\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`month\` INT NOT NULL,
        \`category\` ENUM('motor','cognitivo','linguagem','social') NOT NULL,
        \`titlePt\` TEXT NOT NULL,
        \`descriptionPt\` TEXT NOT NULL,
        \`titleEn\` TEXT NULL,
        \`descriptionEn\` TEXT NULL,
        \`titleEs\` TEXT NULL,
        \`descriptionEs\` TEXT NULL,
        \`order\` INT NOT NULL DEFAULT 0,
        \`isActive\` ENUM('true','false') NOT NULL DEFAULT 'true',
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      )
    `));

    console.log("[Migration] Tabela wilborMilestoneContent garantida com sucesso.");
  } catch (err: any) {
    if (isIgnorableMigrationError(err)) {
      console.warn(`[Migration] wilborMilestoneContent já existia ou foi ignorada: ${err?.message || err}`);
      return;
    }

    console.error("[Migration] Erro inesperado ao garantir wilborMilestoneContent:", err?.message || err);
  }
}

export async function runPendingMigrations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] Database not available, skipping migrations");
    return;
  }

  await ensureFeedbackRatingColumn(db);
  await ensureMilestoneContentTable(db);
}
