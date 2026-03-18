import { eq, and, desc } from "drizzle-orm";
import { wilborUsers, wilborBabies, wilborConversations, wilborMessages, wilborMotherProfile, wilborMotherWeighIns, InsertWilborUser, InsertWilborBaby } from "../drizzle/schema";
import { getDb } from "./db";

// ==========================================
// WILBOR USER OPERATIONS
// ==========================================

export async function createWilborUser(data: { email: string; name: string; whatsapp?: string; city?: string; state?: string; language?: "pt" | "en" | "es" }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already exists
  const existing = await db.select().from(wilborUsers).where(eq(wilborUsers.email, data.email)).limit(1);
  if (existing.length > 0) {
    await db.update(wilborUsers)
      .set({ lastActiveAt: new Date() })
      .where(eq(wilborUsers.email, data.email));
    return existing[0];
  }

  // Calculate trial expiration (5 days from now)
  const trialExpiresAt = new Date();
  trialExpiresAt.setDate(trialExpiresAt.getDate() + 5);

  const result = await db.insert(wilborUsers).values({
    email: data.email,
    name: data.name,
    whatsapp: data.whatsapp || null,
    city: data.city || null,
    state: data.state || null,
    language: data.language || "pt",
    trialExpiresAt,
    subscriptionStatus: "trial",
  });
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: insertId, email: data.email, name: data.name, language: data.language || "pt" };
}

// Check if email or whatsapp already used (for trial abuse prevention)
export async function checkDuplicateTrial(email: string, whatsapp?: string) {
  const db = await getDb();
  if (!db) return { emailExists: false, whatsappExists: false };

  const emailCheck = await db.select().from(wilborUsers).where(eq(wilborUsers.email, email)).limit(1);
  let whatsappExists = false;
  if (whatsapp) {
    const wpCheck = await db.select().from(wilborUsers).where(eq(wilborUsers.whatsapp, whatsapp)).limit(1);
    whatsappExists = wpCheck.length > 0;
  }
  return { emailExists: emailCheck.length > 0, whatsappExists };
}

export async function getWilborUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(wilborUsers).where(eq(wilborUsers.email, email)).limit(1);
  return result[0] || undefined;
}

export async function getWilborUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(wilborUsers).where(eq(wilborUsers.id, id)).limit(1);
  return result[0] || undefined;
}

export async function updateWilborUserLanguage(userId: number, language: "pt" | "en" | "es") {
  const db = await getDb();
  if (!db) return;
  await db.update(wilborUsers)
    .set({ language })
    .where(eq(wilborUsers.id, userId));
}

export async function incrementWilborMessageCount(userId: number) {
  const db = await getDb();
  if (!db) return;
  const user = await getWilborUserById(userId);
  if (!user) return;
  await db.update(wilborUsers).set({
    messageCount: user.messageCount + 1,
    lastActiveAt: new Date(),
  }).where(eq(wilborUsers.id, userId));
}

export async function checkWilborRateLimit(userId: number, maxPerMinute: number = 5): Promise<boolean> {
  const user = await getWilborUserById(userId);
  if (!user) return false;
  if (user.rateLimitResetAt && user.rateLimitResetAt < new Date()) {
    return true;
  }
  const db = await getDb();
  if (!db) return false;
  const recentMessages = await db.select().from(wilborMessages)
    .where(and(eq(wilborMessages.userId, userId), eq(wilborMessages.role, "user")))
    .orderBy(desc(wilborMessages.createdAt))
    .limit(maxPerMinute);
  if (recentMessages.length >= maxPerMinute) {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const oldestRecent = recentMessages[recentMessages.length - 1];
    if (oldestRecent.createdAt > oneMinuteAgo) {
      const resetAt = new Date(Date.now() + 60000);
      await db.update(wilborUsers).set({ rateLimitResetAt: resetAt }).where(eq(wilborUsers.id, userId));
      return false;
    }
  }
  return true;
}

// ==========================================
// BABY OPERATIONS (sub-perfis: gêmeos/trigêmeos)
// ==========================================

export async function createWilborBaby(data: {
  userId: number;
  name: string;
  birthDate?: Date | null;
  sex?: "male" | "female" | "unknown";
  weightGrams?: number | null;
  gestationalWeeks?: number | null;
  syndromes?: string | null;
  notes?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(wilborBabies).values({
    userId: data.userId,
    name: data.name,
    birthDate: data.birthDate || null,
    sex: data.sex || "unknown",
    weightGrams: data.weightGrams || null,
    gestationalWeeks: data.gestationalWeeks || null,
    syndromes: data.syndromes || null,
    notes: data.notes || null,
  });
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: insertId, ...data };
}

