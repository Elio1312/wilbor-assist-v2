import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createExtraCreditsCheckout } from "./stripeIntegration";
import { addExtraCreditTransaction, logSosUsage } from "./db";

export const stripeRouter = router({
  /**
   * Criar sessão de checkout para compra de créditos extras
   */
  createCheckout: protectedProcedure
    .input(z.object({
      amountReais: z.number().min(9.90).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await createExtraCreditsCheckout(ctx.user.id, input.amountReais);
        
        // Log do evento
        console.log(`[Stripe] Checkout session created for user ${ctx.user.id}: ${session.id}`);
        
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
   * Verificar status de pagamento
   */
  checkPaymentStatus: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const Stripe = require("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        
        if (session.payment_status === "paid") {
          const amountReais = (session.amount_total / 100).toFixed(2);
          const creditsReceived = Math.round(parseFloat(amountReais) * 5.5); // 1 real = 5.5 créditos
          
          // Registrar transação
          await addExtraCreditTransaction(
            ctx.user.id,
            amountReais,
            creditsReceived,
            session.id
          );
          
          // Log do SOS se foi injetado
          await logSosUsage(
            ctx.user.id,
            null,
            amountReais,
            creditsReceived,
            session.id
          );
          
          return {
            success: true,
            paid: true,
            amountReais,
            creditsReceived,
            message: `✅ Pagamento recebido! Você recebeu ${creditsReceived} créditos extras. 💜`,
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
   * Obter opções de compra de créditos
   */
  getCreditOptions: protectedProcedure.query(async () => {
    return [
      {
        id: "credits_50",
        amountReais: 9.90,
        creditsReceived: 50,
        label: "R$ 9,90 - 50 créditos",
        popular: false,
      },
      {
        id: "credits_150",
        amountReais: 29.90,
        creditsReceived: 150,
        label: "R$ 29,90 - 150 créditos (⭐ Mais popular)",
        popular: true,
      },
      {
        id: "credits_350",
        amountReais: 99.90,
        creditsReceived: 350,
        label: "R$ 99,90 - 350 créditos",
        popular: false,
      },
    ];
  }),
});
