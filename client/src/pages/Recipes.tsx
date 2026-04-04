import { useState } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { trpc } from "@/lib/trpc";
import { Heart, ArrowLeft, Utensils, Lock, ChevronRight, Filter, Clock, Baby, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Recipes() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const [ageFilter, setAgeFilter] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: recipes, isLoading } = trpc.recipes.getRecipes.useQuery({
    ageMonths: ageFilter
  });

  const filteredRecipes = recipes?.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ages = [
    { label: "Todos", value: undefined },
    { label: "6 meses", value: 6 },
    { label: "9 meses", value: 9 },
    { label: "12+ meses", value: 12 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
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

        {/* Busca e Filtros */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Buscar por ingrediente ou nome..."
              className="pl-10 bg-white border-slate-200 rounded-xl h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            {ages.map((age) => (
              <Button
                key={age.label}
                variant={ageFilter === age.value ? "default" : "outline"}
                size="sm"
                onClick={() => setAgeFilter(age.value)}
                className={`rounded-full whitespace-nowrap ${ageFilter === age.value ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              >
                {age.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecipes?.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                onClick={() => !recipe.locked && setLocation(localePath(`/recipes/${recipe.slug}`))}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {recipe.locked && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                      <Lock className="w-8 h-8 mb-2" />
                      <p className="font-bold text-sm uppercase tracking-wider">Conteúdo Premium</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700 flex items-center gap-1 shadow-sm">
                    <Baby className="w-3 h-3" />
                    {recipe.minAgeMonths}+ meses
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      30 min
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-green-50 text-green-600 border-none text-[10px] uppercase">
                        Nutritivo
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 italic">
                    "{recipe.description}"
                  </p>

                  <div className="mt-auto">
                    {recipe.locked ? (
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-12 shadow-lg shadow-purple-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(localePath("/checkout"));
                        }}
                      >
                        Desbloquear Receita
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full border-slate-200 text-slate-900 font-bold rounded-xl h-12 hover:bg-slate-50"
                      >
                        Ver Preparo
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredRecipes?.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Nenhuma receita encontrada</h3>
            <p className="text-slate-500">Tente mudar os filtros ou o termo de busca.</p>
          </div>
        )}

        {/* Banner de Upsell */}
        <div className="mt-12 p-8 bg-white border-2 border-dashed border-purple-100 rounded-3xl text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Quer o Guia Completo?</h3>
          <p className="text-slate-500 mb-6">Assine o Wilbor Premium e acesse todas as 55+ receitas originais, trilhas de desenvolvimento e suporte prioritário.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 h-12" onClick={() => setLocation(localePath("/checkout"))}>
            Ver Planos Premium
          </Button>
        </div>
      </main>
    </div>
  );
}
