import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { wilborMessages, wilborConversations, wilborBabies, wilborUsers } from "../drizzle/schema";
import { getWilborSystemPrompt } from "./wilborPrompt";
import { invokeLLM } from "./_core/llm";

type WilborCategory = "sono" | "colica" | "salto" | "alimentacao" | "seguranca" | "sos" | "geral";
type SupportedLanguage = "pt" | "en" | "es" | "fr" | "de";

function sanitizeChatMessages(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
) {
  return messages
    .filter((message) => typeof message?.content === "string")
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

function extractAssistantText(response: any): string {
  const raw = response?.choices?.[0]?.message?.content;

  if (typeof raw === "string") {
    return raw.trim();
  }

  if (Array.isArray(raw)) {
    const joined = raw
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();

    if (joined) return joined;
  }

  return "Desculpe, não consegui processar sua mensagem.";
}

export type SimpleChatResponse = {
  content: string;
};

export { sanitizeChatMessages };

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// 1. Otimização de busca/criação (Menos latência)
export async function getOrCreateConversation(
  userId: number,
  babyId: number | null,
  category: WilborCategory
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [existing] = await db
    .select()
    .from(wilborConversations)
    .where(
      and(
        eq(wilborConversations.userId, userId),
        eq(wilborConversations.category, category),
        babyId ? eq(wilborConversations.babyId, babyId) : undefined
      )
    )
    .limit(1);

  if (existing) return existing;

  const insertResult = await db.insert(wilborConversations).values({
    userId,
    babyId: babyId ?? undefined,
    category,
    status: "active",
  }).$returningId();

  const createdId = insertResult?.[0]?.id;

  if (createdId) {
    const [created] = await db
      .select()
      .from(wilborConversations)
      .where(eq(wilborConversations.id, createdId))
      .limit(1);

    if (created) return created;
  }

  return {
    id: createdId ?? 0,
    userId,
    anonymousSessionId: null,
    babyId: babyId ?? null,
    category,
    status: "active" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// 2. Contexto Inteligente (Foco em ROI e Precisão)
export async function buildChatContext(userId: number, babyId: number | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [userData] = await db.select().from(wilborUsers).where(eq(wilborUsers.id, userId)).limit(1);
  if (!userData) throw new Error("User not found");

  let babyData = null;
  if (babyId) {
    const [baby] = await db.select().from(wilborBabies).where(eq(wilborBabies.id, babyId)).limit(1);
    babyData = baby;
  }

  let babyAge = "recém-nascido";
  if (babyData?.birthDate) {
    const diff = Date.now() - new Date(babyData.birthDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 7) babyAge = `${days} dias`;
    else if (days < 30) babyAge = `${Math.floor(days / 7)} semanas`;
    else if (days < 365) babyAge = `${Math.floor(days / 30)} meses`;
    else babyAge = `${Math.floor(days / 365)} ano(s)`;
  }

  return {
    motherName: userData.name || "mãe",
    babyName: babyData?.name,
    babyAge,
    babyWeightGrams: babyData?.weightGrams,
    gestationalWeeks: babyData?.gestationalWeeks,
    syndromes: babyData?.syndromes,
    language: ((userData.language || "pt") as SupportedLanguage),
  };
}

// 3. Detecção de Emergência em 5 Idiomas (Segurança)
export function detectEmergency(userMessage: string, language: string): boolean {
  const keywords: Record<string, string[]> = {
    pt: ["febre alta", "sangue", "convulsão", "queda", "vômito em jato", "falta de ar", "cianose"],
    en: ["high fever", "blood", "seizure", "fall", "projectile vomit", "shortness of breath", "cyanosis"],
    es: ["fiebre alta", "sangre", "convulsión", "caída", "vómito en proyectil", "falta de aire"],
    fr: ["forte fièvre", "sang", "convulsion", "chute", "vomissement en jet", "difficulté à respirer"],
    de: ["hohes fieber", "blut", "krampfanfall", "sturz", "schwallartiges erbrechen", "atemnot"]
  };

  const list = keywords[language] || keywords.pt;
  const msg = userMessage.toLowerCase();
  return list.some(k => msg.includes(k));
}

// 4. Execução de Chat (Redução de custo de Tokens)
export async function generateWilborResponse(
  conversationId: number,
  userId: number,
  babyId: number | null,
  userMessage: string,
  category: WilborCategory
) {
  const context = await buildChatContext(userId, babyId);
  const systemPrompt = getWilborSystemPrompt(
    context.language,
    context.motherName,
    context.babyName,
    context.babyAge,
    context.babyWeightGrams ?? undefined,
    context.gestationalWeeks ?? undefined,
    context.syndromes ?? undefined
  );

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Busca apenas as últimas 10 mensagens para economizar Tokens de API
  const history = await db.select().from(wilborMessages)
    .where(eq(wilborMessages.conversationId, conversationId))
    .orderBy(desc(wilborMessages.createdAt))
    .limit(10);

  const messages = sanitizeChatMessages([
    { role: "system", content: systemPrompt },
    ...history.reverse().map((m) => ({ role: m.role, content: String(m.content ?? "") })),
    { role: "user", content: userMessage }
  ]);

  if (!messages.some((message) => message.role === "user")) {
    throw new Error("EMPTY_CHAT_MESSAGES");
  }

  const response = await invokeLLM({ messages: messages as any });
  const content = extractAssistantText(response);

  await db.insert(wilborMessages).values({
    conversationId,
    userId,
    role: "assistant",
    content,
  });

  return content;
}

/**
 * Simple chat endpoint for Dashboard
 * Processes message and returns response
 */
export async function simpleChatWithWilbor(
  userId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<SimpleChatResponse> {
  try {
    const sanitizedMessages = sanitizeChatMessages(messages);
    const hasUserMessage = sanitizedMessages.some((message) => message.role === "user");

    if (!hasUserMessage) {
      throw new Error("EMPTY_CHAT_MESSAGES");
    }

    const response = await invokeLLM({
      messages: sanitizedMessages as any,
    });

    const assistantMessage = extractAssistantText(response);

    return { content: assistantMessage };
  } catch (error) {
    console.error(`Chat error for user ${userId}:`, error);
    throw error;
  }
}
