import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { ParentalConsentModal, useParentalConsent } from "@/components/ParentalConsentModal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getAnonymousSessionId } from "@/lib/anonymousSession";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useI18n } from "@/contexts/i18n";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  Heart,
  LogIn,
  LogOut,
  Moon,
  Shield,
  Sparkles,
  Thermometer,
  TrendingUp,
  UserRound,
  Utensils,
  Waves,
} from "lucide-react";

type DashboardLocale = "pt" | "en" | "es" | "fr" | "de";
type TopicKey = "sleep" | "colic" | "milestones" | "feeding" | "fever" | "mother";

type TopicItem = {
  key: TopicKey;
  title: string;
  subtitle: string;
  prompt: string;
};

type DashboardCopy = {
  guestName: string;
  loading: string;
  login: string;
  logout: string;
  back: string;
  freePlan: string;
  premiumPlan: string;
  activatePremium: string;
  plans: string;
  remaining: string;
  premiumActive: string;
  recipes: string;
  recipesSubtitle: string;
  askAnything: string;
  askAnythingSubtitle: string;
  sos: string;
  sosSubtitle: string;
  emptyState: string;
  placeholder: string;
  quickPrompts: string[];
  topics: TopicItem[];
};

const COPY: Record<DashboardLocale, DashboardCopy> = {
  pt: {
    guestName: "Teste",
    loading: "Carregando...",
    login: "Entrar",
    logout: "Sair",
    back: "Voltar",
    freePlan: "Plano gratuito",
    premiumPlan: "Wilbor Premium",
    activatePremium: "Ativar Premium",
    plans: "Planos",
    remaining: "consultas restantes",
    premiumActive: "Premium ativo",
    recipes: "Receitas",
    recipesSubtitle: "Refeições por idade",
    askAnything: "Tenho uma dúvida...",
    askAnythingSubtitle: "Abrir conversa livre",
    sos: "SOS Bebê chorando",
    sosSubtitle: "Ajuda rápida agora",
    emptyState: "Escreva sua dúvida ou volte para escolher um tema.",
    placeholder: "Digite sua mensagem...",
    quickPrompts: [
      "Meu bebê chora mais no fim da tarde. O que pode ser?",
      "Quero ajuda para entender a rotina de sono de hoje.",
      "Preciso organizar a alimentação do bebê.",
    ],
    topics: [
      {
        key: "sleep",
        title: "Sono",
        subtitle: "Janelas e rotina",
        prompt: "Meu bebê está com dificuldade para dormir. Faça perguntas rápidas e me diga o que ajustar primeiro hoje.",
      },
      {
        key: "colic",
        title: "Cólica",
        subtitle: "Técnicas de alívio",
        prompt: "Meu bebê está com cólica. Faça perguntas rápidas e me diga o que tentar agora e quando devo procurar ajuda.",
      },
      {
        key: "milestones",
        title: "Saltos",
        subtitle: "Desenvolvimento mental",
        prompt: "Quero entender se meu bebê está em salto de desenvolvimento. Faça perguntas e me explique os sinais mais prováveis.",
      },
      {
        key: "feeding",
        title: "Alimentação",
        subtitle: "Mamadas e pega",
        prompt: "Preciso de ajuda com a alimentação do meu bebê. Faça perguntas rápidas e me oriente com clareza.",
      },
      {
        key: "fever",
        title: "Segurança",
        subtitle: "Febre e sinais de alerta",
        prompt: "Meu bebê está com febre ou sinais que me preocupam. Faça perguntas rápidas para avaliar urgência e me diga o que observar agora.",
      },
      {
        key: "mother",
        title: "Mamãe",
        subtitle: "Exercícios e apoio",
        prompt: "Quero orientação prática para meu corpo e minha recuperação no pós-parto. Por onde começo hoje?",
      },
    ],
  },
  en: {
    guestName: "Trial",
    loading: "Loading...",
    login: "Sign in",
    logout: "Log out",
    back: "Back",
    freePlan: "Free plan",
    premiumPlan: "Wilbor Premium",
    activatePremium: "Go Premium",
    plans: "Plans",
    remaining: "consultations left",
    premiumActive: "Premium active",
    recipes: "Recipes",
    recipesSubtitle: "Meals by age",
    askAnything: "I have a question...",
    askAnythingSubtitle: "Open free conversation",
    sos: "SOS Crying baby",
    sosSubtitle: "Fast help now",
    emptyState: "Type your question or go back and choose a topic.",
    placeholder: "Type your message...",
    quickPrompts: [
      "My baby cries more in the late afternoon. What could it be?",
      "I need help understanding today's sleep routine.",
      "I need to organize my baby's feeding.",
    ],
    topics: [
      {
        key: "sleep",
        title: "Sleep",
        subtitle: "Wake windows and routine",
        prompt: "My baby is having trouble sleeping. Ask quick questions and tell me what to adjust first today.",
      },
      {
        key: "colic",
        title: "Colic",
        subtitle: "Relief techniques",
        prompt: "My baby has colic. Ask quick questions and tell me what to try now and when I should seek help.",
      },
      {
        key: "milestones",
        title: "Milestones",
        subtitle: "Mental development",
        prompt: "I want to understand whether my baby is in a developmental leap. Ask questions and explain the most likely signs.",
      },
      {
        key: "feeding",
        title: "Feeding",
        subtitle: "Feeds and latch",
        prompt: "I need help with my baby's feeding. Ask quick questions and guide me clearly.",
      },
      {
        key: "fever",
        title: "Safety",
        subtitle: "Fever and warning signs",
        prompt: "My baby has fever or signs that worry me. Ask quick questions to assess urgency and tell me what to watch right now.",
      },
      {
        key: "mother",
        title: "Mother",
        subtitle: "Exercises and support",
        prompt: "I want practical guidance for my body and postpartum recovery. Where should I start today?",
      },
    ],
  },
  es: {
    guestName: "Prueba",
    loading: "Cargando...",
    login: "Iniciar sesión",
    logout: "Salir",
    back: "Volver",
    freePlan: "Plan gratuito",
    premiumPlan: "Wilbor Premium",
    activatePremium: "Activar Premium",
    plans: "Planes",
    remaining: "consultas restantes",
    premiumActive: "Premium activo",
    recipes: "Recetas",
    recipesSubtitle: "Comidas por edad",
    askAnything: "Tengo una duda...",
    askAnythingSubtitle: "Abrir conversación libre",
    sos: "SOS Bebé llorando",
    sosSubtitle: "Ayuda rápida ahora",
    emptyState: "Escribe tu duda o vuelve para elegir un tema.",
    placeholder: "Escribe tu mensaje...",
    quickPrompts: [
      "Mi bebé llora más al final de la tarde. ¿Qué puede ser?",
      "Quiero entender la rutina de sueño de hoy.",
      "Necesito organizar la alimentación del bebé.",
    ],
    topics: [
      {
        key: "sleep",
        title: "Sueño",
        subtitle: "Ventanas y rutina",
        prompt: "Mi bebé tiene dificultades para dormir. Haz preguntas rápidas y dime qué ajustar primero hoy.",
      },
      {
        key: "colic",
        title: "Cólico",
        subtitle: "Técnicas de alivio",
        prompt: "Mi bebé tiene cólico. Haz preguntas rápidas y dime qué probar ahora y cuándo debo buscar ayuda.",
      },
      {
        key: "milestones",
        title: "Saltos",
        subtitle: "Desarrollo mental",
        prompt: "Quiero entender si mi bebé está en un salto del desarrollo. Haz preguntas y explícame las señales más probables.",
      },
      {
        key: "feeding",
        title: "Alimentación",
        subtitle: "Tomas y agarre",
        prompt: "Necesito ayuda con la alimentación de mi bebé. Haz preguntas rápidas y oriéntame con claridad.",
      },
      {
        key: "fever",
        title: "Seguridad",
        subtitle: "Fiebre y alertas",
        prompt: "Mi bebé tiene fiebre o señales que me preocupan. Haz preguntas rápidas para evaluar la urgencia y dime qué observar ahora.",
      },
      {
        key: "mother",
        title: "Mamá",
        subtitle: "Ejercicios y apoyo",
        prompt: "Quiero orientación práctica para mi cuerpo y mi recuperación posparto. ¿Por dónde empiezo hoy?",
      },
    ],
  },
  fr: {
    guestName: "Essai",
    loading: "Chargement...",
    login: "Se connecter",
    logout: "Se déconnecter",
    back: "Retour",
    freePlan: "Offre gratuite",
    premiumPlan: "Wilbor Premium",
    activatePremium: "Activer Premium",
    plans: "Forfaits",
    remaining: "consultations restantes",
    premiumActive: "Premium actif",
    recipes: "Recettes",
    recipesSubtitle: "Repas par âge",
    askAnything: "J'ai une question...",
    askAnythingSubtitle: "Ouvrir une conversation libre",
    sos: "SOS Bébé qui pleure",
    sosSubtitle: "Aide rapide maintenant",
    emptyState: "Écrivez votre question ou revenez pour choisir un thème.",
    placeholder: "Écrivez votre message...",
    quickPrompts: [
      "Mon bébé pleure davantage en fin de journée. Qu'est-ce que cela peut être ?",
      "Je veux comprendre la routine de sommeil d'aujourd'hui.",
      "J'ai besoin d'organiser l'alimentation du bébé.",
    ],
    topics: [
      {
        key: "sleep",
        title: "Sommeil",
        subtitle: "Fenêtres et routine",
        prompt: "Mon bébé dort mal. Posez des questions rapides et dites-moi quoi ajuster d'abord aujourd'hui.",
      },
      {
        key: "colic",
        title: "Coliques",
        subtitle: "Techniques d'apaisement",
        prompt: "Mon bébé a des coliques. Posez des questions rapides et dites-moi quoi essayer maintenant et quand demander de l'aide.",
      },
      {
        key: "milestones",
        title: "Étapes",
        subtitle: "Développement mental",
        prompt: "Je veux comprendre si mon bébé traverse un saut de développement. Posez des questions et expliquez-moi les signes probables.",
      },
      {
        key: "feeding",
        title: "Alimentation",
        subtitle: "Tétées et prise",
        prompt: "J'ai besoin d'aide pour l'alimentation de mon bébé. Posez des questions rapides et guidez-moi clairement.",
      },
      {
        key: "fever",
        title: "Sécurité",
        subtitle: "Fièvre et alertes",
        prompt: "Mon bébé a de la fièvre ou des signes inquiétants. Posez des questions rapides pour évaluer l'urgence et dites-moi quoi surveiller maintenant.",
      },
      {
        key: "mother",
        title: "Maman",
        subtitle: "Exercices et soutien",
        prompt: "Je veux des conseils pratiques pour mon corps et ma récupération post-partum. Par où commencer aujourd'hui ?",
      },
    ],
  },
  de: {
    guestName: "Test",
    loading: "Wird geladen...",
    login: "Anmelden",
    logout: "Abmelden",
    back: "Zurück",
    freePlan: "Kostenloser Plan",
    premiumPlan: "Wilbor Premium",
    activatePremium: "Premium aktivieren",
    plans: "Tarife",
    remaining: "Beratungen übrig",
    premiumActive: "Premium aktiv",
    recipes: "Rezepte",
    recipesSubtitle: "Mahlzeiten nach Alter",
    askAnything: "Ich habe eine Frage...",
    askAnythingSubtitle: "Freies Gespräch öffnen",
    sos: "SOS Weinendes Baby",
    sosSubtitle: "Schnelle Hilfe עכשיו",
    emptyState: "Schreiben Sie Ihre Frage oder gehen Sie zurück und wählen Sie ein Thema.",
    placeholder: "Schreiben Sie Ihre Nachricht...",
    quickPrompts: [
      "Mein Baby weint am späten Nachmittag mehr. Woran kann das liegen?",
      "Ich möchte den Schlafrhythmus von heute verstehen.",
      "Ich muss die Ernährung meines Babys ordnen.",
    ],
    topics: [
      {
        key: "sleep",
        title: "Schlaf",
        subtitle: "Wachfenster und Routine",
        prompt: "Mein Baby hat Schlafprobleme. Stellen Sie kurze Fragen und sagen Sie mir, was ich heute zuerst anpassen sollte.",
      },
      {
        key: "colic",
        title: "Koliken",
        subtitle: "Beruhigungstechniken",
        prompt: "Mein Baby hat Koliken. Stellen Sie kurze Fragen und sagen Sie mir, was ich jetzt versuchen kann und wann ich Hilfe suchen sollte.",
      },
      {
        key: "milestones",
        title: "Schübe",
        subtitle: "Mentale Entwicklung",
        prompt: "Ich möchte verstehen, ob mein Baby in einem Entwicklungsschub ist. Stellen Sie Fragen und erklären Sie mir die wahrscheinlichsten Anzeichen.",
      },
      {
        key: "feeding",
        title: "Ernährung",
        subtitle: "Stillen und Anlegen",
        prompt: "Ich brauche Hilfe bei der Ernährung meines Babys. Stellen Sie kurze Fragen und leiten Sie mich klar an.",
      },
      {
        key: "fever",
        title: "Sicherheit",
        subtitle: "Fieber und Warnzeichen",
        prompt: "Mein Baby hat Fieber oder Anzeichen, die mir Sorgen machen. Stellen Sie kurze Fragen, um die Dringlichkeit einzuschätzen, und sagen Sie mir, worauf ich jetzt achten soll.",
      },
      {
        key: "mother",
        title: "Mama",
        subtitle: "Übungen und Unterstützung",
        prompt: "Ich möchte praktische Orientierung für meinen Körper und meine Erholung nach der Geburt. Womit sollte ich heute beginnen?",
      },
    ],
  },
};

