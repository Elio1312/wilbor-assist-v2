import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useI18n } from "@/contexts/i18n";
import { CheckCircle2, BookOpen, PartyPopper, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalyticsEvents } from "@/lib/analytics";

// Utilitário leve de confetti sem dependência externa
function launchConfetti() {
  const colors = ["#9333ea", "#db2777", "#2563eb", "#16a34a"];
  const count = 120;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position: fixed;
      top: ${Math.random() * 40}%;
      left: ${Math.random() * 100}%;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${1.5 + Math.random() * 2}s ease-in forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  if (!document.getElementById("confetti-style")) {
    const style = document.createElement("style");
    style.id = "confetti-style";
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default function ShopSuccess() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  // session_id enviado pelo Stripe no redirect de sucesso
  const sessionId = params.get("session_id");

  useEffect(() => {
    launchConfetti();

    // Analytics: Purchase Success
    if (sessionId) {
      AnalyticsEvents.checkoutSuccess(
        sessionId,
        0, // Valor será preenchido pela verificação do servidor
        "BRL",
        0 // Créditos serão calculados
      );
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center shadow-2xl border-none rounded-3xl bg-white animate-in fade-in zoom-in duration-500">
        {/* Ícone de sucesso */}
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="size-12 text-green-600" />
          </div>
        </div>

        {/* Título e descrição */}
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {t("shop.payment_confirmed") ?? "Pagamento Confirmado!"}
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {t("shop.payment_confirmed_desc") ??
            "Sua transação foi concluída! O Wilbor já liberou seu acesso exclusivo para guiar você e seu bebê."}
        </p>

        {/* CTAs */}
        <div className="space-y-4">
          {/* Botão Principal: Acesso ao Produto Adquirido (ROI de Renda Rápida) */}
          <Button
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl text-lg font-bold gap-3 shadow-lg shadow-purple-100"
            onClick={() => setLocation(localePath("/my-ebooks"))}
          >
            <BookOpen className="size-5" />
            {t("shop.access_ebooks") ?? "Acessar Meus E-books"}
          </Button>

          {/* Botão Secundário: Retorno ao Dashboard (LTV e Engajamento) */}
          <Button
            variant="outline"
            className="w-full h-14 border-slate-200 text-slate-700 rounded-2xl text-lg font-bold gap-3 hover:bg-slate-50"
            onClick={() => setLocation(localePath("/dashboard"))}
          >
            <LayoutDashboard className="size-5" />
            {t("nav.dashboard") ?? "Ir para o Dashboard"}
          </Button>
        </div>

        {/* Rodapé de celebração */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-purple-600 font-bold text-sm">
          <PartyPopper className="size-4" />
          <span>{t("shop.welcome_premium") ?? "Bem-vinda ao nível Premium Wilbor!"}</span>
        </div>
      </Card>
    </div>
  );
}
