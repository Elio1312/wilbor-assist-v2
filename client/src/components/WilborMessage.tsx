import { useState } from "react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  messageId?: number | null;
}

interface WilborMessageProps {
  msg: Message;
}

/**
 * WilborMessage — Componente de mensagem do chat com sistema de rating
 * 
 * Funcionalidades:
 * - Renderização segura via Streamdown (sem dangerouslySetInnerHTML / XSS safe)
 * - Sistema de 5 estrelas para medir assertividade da IA
 * - Alarme automático para o CEO quando rating <= 2
 * - Meta: 95% de assertividade (média >= 4.5 estrelas)
 */
export function WilborMessage({ msg }: WilborMessageProps) {
  const [rated, setRated] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const submitFeedback = trpc.wilbor.submitFeedback.useMutation({
    onSuccess: () => {
      toast.success("Obrigada pelo feedback! 💜 Isso ajuda o Wilbor a melhorar.");
      setRated(true);
    },
    onError: () => {
      toast.error("Erro ao enviar feedback. Tente novamente.");
    },
  });

  const handleRating = (star: number) => {
    if (!msg.messageId || rated) return;
    submitFeedback.mutate({ messageId: msg.messageId, rating: star });
  };

  const isAssistant = msg.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? "bg-purple-50 border border-purple-100 text-gray-800"
            : "bg-purple-600 text-white"
        }`}
      >
        {/* Conteúdo da mensagem — renderizado via Streamdown (XSS Safe) */}
        <div className={`prose prose-sm max-w-none ${isAssistant ? "text-gray-800" : "text-white prose-invert"}`}>
          <Streamdown>{msg.content}</Streamdown>
        </div>

        {/* Sistema de Rating — apenas para respostas da IA com messageId */}
        {isAssistant && msg.messageId && !rated && (
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-purple-500 font-medium">
                Esta resposta foi útil?
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    disabled={submitFeedback.isPending}
                    className="text-lg transition-transform hover:scale-125 disabled:opacity-50"
                    aria-label={`Avaliar ${star} estrela${star > 1 ? "s" : ""}`}
                  >
                    {star <= (hoveredStar || 0) ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Confirmação após avaliação */}
        {isAssistant && rated && (
          <p className="text-[10px] text-green-600 mt-2 italic">
            ✓ Obrigada! Seu feedback ajuda o Wilbor a ser mais preciso.
          </p>
        )}
      </div>
    </div>
  );
}
