import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { EbookCard } from "@/components/EbookCard";
import { useI18n } from "@/contexts/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPage() {
  const { t } = useI18n();
  const [category, setCategory] = useState<string | undefined>();
  
  const { data: ebooks, isLoading } = trpc.shop.listEbooks.useQuery({ category });
  const checkout = trpc.shop.createEbookCheckout.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; }
  });

  const categories = ["todos", "casamento", "emocoes", "sono", "rotina"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section Acolhedor */}
      <section className="bg-gradient-to-b from-purple-100 to-slate-50 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Soluções rápidas para as maiores dores da maternidade
          </h1>
          <p className="text-lg text-slate-600 italic">
            Guias práticos e acolhedores para você agir com segurança agora.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Filtros de Categoria */}
        <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "todos" ? undefined : cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                (category === cat || (!category && cat === "todos"))
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-slate-500 hover:bg-purple-50"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid de E-books (3 Colunas) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ebooks?.map((ebook) => (
              <EbookCard 
                key={ebook.id} 
                ebook={ebook} 
                onBuy={(id) => checkout.mutate({ ebookId: id })} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
