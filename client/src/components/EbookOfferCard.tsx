/**
 * EbookOfferCard.tsx
 * Card de oferta contextual de ebook — exibido APÓS a resposta útil do Wilbor
 * Regra do Mentor: só aparece depois que a mãe recebeu valor gratuito
 */
import { useState } from "react";
import { ShoppingBag, X, BookOpen, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

type EbookOffer = {
  intent: "sleep" | "colic" | "sexuality";
  ebookId: string;
  title: string;
  teaser: string;
  ctaLabel: string;
  shopUrl: string;
};

const INTENT_CONFIG = {
  sleep: {
    emoji: "😴",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
    label: "Sono do Bebê",
  },
  colic: {
    emoji: "🍼",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    btn: "bg-amber-600 hover:bg-amber-700",
    label: "Cólicas & Saúde",
  },
  sexuality: {
    emoji: "💕",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    btn: "bg-pink-600 hover:bg-pink-700",
    label: "Vida Íntima",
  },
};

// Renderiza markdown simples (negrito)
function SimpleMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function EbookOfferCard({ offer }: { offer: EbookOffer }) {
  const [dismissed, setDismissed] = useState(false);
  const [, setLocation] = useLocation();

  if (dismissed) return null;

  const config = INTENT_CONFIG[offer.intent] || INTENT_CONFIG.sleep;

  const handleCTA = () => {
    // Navega para a loja com highlight no ebook específico
    setLocation(`/shop?highlight=${offer.ebookId}`);
  };

  return (
    <div
      className={`relative mt-3 rounded-2xl border bg-gradient-to-br ${config.bg} ${config.border} p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {/* Botão fechar */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Fechar"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        {/* Ícone */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${config.badge}`}>
          {config.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge de categoria */}
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${config.badge}`}>
            <BookOpen className="size-3" />
            {config.label}
          </span>

          {/* Teaser copy (Gemini) */}
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            <SimpleMarkdown text={offer.teaser} />
          </p>

          {/* CTA */}
          <button
            onClick={handleCTA}
            className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${config.btn}`}
          >
            <ShoppingBag className="size-4" />
            {offer.ctaLabel}
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
