import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Download } from "lucide-react";
import { useI18n } from "@/contexts/i18n";

export function EbookCard({ ebook, onBuy, isPurchased = false }: { 
  ebook: any, 
  onBuy?: (id: string) => void,
  isPurchased?: boolean 
}) {
  const { locale, t } = useI18n();

  // Seleção de Preço Dinâmico (ROI Global)
  const price = locale === 'pt' ? `R$ ${ebook.priceBrl / 100}` : 
                locale === 'en' ? `$ ${ebook.priceUsd / 100}` : 
                `€ ${ebook.priceEur / 100}`;

  const title = locale === 'en' ? (ebook.titleEn || ebook.titlePt) : locale === 'es' ? (ebook.titleEs || ebook.titlePt) : ebook.titlePt;

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all border-none bg-white">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={ebook.coverImage} 
          alt={title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-slate-700">{ebook.rating || "5.0"}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-slate-900 leading-tight line-clamp-2 h-10">{title}</h3>
        
        {!isPurchased ? (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-black text-purple-600">{price}</span>
            <Button 
              onClick={() => onBuy?.(ebook.id)}
              className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
            >
              {t("shop.buy_now") || "Comprar Agora"}
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
            onClick={() => window.open(ebook.pdfUrl, '_blank')}
          >
            <Download className="size-4" /> {t("shop.download_pdf") || "Baixar PDF"}
          </Button>
        )}
      </div>
    </Card>
  );
}
