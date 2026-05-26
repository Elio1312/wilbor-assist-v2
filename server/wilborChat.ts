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

// 4. Detecção de Cansaço na Escrita da Mãe
export interface FatigueAnalysis {
  isFatigued: boolean;
  score: number; // 0-100
  signals: string[];
}

export function detectMaternalFatigue(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): FatigueAnalysis {
  const signals: string[] = [];
  let score = 0;

  const msg = userMessage.trim();

  // Sinal 1 — Mensagem muito curta (menos de 15 chars, não é cumprimento)
  const greetings = ["oi", "olá", "ola", "hi", "hello", "hola", "bom dia", "boa tarde", "boa noite"];
  const isGreeting = greetings.some(g => msg.toLowerCase().startsWith(g));
  if (msg.length < 15 && !isGreeting) {
    score += 20;
    signals.push("mensagem_curta");
  }

  // Sinal 2 — Abreviações típicas de cansaço
  const abbreviations = [
    /\bq\b/,        // "q" em vez de "que"
    /\bpq\b/,       // "pq" em vez de "porque"
    /\bvc\b/,       // "vc" em vez de "você"
    /\bta\b/,       // "ta" em vez de "está"
    /\btb\b/,       // "tb" em vez de "também"
    /\bpfv\b/,      // "pfv" em vez de "por favor"
    /\bmsm\b/,      // "msm" em vez de "mesmo"
    /\bkk+\b/,      // risada abreviada
    /\brs+\b/,      // risada abreviada
  ];
  const abbrCount = abbreviations.filter(r => r.test(msg.toLowerCase())).length;
  if (abbrCount >= 2) {
    score += 15 * Math.min(abbrCount, 3);
    signals.push("abreviacoes");
  }

  // Sinal 3 — Ausência de pontuação em mensagem longa
  if (msg.length > 40 && !/[.!?;]/.test(msg)) {
    score += 15;
    signals.push("sem_pontuacao");
  }

  // Sinal 4 — Erros ortográficos comuns de digitação cansada
  const typoPatterns = [
    /\b(\w)\1{3,}\b/,   // letras repetidas (ex: "nãoooo", "ajudaaaa")
    /[a-z]{2,}\s[a-z]{1,2}\s[a-z]{2,}/i, // palavras muito curtas intercaladas
  ];
  if (typoPatterns.some(r => r.test(msg))) {
    score += 10;
    signals.push("erros_digitacao");
  }

  // Sinal 5 — Palavras explícitas de exaustão
  const exhaustionWords: Record<string, string[]> = {
    pt: ["cansada", "exausta", "sem dormir", "não aguento", "nao aguento", "esgotada", "não consigo", "nao consigo", "socorro", "desesperada", "chorando", "3 da manhã", "2 da manhã", "madrugada", "sem dormir"],
    en: ["exhausted", "tired", "no sleep", "can't sleep", "desperate", "crying", "3am", "2am", "middle of the night"],
    es: ["agotada", "cansada", "sin dormir", "no puedo", "desesperada", "llorando", "madrugada"],
    fr: ["épuisée", "fatiguée", "sans dormir", "je n'en peux plus", "désespérée"],
    de: ["erschöpft", "müde", "kein schlaf", "ich kann nicht mehr", "verzweifelt"],
  };
  const allExhaustionWords = Object.values(exhaustionWords).flat();
  if (allExhaustionWords.some(w => msg.toLowerCase().includes(w))) {
    score += 35;
    signals.push("palavras_exaustao");
  }

  // Sinal 6 — Horário noturno (hora do servidor como proxy)
  const hour = new Date().getHours();
  if (hour >= 0 && hour <= 5) {
    score += 20;
    signals.push("horario_noturno");
  }

  // Sinal 7 — Padrão de mensagens curtas consecutivas no histórico
  const recentUserMsgs = conversationHistory
    .filter(m => m.role === "user")
    .slice(-3);
  if (recentUserMsgs.length >= 2 && recentUserMsgs.every(m => m.content.length < 20)) {
    score += 15;
    signals.push("historico_mensagens_curtas");
  }

  return {
    isFatigued: score >= 40,
    score: Math.min(score, 100),
    signals,
  };
}

