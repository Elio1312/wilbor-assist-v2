import { useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";

export function Chat() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("chat.welcome") || "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
    },
  ]);

  const chatMutation = trpc.wilbor.chat.useMutation();

  const handleSendMessage = async (userMessage: string) => {
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    try {
      // Call Wilbor chat
      const response = await chatMutation.mutateAsync({
        messages: newMessages,
      });

      // Add AI response
      const responseText = typeof response === "string" ? response : (response as any).content || (response as any).message || "Desculpe, não consegui processar sua pergunta.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseText,
        },
      ]);
    } catch (error) {
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
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <AIChatBox messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
}
