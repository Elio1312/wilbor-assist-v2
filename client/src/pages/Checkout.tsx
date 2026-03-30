import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useI18n } from "@/contexts/i18n";
import { Heart, Check, Loader2, Globe, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Currency = "BRL" | "USD" | "EUR";
type Plan = "basic" | "premium";

const PLANS = {
  basic: {
    BRL: { amount: 2990, label: "R$ 29,90/mês" },
    USD: { amount: 990,  label: "$9.90/month" },
    EUR: { amount: 990,  label: "€9,90/mês" },
    features: {
      pt: ["Chat IA 24h", "Até 3 bebês", "Trilha de desenvolvimento", "Receitas por idade"],
      en: ["24/7 AI Chat", "Up to 3 babies", "Development milestones", "Age-based recipes"],
      es: ["Chat IA 24h", "Hasta 3 bebés", "Hitos de desarrollo", "Recetas por edad"],
      fr: ["Chat IA 24h", "Jusqu'à 3 bébés", "Étapes de développement", "Recettes par âge"],
      de: ["KI-Chat 24h", "Bis zu 3 Babys", "Entwicklungsmeilensteine", "Altersgerechte Rezepte"],
    },
  },
  premium: {
    BRL: { amount: 4990, label: "R$ 49,90/mês" },
    USD: { amount: 1490, label: "$14.90/month" },
    EUR: { amount: 1490, label: "€14,90/mês" },
    features: {
      pt: ["Organização completa da rotina do bebê", "Respostas sempre disponíveis", "Sono e alimentação", "Meu Corpo (pós-parto)", "Suporte prioritário"],
      en: ["Everything in Basic", "Unlimited babies", "Sleep & feeding tracker", "My Body (fitness)", "Priority support"],
      es: ["Todo lo del Básico", "Bebés ilimitados", "Seguimiento sueño/alimentación", "Mi Cuerpo (fitness)", "Soporte prioritario"],
      fr: ["Organisation complète de la routine", "Réponses toujours disponibles", "Sommeil et alimentation", "Mon Corps (post-partum)", "Support prioritaire"],
      de: ["Vollständige Routineorganisation", "Antworten immer verfügbar", "Schlaf & Ernährung", "Mein Körper (Nachgeburt)", "Prioritäts-Support"],
    },
  },
};

const CURRENCY_BY_LOCALE: Record<string, Currency> = {
  pt: "BRL",
  en: "USD",
  es: "EUR",
  fr: "EUR",
  de: "EUR",
};

const LABELS = {
  pt: {
    title: "Escolha seu plano",
    subtitle: "Cancele quando quiser. Sem fidelidade.\nTenha respostas sempre que precisar, sem depender de tentativa e erro.",
    basic: "Básico",
    premium: "Premium",
    popular: "Mais popular",
    currency: "Moeda",
    pay: "Assinar agora",
    processing: "Processando...",
    test: "Teste: use cartão 4242 4242 4242 4242",
    back: "Voltar",
    login: "Faça login para assinar",
  },
  en: {
    title: "Choose your plan",
    subtitle: "Cancel anytime. No commitment.",
    basic: "Basic",
    premium: "Premium",
    popular: "Most popular",
    currency: "Currency",
    pay: "Subscribe now",
    processing: "Processing...",
    test: "Test: use card 4242 4242 4242 4242",
    back: "Back",
    login: "Log in to subscribe",
  },
  es: {
    title: "Elige tu plan",
    subtitle: "Cancela cuando quieras. Sin compromiso.",
    basic: "Básico",
    premium: "Premium",
    popular: "Más popular",
    currency: "Moneda",
    pay: "Suscribirse ahora",
    processing: "Procesando...",
    test: "Prueba: usa tarjeta 4242 4242 4242 4242",
    back: "Volver",
    login: "Inicia sesión para suscribirte",
  },
  fr: {
    title: "Choisissez votre plan",
    subtitle: "Annulez quand vous voulez. Sans engagement.\nAyez toujours des réponses quand vous en avez besoin.",
    basic: "Basique",
    premium: "Premium",
    popular: "Le plus populaire",
    currency: "Devise",
    pay: "S'abonner maintenant",
    processing: "Traitement en cours...",
    test: "Test : utilisez la carte 4242 4242 4242 4242",
    back: "Retour",
    login: "Connectez-vous pour vous abonner",
  },
  de: {
    title: "Wählen Sie Ihren Plan",
    subtitle: "Jederzeit kündbar. Keine Bindung.\nErhalten Sie immer Antworten, wenn Sie sie brauchen.",
    basic: "Basis",
    premium: "Premium",
    popular: "Am beliebtesten",
    currency: "Währung",
    pay: "Jetzt abonnieren",
    processing: "Wird verarbeitet...",
    test: "Test: Karte 4242 4242 4242 4242 verwenden",
    back: "Zurück",
    login: "Anmelden zum Abonnieren",
  },
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { locale } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("premium");
  const [currency, setCurrency] = useState<Currency>(CURRENCY_BY_LOCALE[locale] || "BRL");
  const [isLoading, setIsLoading] = useState(false);

  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.pt;

  // Prevent Google from indexing private/auth-required pages
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // Sync currency when locale changes
  useEffect(() => {
    setCurrency(CURRENCY_BY_LOCALE[locale] || "BRL");
  }, [locale]);

  // Handle return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      toast.success(locale === "en" ? "Payment confirmed! Welcome to Wilbor Premium! 💜" :
        locale === "es" ? "¡Pago confirmado! ¡Bienvenida a Wilbor Premium! 💜" :
        locale === "fr" ? "Paiement confirmé ! Bienvenue sur Wilbor Premium ! 💜" :
        locale === "de" ? "Zahlung bestätigt! Willkommen bei Wilbor Premium! 💜" :
        "Pagamento confirmado! Bem-vinda ao Wilbor Premium! 💜");
      setTimeout(() => setLocation("/dashboard"), 2000);
    }
  }, [locale, setLocation]);

  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.success && data.url) {
        toast.info(locale === "en" ? "Redirecting to secure checkout..." :
          locale === "es" ? "Redirigiendo al pago seguro..." :
          locale === "fr" ? "Redirection vers le paiement sécurisé..." :
          locale === "de" ? "Weiterleitung zur sicheren Zahlung..." :
          "Redirecionando para o pagamento seguro...");
        window.open(data.url, "_blank");
      } else {
        toast.error(locale === "en" ? "Error creating checkout. Try again." :
          locale === "es" ? "Error al crear el pago. Inténtalo de nuevo." :
          locale === "fr" ? "Erreur lors du paiement. Réessayez." :
          locale === "de" ? "Fehler beim Erstellen der Zahlung. Erneut versuchen." :
          "Erro ao criar o pagamento. Tente novamente.");
      }
      setIsLoading(false);
    },
    onError: () => {
      toast.error(locale === "en" ? "Connection error. Try again." :
        locale === "es" ? "Error de conexión. Inténtalo de nuevo." :
        locale === "fr" ? "Erreur de connexion. Réessayez." :
        locale === "de" ? "Verbindungsfehler. Erneut versuchen." :
        "Erro de conexão. Tente novamente.");
      setIsLoading(false);
    },
  });

  const handleSubscribe = async () => {
    if (!user) {
      toast.error(labels.login);
      return;
    }
    setIsLoading(true);
    const plan = PLANS[selectedPlan];
    const amountReais = currency === "BRL" ? plan.BRL.amount / 100 : plan.USD.amount / 100;
    createCheckout.mutate({ amountReais });
  };

  const planFeatures = PLANS[selectedPlan].features[locale as keyof typeof PLANS.basic.features] || PLANS[selectedPlan].features.pt;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8F0" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={locale === "pt" ? "/" : `/${locale}`}>
            <button className="flex items-center gap-2 text-purple-700 font-bold text-lg">
              <Heart className="size-5 fill-purple-600 text-purple-600" />
              Wilbor
            </button>
          </Link>
          <Link href={locale === "pt" ? "/" : `/${locale}`}>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="size-4" />
              {labels.back}
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{labels.title}</h1>
          <p className="text-gray-500">{labels.subtitle}</p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Globe className="size-4 text-gray-400" />
          <span className="text-sm text-gray-500">{labels.currency}:</span>
          {(["BRL", "USD", "EUR"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                currency === c
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
              }`}
            >
              {c === "BRL" ? "🇧🇷 BRL" : c === "USD" ? "🇺🇸 USD" : "🇪🇺 EUR"}
            </button>
          ))}
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(["basic", "premium"] as Plan[]).map((plan) => {
            const planData = PLANS[plan];
            const price = planData[currency];
            const features = planData.features[locale as keyof typeof planData.features] || planData.features.pt;
            const isSelected = selectedPlan === plan;
            const isPremium = plan === "premium";

            return (
              <Card
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`relative p-6 cursor-pointer transition-all ${
                  isSelected
                    ? "border-2 border-purple-600 shadow-lg"
                    : "border border-gray-200 hover:border-purple-300"
                }`}
              >
                {isPremium && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {labels.popular}
                  </span>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {plan === "basic" ? labels.basic : labels.premium}
                  </h3>
                  {isSelected && (
                    <div className="size-6 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-purple-700 mb-4">{price.label}</div>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="size-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full max-w-md h-14 text-lg font-bold rounded-2xl"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}
          >
            {isLoading ? (
              <><Loader2 className="size-5 animate-spin mr-2" />{labels.processing}</>
            ) : (
              <>{labels.pay} — {PLANS[selectedPlan][currency].label}</>
            )}
          </Button>
          <p className="mt-3 text-xs text-gray-400">{labels.test}</p>
        </div>
      </div>
    </div>
  );
}
