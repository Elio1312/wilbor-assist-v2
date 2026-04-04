import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { useLocation } from "wouter";

export function ChatUpsell({ assistantMessage }: { assistantMessage: string }) {
  const { localePath, locale } = useI18n();
  const [, setLocation] = useLocation();

  const { data: ebook, isLoading } = trpc.wilbor.getRecommendedEbook.useQuery(
    { lastAssistantMessage: assistantMessage },
    { enabled: !!assistantMessage, staleTime: 1000 * 60 * 5 } // Cache de 5min
  );

  if (isLoading || !ebook) return null;

  const title = locale === 'en' ? (ebook.titleEn || ebook.titlePt) : locale === 'es' ? (ebook.titleEs || ebook.titlePt) : ebook.titlePt;

  return (
    <div className="px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 p-4 shadow-sm overflow-hidden relative group">
        {/* Efeito Visual de Brilho */}
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Sparkles className="size-20 text-purple-600" />
        </div>

        <div className="flex gap-4 items-center">
          <img 
            src={ebook.coverImage} 
            className="w-16 h-20 object-cover rounded shadow-md border border-white"
            alt={title}
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 uppercase tracking-tighter">
              <Star className="size-3 fill-purple-600" /> Recomendação Wilbor
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              Aprofunde este assunto com o guia: {title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1">
              Soluções práticas para sua paz e o bem-estar do seu bebê.
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={() => setLocation(localePath(`/shop`))}
            className="bg-purple-600 hover:bg-purple-700 rounded-full shrink-0 gap-1"
          >
            Conhecer <ArrowRight className="size-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
