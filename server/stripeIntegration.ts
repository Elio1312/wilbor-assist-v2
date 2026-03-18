import Stripe from "stripe";
import { ENV } from "./_core/env";

// Lazy load Stripe para evitar erro se chave não estiver disponível
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY não configurada");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return stripeInstance;
}

/**
 * Criar sessão de checkout para compra de créditos extras
 */
export async function createExtraCreditsCheckout(userId: number, amountReais: number) {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Créditos Extras Wilbor",
              description: `Compre créditos extras para continuar usando IA inteligente`,
            },
            unit_amount: Math.round(amountReais * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.VITE_FRONTEND_URL || "https://www.wilbor-assist.com"}/dashboard?payment=success&userId=${userId}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL || "https://www.wilbor-assist.com"}/dashboard?payment=cancelled`,
      metadata: {
        userId: String(userId),
        amountReais: String(amountReais),
        type: "extra_credits",
      },
    });

    return session;
  } catch (error) {
    console.error("[Stripe] Failed to create checkout session:", error);
    throw error;
  }
}

/**
 * Verificar status de pagamento
 */
export async function getPaymentStatus(sessionId: string) {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error("[Stripe] Failed to get payment status:", error);
    throw error;
  }
}

/**
 * Processar webhook de pagamento
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[Stripe] Payment completed:", session.id);
      return { success: true, sessionId: session.id };

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("[Stripe] Payment intent succeeded:", paymentIntent.id);
      return { success: true, paymentIntentId: paymentIntent.id };

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      console.error("[Stripe] Payment failed:", failedIntent.id);
      return { success: false, error: "Payment failed" };

    default:
      console.log("[Stripe] Unhandled event type:", event.type);
      return { success: true };
  }
}
