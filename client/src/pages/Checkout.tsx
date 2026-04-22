import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { Heart, Check, Loader2, ShieldCheck, ArrowLeft, Globe } from "lucide-react";
import { toast } from "sonner";
import { Seo, SEO_PRESETS } from "@/components/Seo";
import { AnalyticsEvents } from "@/lib/analytics";

// ==========================================
// PREÇOS WILBOR - TABELA FINAL 2026
// ==========================================
// 🇧🇷 BRASIL: Premium R$29/mês, Manual R$59 único
// 🇺🇸 EUA (USD): Premium $5.99/mês, Manual $12.99 único
// 🇬🇧 UK (GBP): Premium £4.99/mês, Manual £10.99 único

type Currency = "brl" | "usd" | "gbp" | "eur";
type PlanType = "premium" | "manual";

interface PriceInfo {
  amount: number; // em centavos
  display: string;
  period: string;
}

// Preços fixos por região (não conversão)
const PRICING: Record<Currency, Record<PlanType, PriceInfo>> = {
  brl: {
    premium: { amount: 2900, display: "R$ 29,00", period: "/mês" },
    manual: { amount: 5900, display: "R$ 59,00", period: " (único)" },
  },
  usd: {
    premium: { amount: 599, display: "$ 5.99", period: "/month" },
    manual: { amount: 1299, display: "$ 12.99", period: " (one-time)" },
  },
  gbp: {
    premium: { amount: 499, display: "£ 4.99", period: "/month" },
    manual: { amount: 1099, display: "£ 10.99", period: " (one-time)" },
  },
  eur: {
    premium: { amount: 599, display: "€ 5.99", period: "/month" },
    manual: { amount: 1299, display: "€ 12.99", period: " (one-time)" },
  },
};

// Moedas disponíveis com labels por idioma
const CURRENCIES: Record<string, { code: Currency; symbol: string; label: Record<string, string> }> = {
  brl: { code: "brl", symbol: "R$", label: { pt: "Brasil (R$)", en: "Brazil (R$)", es: "Brasil (R$)", fr: "Brésil (R$)", de: "Brasilien (R$)" } },
  usd: { code: "usd", symbol: "$", label: { pt: "Estados Unidos ($)", en: "United States ($)", es: "Estados Unidos ($)", fr: "États-Unis ($)", de: "USA ($)" } },
  gbp: { code: "gbp", symbol: "£", label: { pt: "Reino Unido (£)", en: "United Kingdom (£)", es: "Reino Unido (£)", fr: "Royaume-Uni (£)", de: "Großbritannien (£)" } },
  eur: { code: "eur", symbol: "€", label: { pt: "Europa (€)", en: "Europe (€)", es: "Europa (€)", fr: "Europe (€)", de: "Europa (€)" } },
};

// Detecta moeda baseada no locale
function detectCurrencyFromLocale(locale: string): Currency {
  if (locale === "pt") return "brl";
  if (locale === "en") return "usd";
  if (locale === "es") return "usd";
  if (locale === "fr") return "eur";
  if (locale === "de") return "eur";
  return "usd";
}

export default function Checkout() {
  const { t, localePath, locale } = useI18n();
  const [, setLocation] = useLocation();

  // Estado dos planos
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("premium");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => detectCurrencyFromLocale(locale));

  const { data: user } = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });

  // Previne indexação do Google em páginas privadas
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // Mutação para checkout
  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error(t("checkout.error"));
    }
  });

  const handleSubscribe = () => {
    if (!user) {
      setLocation(localePath("/chat"));
      return;
    }

    // Analytics: Plan Selected
    const price = PRICING[selectedCurrency][selectedPlan];
    AnalyticsEvents.planSelected(selectedPlan, price.amount / 100, selectedCurrency);

    // Analytics: Checkout Started
    AnalyticsEvents.checkoutStarted(selectedPlan, selectedCurrency);

    checkout.mutate({ amount: price.amount, currency: selectedCurrency });
  };

  // Features para display
  const features = t("paywall.features").split(",");

  // Labels dos planos por idioma
  const planLabels = {
    premium: {
      name: t("pricing.premium_name"),
      popular: t("pricing.premium_popular"),
    },
    manual: {
      name: t("pricing.manual_name") || "Manual",
      popular: "",
    },
  };

  return (
    <>
      <Seo />
      <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation(user ? localePath("/dashboard") : localePath("/"))}
          className="mb-8 gap-2 text-gray-500"
        >
          <ArrowLeft className="size-4" /> {t("common.back")}
        </Button>

        <div className="text-center mb-12">
          <Heart className="size-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">{t("checkout.title")}</h1>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{t("checkout.subtitle")}</p>
        </div>

        {/* Seletor de Moeda */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Globe className="size-4 text-gray-500" />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {Object.values(CURRENCIES).map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label[locale] || curr.label.en}
              </option>
            ))}
          </select>
        </div>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {(["premium", "manual"] as PlanType[]).map((plan) => {
            const price = PRICING[selectedCurrency][plan];
            return (
              <Card
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`p-6 cursor-pointer transition-all border-2 flex flex-col ${
                  selectedPlan === plan ? "border-purple-600 shadow-md" : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-purple-600">
                    {planLabels[plan].popular || (plan === "premium" ? "Popular" : "")}
                  </span>
                  {selectedPlan === plan && <Check className="size-5 text-purple-600" />}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {planLabels[plan].name}
                </h2>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{price.display}</span>
                  <span className="text-gray-500 text-sm">{price.period}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="size-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* CTA Principal */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Button
            onClick={handleSubscribe}
            disabled={checkout.isPending}
            className="w-full max-w-md h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-transform"
          >
            {checkout.isPending ? (
              <Loader2 className="size-5 animate-spin mr-2" />
            ) : (
              t("checkout.cta")
            )}
          </Button>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <ShieldCheck className="size-4 text-green-500" />
              {locale === "pt" ? "Pagamento Seguro via Stripe" :
               locale === "es" ? "Pago Seguro vía Stripe" :
               locale === "fr" ? "Paiement Sécurisé via Stripe" :
               locale === "de" ? "Sichere Zahlung über Stripe" :
               "Secure Payment via Stripe"}
            </div>
            <span className="hidden sm:inline">•</span>
            <div>
              {locale === "pt" ? "Cancelamento fácil a qualquer momento" :
               locale === "es" ? "Cancelación fácil en cualquier momento" :
               locale === "fr" ? "Annulation facile à tout moment" :
               locale === "de" ? "Einfache Stornierung jederzeit" :
               "Easy cancellation anytime"}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
