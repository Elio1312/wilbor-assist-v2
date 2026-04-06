import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { BookOpen, Loader2, Download, ShoppingBag, ArrowRight } from "lucide-react";
import { useSearch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyEbooks() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  // Polling após checkout para aguardar webhook
  const cameFromCheckout = params.get("from") === "checkout";
  const [pollingActive, setPollingActive] = useState(cameFromCheckout);

  const { data: myPurchases, isLoading } = trpc.shop.myPurchases.useQuery(undefined, {
    refetchInterval: pollingActive ? 3000 : false,
  });

  useEffect(() => {
    if (!pollingActive) return;
    if (myPurchases && myPurchases.length > 0) {
      setPollingActive(false);
      return;
    }
    const timeout = setTimeout(() => setPollingActive(false), 15000);
    return () => clearTimeout(timeout);
  }, [myPurchases, pollingActive]);

  const categoryEmoji: Record<string, string> = {
    sleep: "😴", colic: "🍼", sexuality: "💕",
  };

  const langEmoji: Record<string, string> = {
    pt: "🇧🇷", en: "🇺🇸", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
            <BookOpen className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meus E-books</h1>
            <p className="text-slate-500">Sua biblioteca de apoio Wilbor</p>
          </div>
        </header>

        {/* Indicador de polling */}
        {pollingActive && (
          <div className="mb-6 flex items-center gap-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl px-5 py-3 text-sm font-medium">
            <Loader2 className="size-4 animate-spin" />
            <span>Confirmando seu pagamento com o Stripe... Isso leva apenas alguns segundos.</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 w-full bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !myPurchases || myPurchases.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <ShoppingBag className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium mb-2">Nenhum e-book ainda</p>
            <p className="text-slate-400 text-sm mb-6">Explore nossa loja e encontre o guia certo para você.</p>
            <Button
              onClick={() => setLocation(localePath("/shop"))}
              className="bg-purple-600 hover:bg-purple-700 rounded-full gap-2"
            >
              <ShoppingBag className="size-4" /> Ver Loja <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPurchases.map((item: any) => (
              <Card key={item.id} className="overflow-hidden border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
                {/* Cover */}
                <div className={`relative h-36 flex items-center justify-center ${
                  item.category === "sleep" ? "bg-gradient-to-br from-blue-100 to-indigo-200" :
                  item.category === "colic" ? "bg-gradient-to-br from-amber-100 to-orange-200" :
                  "bg-gradient-to-br from-pink-100 to-rose-200"
                }`}>
                  <BookOpen className="size-14 opacity-25 text-slate-600" />
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {langEmoji[item.lang] || "🌍"} {item.lang?.toUpperCase()}
                  </div>
                  <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                    ✓ Comprado
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">
                      {categoryEmoji[item.category]} {item.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight mt-1">{item.title}</h3>
                  </div>

                  <Button
                    className="w-full gap-2 bg-purple-600 hover:bg-purple-700 rounded-xl"
                    onClick={() => window.open(item.pdfUrl, "_blank")}
                  >
                    <Download className="size-4" /> Baixar PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Wilbor Premium */}
        {myPurchases && myPurchases.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
            <p className="font-bold text-lg mb-1">💬 Tem mais dúvidas?</p>
            <p className="text-purple-200 text-sm mb-4">O Wilbor responde qualquer pergunta sobre seu bebê em segundos.</p>
            <Button
              onClick={() => setLocation(localePath("/chat"))}
              className="bg-white text-purple-700 hover:bg-purple-50 rounded-full font-bold gap-2"
            >
              Perguntar ao Wilbor <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
