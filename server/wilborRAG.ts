import { eq, and, desc, sql, like } from "drizzle-orm";
import { getDb } from "./db";
import {
  wilborKnowledgeBase,
  wilborUserCredits,
  wilborChatAnalytics,
  type WilborKnowledge,
} from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import crypto from "crypto";

// ==========================================
// TYPES
// ==========================================

export type RouteType = "cache" | "rag" | "llm_full" | "safety_filter";

export type RAGResult = {
  reply: string;
  routeType: RouteType;
  tokensEstimated: number;
  knowledgeUsed?: string; // which KB entry was used
  source?: string;
};

export type CreditStatus = {
  plan: string;
  messagesUsed: number;
  dailyLimit: number;
  remaining: number;
  ragMessagesUsed: number;
  cacheHits: number;
  totalSaved: number;
  isOverLimit: boolean;
};

/**
 * Get the next midnight in America/Sao_Paulo timezone (UTC-3).
 * Brazil abolished DST, so SP is always UTC-3.
 */
export function getNextMidnightSP(): Date {
  const now = new Date();
  const spDateStr = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const [year, month, day] = spDateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1, 3, 0, 0, 0));
}

/**
 * Get the start of today in America/Sao_Paulo timezone (UTC-3).
 */
export function getTodayStartSP(): Date {
  const now = new Date();
  const spDateStr = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const [year, month, day] = spDateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 3, 0, 0, 0));
}

// ==========================================
// KEYWORD MATCHING (Simple but effective)
// ==========================================

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  sono: [
    "sono", "dormir", "dormindo", "soneca", "acordar", "acordou", "noite", "madrugada",
    "vigilia", "vigília", "berço", "berco", "cama", "sleep", "nap", "wake", "night",
    "sueño", "dormir", "siesta", "despertar", "noche",
    "insônia", "insonia", "não dorme", "nao dorme", "dorme pouco",
  ],
  colica: [
    "cólica", "colica", "barriga", "gases", "gas",
    "massagem", "shantala", "swaddle", "charutinho", "bicicleta", "aviãozinho", "aviaozinho",
    "colic", "tummy", "gas", "massage",
    "cólico", "barriga", "masaje",
    // NOTE: "choro", "chorando", "chorar", "crying", "llanto" removed to avoid
    // false positive when mother says "choroso + febre" → should route to febre, not colica
  ],
  amamentacao: [
    "amamentação", "amamentacao", "amamentar", "mama", "mamar", "peito", "leite",
    "pega", "mamadeira", "fórmula", "formula", "livre demanda",
    "breastfeed", "latch", "nursing", "milk", "bottle", "formula",
    "lactancia", "amamantar", "pecho", "leche", "biberón", "biberon",
  ],
  salto: [
    "salto", "desenvolvimento", "leap", "wonder weeks", "fase", "regressão", "regressao",
    "marco", "milestone", "habilidade",
    "salto", "desarrollo", "fase", "regresión", "regresion", "hito",
    "irritado", "grudento", "carente", "clingy",
  ],
  seguranca: [
    "segurança", "seguranca", "acidente", "queda", "caiu", "engasgo", "engasgou",
    "sufocamento", "afogamento", "berço seguro", "berco seguro", "transporte",
    "bebê-conforto", "bebe conforto", "cadeirinha",
    "safety", "accident", "fall", "choking", "drowning", "car seat",
    "seguridad", "accidente", "caída", "atragantamiento", "ahogamiento",
  ],
  febre: [
    "febre", "temperatura", "quente", "termômetro", "termometro", "graus",
    "fever", "temperature", "hot", "thermometer", "degrees",
    "fiebre", "temperatura", "caliente", "termómetro", "grados",
    "febril", "estado febril",
  ],
  alimentacao: [
    "alimentação", "alimentacao", "comida", "papinha", "fruta", "introdução alimentar",
    "introducao alimentar", "BLW", "amassado", "sólido", "solido", "comer",
    "açúcar", "acucar", "mel", "suco", "ultraprocessado",
    "food", "solid", "puree", "feeding", "weaning", "sugar", "honey", "juice",
    "alimentación", "alimentacion", "comida", "papilla", "fruta", "sólido",
    "azúcar", "miel", "jugo", "ultraprocesado",
    "prontidão", "prontidao", "mastigação", "mastigacao",
  ],
  vacina: [
    "vacina", "vacinação", "vacinacao", "imunização", "imunizacao", "dose",
    "BCG", "hepatite", "pentavalente", "rotavírus", "rotavirus", "pneumocócica",
    "pneumococica", "meningocócica", "meningococica", "poliomielite", "VIP",
    "vaccine", "vaccination", "immunization", "shot", "booster",
    "vacuna", "vacunación", "vacunacion", "inmunización", "inmunizacion",
    "reação", "reacao", "reaction", "reacción", "reaccion",
  ],
  higiene_oral: [
    "dente", "dentes", "dentição", "denticao", "escova", "pasta", "flúor", "fluor",
    "gengiva", "morder", "mordendo", "babar", "babando", "salivação", "salivacao",
    "tooth", "teeth", "teething", "toothbrush", "toothpaste", "fluoride", "gum",
    "diente", "dientes", "dentición", "denticion", "cepillo", "pasta", "flúor",
    "encía", "encia", "morder", "babear",
  ],
  motor: [
    "engatinhar", "engatinhando", "andar", "andando", "sentar", "sentando",
    "cabeça", "cabeca", "sustentar", "rolar", "rolando", "ficar de pé", "ficar de pe",
    "primeiro passo", "primeiros passos", "motor",
    "crawl", "crawling", "walk", "walking", "sit", "sitting", "head control",
    "roll", "rolling", "stand", "standing", "first steps",
    "gatear", "gateando", "caminar", "caminando", "sentar", "sentando",
    "cabeza", "sostener", "rodar", "primer paso", "primeros pasos",
    "retrocesso", "retroceso", "regression",
  ],
};

// Additional emergency keywords from V1.1 that should trigger SOS priority
// IMPORTANT: Use multi-word phrases to avoid false positives on generic words
const SOS_PRIORITY_KEYWORDS = [
  // PT - multi-word to avoid false positives
  "moleira abaulada", "moleira funda", "fontanela abaulada",
  "cianose", "arroxeado inteiro", "arroxeada inteira",
  "gemência contínua", "gemencia continua",
  "prostração", "prostracao", "prostrado",
  "não acorda", "nao acorda", "costela afundando", "asa do nariz abrindo",
  "batimento nasal",
  // EN - multi-word
  "bulging fontanelle", "sunken fontanelle",
  "lethargic and limp", "rib retraction", "nasal flaring", "grunting continuously",
  // ES - multi-word
  "fontanela abultada", "fontanela hundida",
  "amoratado entero", "letárgico", "letargico",
  "retracción costal", "aleteo nasal",
];

