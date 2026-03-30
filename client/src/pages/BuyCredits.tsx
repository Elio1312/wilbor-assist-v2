import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, Loader2, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";

const LABELS = {
  pt: {
    loginTitle: "Faça login primeiro",
    loginDesc: "Faça login para adicionar mais respostas ao seu plano",
    loginBtn: "Voltar à Home",
    title: "Continue recebendo apoio",
    subtitle: "Continue recebendo respostas no momento que você mais precisa",
    successTitle: "✅ Pagamento Recebido!",
    successDesc: "Suas respostas foram adicionadas. Redirecionando para o dashboard...",
    errorTitle: "❌ Erro ao processar pagamento",
    errorDesc: "Não conseguimos processar sua solicitação. Tente novamente.",
    retryBtn: "Tentar Novamente",
    popular: "⭐ Mais Popular",
    responses: "respostas disponíveis",
    activated: "Ativado imediatamente",
    valid: "Válido por 30 dias a partir da compra",
    noCancel: "Sem cancelamento automático",
    processing: "Processando...",
    buyBtn: "Comprar Agora",
    howTitle: "💡 Como funciona?",
    how1: "Suas respostas extras são ativadas imediatamente após o pagamento",
    how2: "Respostas não usadas passam automaticamente para o próximo mês",
    how3: "Você só paga quando precisar de mais respostas",
    how4: "Suporte prioritário incluído em todos os pacotes",
    backBtn: "← Voltar ao Dashboard",
  },
  en: {
    loginTitle: "Log in first",
    loginDesc: "Log in to add more responses to your plan",
    loginBtn: "Back to Home",
    title: "Keep receiving support",
    subtitle: "Continue receiving answers whenever you need them most",
    successTitle: "✅ Payment Received!",
    successDesc: "Your responses have been added. Redirecting to dashboard...",
    errorTitle: "❌ Payment error",
    errorDesc: "We couldn't process your request. Please try again.",
    retryBtn: "Try Again",
    popular: "⭐ Most Popular",
    responses: "available responses",
    activated: "Activated immediately",
    valid: "Valid for 30 days from purchase",
    noCancel: "No automatic renewal",
    processing: "Processing...",
    buyBtn: "Buy Now",
    howTitle: "💡 How does it work?",
    how1: "Your extra responses are activated immediately after payment",
    how2: "Unused responses automatically carry over to the next month",
    how3: "You only pay when you need more responses",
    how4: "Priority support included in all packages",
    backBtn: "← Back to Dashboard",
  },
  es: {
    loginTitle: "Inicia sesión primero",
    loginDesc: "Inicia sesión para agregar más respuestas a tu plan",
    loginBtn: "Volver al inicio",
    title: "Continúa recibiendo apoyo",
    subtitle: "Continúa recibiendo respuestas cuando más lo necesitas",
    successTitle: "✅ ¡Pago recibido!",
    successDesc: "Tus respuestas han sido agregadas. Redirigiendo al dashboard...",
    errorTitle: "❌ Error al procesar el pago",
    errorDesc: "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
    retryBtn: "Intentar de nuevo",
    popular: "⭐ Más Popular",
    responses: "respuestas disponibles",
    activated: "Activado inmediatamente",
    valid: "Válido por 30 días desde la compra",
    noCancel: "Sin renovación automática",
    processing: "Procesando...",
    buyBtn: "Comprar Ahora",
    howTitle: "💡 ¿Cómo funciona?",
    how1: "Tus respuestas extras se activan inmediatamente después del pago",
    how2: "Las respuestas no usadas pasan automáticamente al mes siguiente",
    how3: "Solo pagas cuando necesitas más respuestas",
    how4: "Soporte prioritario incluido en todos los paquetes",
    backBtn: "← Volver al Dashboard",
  },
  fr: {
    loginTitle: "Connectez-vous d'abord",
    loginDesc: "Connectez-vous pour ajouter plus de réponses à votre plan",
    loginBtn: "Retour à l'accueil",
    title: "Continuez à recevoir du soutien",
    subtitle: "Continuez à recevoir des réponses quand vous en avez le plus besoin",
    successTitle: "✅ Paiement reçu !",
    successDesc: "Vos réponses ont été ajoutées. Redirection vers le tableau de bord...",
    errorTitle: "❌ Erreur de paiement",
    errorDesc: "Nous n'avons pas pu traiter votre demande. Réessayez.",
    retryBtn: "Réessayer",
    popular: "⭐ Le plus populaire",
    responses: "réponses disponibles",
    activated: "Activé immédiatement",
    valid: "Valable 30 jours à partir de l'achat",
    noCancel: "Sans renouvellement automatique",
    processing: "Traitement en cours...",
    buyBtn: "Acheter maintenant",
    howTitle: "💡 Comment ça marche ?",
    how1: "Vos réponses supplémentaires sont activées immédiatement après le paiement",
    how2: "Les réponses non utilisées passent automatiquement au mois suivant",
    how3: "Vous ne payez que lorsque vous avez besoin de plus de réponses",
    how4: "Support prioritaire inclus dans tous les forfaits",
    backBtn: "← Retour au tableau de bord",
  },
  de: {
    loginTitle: "Zuerst anmelden",
    loginDesc: "Melden Sie sich an, um Ihrem Plan mehr Antworten hinzuzufügen",
    loginBtn: "Zurück zur Startseite",
    title: "Erhalten Sie weiterhin Unterstützung",
    subtitle: "Erhalten Sie weiterhin Antworten, wenn Sie sie am meisten brauchen",
    successTitle: "✅ Zahlung erhalten!",
    successDesc: "Ihre Antworten wurden hinzugefügt. Weiterleitung zum Dashboard...",
    errorTitle: "❌ Zahlungsfehler",
    errorDesc: "Wir konnten Ihre Anfrage nicht verarbeiten. Erneut versuchen.",
    retryBtn: "Erneut versuchen",
    popular: "⭐ Am beliebtesten",
    responses: "verfügbare Antworten",
    activated: "Sofort aktiviert",
    valid: "30 Tage ab Kauf gültig",
    noCancel: "Keine automatische Verlängerung",
    processing: "Wird verarbeitet...",
    buyBtn: "Jetzt kaufen",
    howTitle: "💡 Wie funktioniert es?",
    how1: "Ihre zusätzlichen Antworten werden sofort nach der Zahlung aktiviert",
    how2: "Nicht verwendete Antworten werden automatisch auf den nächsten Monat übertragen",
    how3: "Sie zahlen nur, wenn Sie mehr Antworten benötigen",
    how4: "Prioritäts-Support in allen Paketen enthalten",
    backBtn: "← Zurück zum Dashboard",
  },
};