export async function getBabiesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborBabies)
    .where(and(eq(wilborBabies.userId, userId), eq(wilborBabies.isActive, "true")))
    .orderBy(desc(wilborBabies.createdAt));
}

export async function getBabyById(babyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(wilborBabies).where(eq(wilborBabies.id, babyId)).limit(1);
  return rows[0] || undefined;
}

export async function updateWilborBaby(babyId: number, data: {
  name?: string;
  birthDate?: Date | null;
  sex?: "male" | "female" | "unknown";
  weightGrams?: number | null;
  gestationalWeeks?: number | null;
  syndromes?: string | null;
  notes?: string | null;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(wilborBabies)
    .set(data)
    .where(eq(wilborBabies.id, babyId));
}

// ==========================================
// CONVERSATION OPERATIONS
// ==========================================

export async function createWilborConversation(userId: number, category: "sono" | "colica" | "salto" | "alimentacao" | "seguranca" | "sos" | "geral", babyId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(wilborConversations).values({
    userId,
    babyId: babyId || null,
    category,
  });
  return result;
}

export async function getWilborConversation(conversationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(wilborConversations).where(eq(wilborConversations.id, conversationId)).limit(1);
  return result[0] || undefined;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborConversations)
    .where(eq(wilborConversations.userId, userId))
    .orderBy(desc(wilborConversations.createdAt));
}

export async function completeWilborConversation(conversationId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(wilborConversations).set({ status: "completed" }).where(eq(wilborConversations.id, conversationId));
}

// ==========================================
// MESSAGE OPERATIONS
// ==========================================

export async function saveWilborMessage(data: { conversationId: number; userId: number; role: "user" | "assistant" | "system"; content: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(wilborMessages).values(data);
}

export async function getWilborMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborMessages)
    .where(eq(wilborMessages.conversationId, conversationId))
    .orderBy(wilborMessages.createdAt);
}

// ==========================================
// SLEEP TRACKING OPERATIONS
// ==========================================

import { wilborSleepLogs, wilborDiaryEntries, wilborDevMilestones } from "../drizzle/schema";

export async function startSleep(userId: number, babyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(wilborSleepLogs).values({
    userId,
    babyId,
    sleepStart: new Date(),
  });
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: insertId, sleepStart: new Date() };
}

export async function endSleep(sleepLogId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const log = await db.select().from(wilborSleepLogs).where(eq(wilborSleepLogs.id, sleepLogId)).limit(1);
  if (!log[0]) throw new Error("Sleep log not found");
  
  const sleepEnd = new Date();
  const durationMinutes = Math.round((sleepEnd.getTime() - log[0].sleepStart.getTime()) / 60000);
  
  await db.update(wilborSleepLogs).set({
    sleepEnd,
    durationMinutes,
  }).where(eq(wilborSleepLogs.id, sleepLogId));
  
  return { id: sleepLogId, sleepEnd, durationMinutes };
}

export async function updateSleepQuality(sleepLogId: number, quality: "good" | "restless" | "bad", notes?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(wilborSleepLogs).set({ quality, notes: notes || null }).where(eq(wilborSleepLogs.id, sleepLogId));
}

export async function getActiveSleep(userId: number, babyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(wilborSleepLogs)
    .where(and(
      eq(wilborSleepLogs.userId, userId),
      eq(wilborSleepLogs.babyId, babyId),
    ))
    .orderBy(desc(wilborSleepLogs.createdAt))
    .limit(1);
  const log = result[0];
  if (log && !log.sleepEnd) return log;
  return undefined;
}

export async function getRecentSleepLogs(userId: number, babyId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborSleepLogs)
    .where(and(
      eq(wilborSleepLogs.userId, userId),
      eq(wilborSleepLogs.babyId, babyId),
    ))
    .orderBy(desc(wilborSleepLogs.sleepStart))
    .limit(limit);
}