/**
 * Normalize text for matching: lowercase, remove accents, trim
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Create a hash for cache lookup
 */
function createQueryHash(normalizedQuery: string, category: string): string {
  return crypto
    .createHash("sha256")
    .update(`${category}:${normalizedQuery}`)
    .digest("hex")
    .substring(0, 64);
}

/**
 * Detect category from message keywords
 */
export function detectCategory(message: string): string {
  const normalized = normalizeText(message);
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeText(keyword);
      if (normalized.includes(normalizedKeyword)) {
        scores[category]++;
      }
    }
  }

  // PRIORITY RULE: If "febre" has any score, it ALWAYS wins over "colica"
  // Reason: mother mentioning fever + crying should get fever guidance, not colic
  if (scores["febre"] && scores["febre"] > 0 && scores["colica"] && scores["colica"] > 0) {
    return "febre";
  }

  // Return category with highest score, or "geral" if no match
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "geral";
}

/**
 * Check if message contains SOS priority keywords (V1.1 sinais de alerta)
 */
export function checkSOSPriority(message: string): boolean {
  const normalized = normalizeText(message);
  for (const keyword of SOS_PRIORITY_KEYWORDS) {
    if (normalized.includes(normalizeText(keyword))) {
      return true;
    }
  }
  return false;
}

// ==========================================
// KNOWLEDGE BASE SEARCH (RAG Core)
// ==========================================

/**
 * Search knowledge base for relevant entries
 * Returns best matching knowledge entries sorted by relevance
 */
export async function searchKnowledgeBase(
  message: string,
  category: string,
  babyAgeWeeks?: number
): Promise<WilborKnowledge[]> {
  const db = await getDb();
  if (!db) return [];

  const normalized = normalizeText(message);

  // Get all active entries for the category (or geral)
  const entries = await db
    .select()
    .from(wilborKnowledgeBase)
    .where(
      and(
        eq(wilborKnowledgeBase.isActive, "true"),
      )
    )
    .orderBy(desc(wilborKnowledgeBase.priority));

  // Score each entry by keyword matching
  const scored = entries.map((entry) => {
    let score = 0;

    // Category match bonus
    if (entry.category === category) score += 5;

    // Keyword matching
    const entryKeywords = entry.keywords.split(",").map((k) => normalizeText(k.trim()));
    for (const keyword of entryKeywords) {
      if (keyword && normalized.includes(keyword)) {
        score += 3;
      }
    }

    // Question similarity (simple word overlap)
    const questionWords = normalizeText(entry.question).split(" ");
    const messageWords = normalized.split(" ");
    for (const word of questionWords) {
      if (word.length > 3 && messageWords.includes(word)) {
        score += 1;
      }
    }

    // Age range match bonus
    if (babyAgeWeeks !== undefined && entry.ageRangeStart !== null && entry.ageRangeEnd !== null) {
      if (babyAgeWeeks >= entry.ageRangeStart && babyAgeWeeks <= entry.ageRangeEnd) {
        score += 4; // Strong bonus for age-appropriate content
      }
    }

    // Priority bonus
    score += (entry.priority || 0);

    return { entry, score };
  });

  // Return entries with score >= 8, sorted by score
  // Minimum threshold of 8 prevents false positives from generic keyword matches
  // (category bonus=5 + at least one keyword=3 = 8 minimum for a relevant match)
  return scored
    .filter((s) => s.score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 matches
    .map((s) => s.entry);
}

// ==========================================
// RESPONSE CACHE
// ==========================================

// Cache functions removed - using RAG + LLM directly for now

// ==========================================
// USER CREDITS MANAGEMENT
// ==========================================

/**
 * Get or create user credits
 */
export async function getUserCredits(userId: number): Promise<CreditStatus> {
  const db = await getDb();
  if (!db) {
    return {
      plan: "free",
      messagesUsed: 0,
      dailyLimit: 5,
      remaining: 5,
      ragMessagesUsed: 0,
      cacheHits: 0,
      totalSaved: 0,
      isOverLimit: false,
    };
  }

  let credits = await db
    .select()
    .from(wilborUserCredits)
    .where(eq(wilborUserCredits.userId, userId))
    .limit(1);

  // Create if not exists - daily reset at midnight SP
  if (credits.length === 0) {
    const todayStart = getTodayStartSP();
    const periodEnd = getNextMidnightSP();
    await db.insert(wilborUserCredits).values({
      userId,
      plan: "free",
      monthlyLimit: 5, // column name kept for DB compat, logic is daily
      messagesUsed: 0,
      ragMessagesUsed: 0,
      cacheHits: 0,
      totalSaved: 0,
      periodStart: todayStart,
      periodEnd,
    });
    credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, userId))
      .limit(1);
  }

  const credit = credits[0];

  // Check if period has expired (past midnight SP), reset daily
  if (credit.periodEnd < new Date()) {
    const todayStart = getTodayStartSP();
    const newPeriodEnd = getNextMidnightSP();
    await db
      .update(wilborUserCredits)
      .set({
        messagesUsed: 0,
        ragMessagesUsed: 0,
        cacheHits: 0,
        totalSaved: 0,
        periodStart: todayStart,
        periodEnd: newPeriodEnd,
      })
      .where(eq(wilborUserCredits.id, credit.id));

    return {
      plan: credit.plan,
      messagesUsed: 0,
      dailyLimit: credit.monthlyLimit,
      remaining: credit.monthlyLimit,
      ragMessagesUsed: 0,
      cacheHits: 0,
      totalSaved: 0,
      isOverLimit: false,
    };
  }

  const remaining = credit.monthlyLimit - credit.messagesUsed;
  return {
    plan: credit.plan,
    messagesUsed: credit.messagesUsed,
    dailyLimit: credit.monthlyLimit,
    remaining: Math.max(0, remaining),
    ragMessagesUsed: credit.ragMessagesUsed,
    cacheHits: credit.cacheHits,
    totalSaved: credit.totalSaved,
    isOverLimit: remaining <= 0,
  };
}

/**
 * Increment usage counter based on route type
 */
export async function incrementUsage(
  userId: number,
  routeType: RouteType
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const credits = await db
    .select()
    .from(wilborUserCredits)
    .where(eq(wilborUserCredits.userId, userId))
    .limit(1);

  if (credits.length === 0) return;
  const credit = credits[0];

  switch (routeType) {
    case "llm_full":
      await db
        .update(wilborUserCredits)
        .set({ messagesUsed: credit.messagesUsed + 1 })
        .where(eq(wilborUserCredits.id, credit.id));
      break;
    case "rag":
      await db
        .update(wilborUserCredits)
        .set({
          ragMessagesUsed: credit.ragMessagesUsed + 1,
          totalSaved: credit.totalSaved + 1,
        })
        .where(eq(wilborUserCredits.id, credit.id));
      break;
    case "cache":
      await db
        .update(wilborUserCredits)
        .set({
          cacheHits: credit.cacheHits + 1,
          totalSaved: credit.totalSaved + 1,
        })
        .where(eq(wilborUserCredits.id, credit.id));
      break;
    case "safety_filter":
      await db
        .update(wilborUserCredits)
        .set({ totalSaved: credit.totalSaved + 1 })
        .where(eq(wilborUserCredits.id, credit.id));
      break;
  }
}

