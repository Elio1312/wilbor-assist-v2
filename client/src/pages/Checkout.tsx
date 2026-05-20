import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { Heart, Check, Loader2, ShieldCheck, ArrowLeft, Globe, Zap, Star } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { AnalyticsEvents } from "@/lib/analytics";

// ==========================================
// PREÇOS WILBOR - TABELA 2026
// ==========================================
// Premium Mensal: BRL R$19,90 | USD $5,99 | EUR €5,49 | GBP £4,99
// Premium Anual:  BRL R$149   | USD $44   | EUR €39   | GBP £34

type Currency = "brl" | "usd" | "gbp" | "eur";
type PlanType = "premium" | "annual";

interface PriceInfo {
  amount: number;   // centavos
  display: string;
  period: string;
  equiv?: string;   // equivalente mensal (só no anual)
  discount?: string;
}

const PRICING: Record<Currency, Record<PlanType, PriceInfo>> = {
  brl: {
    premium: { amount: 1990,  display: "R$ 19,90", period: "/mês" },
    annual:  { amount: 14900, display: "R$ 149",   period: "/ano", equiv: "R$ 12,42/mês", discount: "37% off" },
  },
  usd: {
    premium: { amount: 599,  display: "$ 5,99", period: "/month" },
    annual:  { amount: 4400, display: "$ 44",   period: "/year",  equiv: "$ 3,67/month", discount: "39% off" },
  },
  eur: {
    premium: { amount: 549,  display: "€ 5,49", period: "/month" },
    annual:  { amount: 3900, display: "€ 39",   period: "/year",  equiv: "€ 3,25/month", discount: "41% off" },
  },
  gbp: {
    premium: { amount: 499,  display: "£ 4,99", period: "/month" },
    annual:  { amount: 3400, display: "£ 34",   period: "/year",  equiv: "£ 2,83/month", discount: "43% off" },
  },
};

const CURRENCIES: Record<string, { code: Currency; symbol: string; label: Record<string, string> }> = {
  brl: { code: "brl", symbol: "R$", label: { pt: "Brasil (R$)", en: "Brazil (R$)", es: "Brasil (R$)", fr: "Brésil (R$)", de: "Brasilien (R$)" } },
  usd: { code: "usd", symbol: "$",  label: { pt: "Estados Unidos ($)", en: "United States ($)", es: "Estados Unidos ($)", fr: "États-Unis ($)", de: "USA ($)" } },
  gbp: { code: "gbp", symbol: "£",  label: { pt: "Reino Unido (£)", en: "United Kingdom (£)", es: "Reino Unido (£)", fr: "Royaume-Uni (£)", de: "Großbritannien (£)" } },
  eur: { code: "eur", symbol: "€",  label: { pt: "Europa (€)", en: "Europe (€)", es: "Europa (€)", fr: "Europe (€)", de: "Europa (€)" } },
};

