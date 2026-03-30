import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";

interface FeedbackButtonProps {
  userQuestion: string;
  aiResponse: string;
  conversationId?: number;
  kbId?: number;
}

export function FeedbackButton({
  userQuestion,
  aiResponse,
  conversationId,
  kbId,
}: FeedbackButtonProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const { locale } = useI18n();

  const txt = {
    thanks: locale === "en" ? "✓ Thank you for your feedback!" : locale === "es" ? "✓ ¡Gracias por tu opinión!" : locale === "fr" ? "✓ Merci pour votre retour !" : locale === "de" ? "✓ Danke für Ihr Feedback!" : "✓ Obrigada pelo feedback!",
    helpful: locale === "en" ? "Was this helpful?" : locale === "es" ? "¿Fue útil?" : locale === "fr" ? "Cela vous a-t-il aidé ?" : locale === "de" ? "War das hilfreich?" : "Isso foi útil?",
    yes: locale === "en" ? "Yes" : locale === "es" ? "Sí" : locale === "fr" ? "Oui" : locale === "de" ? "Ja" : "Sim",
    no: locale === "en" ? "No" : locale === "es" ? "No" : locale === "fr" ? "Non" : locale === "de" ? "Nein" : "Não",
  };

  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    },
  });

  const handleFeedback = (helpful: boolean) => {
    setSelectedFeedback(helpful ? "helpful" : "not_helpful");
    submitFeedback.mutate({
      userQuestion,
      aiResponse,
      helpfulness: helpful ? "helpful" : "not_helpful",
      conversationId,
      kbId,
    });
  };

  if (submitted) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        {txt.thanks}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
      <span className="text-sm text-gray-600">{txt.helpful}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(true)}
        disabled={submitFeedback.isPending}
        className={`gap-1 ${
          selectedFeedback === "helpful"
            ? "text-green-600 bg-green-50"
            : "text-gray-500 hover:text-green-600"
        }`}
      >
        <ThumbsUp size={16} />
        {txt.yes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(false)}
        disabled={submitFeedback.isPending}
        className={`gap-1 ${
          selectedFeedback === "not_helpful"
            ? "text-red-600 bg-red-50"
            : "text-gray-500 hover:text-red-600"
        }`}
      >
        <ThumbsDown size={16} />
        {txt.no}
      </Button>
    </div>
  );
}
