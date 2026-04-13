import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import Recipes from "@/pages/Recipes";
import RecipeDetail from "@/pages/RecipeDetail";
import { FeedbackDashboard } from "@/pages/FeedbackDashboard";
import Dashboard from "@/pages/Dashboard";
import BuyCredits from "@/pages/BuyCredits";
import Checkout from "@/pages/Checkout";
import { Chat } from "@/pages/Chat";
import ShopPage from "@/pages/ShopPage";
import MyEbooks from "@/pages/MyEbooks";
import AdminDashboard from "@/pages/AdminDashboard";
import ShopSuccess from "@/pages/ShopSuccess";

import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirecionamento Inteligente (ROI de Internacionalização)
  // Se a mãe cair na raiz "/" e o navegador dela for EN, ES, FR ou DE, redirecionamos automaticamente.
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'es', 'fr', 'de'];
      if (supportedLangs.includes(browserLang)) {
        setLocation(`/${browserLang}`);
      }
    }
  }, [location, setLocation]);

  return (
    <Switch>
      {/* 
        Rotas Dinâmicas (Otimização Gemini): 
        O parâmetro :lang? permite que uma única rota atenda a todos os idiomas.
        Ex: /chat, /en/chat, /fr/chat agora usam o mesmo bloco de código.

        Importante: a Home precisa vir depois das rotas específicas.
        Caso contrário, caminhos curtos do PT sem prefixo, como /chat e /checkout,
        são interpretados como se fossem apenas o parâmetro :lang e a aplicação
        volta para a Home em vez de abrir a página correta.
      */}
      <Route path="/:lang?/dashboard" component={Dashboard} />
      <Route path="/:lang?/buy-credits" component={BuyCredits} />
      <Route path="/:lang?/chat" component={Chat} />
      <Route path="/:lang?/blog" component={Blog} />
      <Route path="/:lang?/blog/:slug" component={BlogArticle} />
      <Route path="/:lang?/recipes" component={Recipes} />
      <Route path="/:lang?/recipes/:slug" component={RecipeDetail} />
      <Route path="/:lang?/feedback" component={FeedbackDashboard} />
      <Route path="/:lang?/checkout" component={Checkout} />
      <Route path="/:lang?/shop" component={ShopPage} />
      <Route path="/:lang?/my-ebooks" component={MyEbooks} />
      <Route path="/:lang?/shop/success" component={ShopSuccess} />
      <Route path="/admin-secret-panel" component={AdminDashboard} />
      <Route path="/:lang?/" component={Home} />

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
