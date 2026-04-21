/**
 * Meu Corpo - Recuperação Materna Pós-Parto
 * Módulo completo de acompanhamento da saúde e bem-estar da mãe
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Heart,
  Scale,
  Ruler,
  Activity,
  Utensils,
  Dumbbell,
  Baby,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================

interface MotherProfile {
  deliveryType: "normal" | "cesarean" | "forceps";
  postpartumDays: number;
  postpartumPhase: "immediate" | "resguardo" | "transitional" | "recovery";
  currentWeight: number;
  height: number;
  targetWeight: number;
  prePregnancyWeight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  breastfeeding: boolean;
}

interface CalorieResult {
  bmr: number;
  tdee: number;
  breastfeedingBonus: number;
  totalCalories: number;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  phase: string[];
  difficulty: "gentle" | "moderate" | "强度适中";
  duration: number;
  benefits: string[];
}

// ==========================================
// CONSTANTS
// ==========================================

const POSTPARTUM_PHASES = {
  immediate: { days: [0, 7], name: "Fase Imediata", description: "Primeiros 7 dias - repouso absoluto" },
  resguardo: { days: [8, 40], name: "Resguardo", description: "8-40 dias - recuperação inicial" },
  transitional: { days: [41, 90], name: "Transição", description: "41-90 dias - retorno gradual" },
  recovery: { days: [91, 365], name: "Recuperação", description: "3-12 meses - fortalecimento" },
};

const EXERCISES: Exercise[] = [
  {
    id: "pelvic-floor",
    name: "Exercícios do Assoalho Pélvico",
    description: "Kegel para fortalecer músculos do piso pélvico",
    phase: ["immediate", "resguardo", "transitional", "recovery"],
    difficulty: "gentle",
    duration: 10,
    benefits: ["Previne incontinência", "Auxilia recuperação", "Melhora circulação"]
  },
  {
    id: "walking",
    name: "Caminhada Leve",
    description: "Passeios curtos para estimular circulação",
    phase: ["resguardo", "transitional", "recovery"],
    difficulty: "gentle",
    duration: 15,
    benefits: ["Auxilia circulação", "Reduz inchaço", "Bem-estar mental"]
  },
  {
    id: "postpartum-yoga",
    name: "Yoga Pós-Parto",
    description: "Posturas suaves para flexibilidade",
    phase: ["transitional", "recovery"],
    difficulty: "moderate",
    duration: 30,
    benefits: ["Flexibilidade", "Força", "Redução de estresse"]
  },
  {
    id: "pilates",
    name: "Pilates Moderado",
    description: "Fortalecimento do core com segurança",
    phase: ["recovery"],
    difficulty: "moderate",
    duration: 30,
    benefits: ["Fortalece core", "Postura", "Tônus muscular"]
  },
  {
    id: "postnatal-fitness",
    name: "Fitness Pós-Natal",
    description: "Treinos completos supervisionados",
    phase: ["recovery"],
    difficulty: "强度适中",
    duration: 45,
    benefits: ["Condicionamento físico", "Perda de peso gradual", "Energia"]
  }
];

const NUTRITION_TIPS = {
  breastfeeding: [
    "Aumente a ingestão de líquidos (2-3 litros/dia)",
    "Priorize proteínas e ferro",
    "Continue tomando vitaminas pré-natais",
    "Coma a cada 2-3 horas",
    "Evite alimentos que causam gases no bebê"
  ],
  general: [
    "Priorize alimentos ricos em ômega 3",
    "Inclua proteínas em todas as refeições",
    "Não pule refeições",
    "Evite dietas restritivas nos primeiros 3 meses",
    "Consuma cálcio e ferro adequados"
  ]
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: "Abaixo do peso", color: "text-yellow-600" };
  if (bmi < 25) return { category: "Peso normal", color: "text-green-600" };
  if (bmi < 30) return { category: "Sobrepeso", color: "text-orange-600" };
  return { category: "Obesidade", color: "text-red-600" };
}

function calculateCalories(profile: MotherProfile): CalorieResult {
  // Mifflin-St Jeor Equation para BMR
  // Para mulheres: BMR = 10 * peso(kg) + 6.25 * altura(cm) - 5 * idade - 161
  // Assumindo idade de 30 anos para simplificação
  const bmr = 10 * profile.currentWeight + 6.25 * profile.height - 5 * 30 - 161;

  // Multiplicadores de atividade
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Bônus para lactação (300-500 kcal)
  const breastfeedingBonus = profile.breastfeeding ? 450 : 0;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    breastfeedingBonus,
    totalCalories: Math.round(tdee + breastfeedingBonus)
  };
}

function getPostpartumPhase(days: number): keyof typeof POSTPARTUM_PHASES {
  for (const [key, phase] of Object.entries(POSTPARTUM_PHASES)) {
    if (days >= phase.days[0] && days <= phase.days[1]) {
      return key as keyof typeof POSTPARTUM_PHASES;
    }
  }
  return "recovery";
}

function getPhaseExercises(phase: string): Exercise[] {
  return EXERCISES.filter(ex => ex.phase.includes(phase));
}

// ==========================================
// COMPONENTS
// ==========================================

function ProgressBar({ value, max, label, color = "bg-purple-600" }: { value: number; max: number; label: string; color?: string }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value} / {max}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CalorieCalculator({ profile }: { profile: MotherProfile }) {
  const { t } = useI18n();
  const calories = calculateCalories(profile);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Utensils className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Calculadora de Calorias</h3>
          <p className="text-sm text-gray-500">Necessidade diária estimada</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-purple-600">{calories.bmr}</p>
          <p className="text-sm text-gray-500">BMR (metabolismo)</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-3xl font-bold text-purple-600">{calories.tdee}</p>
          <p className="text-sm text-gray-500">TDEE (com atividade)</p>
        </div>
      </div>

      {calories.breastfeedingBonus > 0 && (
        <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-3">
          <Baby className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">+{calories.breastfeedingBonus} kcal</p>
            <p className="text-sm text-blue-700">Bônus para lactação</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-center">
        <p className="text-4xl font-bold">{calories.totalCalories}</p>
        <p className="text-sm opacity-90">kcal/dia recomendadas</p>
      </div>
    </Card>
  );
}

function ExercisesByPhase({ phase }: { phase: string }) {
  const { t } = useI18n();
  const exercises = getPhaseExercises(phase);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Dumbbell className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Exercícios por Fase</h3>
          <p className="text-sm text-gray-500">Atividades seguras para você</p>
        </div>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {exercise.duration} min
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">
                    {exercise.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {exercise.benefits.map((benefit, idx) => (
                <span key={idx} className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NutritionTips({ breastfeeding }: { breastfeeding: boolean }) {
  const tips = breastfeeding ? NUTRITION_TIPS.breastfeeding : NUTRITION_TIPS.general;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-xl">
          <Utensils className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Dicas de Alimentação</h3>
          <p className="text-sm text-gray-500">Nutrição para recuperação</p>
        </div>
      </div>

      <div className="space-y-2">
        {tips.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{tip}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MeuCorpo() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<MotherProfile>({
    deliveryType: "normal",
    postpartumDays: 30,
    postpartumPhase: "resguardo",
    currentWeight: 70,
    height: 160,
    targetWeight: 60,
    prePregnancyWeight: 55,
    activityLevel: "light",
    breastfeeding: true,
  });

  const [deliveryDate, setDeliveryDate] = useState<string>("");

  // Calculated values
  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const phase = getPostpartumPhase(profile.postpartumDays);
  const phaseInfo = POSTPARTUM_PHASES[phase];

  // Calculate days since delivery
  useEffect(() => {
    if (deliveryDate) {
      const days = Math.floor(
        (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      setProfile(prev => ({ ...prev, postpartumDays: days }));
    }
  }, [deliveryDate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) {
    setLocation(localePath("/"));
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(localePath("/dashboard"))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Meu Corpo</h1>
              <p className="text-sm text-gray-500">Recuperação pós-parto</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Fase Pós-Parto */}
        <Card className="p-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="font-semibold text-lg">{phaseInfo.name}</h2>
              <p className="text-sm opacity-90">{phaseInfo.description}</p>
            </div>
          </div>
          <div className="p-4 bg-white/20 rounded-xl">
            <p className="text-3xl font-bold">{profile.postpartumDays}</p>
            <p className="text-sm opacity-90">dias desde o parto</p>
          </div>
        </Card>

        {/* Calculadora de Calorias */}
        <CalorieCalculator profile={profile} />

        {/* IMC e Peso */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Acompanhamento de Peso</h3>
              <p className="text-sm text-gray-500">IMC e metas</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500">Atual</p>
              <p className="text-xl font-bold">{profile.currentWeight} kg</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500">Meta</p>
              <p className="text-xl font-bold">{profile.targetWeight} kg</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500">Pré-gestação</p>
              <p className="text-xl font-bold">{profile.prePregnancyWeight} kg</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm text-gray-500">IMC</p>
            <p className={`text-3xl font-bold ${bmiCategory.color}`}>
              {bmi.toFixed(1)}
            </p>
            <p className={`text-sm font-medium ${bmiCategory.color}`}>
              {bmiCategory.category}
            </p>
          </div>

          <ProgressBar
            value={profile.prePregnancyWeight - profile.currentWeight}
            max={profile.prePregnancyWeight - profile.targetWeight}
            label="Progresso para meta"
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </Card>

        {/* Exercícios por Fase */}
        <ExercisesByPhase phase={phase} />

        {/* Dicas de Alimentação */}
        <NutritionTips breastfeeding={profile.breastfeeding} />

        {/* Informações Importantes */}
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Importante</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Estas são diretrizes gerais. Cada mulher se recupera de forma diferente.
                Sempre consulte seu médico antes de iniciar qualquer programa de exercícios
                ou mudar sua alimentação, especialmente durante a lactação.
              </p>
            </div>
          </div>
        </Card>

        {/* Botão Voltar */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation(localePath("/dashboard"))}
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
