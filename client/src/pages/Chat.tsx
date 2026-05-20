
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/i18n";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { PaywallModal } from "@/components/PaywallModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles, LogIn, Baby, X } from "lucide-react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { EbookOfferCard } from "@/components/EbookOfferCard";
import { getAnonymousSessionId } from "@/lib/anonymousSession";
import { AnalyticsEvents } from "@/lib/analytics";

// ─── Onboarding anônimo ────────────────────────────────────────────────────────
const STORAGE_KEY = "wilbor_anon_baby";

interface AnonBabyContext {
  babyName?: string;
  ageMonths?: number;   // null = recém-nascido / semanas
  ageWeeks?: number;    // usado se < 2 meses
  ageLabel: string;     // texto amigável: "3 meses", "6 semanas"
}

function loadAnonBaby(): AnonBabyContext | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAnonBaby(ctx: AnonBabyContext) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx)); } catch {}
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

function buildAnonSystemPrompt(locale: string, baby: AnonBabyContext): string {
  const base = buildBaseSystemPrompt(locale);

  const ctx: Record<string, string> = {
    pt: `\n\nCONTEXTO DO BEBÊ: ${baby.babyName ? `Nome: ${baby.babyName}.` : ""} Idade: ${baby.ageLabel}. Personalize TODAS as respostas para essa faixa etária específica. Não dê respostas genéricas — leve em conta o desenvolvimento, sono, alimentação e necessidades típicas de um bebê de ${baby.ageLabel}.`,
    en: `\n\nBABY CONTEXT: ${baby.babyName ? `Name: ${baby.babyName}.` : ""} Age: ${baby.ageLabel}. Personalize ALL responses for this specific age. Do not give generic answers — consider the development, sleep, feeding and typical needs of a ${baby.ageLabel} old baby.`,
    es: `\n\nCONTEXTO DEL BEBÉ: ${baby.babyName ? `Nombre: ${baby.babyName}.` : ""} Edad: ${baby.ageLabel}. Personaliza TODAS las respuestas para esta edad específica. No des respuestas genéricas — considera el desarrollo, sueño, alimentación y necesidades típicas de un bebé de ${baby.ageLabel}.`,
    fr: `\n\nCONTEXTE DU BÉBÉ : ${baby.babyName ? `Nom : ${baby.babyName}.` : ""} Âge : ${baby.ageLabel}. Personnalisez TOUTES les réponses pour cette tranche d'âge précise. Ne donnez pas de réponses génériques — tenez compte du développement, du sommeil, de l'alimentation et des besoins typiques d'un bébé de ${baby.ageLabel}.`,
    de: `\n\nKONTEXT DES BABYS: ${baby.babyName ? `Name: ${baby.babyName}.` : ""} Alter: ${baby.ageLabel}. Personalisieren Sie ALLE Antworten für diese konkrete Altersphase. Geben Sie keine allgemeinen Antworten — berücksichtigen Sie Entwicklung, Schlaf, Ernährung und typische Bedürfnisse eines Babys im Alter von ${baby.ageLabel}.`,
  };

  return base + (ctx[locale] ?? ctx.pt);
}