// ==========================================
// CHECKOUT COPY — 5 IDIOMAS
// ==========================================
const CHECKOUT_COPY: Record<string, {
  title: string;
  subtitle: string;
  socialProof: string;
  features: string[];
  annualExclusive: string;
  subscribeCta: string;
  backLabel: string;
  securePayment: string;
  easyCancellation: string;
}> = {
  pt: {
    title: "Escolha seu plano",
    subtitle: "Apoio neonatal baseado em SBP, OMS e AAP — disponível 24h, direto no celular.",
    socialProof: "Mães de mais de 40 países já usam o Wilbor.",
    features: [
      "Chat IA disponível 24h",
      "Diário do bebê",
      "Trilha de desenvolvimento",
      "Alertas de vacinas",
      "55 receitas com fotos por idade",
    ],
    annualExclusive: "Mensagens ilimitadas — sem teto mensal",
    subscribeCta: "Assinar agora",
    backLabel: "Voltar",
    securePayment: "Pagamento seguro via Stripe",
    easyCancellation: "Cancelamento fácil a qualquer momento",
  },
  en: {
    title: "Choose your plan",
    subtitle: "Evidence-based neonatal support (AAP, WHO, SBP) — available 24/7, right on your phone.",
    socialProof: "Mothers in 40+ countries already use Wilbor.",
    features: [
      "AI chat available 24/7",
      "Baby diary",
      "Development milestone tracker",
      "Vaccine reminders",
      "55 age-based recipes with photos",
    ],
    annualExclusive: "Unlimited messages — no monthly cap",
    subscribeCta: "Subscribe now",
    backLabel: "Back",
    securePayment: "Secure payment via Stripe",
    easyCancellation: "Easy cancellation anytime",
  },
  es: {
    title: "Elige tu plan",
    subtitle: "Apoyo neonatal basado en AAP, OMS y SBP — disponible 24/7, directo en tu celular.",
    socialProof: "Mamás de más de 40 países ya usan Wilbor.",
    features: [
      "Chat IA disponible 24/7",
      "Diario del bebé",
      "Seguimiento de hitos de desarrollo",
      "Alertas de vacunas",
      "55 recetas con fotos por edad",
    ],
    annualExclusive: "Mensajes ilimitados — sin límite mensual",
    subscribeCta: "Suscribirse ahora",
    backLabel: "Volver",
    securePayment: "Pago seguro con Stripe",
    easyCancellation: "Cancelación fácil en cualquier momento",
  },
  fr: {
    title: "Choisissez votre forfait",
    subtitle: "Soutien néonatal basé sur AAP, OMS et SBP — disponible 24h/7, directement sur votre téléphone.",
    socialProof: "Des mères de plus de 40 pays utilisent déjà Wilbor.",
    features: [
      "Chat IA disponible 24h/7",
      "Journal de bébé",
      "Suivi des étapes de développement",
      "Rappels de vaccins",
      "55 recettes avec photos par âge",
    ],
    annualExclusive: "Messages illimités — sans plafond mensuel",
    subscribeCta: "S'abonner maintenant",
    backLabel: "Retour",
    securePayment: "Paiement sécurisé via Stripe",
    easyCancellation: "Annulation facile à tout moment",
  },
  de: {
    title: "Wählen Sie Ihren Plan",
    subtitle: "Neonatale Unterstützung basierend auf AAP, WHO und SBP — 24/7 verfügbar, direkt auf Ihrem Handy.",
    socialProof: "Mütter aus über 40 Ländern nutzen bereits Wilbor.",
    features: [
      "KI-Chat 24/7 verfügbar",
      "Baby-Tagebuch",
      "Entwicklungsmeilenstein-Tracker",
      "Impferinnerungen",
      "55 altersgerechte Rezepte mit Fotos",
    ],
    annualExclusive: "Unbegrenzte Nachrichten — kein monatliches Limit",
    subscribeCta: "Jetzt abonnieren",
    backLabel: "Zurück",
    securePayment: "Sichere Zahlung über Stripe",
    easyCancellation: "Jederzeit einfach kündbar",
  },
};

function detectCurrencyFromLocale(locale: string): Currency {
  if (locale === "pt") return "brl";
  if (locale === "en") return "usd";
  if (locale === "fr" || locale === "de" || locale === "es") return "eur";
  return "usd";
}

// Labels dos planos por idioma
const PLAN_LABELS: Record<PlanType, Record<string, { name: string; badge: string; msgLimit: string }>> = {
  premium: {
    pt: { name: "Premium Mensal", badge: "Popular",        msgLimit: "500 msgs/mês com IA" },
    en: { name: "Monthly Premium", badge: "Popular",       msgLimit: "500 AI msgs/month" },
    es: { name: "Premium Mensual", badge: "Popular",       msgLimit: "500 msgs IA/mes" },
    fr: { name: "Premium Mensuel", badge: "Populaire",     msgLimit: "500 msgs IA/mois" },
    de: { name: "Monatlich Premium", badge: "Beliebt",     msgLimit: "500 KI-Nachrichten/Monat" },
  },
  annual: {
    pt: { name: "Premium Anual",   badge: "Melhor valor",  msgLimit: "Msgs ilimitadas com IA" },
    en: { name: "Annual Premium",  badge: "Best value",    msgLimit: "Unlimited AI messages" },
    es: { name: "Premium Anual",   badge: "Mejor valor",   msgLimit: "Msgs ilimitadas con IA" },
    fr: { name: "Premium Annuel",  badge: "Meilleur prix", msgLimit: "Messages IA illimités" },
    de: { name: "Jährlich Premium", badge: "Bestes Angebot", msgLimit: "Unbegrenzte KI-Nachrichten" },
  },
};

