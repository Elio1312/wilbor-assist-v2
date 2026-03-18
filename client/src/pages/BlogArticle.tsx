import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock } from "lucide-react";

export function BlogArticle() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;

  const { data: article, isLoading } = trpc.blog.getArticle.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const categoryLabels: Record<string, string> = {
    sono: "Sono",
    colica: "Cólica",
    febre: "Febre",
    alimentacao: "Alimentação",
    depressao_pos_parto: "Saúde Mental",
    vacinas: "Vacinas",
    amamentacao: "Amamentação",
    seguranca: "Segurança",
    saltos: "Desenvolvimento",
    higiene: "Higiene",
  };

  const categoryColors: Record<string, string> = {
    sono: "bg-blue-100 text-blue-800",
    colica: "bg-pink-100 text-pink-800",
    febre: "bg-red-100 text-red-800",
    alimentacao: "bg-orange-100 text-orange-800",
    depressao_pos_parto: "bg-purple-100 text-purple-800",
    vacinas: "bg-green-100 text-green-800",
    amamentacao: "bg-cyan-100 text-cyan-800",
    seguranca: "bg-yellow-100 text-yellow-800",
    saltos: "bg-indigo-100 text-indigo-800",
    higiene: "bg-teal-100 text-teal-800",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <Button onClick={() => navigate("/blog")}>Voltar ao Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Metadata */}
        <div className="mb-6">
          <Badge className={categoryColors[article.category as keyof typeof categoryColors]}>
            {categoryLabels[article.category as keyof typeof categoryLabels]}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{article.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.readTimeMinutes} minutos de leitura</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {article.content.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("#")) {
              const level = paragraph.match(/^#+/)?.[0].length || 1;
              const text = paragraph.replace(/^#+\s/, "");
              const className = {
                1: "text-3xl font-bold mt-8 mb-4",
                2: "text-2xl font-bold mt-6 mb-3",
                3: "text-xl font-bold mt-4 mb-2",
              }[level] || "text-lg font-bold mt-4 mb-2";
              return (
                <h2 key={i} className={className}>
                  {text}
                </h2>
              );
            }
            if (paragraph.trim() === "") return null;
            return (
              <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
          <h3 className="text-xl font-bold mb-2 text-gray-900">Precisa de ajuda personalizada?</h3>
          <p className="text-gray-600 mb-4">
            Converse com o Wilbor sobre as dúvidas específicas do seu bebê e receba orientações personalizadas.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Conversar com Wilbor
          </Button>
        </div>

        {/* SEO Meta Tags */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.description,
            "author": {
              "@type": "Organization",
              "name": "Wilbor Assist",
            },
            "articleBody": article.content,
            "keywords": article.seoKeywords,
          })}
        </script>
      </div>
    </div>
  );
}
