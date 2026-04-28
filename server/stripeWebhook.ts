import Stripe from "stripe";
import { Request, Response, Express } from "express";
import express from "express";
import { getDb, addExtraCreditTransaction } from "./db";
import { wilborUserCredits, wilborConversionEvents, wilborUsers, wilborEbookPurchases } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS } from "./stripeProducts";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY_CUSTOM || process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2023-10-16" as any });
}

async function notifyManyChatPaymentFailed(manychatSubscriberId: string): Promise<void> {
  const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
  if (!MANYCHAT_API_KEY) return;
  try {
    const response = await fetch("https://api.manychat.com/fb/sending/sendContent", {
      method: "POST",
      headers: { "Authorization": `Bearer ${MANYCHAT_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriber_id: manychatSubscriberId,
        data: {
          version: "v2",
          content: {
            messages: [{
              type: "text",
              text: "Olá! Notei um probleminha com seu cartão. Clique aqui para atualizar e continuar com o Wilbor: https://wilbor-assist.com/dashboard",
            }],
          },
        },
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`[Stripe] ManyChat falhou (${response.status}): ${body}`);
    }
  } catch (mcErr) {
    console.error("[Stripe] ManyChat error:", mcErr);
  }
}

export function registerStripeRoutes(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const stripe = getStripe();
      if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) return res.status(500).json({ error: "Webhook secret not configured" });

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ error: "Invalid signature" });
      }

      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event — ignorado");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] ${event.type} (${event.id})`);

      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        switch (event.type) {

          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = Number(
              session.metadata?.userId ||
              session.metadata?.user_id ||
              session.client_reference_id
            );
            const paymentType = session.metadata?.type;

            // ── EBOOK individual ──────────────────────────────────────────────
            if (paymentType === "ebook_purchase") {
              const ebookId = session.metadata?.ebookId;
              if (userId && ebookId) {
                await db.insert(wilborEbookPurchases).values({
                  userId, ebookId,
                  amount: session.amount_total || 0,
                  currency: (session.currency || "brl").toUpperCase(),
                  stripeSessionId: session.id,
                  status: "completed",
                }).onDuplicateKeyUpdate({ set: { status: "completed" } });

                await db.insert(wilborConversionEvents).values({
                  userId, eventType: "payment_success",
                  metadata: JSON.stringify({ sessionId: session.id, ebookId, type: "ebook_purchase" }),
                });
                console.log(`[Stripe] ✅ E-book ${ebookId} entregue ao usuário ${userId}`);
              }
              break;
            }

            // ── EBOOK bundle ──────────────────────────────────────────────────
            if (paymentType === "ebook_bundle") {
              const ebookIds = session.metadata?.ebookIds?.split(",") || [];
              if (userId && ebookIds.length > 0) {
                const perEbookAmount = Math.round((session.amount_total || 0) / ebookIds.length);
                for (const ebookId of ebookIds) {
                  await db.insert(wilborEbookPurchases).values({
                    userId, ebookId, amount: perEbookAmount,
                    currency: (session.currency || "brl").toUpperCase(),
                    stripeSessionId: `${session.id}_${ebookId}`,
                    status: "completed",
                  }).onDuplicateKeyUpdate({ set: { status: "completed" } });
                }
                await db.insert(wilborConversionEvents).values({
                  userId, eventType: "payment_success",
                  metadata: JSON.stringify({ sessionId: session.id, ebookIds, type: "ebook_bundle" }),
                });
                console.log(`[Stripe] ✅ Bundle (${ebookIds.join(",")}) entregue ao usuário ${userId}`);
              }
              break;
            }

            // ── ASSINATURA MENSAL (subscription) ─────────────────────────────
            if (session.mode === "subscription" && paymentType !== "annual") {
              if (userId) {
                await db.update(wilborUsers)
                  .set({ subscriptionStatus: "active" })
                  .where(eq(wilborUsers.id, userId));

                await db.update(wilborUserCredits)
                  .set({
                    plan: "premium",
                    monthlyLimit: 500,
                    messagesUsed: 0,
                    periodStart: new Date(),
                    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: (session as any).subscription as string,
                  })
                  .where(eq(wilborUserCredits.userId, userId));

                await db.insert(wilborConversionEvents).values({
                  userId, eventType: "payment_success",
                  metadata: JSON.stringify({ sessionId: session.id, type: "subscription_monthly" }),
                });
                console.log(`[Stripe] ✅ Premium Mensal ativado para usuário ${userId}`);
              }
              break;
            }

            // ── ASSINATURA ANUAL ──────────────────────────────────────────────
            if (paymentType === "annual" || session.metadata?.planType === "annual") {
              if (userId) {
                await db.update(wilborUsers)
                  .set({ subscriptionStatus: "active" })
                  .where(eq(wilborUsers.id, userId));

                await db.update(wilborUserCredits)
                  .set({
                    plan: "annual",
                    monthlyLimit: 999999,   // ilimitado na prática
                    messagesUsed: 0,
                    periodStart: new Date(),
                    periodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: (session as any).subscription as string,
                  })
                  .where(eq(wilborUserCredits.userId, userId));

                await db.insert(wilborConversionEvents).values({
                  userId, eventType: "payment_success",
                  metadata: JSON.stringify({ sessionId: session.id, type: "subscription_annual" }),
                });
                console.log(`[Stripe] ✅ Premium Anual ativado para usuário ${userId}`);
              }
              break;
            }

            // ── CRÉDITOS EXTRAS (one-time) ────────────────────────────────────
            if (userId && session.amount_total) {
              const amount = session.amount_total / 100;
              const credits = Math.round(amount * 5);
              await addExtraCreditTransaction(userId, amount.toString(), credits, session.id);
              await db.insert(wilborConversionEvents).values({
                userId, eventType: "payment_success",
                metadata: JSON.stringify({ sessionId: session.id, type: "extra_credits", amount }),
              });
              console.log(`[Stripe] ✅ Créditos extras (+${credits}) adicionados ao usuário ${userId}`);
            }
            break;
          }

          // ── CANCELAMENTO ─────────────────────────────────────────────────────
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = Number(subscription.metadata?.user_id);
            if (userId) {
              await db.update(wilborUsers)
                .set({ subscriptionStatus: "cancelled" })
                .where(eq(wilborUsers.id, userId));

              await db.update(wilborUserCredits)
                .set({ plan: "free", monthlyLimit: 5, stripeSubscriptionId: null })
                .where(eq(wilborUserCredits.userId, userId));

              console.log(`[Stripe] Usuário ${userId} revertido para Free (assinatura cancelada)`);
            }
            break;
          }

          // ── FALHA DE PAGAMENTO ────────────────────────────────────────────────
          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subId = (invoice as any).subscription as string;
            if (subId) {
              const userCredits = await db.select().from(wilborUserCredits)
                .where(eq(wilborUserCredits.stripeSubscriptionId, subId)).limit(1);
              if (userCredits.length > 0) {
                const userId = userCredits[0].userId;
                await db.insert(wilborConversionEvents).values({
                  userId, eventType: "payment_failed",
                  metadata: JSON.stringify({ invoiceId: invoice.id }),
                });
                const manychatId = invoice.metadata?.manychat_subscriber_id;
                if (manychatId) await notifyManyChatPaymentFailed(manychatId);
              }
            }
            break;
          }
        }
      } catch (err) {
        console.error("[Stripe Webhook] Erro ao processar evento:", err);
      }

      res.json({ received: true });
    }
  );
}

