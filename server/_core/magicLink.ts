import crypto from "crypto";
import { ENV } from "./env";
import * as db from "../db";
import { magicLinkTokens, wilborUsers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const MAGIC_LINK_EXPIRY_MINUTES = 15;

/**
 * Generate a magic link token for email-based authentication
 */
export async function generateMagicLink(email: string): Promise<string> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error("Database not available");
  }

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

  // Store token in database
  await dbConn.insert(magicLinkTokens).values({
    email,
    token,
    expiresAt,
  });

  // Return the magic link URL
  const baseUrl = ENV.isProduction 
    ? "https://www.wilbor-assist.com" 
    : "http://localhost:3000";
  
  return `${baseUrl}/auth/magic-link?token=${token}`;
}

/**
 * Verify and consume a magic link token
 */
export async function verifyMagicLink(token: string): Promise<{ email: string; userId: number } | null> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error("Database not available");
  }

  try {
    // Find the token
    const tokenRecord = await dbConn
      .select()
      .from(magicLinkTokens)
      .where(eq(magicLinkTokens.token, token))
      .limit(1);

    if (tokenRecord.length === 0) {
      console.error("[MagicLink] Token not found:", token);
      return null;
    }

    const record = tokenRecord[0];

    // Check if token is expired
    if (record.expiresAt < new Date()) {
      console.error("[MagicLink] Token expired:", token);
      return null;
    }

    // Check if token was already used
    if (record.usedAt) {
      console.error("[MagicLink] Token already used:", token);
      return null;
    }

    // Mark token as used
    await dbConn
      .update(magicLinkTokens)
      .set({ usedAt: new Date() })
      .where(eq(magicLinkTokens.token, token));

    // Find or create user
    const existingUser = await dbConn
      .select()
      .from(wilborUsers)
      .where(eq(wilborUsers.email, record.email))
      .limit(1);

    let user = existingUser[0];

    if (!user) {
      // Create new user with trial
      const result = await dbConn.insert(wilborUsers).values({
        email: record.email,
        name: record.email.split("@")[0], // Use email prefix as default name
        language: "pt",
        trialStartedAt: new Date(),
        trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
        subscriptionStatus: "trial",
      });

      // Get the created user
      const newUser = await dbConn
        .select()
        .from(wilborUsers)
        .where(eq(wilborUsers.email, record.email))
        .limit(1);

      user = newUser[0];
    }

    if (!user) {
      throw new Error("Failed to create or find user");
    }

    return {
      email: record.email,
      userId: user.id,
    };
  } catch (error) {
    console.error("[MagicLink] Error verifying token:", error);
    throw error;
  }
}

/**
 * Send magic link email (placeholder - integrate with email service)
 */
export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<boolean> {
  try {
    console.log(`[MagicLink] Email would be sent to: ${email}`);
    console.log(`[MagicLink] Magic link: ${magicLink}`);
    
    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, just log it
    
    return true;
  } catch (error) {
    console.error("[MagicLink] Failed to send email:", error);
    return false;
  }
}