export default function BuyCredits() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { locale } = useI18n();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const creditOptions = trpc.stripe.getCreditOptions.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  const L = LABELS[locale as keyof typeof LABELS] || LABELS.pt;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentStatus("success");
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    }
  }, [setLocation]);

  const handleBuyCredits = async (amountReais: number) => {
    if (!user) return;
    setIsLoading(true);
    setPaymentStatus("processing");
    setSelectedOption(amountReais.toString());
    try {
      const result = await createCheckout.mutateAsync({ amountReais });
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setPaymentStatus("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setPaymentStatus("error");
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="p-8 text-center max-w-md">
          <Heart className="mx-auto mb-4 size-12 text-purple-600" />
          <h2 className="mb-4 text-2xl font-bold">{L.loginTitle}</h2>
          <p className="mb-6 text-gray-600">{L.loginDesc}</p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {L.loginBtn}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{L.title}</h1>
          <p className="text-xl text-gray-600">{L.subtitle}</p>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === "success" && (
          <div className="mb-8 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
            <Check className="mx-auto mb-3 size-12 text-green-600" />
            <h3 className="text-xl font-bold text-green-900 mb-2">{L.successTitle}</h3>
            <p className="text-green-700">{L.successDesc}</p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold text-red-900 mb-2">{L.errorTitle}</h3>
            <p className="text-red-700 mb-4">{L.errorDesc}</p>
            <Button
              onClick={() => setPaymentStatus("idle")}
              className="bg-red-600 hover:bg-red-700"
            >
              {L.retryBtn}
            </Button>
          </div>
        )}

        {/* Credit Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {creditOptions.data?.map((option) => (
            <Card
              key={option.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedOption === option.amountReais.toString()
                  ? "ring-2 ring-purple-600 shadow-lg"
                  : "hover:shadow-lg"
              } ${option.popular ? "md:scale-105" : ""}`}
              onClick={() => setSelectedOption(option.amountReais.toString())}
            >
              {option.popular && (
                <div className="mb-4 inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {L.popular}
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  R$ {option.amountReais.toFixed(2)}
                </h3>
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {option.creditsReceived}
                </p>
                <p className="text-sm text-gray-600">{L.responses}</p>
              </div>
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>{L.activated}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>{L.valid}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>{L.noCancel}</span>
                </div>
              </div>
              <Button
                onClick={() => handleBuyCredits(option.amountReais)}
                disabled={isLoading}
                className={`w-full ${
                  option.popular
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                {isLoading && selectedOption === option.amountReais.toString() ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {L.processing}
                  </>
                ) : (
                  L.buyBtn
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="bg-purple-50 p-6 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">{L.howTitle}</h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>✅ {L.how1}</li>
            <li>✅ {L.how2}</li>
            <li>✅ {L.how3}</li>
            <li>✅ {L.how4}</li>
          </ul>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            {L.backBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}
