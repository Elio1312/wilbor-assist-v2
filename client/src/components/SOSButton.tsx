import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";

interface SOSButtonProps {
  onEmergency?: (message: string) => void;
  disabled?: boolean;
}

export function SOSButton({ onEmergency, disabled = false }: SOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { locale } = useI18n();

  const checkCredits = trpc.wilbor.checkExtraCredits.useQuery();
  const getUserCredits = trpc.wilbor.getUserCreditsStatus.useQuery();

  // Textos por idioma
  const txt = {
    processing: locale === "en" ? "Processing..." : locale === "es" ? "Procesando..." : locale === "fr" ? "Traitement..." : locale === "de" ? "Verarbeitung..." : "Processando...",
    sosLabel: locale === "en" ? "SOS Baby crying" : locale === "es" ? "SOS Bebé llorando" : locale === "fr" ? "SOS Bébé qui pleure" : locale === "de" ? "SOS Baby weint" : "SOS Bebê chorando",
    sosMessage: locale === "en" ? "🚨 SOS Mode activated. I'm here to help urgently! 💙" : locale === "es" ? "🚨 Modo SOS activado. ¡Estoy aquí para ayudar con urgencia! 💙" : locale === "fr" ? "🚨 Mode SOS activé. Je suis là pour vous aider d'urgence ! 💙" : locale === "de" ? "🚨 SOS-Modus aktiviert. Ich bin hier, um dringend zu helfen! 💙" : "🚨 Modo SOS ativado. Estou aqui para ajudar com urgência! 💙",
    errorMsg: locale === "en" ? "Sorry, we couldn't activate SOS mode right now. Please try again." : locale === "es" ? "Lo sentimos, no pudimos activar el modo SOS ahora. Inténtalo de nuevo." : locale === "fr" ? "Désolé, nous n'avons pas pu activer le mode SOS. Veuillez réessayer." : locale === "de" ? "Entschuldigung, wir konnten den SOS-Modus nicht aktivieren. Bitte versuchen Sie es erneut." : "Desculpe, não conseguimos ativar o modo SOS agora. Tente novamente.",
    warningExtra: locale === "en" ? "You still have full access to content and can chat normally. 💜" : locale === "es" ? "Todavía tienes acceso completo al contenido y puedes chatear normalmente. 💜" : locale === "fr" ? "Vous avez toujours accès à tout le contenu et pouvez discuter normalement. 💜" : locale === "de" ? "Sie haben weiterhin vollen Zugriff auf alle Inhalte und können normal chatten. 💜" : "Você ainda tem acesso ao conteúdo completo e pode conversar normalmente. 💜",
    creditsLeft: locale === "en" ? "⚠️ You have" : locale === "es" ? "⚠️ Tienes" : locale === "fr" ? "⚠️ Vous avez" : locale === "de" ? "⚠️ Sie haben" : "⚠️ Você tem",
    creditsUnit: locale === "en" ? "extra credits available this month." : locale === "es" ? "créditos extra disponibles este mes." : locale === "fr" ? "crédits supplémentaires disponibles ce mois." : locale === "de" ? "Zusatzguthaben diesen Monat verfügbar." : "disponíveis em créditos extras este mês.",
  };

  const handleSOSClick = async () => {
    setIsLoading(true);

    try {
      const creditsCheck = await checkCredits.refetch();

      if (!creditsCheck.data?.canUse) {
        setShowWarning(true);
        if (onEmergency) {
          onEmergency(creditsCheck.data?.message || txt.errorMsg);
        }
        setIsLoading(false);
        return;
      }

      if (onEmergency) {
        onEmergency(txt.sosMessage);
      }

      console.log("[SOS] Emergency mode activated");
    } catch (error) {
      console.error("[SOS] Error:", error);
      if (onEmergency) {
        onEmergency(txt.errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canUse = checkCredits.data?.canUse ?? true;
  const remainingLimit = checkCredits.data?.remainingLimit ?? 10;

  return (
    <div className="space-y-3">
      {/* SOS Button */}
      <button
        onClick={handleSOSClick}
        disabled={disabled || isLoading || !canUse}
        className="w-full flex items-center justify-center gap-3 rounded-3xl py-5 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: canUse
            ? "linear-gradient(135deg, #FFB347 0%, #FF8C42 100%)"
            : "linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%)",
          boxShadow: canUse
            ? "0 8px 32px rgba(255,179,71,0.4), 0 2px 8px rgba(0,0,0,0.15)"
            : "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        {isLoading ? (
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#1A284F" }} />
        ) : (
          <AlertCircle className="w-7 h-7" style={{ color: "#1A284F" }} />
        )}
        <span className="text-lg font-extrabold" style={{ color: "#1A284F" }}>
          {isLoading ? txt.processing : txt.sosLabel}
        </span>
      </button>

      {/* Warning Message */}
      {showWarning && !canUse && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(255,179,71,0.1)", borderLeft: "4px solid #FF8C42" }}>
          <p className="text-sm font-semibold" style={{ color: "#D6336C" }}>
            {checkCredits.data?.message}
          </p>
          <p className="text-xs mt-2" style={{ color: "#666" }}>
            {txt.warningExtra}
          </p>
        </div>
      )}

      {/* Credit Status */}
      {canUse && remainingLimit < 5 && (
        <div className="rounded-2xl p-3" style={{ backgroundColor: "rgba(255,179,71,0.08)" }}>
          <p className="text-xs font-semibold" style={{ color: "#E65100" }}>
            {txt.creditsLeft} {remainingLimit.toFixed(2)} {txt.creditsUnit}
          </p>
        </div>
      )}
    </div>
  );
}
