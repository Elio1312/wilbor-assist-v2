import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/i18n";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { PaywallModal } from "@/components/PaywallModal";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { Sparkles } from "lucide-react";

const CREDIT_TEXTS: Record<string, {
  remaining: (n: number, total: number) => string;
  unlimited: string;
  login_prompt: string;
  login_cta: string;
}> = {
  pt: {
    remaining: (n, t) => `${n} de ${t} consultas gratuitas`,
    unlimited: "Consultas ilimitadas",
    login_prompt: "Faça login para usar o chat",
    login_cta: "Entrar",
  },
  en: {
    remaining: (n, t) => `${n} of ${t} free consultations`,
    unlimited: "Unlimited consultations",
    login_prompt: "Sign in to use the chat",
    login_cta: "Sign In",
  },
  es: {
    remaining: (n, t) => `${n} de ${t} consultas gratuitas`,
    unlimited: "Consultas ilimitadas",
    login_prompt: "Inicia sesión para usar el chat",
    login_cta: "Entrar",
  },
  fr: {
    remaining: (n, t) => `${n} sur ${t} consultations gratuites`,
    unlimited: "Consultations illimitées",
    login_prompt: "Connectez-vous pour utiliser le chat",
    login_cta: "Se connecter",
  },
  de: {
    remaining: (n, t) => `${n} von ${t} kostenlosen Beratungen`,
    unlimited: "Unbegrenzte Beratungen",
    login_prompt: "Melden Sie sich an, um den Chat zu nutzen",
    login_cta: "Anmelden",
  },
};

export function Chat() {
  const { t, locale, localePath } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("chat.welcome") || "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
    },
  ]);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const chatMutation = trpc.wilbor.chat.useMutation();
  const creditsQuery = trpc.wilbor.getCredits.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const credits = creditsQuery.data;
  const ctexts = CREDIT_TEXTS[locale] ?? CREDIT_TEXTS.pt;

  // Show paywall if user hits limit
  useEffect(() => {
    if (credits?.isOverLimit) {
      setPaywallOpen(true);
    }
  }, [credits?.isOverLimit]);

  const handleSendMessage = async (userMessage: string) => {
    // Block if over limit
    if (credits?.isOverLimit) {
      setPaywallOpen(true);
      return;
    }

    // Add user message optimistically
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    try {
      const response = await chatMutation.mutateAsync({
        messages: newMessages,
      });

      const responseText =
        typeof response === "string"
          ? response
          : (response as any).content || (response as any).message || "Desculpe, não consegui processar sua pergunta.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);

      // Refresh credits after each message
      creditsQuery.refetch();
    } catch (error: any) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("CREDIT_LIMIT_REACHED")) {
        // Remove the optimistic user message
        setMessages((prev) => prev.slice(0, -1));
        setPaywallOpen(true);
        creditsQuery.refetch();
        return;
      }
      console.error("Error calling Wilbor chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error") || "Desculpe, houve um erro. Tente novamente.",
        },
      ]);
    }
  };

  const isPremium = credits?.plan !== "free";
  const remaining = credits?.remaining ?? 0;
  const monthlyLimit = credits?.monthlyLimit ?? 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
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

          {/* Credit counter */}
          {!authLoading && user && credits && (
            <div className="flex items-center gap-2">
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
                  title={remaining === 0 ? "Limite atingido — clique para fazer upgrade" : undefined}
                >
                  {/* Mini progress dots */}
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
            </div>
          )}

          {/* Login prompt if not authenticated */}
          {!authLoading && !user && (
            <a
              href={getLoginUrl()}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium underline"
            >
              {ctexts.login_cta}
            </a>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={chatMutation.isPending}
          />
        </div>

        {/* Upgrade nudge bar when 1-2 remaining */}
        {user && credits && !isPremium && remaining > 0 && remaining <= 2 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-amber-800 text-sm">
              {locale === "pt" && `Você tem apenas ${remaining} consulta${remaining > 1 ? "s" : ""} gratuita${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`}
              {locale === "en" && `You have only ${remaining} free consultation${remaining > 1 ? "s" : ""} left.`}
              {locale === "es" && `Solo te quedan ${remaining} consulta${remaining > 1 ? "s" : ""} gratuita${remaining > 1 ? "s" : ""}.`}
              {locale === "fr" && `Il vous reste seulement ${remaining} consultation${remaining > 1 ? "s" : ""} gratuite${remaining > 1 ? "s" : ""}.`}
              {locale === "de" && `Sie haben noch ${remaining} kostenlose Beratung${remaining > 1 ? "en" : ""} übrig.`}
            </p>
            <button
              onClick={() => setPaywallOpen(true)}
              className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              {locale === "pt" ? "Ver planos" : locale === "en" ? "View plans" : locale === "es" ? "Ver planes" : locale === "fr" ? "Voir les plans" : "Pläne ansehen"}
            </button>
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
