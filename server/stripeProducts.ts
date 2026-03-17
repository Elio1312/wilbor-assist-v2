// ==========================================
// STRIPE PRODUCT DEFINITIONS
// ==========================================
// Centralized product/price configuration for Wilbor Premium

export const PRODUCTS = {
  PREMIUM: {
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
    ],
    price: {
      amount: 1990, // R$ 19,90 in centavos
      currency: "brl",
      interval: "month" as const,
    },
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
