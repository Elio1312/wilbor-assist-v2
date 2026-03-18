import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function Blog() {
  const [, navigate] = useLocation();
  const { data: articles, isLoading } = trpc.blog.getArticles.useQuery();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog Wilbor</h1>
          <p className="text-lg text-purple-100">
            Artigos baseados em protocolos SBP, OMS e AAP para ajudar você a cuidar do seu bebê
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-24" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((article) => (
              <Card
                key={article.slug}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/blog/${article.slug}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className={categoryColors[article.category as keyof typeof categoryColors]}>
                    {categoryLabels[article.category as keyof typeof categoryLabels]}
                  </Badge>
                  <span className="text-sm text-gray-500">{article.readTimeMinutes} min</span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blog/${article.slug}`);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  Ler Artigo
                </Button>
              </Card>
            ))}
          </div>
        )}

        {articles && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum artigo disponível no momento</p>
          </div>
        )}
      </div>

      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog Wilbor",
          "description": "Artigos sobre cuidados com bebês baseados em protocolos médicos",
          "url": "https://wilborassist.com/blog",
        })}
      </script>
    </div>
  );
}