const TOPIC_STYLES: Record<TopicKey, { card: string; icon: string; iconComponent: any }> = {
  sleep: {
    card: "from-emerald-200/95 to-teal-200/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: Moon,
  },
  colic: {
    card: "from-pink-200/95 to-fuchsia-200/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: Waves,
  },
  milestones: {
    card: "from-sky-100/95 to-cyan-100/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: TrendingUp,
  },
  feeding: {
    card: "from-orange-200/95 to-amber-200/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: Utensils,
  },
  fever: {
    card: "from-blue-100/95 to-slate-100/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: Shield,
  },
  mother: {
    card: "from-violet-200/95 to-purple-200/95 text-slate-900",
    icon: "bg-white/80 text-slate-900",
    iconComponent: UserRound,
  },
};

function toDashboardLocale(locale: string): DashboardLocale {
  return ["pt", "en", "es", "fr", "de"].includes(locale) ? (locale as DashboardLocale) : "pt";
}

function buildBaseSystemPrompt(locale: string): string {
  const prompts: Record<string, string> = {
    pt: "Você é o Wilbor, um assistente neonatal IA especializado em cuidados com recém-nascidos. Responda em português, com base em protocolos SBP, OMS e AAP. Seja empático, prático e sempre priorize a segurança do bebê.",
    en: "You are Wilbor, an AI neonatal assistant specialized in newborn care. Respond in English, based on AAP, WHO and SBP protocols. Be empathetic, practical and always prioritize the baby's safety.",
    es: "Eres Wilbor, un asistente neonatal con IA especializado en el cuidado de recién nacidos. Responde en español, con base en protocolos de la AAP, la OMS y la SBP. Sé empático, práctico y prioriza siempre la seguridad del bebé.",
    fr: "Vous êtes Wilbor, un assistant néonatal IA spécialisé dans les soins aux nouveau-nés. Répondez en français, sur la base des protocoles de l'AAP, de l'OMS et de la SBP. Soyez empathique, pratique et donnez toujours la priorité à la sécurité du bébé.",
    de: "Sie sind Wilbor, ein KI-Neonatalassistent, spezialisiert auf die Betreuung von Neugeborenen. Antworten Sie auf Deutsch, auf Grundlage der Protokolle von AAP, WHO und SBP. Seien Sie empathisch, praktisch und priorisieren Sie stets die Sicherheit des Babys.",
  };

  return prompts[locale] ?? prompts.pt;
}

