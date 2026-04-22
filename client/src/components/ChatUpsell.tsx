import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { useLocation } from "wouter";

interface Ebook {
  titlePt: string;
  titleEn: string;
  titleEs: string;
  description: string;
  imageUrl: string;
}

export function ChatUpsell({ assistantMessage }: { assistantMessage: string }) {
  const { localePath, locale } = useI18n();
  const [, setLocation] = useLocation();

  // TODO: Implementar getRecommendedEbook no servidor quando necessário
  // const { data: ebook, isLoading } = trpc.wilbor.getRecommendedEbook.useQuery(...)

  // Mock ebook para demonstração (remover quando API estiver pronta)
  const ebook: Ebook | undefined = undefined;

  // Render null if no ebook (disabled for now)
  if (!ebook) {
    return null;
  }

  const ebookData = ebook as Ebook;
  const title = locale === 'en'
    ? (ebookData.titleEn || ebookData.titlePt)
    : locale === 'es'
    ? (ebookData.titleEs || ebookData.titlePt)
    : ebookData.titlePt;

  return (
    <div className="px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 p-4 shadow-sm overflow-hidden relative group">
        {/* Efeito Visual de Brilho */}
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Sparkles className="size-20 text-purple-600" />
        </div>

        <div className="flex gap-4 items-center">
          <img
            src={ebookData.imageUrl}
            alt={title}
            className="w-16 h-16 object-cover rounded-lg shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <Star className="size-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-purple-600 font-medium">Recomendado para você</span>
            </div>
            <h4 className="font-semibold text-sm text-gray-900 truncate">{title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{ebookData.description}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 shrink-0"
            onClick={() => setLocation("/buy-credits")}
          >
            Ver mais
            <ArrowRight className="size-3 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
