import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { Blog } from "@/pages/Blog";
import { BlogArticle } from "@/pages/BlogArticle";
import { FeedbackDashboard } from "@/pages/FeedbackDashboard";
import Dashboard from "@/pages/Dashboard";
import BuyCredits from "@/pages/BuyCredits";
import Checkout from "@/pages/Checkout";

import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      {/* PT-BR (default) */}
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/buy-credits" component={BuyCredits} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/feedback" component={FeedbackDashboard} />
      <Route path="/checkout" component={Checkout} />

      {/* EN routes */}
      <Route path="/en" component={Home} />
      <Route path="/en/dashboard" component={Dashboard} />
      <Route path="/en/buy-credits" component={BuyCredits} />
      <Route path="/en/blog" component={Blog} />
      <Route path="/en/blog/:slug" component={BlogArticle} />
      <Route path="/en/checkout" component={Checkout} />

      {/* ES routes */}
      <Route path="/es" component={Home} />
      <Route path="/es/dashboard" component={Dashboard} />
      <Route path="/es/buy-credits" component={BuyCredits} />
      <Route path="/es/blog" component={Blog} />
      <Route path="/es/blog/:slug" component={BlogArticle} />
      <Route path="/es/checkout" component={Checkout} />

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
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
