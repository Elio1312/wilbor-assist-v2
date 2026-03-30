import { useState, useEffect } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { FeedbackButton } from "@/components/FeedbackButton";
import { SOSButton } from "@/components/SOSButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, LogOut, Settings } from "lucide-react";
import { useRouter } from "wouter";
import { useI18n } from "@/contexts/i18n";

export default function Dashboard() {
  // Prevent Google from indexing private/auth-required pages
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locale } = useI18n();

  // Textos por idioma
  const txt = {
    welcome: locale === "en" ? "Welcome to Wilbor" : locale === "es" ? "Bienvenida a Wilbor" : locale === "fr" ? "Bienvenue sur Wilbor" : locale === "de" ? "Willkommen bei Wilbor" : "Bem-vinda ao Wilbor",
    welcomeDesc: locale === "en" ? "Log in to start receiving personalized support for you and your baby" : locale === "es" ? "Inicia sesión para recibir apoyo personalizado para ti y tu bebé" : locale === "fr" ? "Connectez-vous pour recevoir un soutien personnalisé pour vous et votre bébé" : locale === "de" ? "Melden Sie sich an, um persönliche Unterstützung für Sie und Ihr Baby zu erhalten" : "Faça login para começar a receber apoio personalizado para você e seu bebê",
    backHome: locale === "en" ? "Back to Home" : locale === "es" ? "Volver al inicio" : locale === "fr" ? "Retour à l'accueil" : locale === "de" ? "Zurück zur Startseite" : "Voltar à Home",
    subtitle: locale === "en" ? "Your 24h maternity companion" : locale === "es" ? "Tu compañera de maternidad 24h" : locale === "fr" ? "Votre accompagnatrice maternité 24h/24" : locale === "de" ? "Ihre 24h-Mutterschaftsbegleiterin" : "Sua companheira de maternidade 24h",
    messages: locale === "en" ? "messages" : locale === "es" ? "mensajes" : locale === "fr" ? "messages" : locale === "de" ? "Nachrichten" : "mensagens",
    plan: locale === "en" ? "Plan" : locale === "es" ? "Plan" : locale === "fr" ? "Abonnement" : locale === "de" ? "Plan" : "Plano",
    settings: locale === "en" ? "Settings" : locale === "es" ? "Configuración" : locale === "fr" ? "Paramètres" : locale === "de" ? "Einstellungen" : "Configurações",
    logout: locale === "en" ? "Log out" : locale === "es" ? "Salir" : locale === "fr" ? "Déconnexion" : locale === "de" ? "Abmelden" : "Sair",
    monthlyUsage: locale === "en" ? "Your usage this month" : locale === "es" ? "Tu uso este mes" : locale === "fr" ? "Votre utilisation ce mois" : locale === "de" ? "Ihre Nutzung diesen Monat" : "Seu uso este mês",
    used: locale === "en" ? "Questions used" : locale === "es" ? "Preguntas usadas" : locale === "fr" ? "Questions utilisées" : locale === "de" ? "Verwendete Fragen" : "Perguntas usadas",
    available: locale === "en" ? "Available" : locale === "es" ? "Disponible" : locale === "fr" ? "Disponible" : locale === "de" ? "Verfügbar" : "Disponível",
    limitReached: locale === "en" ? "You've reached your plan limit" : locale === "es" ? "Has alcanzado el límite de tu plan" : locale === "fr" ? "Vous avez atteint la limite de votre abonnement" : locale === "de" ? "Sie haben Ihr Planlimit erreicht" : "Você chegou ao limite do seu plano",
    limitDesc: locale === "en" ? "Continue receiving guidance at any time" : locale === "es" ? "Continúa recibiendo orientación en cualquier momento" : locale === "fr" ? "Continuez à recevoir des conseils à tout moment" : locale === "de" ? "Erhalten Sie weiterhin jederzeit Unterstützung" : "Continue recebendo orientação a qualquer momento",
    upgradeBtn: locale === "en" ? "Continue receiving answers" : locale === "es" ? "Seguir recibiendo respuestas" : locale === "fr" ? "Continuer à recevoir des réponses" : locale === "de" ? "Weiterhin Antworten erhalten" : "Continuar recebendo respostas",
    quickLinks: locale === "en" ? "Quick Links" : locale === "es" ? "Accesos rápidos" : locale === "fr" ? "Liens rapides" : locale === "de" ? "Schnellzugriff" : "Links Rápidos",
    myBabies: locale === "en" ? "My Babies" : locale === "es" ? "Mis Bebés" : locale === "fr" ? "Mes Bébés" : locale === "de" ? "Meine Babys" : "Meus Bebês",
    recipes: locale === "en" ? "Recipes" : locale === "es" ? "Recetas" : locale === "fr" ? "Recettes" : locale === "de" ? "Rezepte" : "Receitas",
    tipsTitle: locale === "en" ? "Tips & Guidance" : locale === "es" ? "Consejos y orientación" : locale === "fr" ? "Conseils et orientations" : locale === "de" ? "Tipps und Ratschläge" : "Dicas e orientações",
    tipsDesc: locale === "en" ? "Understand what's happening with your baby and know how to act safely." : locale === "es" ? "Entiende lo que le pasa a tu bebé y sabe cómo actuar con seguridad." : locale === "fr" ? "Comprenez ce qui se passe avec votre bébé et sachez comment agir en toute sécurité." : locale === "de" ? "Verstehen Sie, was mit Ihrem Baby passiert, und wissen Sie, wie Sie sicher handeln können." : "Entenda o que está acontecendo com seu bebê e saiba como agir com segurança.",
    goToBlog: locale === "en" ? "Go to Blog" : locale === "es" ? "Ir al Blog" : locale === "fr" ? "Aller au Blog" : locale === "de" ? "Zum Blog" : "Ir para Blog",
    chatPlaceholder: locale === "en" ? "What's happening with your baby right now?" : locale === "es" ? "¿Qué está pasando con tu bebé ahora?" : locale === "fr" ? "Que se passe-t-il avec votre bébé en ce moment ?" : locale === "de" ? "Was passiert gerade mit Ihrem Baby?" : "O que está acontecendo com seu bebê agora?",
    chatWelcome: locale === "en" ? "Hello! I'm Wilbor. I'm here to help you with your baby at any time — without judgment, with care. What's happening right now?" : locale === "es" ? "¡Hola! Soy Wilbor. Estoy aquí para ayudarte con tu bebé en cualquier momento — sin juicios, con cariño. ¿Qué está pasando ahora?" : locale === "fr" ? "Bonjour ! Je suis Wilbor. Je suis là pour vous aider avec votre bébé à tout moment — sans jugement, avec bienveillance. Que se passe-t-il maintenant ?" : locale === "de" ? "Hallo! Ich bin Wilbor. Ich bin hier, um Ihnen jederzeit mit Ihrem Baby zu helfen — ohne Urteile, mit Fürsorge. Was passiert gerade?" : "Olá! Sou o Wilbor. Estou aqui para te ajudar com seu bebê a qualquer hora — sem julgamentos, com carinho. O que está acontecendo agora?",
    suggestions: locale === "en" ? ["My baby doesn't sleep well", "How to introduce solid foods?", "My baby has colic", "Baby vaccination"] : locale === "es" ? ["Mi bebé no duerme bien", "¿Cómo introducir alimentos?", "Mi bebé tiene cólicos", "Vacunación del bebé"] : locale === "fr" ? ["Mon bébé ne dort pas bien", "Comment introduire les aliments ?", "Mon bébé a des coliques", "Vaccination du bébé"] : locale === "de" ? ["Mein Baby schläft nicht gut", "Wie führe ich feste Nahrung ein?", "Mein Baby hat Koliken", "Baby-Impfung"] : ["Meu bebê não dorme bem", "Como introduzir alimentos?", "Meu bebê tem cólica", "Vacinação do bebê"],
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Você é Wilbor, um apoio inteligente digital baseado em protocolos SBP/OMS/AAP para mães de bebês de 0-12 meses. Responda com carinho, sem julgamentos, baseado em evidências científicas.",
    },
  ]);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string | null>(null);
  const [lastUserQuestion, setLastUserQuestion] = useState<string | null>(null);

  const credits = trpc.wilbor.getCredits.useQuery();
  const chatMutation = trpc.wilbor.chat.useMutation({
    onSuccess: (response: string) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
      setLastAssistantMessage(response);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
        },
      ]);
    },
  });

  const handleSendMessage = (content: string) => {
    setLastUserQuestion(content);
    const newMessages = [...messages, { role: "user" as const, content }];
    setMessages(newMessages);
    chatMutation.mutate({ messages: newMessages });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="p-8 text-center max-w-md">
          <Heart className="mx-auto mb-4 size-12 text-purple-600" />
          <h2 className="mb-4 text-2xl font-bold">{txt.welcome}</h2>
          <p className="mb-6 text-gray-600">
            {txt.welcomeDesc}
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {txt.backHome}
          </Button>
        </Card>
      </div>
    );
  }

  const isLoading = chatMutation.isPending;
  const creditStatus = credits.data;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="size-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wilbor</h1>
              <p className="text-sm text-gray-600">{txt.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {creditStatus && (
              <div className="rounded-lg bg-purple-50 px-4 py-2">
                <p className="text-sm font-semibold text-purple-900">
                  {creditStatus.remaining} / {creditStatus.monthlyLimit} {txt.messages}
                </p>
                <p className="text-xs text-purple-700">{txt.plan}: {creditStatus.plan}</p>
              </div>
            )}

            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="size-4" />
              {txt.settings}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
              {txt.logout}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl gap-6 px-4 py-6">
          {/* Chat Area */}
          <div className="flex-1">
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <AIChatBox
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  placeholder={txt.chatPlaceholder}
                  height="100%"
                  emptyStateMessage={txt.chatWelcome}
                  suggestedPrompts={txt.suggestions}
                />
              </div>

              {/* Feedback Button - Mostrar após resposta do assistente */}
              {lastAssistantMessage && lastUserQuestion && (
                <div className="border-t border-gray-200 bg-white p-4">
                  <FeedbackButton
                    userQuestion={lastUserQuestion}
                    aiResponse={lastAssistantMessage}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* SOS Button */}
            <SOSButton
              onEmergency={(message) => {
                handleSendMessage(message);
              }}
              disabled={isLoading}
            />

            {/* Credits Info */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">{txt.monthlyUsage}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{txt.used}</span>
                  <span className="font-semibold text-gray-900">
                    {creditStatus?.messagesUsed || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{txt.available}</span>
                  <span className="font-semibold text-gray-900">
                    {creditStatus?.monthlyLimit || 0}
                  </span>
                </div>
                <div className="my-3 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all"
                    style={{
                      width: `${
                        ((creditStatus?.messagesUsed || 0) /
                          (creditStatus?.monthlyLimit || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                {creditStatus?.isOverLimit && (
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-semibold text-red-900">
                      {txt.limitReached}
                    </p>
                    <p className="text-xs text-red-700">
                      {txt.limitDesc}
                    </p>
                    <Button className="mt-2 w-full bg-red-600 hover:bg-red-700">
                      {txt.upgradeBtn}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">{txt.quickLinks}</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📊 Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  👶 {txt.myBabies}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🍽️ {txt.recipes}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📖 Blog
                </Button>
              </div>
            </Card>

            {/* Help */}
            <Card className="bg-purple-50 p-4">
              <h3 className="mb-2 font-semibold text-purple-900">{txt.tipsTitle}</h3>
              <p className="mb-3 text-sm text-purple-700">
                {txt.tipsDesc}
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-100"
              >
                {txt.goToBlog}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
