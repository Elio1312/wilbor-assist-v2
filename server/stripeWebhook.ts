import Stripe from "stripe";
import { Request, Response, Express } from "express";
import express from "express";
import { getDb, addExtraCreditTransaction } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborUsers, wilborEbookPurchases } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS } from "./stripeProducts";

// Initialize Stripe (will be null if no key configured)
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY_CUSTOM || process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Using a stable API version for consistency across the project
  return new Stripe(key, { apiVersion: "2023-10-16" as any });
}

/**
 * Notify ManyChat subscriber about a payment failure.
 */
async function notifyManyChatPaymentFailed(manychatSubscriberId: string): Promise<void> {
  const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
  if (!MANYCHAT_API_KEY) {
    console.log("[Stripe] MANYCHAT_API_KEY not configured — skipping ManyChat notification");
    return;
  }
  try {
    const response = await fetch("https://api.manychat.com/fb/sending/sendContent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MANYCHAT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriber_id: manychatSubscriberId,
        data: {
          version: "v2",
          content: {
            messages: [
              {
                type: "text",
                text: "Olá! Notei que houve um probleminha com o seu cartão de pagamento. Não se preocupe — acontece! Clique aqui para atualizar seu método de pagamento e continuar com acesso ao Wilbor: https://wilbor-assist.com/dashboard",
              },
            ],
          },
        },
      }),
    });
    if (response.ok) {
      console.log(`[Stripe] ManyChat notified for payment failure — subscriber ${manychatSubscriberId}`);
    } else {
      const body = await response.text();
      console.error(`[Stripe] ManyChat notification failed (${response.status}): ${body}`);
    }
  } catch (mcErr) {
    console.error("[Stripe] ManyChat notification error:", mcErr);
  }
}

/**
 * Register Stripe routes on Express app.
 * MUST be called BEFORE express.json() middleware for webhook to work.
 */
export function registerStripeRoutes(app: Express) {
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
        console.log("[Stripe Webhook] Test event detected");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type} (${event.id})`);

      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = Number(session.metadata?.user_id || session.client_reference_id);
            const amount = session.amount_total ? session.amount_total / 100 : 0;
            
            if (userId && amount > 0) {
              // 1. BLINDAGEM DE ENTREGA: 1 unidade (BRL/USD/EUR) = 5 créditos
              const credits = Math.round(amount * 5);
              
              // addExtraCreditTransaction handles idempotency via session.id
              await addExtraCreditTransaction(
                userId, 
                amount.toString(), 
                credits, 
                session.id
              );

              // 2. ATUALIZAÇÃO DE STATUS PREMIUM
              if (session.mode === "subscription") {
                await db.update(wilborUsers)
                  .set({ subscriptionStatus: "premium" })
                  .where(eq(wilborUsers.id, userId));
                
                await db.update(wilborUserCredits)
                  .set({
                    plan: "premium",
                    monthlyLimit: 500,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                  })
                  .where(eq(wilborUserCredits.userId, userId));
              }

              // 3. TRACK CONVERSION
              await db.insert(wilborConversionEvents).values({
                userId: userId,
                eventType: "payment_success",
                metadata: JSON.stringify({
                  sessionId: session.id,
                  amount: session.amount_total,
                  currency: session.currency,
                  mode: session.mode,
                }),
              });

              console.log(`[Stripe] User ${userId} processed successfully. Credits: ${credits}`);
            }

            // 4. ENTREGA DE E-BOOK (Venda Única)
            if (session.metadata?.type === "ebook_purchase") {
              const ebookId = session.metadata.ebookId;
              if (userId && ebookId) {
                await db.insert(wilborEbookPurchases).values({
                  userId,
                  ebookId,
                  amount: session.amount_total || 0,
                  currency: session.currency || "brl",
                  stripeSessionId: session.id,
                  status: "completed",
                }).onDuplicateKeyUpdate({
                  set: { status: "completed" }
                });
                console.log(`[Stripe] E-book ${ebookId} delivered to User ${userId}`);
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = Number(subscription.metadata?.user_id);
            
            if (userId) {
              // Downgrade user back to Basic/Free
              await db.update(wilborUsers)
                .set({ subscriptionStatus: "basic" })
                .where(eq(wilborUsers.id, userId));

              await db.update(wilborUserCredits)
                .set({
                  plan: "free",
                  monthlyLimit: 5,
                  stripeSubscriptionId: null,
                })
                .where(eq(wilborUserCredits.userId, userId));

              console.log(`[Stripe] User ${userId} downgraded (subscription cancelled)`);
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subId = invoice.subscription as string;
            
            if (subId) {
              const userCredits = await db.select().from(wilborUserCredits)
                .where(eq(wilborUserCredits.stripeSubscriptionId, subId))
                .limit(1);

              if (userCredits.length > 0) {
                const userId = userCredits[0].userId;
                
                await db.insert(wilborConversionEvents).values({
                  userId: userId,
                  eventType: "payment_failed",
                  metadata: JSON.stringify({ invoiceId: invoice.id }),
                });

                const manychatId = invoice.metadata?.manychat_subscriber_id;
                if (manychatId) {
                  await notifyManyChatPaymentFailed(manychatId);
                }
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
}

/**
 * Create a Stripe Checkout Session for Premium subscription.
 */
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  origin: string,
  manychatSubscriberId?: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: "Stripe not configured." };
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
        manychat_subscriber_id: manychatSubscriberId ?? "",
      },
      subscription_data: {
        metadata: {
          user_id: userId.toString(),
          manychat_subscriber_id: manychatSubscriberId ?? "",
        },
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
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?payment=cancelled`,
    });

    return { url: session.url! };
  } catch (err: any) {
    console.error("[Stripe] Checkout session creation failed:", err.message);
    return { error: err.message };
  }
}