export function predictNextNap(sleepLogs: any[], babyAgeWeeks: number): { suggestedTime: Date | null; confidence: string } {
  // Janelas de vigília por idade (em minutos)
  const wakeWindows: Record<string, number> = {
    "0-4": 50,    // 0-1 mês
    "4-8": 65,    // 1-2 meses
    "8-12": 80,   // 2-3 meses
    "12-16": 100, // 3-4 meses
    "16-26": 130, // 4-6 meses
    "26-39": 165, // 6-9 meses
    "39-52": 210, // 9-12 meses
  };

  // Determinar janela de vigília baseada na idade
  let baseWakeWindow = 60; // default 1h
  if (babyAgeWeeks <= 4) baseWakeWindow = wakeWindows["0-4"];
  else if (babyAgeWeeks <= 8) baseWakeWindow = wakeWindows["4-8"];
  else if (babyAgeWeeks <= 12) baseWakeWindow = wakeWindows["8-12"];
  else if (babyAgeWeeks <= 16) baseWakeWindow = wakeWindows["12-16"];
  else if (babyAgeWeeks <= 26) baseWakeWindow = wakeWindows["16-26"];
  else if (babyAgeWeeks <= 39) baseWakeWindow = wakeWindows["26-39"];
  else baseWakeWindow = wakeWindows["39-52"];

  // Se temos logs recentes, calcular média real
  const completedLogs = sleepLogs.filter(l => l.sleepEnd && l.durationMinutes);
  
  if (completedLogs.length >= 3) {
    // Calcular intervalo médio entre sonecas (wake window real)
    const intervals: number[] = [];
    for (let i = 0; i < completedLogs.length - 1; i++) {
      const wakeUp = new Date(completedLogs[i].sleepEnd).getTime();
      const nextSleep = new Date(completedLogs[i + 1].sleepStart).getTime();
      // Só considerar se o intervalo é positivo e razoável (< 8h)
      if (nextSleep > wakeUp) {
        const intervalMin = (nextSleep - wakeUp) / 60000;
        if (intervalMin > 20 && intervalMin < 480) {
          intervals.push(intervalMin);
        }
      }
    }
    
    if (intervals.length >= 2) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      // Usar média ponderada: 60% dados reais + 40% referência por idade
      const adjustedWindow = Math.round(avgInterval * 0.6 + baseWakeWindow * 0.4);
      
      // Última vez que acordou
      const lastWakeUp = completedLogs[0].sleepEnd;
      if (lastWakeUp) {
        const suggestedTime = new Date(new Date(lastWakeUp).getTime() + adjustedWindow * 60000);
        return { suggestedTime, confidence: "high" };
      }
    }
  }
  
  // Sem dados suficientes: usar referência por idade
  const lastLog = completedLogs[0];
  if (lastLog?.sleepEnd) {
    const suggestedTime = new Date(new Date(lastLog.sleepEnd).getTime() + baseWakeWindow * 60000);
    return { suggestedTime, confidence: "low" };
  }
  
  return { suggestedTime: null, confidence: "none" };
}

// ==========================================
// DIARY OPERATIONS
// ==========================================

export async function createDiaryEntry(data: {
  userId: number;
  babyId: number;
  entryDate: Date;
  category?: "feeding" | "sleep" | "diaper" | "milestone" | "health" | "mood" | "general";
  title?: string;
  content?: string;
  mood?: "happy" | "calm" | "fussy" | "crying" | "sick";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(wilborDiaryEntries).values({
    userId: data.userId,
    babyId: data.babyId,
    entryDate: data.entryDate,
    category: data.category || "general",
    title: data.title || null,
    content: data.content || null,
    mood: data.mood || null,
  });
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: insertId, ...data };
}

export async function getDiaryEntries(userId: number, babyId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborDiaryEntries)
    .where(and(
      eq(wilborDiaryEntries.userId, userId),
      eq(wilborDiaryEntries.babyId, babyId),
    ))
    .orderBy(desc(wilborDiaryEntries.entryDate))
    .limit(limit);
}