/**
 * Update user plan
 */
export async function updateUserPlan(
  userId: number,
  plan: "free" | "premium"
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const limits: Record<string, number> = {
    free: 5,      // 5 LLM messages per day
    premium: 500, // 500 per day - generous but not infinite
  };

  await db
    .update(wilborUserCredits)
    .set({
      plan,
      monthlyLimit: limits[plan],
    })
    .where(eq(wilborUserCredits.userId, userId));
}

// ==========================================
// ANALYTICS TRACKING
// ==========================================

export async function trackChatAnalytics(
  userId: number,
  conversationId: number | null,
  routeType: RouteType,
  category: string,
  tokensEstimated: number,
  responseTimeMs: number
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(wilborChatAnalytics).values({
    userId,
    conversationId,
    routeType,
    category,
    tokensEstimated,
    responseTimeMs,
  });
}

// ==========================================
// RAG RESPONSE FORMATTER (Uses minimal LLM)
// ==========================================

/**
 * Format a RAG response using minimal LLM tokens
 * Instead of sending the full system prompt (~3000 tokens),
 * we send only the knowledge text + a tiny formatting instruction (~200 tokens)
 */
export async function formatRAGResponse(
  knowledgeText: string,
  motherName: string,
  babyName: string | undefined,
  language: "pt" | "en" | "es",
  userMessage: string,
  triggerValue?: string | null,
  medicalAlert?: string | null,
  imageUrl?: string | null,
  isFirstMessage: boolean = true
): Promise<string> {
  const formatInstructions: Record<string, string> = {
    pt: `Você é Wilbor-Assist. Formate a resposta abaixo de forma acolhedora e CURTA.
REGRA CRÍTICA: O nome da mãe é ${motherName}. Use EXATAMENTE "${motherName}" ao se referir a ela. NÃO invente, troque ou use outro nome.${babyName ? ` O bebê se chama ${babyName}. Use EXATAMENTE "${babyName}".` : ""}
FORMATO OBRIGATÓRIO:
- ${isFirstMessage ? 'Cumprimento: 1 frase empática curta' : 'NÃO cumprimente. NÃO diga "Olá" ou "Oi". Vá direto ao ponto.'}
- Resposta: 2-3 frases objetivas com a orientação principal
- Finalizar com 1 pergunta de retorno para a mãe (criar diálogo)
- MÁXIMO 150 palavras. Não despeje tudo de uma vez.
- Use bullet points APENAS para 3+ passos práticos. Destaque ações com negrito.
- Quando incluir imagem, SEMPRE use formato markdown: ![descrição](url). NUNCA cole URL pura.
- Se a pergunta da mãe for vaga ou curta (1-3 palavras), PERGUNTE mais antes de responder.`,
    en: `You are Wilbor-Assist. Format the answer below warmly and BRIEFLY.
CRITICAL RULE: The mother's name is ${motherName}. Use EXACTLY "${motherName}" when referring to her. Do NOT invent, change or use any other name.${babyName ? ` The baby's name is ${babyName}. Use EXACTLY "${babyName}".` : ""}
REQUIRED FORMAT:
- ${isFirstMessage ? 'Greeting: 1 short empathetic sentence' : 'Do NOT greet. Do NOT say "Hi" or "Hello". Go straight to the answer.'}
- Answer: 2-3 objective sentences with the main guidance
- End with 1 follow-up question to the mother (create dialogue)
- MAX 150 words. Don't dump everything at once.
- Use bullet points ONLY for 3+ practical steps. Bold key actions.
- When including images, ALWAYS use markdown format: ![description](url). NEVER paste raw URLs.
- If the mother's question is vague or short (1-3 words), ASK for more context before answering.`,
    es: `Eres Wilbor-Assist. Formatea la respuesta abajo de forma cálida y BREVE.
REGLA CRÍTICA: El nombre de la madre es ${motherName}. Usa EXACTAMENTE "${motherName}" al referirte a ella. NO inventes, cambies ni uses otro nombre.${babyName ? ` El bebé se llama ${babyName}. Usa EXACTAMENTE "${babyName}".` : ""}
FORMATO OBLIGATORIO:
- ${isFirstMessage ? 'Saludo: 1 frase empática corta' : 'NO saludes. NO digas "Hola". Ve directo a la respuesta.'}
- Respuesta: 2-3 frases objetivas con la orientación principal
- Finalizar con 1 pregunta de retorno a la madre (crear diálogo)
- MÁXIMO 150 palabras. No vuelques todo de una vez.
- Usa viñetas SOLO para 3+ pasos prácticos. Destaca acciones en negrita.
- Cuando incluyas imágenes, SIEMPRE usa formato markdown: ![descripción](url). NUNCA pegues URL pura.
- Si la pregunta de la mamá es vaga o corta (1-3 palabras), PREGUNTA más antes de responder.`,
  };

  let fullKnowledge = knowledgeText;
  if (triggerValue) fullKnowledge += `\n\nDado importante: ${triggerValue}`;
  if (medicalAlert) fullKnowledge += `\n\n⚠️ Alerta: ${medicalAlert}`;

  const sourceLabel: Record<string, string> = {
    pt: "\n\n📋 *Baseado nas diretrizes da Sociedade Brasileira de Pediatria (SBP)*",
    en: "\n\n📋 *Based on American Academy of Pediatrics (AAP) guidelines*",
    es: "\n\n📋 *Basado en las directrices de la Sociedad Española de Pediatría (AEP)*",
  };

  const messages = [
    {
      role: "system" as const,
      content: formatInstructions[language] || formatInstructions.pt,
    },
    {
      role: "user" as const,
      content: `Pergunta da mãe: "${userMessage}"\n\nConhecimento técnico para usar na resposta:\n${fullKnowledge}\n\nIMPORTANTE: Inclua ao final: ${sourceLabel[language]}${imageUrl ? `\n\nInclua esta imagem na resposta: ${imageUrl}` : ""}`,
    },
  ];

  const response = await invokeLLM({ messages });
  const reply = response.choices?.[0]?.message?.content;

  if (!reply) throw new Error("No response from LLM");
  if (typeof reply === "string") return reply;
  if (Array.isArray(reply)) {
    const textContent = reply.find((part: any) => part.type === "text");
    if (textContent && "text" in textContent) return (textContent as any).text;
  }
  throw new Error("Unexpected response format from LLM");
}

// ==========================================
// MAIN ROUTER: Decide route for each message
// ==========================================

