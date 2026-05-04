
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/i18n";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { PaywallModal } from "@/components/PaywallModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles, LogIn } from "lucide-react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { EbookOfferCard } from "@/components/EbookOfferCard";
import { getAnonymousSessionId } from "@/lib/anonymousSession";
import { AnalyticsEvents } from "@/lib/analytics";

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
    AnalyticsEvents.chatEntry(user?.id);
  }, [user]);

  useEffect(() => {
    if (user && fingerprint) {
      AnalyticsEvents.chatStarted(user.id);
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
      const systemPrompt = {
        role: "system" as const,
        content: "Você é o Wilbor, um assistente neonatal IA especializado em cuidados com recém-nascidos. Responda em português, com base em protocolos SBP, OMS e AAP. Seja empático, prático e sempre priorize a segurança do bebê."
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
              {locale === "pt" && `Você tem ap
