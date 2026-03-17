import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, BookOpen, TrendingUp, Users, Utensils } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Wilbor-Assist</h1>
            </div>
            <Button onClick={() => (window.location.href = getLoginUrl())}>
              Entrar
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seu bebê não para de chorar. O Google só aumenta o pânico.
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Pergunte agora. Resposta imediata. Na maioria das vezes, é mais simples do que parece.
            </p>
            <div className="flex gap-4 justify-center mb-16">
              <Button size="lg" onClick={() => (window.location.href = getLoginUrl())}>
                Testar Grátis
              </Button>
              <Button size="lg" variant="outline">
                Saiba Mais
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Chat 24h com IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tire dúvidas em segundos com uma assistente que conhece seu bebê
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-pink-600 mb-2" />
                <CardTitle>Trilha de Desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe os marcos semana a semana com base em Wonder Weeks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Utensils className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Receitas por Idade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  50+ receitas com fotos para cada fase da introdução alimentar
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Wilbor-Assist</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Olá, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="babies">Meus Bebês</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Chat com IA
                  </CardTitle>
                  <CardDescription>Converse com Wilbor 24 horas por dia</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Tire suas dúvidas sobre sono, cólica, alimentação e desenvolvimento do seu bebê.
                  </p>
                  <Button className="w-full">Iniciar Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-600" />
                    Meus Bebês
                  </CardTitle>
                  <CardDescription>Gerencie os perfis de seus filhos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Cadastre múltiplos bebês e receba orientações personalizadas para cada um.
                  </p>
                  <Button className="w-full">Gerenciar Bebês</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Trilha de Desenvolvimento
                  </CardTitle>
                  <CardDescription>Acompanhe os marcos do seu bebê</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Veja os marcos esperados semana a semana de 0 a 12 meses.
                  </p>
                  <Button className="w-full">Ver Trilha</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-600" />
                    Receitas
                  </CardTitle>
                  <CardDescription>Ideias de refeições por idade</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Acesse 50+ receitas com fotos para cada fase da alimentação.
                  </p>
                  <Button className="w-full">Ver Receitas</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat com Wilbor</CardTitle>
                <CardDescription>Converse com sua assistente neonatal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Selecione um bebê para começar a conversar</p>
                  <Button>Selecionar Bebê</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Babies Tab */}
          <TabsContent value="babies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Bebês</CardTitle>
                <CardDescription>Gerencie os perfis de seus filhos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Você ainda não tem bebês cadastrados</p>
                  <Button>Cadastrar Primeiro Bebê</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trilha de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Acompanhe os marcos esperados para cada semana de vida.
                  </p>
                  <Button variant="outline" className="w-full">Ver Trilha</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Banco de Receitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Explore receitas organizadas por idade e tipo de refeição.
                  </p>
                  <Button variant="outline" className="w-full">Ver Receitas</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meu Corpo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Cuidados pós-parto, exercícios e nutrição para a mãe.
                  </p>
                  <Button variant="outline" className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Planos e Assinatura</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Escolha o plano ideal para suas necessidades.
                  </p>
                  <Button variant="outline" className="w-full">Ver Planos</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
