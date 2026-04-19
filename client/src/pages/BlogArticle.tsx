import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { Heart, ArrowLeft, Clock, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  applyBlogDocumentSeo,
  buildBlogPath,
  findBlogArticle,
  getBlogArticleSeo,
  type BlogLocale,
} from "@/lib/blogContent";

const SUPPORTED_BLOG_LOCALES: BlogLocale[] = ["pt", "en", "es", "fr", "de"];

function toBlogLocale(locale: string): BlogLocale {
  return SUPPORTED_BLOG_LOCALES.includes(locale as BlogLocale) ? (locale as BlogLocale) : "pt";
}

export default function BlogArticle() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { t, locale, localePath } = useI18n();

  const blogLocale = toBlogLocale(locale);
  const { article, redirectSlug } = findBlogArticle(blogLocale, slug);

  useEffect(() => {
    // Only redirect if article is not found (404 case)
    if (!article && !redirectSlug) {
      toast.error(t("common.not_found"));
      setLocation(localePath("/blog"));
      return;
    }

    // Apply SEO data if we have an article
    if (article) {
      applyBlogDocumentSeo(getBlogArticleSeo(blogLocale, article));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, blogLocale, localePath, setLocation, t]);

  // Show loading state while redirecting, or if article truly doesn't exist
  if (!article) {
    return null;
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t("blog.link_copied"));
  };

  return (
    <div className="min-h-screen bg-white">
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
        <div className="mb-8">
          <span className="text-purple-600 font-bold text-xs uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
            {article.category.replace(/[-_]/g, " ")}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-slate-400 text-sm border-y py-4 border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="size-4" /> {article.readTimeLabel}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" /> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <article className="prose prose-purple max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-800">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

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
