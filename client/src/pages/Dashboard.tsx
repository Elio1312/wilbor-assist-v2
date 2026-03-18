import { useState, useEffect } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, LogOut, Settings } from "lucide-react";
import { useRouter } from "wouter";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Você é Wilbor, um apoio inteligente digital baseado em protocolos SBP/OMS/AAP para mães de bebês de 0-12 meses. Responda com carinho, sem julgamentos, baseado em evidências científicas.",
    },
  ]);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);

  const credits = trpc.wilbor.getCredits.useQuery();
  const chatMutation = trpc.wilbor.chat.useMutation({
    onSuccess: (response: string) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
      setLastAssistantMessage(response);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
        },
      ]);
    },
  });

  const handleSendMessage = (content: string) => {
    setLastUserQuestion(content);
    const newMessages = [...messages, { role: "user" as const, content }];
    setMessages(newMessages);
    chatMutation.mutate({ messages: newMessages });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="p-8 text-center max-w-md">
          <Heart className="mx-auto mb-4 size-12 text-purple-600" />
          <h2 className="mb-4 text-2xl font-bold">Bem-vinda ao Wilbor</h2>
          <p className="mb-6 text-gray-600">
            Faça login para acessar seu assistente neonatal inteligente
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Voltar à Home
          </Button>
        </Card>
      </div>
    );
  }

  const isLoading = chatMutation.isPending;
  const creditStatus = credits.data;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="size-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wilbor Assist</h1>
              <p className="text-sm text-gray-600">Seu apoio inteligente neonatal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {creditStatus && (
              <div className="rounded-lg bg-purple-50 px-4 py-2">
                <p className="text-sm font-semibold text-purple-900">
                  {creditStatus.remaining} / {creditStatus.monthlyLimit} mensagens
                </p>
                <p className="text-xs text-purple-700">Plano: {creditStatus.plan}</p>
              </div>
            )}

            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="size-4" />
              Configurações
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl gap-6 px-4 py-6">
          {/* Chat Area */}
          <div className="flex-1">
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <AIChatBox
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  placeholder="Faça uma pergunta sobre seu bebê..."
                  height="100%"
                  emptyStateMessage="Olá! Sou Wilbor, seu apoio inteligente neonatal. Como posso ajudar você hoje?"
                  suggestedPrompts={[
                    "Meu bebê não dorme bem",
                    "Como introduzir alimentos?",
                    "Meu bebê tem cólica",
                    "Vacinação do bebê",
                  ]}
                />
              </div>

              {/* Feedback Button - Mostrar após resposta do assistente */}
              {lastAssistantMessage && lastUserQuestion && (
                <div className="border-t border-gray-200 bg-white p-4">
                  <FeedbackButton
                    userQuestion={lastUserQuestion}
                    aiResponse={lastAssistantMessage}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Credits Info */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Seus Créditos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mensagens usadas</span>
                  <span className="font-semibold text-gray-900">
                    {creditStatus?.messagesUsed || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Limite mensal</span>
                  <span className="font-semibold text-gray-900">
                    {creditStatus?.monthlyLimit || 0}
                  </span>
                </div>
                <div className="my-3 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all"
                    style={{
                      width: `${
                        ((creditStatus?.messagesUsed || 0) /
                          (creditStatus?.monthlyLimit || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                {creditStatus?.isOverLimit && (
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-semibold text-red-900">
                      Limite atingido
                    </p>
                    <p className="text-xs text-red-700">
                      Atualize seu plano para continuar
                    </p>
                    <Button className="mt-2 w-full bg-red-600 hover:bg-red-700">
                      Atualizar Plano
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Links Rápidos</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📊 Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  👶 Meus Bebês
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🍽️ Receitas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📖 Blog
                </Button>
              </div>
            </Card>

            {/* Help */}
            <Card className="bg-purple-50 p-4">
              <h3 className="mb-2 font-semibold text-purple-900">Precisa de ajuda?</h3>
              <p className="mb-3 text-sm text-purple-700">
                Consulte nosso blog com artigos sobre desenvolvimento, sono, alimentação e muito mais.
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-100"
              >
                Ir para Blog
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