// ── createCheckoutSession: Premium Mensal ─────────────────────────────────────
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  origin: string,
  manychatSubscriberId?: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe not configured." };

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
        // SEM planType = mensal por padrão
      },
      subscription_data: {
        metadata: {
          user_id: userId.toString(),
          manychat_subscriber_id: manychatSubscriberId ?? "",
        },
      },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Wilbor Premium Mensal",
            description: "500 msgs/mês com IA — cancelamento a qualquer hora",
          },
          unit_amount: 599,   // $5,99
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?payment=cancelled`,
    });
    return { url: session.url! };
  } catch (err: any) {
    console.error("[Stripe] Checkout mensal falhou:", err.message);
    return { error: err.message };
  }
}

// ── createAnnualCheckoutSession: Premium Anual ────────────────────────────────
export async function createAnnualCheckoutSession(
  userId: number,
  userEmail: string,
  origin: string,
  currency: "brl" | "usd" | "eur" | "gbp" = "brl"
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe not configured." };

  // Preços por moeda (centavos)
  const prices: Record<string, { amount: number; currency: string; name: string }> = {
    brl: { amount: 14900, currency: "brl", name: "R$ 149" },
    usd: { amount: 4400,  currency: "usd", name: "$ 44"  },
    eur: { amount: 3900,  currency: "eur", name: "€ 39"  },
    gbp: { amount: 3400,  currency: "gbp", name: "£ 34"  },
  };
  const priceData = prices[currency];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      metadata: {
        user_id: userId.toString(),
        planType: "annual",   // FLAG que o webhook usa para identificar plano anual
        type: "annual",
      },
      subscription_data: {
        metadata: {
          user_id: userId.toString(),
          planType: "annual",
        },
      },
      line_items: [{
        price_data: {
          currency: priceData.currency,
          product_data: {
            name: "Wilbor Premium Anual",
            description: `Msgs ilimitadas com IA por 1 ano — ${priceData.name}/ano (37% de desconto)`,
          },
          unit_amount: priceData.amount,
          recurring: { interval: "year" },
        },
        quantity: 1,
      }],
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}&plan=annual`,
      cancel_url: `${origin}/shop?payment=cancelled`,
    });
    return { url: session.url! };
  } catch (err: any) {
    console.error("[Stripe] Checkout anual falhou:", err.message);
    return { error: err.message };
  }
}
