import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const wilborAnonymousUsage = mysqlTable("wilborAnonymousUsage", {
  id: int("id").autoincrement().primaryKey(),
  deviceFingerprint: varchar("deviceFingerprint", { length: 255 }).notNull().unique(),
  messagesUsed: int("messagesUsed").default(0).notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WilborAnonymousUsage = typeof wilborAnonymousUsage.$inferSelect;
export type InsertWilborAnonymousUsage = typeof wilborAnonymousUsage.$inferInsert;
