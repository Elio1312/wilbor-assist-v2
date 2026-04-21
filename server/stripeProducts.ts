// ==========================================
// STRIPE PRODUCT DEFINITIONS - PREÇOS AJUSTADOS 2026
// ==========================================
// Estrutura de preços por região:
// 🇧🇷 BRASIL: Premium R$29/mês, Manual R$59 único
// 🇺🇸 EUA (USD): Premium $5.99/mês, Manual $12.99 único
// 🇬🇧 UK (GBP): Premium £4.99/mês, Manual £10.99 único

export const PRODUCTS = {
  // BRASIL - BRL
  PREMIUM_BRL: {
    name: "Wilbor Premium",
    description: "IA neonatal ilimitada 24h — sono, cólica, amamentação, alimentação e mais.",
    features: [
      "IA ilimitada",
      "Memória do bebê",
      "Histórico completo",
      "Respostas aprofundadas",
      "Alertas personalizados",
      "50+ receitas completas",
      "Análise avançada de sono",
      "Rastreamento de alimentação",
      "Módulo Meu Corpo",
    ],
    price: {
      amount: 2900, // R$ 29,00 in centavos
      currency: "brl",
      interval: "month" as const,
    },
    region: "br",
  },
  MANUAL_BRL: {
    name: "Wilbor Manual",
    description: "Acesso vitalício a todo o conteúdo — receitas, marcos, protocolos e mais.",
    features: [
      "Acesso vitalício",
      "55 receitas completas",
      "Marcos de desenvolvimento",
      "Protocolos de segurança",
      "Guias de alimentação",
      "Atualizações incluídas",
    ],
    price: {
      amount: 5900, // R$ 59,00 in centavos (pagamento único)
      currency: "brl",
      interval: "one_time" as const,
    },
    region: "br",
  },

  // EUA - USD
  PREMIUM_USD: {
    name: "Wilbor Premium",
    description: "Unlimited 24/7 AI support — sleep, colic, breastfeeding, feeding and more.",
    features: [
      "Unlimited AI",
      "Baby memory",
      "Complete history",
      "In-depth responses",
      "Personalized alerts",
      "50+ complete recipes",
      "Advanced sleep analysis",
      "Feeding tracker",
      "My Body module",
    ],
    price: {
      amount: 599, // $5.99 in centavos
      currency: "usd",
      interval: "month" as const,
    },
    region: "us",
  },
  MANUAL_USD: {
    name: "Wilbor Manual",
    description: "Lifetime access to all content — recipes, milestones, protocols and more.",
    features: [
      "Lifetime access",
      "55 complete recipes",
      "Development milestones",
      "Safety protocols",
      "Feeding guides",
      "Updates included",
    ],
    price: {
      amount: 1299, // $12.99 in centavos (pagamento único)
      currency: "usd",
      interval: "one_time" as const,
    },
    region: "us",
  },

  // UK - GBP
  PREMIUM_GBP: {
    name: "Wilbor Premium",
    description: "Unlimited 24/7 AI support — sleep, colic, breastfeeding, feeding and more.",
    features: [
      "Unlimited AI",
      "Baby memory",
      "Complete history",
      "In-depth responses",
      "Personalized alerts",
      "50+ complete recipes",
      "Advanced sleep analysis",
      "Feeding tracker",
      "My Body module",
    ],
    price: {
      amount: 499, // £4.99 in centavos
      currency: "gbp",
      interval: "month" as const,
    },
    region: "uk",
  },
  MANUAL_GBP: {
    name: "Wilbor Manual",
    description: "Lifetime access to all content — recipes, milestones, protocols and more.",
    features: [
      "Lifetime access",
      "55 complete recipes",
      "Development milestones",
      "Safety protocols",
      "Feeding guides",
      "Updates included",
    ],
    price: {
      amount: 1099, // £10.99 in centavos (pagamento único)
      currency: "gbp",
      interval: "one_time" as const,
    },
    region: "uk",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

// Helper functions para buscar produtos por região/moeda
export function getProductsByRegion(region: "br" | "us" | "uk") {
  return Object.entries(PRODUCTS).filter(([_, product]) => product.region === region);
}

export function getPremiumProduct(region: "br" | "us" | "uk") {
  const key = `${region.toUpperCase()}_PREMIUM` as ProductKey;
  return PRODUCTS[key];
}

export function getManualProduct(region: "br" | "us" | "uk") {
  const key = `${region.toUpperCase()}_MANUAL` as ProductKey;
  return PRODUCTS[key];
}