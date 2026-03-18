import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

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
        ✓ Obrigada pelo feedback!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
      <span className="text-sm text-gray-600">Isso foi útil?</span>
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
        Sim
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
        Não
      </Button>
    </div>
  );
}
