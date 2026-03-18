import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, gte, lte } from "drizzle-orm";
import { InsertUser, users, wilborUserCredits, wilborExtraCreditTransactions, wilborSosUsageLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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
// WILBOR CREDITS FUNCTIONS
// ==========================================

/**
 * Get user credits and check if they've hit the limit
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
    const hasHitLimit = parseFloat(credit.extraCreditsUsedReais) >= parseFloat(credit.extraCreditsLimitReais);

    return {
      ...credit,
      hasHitLimit,
      remainingLimit: Math.max(0, parseFloat(credit.extraCreditsLimitReais) - parseFloat(credit.extraCreditsUsedReais)),
    };
  } catch (error) {
    console.error("[Database] Failed to get user credits:", error);
    throw error;
  }
}

/**
 * Add extra credit transaction
 */
export async function addExtraCreditTransaction(
  userId: number,
  amountReais: string,
  creditsReceived: number,
  stripeTransactionId: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add transaction: database not available");
    return null;
  }

  try {
    const now = new Date();
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await db.insert(wilborExtraCreditTransactions).values({
      userId,
      amountReais: amountReais as any,
      creditsReceived,
      stripeTransactionId,
      status: "completed",
      usedCredits: 0,
      periodStart: now,
      periodEnd,
    });

    // Update user credits
    const creditStatus = await getUserCreditsStatus(userId);
    if (creditStatus) {
      const newUsedAmount = (parseFloat(creditStatus.extraCreditsUsedReais) + parseFloat(amountReais)).toFixed(2);
      await db
        .update(wilborUserCredits)
        .set({ extraCreditsUsedReais: newUsedAmount as any })
        .where(eq(wilborUserCredits.userId, userId));
    }

    return result;
  } catch (error) {
    console.error("[Database] Failed to add transaction:", error);
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
 * Check if user can use extra credits
 */
export async function canUseExtraCredits(userId: number): Promise<{ canUse: boolean; message: string; remainingLimit: number }> {
  const creditStatus = await getUserCreditsStatus(userId);

  if (!creditStatus) {
    return {
      canUse: false,
      message: "Não conseguimos encontrar seus créditos. Tente novamente.",
      remainingLimit: 0,
    };
  }

  if (creditStatus.hasHitLimit) {
    return {
      canUse: false,
      message: "Você atingiu o limite de créditos extras este mês. Volte no próximo mês! 💜",
      remainingLimit: 0,
    };
  }

  return {
    canUse: true,
    message: `Você tem R$ ${creditStatus.remainingLimit.toFixed(2)} disponíveis em créditos extras.`,
    remainingLimit: creditStatus.remainingLimit,
  };
}