export default function Checkout() {
  const { t, localePath, locale } = useI18n();
  const [, setLocation] = useLocation();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual"); // anual selecionado por padrão
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => detectCurrencyFromLocale(locale));

  useEffect(() => {
    setSelectedCurrency(detectCurrencyFromLocale(locale));
  }, [locale]);

  const { data: user } = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: () => {
      toast.error(t("checkout.error") || "Erro ao processar. Tente novamente.");
    }
  });

  const handleSubscribe = () => {
    if (!user) {
      setLocation(localePath("/dashboard"));
      return;
    }

    const price = PRICING[selectedCurrency][selectedPlan];
    AnalyticsEvents.planSelected(selectedPlan, price.amount / 100, selectedCurrency);
    AnalyticsEvents.checkoutStarted(selectedPlan, selectedCurrency);

    // Passa planType para o backend distinguir mensal x anual
    checkout.mutate({
  amount: price.amount,
  currency: selectedCurrency.toUpperCase(), // garante BRL, USD, EUR, GBP
  planType: selectedPlan,
} as any);
  };

  const lang = locale || "pt";
  const copy = CHECKOUT_COPY[lang] || CHECKOUT_COPY.pt;
  const features = copy.features;

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
            <ArrowLeft className="size-4" /> {copy.backLabel}
          </Button>

          <div className="text-center mb-12">
            <Heart className="size-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              {copy.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {copy.subtitle}
            </p>
          </div>

          {/* Seletor de Moeda */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Globe className="size-4 text-gray-500" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label[lang] || curr.label.en}
                </option>
              ))}
            </select>
          </div>

          {/* Cards de Planos */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* CARD MENSAL */}
            <Card
              onClick={() => setSelectedPlan("premium")}
              className={`p-6 cursor-pointer transition-all border-2 flex flex-col ${
                selectedPlan === "premium"
                  ? "border-purple-600 shadow-md"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {PLAN_LABELS.premium[lang]?.badge || "Popular"}
                </span>
                {selectedPlan === "premium" && <Check className="size-5 text-purple-600" />}
              </div>
              <h2 className="text-xl font-bold mb-2">
                {PLAN_LABELS.premium[lang]?.name || "Premium Mensal"}
              </h2>
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {PRICING[selectedCurrency].premium.display}
                </span>
                <span className="text-gray-500 text-sm">
                  {PRICING[selectedCurrency].premium.period}
                </span>
              </div>
              <p className="text-sm text-purple-600 font-semibold mb-4">
                {PLAN_LABELS.premium[lang]?.msgLimit}
              </p>
              <ul className="space-y-2 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="size-4 text-green-500 shrink-0" /> {f.trim()}
                  </li>
                ))}
              </ul>
            </Card>

            {/* CARD ANUAL — destaque */}
            <Card
              onClick={() => setSelectedPlan("annual")}
              className={`p-6 cursor-pointer transition-all border-2 flex flex-col relative overflow-hidden ${
                selectedPlan === "annual"
                  ? "border-purple-600 shadow-xl"
                  : "border-purple-200 hover:border-purple-400"
              }`}
            >
              {/* Faixa de desconto */}
              <div className="absolute top-4 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-l-full shadow">
                {PRICING[selectedCurrency].annual.discount}
              </div>

              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="size-3 fill-pink-600" />
                  {PLAN_LABELS.annual[lang]?.badge || "Melhor valor"}
                </span>
                {selectedPlan === "annual" && <Check className="size-5 text-purple-600" />}
              </div>

              <h2 className="text-xl font-bold mb-2">
                {PLAN_LABELS.annual[lang]?.name || "Premium Anual"}
              </h2>

              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {PRICING[selectedCurrency].annual.display}
                </span>
                <span className="text-gray-500 text-sm">
                  {PRICING[selectedCurrency].annual.period}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-1">
                = {PRICING[selectedCurrency].annual.equiv}
              </p>

              <p className="text-sm text-purple-600 font-semibold mb-4 flex items-center gap-1">
                <Zap className="size-3" />
                {PLAN_LABELS.annual[lang]?.msgLimit}
              </p>

              <ul className="space-y-2 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="size-4 text-green-500 shrink-0" /> {f.trim()}
                  </li>
                ))}
                {/* Benefício exclusivo do anual */}
                <li className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                  <Check className="size-4 text-purple-500 shrink-0" />
                  {copy.annualExclusive}
                </li>
              </ul>
            </Card>
          </div>

          {/* CTA */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <Button
              onClick={handleSubscribe}
              disabled={checkout.isPending}
              className="w-full max-w-md h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-transform"
            >
              {checkout.isPending ? (
                <Loader2 className="size-5 animate-spin mr-2" />
              ) : (
                copy.subscribeCta
              )}
            </Button>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-xs">
              <div className="flex items-center gap-1">
                <ShieldCheck className="size-4 text-green-500" />
                {copy.securePayment}
              </div>
              <span className="hidden sm:inline">•</span>
              <div>
                {copy.easyCancellation}
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-xs">{copy.socialProof}</p>
          </div>

        </div>
      </div>
    </>
  );
}