export type RouterContext = {
  motherName: string;
  babyName?: string;
  babyAgeWeeks?: number;
  language: "pt" | "en" | "es";
  conversationCategory: string;
};

/**
 * The Smart Router - decides how to handle each message
 * 
 * Flow:
 * 1. Check SOS priority keywords → emergency response (no LLM)
 * 2. Detect category from message
 * 3. Check cache for exact/similar match → return cached (no LLM)
 * 4. Search knowledge base (RAG) → format with minimal LLM
 * 5. Fall through to full LLM (complex questions)
 */
export async function routeMessage(
  message: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  ctx: RouterContext
): Promise<RAGResult> {
  const startTime = Date.now();

  // Step 1: Detect category
  const detectedCategory = detectCategory(message);
  const category = detectedCategory !== "geral" ? detectedCategory : ctx.conversationCategory;

  // Step 2: Check SOS priority (V1.1 sinais de alerta)
  if (checkSOSPriority(message)) {
    // These are critical - still use full LLM but with SOS context
    return {
      reply: "", // Will be handled by full LLM with SOS priority flag
      routeType: "llm_full",
      tokensEstimated: 0,
      knowledgeUsed: "SOS_PRIORITY",
    };
  }

  // Determine if this is the first message (no assistant replies yet)
  const isFirstMessage = conversationHistory.filter(m => m.role === 'assistant').length === 0;

  // Step 4: Search knowledge base (RAG)
  const knowledgeEntries = await searchKnowledgeBase(message, category, ctx.babyAgeWeeks);

  if (knowledgeEntries.length > 0) {
    const bestEntry = knowledgeEntries[0];
    const langMap: Record<string, string> = {
      pt: bestEntry.answerPt,
      en: bestEntry.answerEn,
      es: bestEntry.answerEs,
    };
    const knowledgeText = langMap[ctx.language] || bestEntry.answerPt;

    try {
      // Format with minimal LLM (small prompt ~200 tokens instead of ~3000)
      const reply = await formatRAGResponse(
        knowledgeText,
        ctx.motherName,
        ctx.babyName,
        ctx.language,
        message,
        bestEntry.triggerValue,
        bestEntry.medicalAlert,
        bestEntry.imageUrl,
        isFirstMessage
      );

      const responseTimeMs = Date.now() - startTime;
      return {
        reply,
        routeType: "rag",
        tokensEstimated: 300, // ~200 system + ~100 response (vs ~3000 full)
        knowledgeUsed: `KB#${bestEntry.id}: ${bestEntry.question}`,
        source: bestEntry.source,
      };
    } catch (error) {
      console.error("[RAG] Error formatting response, falling through to full LLM:", error);
      // Fall through to full LLM
    }
  }

  // Step 5: No cache, no RAG match → Full LLM (complex question)
  return {
    reply: "", // Empty = caller should use full LLM
    routeType: "llm_full",
    tokensEstimated: 3000,
    knowledgeUsed: "NONE",
  };
}

// ==========================================
// SEED KNOWLEDGE BASE
// ==========================================

