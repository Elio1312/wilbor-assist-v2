import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Download, ShoppingCart, Globe, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type Currency = "BRL" | "USD" | "EUR" | "GBP";
type LangFilter = "all" | "pt" | "en" | "es" | "fr" | "de";
type CategoryFilter = "all" | "sleep" | "colic" | "sexuality";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const LANG_LABELS: Record<LangFilter, string> = {
  all: "🌍 Todos",
  pt: "🇧🇷 Português",
  en: "🇺🇸 English",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  de: "🇩🇪 Deutsch",
};

const CATEGORY_LABELS: Record<CategoryFilter, { label: string; emoji: string }> = {
  all: { label: "Todos", emoji: "📚" },
  sleep: { label: "Sono do Bebê", emoji: "😴" },
  colic: { label: "Cólicas & Saúde", emoji: "🍼" },
  sexuality: { label: "Vida Íntima", emoji: "💕" },
};

function formatPrice(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const value = (amount / 100).toFixed(2).replace(".", currency === "BRL" ? "," : ".");
  return `${symbol} ${value}`;
}

function EbookCard({
  ebook,
  currency,
  onBuy,
  isPurchased,
  isLoading,
}: {
  ebook: any;
  currency: Currency;
  onBuy: (id: string) => void;
  isPurchased?: boolean;
  isLoading?: boolean;
}) {
  const priceMap: Record<Currency, number> = {
    BRL: ebook.priceBRL,
    USD: ebook.priceUSD,
    EUR: ebook.priceEUR,
    GBP: ebook.priceGBP,
  };

  const langEmoji: Record<string, string> = {
    pt: "🇧🇷", en: "🇺🇸", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪",
  };

  const categoryColor: Record<string, string> = {
    sleep: "bg-blue-100 text-blue-700",
    colic: "bg-amber-100 text-amber-700",
    sexuality: "bg-pink-100 text-pink-700",
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-100 bg-white rounded-2xl flex flex-col">
      {/* Cover placeholder (gradient por categoria) */}
      <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
        ebook.category === "sleep" ? "bg-gradient-to-br from-blue-100 to-indigo-200" :
        ebook.category === "colic" ? "bg-gradient-to-br from-amber-100 to-orange-200" :
        "bg-gradient-to-br from-pink-100 to-rose-200"
      }`}>
        <BookOpen className={`size-20 opacity-30 ${
          ebook.category === "sleep" ? "text-blue-600" :
          ebook.category === "colic" ? "text-amber-600" :
          "text-pink-600"
        }`} />
        {/* Badge de idioma */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
          {langEmoji[ebook.lang] || "🌍"} {ebook.lang?.toUpperCase()}
        </div>
        {/* Badge de categoria */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${categoryColor[ebook.category] || "bg-slate-100 text-slate-700"}`}>
          {CATEGORY_LABELS[ebook.category as CategoryFilter]?.emoji} {CATEGORY_LABELS[ebook.category as CategoryFilter]?.label}
        </div>
        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-slate-700">5.0</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-slate-900 leading-tight text-base">{ebook.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">{ebook.description}</p>

        {!isPurchased ? (
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <span className="text-2xl font-black text-purple-600">
              {formatPrice(priceMap[currency] ?? ebook.priceBRL, currency)}
            </span>
            <Button
              onClick={() => onBuy(ebook.id)}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 rounded-full px-5 gap-2 shadow-md shadow-purple-100"
            >
              <ShoppingCart className="size-4" />
              Comprar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 mt-auto"
          >
            <Download className="size-4" /> Baixar PDF
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function ShopPage() {
  const { t, localePath } = useI18n();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [lang, setLang] = useState<LangFilter>("all");
  const [currency, setCurrency] = useState<Currency>("BRL");

  const { data: ebooks, isLoading } = trpc.shop.listEbooks.useQuery({
    category: category === "all" ? "all" : category,
    lang: lang === "all" ? "all" : lang,
  });

  const checkout = trpc.shop.createEbookCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err) => {
      if (err.message.includes("já possui")) {
        alert("Você já possui este ebook! Acesse em 'Meus E-books'.");
      } else if (!isAuthenticated) {
        window.location.href = getLoginUrl();
      } else {
        alert("Erro ao processar pagamento. Tente novamente.");
      }
    },
  });

  const handleBuy = (ebookId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    checkout.mutate({ ebookId, currency });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-purple-50 via-white to-slate-50 pt-16 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <Badge className="bg-purple-100 text-purple-700 border-none px-4 py-1 text-sm font-semibold">
            <Sparkles className="size-3 mr-1" /> Guias práticos baseados em ciência
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Soluções rápidas para as maiores dores da maternidade
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Cada guia foi criado para você agir com segurança <strong>agora</strong> — sem precisar pesquisar por horas.
          </p>
          {/* CTA Premium */}
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-5 max-w-md mx-auto shadow-xl shadow-purple-100">
            <p className="font-bold text-lg mb-1">💬 Prefere respostas instantâneas?</p>
            <p className="text-purple-100 text-sm mb-3">O Wilbor Premium responde qualquer dúvida 24h, em segundos.</p>
            <Button
              onClick={() => setLocation(localePath("/chat"))}
              className="bg-white text-purple-700 hover:bg-purple-50 rounded-full font-bold gap-2"
            >
              Experimentar Grátis <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ─── Filtros ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Filtro de Categoria */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  category === cat
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
                }`}
              >
                {CATEGORY_LABELS[cat].emoji} {CATEGORY_LABELS[cat].label}
              </button>
            ))}
          </div>

          {/* Filtro de Idioma */}
          <div className="flex gap-2 flex-wrap md:ml-auto">
            <Globe className="size-4 text-slate-400 self-center" />
            {(Object.keys(LANG_LABELS) as LangFilter[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  lang === l
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de Moeda */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-slate-500 font-medium">Moeda:</span>
          {(["BRL", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                currency === c
                  ? "bg-purple-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-purple-50"
              }`}
            >
              {CURRENCY_SYMBOLS[c]} {c}
            </button>
          ))}
        </div>

        {/* ─── Grid de E-books ──────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        ) : !ebooks || ebooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">Nenhum ebook encontrado para este filtro.</p>
            <button
              onClick={() => { setCategory("all"); setLang("all"); }}
              className="mt-4 text-purple-600 font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                currency={currency}
                onBuy={handleBuy}
                isLoading={checkout.isPending}
              />
            ))}
          </div>
        )}

        {/* ─── Banner CTA Wilbor Premium ────────────────────────────────────────── */}
        <div className="mt-16 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-8 text-white text-center shadow-2xl">
          <h2 className="text-2xl font-black mb-2">🌟 Quer mais do que um guia?</h2>
          <p className="text-purple-200 mb-6 max-w-lg mx-auto">
            O Wilbor Premium responde qualquer pergunta sobre seu bebê em segundos — sono, cólica, alimentação, desenvolvimento e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation(localePath("/chat"))}
              className="bg-white text-purple-700 hover:bg-purple-50 rounded-full font-bold px-8 h-12 text-base gap-2"
            >
              <Sparkles className="size-4" /> Experimentar Grátis
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation(localePath("/my-ebooks"))}
              className="border-white/30 text-white hover:bg-white/10 rounded-full font-bold px-8 h-12 text-base gap-2"
            >
              <BookOpen className="size-4" /> Meus E-books
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
