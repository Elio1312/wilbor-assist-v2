import { trpc } from "@/lib/trpc";
import { EbookCard } from "@/components/EbookCard";
import { useI18n } from "@/contexts/i18n";
import { BookOpen } from "lucide-react";

export default function MyEbooks() {
  const { t } = useI18n();
  // Esta query busca apenas e-books com status 'completed' em wilborEbookPurchases
  const { data: myPurchases, isLoading } = trpc.shop.getMyPurchasedEbooks.useQuery();

  return (
    <div className="min-h-screen bg-white p-8">
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 w-full bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !myPurchases || myPurchases.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Você ainda não possui e-books em sua biblioteca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myPurchases.map((item) => (
              <EbookCard key={item.ebook.id} ebook={item.ebook} isPurchased={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
