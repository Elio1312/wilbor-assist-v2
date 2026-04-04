import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { Heart, ArrowLeft, Clock, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogArticlesData } from "../../../server/blogArticles"; // Fonte única da verdade
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";

export default function BlogArticle() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { t, localePath } = useI18n();

  // 1. Busca dinâmica do artigo (Elimina erro de Console)
  const article = blogArticlesData.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) {
      toast.error(t("common.not_found"));
      setLocation(localePath("/blog"));
      return;
    }
    // Injeção de SEO dinâmica (ROI de Tráfego)
    document.title = `${article.title} | Wilbor-Assist`;
  }, [article, setLocation, t, localePath]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("blog.link_copied"));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header de Leitura */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setLocation(localePath("/blog"))} className="gap-2">
            <ArrowLeft className="size-4" /> {t("common.back")}
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="size-5 text-purple-600 fill-purple-600" />
            <span className="font-bold text-slate-900">Wilbor</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="size-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Metadados do Artigo */}
        <div className="mb-8">
          <span className="text-purple-600 font-bold text-xs uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-slate-400 text-sm border-y py-4 border-slate-100">
            <div className="flex items-center gap-2"><Clock className="size-4" /> {article.readTimeMinutes} min</div>
            <div className="flex items-center gap-2"><Calendar className="size-4" /> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Conteúdo Renderizado (Transforma Markdown em HTML limpo) */}
        <article className="prose prose-purple max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-800">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* CTA de Conversão no Final do Artigo */}
        <div className="mt-16 p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">{t("blog.article_cta_h3")}</h3>
          <p className="mb-8 text-purple-100">{t("blog.article_cta_desc")}</p>
          <Button 
            size="lg" 
            onClick={() => setLocation(localePath("/chat"))}
            className="bg-white text-purple-600 hover:bg-purple-50 font-bold rounded-full px-8 h-14"
          >
            {t("nav.try_free")}
          </Button>
        </div>
      </main>
    </div>
  );
}