function extractKnownError(errorMessage: string): string {
  const knownErrors = ["CREDIT_LIMIT_REACHED", "ANONYMOUS_LIMIT_REACHED", "RATE_LIMIT_EXCEEDED", "FINGERPRINT_REQUIRED"];
  return knownErrors.find((code) => errorMessage.includes(code)) || errorMessage;
}

function getGreeting(locale: DashboardLocale): string {
  const hour = new Date().getHours();

  if (locale === "en") {
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  }

  if (locale === "es") {
    if (hour < 12) return "Buenos días,";
    if (hour < 18) return "Buenas tardes,";
    return "Buenas noches,";
  }

  if (locale === "fr") {
    if (hour < 12) return "Bonjour,";
    if (hour < 18) return "Bon après-midi,";
    return "Bonsoir,";
  }

  if (locale === "de") {
    if (hour < 12) return "Guten Morgen,";
    if (hour < 18) return "Guten Tag,";
    return "Guten Abend,";
  }

  if (hour < 12) return "Bom dia,";
  if (hour < 18) return "Boa tarde,";
  return "Boa noite,";
}

function getDisplayName(rawName: string | null | undefined, fallback: string): string {
  if (!rawName) return fallback;
  return rawName.split(" ")[0] || fallback;
}

export default function Dashboard() {
  const { locale, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const { user, logout, loading: authLoading } = useAuth();
  const { showConsent, handleAccept, handleDecline } = useParentalConsent();
  const dashboardLocale = toDashboardLocale(locale);
  const copy = COPY[dashboardLocale];

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTopicKey, setActiveTopicKey] = useState<TopicKey | null>(null);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (user) return;

    const initFingerprint = async () => {
      try {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        console.warn("[Dashboard] FingerprintJS failed, using anonymous session ID:", error);
        setFingerprint(getAnonymousSessionId());
      }
    };

    initFingerprint();
  }, [user]);

  const creditsQuery = trpc.wilbor.getCredits.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const anonCreditsQuery = trpc.wilbor.getAnonymousCredits.useQuery(
    { fingerprint: fingerprint || "" },
    {
      enabled: !user && !!fingerprint,
      refetchOnWindowFocus: false,
    }
  );

  const chatMutation = trpc.wilbor.chat.useMutation();

  const credits = user ? creditsQuery.data : anonCreditsQuery.data;
  const isPremium = !!(user && credits && "plan" in credits && credits.plan !== "free");
  const remaining = credits?.remaining ?? null;
  const monthlyLimit = credits
    ? "limit" in credits
      ? credits.limit
      : "monthlyLimit" in credits
        ? credits.monthlyLimit
        : 5
    : 5;

  const greeting = getGreeting(dashboardLocale);
  const displayName = getDisplayName(user?.name || user?.email, copy.guestName);
  const activeTopic = copy.topics.find((topic) => topic.key === activeTopicKey) || null;
  const currentCount = isPremium ? monthlyLimit : remaining ?? monthlyLimit;
  const usedCount = isPremium ? monthlyLimit : Math.max(0, monthlyLimit - (remaining ?? monthlyLimit));
  const progressWidth = isPremium ? 100 : Math.min(100, (usedCount / Math.max(monthlyLimit, 1)) * 100);
  const isAnonymousReady = !!user || !!fingerprint;
  const recipesRoute = localePath("/recipes");
  const premiumRoute = localePath("/premium");

  const refetchCredits = () => {
    if (user) {
      creditsQuery.refetch();
    } else {
      anonCreditsQuery.refetch();
    }
  };

  const sendChatMessage = async (content: string, baseMessages: Message[] = messages) => {
    if (!user && !fingerprint) {
      setServerError("FINGERPRINT_REQUIRED");
      return;
    }

    if (credits?.isOverLimit) {
      setServerError(user ? "CREDIT_LIMIT_REACHED" : "ANONYMOUS_LIMIT_REACHED");
      return;
    }

    const newMessages: Message[] = [...baseMessages, { role: "user", content }];
    setLastUserQuestion(content);
    setServerError(null);
    setMessages(newMessages);

    try {
      const response = await chatMutation.mutateAsync({
        messages: [
          {
            role: "system" as const,
            content: buildBaseSystemPrompt(dashboardLocale),
          },
          ...newMessages.map((message) => ({
            role: message.role as "system" | "user" | "assistant",
            content: message.content,
          })),
        ],
        fingerprint: user ? undefined : fingerprint || undefined,
      });

      const responseText =
        typeof response === "string"
          ? response
          : (response as any).content || (response as any).message || copy.emptyState;
      const responseImageUrl = (response as any)?.imageUrl ?? null;
      const messageId = (response as any)?.messageId ?? null;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText, imageUrl: responseImageUrl, ...(messageId ? { messageId } : {}) } as any,
      ]);
      setLastAssistantMessage(responseText);
      refetchCredits();
    } catch (error: any) {
      const errorMessage = error?.message || "";
      const foundError = extractKnownError(errorMessage);
      setServerError(foundError);
      setMessages(baseMessages);
    }
  };

  const openTopicChat = async (topic: TopicItem) => {
    setActiveTopicKey(topic.key);
    setIsChatOpen(true);
    setMessages([]);
    setLastUserQuestion(null);
    setLastAssistantMessage(null);
    await sendChatMessage(topic.prompt, []);
  };

  const openFreeChat = () => {
    setActiveTopicKey(null);
    setIsChatOpen(true);
    setMessages([]);
    setLastUserQuestion(null);
    setLastAssistantMessage(null);
    setServerError(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#16244d] text-white">
        {copy.loading}
      </div>
    );
  }

  if (isChatOpen) {
    return (
      <div className="min-h-screen bg-[#16244d] px-3 pb-3 pt-3 text-white sm:px-4 sm:pt-4">
        <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-3xl flex-col rounded-[30px] bg-[#1a2b59] p-3 shadow-2xl shadow-slate-950/25 sm:min-h-[calc(100vh-32px)] sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-white/6 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{activeTopic?.title || "Wilbor"}</p>
                <p className="truncate text-xs text-slate-300">{activeTopic?.subtitle || copy.askAnythingSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                {isPremium ? copy.premiumActive : `${currentCount} ${copy.remaining}`}
              </div>
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/15 hover:text-white"
                >
                  <LogOut className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    window.location.href = getLoginUrl();
                  }}
                  className="hidden rounded-full bg-[#a855f7] px-4 text-white hover:bg-[#9333ea] sm:inline-flex"
                >
                  <LogIn className="mr-2 size-4" />
                  {copy.login}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 rounded-[26px] bg-white p-2 sm:p-3">
            <AIChatBox
              messages={messages}
              onSendMessage={(content) => sendChatMessage(content)}
              isLoading={chatMutation.isPending}
              placeholder={copy.placeholder}
              emptyStateMessage={copy.emptyState}
              suggestedPrompts={messages.length === 0 ? copy.quickPrompts : undefined}
              height="calc(100vh - 140px)"
              className="rounded-[22px] border-0 shadow-none"
              serverError={serverError}
              onErrorCleared={() => setServerError(null)}
            />
          </div>
        </div>

        {user && showConsent ? (
          <ParentalConsentModal open={showConsent} onAccept={handleAccept} onDecline={handleDecline} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16244d] px-3 pb-6 pt-4 text-white sm:px-4 sm:pt-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-start justify-between gap-3 px-1">
          <div>
            <p className="text-sm text-slate-300">{greeting}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{displayName}</h1>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="rounded-full bg-white/10 px-4 text-white hover:bg-white/15"
              >
                <LogIn className="mr-2 size-4" />
                {copy.login}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                aria-label={copy.logout}
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                {isPremium ? copy.premiumPlan : copy.freePlan}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-extrabold leading-none text-white">{currentCount}</span>
                <span className="pb-1 text-sm text-slate-300">{isPremium ? copy.premiumActive : copy.remaining}</span>
              </div>
            </div>

            <Button
              onClick={() => setLocation(premiumRoute)}
              className="rounded-full bg-amber-300 px-4 text-slate-900 hover:bg-amber-200"
            >
              {isPremium ? copy.plans : copy.activatePremium}
            </Button>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 transition-all"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {copy.topics.map((topic) => {
            const styles = TOPIC_STYLES[topic.key];
            const Icon = styles.iconComponent;

            return (
              <button
                key={topic.key}
                type="button"
                onClick={() => openTopicChat(topic)}
                disabled={!isAnonymousReady || chatMutation.isPending}
                className={`flex min-h-[112px] flex-col justify-between rounded-[26px] bg-gradient-to-br p-4 text-left shadow-lg shadow-slate-950/10 transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70 sm:min-h-[118px] ${styles.card}`}
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${styles.icon}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-tight">{topic.title}</p>
                  <p className="mt-1 text-sm text-slate-700/80">{topic.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => openTopicChat(copy.topics.find((topic) => topic.key === "fever") || copy.topics[0])}
          disabled={!isAnonymousReady || chatMutation.isPending}
          className="mt-3 flex h-14 w-full items-center justify-center gap-3 rounded-[22px] bg-gradient-to-r from-amber-400 to-orange-400 px-4 text-base font-bold text-slate-900 shadow-lg shadow-slate-950/10 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
        >
          <Sparkles className="size-4" />
          {copy.sos}
        </button>

        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={() => setLocation(recipesRoute)}
            className="flex h-14 w-full items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 text-left shadow-lg shadow-slate-950/10 transition hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/15 text-amber-300">
                <BookOpen className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{copy.recipes}</p>
                <p className="text-xs text-slate-300">{copy.recipesSubtitle}</p>
              </div>
            </div>
            <span className="text-sm text-slate-300">›</span>
          </button>

          <button
            type="button"
            onClick={openFreeChat}
            className="flex h-14 w-full items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 text-left shadow-lg shadow-slate-950/10 transition hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-200">
                <Heart className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{copy.askAnything}</p>
                <p className="text-xs text-slate-300">{copy.askAnythingSubtitle}</p>
              </div>
            </div>
            <span className="text-sm text-slate-300">›</span>
          </button>
        </div>
      </div>

      {user && showConsent ? (
        <ParentalConsentModal open={showConsent} onAccept={handleAccept} onDecline={handleDecline} />
      ) : null}
    </div>
  );
}
