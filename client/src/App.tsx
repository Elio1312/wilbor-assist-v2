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
import MeuCorpo from "./pages/MeuCorpo";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { AnalyticsEvents } from "./lib/analytics";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirecionamento Inteligente (ROI de Internacionalização)
  // Roda só uma vez no mount — evita loop infinito
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'es', 'fr', 'de'];
      if (supportedLangs.includes(browserLang)) {
        setLocation(`/${browserLang}`);
      }
    }
  }, []); // <- dependências vazias: roda só uma vez

  // Page View Tracking
  useEffect(() => {
    const pageTitle = document.title || 'Wilbor-Assist';
    AnalyticsEvents.pageView(window.location.pathname, pageTitle);
  }, [location]);

  return (
    <Switch>
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
      <Route path="/:lang?/meu-corpo" component={MeuCorpo} />
      <Route path="/admin-secret-panel" component={AdminDashboard} />
      <Route path="/:lang?/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster position="top-center" richColors />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}

export default App;

