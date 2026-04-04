import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==========================================
// WILBOR-ASSIST (IA Neonatal) Tables
// ==========================================

export const wilborUsers = mysqlTable("wilborUsers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  babyName: varchar("babyName", { length: 255 }),
  babyBirthDate: timestamp("babyBirthDate"),
  language: mysqlEnum("language", ["pt", "en", "es"]).default("pt").notNull(),
  trialStartedAt: timestamp("trialStartedAt").defaultNow().notNull(),
  trialExpiresAt: timestamp("trialExpiresAt"),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["trial", "active", "expired", "cancelled"]).default("trial").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull(),
  messageCount: int("messageCount").default(0).notNull(),
  rateLimitResetAt: timestamp("rateLimitResetAt"),
});

export type WilborUser = typeof wilborUsers.$inferSelect;
export type InsertWilborUser = typeof wilborUsers.$inferInsert;

// Sub-perfis de bebês (suporta gêmeos/trigêmeos)
export const wilborBabies = mysqlTable("wilborBabies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: timestamp("birthDate"),
  sex: mysqlEnum("sex", ["male", "female", "unknown"]).default("unknown").notNull(),
  weightGrams: int("weightGrams"),
  gestationalWeeks: int("gestationalWeeks"),
  syndromes: text("syndromes"),
  notes: text("notes"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborBaby = typeof wilborBabies.$inferSelect;
export type InsertWilborBaby = typeof wilborBabies.$inferInsert;

export const wilborConversations = mysqlTable("wilborConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  babyId: int("babyId"),
  category: mysqlEnum("category", ["sono", "colica", "salto", "alimentacao", "seguranca", "sos", "geral"]).notNull(),
  status: mysqlEnum("status", ["active", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborConversation = typeof wilborConversations.$inferSelect;
export type InsertWilborConversation = typeof wilborConversations.$inferInsert;

export const wilborMessages = mysqlTable("wilborMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborMessage = typeof wilborMessages.$inferSelect;
export type InsertWilborMessage = typeof wilborMessages.$inferInsert;

// ==========================================
// SLEEP TRACKING (Registro de Sono)
// ==========================================
export const wilborSleepLogs = mysqlTable("wilborSleepLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  babyId: int("babyId").notNull(),
  sleepStart: timestamp("sleepStart").notNull(),
  sleepEnd: timestamp("sleepEnd"),
  durationMinutes: int("durationMinutes"),
  quality: mysqlEnum("quality", ["good", "restless", "bad"]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborSleepLog = typeof wilborSleepLogs.$inferSelect;
export type InsertWilborSleepLog = typeof wilborSleepLogs.$inferInsert;

// ==========================================
// BABY DIARY (Diário do Bebê)
// ==========================================
export const wilborDiaryEntries = mysqlTable("wilborDiaryEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  babyId: int("babyId").notNull(),
  entryDate: timestamp("entryDate").notNull(),
  category: mysqlEnum("diaryCategory", ["feeding", "sleep", "diaper", "milestone", "health", "mood", "general"]).default("general").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  mood: mysqlEnum("mood", ["happy", "calm", "fussy", "crying", "sick"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborDiaryEntry = typeof wilborDiaryEntries.$inferSelect;
export type InsertWilborDiaryEntry = typeof wilborDiaryEntries.$inferInsert;

// ==========================================
// DEVELOPMENT TRAIL CONTENT (Conteúdo dos Marcos - Genérico)
// ==========================================
export const wilborMilestoneContent = mysqlTable("wilborMilestoneContent", {
  id: int("id").autoincrement().primaryKey(),
  month: int("month").notNull(), // 6 a 24
  category: mysqlEnum("milestoneCategory", ["motor", "cognitivo", "linguagem", "social"]).notNull(),
  
  // Português
  titlePt: text("titlePt").notNull(),
  descriptionPt: text("descriptionPt").notNull(),
  
  // English
  titleEn: text("titleEn"),
  descriptionEn: text("descriptionEn"),
  
  // Español
  titleEs: text("titleEs"),
  descriptionEs: text("descriptionEs"),
  
  // Metadados
  order: int("order").default(0),
  isActive: mysqlEnum("contentIsActive", ["true", "false"]).default("true").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborMilestoneContent = typeof wilborMilestoneContent.$inferSelect;
export type InsertWilborMilestoneContent = typeof wilborMilestoneContent.$inferInsert;

// ==========================================
// DEVELOPMENT TRAIL USER TRACKING (Marcos Atingidos pelo Bebê)
// ==========================================
export const wilborDevMilestones = mysqlTable("wilborDevMilestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  babyId: int("babyId").notNull(),
  contentId: int("contentId").notNull(), // FK para wilborMilestoneContent
  achieved: mysqlEnum("achieved", ["yes", "no", "partial"]).default("no").notNull(),
  achievedAt: timestamp("achievedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborDevMilestone = typeof wilborDevMilestones.$inferSelect;
export type InsertWilborDevMilestone = typeof wilborDevMilestones.$inferInsert;

// ==========================================
// RAG KNOWLEDGE BASE (Base de Conhecimento SBP)
// ==========================================
export const wilborKnowledgeBase = mysqlTable("wilborKnowledgeBase", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("kbCategory", ["sono", "colica", "amamentacao", "salto", "seguranca", "febre", "alimentacao", "vacina", "higiene_oral", "motor", "geral"]).notNull(),
  ageRangeStart: int("ageRangeStart"),
  ageRangeEnd: int("ageRangeEnd"),
  question: text("question").notNull(),
  keywords: text("keywords").notNull(),
  answerPt: text("answerPt").notNull(),
  answerEn: text("answerEn").notNull(),
  answerEs: text("answerEs").notNull(),
  source: varchar("source", { length: 255 }).default("SBP 2024").notNull(),
  triggerValue: text("triggerValue"),
  medicalAlert: text("medicalAlert"),
  imageUrl: text("imageUrl"),
  priority: int("priority").default(0).notNull(),
  isActive: mysqlEnum("kbIsActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborKnowledge = typeof wilborKnowledgeBase.$inferSelect;
export type InsertWilborKnowledge = typeof wilborKnowledgeBase.$inferInsert;

// ==========================================
// RECIPE BOOK (Book de Receitas)
// ==========================================
export const wilborRecipes = mysqlTable("wilborRecipes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  ageMin: int("ageMin").default(6).notNull(),
  difficulty: mysqlEnum("recipeDifficulty", ["Fácil", "Médio", "Difícil"]).default("Fácil").notNull(),
  prepTime: varchar("prepTime", { length: 20 }).default("30min").notNull(),
  ingredients: text("ingredients").notNull(),
  allergens: text("allergens").notNull(),
  instructions: text("instructions").notNull(),
  textureGuide: text("textureGuide"),
  cutSafety: text("cutSafety"),
  safetyNote: text("safetyNote"),
  imageUrl: text("imageUrl"),
  category: mysqlEnum("recipeCategory", ["refeicao", "lanche", "sobremesa", "suco"]).default("refeicao").notNull(),
  isActive: mysqlEnum("recipeIsActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborRecipe = typeof wilborRecipes.$inferSelect;
export type InsertWilborRecipe = typeof wilborRecipes.$inferInsert;

// ==========================================
// MOTHER HEALTH (Saúde da Mãe - "Meu Corpo")
// ==========================================
export const wilborMotherProfile = mysqlTable("wilborMotherProfile", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  heightCm: int("heightCm").notNull(),
  prePregnancyWeightKg: int("prePregnancyWeightKg"),
  goalWeightKg: int("goalWeightKg"),
  deliveryType: mysqlEnum("deliveryType", ["normal", "cesarean"]).default("normal").notNull(),
  deliveryDate: timestamp("deliveryDate"),
  isBreastfeeding: mysqlEnum("isBreastfeeding", ["true", "false"]).default("true").notNull(),
  postpartumPhase: mysqlEnum("postpartumPhase", ["resguardo", "40dias", "3meses", "6meses", "12meses"]).default("resguardo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborMotherProfile = typeof wilborMotherProfile.$inferSelect;
export type InsertWilborMotherProfile = typeof wilborMotherProfile.$inferInsert;

export const wilborMotherWeighIns = mysqlTable("wilborMotherWeighIns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  weightGrams: int("weightGrams").notNull(),
  measuredAt: timestamp("measuredAt").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborMotherWeighIn = typeof wilborMotherWeighIns.$inferSelect;
export type InsertWilborMotherWeighIn = typeof wilborMotherWeighIns.$inferInsert;

// ==========================================
// RESPONSE FEEDBACK (Feedback das Respostas IA)
// ==========================================
export const wilborResponseFeedback = mysqlTable("wilborResponseFeedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId"),
  kbId: int("kbId"),
  userQuestion: text("userQuestion").notNull(),
  aiResponse: text("aiResponse").notNull(),
  helpfulness: mysqlEnum("helpfulness", ["very_helpful", "helpful", "neutral", "not_helpful", "misleading"]).notNull(),
  accuracy: mysqlEnum("accuracy", ["accurate", "mostly_accurate", "partially_accurate", "inaccurate"]),
  comment: text("comment"),
  language: mysqlEnum("feedbackLanguage", ["pt", "en", "es"]).default("pt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborResponseFeedback = typeof wilborResponseFeedback.$inferSelect;
export type InsertWilborResponseFeedback = typeof wilborResponseFeedback.$inferInsert;

// ==========================================
// USER CREDITS (Sistema de Créditos/Planos)
// ==========================================
export const wilborUserCredits = mysqlTable("wilborUserCredits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["free", "premium", "manual"]).default("free").notNull(),
  monthlyLimit: int("monthlyLimit").default(5).notNull(),
  messagesUsed: int("messagesUsed").default(0).notNull(),
  ragMessagesUsed: int("ragMessagesUsed").default(0).notNull(),
  cacheHits: int("cacheHits").default(0).notNull(),
  totalSaved: int("totalSaved").default(0).notNull(),
  periodStart: timestamp("periodStart").defaultNow().notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  extraCreditsUsedReais: decimal("extraCreditsUsedReais", { precision: 10, scale: 2 }).default("0.00").notNull(),
  extraCreditsLimitReais: decimal("extraCreditsLimitReais", { precision: 10, scale: 2 }).default("10.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborUserCredit = typeof wilborUserCredits.$inferSelect;
export type InsertWilborUserCredit = typeof wilborUserCredits.$inferInsert;

// ==========================================
// EXTRA CREDITS TRANSACTIONS (Compras de Créditos Extras)
// ==========================================
export const wilborExtraCreditTransactions = mysqlTable("wilborExtraCreditTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amountReais: decimal("amountReais", { precision: 10, scale: 2 }).notNull(),
  creditsReceived: int("creditsReceived").notNull(),
  stripeTransactionId: varchar("stripeTransactionId", { length: 255 }).notNull().unique(),
  status: mysqlEnum("transactionStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  usedCredits: int("usedCredits").default(0).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborExtraCreditTransaction = typeof wilborExtraCreditTransactions.$inferSelect;
export type InsertWilborExtraCreditTransaction = typeof wilborExtraCreditTransactions.$inferInsert;

// ==========================================
// CHAT ANALYTICS (Métricas de Custo)
// ==========================================
export const wilborChatAnalytics = mysqlTable("wilborChatAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId"),
  routeType: mysqlEnum("routeType", ["cache", "rag", "llm_full", "safety_filter"]).notNull(),
  category: varchar("analyticsCategory", { length: 50 }),
  tokensEstimated: int("tokensEstimated").default(0).notNull(),
  responseTimeMs: int("responseTimeMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborChatAnalytic = typeof wilborChatAnalytics.$inferSelect;
export type InsertWilborChatAnalytic = typeof wilborChatAnalytics.$inferInsert;

// ==========================================
// CONVERSION TRACKING (Métricas de Conversão Free→Premium)
// ==========================================
export const wilborConversionEvents = mysqlTable("wilborConversionEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: mysqlEnum("eventType", [
    "hit_limit",
    "paywall_shown",
    "upgrade_clicked",
    "plans_clicked",
    "checkout_started",
    "payment_success",
    "payment_failed",
  ]).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborConversionEvent = typeof wilborConversionEvents.$inferSelect;
export type InsertWilborConversionEvent = typeof wilborConversionEvents.$inferInsert;

// ==========================================
// SOS USAGE TRACKING (Rastreamento de Uso SOS)
// ==========================================
export const wilborSosUsageLog = mysqlTable("wilborSosUsageLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId"),
  usageType: mysqlEnum("sosUsageType", ["emergency", "regular"]).default("regular").notNull(),
  costReais: decimal("costReais", { precision: 10, scale: 2 }).notNull(),
  injectedCredits: int("injectedCredits").default(0).notNull(),
  stripeTransactionId: varchar("stripeTransactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WilborSosUsageLog = typeof wilborSosUsageLog.$inferSelect;
export type InsertWilborSosUsageLog = typeof wilborSosUsageLog.$inferInsert;
// ==========================================
// BLOG (Artigos para SEO)
// ==========================================
export const blogArticles = mysqlTable("blogArticles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("blogCategory", ["sono", "colica", "febre", "alimentacao", "depressao_pos_parto", "vacinas", "amamentacao", "seguranca", "saltos", "higiene"]).notNull(),
  imageUrl: text("imageUrl"),
  author: varchar("author", { length: 100 }).default("Wilbor Assist").notNull(),
  seoKeywords: text("seoKeywords"),
  seoMetaDescription: text("seoMetaDescription"),
  readTimeMinutes: int("readTimeMinutes").default(5).notNull(),
  views: int("views").default(0).notNull(),
  isPublished: mysqlEnum("isPublished", ["true", "false"]).default("true").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

export const blogComments = mysqlTable("blogComments", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  userId: int("userId"),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  content: text("content").notNull(),
  isApproved: mysqlEnum("isApproved", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;


// ==========================================
// E-BOOKS (Produtos Digitais)
// ==========================================
export const wilborEbooks = mysqlTable("wilborEbooks", {
  id: varchar("id", { length: 100 }).primaryKey(), // Ex: 'casamento-01'
  
  // Internacionalização Nativa
  titlePt: text("titlePt").notNull(),
  titleEn: text("titleEn"),
  titleEs: text("titleEs"),
  
  descriptionPt: text("descriptionPt").notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionEs: text("descriptionEs"),
  
  category: varchar("category", { length: 50 }).notNull(), // Ex: 'casamento', 'emocoes'
  
  // Preços em Centavos
  priceBrl: int("priceBrl").notNull(),
  priceUsd: int("priceUsd").notNull(),
  priceEur: int("priceEur").notNull(),
  
  coverImage: text("coverImage").notNull(),
  pdfUrl: text("pdfUrl").notNull(),
  
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  reviewCount: int("reviewCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborEbook = typeof wilborEbooks.$inferSelect;
export type InsertWilborEbook = typeof wilborEbooks.$inferInsert;

// ==========================================
// E-BOOK PURCHASES (Controle de Vendas)
// ==========================================
export const wilborEbookPurchases = mysqlTable("wilborEbookPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  ebookId: varchar("ebookId", { length: 100 }).notNull(),
  
  amount: int("amount").notNull(), // Valor pago em centavos
  currency: varchar("currency", { length: 10 }).notNull(), // 'BRL', 'USD', 'EUR'
  
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  status: mysqlEnum("purchaseStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborEbookPurchase = typeof wilborEbookPurchases.$inferSelect;
export type InsertWilborEbookPurchase = typeof wilborEbookPurchases.$inferInsert;