// Injeta instrução de cansaço no system prompt quando detectado
export function buildFatigueInstruction(
  fatigue: FatigueAnalysis,
  motherName: string,
  language: SupportedLanguage
): string {
  if (!fatigue.isFatigued) return "";

  const instructions: Record<SupportedLanguage, string> = {
    pt: `\n\n[MODO CANSAÇO DETECTADO — score: ${fatigue.score}]\nA mãe parece exausta agora. Siga estas regras OBRIGATÓRIAS:\n1. Comece com uma frase curta de acolhimento (ex: "Ei ${motherName}, estou aqui. 💜")\n2. Use frases CURTAS — máximo 2 linhas por parágrafo\n3. Dê no máximo 2-3 dicas práticas, não uma lista longa\n4. Tom gentil, caloroso, como uma amiga de madrugada\n5. Se possível, termine com uma frase de encorajamento curta`,
    en: `\n\n[FATIGUE MODE DETECTED — score: ${fatigue.score}]\nThe mother seems exhausted. Follow these MANDATORY rules:\n1. Start with a short caring phrase (e.g., "Hey ${motherName}, I'm here. 💜")\n2. Use SHORT sentences — max 2 lines per paragraph\n3. Give at most 2-3 practical tips, not a long list\n4. Warm, gentle tone, like a friend in the middle of the night\n5. If possible, end with a short encouraging phrase`,
    es: `\n\n[MODO CANSANCIO DETECTADO — score: ${fatigue.score}]\nLa mamá parece agotada. Sigue estas reglas OBLIGATORIAS:\n1. Empieza con una frase corta de acogida (ej: "Oye ${motherName}, aquí estoy. 💜")\n2. Usa frases CORTAS — máximo 2 líneas por párrafo\n3. Da como máximo 2-3 consejos prácticos, no una lista larga\n4. Tono cálido y gentil, como una amiga a medianoche\n5. Si es posible, termina con una frase de aliento corta`,
    fr: `\n\n[MODE FATIGUE DÉTECTÉ — score: ${fatigue.score}]\nLa maman semble épuisée. Suivez ces règles OBLIGATOIRES:\n1. Commencez par une courte phrase d'accueil (ex: "Hé ${motherName}, je suis là. 💜")\n2. Utilisez des phrases COURTES — max 2 lignes par paragraphe\n3. Donnez au maximum 2-3 conseils pratiques, pas une longue liste\n4. Ton chaleureux et doux, comme une amie au milieu de la nuit`,
    de: `\n\n[ERSCHÖPFUNGSMODUS ERKANNT — score: ${fatigue.score}]\nDie Mutter scheint erschöpft zu sein. Befolge diese PFLICHTREGELN:\n1. Beginne mit einem kurzen fürsorglichen Satz (z.B.: "Hey ${motherName}, ich bin hier. 💜")\n2. Verwende KURZE Sätze — max 2 Zeilen pro Absatz\n3. Gib höchstens 2-3 praktische Tipps, keine lange Liste\n4. Warmer, sanfter Ton, wie eine Freundin mitten in der Nacht`,
  };

  return instructions[language] || instructions.pt;
}

