import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { wilborUserCredits, wilborConversionEvents } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Wilbor Credits & Paywall System", () => {
  let db: any;
  const testUserId = 999;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database connection failed");
  });

  afterAll(async () => {
    // Cleanup test data
    if (db) {
      await db.delete(wilborUserCredits).where(eq(wilborUserCredits.userId, testUserId));
      await db.delete(wilborConversionEvents).where(eq(wilborConversionEvents.userId, testUserId));
    }
  });

  it("should create default free plan for new user", async () => {
    const periodStart = new Date();
    const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(wilborUserCredits).values({
      userId: testUserId,
      plan: "free",
      monthlyLimit: 5,
      messagesUsed: 0,
      ragMessagesUsed: 0,
      cacheHits: 0,
      totalSaved: 0,
      periodStart,
      periodEnd,
    });

    const credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, testUserId))
      .limit(1);

    expect(credits.length).toBe(1);
    expect(credits[0].plan).toBe("free");
    expect(credits[0].monthlyLimit).toBe(5);
    expect(credits[0].messagesUsed).toBe(0);
  });

  it("should update plan from free to premium", async () => {
    const newLimit = 500;
    const periodStart = new Date();
    const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(wilborUserCredits)
      .set({
        plan: "premium",
        monthlyLimit: newLimit,
        messagesUsed: 0,
        periodStart,
        periodEnd,
      })
      .where(eq(wilborUserCredits.userId, testUserId));

    const credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, testUserId))
      .limit(1);

    expect(credits[0].plan).toBe("premium");
    expect(credits[0].monthlyLimit).toBe(500);
  });

  it("should track payment_success event", async () => {
    await db.insert(wilborConversionEvents).values({
      userId: testUserId,
      eventType: "payment_success",
    });

    const events = await db
      .select()
      .from(wilborConversionEvents)
      .where(eq(wilborConversionEvents.userId, testUserId));

    expect(events.length).toBeGreaterThan(0);
    expect(events[0].eventType).toBe("payment_success");
  });

  it("should track hit_limit event", async () => {
    await db.insert(wilborConversionEvents).values({
      userId: testUserId,
      eventType: "hit_limit",
    });

    const events = await db
      .select()
      .from(wilborConversionEvents)
      .where(eq(wilborConversionEvents.userId, testUserId));

    const hitLimitEvent = events.find((e: any) => e.eventType === "hit_limit");
    expect(hitLimitEvent).toBeDefined();
  });

  it("should calculate remaining credits correctly", async () => {
    const credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, testUserId))
      .limit(1);

    const credit = credits[0];
    const remaining = Math.max(0, credit.monthlyLimit - credit.messagesUsed);
    const isOverLimit = remaining === 0;

    expect(remaining).toBe(credit.monthlyLimit);
    expect(isOverLimit).toBe(false);
  });

  it("should detect when user hits limit", async () => {
    // Simulate user using all messages
    await db
      .update(wilborUserCredits)
      .set({ messagesUsed: 500 })
      .where(eq(wilborUserCredits.userId, testUserId));

    const credits = await db
      .select()
      .from(wilborUserCredits)
      .where(eq(wilborUserCredits.userId, testUserId))
      .limit(1);

    const credit = credits[0];
    const remaining = Math.max(0, credit.monthlyLimit - credit.messagesUsed);
    const isOverLimit = remaining === 0;

    expect(isOverLimit).toBe(true);
  });
});
