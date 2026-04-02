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

const PAYWALL_TEXTS: Record<string, {
  title: string;
  subtitle: string;
  used: string;
  limit: string;
  upgrade_title: string;
  upgrade_desc: string;
  features: string[];
  cta: string;
  price: string;
  period: string;
  later: string;
  login_title: string;
  login_subtitle: string;
  login_cta: string;
}> = {
  pt: {
    title: "Você usou suas 5 consultas gratuitas 🎉",
    subtitle: "Você já recebeu orientação confiável do Wilbor. Para continuar com apoio ilimitado:",
    used: "5 de 5 consultas usadas",
    limit: "Limite do plano gratuito atingido",
    upgrade_title: "Continue com o Wilbor Premium",
    upgrade_desc: "Chat ilimitado · Trilha de desenvolvimento · Receitas · Meu Corpo",
    features: [
      "Chat IA ilimitado 24h",
      "Perfil personalizado do bebê",
      "Trilha de desenvolvimento semana a semana",
      "55 receitas por faixa etária",
      "Alertas de vacinas",
      "Seção Meu Corpo (pós-parto)",
    ],
    cta: "Assinar por R$ 29,00/mês",
    price: "R$ 29,00",
    period: "/mês",
    later: "Agora não",
    login_title: "Ganhe mais 5 consultas grátis! 🎁",
    login_subtitle: "Faça login com sua conta Google para ganhar mais 5 consultas gratuitas e salvar seu histórico.",
    login_cta: "Entrar com Google",
  },
  en: {
    title: "You've used your 5 free consultations 🎉",
    subtitle: "You've already received reliable guidance from Wilbor. To continue with unlimited support:",
    used: "5 of 5 consultations used",
    limit: "Free plan limit reached",
    upgrade_title: "Continue with Wilbor Premium",
    upgrade_desc: "Unlimited chat · Development milestones · Recipes · My Body",
    features: [
      "Unlimited 24h AI chat",
      "Personalized baby profile",
      "Week-by-week development milestones",
      "55 age-based recipes",
      "Vaccine alerts",
      "My Body section (postpartum)",
    ],
    cta: "Subscribe for $9.90/month",
    price: "$9.90",
    period: "/month",
    later: "Not now",
    login_title: "Get 5 more free consultations! 🎁",
    login_subtitle: "Sign in with your Google account to get 5 more free consultations and save your history.",
    login_cta: "Sign In with Google",
  },
  es: {
    title: "Has usado tus 5 consultas gratuitas 🎉",
    subtitle: "Ya recibiste orientación confiable de Wilbor. Para continuar con apoyo ilimitado:",
    used: "5 de 5 consultas usadas",
    limit: "Límite del plan gratuito alcanzado",
    upgrade_title: "Continúa con Wilbor Premium",
    upgrade_desc: "Chat ilimitado · Hitos de desarrollo · Recetas · Mi Cuerpo",
    features: [
      "Chat IA ilimitado 24h",
      "Perfil personalizado del bebé",
      "Hitos de desarrollo semana a semana",
      "55 recetas por edad",
      "Alertas de vacunas",
      "Sección Mi Cuerpo (posparto)",
    ],
    cta: "Suscribirse por €9,90/mes",
    price: "€9,90",
    period: "/mes",
    later: "Ahora no",
    login_title: "¡Obtén 5 consultas gratis más! 🎁",
    login_subtitle: "Inicia sesión con tu cuenta de Google para obtener 5 consultas gratuitas más y guardar tu historial.",
    login_cta: "Entrar con Google",
  },
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
    onClose();
  };

  const isAnonymous = !user;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 px-6 pt-8 pb-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isAnonymous ? <Sparkles className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold leading-tight">
              {isAnonymous ? texts.login_title : texts.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-purple-100 text-sm mt-2 leading-relaxed">
            {isAnonymous ? texts.login_subtitle : texts.subtitle}
          </p>

          {/* Usage bar */}
          <div className="mt-4 bg-white/10 rounded-full p-1">
            <div className="bg-white/30 rounded-full h-2 w-full">
              <div className="bg-white rounded-full h-2 w-full transition-all" />
            </div>
          </div>
          <p className="text-purple-200 text-xs mt-2">{texts.used}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 bg-white">
          {isAnonymous ? (
            <div className="space-y-4">
              <a
                href={getLoginUrl()}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl text-base shadow-lg transition-all"
              >
                <LogIn className="w-5 h-5" />
                {texts.login_cta}
              </a>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Ou faça upgrade agora</span></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900 text-base">{texts.upgrade_title}</h3>
            </div>
          )}

          <ul className="space-y-2 mb-5">
            {texts.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="bg-purple-50 rounded-xl p-4 mb-4 text-center border border-purple-100">
            <span className="text-3xl font-bold text-purple-700">{texts.price}</span>
            <span className="text-gray-500 text-sm">{texts.period}</span>
            <p className="text-xs text-gray-500 mt-1">Cancele quando quiser · Sem fidelidade</p>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl text-base shadow-lg"
          >
            {texts.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <button
            onClick={handleClose}
            className="w-full text-center text-gray-400 text-sm mt-3 hover:text-gray-600 transition-colors py-1"
          >
            {texts.later}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
