import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { locale } = useI18n();

  const handleGoHome = () => {
    setLocation("/");
  };

  const title =
    locale === "pt" ? "Página Não Encontrada" :
    locale === "es" ? "Página No Encontrada" :
    locale === "fr" ? "Page Introuvable" :
    locale === "de" ? "Seite Nicht Gefunden" :
    "Page Not Found";

  const description =
    locale === "pt" ? "Desculpe, a página que você está procurando não existe. Ela pode ter sido movida ou excluída." :
    locale === "es" ? "Lo sentimos, la página que buscas no existe. Puede haber sido movida o eliminada." :
    locale === "fr" ? "Désolé, la page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée." :
    locale === "de" ? "Entschuldigung, die gesuchte Seite existiert nicht. Sie wurde möglicherweise verschoben oder gelöscht." :
    "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.";

  const goHome =
    locale === "pt" ? "Voltar ao Início" :
    locale === "es" ? "Volver al Inicio" :
    locale === "fr" ? "Retour à l'accueil" :
    locale === "de" ? "Zur Startseite" :
    "Go Home";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>

          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            {title}
          </h2>

          <p className="text-slate-600 mb-8 leading-relaxed">
            {description}
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {goHome}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
