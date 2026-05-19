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
import Premium from "@/pages/Premium";
import { BabySleepLanding, ColicLanding, FeverLanding } from "@/pages/IntentLanding";
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
import { MilestoneTracker } from "./pages/MilestoneTracker";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { AnalyticsEvents } from "./lib/analytics";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// Wrapper page que carrega o bebê ativo antes de renderizar o tracker
function MilestoneTrackerPage() {
  const { user } = useAuth();
  const babiesQuery = trpc.wilbor.getBabies?.useQuery(undefined, { enabled: !!user });
  const baby = (babiesQuery?.data as any)?.[0] ?? null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Faça login para acessar a Trilha de Desenvolvimento.
      </div>
    );
  }

  if (!baby) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Cadastre seu bebê no Dashboard para usar a Trilha de Desenvolvimento.
      </div>
    );
  }

  const babyAgeMonths = baby.birthDate
    ? Math.floor((Date.now() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8 px-4">
      <MilestoneTracker
        babyId={baby.id}
        babyName={baby.name}
        babyAgeMonths={babyAgeMonths}
      />
    </div>
  );
}

function Router() {
  const [location] = useLocation();

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
      <Route path="/:lang?/premium" component={Premium} />
      <Route path="/:lang?/bebe-nao-dorme" component={BabySleepLanding} />
      <Route path="/:lang?/colica-bebe" component={ColicLanding} />
      <Route path="/:lang?/febre-bebe" component={FeverLanding} />
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
      <Route path="/:lang?/desenvolvimento" component={MilestoneTrackerPage} />
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
