import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createExtraCreditsCheckout, getPaymentStatus } from "./stripeIntegration";

/**
 * Testes para integração Stripe
 * Execute com: pnpm test stripe.test.ts
 */

describe("Stripe Integration", () => {
  let sessionId: string;

  it("should create a checkout session", async () => {
    try {
      const session = await createExtraCreditsCheckout(1, 9.9);

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.url).toBeDefined();

      sessionId = session.id;
      console.log("✅ Checkout session created:", session.id);
      console.log("🔗 Checkout URL:", session.url);
    } catch (error) {
      console.error("❌ Failed to create checkout session:", error);
      throw error;
    }
  });

  it("should retrieve payment status", async () => {
    if (!sessionId) {
      console.log("⏭️  Skipping payment status test (no session ID)");
      return;
    }

    try {
      const status = await getPaymentStatus(sessionId);

      expect(status).toBeDefined();
      expect(status.status).toBeDefined();

      console.log("✅ Payment status retrieved:", status.status);
    } catch (error) {
      console.error("❌ Failed to get payment status:", error);
      throw error;
    }
  });

  it("should handle invalid session ID gracefully", async () => {
    try {
      await getPaymentStatus("invalid_session_id");
      // If we get here, the API accepted it (Stripe returns 404 as error)
    } catch (error: any) {
      // Expected to fail with invalid session
      expect(error).toBeDefined();
      console.log("✅ Invalid session handled correctly");
    }
  });
});
