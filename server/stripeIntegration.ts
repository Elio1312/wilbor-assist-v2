import Stripe from "stripe";

// Lazy load Stripe para evitar erro se chave não estiver disponível
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY não configurada");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2023-10-16" as any,
    });
  }
  return stripeInstance;
}

/**
 * Criar sessão de checkout para compra de créditos extras - Suporte Multi-Moeda
 */
export async function createExtraCreditsCheckout(userId: number, amount: number, currency: string = "brl") {
  try {
    const stripe = getStripe();
    
    // Nomes de produtos internacionalizados
    const productNames: Record<string, string> = {
      brl: "Créditos Extras Wilbor",
      usd: "Wilbor Extra Credits",
      eur: "Créditos Extras Wilbor (EUR)",
      fr: "Crédits Supplémentaires Wilbor",
      de: "Wilbor Extra-Guthaben"
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productNames[currency.toLowerCase()] || productNames.en,
              description: `Top up your AI credits to continue using Wilbor Assist`,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.VITE_FRONTEND_URL || "https://www.wilbor-assist.com"}/dashboard?payment=success&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL || "https://www.wilbor-assist.com"}/dashboard?payment=cancelled`,
      metadata: {
        userId: String(userId),
        amount: String(amount),
        currency: currency.toUpperCase(),
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
    return session;
  } catch (error) {
    console.error("[Stripe] Failed to get payment status:", error);
    throw error;
  }
}

/**
 * Processar webhook de pagamento
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  const stripe = getStripe();
  
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[Stripe] Payment completed:", session.id);
      return { success: true, session };

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("[Stripe] Payment intent succeeded:", paymentIntent.id);
      return { success: true, paymentIntent };

    default:
      return { success: true };
  }
}
