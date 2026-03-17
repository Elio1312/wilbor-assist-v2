import Stripe from "stripe";
import { Request, Response, Express } from "express";
import express from "express";
import { getDb } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS } from "./stripeProducts";

// Initialize Stripe (will be null if no key configured)
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY_CUSTOM || process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-01-27.acacia" as any });
}

/**
 * Register Stripe routes on Express app.
 * MUST be called BEFORE express.json() middleware for webhook to work.
 */
export function registerStripeRoutes(app: Express) {
  // Webhook endpoint - needs raw body for signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        return res.status(500).json({ error: "Webhook secret not configured" });
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id;
            if (!userId) break;

            const db = await getDb();
            if (!db) break;

            // Upgrade user to Premium
            await db
              .update(wilborUserCredits)
              .set({
                plan: "premium",
                monthlyLimit: 500, // 500/day - generous but not infinite
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
              })
              .where(eq(wilborUserCredits.userId, Number(userId)));

            // Update subscription status on user record
            await db
              .update(wilborUsers)
              .set({ subscriptionStatus: "active" })
              .where(eq(wilborUsers.id, Number(userId)));

            // Track conversion
            await db.insert(wilborConversionEvents).values({
              userId: Number(userId),
              eventType: "payment_success",
              metadata: JSON.stringify({
                sessionId: session.id,
                amount: session.amount_total,
                currency: session.currency,
              }),
            });

            console.log(`[Stripe] User ${userId} upgraded to Premium`);
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const db = await getDb();
            if (!db) break;

            // Downgrade user back to Free
            const credits = await db
              .select()
              .from(wilborUserCredits)
              .where(eq(wilborUserCredits.stripeSubscriptionId, subscription.id))
              .limit(1);

            if (credits.length > 0) {
              await db
                .update(wilborUserCredits)
                .set({
                  plan: "free",
                  monthlyLimit: 5,
                  stripeSubscriptionId: null,
                })
                .where(eq(wilborUserCredits.id, credits[0].id));

              console.log(`[Stripe] User ${credits[0].userId} downgraded to Free (subscription cancelled)`);
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const db = await getDb();
            if (!db) break;

            const subId = (invoice as any).subscription as string;
            if (subId) {
              const credits = await db
                .select()
                .from(wilborUserCredits)
                .where(eq(wilborUserCredits.stripeSubscriptionId, subId))
                .limit(1);

              if (credits.length > 0) {
                await db.insert(wilborConversionEvents).values({
                  userId: credits[0].userId,
                  eventType: "payment_failed",
                  metadata: JSON.stringify({ invoiceId: invoice.id }),
                });
              }
            }
            break;
          }
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
      }

      res.json({ received: true });
    }
  );

  // Checkout session creation endpoint (called from tRPC)
  // This is handled via tRPC procedure instead
}

/**
 * Create a Stripe Checkout Session for Premium subscription.
 * Called from tRPC procedure.
 */
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  origin: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: "Stripe not configured. Please configure Stripe keys in Settings → Payment." };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      metadata: {
        user_id: userId.toString(),
        customer_email: userEmail,
        customer_name: userName,
      },
      line_items: [
        {
          price_data: {
            currency: PRODUCTS.PREMIUM.price.currency,
            product_data: {
              name: PRODUCTS.PREMIUM.name,
              description: PRODUCTS.PREMIUM.description,
            },
            unit_amount: PRODUCTS.PREMIUM.price.amount,
            recurring: {
              interval: PRODUCTS.PREMIUM.price.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/wilbor/dashboard?payment=success`,
      cancel_url: `${origin}/wilbor/dashboard?payment=cancelled`,
    });

    return { url: session.url! };
  } catch (err: any) {
    console.error("[Stripe] Checkout session creation failed:", err.message);
    return { error: err.message };
  }
}
