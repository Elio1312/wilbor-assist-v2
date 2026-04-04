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
 * Criar sessão de checkout Multi-Moeda (ROI Máximo)
 */
export async function createExtraCreditsCheckout(
  userId: number, 
  amount: number, 
  currency: string = "brl",
  lang: string = "pt"
) {
  try {
    const stripe = getStripe();
    const frontendUrl = process.env.VITE_FRONTEND_URL || "https://www.wilbor-assist.com";
    
    // Ajusta a URL de retorno com base no idioma (UX Profissional)
    // Se o idioma for PT, vai para a raiz, senão vai para a subpasta do idioma
    const baseUrl = lang === "pt" ? frontendUrl : `${frontendUrl}/${lang}`;

    // Nomes de produtos internacionalizados (Pentaglota)
    const productNames: Record<string, string> = {
      pt: "Créditos Extras Wilbor",
      en: "Wilbor Extra Credits",
      es: "Créditos Extras Wilbor (ES)",
      fr: "Crédits Supplémentaires Wilbor",
      de: "Wilbor Extra-Guthaben"
    };

    const productDescriptions: Record<string, string> = {
      pt: "Apoio neonatal inteligente ilimitado",
      en: "Unlimited intelligent neonatal support",
      es: "Apoyo neonatal inteligente ilimitado",
      fr: "Soutien néonatal intelligent illimité",
      de: "Unbegrenzte intelligente neonatale Unterstützung"
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productNames[lang] || productNames.en,
              description: productDescriptions[lang] || productDescriptions.en,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop?payment=cancelled`,
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
 * Webhook: Onde a venda é consolidada no DB (Blindagem de Entrega)
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  // Importação dinâmica para evitar dependência circular
  const { addExtraCreditTransaction } = await import("./db");

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = Number(session.metadata?.userId);
      const amount = Number(session.metadata?.amount);
      const currency = session.metadata?.currency || "BRL";

      if (userId && amount) {
        // Regra de 95% de assertividade: 1 unidade (Real/Dólar/Euro) = 5 créditos
        const credits = Math.round(amount * 5);
        
        // Registrar transação e injetar créditos no banco de dados
        await addExtraCreditTransaction(userId, amount.toString(), credits, session.id);
        console.log(`[Stripe Webhook] Créditos entregues: User ${userId}, +${credits} créditos (${currency})`);
      }
      return { success: true };

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("[Stripe Webhook] Payment intent succeeded:", paymentIntent.id);
      return { success: true };

    default:
      return { success: true };
  }
}

/**
 * Verificar status de pagamento (Fallback para redirecionamento direto)
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
