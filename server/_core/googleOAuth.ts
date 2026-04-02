import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ENV } from "./env";
import * as db from "../db";
import { wilborUsers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export function setupGoogleOAuth() {
  if (!ENV.googleClientId || !ENV.googleClientSecret) {
    console.warn("Google OAuth credentials not found. Google login will not work.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.googleClientId,
        clientSecret: ENV.googleClientSecret,
        callbackURL: "/api/auth/google/callback",
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found in Google profile"));
          }

          // Check if user exists
          const dbConn = await db.getDb();
          if (!dbConn) return done(new Error("Database not available"));

          const existing = await dbConn.select().from(wilborUsers).where(eq(wilborUsers.email, email)).limit(1);
          let user = existing[0];

          if (!user) {
            // Create new user
            const result = await dbConn.insert(wilborUsers).values({
              email: email,
              name: profile.displayName,
              language: "pt",
              trialExpiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days trial
              subscriptionStatus: "trial",
            });
            
            // For MySQL/Drizzle, the result might be different depending on the driver
            // We'll try to find the user by email again to be safe
            const newUserResult = await dbConn.select().from(wilborUsers).where(eq(wilborUsers.email, email)).limit(1);
            user = newUserResult[0];
          } else {
            // Update last active
            await dbConn.update(wilborUsers)
              .set({ lastActiveAt: new Date() })
              .where(eq(wilborUsers.id, user.id));
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const dbConn = await db.getDb();
      if (!dbConn) return done(new Error("Database not available"));
      const result = await dbConn.select().from(wilborUsers).where(eq(wilborUsers.id, id)).limit(1);
      done(null, result[0] || null);
    } catch (error) {
      done(error);
    }
  });
}
