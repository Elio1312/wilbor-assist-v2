import { useLocation, useParams } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, Baby, CheckCircle2, AlertCircle, Utensils, Heart, ShieldAlert } from "lucide-react";
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

  if (isLoading) return <RecipeSkeleton />;

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="size-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("common.not_found")}</h2>
        <Button onClick={() => setLocation(localePath("/recipes"))}>{t("common.back")}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image e Navegação */}
      <div className="relative h-80 md:h-96">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <button 
          onClick={() => setLocation(localePath("/recipes"))}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="absolute bottom-8 left-6 right-6">
          <Badge className="bg-purple-600 text-white mb-3 border-none uppercase text-[10px] tracking-widest font-bold">
            {recipe.minAgeMonths}+ meses
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{recipe.title}</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Alerta Crítico de Segurança (Diferencial Wilbor) */}
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex gap-3 items-start">
          <ShieldAlert className="size-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-red-900">{recipe.nutritionalBenefits}</p>
        </div>

        {/* Info Rápida */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-10 text-center">
          <div className="space-y-1">
            <Clock className="size-5 text-slate-400 mx-auto" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">30 min</p>
          </div>
          <div className="space-y-1 border-x border-slate-200">
            <Utensils className="size-5 text-slate-400 mx-auto" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">{recipe.category}</p>
          </div>
          <div className="space-y-1">
            <Heart className="size-5 text-purple-500 mx-auto" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">Nutritivo</p>
          </div>
        </div>

        {/* Ingredientes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-600 rounded-full" /> Ingredientes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-3">
                <div className="size-2 bg-purple-400 rounded-full" /> {ing}
              </div>
            ))}
          </div>
        </section>

        {/* Preparo */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full" /> Modo de Preparo
          </h2>
          <div className="space-y-8">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="prose prose-slate prose-sm max-w-none text-slate-600">
                  <ReactMarkdown>{step}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function RecipeSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Skeleton className="h-80 w-full" />
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
