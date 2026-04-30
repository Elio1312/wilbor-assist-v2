
import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createCheckoutSession, createAnnualCheckoutSession } from "./stripeWebhook";
import { getPaymentStatus, createExtraCreditsCheckout } from "./stripeIntegration";
import { addExtraCreditTransaction, logSosUsage } from "./db";
import { CurrencyType } from "./stripeProducts";

export const stripeRouter = router({

  // ── ASSINATURA (Mensal ou Anual) ──────────────────────────────────────────
  createCheckout: protectedProcedure
    .input(z.object({
      amount: z.number().min(1),
      currency: z.enum(["brl", "usd", "eur", "gbp"]).default("brl"),
      planType: z.enum(["premium", "annual"]).default("annual"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const currency = input.currency.toUpperCase() as CurrencyType;
        const origin = (ctx.req.headers.origin as string) || "https://wilbor-assist.com";

        let result;

        if (input.planType === "annual") {
          result = await createAnnualCheckoutSession(
            ctx.user.id,
            ctx.user.email ?? "",
            origin,
            currency
          );
        } else {
          result = await createCheckoutSession(
            ctx.user.id,
            ctx.user.email ?? "",
            ctx.user.name ?? "",
            origin,
            undefined,
            currency
          );
        }

        if ("error" in result) {
          console.error(`[Stripe] Checkout falhou: ${result.error}`);
          return { success: false, error: result.error };
        }

        console.log(`[Stripe] ✅ Checkout ${input.planType} criado para user ${ctx.user.id} (${currency})`);
        return { success: true, url: result.url };

      } catch (error: any) {
        console.error("[Stripe] createCheckout falhou:", error);
        return { success: false, error: "Erro ao processar. Tente novamente." };
      }
    }),

  // ── CRÉDITOS EXTRAS (one-time) ────────────────────────────────────────────
  createExtraCredits: protectedProcedure
    .input(z.object({
      amount: z.number().min(5),
      currency: z.enum(["brl", "usd", "eur", "gbp"]).default("brl"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const lang = (ctx.user as any).language || "pt";
        const session = await createExtraCreditsCheckout(
          ctx.user.id, input.amount, input.currency, lang
        );
        return { success: true, sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("[Stripe] createExtraCredits falhou:", error);
        return { success: false, error: "Erro ao processar. Tente novamente." };
      }
    }),

  // ── VERIFICAR STATUS ──────────────────────────────────────────────────────
  checkPaymentStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await getPaymentStatus(input.sessionId);
        if (session.payment_status === "paid") {
          const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
          const currency = session.currency?.toUpperCase() || "BRL";
          const creditsReceived = Math.round(amountTotal * 5);
          await addExtraCreditTransaction(ctx.user.id, amountTotal.toString(), creditsReceived, session.id);
          await logSosUsage(ctx.user.id, null, amountTotal.toString(), creditsReceived, session.id);
          return { success: true, paid: true, amount: amountTotal, currency, creditsReceived };
        }
        return { success: true, paid: false };
      } catch (error) {
        console.error("[Stripe] checkPaymentStatus falhou:", error);
        return { success: false, error: "Erro ao verificar status." };
      }
    }),

  // ── OPÇÕES DE CRÉDITO ─────────────────────────────────────────────────────
  getCreditOptions: protectedProcedure.query(async ({ ctx }) => {
    const lang = (ctx.user as any).language || "pt";
    const options: Record<string, any[]> = {
      pt: [
        { id: "c1", amount: 9.90,  creditsReceived: 50,  label: "R$ 9,90 - 50 créditos",              currency: "BRL" },
        { id: "c2", amount: 29.90, creditsReceived: 150, label: "R$ 29,90 - 150 créditos (⭐ Popular)", currency: "BRL", popular: true },
        { id: "c3", amount: 99.90, creditsReceived: 500, label: "R$ 99,90 - 500 créditos",             currency: "BRL" },
      ],
      en: [
        { id: "c1", amount: 4.90,  creditsReceived: 25,  label: "$ 4.90 - 25 credits",                currency: "USD" },
        { id: "c2", amount: 9.90,  creditsReceived: 50,  label: "$ 9.90 - 50 credits (⭐ Popular)",   currency: "USD", popular: true },
        { id: "c3", amount: 29.90, creditsReceived: 150, label: "$ 29.90 - 150 credits",              currency: "USD" },
      ],
    };
    return options[lang] || options.en;
  }),
});
