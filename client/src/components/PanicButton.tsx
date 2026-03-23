/**
 * Panic Button Component
 * Botão de emergência para respostas rápidas sobre problemas com bebê
 */

import { useState } from "react";
import { AlertCircle, Heart, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PanicButtonProps {
  className?: string;
  variant?: "default" | "floating" | "inline";
}

interface PanicResponse {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  actions: string[];
  whenToCall: string;
  resources: string[];
}

const PANIC_RESPONSES: Record<string, PanicResponse> = {
  fever: {
    title: "Febre em Bebê",
    severity: "high",
    actions: [
      "Meça a temperatura com termômetro digital",
      "Ofereça líquidos frequentemente",
      "Vista o bebê com roupas leves",
      "Banho morno (não gelado)",
      "Monitore outros sintomas",
    ],
    whenToCall: "Procure pediatra se: febre > 38.5°C, duração > 3 dias, ou outros sintomas",
    resources: [
      "Protocolo SBP - Febre em Bebês",
      "Quando procurar emergência",
      "Medicamentos seguros para bebê",
    ],
  },
  colic: {
    title: "Cólica do Bebê",
    severity: "medium",
    actions: [
      "Massagem Shantala (movimentos circulares na barriga)",
      "Posição aviãozinho (deitado no seu antebraço)",
      "Movimento de balanço suave",
      "Swaddle (embrulhar o bebê)",
      "Ruído branco ou música calma",
    ],
    whenToCall: "Procure pediatra se: dor intensa, recusa de alimento, ou vômito",
    resources: [
      "Técnicas de alívio de cólica",
      "Alimentos para amamentação",
      "Quando é normal vs. preocupante",
    ],
  },
  fall: {
    title: "Queda do Bebê",
    severity: "critical",
    actions: [
      "NÃO mova o bebê desnecessariamente",
      "Verifique se está consciente",
      "Procure por hematomas ou deformidades",
      "Verifique pupilas e resposta",
      "Ligue para emergência se: perda de consciência, vômito, convulsão",
    ],
    whenToCall: "SEMPRE procure emergência após queda de altura ou impacto forte",
    resources: [
      "Primeiros socorros para queda",
      "Sinais de alerta após queda",
      "Quando ir ao hospital",
    ],
  },
  choking: {
    title: "Engasgo/Asfixia",
    severity: "critical",
    actions: [
      "Se não consegue respirar: manobra de Heimlich adaptada",
      "Bebê < 1 ano: 5 pancadas nas costas + 5 compressões no peito",
      "Bebê > 1 ano: compressão abdominal",
      "Ligue para emergência imediatamente",
      "Não coloque dedos na garganta",
    ],
    whenToCall: "EMERGÊNCIA IMEDIATA - Ligue 192 ou 911",
    resources: [
      "Manobra de Heimlich para bebês",
      "Prevenção de engasgo",
      "RCP básica para bebés",
    ],
  },
  breathing: {
    title: "Dificuldade Respiratória",
    severity: "critical",
    actions: [
      "Coloque o bebê em posição semi-sentada",
      "Mantenha a calma e fale suavemente",
      "Verifique se há sibilância ou estridor",
      "Conte a frequência respiratória",
      "Ligue para emergência se: > 60 respirações/min, tiragem, cianose",
    ],
    whenToCall: "EMERGÊNCIA se: dificuldade severa, cor azulada, ou sons anormais",
    resources: [
      "Frequência respiratória normal por idade",
      "Sinais de alerta respiratório",
      "Quando procurar emergência",
    ],
  },
  rash: {
    title: "Erupção de Pele",
    severity: "medium",
    actions: [
      "Tire foto para mostrar ao pediatra",
      "Verifique se é urticária (desaparece com pressão)",
      "Procure por febre ou outros sintomas",
      "Evite produtos irritantes",
      "Mantenha a pele limpa e seca",
    ],
    whenToCall: "Procure pediatra se: erupção generalizada, febre, ou coceira intensa",
    resources: [
      "Tipos comuns de erupções em bebés",
      "Assaduras vs. outras erupções",
      "Quando procurar ajuda",
    ],
  },
  diarrhea: {
    title: "Diarreia",
    severity: "medium",
    actions: [
      "Ofereça soro fisiológico frequentemente",
      "Mantenha a higiene rigorosa",
      "Continue amamentando se possível",
      "Monitore sinais de desidratação",
      "Registre frequência e consistência",
    ],
    whenToCall: "Procure pediatra se: > 10 evacuações/dia, sangue nas fezes, ou desidratação",
    resources: [
      "Sinais de desidratação",
      "Alimentos seguros durante diarreia",
      "Quando procurar emergência",
    ],
  },
  vomiting: {
    title: "Vômito",
    severity: "high",
    actions: [
      "Ofereça pequenas quantidades de líquido",
      "Espere 30 min antes de oferecer alimento",
      "Mantenha o bebê hidratado",
      "Monitore sinais de desidratação",
      "Registre frequência e aparência",
    ],
    whenToCall: "Procure pediatra se: vômito persistente, sangue, ou desidratação",
    resources: [
      "Sinais de desidratação",
      "Diferença entre vômito e regurgitação",
      "Quando procurar emergência",
    ],
  },
};

export function PanicButton({ className, variant = "floating" }: PanicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectIssue = (issue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedIssue(issue);
      setIsLoading(false);
    }, 300);
  };

  const response = selectedIssue ? PANIC_RESPONSES[selectedIssue] : null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-600 text-white";
      case "medium":
        return "bg-yellow-600 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🚨 EMERGÊNCIA";
      case "high":
        return "⚠️ URGENTE";
      case "medium":
        return "⚡ IMPORTANTE";
      default:
        return "ℹ️ INFORMAÇÃO";
    }
  };

  if (variant === "floating") {
    return (
      <>
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 animate-pulse",
            "bg-red-600 text-white hover:bg-red-700",
            className
          )}
          title="Clique para emergências com seu bebê"
        >
          <Heart className="w-6 h-6" />
        </button>

        {/* Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                Assistência de Emergência - Wilbor
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="h-[70vh]">
              {!selectedIssue ? (
                <div className="space-y-3 pr-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione o problema do seu bebê para receber orientações rápidas:
                  </p>

                  {Object.entries(PANIC_RESPONSES).map(([key, response]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectIssue(key)}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                        getSeverityColor(response.severity),
                        "hover:opacity-90"
                      )}
                    >
                      <div className="font-semibold">{response.title}</div>
                      <div className="text-sm opacity-90 mt-1">
                        {getSeverityLabel(response.severity)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
              ) : response ? (
                <div className="space-y-6 pr-4">
                  {/* Header */}
                  <div className={cn("p-4 rounded-lg", getSeverityColor(response.severity))}>
                    <div className="text-lg font-bold">{response.title}</div>
                    <div className="text-sm mt-1">{getSeverityLabel(response.severity)}</div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">✅ O que fazer agora:</h3>
                    <ol className="space-y-2">
                      {response.actions.map((action, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="font-bold text-red-600 flex-shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* When to Call */}
                  <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
                    <h3 className="font-bold text-orange-900 mb-2">📞 Quando procurar ajuda:</h3>
                    <p className="text-orange-800">{response.whenToCall}</p>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">📚 Recursos úteis:</h3>
                    <ul className="space-y-2">
                      {response.resources.map((resource, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-gray-700">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                    <h3 className="font-bold text-red-900 mb-2">🚨 Emergência:</h3>
                    <p className="text-red-800 mb-2">
                      Se o bebê está em perigo imediato, ligue para:
                    </p>
                    <div className="flex gap-4 text-lg font-bold text-red-900">
                      <span>192 (SAMU)</span>
                      <span>911 (EUA)</span>
                      <span>112 (Europa)</span>
                    </div>
                  </div>

                  {/* Back Button */}
                  <Button
                    onClick={() => setSelectedIssue(null)}
                    variant="outline"
                    className="w-full"
                  >
                    ← Voltar
                  </Button>
                </div>
              ) : null}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Inline variant
  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="font-bold text-red-900">Assistência de Emergência</h3>
        </div>

        {!selectedIssue ? (
          <div className="space-y-2">
            {Object.entries(PANIC_RESPONSES).map(([key, response]) => (
              <Button
                key={key}
                onClick={() => handleSelectIssue(key)}
                variant="outline"
                className="w-full justify-start"
              >
                {response.title}
              </Button>
            ))}
          </div>
        ) : response ? (
          <div className="space-y-3">
            <div className={cn("p-3 rounded", getSeverityColor(response.severity))}>
              <div className="font-bold">{response.title}</div>
              <div className="text-sm">{getSeverityLabel(response.severity)}</div>
            </div>

            <div>
              <h4 className="font-bold mb-2">O que fazer:</h4>
              <ul className="space-y-1 text-sm">
                {response.actions.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => setSelectedIssue(null)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              ← Voltar
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PanicButton;