export async function seedKnowledgeBase(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  // Check if already seeded
  const existing = await db.select().from(wilborKnowledgeBase).limit(1);
  if (existing.length > 0) return 0; // Already seeded

  const entries: Array<{
    category: "sono" | "colica" | "amamentacao" | "salto" | "seguranca" | "febre" | "geral";
    ageRangeStart: number | null;
    ageRangeEnd: number | null;
    question: string;
    keywords: string;
    answerPt: string;
    answerEn: string;
    answerEs: string;
    source: string;
    triggerValue: string | null;
    medicalAlert: string | null;
    imageUrl: string | null;
    priority: number;
  }> = [
    // ==========================================
    // BLOCO V1.0 - SONO SEGURO
    // ==========================================
    {
      category: "sono",
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Como o bebê deve dormir? Posição segura para dormir?",
      keywords: "sono,dormir,posição,posicao,barriga,costas,berço,berco,colchão,colchao,travesseiro,SMSL,morte súbita,morte subita,seguro,safe sleep",
      answerPt: "O bebê deve dormir sempre em posição supina (barriga para cima). O colchão deve ser firme, revestido de lençol com elástico. O berço deve estar vazio: sem travesseiros, protetores, bichos de pelúcia ou cobertores soltos (risco de sufocamento). Isso reduz em até 70% o risco de Síndrome da Morte Súbita do Lactante (SMSL).",
      answerEn: "The baby should always sleep on their back (supine position). The mattress must be firm, covered with a fitted sheet. The crib should be empty: no pillows, bumpers, stuffed animals, or loose blankets (suffocation risk). This reduces the risk of Sudden Infant Death Syndrome (SIDS) by up to 70%.",
      answerEs: "El bebé debe dormir siempre boca arriba (posición supina). El colchón debe ser firme, cubierto con sábana ajustable. La cuna debe estar vacía: sin almohadas, protectores, peluches o mantas sueltas (riesgo de asfixia). Esto reduce hasta un 70% el riesgo de Síndrome de Muerte Súbita del Lactante (SMSL).",
      source: "SBP - Manual de Orientação do Sono 2024",
      triggerValue: "Reduz em até 70% o risco de Síndrome da Morte Súbita do Lactante (SMSL).",
      medicalAlert: null,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/VbGzAkQUOEdKuRis.png",
      priority: 10,
    },
    {
      category: "sono",
      ageRangeStart: 0,
      ageRangeEnd: 4,
      question: "Quantas horas o recém-nascido deve dormir? Janela de vigília 0-1 mês?",
      keywords: "horas,quanto,dormir,recém-nascido,recem nascido,vigília,vigilia,janela,0 mês,0 mes,1 mês,1 mes,newborn",
      answerPt: "Recém-nascidos (0-1 mês) dormem de 14 a 17 horas por dia, com janela de vigília de apenas 45 minutos a 1 hora. Se o bebê ultrapassar esse tempo acordado, entra no 'efeito vulcão' (cortisol alto = bebê exausto que não consegue dormir). Sinais de sono: esfregar olhos, bocejar, olhar fixo, ficar irritado. Ambiente ideal: escuro, ruído branco (volume de chuveiro), temperatura 20-22°C.",
      answerEn: "Newborns (0-1 month) sleep 14-17 hours per day, with a wake window of only 45 minutes to 1 hour. If baby stays awake beyond this, they enter the 'volcano effect' (high cortisol = overtired baby who can't sleep). Sleep cues: rubbing eyes, yawning, staring, getting fussy. Ideal environment: dark, white noise (shower volume), temperature 68-72°F (20-22°C).",
      answerEs: "Los recién nacidos (0-1 mes) duermen de 14 a 17 horas al día, con ventana de vigilia de solo 45 minutos a 1 hora. Si el bebé supera ese tiempo despierto, entra en el 'efecto volcán' (cortisol alto = bebé agotado que no puede dormir). Señales de sueño: frotar ojos, bostezar, mirada fija, irritabilidad. Ambiente ideal: oscuro, ruido blanco (volumen de ducha), temperatura 20-22°C.",
      source: "SBP 2024",
      triggerValue: "Janela de vigília de apenas 45min-1h. Ultrapassar causa o 'efeito vulcão'.",
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },

    // ==========================================
    // BLOCO V1.0 - CÓLICA E CHORO
    // ==========================================
    {
      category: "colica",
      ageRangeStart: 0,
      ageRangeEnd: 16,
      question: "O que é cólica? Meu bebê chora muito, é cólica? Regra dos 3?",
      keywords: "cólica,colica,choro,chorar,chorando,regra dos 3,3 horas,3 dias,3 semanas,colic,crying,rule of 3",
      answerPt: "A cólica é definida pela 'Regra dos 3': choro por mais de 3 horas por dia, 3 dias por semana, por pelo menos 3 semanas. Técnicas de alívio: contato pele a pele, posição de 'charutinho' (swaddle), ruído branco (som de útero) e movimentos rítmicos. Massagens abdominais (sentido horário) devem ser feitas apenas FORA da crise de choro. Horário típico: 17h-23h. Pico entre 2-6 semanas. Melhora após 3-4 meses.",
      answerEn: "Colic is defined by the 'Rule of 3': crying for more than 3 hours a day, 3 days a week, for at least 3 weeks. Relief techniques: skin-to-skin contact, swaddling, white noise (womb sounds), and rhythmic movements. Abdominal massages (clockwise) should only be done OUTSIDE crying episodes. Typical time: 5pm-11pm. Peak at 2-6 weeks. Improves after 3-4 months.",
      answerEs: "El cólico se define por la 'Regla de los 3': llanto por más de 3 horas al día, 3 días a la semana, por al menos 3 semanas. Técnicas de alivio: contacto piel a piel, arrullo (swaddle), ruido blanco (sonido de útero) y movimientos rítmicos. Masajes abdominales (sentido horario) deben hacerse solo FUERA de la crisis de llanto. Horario típico: 17h-23h. Pico entre 2-6 semanas. Mejora después de 3-4 meses.",
      source: "SBP 2024",
      triggerValue: "Pico entre 2-6 semanas. Melhora após 3-4 meses.",
      medicalAlert: "Se houver vômitos em jato, febre ou sangue nas fezes, procurar pronto-socorro imediatamente.",
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/ffnMKpAZfOerEShO.png",
      priority: 10,
    },
    {
      category: "colica",
      ageRangeStart: 0,
      ageRangeEnd: 16,
      question: "Como fazer massagem para cólica? Massagem I-L-U? Shantala?",
      keywords: "massagem,shantala,ILU,I-L-U,barriga,abdômen,abdomen,bicicleta,aviãozinho,aviaozinho,swaddle,charutinho,compressa,massage",
      answerPt: "Técnicas de alívio da cólica:\n- **Massagem I-L-U**: movimentos no abdômen formando as letras I, L e U (sentido horário)\n- **Manobra da Bicicleta**: flexionar pernas do bebê alternadamente contra a barriguinha\n- **Charutinho (Swaddle)**: enrolar firme com os braços junto ao corpo\n- **Compressa morna**: pano aquecido sobre a barriguinha\n- **Posição anti-cólica (Aviãozinho)**: bebê de bruços sobre o antebraço\n\nIMPORTANTE: Massagens devem ser feitas FORA da crise de choro.",
      answerEn: "Colic relief techniques:\n- **I-L-U Massage**: abdominal movements forming letters I, L and U (clockwise)\n- **Bicycle Maneuver**: alternately flex baby's legs against tummy\n- **Swaddle**: wrap firmly with arms close to body\n- **Warm compress**: warm cloth on tummy\n- **Anti-colic position (Airplane)**: baby face down on forearm\n\nIMPORTANT: Massages should only be done OUTSIDE crying episodes.",
      answerEs: "Técnicas de alivio del cólico:\n- **Masaje I-L-U**: movimientos en el abdomen formando las letras I, L y U (sentido horario)\n- **Maniobra de Bicicleta**: flexionar piernas alternadamente contra la barriguita\n- **Arrullo (Swaddle)**: envolver firme con brazos junto al cuerpo\n- **Compresa tibia**: paño caliente sobre la barriguita\n- **Posición anti-cólico (Avioncito)**: bebé boca abajo sobre el antebrazo\n\nIMPORTANTE: Masajes deben hacerse FUERA de la crisis de llanto.",
      source: "SBP 2024",
      triggerValue: null,
      medicalAlert: null,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/ffnMKpAZfOerEShO.png",
      priority: 8,
    },

    // ==========================================
    // BLOCO V1.0 - AMAMENTAÇÃO
    // ==========================================
    {
      category: "amamentacao",
      ageRangeStart: 0,
      ageRangeEnd: 26,
      question: "Como é a pega correta na amamentação? Amamentação dói?",
      keywords: "pega,amamentação,amamentacao,amamentar,mama,mamar,peito,dor,doer,boca,lábio,labio,aréola,areola,latch,breastfeed,nursing",
      answerPt: "A 'pega correta' exige: boca bem aberta (lábios de peixinho), queixo encostado na mama, nariz livre e aréola mais visível acima da boca do bebê. A amamentação é em livre demanda (sem horários fixos).\n\n**Dica de ouro**: A amamentação NÃO deve doer. Se doer, a pega está rasa — reposicione o bebê.\n\nSinais de fome: mão na boca, virar a cabeça procurando, estalar a língua.",
      answerEn: "The 'correct latch' requires: mouth wide open (fish lips), chin touching breast, nose free, and more areola visible above baby's mouth. Breastfeeding is on demand (no fixed schedules).\n\n**Golden tip**: Breastfeeding should NOT hurt. If it hurts, the latch is shallow — reposition baby.\n\nHunger cues: hand to mouth, turning head searching, tongue clicking.",
      answerEs: "El 'agarre correcto' requiere: boca bien abierta (labios de pececito), mentón pegado al pecho, nariz libre y areola más visible arriba de la boca del bebé. La lactancia es a libre demanda (sin horarios fijos).\n\n**Consejo de oro**: La lactancia NO debe doler. Si duele, el agarre es superficial — reposiciona al bebé.\n\nSeñales de hambre: mano en la boca, girar cabeza buscando, chasquear lengua.",
      source: "SBP 2024",
      triggerValue: "A amamentação NÃO deve doer. Se doer, a pega está rasa.",
      medicalAlert: null,
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/jSDsymlFEjQVUyVe.png",
      priority: 10,
    },

    // ==========================================
    // BLOCO V1.0 - SALTOS DE DESENVOLVIMENTO
    // ==========================================
    {
      category: "salto",
      ageRangeStart: 4,
      ageRangeEnd: 6,
      question: "Salto de 5 semanas? Bebê de 1 mês chorando muito?",
      keywords: "salto,5 semanas,semana 5,1 mês,1 mes,sensações,sensacoes,choroso,leap 1,leap,wonder weeks",
      answerPt: "Semana 5 - Salto das Sensações: o bebê está com a visão e audição mais aguçadas. O mundo ficou 'mais intenso' para ele. É normal chorar mais e querer mais colo. Dura de 3 a 7 dias. Saltos são atualizações do sistema nervoso — o bebê fica carente, dorme mal e quer mais peito. É temporário!",
      answerEn: "Week 5 - Sensations Leap: baby's vision and hearing are sharper. The world became 'more intense' for them. It's normal to cry more and want to be held. Lasts 3-7 days. Leaps are nervous system updates — baby gets clingy, sleeps poorly and wants more nursing. It's temporary!",
      answerEs: "Semana 5 - Salto de las Sensaciones: el bebé tiene la visión y audición más agudas. El mundo se volvió 'más intenso' para él. Es normal llorar más y querer más brazos. Dura de 3 a 7 días. Los saltos son actualizaciones del sistema nervioso — el bebé se pone pegajoso, duerme mal y quiere más pecho. ¡Es temporal!",
      source: "SBP 2024 / Wonder Weeks",
      triggerValue: "Dura de 3 a 7 dias. É uma atualização do sistema nervoso.",
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },
    {
      category: "salto",
      ageRangeStart: 7,
      ageRangeEnd: 9,
      question: "Salto de 8 semanas? Bebê de 2 meses descobrindo as mãos?",
      keywords: "salto,8 semanas,semana 8,2 meses,padrões,padroes,mãos,maos,pés,pes,leap 2",
      answerPt: "Semana 8 - Salto dos Padrões: o bebê descobre as mãos e os pés! Faz movimentos repetitivos e fica fascinado. Pode ficar mais irritado e dormir pior. Dura de 3 a 7 dias. É uma fase linda de descoberta!",
      answerEn: "Week 8 - Patterns Leap: baby discovers hands and feet! Makes repetitive movements and is fascinated. May get fussier and sleep worse. Lasts 3-7 days. It's a beautiful discovery phase!",
      answerEs: "Semana 8 - Salto de los Patrones: ¡el bebé descubre las manos y los pies! Hace movimientos repetitivos y está fascinado. Puede ponerse más irritable y dormir peor. Dura de 3 a 7 días. ¡Es una fase hermosa de descubrimiento!",
      source: "SBP 2024 / Wonder Weeks",
      triggerValue: null,
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },
    {
      category: "salto",
      ageRangeStart: 11,
      ageRangeEnd: 13,
      question: "Salto de 12 semanas? Bebê de 3 meses mais coordenado?",
      keywords: "salto,12 semanas,semana 12,3 meses,transições,transicoes,coordenação,coordenacao,leap 3",
      answerPt: "Semana 12 - Salto das Transições: a coordenação motora começa a melhorar. O bebê faz movimentos mais suaves e controlados. Pode ficar mais grudento e dormir pior. Dura de 3 a 7 dias.",
      answerEn: "Week 12 - Smooth Transitions Leap: motor coordination starts improving. Baby makes smoother, more controlled movements. May get clingier and sleep worse. Lasts 3-7 days.",
      answerEs: "Semana 12 - Salto de las Transiciones: la coordinación motora empieza a mejorar. El bebé hace movimientos más suaves y controlados. Puede ponerse más pegajoso y dormir peor. Dura de 3 a 7 días.",
      source: "SBP 2024 / Wonder Weeks",
      triggerValue: null,
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },

    // ==========================================
    // BLOCO V1.1 - FEBRE E TEMPERATURA
    // ==========================================
    {
      category: "febre",
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Qual a temperatura normal do bebê? O que é febre?",
      keywords: "febre,temperatura,normal,graus,quente,termômetro,termometro,febril,37,38,fever,temperature",
      answerPt: "Valores de referência:\n- **Normal**: 36°C a 37,2°C\n- **Estado febril**: 37,3°C a 37,7°C\n- **Febre**: Acima de 37,8°C\n\nConduta: Não agasalhar em excesso. Oferecer líquidos (leite materno). Banho morno (NUNCA gelado ou com álcool). O medicamento deve seguir rigorosamente a prescrição do pediatra (não automedicar).",
      answerEn: "Reference values:\n- **Normal**: 96.8°F to 99°F (36°C to 37.2°C)\n- **Low-grade fever**: 99.1°F to 99.9°F (37.3°C to 37.7°C)\n- **Fever**: Above 100°F (37.8°C)\n\nManagement: Don't over-bundle. Offer fluids (breast milk). Lukewarm bath (NEVER cold or with alcohol). Medication must strictly follow pediatrician's prescription (don't self-medicate).",
      answerEs: "Valores de referencia:\n- **Normal**: 36°C a 37,2°C\n- **Estado febril**: 37,3°C a 37,7°C\n- **Fiebre**: Superior a 37,8°C\n\nConducta: No abrigar en exceso. Ofrecer líquidos (leche materna). Baño tibio (NUNCA helado o con alcohol). El medicamento debe seguir rigurosamente la prescripción del pediatra (no automedicar).",
      source: "SBP 2024",
      triggerValue: null,
      medicalAlert: "Bebês com menos de 3 meses com febre (37,8°C ou mais) devem ser avaliados em pronto-atendimento IMEDIATAMENTE, mesmo sem outros sintomas.",
      imageUrl: null,
      priority: 10,
    },

    // ==========================================
    // BLOCO V1.1 - SINAIS DE ALERTA (SOS)
    // ==========================================
    {
      category: "seguranca",
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Quando levar o bebê ao pronto-socorro? Sinais de alerta?",
      keywords: "pronto-socorro,emergência,emergencia,alerta,perigo,urgência,urgencia,hospital,SOS,ER,emergency",
      answerPt: "Leve ao pronto-socorro IMEDIATAMENTE se:\n- **Dificuldade para respirar** (costelas afundando ou batimento das asas do nariz)\n- **Gemência** ou choro inconsolável por horas\n- **Prostração excessiva** (bebê 'largadinho' que não acorda para mamar)\n- **Vômitos frequentes e intensos** ('em jato')\n- **Cianose** (lábios ou extremidades arroxeadas)\n- **Fontanela (moleira)** muito abaulada ou muito funda\n\nLigue 192 (SAMU) se precisar de ambulância.",
      answerEn: "Go to the ER IMMEDIATELY if:\n- **Difficulty breathing** (rib retractions or nasal flaring)\n- **Grunting** or inconsolable crying for hours\n- **Excessive lethargy** (limp baby who won't wake to feed)\n- **Frequent intense vomiting** (projectile)\n- **Cyanosis** (bluish lips or extremities)\n- **Fontanelle** very bulging or very sunken\n\nCall 911 if you need an ambulance.",
      answerEs: "Lleve a urgencias INMEDIATAMENTE si:\n- **Dificultad para respirar** (retracción costal o aleteo nasal)\n- **Quejido** o llanto inconsolable por horas\n- **Postración excesiva** (bebé 'flojito' que no despierta para mamar)\n- **Vómitos frecuentes e intensos** ('en proyectil')\n- **Cianosis** (labios o extremidades amoratadas)\n- **Fontanela** muy abultada o muy hundida\n\nLlame al 911 si necesita ambulancia.",
      source: "SBP 2024",
      triggerValue: null,
      medicalAlert: "Qualquer um desses sinais exige avaliação médica URGENTE.",
      imageUrl: null,
      priority: 15, // Highest priority
    },

    // ==========================================
    // BLOCO V1.1 - BANHO E HIGIENE
    // ==========================================
    {
      category: "seguranca",
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Como dar banho no bebê? Temperatura da água? Cordão umbilical?",
      keywords: "banho,água,agua,temperatura,banheira,umbilical,cordão,cordao,higiene,bath,water,umbilical cord",
      answerPt: "**Banho seguro**:\n- Temperatura da água entre 36°C e 37°C (testar com o cotovelo)\n- Banho rápido: 5 a 10 minutos\n- JAMAIS deixar o bebê sozinho na banheira, nem por 1 segundo (risco de afogamento em poucos cm de água)\n\n**Cordão umbilical**:\n- Limpar apenas com álcool 70% em cada troca de fralda\n- NÃO usar faixas ou moedas (risco de infecção)\n- Cai naturalmente entre 7 e 15 dias",
      answerEn: "**Safe bath**:\n- Water temperature between 96.8°F and 98.6°F (36-37°C) — test with elbow\n- Quick bath: 5 to 10 minutes\n- NEVER leave baby alone in tub, not even for 1 second (drowning risk in just inches of water)\n\n**Umbilical cord**:\n- Clean only with 70% alcohol at each diaper change\n- Do NOT use bands or coins (infection risk)\n- Falls off naturally between 7-15 days",
      answerEs: "**Baño seguro**:\n- Temperatura del agua entre 36°C y 37°C (probar con el codo)\n- Baño rápido: 5 a 10 minutos\n- JAMÁS dejar al bebé solo en la bañera, ni por 1 segundo (riesgo de ahogamiento en pocos cm de agua)\n\n**Cordón umbilical**:\n- Limpiar solo con alcohol 70% en cada cambio de pañal\n- NO usar fajas o monedas (riesgo de infección)\n- Cae naturalmente entre 7 y 15 días",
      source: "SBP 2024",
      triggerValue: null,
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },

    // ==========================================
    // BLOCO V1.1 - TRANSPORTE
    // ==========================================
    {
      category: "seguranca",
      ageRangeStart: 0,
      ageRangeEnd: 104,
      question: "Como transportar o bebê no carro? Bebê-conforto?",
      keywords: "transporte,carro,bebê-conforto,bebe conforto,cadeirinha,viagem,car seat,travel",
      answerPt: "O bebê-conforto é **obrigatório** desde a saída da maternidade. Deve ser instalado no banco traseiro, **de costas para o movimento** (virado para trás), até pelo menos os 2 anos de idade ou limite de peso do fabricante. É a posição mais segura em caso de colisão.",
      answerEn: "The car seat is **mandatory** from the maternity ward. Must be installed in the back seat, **rear-facing** (facing backwards), until at least 2 years of age or manufacturer's weight limit. This is the safest position in case of collision.",
      answerEs: "La silla de auto es **obligatoria** desde la salida de la maternidad. Debe instalarse en el asiento trasero, **mirando hacia atrás**, hasta al menos los 2 años de edad o límite de peso del fabricante. Es la posición más segura en caso de colisión.",
      source: "SBP 2024",
      triggerValue: null,
      medicalAlert: null,
      imageUrl: null,
      priority: 7,
    },

    // ==========================================
    // BLOCO V1.2 - INTRODUÇÃO ALIMENTAR
    // ==========================================
    {
      category: "alimentacao" as any,
      ageRangeStart: 24,
      ageRangeEnd: 104,
      question: "Quando começar a introdução alimentar? Sinais de prontidão?",
      keywords: "introdução alimentar,introducao alimentar,6 meses,comida,sólido,solido,prontidão,prontidao,sentar,cabeça,cabeca,língua,lingua,weaning,readiness",
      answerPt: "A introdução alimentar começa aos **6 meses completos**, mantendo o leite materno até 2 anos ou mais.\n\n**Sinais de prontidão:**\n- Senta com o mínimo de apoio\n- Sustenta a cabeça\n- Tem interesse pelos alimentos\n- Perdeu o reflexo de empurrar comida com a língua\n\n**O que oferecer:** Comida de verdade (arroz, feijão, carne/ovo, legumes e frutas).\n\n**PROIBIDO antes dos 2 anos:** Açúcar, mel (risco de botulismo), sucos (mesmo naturais) e ultraprocessados.\n\n**Textura:** Amassado com garfo (nunca liquidificar ou peneirar) para estimular a mastigação.",
      answerEn: "Complementary feeding starts at **6 months**, while maintaining breastfeeding until 2 years or beyond.\n\n**Readiness signs:**\n- Sits with minimal support\n- Holds head steady\n- Shows interest in food\n- Lost the tongue-thrust reflex\n\n**What to offer:** Real food (rice, beans, meat/egg, vegetables and fruits).\n\n**PROHIBITED before 2 years:** Sugar, honey (botulism risk), juices (even natural) and ultra-processed foods.\n\n**Texture:** Mashed with fork (never blend or strain) to stimulate chewing.",
      answerEs: "La alimentación complementaria comienza a los **6 meses completos**, manteniendo la lactancia materna hasta los 2 años o más.\n\n**Señales de preparación:**\n- Se sienta con mínimo apoyo\n- Sostiene la cabeza\n- Muestra interés por los alimentos\n- Perdió el reflejo de empujar comida con la lengua\n\n**Qué ofrecer:** Comida de verdad (arroz, frijoles, carne/huevo, verduras y frutas).\n\n**PROHIBIDO antes de los 2 años:** Azúcar, miel (riesgo de botulismo), jugos (incluso naturales) y ultraprocesados.\n\n**Textura:** Aplastado con tenedor (nunca licuar o colar) para estimular la masticación.",
      source: "SBP - Guia de Alimentação Complementar 2024",
      triggerValue: "Mel é PROIBIDO antes de 1 ano (risco de botulismo). Açúcar e sucos proibidos antes dos 2 anos.",
      medicalAlert: null,
      imageUrl: null,
      priority: 10,
    },

    // ==========================================
    // BLOCO V1.2 - VACINAS
    // ==========================================
    {
      category: "vacina" as any,
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Calendário de vacinação do bebê? Quais vacinas tomar?",
      keywords: "vacina,vacinação,vacinacao,calendário,calendario,dose,BCG,hepatite,pentavalente,rotavírus,rotavirus,pneumocócica,pneumococica,meningocócica,meningococica,vaccine,schedule",
      answerPt: "**Calendário básico de vacinação:**\n\n- **Ao nascer:** BCG e Hepatite B\n- **2, 4 e 6 meses:** Pentavalente, VIP (Poliomielite), Rotavírus e Pneumocócica 10v\n- **3 e 5 meses:** Meningocócica C\n\n**Reações comuns:** Febre baixa e dor no local são normais.\n\n**Conduta:** Compressas frias no local e antitérmico conforme orientação do pediatra.\n\n⚠️ Se houver choro agudo persistente após a vacina, avisar o médico.",
      answerEn: "**Basic vaccination schedule:**\n\n- **At birth:** BCG and Hepatitis B\n- **2, 4 and 6 months:** Pentavalent, IPV (Polio), Rotavirus and Pneumococcal 10v\n- **3 and 5 months:** Meningococcal C\n\n**Common reactions:** Low fever and local pain are normal.\n\n**What to do:** Cold compresses on the site and fever reducer as directed by pediatrician.\n\n⚠️ If there is persistent acute crying after vaccination, notify the doctor.",
      answerEs: "**Calendario básico de vacunación:**\n\n- **Al nacer:** BCG y Hepatitis B\n- **2, 4 y 6 meses:** Pentavalente, VIP (Polio), Rotavirus y Neumocócica 10v\n- **3 y 5 meses:** Meningocócica C\n\n**Reacciones comunes:** Fiebre baja y dolor local son normales.\n\n**Conducta:** Compresas frías en el lugar y antitérmico según orientación del pediatra.\n\n⚠️ Si hay llanto agudo persistente después de la vacuna, avisar al médico.",
      source: "SBP - Calendário de Vacinação 2024",
      triggerValue: null,
      medicalAlert: "Choro agudo persistente após vacina deve ser comunicado ao pediatra.",
      imageUrl: null,
      priority: 9,
    },

    // ==========================================
    // BLOCO V1.2 - HIGIENE ORAL E DENTIÇÃO
    // ==========================================
    {
      category: "higiene_oral" as any,
      ageRangeStart: 0,
      ageRangeEnd: 104,
      question: "Quando começar a escovar os dentes do bebê? Dentição?",
      keywords: "dente,dentes,dentição,denticao,escova,escovar,pasta,flúor,fluor,gengiva,morder,babar,salivação,salivacao,teething,tooth,toothbrush",
      answerPt: "**Higiene oral:**\n- Começar assim que nascer o **primeiro dente**\n- Usar escova infantil macia e pasta com flúor (mínimo 1000 ppm)\n- Quantidade: tamanho de um **grão de arroz cru**\n\n**Sinais de dentição:**\n- Salivação excessiva (babar muito)\n- Irritabilidade\n- Desejo de morder tudo\n\n⚠️ A febre da dentição é **baixa**. Febre alta NÃO é causada por dentes — procure o pediatra.",
      answerEn: "**Oral hygiene:**\n- Start as soon as the **first tooth** appears\n- Use a soft infant toothbrush with fluoride toothpaste (minimum 1000 ppm)\n- Amount: size of a **raw grain of rice**\n\n**Teething signs:**\n- Excessive drooling\n- Irritability\n- Desire to chew on everything\n\n⚠️ Teething fever is **low-grade**. High fever is NOT caused by teething — see the pediatrician.",
      answerEs: "**Higiene oral:**\n- Comenzar cuando aparezca el **primer diente**\n- Usar cepillo infantil suave y pasta con flúor (mínimo 1000 ppm)\n- Cantidad: tamaño de un **grano de arroz crudo**\n\n**Señales de dentición:**\n- Salivación excesiva (babear mucho)\n- Irritabilidad\n- Deseo de morder todo\n\n⚠️ La fiebre de la dentición es **baja**. Fiebre alta NO es causada por los dientes — consulte al pediatra.",
      source: "SBP - Manual de Saúde Bucal 2024",
      triggerValue: "Febre alta NÃO é causada por dentição. Se o bebê tiver febre alta, procure o pediatra.",
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },

    // ==========================================
    // BLOCO V1.2 - DESENVOLVIMENTO MOTOR
    // ==========================================
    {
      category: "motor" as any,
      ageRangeStart: 0,
      ageRangeEnd: 52,
      question: "Marcos do desenvolvimento motor? Quando o bebê senta, engatinha, anda?",
      keywords: "motor,desenvolvimento,marco,engatinhar,engatinhando,andar,andando,sentar,sentando,cabeça,cabeca,sustentar,rolar,primeiro passo,crawl,walk,sit,head,milestone",
      answerPt: "**Marcos do desenvolvimento motor:**\n\n- **3 meses:** Sustenta a cabeça\n- **6-7 meses:** Senta sem apoio\n- **9 meses:** Começa a engatinhar\n- **12 meses:** Primeiros passos\n\n**Regra de ouro:** Cada bebê tem seu tempo! Esses são marcos médios. Mas se houver **retrocesso** no que ele já fazia (ex: parou de sentar depois que já sentava), buscar o pediatra.\n\nEstimule com: tempo de bruços (tummy time) desde o 1º mês, brinquedos coloridos ao alcance, e muito chão!",
      answerEn: "**Motor development milestones:**\n\n- **3 months:** Holds head steady\n- **6-7 months:** Sits without support\n- **9 months:** Starts crawling\n- **12 months:** First steps\n\n**Golden rule:** Every baby has their own pace! These are average milestones. But if there's **regression** in what they already did (e.g., stopped sitting after they could sit), see the pediatrician.\n\nStimulate with: tummy time from month 1, colorful toys within reach, and lots of floor time!",
      answerEs: "**Hitos del desarrollo motor:**\n\n- **3 meses:** Sostiene la cabeza\n- **6-7 meses:** Se sienta sin apoyo\n- **9 meses:** Comienza a gatear\n- **12 meses:** Primeros pasos\n\n**Regla de oro:** ¡Cada bebé tiene su ritmo! Estos son hitos promedio. Pero si hay **retroceso** en lo que ya hacía (ej: dejó de sentarse después de que ya se sentaba), buscar al pediatra.\n\nEstimule con: tiempo boca abajo (tummy time) desde el 1er mes, juguetes coloridos al alcance, ¡y mucho suelo!",
      source: "SBP - Manual de Desenvolvimento 2024",
      triggerValue: "Retrocesso no desenvolvimento (perder habilidade já adquirida) exige avaliação do pediatra.",
      medicalAlert: null,
      imageUrl: null,
      priority: 8,
    },
  ];

  let count = 0;
  for (const entry of entries) {
    await db.insert(wilborKnowledgeBase).values({
      ...entry,
      isActive: "true",
    });
    count++;
  }

  return count;
}
