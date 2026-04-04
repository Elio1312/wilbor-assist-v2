import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createExtraCreditsCheckout, getPaymentStatus } from "./stripeIntegration";
import { addExtraCreditTransaction, logSosUsage } from "./db";

export const stripeRouter = router({
  /**
   * Criar sessão de checkout - Agora com suporte a Multi-Moeda (ROI)
   */
  createCheckout: protectedProcedure
    .input(z.object({
      amount: z.number().min(5), // Mínimo de 5 na moeda local
      currency: z.enum(["brl", "usd", "eur"]).default("brl"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Passamos o idioma do usuário para o Stripe para URLs e nomes de produtos localizados
        const lang = (ctx.user as any).language || "pt";
        const session = await createExtraCreditsCheckout(ctx.user.id, input.amount, input.currency, lang);
        
        // Log do evento
        console.log(`[Stripe] Checkout session created for user ${ctx.user.id}: ${session.id} (${input.currency.toUpperCase()}) [Lang: ${lang}]`);
        
        return {
          success: true,
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Failed to create checkout:", error);
        return {
          success: false,
          error: "Não conseguimos processar sua solicitação. Tente novamente.",
        };
      }
    }),

  /**
   * Verificar status de pagamento (Otimizado)
   */
  checkPaymentStatus: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await getPaymentStatus(input.sessionId);
        
        if (session.payment_status === "paid") {
          const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
          const currency = session.currency?.toUpperCase() || "BRL";
          
          // Fator de conversão dinâmico (Sugestão: 1 unidade monetária = 5 créditos)
          // Em BRL, 29.90 reais = ~150 créditos (29.90 * 5 = 149.5)
          // Em USD, 9.90 dólares = ~50 créditos (9.90 * 5 = 49.5)
          const creditsReceived = Math.round(amountTotal * 5); 
          
          // Registrar transação
          await addExtraCreditTransaction(
            ctx.user.id,
            amountTotal.toString(),
            creditsReceived,
            session.id
          );
          
          // Log do SOS se foi injetado
          await logSosUsage(
            ctx.user.id,
            null,
            amountTotal.toString(),
            creditsReceived,
            session.id
          );
          
          return {
            success: true,
            paid: true,
            amount: amountTotal,
            currency,
            creditsReceived,
            message: `✅ Pagamento confirmado em ${currency}! +${creditsReceived} créditos. 💜`,
          };
        }
        
        return {
          success: true,
          paid: false,
          message: "Pagamento ainda não confirmado.",
        };
      } catch (error) {
        console.error("[Stripe] Failed to check payment:", error);
        return {
          success: false,
          error: "Não conseguimos verificar o status do pagamento.",
        };
      }
    }),

  /**
   * Opções de Crédito Internacionalizadas (Escalabilidade)
   */
  getCreditOptions: protectedProcedure.query(async ({ ctx }) => {
    // Detecta o idioma do usuário para mostrar a moeda correta
    const lang = (ctx.user as any).language || "pt";
    
    const options: Record<string, any[]> = {
      pt: [
        { id: "c1", amount: 9.90, creditsReceived: 50, label: "R$ 9,90 - 50 créditos", currency: "BRL" },
        { id: "c2", amount: 29.90, creditsReceived: 150, label: "R$ 29,90 - 150 créditos (⭐ Popular)", currency: "BRL", popular: true },
        { id: "c3", amount: 99.90, creditsReceived: 500, label: "R$ 99,90 - 500 créditos", currency: "BRL" },
      ],
      en: [
        { id: "c1", amount: 4.90, creditsReceived: 25, label: "$ 4.90 - 25 credits", currency: "USD" },
        { id: "c2", amount: 9.90, creditsReceived: 50, label: "$ 9.90 - 50 credits (⭐ Popular)", currency: "USD", popular: true },
        { id: "c3", amount: 29.90, creditsReceived: 150, label: "$ 29.90 - 150 credits", currency: "USD" },
      ],
      es: [
        { id: "c1", amount: 4.90, creditsReceived: 25, label: "€ 4,90 - 25 créditos", currency: "EUR" },
        { id: "c2", amount: 9.90, creditsReceived: 50, label: "€ 9,90 - 50 créditos (⭐ Popular)", currency: "EUR", popular: true },
        { id: "c3", amount: 29.90, creditsReceived: 150, label: "€ 29,90 - 150 créditos", currency: "EUR" },
      ],
      fr: [
        { id: "c1", amount: 4.90, creditsReceived: 25, label: "4,90 € - 25 crédits", currency: "EUR" },
        { id: "c2", amount: 9.90, creditsReceived: 50, label: "9,90 € - 50 crédits (⭐ Populaire)", currency: "EUR", popular: true },
        { id: "c3", amount: 29.90, creditsReceived: 150, label: "29,90 € - 150 crédits", currency: "EUR" },
      ],
      de: [
        { id: "c1", amount: 4.90, creditsReceived: 25, label: "4,90 € - 25 Credits", currency: "EUR" },
        { id: "c2", amount: 9.90, creditsReceived: 50, label: "9,90 € - 50 Credits (⭐ Beliebt)", currency: "EUR", popular: true },
        { id: "c3", amount: 29.90, creditsReceived: 150, label: "29,90 € - 150 Credits", currency: "EUR" },
      ]
    };

    return options[lang] || options.en;
  }),
});
