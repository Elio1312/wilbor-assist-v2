import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/contexts/i18n"; // Injeção de internacionalização
import ReactMarkdown from 'react-markdown'; // Mais estável para React que Streamdown puro
import { ChatUpsell } from "./ChatUpsell";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  className?: string;
  height?: string | number;
};

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  className,
  height = "600px",
}: AIChatBoxProps) {
  const { t } = useI18n(); // Uso do contexto de tradução revisado
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  // Auto-scroll para manter a mãe focada na resposta (ROI de UX)
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    
    // Focar novamente no input após enviar
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div
      className={cn("flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden", className)}
      style={{ height }}
    >
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="flex flex-col space-y-6">
          {displayMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Sparkles className="size-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">{t("chat.empty_state")}</p>
            </div>
          )}

          {displayMessages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0",
                message.role === "user" ? "bg-purple-100" : "bg-pink-100"
              )}>
                {message.role === "user" ? <User className="size-4 text-purple-600" /> : <Sparkles className="size-4 text-pink-600" />}
              </div>

              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                message.role === "user" 
                  ? "bg-purple-600 text-white rounded-tr-none" 
                  : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
              )}>
                <div className="prose prose-sm max-w-none break-words dark:prose-invert">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && displayMessages.length > 0 && displayMessages[displayMessages.length - 1].role === "assistant" && (
            <ChatUpsell assistantMessage={displayMessages[displayMessages.length - 1].content} />
          )}

          {isLoading && (
            <div className="flex gap-3 animate-pulse">
              <div className="size-8 rounded-full bg-pink-50 flex items-center justify-center">
                <Loader2 className="size-4 text-pink-400 animate-spin" />
              </div>
              <div className="bg-gray-50 h-10 w-24 rounded-2xl border border-gray-100" />
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50/50">
        <div className="flex gap-2 items-end bg-white border rounded-xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
            placeholder={t("chat.placeholder")}
            className="flex-1 min-h-[40px] max-h-32 border-none focus-visible:ring-0 resize-none bg-transparent"
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 size-10 rounded-lg shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
