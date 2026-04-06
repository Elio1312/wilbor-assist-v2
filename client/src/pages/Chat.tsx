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
    login_cta: "Entrar com Google",
    anon_limit_reached: "Limite de consultas anônimas atingido. Faça login para continuar!",
  },
  en: {
    remaining: (n, t) => `${n} of ${t} free consultations`,
    unlimited: "Unlimited consultations",
    login_prompt: "Sign in to use the chat",
    login_cta: "Sign In with Google",
    anon_limit_reached: "Anonymous consultation limit reached. Sign in to continue!",
  },
  es: {
    remaining: (n, t) => `${n} de ${t} consultas gratuitas`,
    unlimited: "Consultas ilimitadas",
    login_prompt: "Inicia sesión para usar el chat",
    login_cta: "Entrar con Google",
    anon_limit_reached: "Límite de consultas anónimas alcanzado. ¡Inicia sesión para continuar!",
  },
};

export function Chat() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  // Tipo estendido para incluir messageId do backend
  type WilborMsg = Message & { messageId?: number | null };
  const [messages, setMessages] = useState<WilborMsg[]>([
    {
      role: "assistant",
      content: t("chat.welcome") || "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
    },
  ]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Initialize fingerprint
  useEffect(() => {
    const setFp = async () => {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };
    setFp();
  }, []);

  const chatMutation = trpc.wilbor.chat.useMutation();
  
  // Credits for authenticated users
  const creditsQuery = trpc.wilbor.getCredits.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  // Credits for anonymous users
  const anonCreditsQuery = trpc.wilbor.getAnonymousCredits.useQuery(
    { fingerprint: fingerprint || "" },
    {
      enabled: !user && !!fingerprint,
      refetchOnWindowFocus: false,
    }
  );

  const credits = user ? creditsQuery.data : anonCreditsQuery.data;
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
        fingerprint: fingerprint || undefined,
      });

      const responseText =
        typeof response === "string"
          ? response
          : (response as any).content || (response as any).message || "Desculpe, não consegui processar sua pergunta.";
      
      // Capturar messageId para o sistema de rating
      const messageId = (response as any)?.messageId ?? null;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText, messageId },
      ]);

      // Refresh credits after each message
      if (user) {
        creditsQuery.refetch();
      } else {
        anonCreditsQuery.refetch();
      }
    } catch (error: any) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("CREDIT_LIMIT_REACHED") || errorMessage.includes("ANONYMOUS_LIMIT_REACHED")) {
        // Remove the optimistic user message
        setMessages((prev) => prev.slice(0, -1));
        setPaywallOpen(true);
        if (user) creditsQuery.refetch(); else anonCreditsQuery.refetch();
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

  const isPremium = user && credits?.plan !== "free";
  const remaining = credits?.remaining ?? 0;
  const monthlyLimit = credits?.limit ?? credits?.monthlyLimit ?? 5;

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

              {/* Login button if not authenticated */}
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
        {credits && !isPremium && remaining > 0 && remaining <= 2 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-amber-800 text-sm">
              {locale === "pt" && `Você tem apenas ${remaining} consulta${remaining > 1 ? "s" : ""} gratuita${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`}
              {locale === "en" && `You have only ${remaining} free consultation${remaining > 1 ? "s" : ""} left.`}
              {locale === "es" && `Solo te quedan ${remaining} consulta${remaining > 1 ? "s" : ""} gratuita${remaining > 1 ? "s" : ""}.`}
            </p>
            <button
              onClick={() => setPaywallOpen(true)}
              className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              {locale === "pt" ? "Ver planos" : locale === "en" ? "View plans" : "Ver planes"}
            </button>
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
