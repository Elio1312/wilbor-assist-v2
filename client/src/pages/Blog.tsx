import { useEffect } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";
import {
  Heart,
  Clock,
  BookOpen,
  Moon,
  Thermometer,
  UtensilsCrossed,
  Syringe,
  Baby,
  ShieldCheck,
  TrendingUp,
  Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  applyBlogDocumentSeo,
  getBlogArticles,
  getBlogListingSeo,
  type BlogLocale,
} from "@/lib/blogContent";

const SUPPORTED_BLOG_LOCALES: BlogLocale[] = ["pt", "en", "es", "fr", "de"];

function toBlogLocale(locale: string): BlogLocale {
  return SUPPORTED_BLOG_LOCALES.includes(locale as BlogLocale) ? (locale as BlogLocale) : "pt";
}

function getCategoryIcon(category: string) {
  const icons: Record<string, JSX.Element> = {
    sono: <Moon className="w-5 h-5 text-blue-500" />,
    colica: <Baby className="w-5 h-5 text-pink-500" />,
    alimentacao: <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
    febre: <Thermometer className="w-5 h-5 text-red-500" />,
    vacinas: <Syringe className="w-5 h-5 text-purple-500" />,
    seguranca: <ShieldCheck className="w-5 h-5 text-green-500" />,
    saltos: <TrendingUp className="w-5 h-5 text-indigo-500" />,
    higiene: <Bath className="w-5 h-5 text-cyan-500" />,
    saude: <Heart className="w-5 h-5 text-rose-500" />,
    geral: <BookOpen className="w-5 h-5 text-gray-500" />,
  };

  return icons[category] || icons.geral;
}

function formatCategoryLabel(category: string) {
  return category.replace(/[-_]/g, " ");
}

export default function Blog() {
  const { t, locale, localePath } = useI18n();
  const [, setLocation] = useLocation();

  const blogLocale = toBlogLocale(locale);
  const articles = getBlogArticles(blogLocale);
  const seo = getBlogListingSeo(blogLocale);

  useEffect(() => {
    applyBlogDocumentSeo(seo);
  }, [seo]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation(localePath("/"))}>
            <Heart className="w-6 h-6 text-purple-600 fill-purple-600" />
            <span className="font-bold text-xl">Wilbor Blog</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation(localePath("/dashboard"))}>
            {t("nav.dashboard")}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t("blog.h1")}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">{t("blog.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Card
              key={`${article.locale}-${article.slug}`}
              className="overflow-hidden hover:shadow-xl transition-all border-none shadow-sm flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  {getCategoryIcon(article.category)}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {formatCategoryLabel(article.category)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{article.title}</h2>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6">{article.description}</p>
                <div className="flex items-center justify-between mt-auto gap-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Clock className="w-4 h-4" /> {article.readTimeLabel}
                  </div>
                  <Button
                    variant="link"
                    className="text-purple-600 p-0 text-right whitespace-normal"
                    onClick={() => setLocation(localePath(`/blog/${article.slug}`))}
                  >
                    {t("blog.read_article")} →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
