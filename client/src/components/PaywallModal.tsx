import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n";
import { Lock, Sparkles, Check, ArrowRight, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

// 1. Expansão para os 5 idiomas (Padrão 95% de assertividade)
const PAYWALL_TEXTS: Record<string, any> = {
  pt: {
    title: "Você usou suas 5 consultas gratuitas 🎉",
    subtitle: "Você já recebeu orientação confiável do Wilbor. Para continuar com apoio ilimitado:",
    features: ["Chat IA ilimitado 24h", "Perfil personalizado do bebê", "Trilha de desenvolvimento", "55 receitas por idade"],
    cta: "Assinar por R$ 29,00/mês",
    price: "R$ 29,00",
    period: "/mês",
    login_title: "Ganhe mais 5 consultas grátis! 🎁",
    login_subtitle: "Faça login com sua conta Google para ganhar mais 5 consultas gratuitas e salvar seu histórico.",
    login_cta: "Entrar com Google",
    later: "Agora não"
  },
  en: {
    title: "You've used your 5 free consultations 🎉",
    subtitle: "You've already received reliable guidance from Wilbor. To continue with unlimited support:",
    features: ["Unlimited 24h AI chat", "Personalized baby profile", "Development milestones", "55 age-based recipes"],
    cta: "Subscribe for $9.90/month",
    price: "$9.90",
    period: "/month",
    login_title: "Get 5 more free consultations! 🎁",
    login_subtitle: "Sign in with your Google account to get 5 more free consultations and save your history.",
    login_cta: "Sign In with Google",
    later: "Not now"
  },
  es: {
    title: "Has usado tus 5 consultas gratuitas 🎉",
    subtitle: "Ya recibiste orientación confiable de Wilbor. Para continuar con apoyo ilimitado:",
    features: ["Chat IA ilimitado 24h", "Perfil personalizado del bebé", "Hitos de desarrollo", "55 recetas por edad"],
    cta: "Suscribirse por €9,90/mes",
    price: "€9,90",
    period: "/mes",
    login_title: "¡Obtén 5 consultas gratis más! 🎁",
    login_subtitle: "Inicia sesión con tu cuenta de Google para obtener 5 consultas gratuitas más y guardar tu historial.",
    login_cta: "Entrar con Google",
    later: "Ahora no"
  },
  fr: {
    title: "Vous avez utilisé vos 5 consultations gratuites 🎉",
    subtitle: "Wilbor vous a aidé. Pour continuer avec un soutien illimité:",
    features: ["Chat IA illimité 24h/7", "Profil bébé personnalisé", "Suivi du développement", "Recettes par âge"],
    cta: "S'abonner pour 9,90€/mois",
    price: "9,90€",
    period: "/mois",
    login_title: "Obtenez 5 consultations gratuites de plus ! 🎁",
    login_subtitle: "Connectez-vous avec Google pour obtenir 5 consultations gratuites supplémentaires.",
    login_cta: "Se connecter avec Google",
    later: "Pas maintenant"
  },
  de: {
    title: "Sie haben Ihre 5 kostenlosen Beratungen genutzt 🎉",
    subtitle: "Wilbor hat Ihnen geholfen. Für unbegrenzte Unterstützung:",
    features: ["Unbegrenzter KI-Chat 24/7", "Personalisiertes Babyprofil", "Entwicklungsmeilensteine", "Rezepte nach Alter"],
    cta: "Abonnieren für 9,90€/Monat",
    price: "9,90€",
    period: "/Monat",
    login_title: "Holen Sie sich 5 weitere kostenlose Beratungen! 🎁",
    login_subtitle: "Melden Sie sich mit Google an, um 5 weitere kostenlose Beratungen zu erhalten.",
    login_cta: "Mit Google anmelden",
    later: "Jetzt nicht"
  }
};

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  const { locale, localePath } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const trackEvent = trpc.wilbor.trackEvent.useMutation();

  const texts = PAYWALL_TEXTS[locale] ?? PAYWALL_TEXTS.pt;

  const handleUpgrade = () => {
    trackEvent.mutate({ eventType: "upgrade_clicked" });
    onClose();
    navigate(localePath("/checkout"));
  };

  const handleClose = () => {
    // 2. Registro de Hesitação para Remarketing (ROI)
    trackEvent.mutate({ eventType: "paywall_shown" });
    onClose();
  };

  const isAnonymous = !user;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
        {/* Header com Gradiente Wilbor */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-6 pt-8 pb-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isAnonymous ? <Sparkles className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              {isAnonymous ? texts.login_title : texts.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-purple-100 text-sm mt-2">{isAnonymous ? texts.login_subtitle : texts.subtitle}</p>
        </div>

        {/* Lista de Benefícios e CTA */}
        <div className="px-6 py-5">
          <ul className="space-y-2 mb-5">
            {texts.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="bg-purple-50 rounded-xl p-4 mb-4 text-center border border-purple-100">
            <span className="text-3xl font-bold text-purple-700">{texts.price}</span>
            <span className="text-gray-500 text-sm">{texts.period}</span>
          </div>

          {isAnonymous ? (
            <a
              href={getLoginUrl()}
              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl text-lg shadow-lg transition-all"
            >
              <LogIn className="w-5 h-5" />
              {texts.login_cta}
            </a>
          ) : (
            <Button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl text-lg shadow-lg">
              {texts.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          <button onClick={handleClose} className="w-full text-center text-gray-400 text-sm mt-4 hover:text-gray-600 py-1">
            {texts.later}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
