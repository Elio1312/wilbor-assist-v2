/**
 * Stripe Multi-Currency Routes
 * Suporte para pagamentos em USD, EUR, BRL
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { Currency, CURRENCIES, getPricingByCurrency, convertPrice, formatPrice, isValidCurrency } from "./currency";

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
      currency: z.enum(["USD", "EUR", "BRL"]).default("USD"),
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

  // Create checkout session with currency
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
      currency: z.enum(["USD", "EUR", "BRL"]).default("USD"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isValidCurrency(input.currency)) {
        throw new Error("Invalid currency");
      }

      const pricing = getPricingByCurrency(input.currency as Currency);
      const amount = pricing[input.planId as keyof typeof pricing];
      const config = CURRENCIES[input.currency as Currency];

      // Aqui você integraria com Stripe API
      // Por enquanto, retornamos um mock
      return {
        success: true,
        sessionId: `session_${Date.now()}`,
        currency: input.currency,
        amount: amount,
        formatted: formatPrice(amount, input.currency as Currency),
        planId: input.planId,
        message: `Checkout session criada para ${input.planId} em ${config.name}`,
      };
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
