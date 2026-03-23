/**
 * Multi-Currency Support for Wilbor
 * Suporte para USD, EUR, BRL com conversão automática
 */

export type Currency = "USD" | "EUR" | "BRL";

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  stripeCode: string;
  exchangeRate: number; // em relação a USD
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    stripeCode: "usd",
    exchangeRate: 1,
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    stripeCode: "eur",
    exchangeRate: 0.92, // 1 EUR = 0.92 USD (aproximado)
    locale: "de-DE",
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    stripeCode: "brl",
    exchangeRate: 4.97, // 1 BRL = 4.97 USD (aproximado)
    locale: "pt-BR",
  },
};

// Preços base em USD (centavos)
export const PRICING_USD = {
  growth_crises_monthly: 999, // $9.99
  growth_crises_annual: 9999, // $99.99
  sleep_tracker_monthly: 499, // $4.99
  sleep_tracker_annual: 4999, // $49.99
  full_suite_monthly: 1999, // $19.99
  full_suite_annual: 19999, // $199.99
};

/**
 * Converte preço de USD para outra moeda
 */
export function convertPrice(priceUSD: number, targetCurrency: Currency): number {
  const config = CURRENCIES[targetCurrency];
  return Math.round(priceUSD * config.exchangeRate);
}

/**
 * Formata preço com símbolo de moeda
 */
export function formatPrice(amount: number, currency: Currency): string {
  const config = CURRENCIES[currency];
  const dollars = amount / 100;
  return `${config.symbol}${dollars.toFixed(2)}`;
}

/**
 * Retorna preços em uma moeda específica
 */
export function getPricingByCurrency(currency: Currency) {
  return Object.entries(PRICING_USD).reduce(
    (acc, [key, priceUSD]) => {
      acc[key as keyof typeof PRICING_USD] = convertPrice(priceUSD, currency);
      return acc;
    },
    {} as Record<keyof typeof PRICING_USD, number>
  );
}

/**
 * Retorna configuração de moeda
 */
export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  return CURRENCIES[currency];
}

/**
 * Detecta moeda baseado no país/locale do usuário
 */
export function detectCurrency(locale?: string): Currency {
  if (!locale) return "USD";

  if (locale.includes("pt") || locale.includes("br") || locale.includes("BR")) {
    return "BRL";
  }
  if (locale.includes("de") || locale.includes("fr") || locale.includes("it") || locale.includes("es")) {
    return "EUR";
  }
  return "USD";
}

/**
 * Valida se é uma moeda suportada
 */
export function isValidCurrency(currency: string): currency is Currency {
  return currency in CURRENCIES;
}

/**
 * Retorna lista de moedas disponíveis
 */
export function getAvailableCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}
