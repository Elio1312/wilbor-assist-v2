/**
 * Multi-Currency Support for Wilbor
 * Suporte para BRL, USD, GBP com conversão automática
 * Preços fixos por região (não conversões)
 */

// Tipos de moeda suportada
export type Currency = "USD" | "GBP" | "BRL" | "EUR";

// Interface de configuração de moeda
export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  stripeCode: string;
  locale: string;
  region: "br" | "us" | "uk" | "eu";
}

// Configuração de moedas
export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    stripeCode: "brl",
    locale: "pt-BR",
    region: "br",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    stripeCode: "usd",
    locale: "en-US",
    region: "us",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    stripeCode: "gbp",
    locale: "en-GB",
    region: "uk",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    stripeCode: "eur",
    locale: "de-DE",
    region: "eu",
  },
};

// ==========================================
// PREÇOS WILBOR - TABELA FINAL 2026
// ==========================================
// 🇧🇷 BRASIL: Premium R$29/mês, Manual R$59 único
// 🇺🇸 EUA (USD): Premium $5.99/mês, Manual $12.99 único
// 🇬🇧 UK (GBP): Premium £4.99/mês, Manual £10.99 único
// 🇪🇺 EUROPA (EUR): Premium €5.99/mês, Manual €12.99 único

export const WILBOR_PRICING = {
  // BRASIL (BRL) - centavos
  br: {
    premium_monthly: 2900,      // R$ 29,00/mês
    manual_one_time: 5900,       // R$ 59,00 pagamento único
  },
  // EUA (USD) - centavos
  us: {
    premium_monthly: 599,      // $5.99/mês
    manual_one_time: 1299,      // $12.99 pagamento único
  },
  // UK (GBP) - centavos
  uk: {
    premium_monthly: 499,      // £4.99/mês
    manual_one_time: 1099,      // £10.99 pagamento único
  },
  // EUROPA (EUR) - centavos
  eu: {
    premium_monthly: 599,      // €5.99/mês
    manual_one_time: 1299,      // €12.99 pagamento único
  },
};

// Função para obter preço formatado
export function formatWilborPrice(amount: number, currency: Currency): string {
  const config = CURRENCIES[currency];
  const value = amount / 100;
  return `${config.symbol}${value.toFixed(2)}`;
}

// Função para obter configuração de região
export function getRegionConfig(currency: Currency): CurrencyConfig {
  return CURRENCIES[currency];
}

// Detecta região baseado no locale
export function detectRegion(locale?: string): "br" | "us" | "uk" | "eu" {
  if (!locale) return "us";

  if (locale.includes("pt") || locale.includes("br") || locale.includes("BR")) {
    return "br";
  }

  if (locale.includes("gb") || locale.includes("uk")) {
    return "uk";
  }

  if (locale.includes("de") || locale.includes("fr") || locale.includes("es") || locale.includes("it") || locale.includes("eu")) {
    return "eu";
  }

  return "us";
}

// Detecta moeda baseado no país/locale do usuário
export function detectCurrency(locale?: string): Currency {
  const region = detectRegion(locale);

  switch (region) {
    case "br": return "BRL";
    case "uk": return "GBP";
    case "eu": return "EUR";
    default: return "USD";
  }
}

// Valida se é uma moeda suportada
export function isValidCurrency(currency: string): currency is Currency {
  return currency in CURRENCIES;
}

// Retorna lista de moedas disponíveis
export function getAvailableCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}

// Obtém preços para uma região específica
export function getPricingByRegion(region: "br" | "us" | "uk") {
  return WILBOR_PRICING[region];
}

// Obtém preço formatado para região
export function getFormattedPrice(
  type: "premium_monthly" | "manual_one_time",
  currency: Currency
): string {
  const region = CURRENCIES[currency].region;
  const amount = WILBOR_PRICING[region][type];
  return formatWilborPrice(amount, currency);
}

// ==========================================
// DEPRECATED - Mantido para compatibilidade
// ==========================================

// Preços base em USD (para referência apenas)
export const PRICING_USD = {
  premium_monthly: 599,        // $5.99
  manual_one_time: 1299,       // $12.99
};

/**
 * Converte preço entre moedas (usado apenas para referência)
 */
export function convertPrice(priceUSD: number, targetCurrency: Currency): number {
  // Retorna preço fixo da tabela, não conversão
  const region = CURRENCIES[targetCurrency].region;
  return WILBOR_PRICING[region].premium_monthly;
}

/**
 * Formata preço com símbolo de moeda
 */
export function formatPrice(amount: number, currency: Currency): string {
  return formatWilborPrice(amount, currency);
}

/**
 * Retorna preços em uma moeda específica
 */
export function getPricingByCurrency(currency: Currency) {
  const region = CURRENCIES[currency].region;
  return {
    premium_monthly: WILBOR_PRICING[region].premium_monthly,
    manual_one_time: WILBOR_PRICING[region].manual_one_time,
  };
}

/**
 * Retorna configuração de moeda
 */
export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  return CURRENCIES[currency];
}