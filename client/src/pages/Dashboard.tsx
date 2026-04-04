import { useState, useEffect } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { FeedbackButton } from "@/components/FeedbackButton";
import { SOSButton } from "@/components/SOSButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, LogOut, Baby, Utensils, BookOpen, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";

export default function Dashboard() {
  const { t, localePath } = useI18n(); // Uso correto do motor de tradução
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  // Prevent Google from indexing private/auth-required pages
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // 1. Estados simplificados para o Chat (Removido prompt de sistema duplicado)
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);

  // 2. Busca de Créditos e Status (ROI de Vendas)
  const credits = trpc.wilbor.getCredits.useQuery();
  const chatMutation = trpc.wilbor.chat.useMutation({
    onSuccess: (response: string) => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLastAssistantMessage(response);
      credits.refetch(); // Atualiza saldo imediatamente após resposta
    }
  });

  const handleSendMessage = (content: string) => {
    setLastUserQuestion(content);
    const newMessages = [...messages, { role: "user" as const, content }];
    setMessages(newMessages);
    chatMutation.mutate({ messages: newMessages });
  };

  if (!user) {
    setLocation(localePath("/")); // Redirecionamento limpo
    return null;
  }

  const creditStatus = credits.data;

  return (
    <div className="flex h-screen flex-col bg-gray-50/50">
      {/* Header Profissional */}
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation(localePath("/"))}>
          <div className="bg-purple-600 p-2 rounded-lg">
            <Heart className="size-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Wilbor</h1>
        </div>

        <div className="flex items-center gap-4">
          {creditStatus && (
            <div className="hidden md:block bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">
              <span className="text-sm font-medium text-purple-700">
                {creditStatus.remaining} {t("chat.messages_left")}
              </span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => logout()} className="text-gray-400 hover:text-red-500">
            <LogOut className="size-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full gap-6 p-6">
        {/* Chat Principal */}
        <div className="flex-1 flex flex-col gap-4">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={chatMutation.isPending}
            height="100%"
          />
          {lastAssistantMessage && lastUserQuestion && (
            <FeedbackButton userQuestion={lastUserQuestion} aiResponse={lastAssistantMessage} />
          )}
        </div>

        {/* Sidebar de Gatilhos de Valor (ROI) */}
        <aside className="w-80 flex flex-col gap-4 overflow-y-auto">
          <SOSButton onEmergency={handleSendMessage} disabled={chatMutation.isPending} />

          <Card className="p-5 border-purple-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="size-4 text-purple-600" /> {t("nav.usage")}
            </h3>
            <div className="space-y-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all" 
                  style={{ width: `${(creditStatus?.messagesUsed || 0) / (creditStatus?.monthlyLimit || 5) * 100}%` }} 
                />
              </div>
              <Button 
                onClick={() => setLocation(localePath("/checkout"))}
                className="w-full bg-purple-600 hover:bg-purple-700 shadow-md"
              >
                {t("paywall.cta")}
              </Button>
            </div>
          </Card>

          <nav className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-3 h-12 border-gray-200 hover:border-purple-200" onClick={() => setLocation(localePath("/babies"))}>
              <Baby className="size-5 text-pink-500" /> {t("nav.my_babies")}
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12 border-gray-200 hover:border-purple-200" onClick={() => setLocation(localePath("/recipes"))}>
              <Utensils className="size-5 text-orange-500" /> {t("nav.recipes")}
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12 border-gray-200 hover:border-purple-200" onClick={() => setLocation(localePath("/blog"))}>
              <BookOpen className="size-5 text-blue-500" /> {t("nav.blog")}
            </Button>
          </nav>
        </aside>
      </main>
    </div>
  );
}
