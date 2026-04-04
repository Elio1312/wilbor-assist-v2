import { useLocation, useParams } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, Baby, CheckCircle2, AlertCircle, Utensils, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

export default function RecipeDetail() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const { slug } = useParams();

  const { data: recipe, isLoading, error } = trpc.recipes.getRecipe.useQuery({
    slug: slug || ""
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-64 w-full" />
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Receita não encontrada</h2>
        <p className="text-slate-500 mb-8">O conteúdo que você procura pode ter sido movido ou não existe.</p>
        <Button onClick={() => setLocation(localePath("/recipes"))}>Voltar para Receitas</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-80 md:h-96">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => setLocation(localePath("/recipes"))}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-8 left-6 right-6">
          <Badge className="bg-purple-600 text-white border-none mb-3">
            {recipe.minAgeMonths}+ meses
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {recipe.title}
          </h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Quick Info */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-8">
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase">30 min</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center gap-1">
            <Utensils className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase">{recipe.category}</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col items-center gap-1">
            <Heart className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-bold text-slate-600 uppercase">Nutritivo</span>
          </div>
        </div>

        {/* Ingredients */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
            Ingredientes
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-700 font-medium">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            Modo de Preparo
          </h2>
          <div className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <ReactMarkdown>{step}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nutritional Benefits / Safety */}
        <section className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
          <h2 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Dicas de Segurança e Nutrição
          </h2>
          <p className="text-amber-800 text-sm leading-relaxed">
            {recipe.nutritionalBenefits}
          </p>
        </section>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-slate-500 mb-4">Gostou desta receita? Compartilhe com outras mães!</p>
          <Button 
            variant="outline" 
            className="rounded-full px-8"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copiado!");
            }}
          >
            Copiar Link da Receita
          </Button>
        </div>
      </main>
    </div>
  );
}
