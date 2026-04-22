/**
 * Stripe Multi-Currency Routes
 * Suporte para pagamentos em USD, EUR, BRL, GBP
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { Currency, CURRENCIES, getPricingByCurrency, convertPrice, formatPrice, isValidCurrency } from "./currency";
import { createExtraCreditsCheckout } from "./stripeIntegration";

export const stripeMultiCurrencyRouter = router({
  // Get available currencies
  getAvailableCurrencies: publicProcedure.query(() => {
    return Object.values(CURRENCIES).map(config => ({
      code: config.code,
      symbol: config.symbol,
      name: config.name,
    }));
  }),

  // Get pricing in specific currency
  getPricing: publicProcedure
    .input(z.object({
      currency: z.enum(["USD", "EUR", "BRL", "GBP"]).default("USD"),
    }))
    .query(({ input }) => {
      if (!isValidCurrency(input.currency)) {
        return null;
      }

      const pricing = getPricingByCurrency(input.currency as Currency);
      const config = CURRENCIES[input.currency as Currency];

      return {
        currency: input.currency,
        symbol: config.symbol,
        locale: config.locale,
        prices: {
          growthCrisesMonthly: {
            amount: pricing.growth_crises_monthly,
            formatted: formatPrice(pricing.growth_crises_monthly, input.currency as Currency),
          },
          growthCrisesAnnual: {
            amount: pricing.growth_crises_annual,
            formatted: formatPrice(pricing.growth_crises_annual, input.currency as Currency),
          },
          sleepTrackerMonthly: {
            amount: pricing.sleep_tracker_monthly,
            formatted: formatPrice(pricing.sleep_tracker_monthly, input.currency as Currency),
          },
          sleepTrackerAnnual: {
            amount: pricing.sleep_tracker_annual,
            formatted: formatPrice(pricing.sleep_tracker_annual, input.currency as Currency),
          },
          fullSuiteMonthly: {
            amount: pricing.full_suite_monthly,
            formatted: formatPrice(pricing.full_suite_monthly, input.currency as Currency),
          },
          fullSuiteAnnual: {
            amount: pricing.full_suite_annual,
            formatted: formatPrice(pricing.full_suite_annual, input.currency as Currency),
          },
        },
      };
    }),

  // Create checkout session with currency (INTEGRAÇÃO REAL)
  createCheckoutSession: protectedProcedure
    .input(z.object({
      planId: z.enum([
        "growth_crises_monthly",
        "growth_crises_annual",
        "sleep_tracker_monthly",
        "sleep_tracker_annual",
        "full_suite_monthly",
        "full_suite_annual",
      ]),
      currency: z.enum(["USD", "EUR", "BRL", "GBP"]).default("USD"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isValidCurrency(input.currency)) {
        throw new Error("Invalid currency");
      }

      const pricing = getPricingByCurrency(input.currency as Currency);
      const amount = pricing[input.planId as keyof typeof pricing];
      const config = CURRENCIES[input.currency as Currency];

      // Mapear planId para nomes de produtos internacionalizados
      const productNames: Record<string, Record<string, string>> = {
        growth_crises_monthly: {
          pt: "Crises de Crescimento - Mensal",
          en: "Growth Crises - Monthly",
          es: "Crisis de Crecimiento - Mensual",
          fr: "Crises de Croissance - Mensuel",
          de: "Wachstumskrisen - Monatlich",
        },
        growth_crises_annual: {
          pt: "Crises de Crescimento - Anual",
          en: "Growth Crises - Annual",
          es: "Crisis de Crecimiento - Anual",
          fr: "Crises de Croissance - Annuel",
          de: "Wachstumskrisen - Jährlich",
        },
        sleep_tracker_monthly: {
          pt: "Rastreador de Sono - Mensal",
          en: "Sleep Tracker - Monthly",
          es: "Rastreador de Sueño - Mensual",
          fr: "Suivi du Sommeil - Mensuel",
          de: "Schlaf-Tracker - Monatlich",
        },
        sleep_tracker_annual: {
          pt: "Rastreador de Sono - Anual",
          en: "Sleep Tracker - Annual",
          es: "Rastreador de Sueño - Anual",
          fr: "Suivi du Sommeil - Annuel",
          de: "Schlaf-Tracker - Jährlich",
        },
        full_suite_monthly: {
          pt: "Wilbor Premium - Mensal",
          en: "Wilbor Premium - Monthly",
          es: "Wilbor Premium - Mensual",
          fr: "Wilbor Premium - Mensuel",
          de: "Wilbor Premium - Monatlich",
        },
        full_suite_annual: {
          pt: "Wilbor Premium - Anual",
          en: "Wilbor Premium - Annual",
          es: "Wilbor Premium - Anual",
          fr: "Wilbor Premium - Annuel",
          de: "Wilbor Premium - Jährlich",
        },
      };

      const lang = (ctx.user as any).language || "pt";

      // Criar sessão real no Stripe
      try {
        const session = await createExtraCreditsCheckout(
          ctx.user.id,
          amount,
          input.currency.toLowerCase(),
          lang
        );

        return {
          success: true,
          sessionId: session.id,
          url: session.url,
          currency: input.currency,
          amount: amount,
          formatted: formatPrice(amount, input.currency as Currency),
          planId: input.planId,
          productName: productNames[input.planId]?.[lang] || productNames[input.planId]?.en,
          message: `Checkout ${config.name} criado com sucesso!`,
        };
      } catch (error) {
        console.error("[Stripe MultiCurrency] Failed to create session:", error);
        return {
          success: false,
          error: "Erro ao criar sessão de checkout. Tente novamente.",
        };
      }
    }),

  // Get exchange rates
  getExchangeRates: publicProcedure.query(() => {
    return Object.entries(CURRENCIES).reduce(
      (acc, [code, config]) => {
        acc[code as Currency] = {
          code: config.code,
          rate: config.exchangeRate,
          symbol: config.symbol,
        };
        return acc;
      },
      {} as Record<Currency, { code: string; rate: number; symbol: string }>
    );
  }),

  // Convert price between currencies
  convertPrice: publicProcedure
    .input(z.object({
      amount: z.number(),
      fromCurrency: z.enum(["USD", "EUR", "BRL"]).default("USD"),
      toCurrency: z.enum(["USD", "EUR", "BRL"]).default("USD"),
    }))
    .query(({ input }) => {
      if (!isValidCurrency(input.fromCurrency) || !isValidCurrency(input.toCurrency)) {
        throw new Error("Invalid currency");
      }

      // Converter para USD primeiro
      const fromConfig = CURRENCIES[input.fromCurrency as Currency];
      const amountInUSD = input.amount / fromConfig.exchangeRate;

      // Depois converter para moeda alvo
      const toConfig = CURRENCIES[input.toCurrency as Currency];
      const convertedAmount = Math.round(amountInUSD * toConfig.exchangeRate);

      return {
        original: {
          amount: input.amount,
          currency: input.fromCurrency,
          formatted: formatPrice(input.amount, input.fromCurrency as Currency),
        },
        converted: {
          amount: convertedAmount,
          currency: input.toCurrency,
          formatted: formatPrice(convertedAmount, input.toCurrency as Currency),
        },
        rate: (convertedAmount / input.amount).toFixed(4),
      };
    }),
});
