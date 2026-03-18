import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { wilborMessages, wilborConversations, wilborBabies, wilborUsers, InsertWilborMessage } from "../drizzle/schema";
import { getWilborSystemPrompt } from "./wilborPrompt";
import { invokeLLM } from "./_core/llm";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getOrCreateConversation(
  userId: number,
  babyId: number | null,
  category: "sono" | "colica" | "salto" | "alimentacao" | "seguranca" | "sos" | "geral"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [
    eq(wilborConversations.userId, userId),
    eq(wilborConversations.category, category),
  ];
  
  if (babyId) {
    conditions.push(eq(wilborConversations.babyId, babyId));
  }

  const existing = await db
    .select()
    .from(wilborConversations)
    .where(and(...(conditions as any)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(wilborConversations).values({
    userId,
    babyId: babyId || undefined,
    category,
    status: "active",
  });

  // Fetch the newly created conversation
  const created = await db
    .select()
    .from(wilborConversations)
    .where(
      and(
        eq(wilborConversations.userId, userId),
        eq(wilborConversations.category, category)
      )
    )
    .orderBy(wilborConversations.createdAt)
    .limit(1);

  return created[0] || {
    id: 0,
    userId,
    babyId: babyId || null,
    category,
    status: "active" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getConversationHistory(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const messages = await db
    .select()
    .from(wilborMessages)
    .where(eq(wilborMessages.conversationId, conversationId))
    .orderBy(wilborMessages.createdAt);

  return messages;
}

export async function saveMessage(
  conversationId: number,
  userId: number,
  role: "user" | "assistant" | "system",
  content: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(wilborMessages).values({
    conversationId,
    userId,
    role,
    content,
  });

  return result;
}

export async function buildChatContext(userId: number, babyId: number | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get user info
  const user = await db
    .select()
    .from(wilborUsers)
    .where(eq(wilborUsers.id, userId))
    .limit(1);

  if (user.length === 0) {
    throw new Error("User not found");
  }

  const userData = user[0];
  let babyData = null;

  // Get baby info if specified
  if (babyId) {
    const baby = await db
      .select()
      .from(wilborBabies)
      .where(eq(wilborBabies.id, babyId))
      .limit(1);

    if (baby.length > 0) {
      babyData = baby[0];
    }
  }

  // Calculate baby age
  let babyAge: string | undefined = undefined;
  if (babyData?.birthDate) {
    const birthDate = new Date(babyData.birthDate);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const ageInWeeks = Math.floor(ageInDays / 7);
    const ageInMonths = Math.floor(ageInDays / 30);

    if (ageInMonths < 1) {
      babyAge = `${ageInWeeks} weeks`;
    } else if (ageInMonths < 12) {
      babyAge = `${ageInMonths} months`;
    } else {
      babyAge = `${Math.floor(ageInMonths / 12)} year(s)`;
    }
  }

  return {
    motherName: userData.name || "mãe",
    babyName: babyData?.name,
    babyAge,
    babyWeightGrams: babyData?.weightGrams || undefined,
    gestationalWeeks: babyData?.gestationalWeeks || undefined,
    syndromes: babyData?.syndromes || undefined,
    language: userData.language as "pt" | "en" | "es",
  };
}

export async function generateWilborResponse(
  conversationId: number,
  userId: number,
  babyId: number | null,
  userMessage: string,
  category: "sono" | "colica" | "salto" | "alimentacao" | "seguranca" | "sos" | "geral"
) {
  const context = await buildChatContext(userId, babyId);
  const systemPrompt = getWilborSystemPrompt(
    context.language,
    context.motherName,
    context.babyName,
    context.babyAge,
    context.babyWeightGrams,
    context.gestationalWeeks,
    context.syndromes
  );

  // Get conversation history
  const history = await getConversationHistory(conversationId);

  // Build messages array for LLM
  const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
    { role: "system", content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  // Call LLM
  const response = await invokeLLM({
    messages: messages as any,
  });

  const assistantMessage = typeof response.choices[0]?.message?.content === "string" 
    ? response.choices[0].message.content 
    : "";

  // Save assistant message
  await saveMessage(conversationId, userId, "assistant", assistantMessage);

  return assistantMessage;
}

export function detectEmergency(userMessage: string, language: "pt" | "en" | "es"): boolean {
  const emergencyKeywords: Record<string, string[]> = {
    pt: ["febre alta", "sangue", "convulsão", "queda", "vômito em jato", "falta de ar", "dificuldade respirar", "cianose", "desmaio"],
    en: ["high fever", "blood", "seizure", "fall", "projectile vomit", "difficulty breathing", "cyanosis", "fainting"],
    es: ["fiebre alta", "sangue", "convulsión", "caída", "vómito en proyectil", "dificultad respirar", "cianosis", "desmayo"],
  };

  const keywords = emergencyKeywords[language] || emergencyKeywords.pt;
  const lowerMessage = userMessage.toLowerCase();

  return keywords.some(keyword => lowerMessage.includes(keyword));
}


/**
 * Simple chat endpoint for Dashboard
 * Processes message and returns response
 */
export async function simpleChatWithWilbor(
  userId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    // Call LLM with messages
    const response = await invokeLLM({
      messages: messages as any,
    });

    const assistantMessage =
      typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : "Desculpe, não consegui processar sua mensagem.";

    return assistantMessage;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}
