import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { InsertUser, users, wilborUserCredits, wilborExtraCreditTransactions, wilborSosUsageLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _startupDatabaseReachable: boolean | null = null;

function describeDatabaseError(error: any): string {
  const cause = error?.cause;
  return String(cause?.sqlMessage || cause?.message || error?.message || error || "unknown database error");
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function isStartupDatabaseReachable(): Promise<boolean> {
  if (_startupDatabaseReachable !== null) {
    return _startupDatabaseReachable;
  }

  const db = await getDb();
  if (!db) {
    _startupDatabaseReachable = false;
    return false;
  }

  try {
    await db.execute(sql`SELECT 1 AS ok`);
    _startupDatabaseReachable = true;
    return true;
  } catch (error) {
    console.log(`[Database] Startup probe ignorado: ${describeDatabaseError(error)}`);
    _startupDatabaseReachable = false;
    return false;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==========================================
// WILBOR CREDITS FUNCTIONS (Otimizadas para ROI Global)
// ==========================================

/**
 * Get user credits - Otimizado para 5 idiomas (ROI)
 */
export async function getUserCreditsStatus(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get credits: database not available");
    return null;
  }

  try {
    const credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, userId))
      .limit(1);

    if (!credits || credits.length === 0) {
      return null;
    }

    const credit = credits[0];
    
    // Comparação numérica direta (evita erros de arredondamento de float)
    const used = Number(credit.extraCreditsUsedReais);
    const limit = Number(credit.extraCreditsLimitReais);
    const hasHitLimit = used >= limit;

    return {
      ...credit,
      hasHitLimit,
      remainingLimit: Math.max(0, limit - used),
    };
  } catch (error) {
    console.error("[Database] Failed to get user credits:", error);
    throw error;
  }
}

/**
 * Add extra credit transaction (Atômico - Blindagem Financeira)
 */
export async function addExtraCreditTransaction(
  userId: number,
  amount: string,
  creditsReceived: number,
  stripeTransactionId: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add transaction: database not available");
    return null;
  }

  try {
    // Transação atômica: ou faz tudo ou não faz nada (Evita Race Conditions)
    return await db.transaction(async (tx) => {
      const now = new Date();
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // 1. Registra a transação
      const result = await tx.insert(wilborExtraCreditTransactions).values({
        userId,
        amountReais: amount as any,
        creditsReceived,
        stripeTransactionId,
        status: "completed",
        usedCredits: 0,
        periodStart: now,
        periodEnd,
      });

      // 2. Atualiza o saldo usando SQL direto para garantir precisão e evitar race conditions
      // Incrementamos o limite (ou reduzimos o uso) para permitir mais mensagens
      await tx.update(wilborUserCredits)
        .set({ 
          extraCreditsUsedReais: sql`${wilborUserCredits.extraCreditsUsedReais} + ${amount}`,
          // Se o sistema usar um contador de mensagens, podemos injetar aqui também
          // messagesUsed: sql`${wilborUserCredits.messagesUsed} - ${creditsReceived}` 
        })
        .where(eq(wilborUserCredits.userId, userId));

      console.log(`[Database] Transação atômica concluída: User ${userId}, +${creditsReceived} créditos.`);
      return result;
    });
  } catch (error) {
    console.error("[Database] Failed to add transaction (Atomic):", error);
    throw error;
  }
}

/**
 * Log SOS usage
 */
export async function logSosUsage(
  userId: number,
  conversationId: number | null,
  costReais: string,
  injectedCredits: number = 0,
  stripeTransactionId: string | null = null
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot log SOS: database not available");
    return null;
  }

  try {
    const result = await db.insert(wilborSosUsageLog).values({
      userId,
      conversationId,
      usageType: injectedCredits > 0 ? "emergency" : "regular",
      costReais: costReais as any,
      injectedCredits,
      stripeTransactionId,
    });

    return result;
  } catch (error) {
    console.error("[Database] Failed to log SOS usage:", error);
    throw error;
  }
}

/**
 * Validação de Crédito Neutra (Para os 5 idiomas)
 * Removemos as mensagens fixas em PT para que o frontend/trpc decida o idioma
 */
export async function canUseExtraCredits(userId: number) {
  const status = await getUserCreditsStatus(userId);
  
  if (!status) {
    return { 
      canUse: false, 
      code: "NOT_FOUND", 
      remainingLimit: 0 
    };
  }

  return {
    canUse: !status.hasHitLimit,
    code: status.hasHitLimit ? "LIMIT_REACHED" : "OK",
    remainingLimit: status.remainingLimit,
  };
}
