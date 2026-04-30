export const STRIPE_PRICES = {
  monthly: {
    BRL: 'price_1TRcWOIHNiW11uckcSSwQNhM',
    GBP: 'price_1TRcY2IHNiW11uckHQYm9HdE',
    EUR: 'price_1TRcY2IHNiW11uckN7UfClv5',
    USD: 'price_1TRcY2IHNiW11uckOLEJSPot',
  },
  annual: {
    BRL: 'price_1TH94UIHNiW11uckwlghLfnh',
    USD: 'price_1TH94UIHNiW11uckW9HjsMrU',
    GBP: 'price_1TH94UIHNiW11uckVyt2fAW3',
    EUR: 'price_1TRcSVIHNiW11uckYHBYI3WJ',
  },
} as const;

export type PlanType = 'monthly' | 'annual';
export type CurrencyType = 'BRL' | 'USD' | 'EUR' | 'GBP';

export function getPriceId(plan: PlanType, currency: CurrencyType): string {
  return STRIPE_PRICES[plan][currency];
}
