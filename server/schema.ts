import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

// Test tracking table
export const testSessions = mysqlTable("testSessions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  linkedinProfile: varchar("linkedinProfile", { length: 500 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  companySize: mysqlEnum("companySize", ["solo", "micro", "small", "medium", "large"]), // solo=1, micro=2-10, small=11-50, medium=51-200, large=200+
  sector: varchar("sector", { length: 100 }), // Setor de atuação
  leadershipRole: mysqlEnum("leadershipRole", ["founder", "ceo", "director", "manager", "coordinator", "other"]), // Papel de liderança
  unlimitedAccess: mysqlEnum("unlimitedAccess", ["true", "false"]).default("false").notNull(),
  consentGiven: mysqlEnum("consentGiven", ["true", "false"]).default("false").notNull(),
  sessionState: mysqlEnum("sessionState", ["WAITING_CONSENT", "ACTIVE", "COMPLETED"]).default("WAITING_CONSENT").notNull(),
  wantsSummaryByWhatsapp: mysqlEnum("wantsSummaryByWhatsapp", ["true", "false"]).default("false").notNull(),
  testCompleted: timestamp("testCompleted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestSession = typeof testSessions.$inferSelect;
export type InsertTestSession = typeof testSessions.$inferInsert;

// Feedback table
export const testFeedback = mysqlTable("testFeedback", {
  id: int("id").autoincrement().primaryKey(),
  testSessionId: int("testSessionId").notNull(),
  clarity: mysqlEnum("clarity", ["yes", "partial", "no"]).notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TestFeedback = typeof testFeedback.$inferSelect;
export type InsertTestFeedback = typeof testFeedback.$inferInsert;

// Tracking events table
export const trackingEvents = mysqlTable("trackingEvents", {
  id: int("id").autoincrement().primaryKey(),
  testSessionId: int("testSessionId"),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  eventData: text("eventData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertTrackingEvent = typeof trackingEvents.$inferInsert;

// Chat messages history table
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  testSessionId: int("testSessionId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Pain points extracted from conversations
export const painPoints = mysqlTable("painPoints", {
  id: int("id").autoincrement().primaryKey(),
  testSessionId: int("testSessionId").notNull(),
  category: mysqlEnum("category", [
    "delegation",      // Delegar sem esclarecer
    "team_engagement", // Falta de entusiasmo na equipe
    "leadership",      // Líderes naturais não valorizados
    "authority",       // Excesso de autoridade
    "communication",   // Falta de diálogo
    "decision",        // Dificuldade em decidir
    "overload",        // Sobrecarga / exaustão
    "trust",           // Falta de confiança na equipe
    "process",         // Processos ineficientes
    "other"            // Outros pontos de dor
  ]).notNull(),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  rawQuote: text("rawQuote"), // Citação original do usuário
  extractedAt: timestamp("extractedAt").defaultNow().notNull(),
});

export type PainPoint = typeof painPoints.$inferSelect;
export type InsertPainPoint = typeof painPoints.$inferInsert;


// Conversation analysis for AI evolution
export const conversationAnalysis = mysqlTable("conversationAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  testSessionId: int("testSessionId").notNull(),
  
  // Quality metrics
  overallQuality: mysqlEnum("overallQuality", ["excellent", "good", "needs_improvement", "poor"]).notNull(),
  qualityScore: int("qualityScore").notNull(), // 0-100
  
  // Detected issues
  hasUnnecessaryRepetitions: mysqlEnum("hasUnnecessaryRepetitions", ["true", "false"]).default("false").notNull(),
  hasIgnoredQuestions: mysqlEnum("hasIgnoredQuestions", ["true", "false"]).default("false").notNull(),
  hasMissedPathPresentation: mysqlEnum("hasMissedPathPresentation", ["true", "false"]).default("false").notNull(),
  hasExcessiveLength: mysqlEnum("hasExcessiveLength", ["true", "false"]).default("false").notNull(),
  hasPrematureEnding: mysqlEnum("hasPrematureEnding", ["true", "false"]).default("false").notNull(),
  
  // Conversation stats
  messageCount: int("messageCount").notNull(),
  userMessageCount: int("userMessageCount").notNull(),
  assistantMessageCount: int("assistantMessageCount").notNull(),
  avgResponseLength: int("avgResponseLength").notNull(),
  
  // AI analysis
  issuesDetected: text("issuesDetected"), // JSON array of specific issues
  suggestionsForImprovement: text("suggestionsForImprovement"), // JSON array of suggestions
  clientSatisfactionEstimate: mysqlEnum("clientSatisfactionEstimate", ["very_satisfied", "satisfied", "neutral", "dissatisfied", "very_dissatisfied"]),
  
  // Flags for attention
  needsManualReview: mysqlEnum("needsManualReview", ["true", "false"]).default("false").notNull(),
  reviewReason: text("reviewReason"),
  
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
});

export type ConversationAnalysis = typeof conversationAnalysis.$inferSelect;
export type InsertConversationAnalysis = typeof conversationAnalysis.$inferInsert;
