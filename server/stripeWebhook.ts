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
            // Lê userId de metadata.userId (shopRouter) ou user_id (stripeWebhook)
            const userId = Number(
              session.metadata?.userId ||
              session.metadata?.user_id ||
              session.client_reference_id
            );
            const paymentType = session.metadata?.type; // 'ebook_purchase' | 'subscription' | 'extra_credits'

            // ─── BIFURCAÇÃO PRINCIPAL: E-BOOK vs ASSINATURA/CRÉDITOS ───
            if (paymentType === "ebook_purchase") {
              // FLUXO 1: E-BOOK INDIVIDUAL — Registra entrega
              const ebookId = session.metadata?.ebookId;
              if (userId && ebookId) {
                await db.insert(wilborEbookPurchases).values({
                  userId,
                  ebookId,
                  amount: session.amount_total || 0,
                  currency: (session.currency || "brl").toUpperCase(),
                  stripeSessionId: session.id,
                  status: "completed",
                }).onDuplicateKeyUpdate({
                  set: { status: "completed" }
                });

                await db.insert(wilborConversionEvents).values({
                  userId,
                  eventType: "payment_success",
                  metadata: JSON.stringify({
                    sessionId: session.id,
                    ebookId,
                    amount: session.amount_total,
                    currency: session.currency,
                    type: "ebook_purchase",
                  }),
                });

                console.log(`[Stripe] ✅ E-book ${ebookId} entregue ao usuário ${userId}`);
              }
            } else if (paymentType === "ebook_bundle") {
              // FLUXO 1B: BUNDLE DE E-BOOKS — Registra todos os ebooks do bundle
              const ebookIds = session.metadata?.ebookIds?.split(",") || [];
              if (userId && ebookIds.length > 0) {
                const perEbookAmount = Math.round((session.amount_total || 0) / ebookIds.length);
                for (const ebookId of ebookIds) {
                  await db.insert(wilborEbookPurchases).values({
                    userId,
                    ebookId,
                    amount: perEbookAmount,
                    currency: (session.currency || "brl").toUpperCase(),
                    stripeSessionId: `${session.id}_${ebookId}`,
                    status: "completed",
                  }).onDuplicateKeyUpdate({
                    set: { status: "completed" }
                  });
                }

                await db.insert(wilborConversionEvents).values({
                  userId,
                  eventType: "payment_success",
                  metadata: JSON.stringify({
                    sessionId: session.id,
                    ebookIds,
                    amount: session.amount_total,
                    currency: session.currency,
                    type: "ebook_bundle",
                  }),
                });

                console.log(`[Stripe] ✅ Bundle (${ebookIds.join(",")}) entregue ao usuário ${userId}`);
              }
            } else {
              // FLUXO 2: ASSINATURA ou CRÉDITOS EXTRAS — Injeta créditos e atualiza status
              const amount = session.amount_total ? session.amount_total / 100 : 0;

              if (userId && amount > 0) {
                const credits = Math.round(amount * 5);

                // Registra transação de créditos (com idempotência via session.id)
                await addExtraCreditTransaction(
                  userId,
                  amount.toString(),
                  credits,
                  session.id
                );

                // Atualiza status para ASSINATURA PREMIUM
                if (session.mode === "subscription") {
                  await db.update(wilborUsers)
                    .set({ subscriptionStatus: "active" })
                    .where(eq(wilborUsers.id, userId));

                  await db.update(wilborUserCredits)
                    .set({
                      plan: "premium",
                      monthlyLimit: 500,
                      stripeCustomerId: session.customer as string,
                      stripeSubscriptionId: (session as any).subscription as string,
                    })
                    .where(eq(wilborUserCredits.userId, userId));

                  console.log(`[Stripe] ✅ Assinatura Premium ativada para usuário ${userId}`);
                } else {
                  console.log(`[Stripe] ✅ Créditos extras (+${credits}) adicionados ao usuário ${userId}`);
                }

                // Track conversão
                await db.insert(wilborConversionEvents).values({
                  userId,
                  eventType: "payment_success",
                  metadata: JSON.stringify({
                    sessionId: session.id,
                    amount: session.amount_total,
                    currency: session.currency,
                    mode: session.mode,
                    type: paymentType || "extra_credits",
                  }),
                });
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
                .set({ subscriptionStatus: "cancelled" })
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
            const subId = (invoice as any).subscription as string;
            
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
            currency: "usd",
            product_data: {
              name: "Wilbor Premium",
              description: "Assinatura mensal de IA para pais - ilimitada 24/7",
            },
            unit_amount: 599,
            recurring: {
              interval: "month",
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
