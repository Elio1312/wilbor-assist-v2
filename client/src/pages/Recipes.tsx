import { useState } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { trpc } from "@/lib/trpc";
import { Heart, ArrowLeft, Utensils, Lock, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Recipes() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const [ageFilter, setAgeFilter] = useState<number | undefined>(undefined);

  const { data: recipes, isLoading } = trpc.recipes.getRecipes.useQuery({
    ageMonths: ageFilter
  });

  const ages = [
    { label: "Todos", value: undefined },
    { label: "6 meses", value: 6 },
    { label: "9 meses", value: 9 },
    { label: "12+ meses", value: 12 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation(localePath("/dashboard"))}>
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-xl text-slate-900">Receitas Wilbor</span>
          </div>
          <Heart className="w-6 h-6 text-purple-600 fill-purple-600" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Guia de Alimentação</h1>
          <p className="text-slate-500">Receitas saudáveis e seguras baseadas na idade do seu bebê.</p>
        </div>

        {/* Filtros de Idade */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {ages.map((age) => (
            <Button
              key={age.label}
              variant={ageFilter === age.value ? "default" : "outline"}
              size="sm"
              onClick={() => setAgeFilter(age.value)}
              className="rounded-full whitespace-nowrap"
            >
              {age.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recipes?.map((recipe) => (
              <Card 
                key={recipe.id} 
                className={`overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col ${recipe.locked ? 'opacity-80' : ''}`}
                onClick={() => !recipe.locked && setLocation(localePath(`/recipes/${recipe.slug}`))}
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-none">
                      {recipe.minAgeMonths}+ meses
                    </Badge>
                    {recipe.locked && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 gap-1">
                        <Lock className="w-3 h-3" /> Premium
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    {recipe.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                    {recipe.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {recipe.category}
                    </span>
                    {recipe.locked ? (
                      <Button size="sm" variant="ghost" className="text-purple-600 font-bold" onClick={(e) => {
                        e.stopPropagation();
                        setLocation(localePath("/checkout"));
                      }}>
                        Desbloquear →
                      </Button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Banner de Upsell se não houver receitas ou para incentivar */}
        <div className="mt-12 p-8 bg-white border-2 border-dashed border-purple-100 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Quer o Guia Completo?</h3>
          <p className="text-slate-500 mb-6">Assine o Wilbor Premium e acesse todas as 55+ receitas, trilhas de desenvolvimento e suporte prioritário.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-8" onClick={() => setLocation(localePath("/checkout"))}>
            Ver Planos Premium
          </Button>
        </div>
      </main>
    </div>
  );
}
