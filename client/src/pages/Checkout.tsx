import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { Heart, Check, Loader2, ShieldCheck, ArrowLeft, Globe } from "lucide-react";
import { toast } from "sonner";

// Currency options with localized labels
const CURRENCIES = [
  { code: "brl", symbol: "R$", label: "Brasil (R$)", rate: 1 },
  { code: "usd", symbol: "$", label: "United States ($)", rate: 5.5 },
  { code: "eur", symbol: "€", label: "Europe (€)", rate: 5.0 },
];

// Price mapping: BRL is the base (R$ 29 premium, R$ 9.90 basic)
const getPrice = (plan: "basic" | "premium", currency: string) => {
  const basePremium = 29;
  const baseBasic = 9.9;
  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  if (plan === "premium") {
    return {
      amount: Math.round(basePremium / currencyInfo.rate * 100) / 100,
      display: `${currencyInfo.symbol}${(basePremium / currencyInfo.rate).toFixed(2)}`
    };
  }
  return {
    amount: Math.round(baseBasic / currencyInfo.rate * 100) / 100,
    display: `${currencyInfo.symbol}${(baseBasic / currencyInfo.rate).toFixed(2)}`
  };
};

export default function Checkout() {
  const { t, localePath, locale } = useI18n();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("premium");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    // Auto-detect currency based on locale
    if (locale === "en") return "usd";
    if (locale === "fr") return "eur";
    if (locale === "de") return "eur";
    if (locale === "es") return "usd";
    return "brl";
  });
  const { data: user } = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });

  // Prevent Google from indexing private/auth-required pages
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  
  // 1. Mutação conectada ao Stripe Multi-Currency revisado
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

    const price = getPrice(selectedPlan, selectedCurrency);
    checkout.mutate({ amount: price.amount, currency: selectedCurrency });
  };

  const features = t("paywall.features").split(",");

  return (
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

        {/* Currency Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Globe className="size-4 text-gray-500" />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {(["basic", "premium"] as const).map((plan) => {
            const price = getPrice(plan, selectedCurrency);
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
                    {plan === "premium" ? t("pricing.premium_popular") : t("pricing.free_name")}
                  </span>
                  {selectedPlan === plan && <Check className="size-5 text-purple-600" />}
                </div>
                <h2 className="text-xl font-bold mb-2 capitalize">
                  {plan === "premium" ? t("pricing.premium_name") : t("pricing.free_name")}
                </h2>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{price.display}</span>
                  <span className="text-gray-500 text-sm">/mês</span>
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
              <ShieldCheck className="size-4 text-green-500" /> Pagamento Seguro via Stripe
            </div>
            <span className="hidden sm:inline">•</span>
            <div>Cancelamento fácil a qualquer momento</div>
          </div>
        </div>
      </div>
    </div>
  );
}
