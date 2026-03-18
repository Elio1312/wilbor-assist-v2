import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface SOSButtonProps {
  onEmergency?: (message: string) => void;
  disabled?: boolean;
}

export function SOSButton({ onEmergency, disabled = false }: SOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const checkCredits = trpc.wilbor.checkExtraCredits.useQuery();
  const getUserCredits = trpc.wilbor.getUserCreditsStatus.useQuery();

  const handleSOSClick = async () => {
    setIsLoading(true);

    try {
      // Verificar se pode usar créditos extras
      const creditsCheck = await checkCredits.refetch();

      if (!creditsCheck.data?.canUse) {
        // Mostrar aviso delicado
        setShowWarning(true);
        if (onEmergency) {
          onEmergency(creditsCheck.data?.message || "Não conseguimos processar sua solicitação.");
        }
        setIsLoading(false);
        return;
      }

      // Se pode usar, iniciar conversa SOS
      if (onEmergency) {
        onEmergency("🚨 Modo SOS ativado. Estou aqui para ajudar com urgência! 💙");
      }

      // Log do uso SOS
      console.log("[SOS] Emergency mode activated");
    } catch (error) {
      console.error("[SOS] Error:", error);
      if (onEmergency) {
        onEmergency("Desculpe, não conseguimos ativar o modo SOS agora. Tente novamente.");
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
          {isLoading ? "Processando..." : "SOS Bebê chorando"}
        </span>
      </button>

      {/* Warning Message */}
      {showWarning && !canUse && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(255,179,71,0.1)", borderLeft: "4px solid #FF8C42" }}>
          <p className="text-sm font-semibold" style={{ color: "#D6336C" }}>
            {checkCredits.data?.message}
          </p>
          <p className="text-xs mt-2" style={{ color: "#666" }}>
            Você ainda tem acesso ao conteúdo completo e pode conversar normalmente. 💜
          </p>
        </div>
      )}

      {/* Credit Status */}
      {canUse && remainingLimit < 5 && (
        <div className="rounded-2xl p-3" style={{ backgroundColor: "rgba(255,179,71,0.08)" }}>
          <p className="text-xs font-semibold" style={{ color: "#E65100" }}>
            ⚠️ Você tem R$ {remainingLimit.toFixed(2)} disponíveis em créditos extras este mês.
          </p>
        </div>
      )}
    </div>
  );
}
