import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { wilborMessages, wilborConversations, wilborBabies, wilborUsers } from "../drizzle/schema";
import { getWilborSystemPrompt } from "./wilborPrompt";
import { invokeLLM } from "./_core/llm";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// 1. Otimização de busca/criação (Menos latência)
export async function getOrCreateConversation(
  userId: number,
  babyId: number | null,
  category: string
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

  // Inserção com retorno imediato (evita o segundo SELECT)
  const [created] = await db.insert(wilborConversations).values({
    userId,
    babyId: babyId || undefined,
    category,
    status: "active",
  }).returning();

  return created || {
    id: 0,
    userId,
    babyId: babyId || null,
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
    language: (userData.language || "pt") as "pt" | "en" | "es" | "fr" | "de",
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
  category: any
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

  const db = await getDb();
  // Busca apenas as últimas 10 mensagens para economizar Tokens de API
  const history = await db.select().from(wilborMessages)
    .where(eq(wilborMessages.conversationId, conversationId))
    .orderBy(desc(wilborMessages.createdAt))
    .limit(10);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.reverse().map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  const response = await invokeLLM({ messages: messages as any });
  const content = response.choices[0]?.message?.content || "";

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
): Promise<string> {
  try {
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