export async function updateDiaryEntry(entryId: number, data: {
  title?: string;
  content?: string;
  mood?: "happy" | "calm" | "fussy" | "crying" | "sick";
  category?: "feeding" | "sleep" | "diaper" | "milestone" | "health" | "mood" | "general";
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(wilborDiaryEntries).set(data).where(eq(wilborDiaryEntries.id, entryId));
}

export async function deleteDiaryEntry(entryId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(wilborDiaryEntries).where(eq(wilborDiaryEntries.id, entryId));
}

// ==========================================
// DEVELOPMENT TRAIL OPERATIONS
// ==========================================

// Marcos de desenvolvimento por semana (baseado em SBP/AAP)
export const DEVELOPMENT_MILESTONES: Record<number, { key: string; label_pt: string; label_en: string; label_es: string; area: string }[]> = {
  4: [
    { key: "focus_face", label_pt: "Foca no rosto", label_en: "Focuses on face", label_es: "Enfoca el rostro", area: "visual" },
    { key: "reacts_sound", label_pt: "Reage a sons", label_en: "Reacts to sounds", label_es: "Reacciona a sonidos", area: "auditory" },
    { key: "lifts_head_briefly", label_pt: "Levanta cabeça brevemente", label_en: "Lifts head briefly", label_es: "Levanta cabeza brevemente", area: "motor" },
  ],
  8: [
    { key: "social_smile", label_pt: "Sorriso social", label_en: "Social smile", label_es: "Sonrisa social", area: "social" },
    { key: "follows_object", label_pt: "Segue objeto com olhos", label_en: "Follows object with eyes", label_es: "Sigue objeto con ojos", area: "visual" },
    { key: "coos", label_pt: "Emite sons (arrulhos)", label_en: "Coos", label_es: "Emite sonidos (arrullos)", area: "language" },
    { key: "head_control_45", label_pt: "Sustenta cabeça a 45°", label_en: "Holds head at 45°", label_es: "Sostiene cabeza a 45°", area: "motor" },
  ],
  12: [
    { key: "laughs", label_pt: "Ri alto", label_en: "Laughs out loud", label_es: "Ríe en voz alta", area: "social" },
    { key: "reaches_objects", label_pt: "Tenta alcançar objetos", label_en: "Reaches for objects", label_es: "Intenta alcanzar objetos", area: "motor" },
    { key: "holds_head_steady", label_pt: "Sustenta cabeça firme", label_en: "Holds head steady", label_es: "Sostiene cabeza firme", area: "motor" },
    { key: "recognizes_parents", label_pt: "Reconhece pais", label_en: "Recognizes parents", label_es: "Reconoce padres", area: "social" },
  ],
  16: [
    { key: "rolls_tummy_back", label_pt: "Rola de barriga para costas", label_en: "Rolls tummy to back", label_es: "Rueda de barriga a espalda", area: "motor" },
    { key: "grasps_rattle", label_pt: "Agarra chocalho", label_en: "Grasps rattle", label_es: "Agarra sonajero", area: "motor" },
    { key: "babbles", label_pt: "Balbucia (ba-ba, ma-ma)", label_en: "Babbles (ba-ba, ma-ma)", label_es: "Balbucea (ba-ba, ma-ma)", area: "language" },
  ],
  20: [
    { key: "sits_support", label_pt: "Senta com apoio", label_en: "Sits with support", label_es: "Se sienta con apoyo", area: "motor" },
    { key: "transfers_objects", label_pt: "Transfere objetos entre mãos", label_en: "Transfers objects between hands", label_es: "Transfiere objetos entre manos", area: "motor" },
    { key: "stranger_anxiety", label_pt: "Estranha desconhecidos", label_en: "Stranger anxiety", label_es: "Ansiedad con extraños", area: "social" },
  ],
  26: [
    { key: "sits_alone", label_pt: "Senta sozinho", label_en: "Sits alone", label_es: "Se sienta solo", area: "motor" },
    { key: "responds_name", label_pt: "Responde ao nome", label_en: "Responds to name", label_es: "Responde al nombre", area: "language" },
    { key: "pincer_grasp_start", label_pt: "Início da pinça", label_en: "Pincer grasp starting", label_es: "Inicio de pinza", area: "motor" },
  ],
  36: [
    { key: "crawls", label_pt: "Engatinha", label_en: "Crawls", label_es: "Gatea", area: "motor" },
    { key: "pulls_to_stand", label_pt: "Levanta apoiando", label_en: "Pulls to stand", label_es: "Se levanta apoyándose", area: "motor" },
    { key: "says_mama_dada", label_pt: "Fala mama/papa", label_en: "Says mama/dada", label_es: "Dice mamá/papá", area: "language" },
    { key: "waves_bye", label_pt: "Dá tchau", label_en: "Waves bye-bye", label_es: "Dice adiós", area: "social" },
  ],
  48: [
    { key: "walks_alone", label_pt: "Anda sozinho", label_en: "Walks alone", label_es: "Camina solo", area: "motor" },
    { key: "says_words", label_pt: "Fala 3+ palavras", label_en: "Says 3+ words", label_es: "Dice 3+ palabras", area: "language" },
    { key: "drinks_cup", label_pt: "Bebe no copo", label_en: "Drinks from cup", label_es: "Bebe del vaso", area: "motor" },
    { key: "points_wants", label_pt: "Aponta para o que quer", label_en: "Points to what they want", label_es: "Señala lo que quiere", area: "language" },
  ],
};

export function getMilestonesForWeek(weekNumber: number): { weekKey: number; milestones: typeof DEVELOPMENT_MILESTONES[4] } {
  // Encontrar o marco mais próximo (anterior ou igual)
  const weekKeys = Object.keys(DEVELOPMENT_MILESTONES).map(Number).sort((a, b) => a - b);
  let matchedWeek = weekKeys[0];
  for (const wk of weekKeys) {
    if (wk <= weekNumber) matchedWeek = wk;
    else break;
  }
  return { weekKey: matchedWeek, milestones: DEVELOPMENT_MILESTONES[matchedWeek] || [] };
}

export async function getBabyMilestones(userId: number, babyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wilborDevMilestones)
    .where(and(
      eq(wilborDevMilestones.userId, userId),
      eq(wilborDevMilestones.babyId, babyId),
    ))
    .orderBy(wilborDevMilestones.weekNumber);
}

