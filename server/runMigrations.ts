/**
 * runMigrations.ts
 * Garante ajustes mínimos de schema automaticamente no startup do servidor.
 *
 * Estratégia econômica e defensiva:
 * 1. Não depende de arquivos de migration gerados no deploy.
 * 2. Tolera ambientes parcialmente provisionados.
 * 3. Nunca derruba o startup do servidor por falha de bootstrap de banco.
 * 4. Só tenta mexer no schema quando o banco responde à sonda inicial.
 */
import { sql } from "drizzle-orm";
import { getDb, isStartupDatabaseReachable } from "./db";

function getRows(result: any): any[] {
  if (Array.isArray(result)) {
    const [rows] = result;
    return Array.isArray(rows) ? rows : [];
  }

  return Array.isArray(result) ? result : [];
}

function describeMigrationError(err: any): string {
  const cause = err?.cause;
  return String(
    cause?.sqlMessage ||
      cause?.message ||
      err?.message ||
      err ||
      "unknown migration error",
  );
}

function isIgnorableMigrationError(err: any): boolean {
  const message = describeMigrationError(err).toLowerCase();

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

async function tableExists(db: any, tableName: string): Promise<boolean | null> {
  try {
    const result = await db.execute(sql.raw(`SHOW TABLES LIKE '${tableName}'`));
    return getRows(result).length > 0;
  } catch (err: any) {
    console.log(`[Migration] Não foi possível verificar a tabela ${tableName}: ${describeMigrationError(err)}`);
    return null;
  }
}

async function columnExists(db: any, tableName: string, columnName: string): Promise<boolean | null> {
  try {
    const result = await db.execute(sql.raw(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${columnName}'`));
    return getRows(result).length > 0;
  } catch (err: any) {
    console.log(
      `[Migration] Não foi possível verificar a coluna ${tableName}.${columnName}: ${describeMigrationError(err)}`,
    );
    return null;
  }
}

async function ensureFeedbackRatingColumn(db: any) {
  const hasMessagesTable = await tableExists(db, "wilborMessages");
  if (hasMessagesTable === null) {
    console.log("[Migration] Verificação de wilborMessages indisponível; feedbackRating ficará para um bootstrap futuro.");
    return;
  }

  if (!hasMessagesTable) {
    console.log("[Migration] Tabela wilborMessages ausente; feedbackRating será ignorado por enquanto.");
    return;
  }

  const hasFeedbackRating = await columnExists(db, "wilborMessages", "feedbackRating");
  if (hasFeedbackRating === null) {
    console.log("[Migration] Verificação de feedbackRating indisponível; alteração ficará para um bootstrap futuro.");
    return;
  }

  if (hasFeedbackRating) {
    console.log("[Migration] Coluna feedbackRating já existe em wilborMessages.");
    return;
  }

  try {
    await db.execute(sql.raw("ALTER TABLE `wilborMessages` ADD COLUMN `feedbackRating` INT NULL"));
    console.log("[Migration] Coluna feedbackRating criada com sucesso em wilborMessages.");
  } catch (err: any) {
    if (isIgnorableMigrationError(err)) {
      console.log(`[Migration] feedbackRating não precisou ser aplicado: ${describeMigrationError(err)}`);
      return;
    }

    console.log(`[Migration] Alteração de feedbackRating adiada: ${describeMigrationError(err)}`);
  }
}

async function ensureMilestoneContentTable(db: any) {
  try {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS \`wilborMilestoneContent\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`month\` INT NOT NULL,
        \`milestoneCategory\` ENUM('motor','cognitivo','linguagem','social') NOT NULL,
        \`titlePt\` TEXT NOT NULL,
        \`descriptionPt\` TEXT NOT NULL,
        \`titleEn\` TEXT NULL,
        \`descriptionEn\` TEXT NULL,
        \`titleEs\` TEXT NULL,
        \`descriptionEs\` TEXT NULL,
        \`order\` INT NOT NULL DEFAULT 0,
        \`contentIsActive\` ENUM('true','false') NOT NULL DEFAULT 'true',
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      )
    `));

    console.log("[Migration] Tabela wilborMilestoneContent garantida com sucesso.");
  } catch (err: any) {
    if (isIgnorableMigrationError(err)) {
      console.log(`[Migration] wilborMilestoneContent já existia ou não precisou de ajuste: ${describeMigrationError(err)}`);
      return;
    }

    console.log(`[Migration] Garantia de wilborMilestoneContent adiada: ${describeMigrationError(err)}`);
  }
}

export async function runPendingMigrations() {
  try {
    const db = await getDb();
    if (!db) {
      console.log("[Migration] Banco indisponível, bootstrap opcional de schema foi ignorado.");
      return;
    }

    const databaseReachable = await isStartupDatabaseReachable();
    if (!databaseReachable) {
      console.log("[Migration] Banco não respondeu no startup; bootstrap opcional de schema foi ignorado sem impactar o deploy.");
      return;
    }

    await ensureFeedbackRatingColumn(db);
    await ensureMilestoneContentTable(db);
  } catch (err: any) {
    console.log(`[Migration] Bootstrap defensivo adiado, mas o servidor continuará subindo: ${describeMigrationError(err)}`);
  }
}

    await ensureFeedbackRatingColumn(db);
    await ensureMilestoneContentTable(db);
  } catch (err: any) {
    console.error("[Migration] Bootstrap defensivo falhou, mas o servidor continuará subindo:", describeMigrationError(err));
  }
}
