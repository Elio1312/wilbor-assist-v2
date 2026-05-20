import { useEffect, useMemo, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { FeedbackButton } from "@/components/FeedbackButton";
import { SOSButton } from "@/components/SOSButton";
import { SleepTracker } from "@/components/SleepTracker";
import { ParentalConsentModal, useParentalConsent } from "@/components/ParentalConsentModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getAnonymousSessionId } from "@/lib/anonymousSession";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useI18n } from "@/contexts/i18n";
import { useLocation } from "wouter";
import {
  Heart,
  LogOut,
  LogIn,
  Wind,
  Moon,
  Utensils,
  TrendingUp,
  Thermometer,
  Sparkles,
  ArrowRight,
  BarChart3,
  BookOpen,
  User,
  ShieldCheck,
} from "lucide-react";

type DashboardLocale = "pt" | "en" | "es" | "fr" | "de";

type DashboardCopy = {
  badge: string;
  title: string;
  subtitle: string;
  chooseTitle: string;
  chooseSubtitle: string;
  noCard: string;
  usageTitle: string;
  freeTrialNote: string;
  saveHistory: string;
  seePlans: string;
  continueWithLogin: string;
  logoutLabel: string;
  emptyState: string;
  quickPrompts: string[];
  topicButton: string;
  resourcesTitle: string;
  blogLabel: string;
  recipesLabel: string;
  bodyLabel: string;
  milestonesLabel: string;
  topicCards: Array<{
    key: string;
    title: string;
    description: string;
    prompt: string;
    routeKey?: "recipes" | "body" | "milestones" | "blog";
    routeLabel?: string;
  }>;
};

const DASHBOARD_COPY: Record<DashboardLocale, DashboardCopy> = {
  pt: {
    badge: "Teste grátis no dashboard real",
    title: "Comece pelo coração do Wilbor e use suas 5 consultas grátis do jeito certo.",
    subtitle:
      "A mãe entra, escolhe o tema principal e navega pelo produto real. Sem cartão no teste grátis. O upgrade aparece só depois do uso.",
    chooseTitle: "Escolha por onde começar",
    chooseSubtitle:
      "Cada botão já abre uma orientação prática dentro do Wilbor. Você pode começar por cólica, sono, alimentação, febre, saltos ou apoio para a mãe.",
    noCard: "Sem cartão no teste grátis",
    usageTitle: "Seu acesso agora",
    freeTrialNote: "Você começa com 5 consultas gratuitas e decide quando faz sentido assinar.",
    saveHistory: "Faça login depois para salvar histórico, continuar no celular e manter a experiência organizada.",
    seePlans: "Ver planos",
    continueWithLogin: "Fazer login",
    logoutLabel: "Sair",
    emptyState: "Escolha um cartão acima ou escreva o que está acontecendo com seu bebê agora.",
    quickPrompts: [
      "Meu bebê está com cólica. O que posso fazer agora?",
      "Meu bebê não dorme bem. Por onde começo?",
      "Como organizar a alimentação do bebê hoje?",
      "Estou em dúvida se essa febre exige urgência.",
    ],
    topicButton: "Usar consulta agora",
    resourcesTitle: "Outros recursos do Wilbor",
    blogLabel: "Blog",
    recipesLabel: "Receitas",
    bodyLabel: "Meu corpo",
    milestonesLabel: "Desenvolvimento",
    topicCards: [
      {
        key: "colic",
        title: "Cólica",
        description: "Abra uma orientação rápida para crise, gases, massagens e sinais de alerta.",
        prompt: "Meu bebê está com cólica. Faça perguntas rápidas e me diga o que tentar agora e quando devo procurar ajuda.",
      },
      {
        key: "sleep",
        title: "Sono",
        description: "Entenda despertares, janelas de sono, rotina e o próximo ajuste mais provável.",
        prompt: "Meu bebê está com dificuldade para dormir. Faça perguntas rápidas e me oriente pelo próximo passo mais provável.",
        routeKey: "milestones",
        routeLabel: "Ver desenvolvimento",
      },
      {
        key: "feeding",
        title: "Alimentação",
        description: "Comece pelo tema de mamadas, introdução alimentar, dúvidas de rotina e sinais de recusa.",
        prompt: "Preciso de ajuda com a alimentação do meu bebê. Faça perguntas rápidas e me oriente com clareza.",
        routeKey: "recipes",
        routeLabel: "Abrir receitas",
      },
      {
        key: "fever",
        title: "Febre",
        description: "Organize temperatura, idade, sinais de alerta e o que observar antes de correr para a emergência.",
        prompt: "Meu bebê está com febre. Faça perguntas rápidas para avaliar urgência e me diga o que observar agora.",
      },
      {
        key: "milestones",
        title: "Saltos e desenvolvimento",
        description: "Veja se o comportamento combina com fase de desenvolvimento, irritação, regressão ou salto.",
        prompt: "Quero entender se meu bebê está em salto de desenvolvimento. Faça perguntas e me explique os sinais mais prováveis.",
        routeKey: "milestones",
        routeLabel: "Abrir trilha",
      },
      {
        key: "mother",
        title: "Exercícios e apoio para a mãe",
        description: "Use o Wilbor também para recuperação, autocuidado e orientação prática no pós-parto.",
        prompt: "Quero orientação prática para meu corpo e minha recuperação no pós-parto. Por onde começo hoje?",
        routeKey: "body",
        routeLabel: "Abrir Meu Corpo",
      },
    ],
  },
  en: {
    badge: "Free trial in the real dashboard",
    title: "Start from the heart of Wilbor and use your 5 free consultations the right way.",
    subtitle:
      "Mothers should enter the real product, choose the main topic and navigate from there. No card required for the free trial. Upgrade only comes after usage.",
    chooseTitle: "Choose where to start",
    chooseSubtitle:
      "Each button opens practical guidance inside Wilbor. You can start with colic, sleep, feeding, fever, milestones or support for the mother.",
    noCard: "No card required for the free trial",
    usageTitle: "Your access now",
    freeTrialNote: "You start with 5 free consultations and upgrade only when it makes sense.",
    saveHistory: "Sign in later to save history, continue on mobile and keep everything organized.",
    seePlans: "See plans",
    continueWithLogin: "Sign in",
    logoutLabel: "Log out",
    emptyState: "Choose a card above or type what is happening with your baby right now.",
    quickPrompts: [
      "My baby has colic. What can I do now?",
      "My baby is not sleeping well. Where should I start?",
      "How should I organize feeding today?",
      "I am unsure whether this fever is urgent.",
    ],
    topicButton: "Use consultation now",
    resourcesTitle: "Other Wilbor resources",
    blogLabel: "Blog",
    recipesLabel: "Recipes",
    bodyLabel: "My body",
    milestonesLabel: "Development",
    topicCards: [
      {
        key: "colic",
        title: "Colic",
        description: "Open quick guidance for gas, massage, soothing positions and warning signs.",
        prompt: "My baby has colic. Ask quick questions and tell me what to try now and when I should seek help.",
      },
      {
        key: "sleep",
        title: "Sleep",
        description: "Understand wake-ups, wake windows, routine and the most likely next adjustment.",
        prompt: "My baby is having trouble sleeping. Ask quick questions and guide me to the most likely next step.",
        routeKey: "milestones",
        routeLabel: "See development",
      },
      {
        key: "feeding",
        title: "Feeding",
        description: "Start with bottles, breastfeeding, solids, routine doubts and refusal signs.",
        prompt: "I need help with my baby's feeding. Ask quick questions and guide me clearly.",
        routeKey: "recipes",
        routeLabel: "Open recipes",
      },
      {
        key: "fever",
        title: "Fever",
        description: "Organize temperature, age, warning signs and what to monitor before rushing out.",
        prompt: "My baby has a fever. Ask quick questions to assess urgency and tell me what to watch right now.",
      },
      {
        key: "milestones",
        title: "Milestones",
        description: "Check whether behavior matches a leap, irritability, regression or a new phase.",
        prompt: "I want to understand whether my baby is in a developmental leap. Ask questions and explain the most likely signs.",
        routeKey: "milestones",
        routeLabel: "Open tracker",
      },
      {
        key: "mother",
        title: "Mother support",
        description: "Use Wilbor for postpartum recovery, self-care and practical guidance for the mother too.",
        prompt: "I want practical guidance for my body and postpartum recovery. Where should I start today?",
        routeKey: "body",
        routeLabel: "Open My Body",
      },
    ],
  },
  es: {
    badge: "Prueba gratis en el dashboard real",
    title: "Empieza por el corazón de Wilbor y usa tus 5 consultas gratis de la manera correcta.",
    subtitle:
      "La madre debe entrar en el producto real, elegir el tema principal y navegar desde allí. Sin tarjeta en la prueba gratis. El upgrade aparece después del uso.",
    chooseTitle: "Elige por dónde empezar",
    chooseSubtitle:
      "Cada botón abre orientación práctica dentro de Wilbor. Puedes empezar por cólico, sueño, alimentación, fiebre, saltos o apoyo para la madre.",
    noCard: "Sin tarjeta en la prueba gratis",
    usageTitle: "Tu acceso ahora",
    freeTrialNote: "Empiezas con 5 consultas gratuitas y decides luego si quieres suscribirte.",
    saveHistory: "Inicia sesión después para guardar historial, seguir en el móvil y mantener todo organizado.",
    seePlans: "Ver planes",
    continueWithLogin: "Iniciar sesión",
    logoutLabel: "Salir",
    emptyState: "Elige una tarjeta arriba o escribe qué está pasando con tu bebé ahora.",
    quickPrompts: [
      "Mi bebé tiene cólico. ¿Qué puedo hacer ahora?",
      "Mi bebé no duerme bien. ¿Por dónde empiezo?",
      "¿Cómo organizo la alimentación hoy?",
      "No sé si esta fiebre es urgente.",
    ],
    topicButton: "Usar consulta ahora",
    resourcesTitle: "Otros recursos de Wilbor",
    blogLabel: "Blog",
    recipesLabel: "Recetas",
    bodyLabel: "Mi cuerpo",
    milestonesLabel: "Desarrollo",
    topicCards: [
      {
        key: "colic",
        title: "Cólico",
        description: "Abre orientación rápida para gases, masajes, posiciones y señales de alerta.",
        prompt: "Mi bebé tiene cólico. Haz preguntas rápidas y dime qué probar ahora y cuándo debo buscar ayuda.",
      },
      {
        key: "sleep",
        title: "Sueño",
        description: "Entiende despertares, ventanas de sueño, rutina y el siguiente ajuste más probable.",
        prompt: "Mi bebé tiene dificultades para dormir. Haz preguntas rápidas y oriéntame hacia el siguiente paso más probable.",
        routeKey: "milestones",
        routeLabel: "Ver desarrollo",
      },
      {
        key: "feeding",
        title: "Alimentación",
        description: "Empieza por tomas, lactancia, sólidos, dudas de rutina y rechazo.",
        prompt: "Necesito ayuda con la alimentación de mi bebé. Haz preguntas rápidas y oriéntame con claridad.",
        routeKey: "recipes",
        routeLabel: "Abrir recetas",
      },
      {
        key: "fever",
        title: "Fiebre",
        description: "Ordena temperatura, edad, señales de alerta y lo que debes observar ahora.",
        prompt: "Mi bebé tiene fiebre. Haz preguntas rápidas para evaluar la urgencia y dime qué observar ahora.",
      },
      {
        key: "milestones",
        title: "Saltos y desarrollo",
        description: "Comprueba si el comportamiento coincide con un salto o una nueva fase.",
        prompt: "Quiero entender si mi bebé está en un salto del desarrollo. Haz preguntas y explícame las señales más probables.",
        routeKey: "milestones",
        routeLabel: "Abrir seguimiento",
      },
      {
        key: "mother",
        title: "Apoyo para la madre",
        description: "Usa Wilbor también para recuperación posparto, autocuidado y orientación práctica.",
        prompt: "Quiero orientación práctica para mi cuerpo y mi recuperación posparto. ¿Por dónde empiezo hoy?",
        routeKey: "body",
        routeLabel: "Abrir Mi Cuerpo",
      },
    ],
  },
  fr: {
    badge: "Essai gratuit dans le vrai tableau de bord",
    title: "Commencez par le cœur de Wilbor et utilisez vos 5 consultations gratuites comme il faut.",
    subtitle:
      "La mère doit entrer dans le vrai produit, choisir le sujet principal et naviguer à partir de là. Aucune carte bancaire pour l'essai gratuit. L'offre payante vient après l'usage.",
    chooseTitle: "Choisissez par où commencer",
    chooseSubtitle:
      "Chaque bouton ouvre une orientation pratique dans Wilbor. Vous pouvez commencer par les coliques, le sommeil, l'alimentation, la fièvre, les étapes de développement ou le soutien maternel.",
    noCard: "Aucune carte bancaire pour l'essai gratuit",
    usageTitle: "Votre accès maintenant",
    freeTrialNote: "Vous commencez avec 5 consultations gratuites et vous choisissez ensuite si l'abonnement a du sens.",
    saveHistory: "Connectez-vous ensuite pour sauvegarder l'historique, continuer sur mobile et garder tout organisé.",
    seePlans: "Voir les forfaits",
    continueWithLogin: "Se connecter",
    logoutLabel: "Se déconnecter",
    emptyState: "Choisissez une carte ci-dessus ou décrivez ce qui se passe avec votre bébé maintenant.",
    quickPrompts: [
      "Mon bébé a des coliques. Que puis-je faire maintenant ?",
      "Mon bébé dort mal. Par où commencer ?",
      "Comment organiser l'alimentation aujourd'hui ?",
      "Je ne sais pas si cette fièvre est urgente.",
    ],
    topicButton: "Utiliser la consultation",
    resourcesTitle: "Autres ressources Wilbor",
    blogLabel: "Blog",
    recipesLabel: "Recettes",
    bodyLabel: "Mon corps",
    milestonesLabel: "Développement",
    topicCards: [
      {
        key: "colic",
        title: "Coliques",
        description: "Ouvrez une aide rapide pour les gaz, massages, positions utiles et signes d'alerte.",
        prompt: "Mon bébé a des coliques. Posez des questions rapides et dites-moi quoi essayer maintenant et quand demander de l'aide.",
      },
      {
        key: "sleep",
        title: "Sommeil",
        description: "Comprenez les réveils, les fenêtres d'éveil, la routine et le prochain ajustement probable.",
        prompt: "Mon bébé dort mal. Posez des questions rapides et guidez-moi vers la prochaine étape la plus probable.",
        routeKey: "milestones",
        routeLabel: "Voir le développement",
      },
      {
        key: "feeding",
        title: "Alimentation",
        description: "Commencez par les tétées, les solides, la routine et les signes de refus.",
        prompt: "J'ai besoin d'aide pour l'alimentation de mon bébé. Posez des questions rapides et guidez-moi clairement.",
        routeKey: "recipes",
        routeLabel: "Ouvrir les recettes",
      },
      {
        key: "fever",
        title: "Fièvre",
        description: "Organisez la température, l'âge, les signes d'alerte et ce qu'il faut surveiller.",
        prompt: "Mon bébé a de la fièvre. Posez des questions rapides pour évaluer l'urgence et dites-moi quoi surveiller maintenant.",
      },
      {
        key: "milestones",
        title: "Étapes et développement",
        description: "Vérifiez si le comportement correspond à un saut ou à une nouvelle phase.",
        prompt: "Je veux comprendre si mon bébé traverse une étape de développement. Posez des questions et expliquez-moi les signes probables.",
        routeKey: "milestones",
        routeLabel: "Ouvrir le suivi",
      },
      {
        key: "mother",
        title: "Soutien pour la mère",
        description: "Utilisez Wilbor aussi pour la récupération post-partum, l'autosoins et le soutien pratique.",
        prompt: "Je veux des conseils pratiques pour mon corps et ma récupération post-partum. Par où commencer aujourd'hui ?",
        routeKey: "body",
        routeLabel: "Ouvrir Mon corps",
      },
    ],
  },
  de: {
    badge: "Kostenlos testen im echten Dashboard",
    title: "Starten Sie im Herzen von Wilbor und nutzen Sie Ihre 5 kostenlosen Beratungen auf die richtige Weise.",
    subtitle:
      "Die Mutter sollte direkt ins echte Produkt gelangen, das Hauptthema wählen und von dort navigieren. Keine Karte für den Gratis-Test. Das Upgrade kommt erst nach der Nutzung.",
    chooseTitle: "Womit möchten Sie beginnen?",
    chooseSubtitle:
      "Jede Schaltfläche öffnet eine praktische Orientierung in Wilbor. Sie können mit Koliken, Schlaf, Ernährung, Fieber, Entwicklung oder Unterstützung für die Mutter beginnen.",
    noCard: "Keine Karte für den Gratis-Test",
    usageTitle: "Ihr Zugriff jetzt",
    freeTrialNote: "Sie starten mit 5 kostenlosen Beratungen und entscheiden später, ob sich ein Abo lohnt.",
    saveHistory: "Melden Sie sich später an, um den Verlauf zu speichern und mobil weiterzumachen.",
    seePlans: "Tarife ansehen",
    continueWithLogin: "Anmelden",
    logoutLabel: "Abmelden",
    emptyState: "Wählen Sie oben eine Karte oder beschreiben Sie, was mit Ihrem Baby gerade passiert.",
    quickPrompts: [
      "Mein Baby hat Koliken. Was kann ich jetzt tun?",
      "Mein Baby schläft schlecht. Wo fange ich an?",
      "Wie organisiere ich die Ernährung heute?",
      "Ich weiß nicht, ob dieses Fieber dringend ist.",
    ],
    topicButton: "Beratung jetzt nutzen",
    resourcesTitle: "Weitere Wilbor-Ressourcen",
    blogLabel: "Blog",
    recipesLabel: "Rezepte",
    bodyLabel: "Mein Körper",
    milestonesLabel: "Entwicklung",
    topicCards: [
      {
        key: "colic",
        title: "Koliken",
        description: "Öffnen Sie schnelle Hilfe zu Gasen, Massage, Positionen und Warnzeichen.",
        prompt: "Mein Baby hat Koliken. Stellen Sie kurze Fragen und sagen Sie mir, was ich jetzt versuchen kann und wann ich Hilfe suchen sollte.",
      },
      {
        key: "sleep",
        title: "Schlaf",
        description: "Verstehen Sie Aufwachen, Wachfenster, Routine und den wahrscheinlichsten nächsten Schritt.",
        prompt: "Mein Baby hat Schlafprobleme. Stellen Sie kurze Fragen und leiten Sie mich zum wahrscheinlichsten nächsten Schritt.",
        routeKey: "milestones",
        routeLabel: "Entwicklung ansehen",
      },
      {
        key: "feeding",
        title: "Ernährung",
        description: "Starten Sie mit Stillen, Fläschchen, Beikost, Routinen und Verweigerung.",
        prompt: "Ich brauche Hilfe bei der Ernährung meines Babys. Stellen Sie kurze Fragen und leiten Sie mich klar an.",
        routeKey: "recipes",
        routeLabel: "Rezepte öffnen",
      },
      {
        key: "fever",
        title: "Fieber",
        description: "Ordnen Sie Temperatur, Alter, Warnzeichen und das, was Sie jetzt beobachten sollten.",
        prompt: "Mein Baby hat Fieber. Stellen Sie kurze Fragen, um die Dringlichkeit einzuschätzen, und sagen Sie mir, worauf ich jetzt achten soll.",
      },
      {
        key: "milestones",
        title: "Entwicklung",
        description: "Prüfen Sie, ob das Verhalten zu einem Entwicklungsschub oder einer neuen Phase passt.",
        prompt: "Ich möchte verstehen, ob mein Baby in einem Entwicklungsschub ist. Stellen Sie Fragen und erklären Sie mir die wahrscheinlichsten Anzeichen.",
        routeKey: "milestones",
        routeLabel: "Tracker öffnen",
      },
      {
        key: "mother",
        title: "Unterstützung für die Mutter",
        description: "Nutzen Sie Wilbor auch für Erholung, Selbstfürsorge und praktische Hilfe nach der Geburt.",
        prompt: "Ich möchte praktische Orientierung für meinen Körper und meine Erholung nach der Geburt. Womit sollte ich heute beginnen?",
        routeKey: "body",
        routeLabel: "Mein Körper öffnen",
      },
    ],
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

function getTopicStyles(key: string) {
  switch (key) {
    case "colic":
      return {
        card: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
        icon: "bg-amber-100 text-amber-700",
      };
    case "sleep":
      return {
        card: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
        icon: "bg-blue-100 text-blue-700",
      };
    case "feeding":
      return {
        card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50",
        icon: "bg-emerald-100 text-emerald-700",
      };
    case "fever":
      return {
        card: "border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50",
        icon: "bg-rose-100 text-rose-700",
      };
    case "milestones":
      return {
        card: "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50",
        icon: "bg-violet-100 text-violet-700",
      };
    default:
      return {
        card: "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50",
        icon: "bg-fuchsia-100 text-fuchsia-700",
      };
  }
}

export default function Dashboard() {
  const { t, locale, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const { user, logout, loading: authLoading } = useAuth();
  const { showConsent, handleAccept, handleDecline } = useParentalConsent();
  const dashboardLocale = toDashboardLocale(locale);
  const copy = DASHBOARD_COPY[dashboardLocale];

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

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

  const babiesQuery = trpc.wilbor.getBabies.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

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
  const activeBaby = babiesQuery.data?.[0];

  const resourceRoutes = useMemo(
    () => ({
      recipes: localePath("/recipes"),
      body: localePath("/meu-corpo"),
      milestones: localePath("/desenvolvimento"),
      blog: localePath("/blog"),
      premium: localePath("/premium"),
    }),
    [localePath]
  );

  const topicIcons = useMemo(
    () => ({
      colic: Wind,
      sleep: Moon,
      feeding: Utensils,
      fever: Thermometer,
      milestones: TrendingUp,
      mother: Heart,
    }),
    []
  );

  const handleSendMessage = async (content: string) => {
    if (credits?.isOverLimit) {
      setServerError(user ? "CREDIT_LIMIT_REACHED" : "ANONYMOUS_LIMIT_REACHED");
      return;
    }

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setLastUserQuestion(content);
    setServerError(null);
    setMessages(newMessages);

    try {
      const messagesForApi = newMessages.map((message) => ({
        role: message.role as "system" | "user" | "assistant",
        content: message.content,
      }));

      const response = await chatMutation.mutateAsync({
        messages: [
          {
            role: "system" as const,
            content: buildBaseSystemPrompt(dashboardLocale),
          },
          ...messagesForApi,
        ],
        fingerprint: user ? undefined : fingerprint || undefined,
      });

      const responseText =
        typeof response === "string"
          ? response
          : (response as any).content || (response as any).message || t("chat.error");

      const responseImageUrl = (response as any)?.imageUrl ?? null;
      const messageId = (response as any)?.messageId ?? null;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText, imageUrl: responseImageUrl, ...(messageId ? { messageId } : {}) } as any,
      ]);
      setLastAssistantMessage(responseText);

      if (user) {
        creditsQuery.refetch();
      } else {
        anonCreditsQuery.refetch();
      }
    } catch (error: any) {
      const errorMessage = error?.message || "";
      const foundError = extractKnownError(errorMessage);
      setServerError(foundError);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <button className="flex items-center gap-3" onClick={() => setLocation(localePath("/"))}>
            <div className="rounded-xl bg-purple-600 p-2 text-white shadow-sm">
              <Heart className="size-5 fill-white text-white" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-slate-900">Wilbor</p>
              <p className="text-xs text-slate-500">{copy.badge}</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {credits ? (
              <div
                className={`hidden rounded-full px-3 py-2 text-sm font-semibold sm:flex sm:items-center sm:gap-2 ${
                  isPremium ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Sparkles className="size-4" />
                {isPremium ? t("paywall.cta") : `${remaining ?? monthlyLimit} / ${monthlyLimit}`}
              </div>
            ) : null}

            {user ? (
              <>
                <div className="hidden text-right md:block">
                  <p className="text-sm font-semibold text-slate-900">{user.name || user.email}</p>
                  <p className="text-xs text-slate-500">{copy.usageTitle}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()} aria-label={copy.logoutLabel}>
                  <LogOut className="size-5 text-slate-500" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="rounded-full bg-purple-600 px-5 text-white hover:bg-purple-700"
              >
                <LogIn className="mr-2 size-4" />
                {copy.continueWithLogin}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-purple-100 bg-white p-8 shadow-sm">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
                  <ShieldCheck className="size-4" />
                  {copy.noCard}
                </div>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">{copy.title}</h1>
                <p className="mt-5 text-lg leading-8 text-slate-600">{copy.subtitle}</p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">{copy.usageTitle}</p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {isPremium ? t("paywall.cta") : remaining ?? monthlyLimit}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {isPremium ? copy.saveHistory : `${copy.freeTrialNote} ${monthlyLimit > 0 ? `(${monthlyLimit} no total)` : ""}`}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">{copy.chooseTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy.chooseSubtitle}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Mobile</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">{copy.continueWithLogin}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy.saveHistory}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">{copy.chooseTitle}</h2>
                <p className="mt-3 text-slate-600">{copy.chooseSubtitle}</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {copy.topicCards.map((card) => {
                  const Icon = topicIcons[card.key as keyof typeof topicIcons] || Sparkles;
                  const styles = getTopicStyles(card.key);
                  const route = card.routeKey ? resourceRoutes[card.routeKey] : null;

                  return (
                    <Card key={card.key} className={`rounded-3xl border p-6 shadow-sm ${styles.card}`}>
                      <div className={`inline-flex rounded-2xl p-3 ${styles.icon}`}>
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-700">{card.description}</p>
                      <div className="mt-6 flex flex-col gap-3">
                        <Button
                          onClick={() => handleSendMessage(card.prompt)}
                          disabled={chatMutation.isPending}
                          className="h-12 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
                        >
                          {copy.topicButton}
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                        {route && card.routeLabel ? (
                          <Button
                            variant="outline"
                            onClick={() => setLocation(route)}
                            className="h-11 rounded-full border-white/70 bg-white/70 text-slate-700 hover:bg-white"
                          >
                            {card.routeLabel}
                          </Button>
                        ) : null}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <AIChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={chatMutation.isPending}
                placeholder={t("chat.placeholder")}
                emptyStateMessage={copy.emptyState}
                suggestedPrompts={copy.quickPrompts}
                height="680px"
                serverError={serverError}
                onErrorCleared={() => setServerError(null)}
              />
            </section>

            {lastAssistantMessage && lastUserQuestion ? (
              <FeedbackButton userQuestion={lastUserQuestion} aiResponse={lastAssistantMessage} />
            ) : null}
          </div>

          <aside className="space-y-4">
            <SOSButton onEmergency={handleSendMessage} disabled={chatMutation.isPending} />

            <Card className="rounded-3xl border border-purple-100 p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <BarChart3 className="size-5 text-purple-600" /> {copy.usageTitle}
              </h3>

              <div className="mt-5 space-y-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all"
                    style={{
                      width: `${isPremium ? 100 : Math.min(100, (((monthlyLimit - (remaining ?? monthlyLimit)) || 0) / Math.max(monthlyLimit, 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {isPremium
                      ? t("paywall.cta")
                      : credits
                        ? `${remaining ?? monthlyLimit} ${t("chat.messages_left")}`
                        : copy.freeTrialNote}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {user ? copy.freeTrialNote : copy.saveHistory}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {!user ? (
                    <Button
                      onClick={() => {
                        window.location.href = getLoginUrl();
                      }}
                      className="h-12 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                    >
                      <LogIn className="mr-2 size-4" />
                      {copy.continueWithLogin}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={() => setLocation(resourceRoutes.premium)}
                    className="h-12 rounded-full border-slate-300"
                  >
                    {copy.seePlans}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">{copy.resourcesTitle}</h3>
              <div className="mt-5 flex flex-col gap-3">
                <Button variant="outline" className="justify-start gap-3 rounded-2xl h-12" onClick={() => setLocation(resourceRoutes.recipes)}>
                  <Utensils className="size-5 text-emerald-600" /> {copy.recipesLabel}
                </Button>
                <Button variant="outline" className="justify-start gap-3 rounded-2xl h-12" onClick={() => setLocation(resourceRoutes.body)}>
                  <User className="size-5 text-pink-600" /> {copy.bodyLabel}
                </Button>
                <Button variant="outline" className="justify-start gap-3 rounded-2xl h-12" onClick={() => setLocation(resourceRoutes.milestones)}>
                  <TrendingUp className="size-5 text-violet-600" /> {copy.milestonesLabel}
                </Button>
                <Button variant="outline" className="justify-start gap-3 rounded-2xl h-12" onClick={() => setLocation(resourceRoutes.blog)}>
                  <BookOpen className="size-5 text-blue-600" /> {copy.blogLabel}
                </Button>
              </div>
            </Card>

            {user && activeBaby?.birthDate ? (
              <SleepTracker
                babyId={activeBaby.id}
                babyAgeDays={Math.floor((Date.now() - new Date(activeBaby.birthDate).getTime()) / (1000 * 60 * 60 * 24))}
                babyName={activeBaby.name || "Bebê"}
                compact
              />
            ) : null}
          </aside>
        </div>
      </main>

      {user && showConsent ? (
        <ParentalConsentModal open={showConsent} onAccept={handleAccept} onDecline={handleDecline} />
      ) : null}
    </div>
  );
}