// 5. Execução de Chat (Redução de custo de Tokens)
export async function generateWilborResponse(
  conversationId: number,
  userId: number,
  babyId: number | null,
  userMessage: string,
  category: WilborCategory
) {
  const context = await buildChatContext(userId, babyId);

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Busca apenas as últimas 10 mensagens para economizar Tokens de API
  const history = await db.select().from(wilborMessages)
    .where(eq(wilborMessages.conversationId, conversationId))
    .orderBy(desc(wilborMessages.createdAt))
    .limit(10);

  const historyForFatigue = history.reverse().map((m) => ({
    role: m.role,
    content: String(m.content ?? ""),
  }));

  // Detectar cansaço e injetar instrução no system prompt
  const fatigue = detectMaternalFatigue(userMessage, historyForFatigue);
  const fatigueInstruction = buildFatigueInstruction(
    fatigue,
    context.motherName,
    context.language
  );
  if (fatigue.isFatigued) {
    console.log(`[Wilbor] Fatigue detected for user ${userId} — score: ${fatigue.score}, signals: ${fatigue.signals.join(", ")}`);
  }

  const systemPrompt = getWilborSystemPrompt(
    context.language,
    context.motherName,
    context.babyName,
    context.babyAge,
    context.babyWeightGrams ?? undefined,
    context.gestationalWeeks ?? undefined,
    context.syndromes ?? undefined
  ) + fatigueInstruction;

  const messages = sanitizeChatMessages([
    { role: "system", content: systemPrompt },
    ...historyForFatigue.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
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
 * Processes message and returns response + imageUrl from RAG when available
 */
export async function simpleChatWithWilbor(
  userId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<{ content: string; imageUrl: string | null }> {
  try {
    const topicHintRaw = messages.find((message) => message.role === "system" && message.content.startsWith("[DASHBOARD_TOPIC]:"))?.content;
    const topicHint = topicHintRaw?.replace("[DASHBOARD_TOPIC]:", "").trim().toLowerCase();
    const topicMap: Record<string, "geral" | "sono" | "colica" | "salto" | "alimentacao" | "febre" | "seguranca"> = {
      sleep: "sono",
      colic: "colica",
      milestones: "salto",
      feeding: "alimentacao",
      fever: "febre",
      mother: "geral",
      geral: "geral",
    };
    const ragCategory = topicMap[topicHint || "geral"] ?? "geral";

    const sanitizedMessages = sanitizeChatMessages(
      messages.filter((message) => !message.content.startsWith("[DASHBOARD_TOPIC]:"))
    );
    const userMessages = sanitizedMessages.filter((message) => message.role === "user");

    // Try to extract imageUrl from RAG knowledge base
    // Busca imagem nas primeiras perguntas reais sobre o tema para enriquecer a conversa
    let imageUrl: string | null = null;
    try {
      const { searchKnowledgeBase } = await import("./wilborRAG");
      const realUserMessages = userMessages.filter(
        (message) => !message.content.startsWith("[DASHBOARD_TOPIC]")
      );
      const lastUserMsg = [...realUserMessages].reverse()[0];
      const shouldAttachImage = ragCategory !== "geral" && realUserMessages.length <= 3;
      if (lastUserMsg && shouldAttachImage) {
        const entries = await searchKnowledgeBase(lastUserMsg.content, ragCategory, undefined);
        if (entries.length > 0 && entries[0].imageUrl) {
          imageUrl = entries[0].imageUrl;
        }
      }
    } catch (_) {
      // RAG search failed, continue without imageUrl
    }
    const hasUserMessage = userMessages.length > 0;
    if (!hasUserMessage) {
      throw new Error("EMPTY_CHAT_MESSAGES");
    }

    // Detectar cansaço e injetar instrução no system prompt existente
    const lastUserMsg = [...sanitizedMessages].reverse().find(m => m.role === "user");
    const conversationHistory = sanitizedMessages.filter(m => m.role !== "system");
    if (lastUserMsg) {
      const fatigue = detectMaternalFatigue(lastUserMsg.content, conversationHistory);
      if (fatigue.isFatigued) {
        console.log(`[Wilbor] Fatigue detected (anon user ${userId}) — score: ${fatigue.score}, signals: ${fatigue.signals.join(", ")}`);
        const fatigueInstruction = buildFatigueInstruction(fatigue, "mãe", "pt");
        // Injeta no system prompt existente ou cria um novo
        const sysIdx = sanitizedMessages.findIndex(m => m.role === "system");
        if (sysIdx >= 0) {
          sanitizedMessages[sysIdx] = {
            ...sanitizedMessages[sysIdx],
            content: sanitizedMessages[sysIdx].content + fatigueInstruction,
          };
        } else {
          sanitizedMessages.unshift({ role: "system", content: fatigueInstruction.trim() });
        }
      }
    }

    const response = await invokeLLM({
      messages: sanitizedMessages as any,
    });

    const assistantMessage = extractAssistantText(response);

    return { content: assistantMessage, imageUrl };
  } catch (error) {
    console.error(`Chat error for user ${userId}:`, error);
    throw error;
  }
}