export async function toggleMilestone(userId: number, babyId: number, weekNumber: number, milestoneKey: string, achieved: "yes" | "no" | "partial") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if exists
  const existing = await db.select().from(wilborDevMilestones)
    .where(and(
      eq(wilborDevMilestones.userId, userId),
      eq(wilborDevMilestones.babyId, babyId),
      eq(wilborDevMilestones.milestoneKey, milestoneKey),
    ))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(wilborDevMilestones).set({
      achieved,
      achievedAt: achieved === "yes" ? new Date() : null,
    }).where(eq(wilborDevMilestones.id, existing[0].id));
    return { id: existing[0].id, achieved };
  } else {
    const result = await db.insert(wilborDevMilestones).values({
      userId,
      babyId,
      weekNumber,
      milestoneKey,
      achieved,
      achievedAt: achieved === "yes" ? new Date() : null,
    });
    const insertId = (result as any)[0]?.insertId || (result as any).insertId;
    return { id: insertId, achieved };
  }
}

// ==========================================
// MOTHER HEALTH OPERATIONS ("Meu Corpo")
// ==========================================

export async function getMotherProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(wilborMotherProfile).where(eq(wilborMotherProfile.userId, userId)).limit(1);
  return rows[0] || null;
}

export async function upsertMotherProfile(data: {
  userId: number;
  heightCm: number;
  prePregnancyWeightKg?: number;
  goalWeightKg?: number;
  deliveryType?: "normal" | "cesarean";
  deliveryDate?: Date;
  isBreastfeeding?: "true" | "false";
  postpartumPhase?: "resguardo" | "40dias" | "3meses" | "6meses" | "12meses";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(wilborMotherProfile).where(eq(wilborMotherProfile.userId, data.userId)).limit(1);

  if (existing.length > 0) {
    await db.update(wilborMotherProfile)
      .set({
        heightCm: data.heightCm,
        prePregnancyWeightKg: data.prePregnancyWeightKg ?? existing[0].prePregnancyWeightKg,
        goalWeightKg: data.goalWeightKg ?? existing[0].goalWeightKg,
        deliveryType: data.deliveryType ?? existing[0].deliveryType,
        deliveryDate: data.deliveryDate ?? existing[0].deliveryDate,
        isBreastfeeding: data.isBreastfeeding ?? existing[0].isBreastfeeding,
        postpartumPhase: data.postpartumPhase ?? existing[0].postpartumPhase,
      })
      .where(eq(wilborMotherProfile.userId, data.userId));
    return existing[0];
  }

  const result = await db.insert(wilborMotherProfile).values({
    userId: data.userId,
    heightCm: data.heightCm,
    prePregnancyWeightKg: data.prePregnancyWeightKg || null,
    goalWeightKg: data.goalWeightKg || null,
    deliveryType: data.deliveryType || "normal",
    deliveryDate: data.deliveryDate || null,
    isBreastfeeding: data.isBreastfeeding || "true",
    postpartumPhase: data.postpartumPhase || "resguardo",
  });
  return { id: result[0].insertId, ...data };
}

export async function addWeighIn(userId: number, weightGrams: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(wilborMotherWeighIns).values({
    userId,
    weightGrams,
    measuredAt: new Date(),
    notes: notes || null,
  });
  return { id: result[0].insertId };
}

export async function getWeighIns(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wilborMotherWeighIns)
    .where(eq(wilborMotherWeighIns.userId, userId))
    .orderBy(desc(wilborMotherWeighIns.measuredAt))
    .limit(limit);
}

export async function deleteWeighIn(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(wilborMotherWeighIns)
    .where(and(eq(wilborMotherWeighIns.id, id), eq(wilborMotherWeighIns.userId, userId)));
}
