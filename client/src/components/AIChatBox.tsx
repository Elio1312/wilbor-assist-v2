import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Sparkles, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Modal de Paywall ────────────────────────────────────────────────────────
function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center rounded-lg"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl border border-border text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Suas consultas gratuitas acabaram 💜
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Você usou suas 5 consultas grátis. Continue com o Wilbor Premium e tenha acesso ilimitado 24h por dia.
        </p>
        <Button
          className="w-full"
          onClick={() => { window.location.href = "/checkout"; }}
        >
          Ver planos →
        </Button>
        <button
          onClick={onClose}
          className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

// ─── RatingWidget ────────────────────────────────────────────────────────────
function RatingWidget({ messageId }: { messageId: number }) {
  const [rated, setRated] = useState(false);
  const [hovered, setHovered] = useState(0);
  const submitFeedback = trpc.wilbor.submitFeedback.useMutation({
    onSuccess: () => {
      toast.success("Obrigada! Seu feedback ajuda o Wilbor a melhorar. 💜");
      setRated(true);
    },
    onError: () => {
      toast.error("Não foi possível enviar o feedback. Tente novamente.");
    },
  });
  if (rated) return <p className="text-[10px] text-green-600 mt-2 italic">✓ Obrigada pelo feedback!</p>;
  return (
    <div className="mt-2 pt-2 border-t border-purple-100 flex items-center justify-between gap-2">
      <span className="text-[10px] text-purple-500">Esta resposta foi útil?</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => submitFeedback.mutate({ messageId, rating: star })}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            disabled={submitFeedback.isPending}
            className="text-sm hover:scale-125 transition-transform disabled:opacity-50"
          >
            {star <= (hovered || 0) ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tipos ───────────────────────────────────────────────────────────────────
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  imageUrl?: string | null; // exercise/illustration image from RAG
  localOnly?: boolean;
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  height?: string | number;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
  /** Erro retornado pelo servidor (ex: "CREDIT_LIMIT_REACHED", "ANONYMOUS_LIMIT_REACHED") */
  serverError?: string | null;
  /** Callback para limpar o erro após o modal ser fechado */
  onErrorCleared?: () => void;
};

// ─── Erros que disparam o paywall ────────────────────────────────────────────
const PAYWALL_ERRORS = new Set([
  "CREDIT_LIMIT_REACHED",
  "ANONYMOUS_LIMIT_REACHED",
]);

// ─── Mensagens de erro amigáveis para outros casos ───────────────────────────
function friendlyError(code: string): string {
  if (code === "RATE_LIMIT_EXCEEDED") return "Muitas mensagens em pouco tempo. Aguarde um momento. ⏳";
  if (code === "FINGERPRINT_REQUIRED") return "Não foi possível identificar seu dispositivo. Tente recarregar a página.";
  if (code === "EMPTY_CHAT_MESSAGES") return "Por favor, escreva uma mensagem antes de enviar.";
  return "Algo deu errado. Tente novamente em instantes.";
}

// ─── AIChatBox ───────────────────────────────────────────────────────────────
export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Digite sua mensagem...",
  className,
  height = "600px",
  emptyStateMessage = "Olá! Como posso ajudar hoje?",
  suggestedPrompts,
  serverError,
  onErrorCleared,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [minHeightForLastMessage, setMinHeightForLastMessage] = useState(0);

  // Reage a erros do servidor
  useEffect(() => {
    if (!serverError) return;
    if (PAYWALL_ERRORS.has(serverError)) {
      setShowPaywall(true);
    } else {
      toast.error(friendlyError(serverError));
    }
  }, [serverError]);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  useEffect(() => {
    if (containerRef.current && inputAreaRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const inputHeight = inputAreaRef.current.offsetHeight;
      const scrollAreaHeight = containerHeight - inputHeight;
      const userMessageReservedHeight = 56;
      const calculatedHeight = scrollAreaHeight - 32 - userMessageReservedHeight;
      setMinHeightForLastMessage(Math.max(0, calculatedHeight));
    }
  }, []);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    onSendMessage(trimmedInput);
    setInput("");
    scrollToBottom();
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col bg-card text-card-foreground rounded-lg border shadow-sm",
        className
      )}
      style={{ height }}
    >
      {/* Modal de Paywall */}
      {showPaywall && (
        <PaywallModal
          onClose={() => {
            setShowPaywall(false);
            onErrorCleared?.();
          }}
        />
      )}

      {/* Área de Mensagens */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden">
        {displayMessages.length === 0 ? (
          <div className="flex h-full flex-col p-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="size-12 opacity-20" />
                <p className="text-sm">{emptyStateMessage}</p>
              </div>
              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-4 p-4">
              {displayMessages.map((message, index) => {
                const isLastMessage = index === displayMessages.length - 1;
                const shouldApplyMinHeight =
                  isLastMessage && !isLoading && minHeightForLastMessage > 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user"
                        ? "justify-end items-start"
                        : "justify-start items-start"
                    )}
                    style={shouldApplyMinHeight ? { minHeight: `${minHeightForLastMessage}px` } : undefined}
                  >
                    {message.role === "assistant" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2.5",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                          {/* 🖼️ Imagem de exercício/ilustração do RAG */}
                          {message.imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-purple-100">
                              <img
                                src={message.imageUrl}
                                alt="Ilustração de exercício"
                                className="w-full max-w-xs object-contain rounded-lg"
                                loading="lazy"
                              />
                            </div>
                          )}
                          {/* ⭐ Rating de feedback - apenas para mensagens com messageId */}
                          {(message as any).messageId && (
                            <RatingWidget messageId={(message as any).messageId} />
                          )}
                        </>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-secondary flex items-center justify-center">
                        <User className="size-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div
                  className="flex items-start gap-3"
                  style={minHeightForLastMessage > 0 ? { minHeight: `${minHeightForLastMessage}px` } : undefined}
                >
                  <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <div className="rounded-lg bg-muted px-4 py-2.5">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input */}
      <form
        ref={inputAreaRef}
        onSubmit={handleSubmit}
        className="flex gap-2 p-4 border-t bg-background/50 items-end"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 max-h-32 resize-none min-h-9"
          rows={1}
          maxLength={4000}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="shrink-0 h-[38px] w-[38px]"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
