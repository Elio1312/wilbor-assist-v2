/**
 * SleepTracker - Componente de Rastreamento de Sono do Bebê
 * Com predição inteligente baseada em Wake Windows clínicos
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import {
  Moon,
  Sun,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Baby,
  Info
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================

interface SleepLog {
  id: number;
  babyId: number;
  sleepStart: Date;
  sleepEnd?: Date;
  durationMinutes?: number;
  quality?: "good" | "restless" | "bad";
  notes?: string;
}

interface SleepPrediction {
  suggestedTime: Date | null;
  confidence: "high" | "medium" | "low" | "none";
}

interface WakeWindowInfo {
  range: string;
  description: string;
  color: string;
}

// ==========================================
// CONSTANTS (Wake Windows Clinicos)
// ==========================================

const WAKE_WINDOW_TABLE: Record<string, WakeWindowInfo> = {
  "0-7": { range: "30-45 min", description: "Recém-nascido", color: "bg-blue-100" },
  "7-14": { range: "45-60 min", description: "1-2 semanas", color: "bg-blue-100" },
  "14-28": { range: "45-60 min", description: "2-4 semanas", color: "bg-blue-100" },
  "28-42": { range: "60-75 min", description: "4-6 semanas", color: "bg-teal-100" },
  "42-56": { range: "75-90 min", description: "6-8 semanas", color: "bg-teal-100" },
  "56-84": { range: "75-90 min", description: "2-3 meses", color: "bg-teal-100" },
  "84-112": { range: "90-120 min", description: "3-4 meses", color: "bg-green-100" },
  "112-140": { range: "90-120 min", description: "4 meses (peak)", color: "bg-green-100" },
  "140-168": { range: "100-120 min", description: "4-5 meses", color: "bg-green-100" },
  "168-196": { range: "120-150 min", description: "5-6 meses", color: "bg-yellow-100" },
  "196-224": { range: "120-150 min", description: "6 meses", color: "bg-yellow-100" },
  "224-252": { range: "150-180 min", description: "6-7 meses", color: "bg-yellow-100" },
  "252-280": { range: "165-195 min", description: "7-8 meses", color: "bg-orange-100" },
  "280-308": { range: "180-210 min", description: "8-9 meses", color: "bg-orange-100" },
  "308-336": { range: "180-210 min", description: "9-10 meses", color: "bg-orange-100" },
  "336-365": { range: "195-225 min", description: "10-11 meses", color: "bg-orange-100" },
  "365+": { range: "210-240 min", description: "11-12 meses+", color: "bg-red-100" },
};

const QUALITY_COLORS = {
  good: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  restless: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  bad: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getWakeWindowInfo(babyAgeDays: number): WakeWindowInfo {
  if (babyAgeDays <= 7) return WAKE_WINDOW_TABLE["0-7"];
  if (babyAgeDays <= 14) return WAKE_WINDOW_TABLE["7-14"];
  if (babyAgeDays <= 28) return WAKE_WINDOW_TABLE["14-28"];
  if (babyAgeDays <= 42) return WAKE_WINDOW_TABLE["28-42"];
  if (babyAgeDays <= 56) return WAKE_WINDOW_TABLE["42-56"];
  if (babyAgeDays <= 84) return WAKE_WINDOW_TABLE["56-84"];
  if (babyAgeDays <= 112) return WAKE_WINDOW_TABLE["84-112"];
  if (babyAgeDays <= 140) return WAKE_WINDOW_TABLE["112-140"];
  if (babyAgeDays <= 168) return WAKE_WINDOW_TABLE["140-168"];
  if (babyAgeDays <= 196) return WAKE_WINDOW_TABLE["168-196"];
  if (babyAgeDays <= 224) return WAKE_WINDOW_TABLE["196-224"];
  if (babyAgeDays <= 252) return WAKE_WINDOW_TABLE["224-252"];
  if (babyAgeDays <= 280) return WAKE_WINDOW_TABLE["252-280"];
  if (babyAgeDays <= 308) return WAKE_WINDOW_TABLE["280-308"];
  if (babyAgeDays <= 336) return WAKE_WINDOW_TABLE["308-336"];
  if (babyAgeDays <= 365) return WAKE_WINDOW_TABLE["336-365"];
  return WAKE_WINDOW_TABLE["365+"];
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

function formatTimeRemaining(prediction: SleepPrediction): string {
  if (!prediction.suggestedTime) return "Sem dados suficientes";
  const now = Date.now();
  const diff = prediction.suggestedTime.getTime() - now;
  if (diff <= 0) return "Hora de dormir! 😴";
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `em ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `em ${hours}h ${mins}min`;
}

function getConfidenceBadge(confidence: string): { label: string; color: string; icon: any } {
  switch (confidence) {
    case "high":
      return { label: "Alta confiança", color: "bg-green-100 text-green-700", icon: CheckCircle };
    case "medium":
      return { label: "Confiança média", color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle };
    case "low":
      return { label: "Baixa confiança", color: "bg-orange-100 text-orange-700", icon: AlertTriangle };
    default:
      return { label: "Sem dados", color: "bg-gray-100 text-gray-700", icon: Info };
  }
}

// ==========================================
// COMPONENT
// ==========================================

interface SleepTrackerProps {
  babyId: number;
  babyAgeDays: number;
  babyName: string;
  compact?: boolean;
}

export function SleepTracker({ babyId, babyAgeDays, babyName, compact = false }: SleepTrackerProps) {
  const { t } = useI18n();

  // Queries
  const activeSleep = trpc.wilbor.getActiveSleep.useQuery({ babyId });
  const recentLogs = trpc.wilbor.getRecentSleepLogs.useQuery({ babyId, limit: 7 });

  // Mutations
  const startSleepMutation = trpc.wilbor.startSleep.useMutation({
    onSuccess: () => {
      activeSleep.refetch();
      recentLogs.refetch();
    },
  });

  const endSleepMutation = trpc.wilbor.endSleep.useMutation({
    onSuccess: () => {
      activeSleep.refetch();
      recentLogs.refetch();
    },
  });

  // State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if there's an active sleep session
  const isSleeping = !!activeSleep.data;
  const wakeWindowInfo = getWakeWindowInfo(babyAgeDays);

  // Calculate sleep prediction based on last wake window
  const lastSleepLog = recentLogs.data?.[0];
  let prediction: SleepPrediction = { suggestedTime: null, confidence: "none" };

  if (lastSleepLog?.sleepEnd && !isSleeping) {
    const windowMinutes = parseInt(wakeWindowInfo.range.split("-")[1]);
    prediction = {
      suggestedTime: new Date(new Date(lastSleepLog.sleepEnd).getTime() + windowMinutes * 60000),
      confidence: (recentLogs.data?.length || 0) > 3 ? "high" : "medium",
    };
  }

  const confidenceBadge = getConfidenceBadge(prediction.confidence);
  const ConfidenceIcon = confidenceBadge.icon;

  // Calculate if baby should be sleeping now
  const shouldBeSleeping = prediction.suggestedTime && prediction.suggestedTime.getTime() <= currentTime.getTime();

  const handleStartSleep = () => {
    startSleepMutation.mutate({ babyId });
  };

  const handleEndSleep = () => {
    if (activeSleep.data) {
      endSleepMutation.mutate({ sleepLogId: activeSleep.data.id });
    }
  };

  // Calculate active sleep duration
  const activeSleepDuration = activeSleep.data
    ? Math.floor((Date.now() - new Date(activeSleep.data.sleepStart).getTime()) / 60000)
    : 0;

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSleeping ? "bg-purple-100" : "bg-gray-100"}`}>
              <Moon className={`w-5 h-5 ${isSleeping ? "text-purple-600" : "text-gray-500"}`} />
            </div>
            <div>
              <p className="font-medium text-sm">
                {isSleeping ? "Dormindo" : shouldBeSleeping ? "Hora de dormir!" : "Acordado"}
              </p>
              <p className="text-xs text-gray-500">
                {isSleeping
                  ? `${formatDuration(activeSleepDuration)}`
                  : `Próxima soneca ${formatTimeRemaining(prediction)}`}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isSleeping ? "destructive" : "default"}
            onClick={isSleeping ? handleEndSleep : handleStartSleep}
            disabled={startSleepMutation.isPending || endSleepMutation.isPending}
          >
            {isSleeping ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className={`p-6 ${shouldBeSleeping && !isSleeping ? "bg-purple-50 border-purple-200" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isSleeping ? "bg-purple-100" : shouldBeSleeping ? "bg-yellow-100" : "bg-gray-100"}`}>
              <Moon className={`w-6 h-6 ${isSleeping ? "text-purple-600" : shouldBeSleeping ? "text-yellow-600" : "text-gray-500"}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Sleep Tracker</h3>
              <p className="text-sm text-gray-500">{babyName}</p>
            </div>
          </div>
          <Button
            size="lg"
            variant={isSleeping ? "destructive" : "default"}
            className={isSleeping ? "bg-red-500 hover:bg-red-600" : ""}
            onClick={isSleeping ? handleEndSleep : handleStartSleep}
            disabled={startSleepMutation.isPending || endSleepMutation.isPending}
          >
            {isSleeping ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Acordar
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar Soneca
              </>
            )}
          </Button>
        </div>

        {/* Active Sleep Timer */}
        {isSleeping && (
          <div className="p-4 bg-purple-100 rounded-xl text-center mb-4">
            <p className="text-sm text-purple-700 mb-1">Dormindo há</p>
            <p className="text-4xl font-bold text-purple-900">{formatDuration(activeSleepDuration)}</p>
            <p className="text-xs text-purple-600 mt-1">
              Iniciado às {new Date(activeSleep.data.sleepStart).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}

        {/* Next Nap Prediction */}
        {!isSleeping && (
          <div className={`p-4 rounded-xl mb-4 ${shouldBeSleeping ? "bg-yellow-100" : "bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-5 h-5 ${shouldBeSleeping ? "text-yellow-600" : "text-gray-500"}`} />
              <span className={`font-medium ${shouldBeSleeping ? "text-yellow-800" : "text-gray-700"}`}>
                {shouldBeSleeping ? "Hora da soneca! 😴" : "Próxima soneca estimada"}
              </span>
            </div>
            <p className={`text-2xl font-bold ${shouldBeSleeping ? "text-yellow-900" : "text-gray-900"}`}>
              {formatTimeRemaining(prediction)}
            </p>
            <div className={`flex items-center gap-2 mt-2 ${confidenceBadge.color} px-3 py-1 rounded-full w-fit`}>
              <ConfidenceIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{confidenceBadge.label}</span>
            </div>
          </div>
        )}

        {/* Wake Window Info */}
        <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Janela de Vigília: {wakeWindowInfo.range} min
            </p>
            <p className="text-xs text-blue-700">
              {wakeWindowInfo.description} • Baseado em protocolos SBP/AAP
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Sleep History */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          <h4 className="font-semibold">Histórico Recente</h4>
        </div>

        {recentLogs.data && recentLogs.data.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.data.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.quality === "good" ? "bg-green-100" : log.quality === "restless" ? "bg-yellow-100" : "bg-gray-100"}`}>
                    {log.quality === "good" ? (
                      <Moon className="w-4 h-4 text-green-600" />
                    ) : log.quality === "restless" ? (
                      <Moon className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {log.durationMinutes ? formatDuration(log.durationMinutes) : "Em andamento"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.sleepStart).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {log.quality && (
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${QUALITY_COLORS[log.quality].bg} ${QUALITY_COLORS[log.quality].text}`}>
                    {log.quality === "good" ? "Bom" : log.quality === "restless" ? "Inquieto" : "Ruim"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Moon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum registro ainda</p>
            <p className="text-sm">Inicie o tracking para ver o histórico</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// Export default for standalone page
export default SleepTracker;