// ─── Modal de onboarding ───────────────────────────────────────────────────────
const AGE_OPTIONS: Record<string, Array<{ label: string; months: number; weeks?: number }>> = {
  pt: [
    { label: "Recém-nascido (0-4 sem)", months: 0, weeks: 2 },
    { label: "1 mês", months: 1 },
    { label: "2 meses", months: 2 },
    { label: "3 meses", months: 3 },
    { label: "4 meses", months: 4 },
    { label: "5 meses", months: 5 },
    { label: "6 meses", months: 6 },
    { label: "7 meses", months: 7 },
    { label: "8 meses", months: 8 },
    { label: "9 meses", months: 9 },
    { label: "10 meses", months: 10 },
    { label: "11 meses", months: 11 },
    { label: "12 meses", months: 12 },
  ],
  en: [
    { label: "Newborn (0-4 wks)", months: 0, weeks: 2 },
    { label: "1 month", months: 1 },
    { label: "2 months", months: 2 },
    { label: "3 months", months: 3 },
    { label: "4 months", months: 4 },
    { label: "5 months", months: 5 },
    { label: "6 months", months: 6 },
    { label: "7 months", months: 7 },
    { label: "8 months", months: 8 },
    { label: "9 months", months: 9 },
    { label: "10 months", months: 10 },
    { label: "11 months", months: 11 },
    { label: "12 months", months: 12 },
  ],
  es: [
    { label: "Recién nacido (0-4 sem)", months: 0, weeks: 2 },
    { label: "1 mes", months: 1 },
    { label: "2 meses", months: 2 },
    { label: "3 meses", months: 3 },
    { label: "4 meses", months: 4 },
    { label: "5 meses", months: 5 },
    { label: "6 meses", months: 6 },
    { label: "7 meses", months: 7 },
    { label: "8 meses", months: 8 },
    { label: "9 meses", months: 9 },
    { label: "10 meses", months: 10 },
    { label: "11 meses", months: 11 },
    { label: "12 meses", months: 12 },
  ],
  fr: [
    { label: "Nouveau-né (0-4 sem)", months: 0, weeks: 2 },
    { label: "1 mois", months: 1 },
    { label: "2 mois", months: 2 },
    { label: "3 mois", months: 3 },
    { label: "4 mois", months: 4 },
    { label: "5 mois", months: 5 },
    { label: "6 mois", months: 6 },
    { label: "7 mois", months: 7 },
    { label: "8 mois", months: 8 },
    { label: "9 mois", months: 9 },
    { label: "10 mois", months: 10 },
    { label: "11 mois", months: 11 },
    { label: "12 mois", months: 12 },
  ],
  de: [
    { label: "Neugeborenes (0-4 Wo.)", months: 0, weeks: 2 },
    { label: "1 Monat", months: 1 },
    { label: "2 Monate", months: 2 },
    { label: "3 Monate", months: 3 },
    { label: "4 Monate", months: 4 },
    { label: "5 Monate", months: 5 },
    { label: "6 Monate", months: 6 },
    { label: "7 Monate", months: 7 },
    { label: "8 Monate", months: 8 },
    { label: "9 Monate", months: 9 },
    { label: "10 Monate", months: 10 },
    { label: "11 Monate", months: 11 },
    { label: "12 Monate", months: 12 },
  ],
};

const ONBOARDING_TEXTS: Record<string, {
  title: string; subtitle: string; name_label: string;
  name_placeholder: string; age_label: string;
  skip: string; start: string;
}> = {
  pt: {
    title: "Antes de começar 💜",
    subtitle: "Para dar respostas personalizadas para o seu bebê",
    name_label: "Nome do bebê (opcional)",
    name_placeholder: "Ex: Sofia, Miguel...",
    age_label: "Quantos meses tem o bebê?",
    skip: "Pular",
    start: "Começar",
  },
  en: {
    title: "Before we start 💜",
    subtitle: "To give personalized answers for your baby",
    name_label: "Baby's name (optional)",
    name_placeholder: "E.g.: Emma, Liam...",
    age_label: "How old is your baby?",
    skip: "Skip",
    start: "Start",
  },
  es: {
    title: "Antes de empezar 💜",
    subtitle: "Para dar respuestas personalizadas para tu bebé",
    name_label: "Nombre del bebé (opcional)",
    name_placeholder: "Ej: Sofía, Mateo...",
    age_label: "¿Cuántos meses tiene el bebé?",
    skip: "Omitir",
    start: "Empezar",
  },
  fr: {
    title: "Avant de commencer 💜",
    subtitle: "Pour vous donner des réponses personnalisées pour votre bébé",
    name_label: "Prénom du bébé (facultatif)",
    name_placeholder: "Ex : Léa, Noah...",
    age_label: "Quel âge a votre bébé ?",
    skip: "Passer",
    start: "Commencer",
  },
  de: {
    title: "Bevor wir beginnen 💜",
    subtitle: "Um personalisierte Antworten für Ihr Baby zu geben",
    name_label: "Name des Babys (optional)",
    name_placeholder: "z. B.: Mia, Leon...",
    age_label: "Wie alt ist Ihr Baby?",
    skip: "Überspringen",
    start: "Starten",
  },
};

