/**
 * runMigrations.ts
 * Garante ajustes mínimos de schema automaticamente no startup do servidor.
 *
 * Estratégia econômica e defensiva:
 * 1. Não depende de arquivos de migration gerados no deploy.
 * 2. Tolera ambientes parcialmente provisionados.
 * 3. Nunca derruba o startup do servidor por falha de bootstrap de banco.
 * 4. Cria a tabela de milestones antes do auto-seed do startup quando o banco permite.
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
    message.includes("relation") ||
    message.includes("connection lost") ||
    message.includes("server closed the connection")
  );
}

async function tableExists(db: any, tableName: string): Promise<boolean | null> {
  try {
    const result = await db.execute(sql.raw(`SHOW TABLES LIKE '${tableName}'`));
    return getRows(result).length > 0;
  } catch (err: any) {
    console.warn(`[Migration] Não foi possível verificar a tabela ${tableName}: ${describeMigrationError(err)}`);
    return null;
  }
}

async function columnExists(db: any, tableName: string, columnName: string): Promise<boolean | null> {
  try {
    const result = await db.execute(sql.raw(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${columnName}'`));
    return getRows(result).length > 0;
  } catch (err: any) {
    console.warn(
      `[Migration] Não foi possível verificar a coluna ${tableName}.${columnName}: ${describeMigrationError(err)}`,
    );
    return null;
  }
}

async function ensureFeedbackRatingColumn(db: any) {
  const hasMessagesTable = await tableExists(db, "wilborMessages");
  if (hasMessagesTable === null) {
    console.warn("[Migration] Verificação de wilborMessages falhou; feedbackRating será pulado neste startup.");
    return;
  }

  if (!hasMessagesTable) {
    console.warn("[Migration] Tabela wilborMessages ausente; feedbackRating será ignorado por enquanto.");
    return;
  }

  const hasFeedbackRating = await columnExists(db, "wilborMessages", "feedbackRating");
  if (hasFeedbackRating === null) {
    console.warn("[Migration] Verificação de feedbackRating falhou; alteração será pulada neste startup.");
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
      console.warn(`[Migration] feedbackRating não precisou ser aplicado: ${describeMigrationError(err)}`);
      return;
    }

    console.error("[Migration] Erro inesperado ao adicionar feedbackRating:", describeMigrationError(err));
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
      console.warn(`[Migration] wilborMilestoneContent já existia ou foi ignorada: ${describeMigrationError(err)}`);
      return;
    }

    console.error("[Migration] Erro inesperado ao garantir wilborMilestoneContent:", describeMigrationError(err));
  }
}

export async function runPendingMigrations() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Migration] Database not available, skipping migrations");
      return;
    }

    await ensureFeedbackRatingColumn(db);
    await ensureMilestoneContentTable(db);
  } catch (err: any) {
    console.error("[Migration] Bootstrap defensivo falhou, mas o servidor continuará subindo:", describeMigrationError(err));
  }
}