function OnboardingModal({
  locale,
  onComplete,
  onSkip,
}: {
  locale: string;
  onComplete: (ctx: AnonBabyContext) => void;
  onSkip: () => void;
}) {
  const txt = ONBOARDING_TEXTS[locale] ?? ONBOARDING_TEXTS.pt;
  const ages = AGE_OPTIONS[locale] ?? AGE_OPTIONS.pt;
  const [babyName, setBabyName] = useState("");
  const [selectedAge, setSelectedAge] = useState<typeof ages[0] | null>(null);

  const handleStart = () => {
    if (!selectedAge) { onSkip(); return; }
    const ctx: AnonBabyContext = {
      babyName: babyName.trim() || undefined,
      ageMonths: selectedAge.months,
      ageWeeks: selectedAge.weeks,
      ageLabel: selectedAge.label,
    };
    saveAnonBaby(ctx);
    onComplete(ctx);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 px-6 pt-6 pb-8 text-white relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">{txt.title}</h2>
          </div>
          <p className="text-purple-100 text-sm">{txt.subtitle}</p>
        </div>

        <div className="px-6 py-5 space-y-5 -mt-4 bg-white rounded-t-3xl relative">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {txt.name_label}
            </label>
            <input
              type="text"
              value={babyName}
              onChange={e => setBabyName(e.target.value)}
              placeholder={txt.name_placeholder}
              maxLength={30}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            />
          </div>

          {/* Idade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {txt.age_label}
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
              {ages.map(age => (
                <button
                  key={age.label}
                  onClick={() => setSelectedAge(age)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium transition-all border ${
                    selectedAge?.label === age.label
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onSkip}
              className="flex-1 py-3 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              {txt.skip}
            </button>
            <button
              onClick={handleStart}
              disabled={!selectedAge}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              {txt.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CREDIT_TEXTS: Record<string, {
  remaining: (n: number, total: number) => string;
  unlimited: string;
  login_prompt: string;
  login_cta: string;
  anon_limit_reached: string;
}> = {
  pt: {
    remaining: (n, t) => `${n} de ${t} consultas gratuitas`,
    unlimited: "Consultas ilimitadas",
    login_prompt: "Faça login para usar o chat",
    login_cta: "Fazer login",
    anon_limit_reached: "Limite de consultas anônimas atingido. Faça login para continuar!",
  },
  en: {
    remaining: (n, t) => `${n} of ${t} free consultations`,
    unlimited: "Unlimited consultations",
    login_prompt: "Sign in to use the chat",
    login_cta: "Sign In",
    anon_limit_reached: "Anonymous consultation limit reached. Sign in to continue!",
  },
  es: {
    remaining: (n, t) => `${n} de ${t} consultas gratuitas`,
    unlimited: "Consultas ilimitadas",
    login_prompt: "Inicia sesión para usar el chat",
    login_cta: "Iniciar sesión",
    anon_limit_reached: "Límite de consultas anónimas alcanzado. ¡Inicia sesión para continuar!",
  },
  fr: {
    remaining: (n, t) => `${n} sur ${t} consultations gratuites`,
    unlimited: "Consultations illimitées",
    login_prompt: "Connectez-vous pour utiliser le chat",
    login_cta: "Se connecter",
    anon_limit_reached: "Limite de consultations anonymes atteinte. Connectez-vous pour continuer !",
  },
  de: {
    remaining: (n, t) => `${n} von ${t} kostenlosen Beratungen`,
    unlimited: "Unbegrenzte Beratungen",
    login_prompt: "Anmelden, um den Chat zu nutzen",
    login_cta: "Anmelden",
    anon_limit_reached: "Limit für anonyme Beratungen erreicht. Melden Sie sich an, um fortzufahren!",
  },
};

export function Chat() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  type WilborMsg = Message & { messageId?: number | null };
  const [messages, setMessages] = useState<WilborMsg[]>([
    {
      role: "assistant",
      content: t("chat.welcome") || "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
    },
  ]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [ebookOffer, setEbookOffer] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Onboarding anônimo ──────────────────────────────────────────────────────
  const [anonBaby, setAnonBaby] = useState<AnonBabyContext | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Só mostra onboarding para usuárias não logadas
    if (!user && !authLoading) {
      const saved = loadAnonBaby();
      if (saved) {
        setAnonBaby(saved);
      } else {
        // Pequeno delay para não assustar quem acabou de chegar
        const timer = setTimeout(() => setShowOnboarding(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    const setFp = async () => {
      try {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        console.warn('[Chat] FingerprintJS failed, using anonymous session ID:', error);
        const anonId = getAnonymousSessionId();
        setFingerprint(anonId);
      }
    };
    setFp();
  }, []);

  const chatMutation = trpc.wilbor.chat.useMutation({
    onError: (error) => {
      const errorMessage = error?.message || "";
      const knownErrors = ["CREDIT_LIMIT_REACHED", "ANONYMOUS_LIMIT_REACHED", "RATE_LIMIT_EXCEEDED", "FINGERPRINT_REQUIRED"];
      const foundError = knownErrors.find(e => errorMessage.includes(e)) || errorMessage;
      setServerError(foundError);
      setMessages((prev) => prev.slice(0, -1));
    }
  });

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

  const credits = user ? creditsQuery.data : anonCreditsQuery.data;
  const ctexts = CREDIT_TEXTS[locale] ?? CREDIT_TEXTS.pt;

  useEffect(() => {
    if (credits?.isOverLimit) {
      setPaywallOpen(true);
    }
  }, [credits?.isOverLimit]);

  useEffect(() => {
    AnalyticsEvents.chatEntry(user?.id != null ? String(user.id) : undefined);
  }, [user]);

  useEffect(() => {
    if (user && fingerprint) {
      AnalyticsEvents.chatStarted(String(user.id));
    }
  }, [user, fingerprint]);

  const handleSendMessage = async (userMessage: string) => {
    if (credits?.isOverLimit) {
      setPaywallOpen(true);
      return;
    }

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    try {
      // Build messages array with system prompt for the backend
      // Se usuária anônima com contexto de bebê → personaliza o system prompt
      const systemPromptContent = (!user && anonBaby)
        ? buildAnonSystemPrompt(locale, anonBaby)
        : buildBaseSystemPrompt(locale);

      const systemPrompt = {
        role: "system" as const,
        content: systemPromptContent,
      };
      
      // Filter out the welcome message (assistant role) from the display messages
      // and include only user/assistant messages for the API
      const messagesForApi = newMessages
        .filter(m => m.role !== "assistant" || m.content !== (t("chat.welcome") || "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?"))
        .map(m => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content
        }));
      
      // Add system prompt at the beginning
      const messagesWithSystem = [systemPrompt, ...messagesForApi];
      
      const response = await chatMutation.mutateAsync({
        messages: messagesWithSystem,
        fingerprint: fingerprint || undefined,
      });

      const responseText =
        typeof response === "string"
          ? response
          : (response as any).content || (response as any).message || "Desculpe, não consegui processar sua pergunta.";

      const messageId = (response as any)?.messageId ?? null;
      const offer = (response as any)?.ebookOffer ?? null;
      if (offer) setEbookOffer(offer);

      // Capturar imageUrl do RAG (imagem de exercício/ilustração)
      const responseImageUrl = (response as any)?.imageUrl ?? null;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText, messageId, imageUrl: responseImageUrl },
      ]);

      if (user) {
        creditsQuery.refetch();
      } else {
        anonCreditsQuery.refetch();
      }
    } catch (error: any) {
      const errorMessage = error?.message || "";
      const knownErrors = ["CREDIT_LIMIT_REACHED", "ANONYMOUS_LIMIT_REACHED", "RATE_LIMIT_EXCEEDED", "FINGERPRINT_REQUIRED"];
      if (!knownErrors.some(e => errorMessage.includes(e))) {
        console.error("Error calling Wilbor chat:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t("chat.error") || "Desculpe, houve um erro. Tente novamente.",
          },
        ]);
      }
    }
  };

  const isPremium = user && credits && "plan" in credits && credits.plan !== "free";
  const remaining = credits?.remaining ?? 0;
  const monthlyLimit = credits
    ? ("limit" in credits ? credits.limit : "monthlyLimit" in credits ? credits.monthlyLimit : 5)
    : 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💜</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wilbor</h1>
              <p className="text-sm text-gray-600">{t("chat.subtitle") || "Seu assistente neonatal IA"}</p>
            </div>
          </div>

          {!authLoading && credits && (
            <div className="flex items-center gap-4">
              {isPremium ? (
                <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  {ctexts.unlimited}
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all ${
                    remaining === 0
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : remaining <= 2
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => remaining === 0 && setPaywallOpen(true)}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: monthlyLimit }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < (monthlyLimit - remaining)
                            ? remaining === 0
                              ? "bg-red-500"
                              : "bg-amber-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{ctexts.remaining(remaining, monthlyLimit)}</span>
                </div>
              )}

             
                  {!user ? (
                 <a  
                  href={getLoginUrl()}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  {ctexts.login_cta}
                </a>
              ) : (
                <div className="text-sm text-gray-500 font-medium">
                  {user.name || user.email}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={chatMutation.isPending}
            serverError={serverError}
            onErrorCleared={() => setServerError(null)}
          />
        </div>

        {ebookOffer && (
          <EbookOfferCard
            key={ebookOffer.ebookId}
            offer={ebookOffer}
          />
        )}

        {credits && !isPremium && remaining > 0 && remaining <= 2 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-amber-800 text-sm">
              {locale === "pt" && `Você tem apenas ${remaining} consulta${remaining === 1 ? "" : "s"} gratuita${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}.`}
              {locale === "en" && `You have only ${remaining} free consultation${remaining === 1 ? "" : "s"} remaining.`}
              {locale === "es" && `Te quedan solo ${remaining} consulta${remaining === 1 ? "" : "s"} gratuita${remaining === 1 ? "" : "s"}.`}
              {locale === "fr" && `Il vous reste seulement ${remaining} consultation${remaining === 1 ? "" : "s"} gratuite${remaining === 1 ? "" : "s"}.`}
              {locale === "de" && `Sie haben noch ${remaining} kostenlose Beratung${remaining === 1 ? "" : "en"}.`}
            </p>
            <button
              onClick={() => setPaywallOpen(true)}
              className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline whitespace-nowrap"
            >
              {locale === "pt" && "Ver planos"}
              {locale === "en" && "See plans"}
              {locale === "es" && "Ver planes"}
              {locale === "fr" && "Voir les forfaits"}
              {locale === "de" && "Pläne ansehen"}
            </button>
          </div>
        )}

        {credits?.isOverLimit && !user && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-red-800 text-sm">{ctexts.anon_limit_reached}</p>
            <a
              href={getLoginUrl()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              {ctexts.login_cta}
            </a>
          </div>
        )}
      </main>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
      />

      {/* Onboarding anônimo */}
      {showOnboarding && !user && (
        <OnboardingModal
          locale={locale}
          onComplete={(ctx) => {
            setAnonBaby(ctx);
            setShowOnboarding(false);
          }}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
