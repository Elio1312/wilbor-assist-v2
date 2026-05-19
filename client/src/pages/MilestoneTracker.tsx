import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Pencil, Trophy, Baby, Brain, MessageSquare, Heart } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MilestoneCategory = "motor" | "cognitivo" | "linguagem" | "social";
type AchievedStatus = "yes" | "no" | "partial";

interface MilestoneContentItem {
  id: number;
  month: number;
  category: MilestoneCategory;
  title: string;
  description: string;
  order: number;
}

interface BabyMilestone {
  id: number;
  contentId: number;
  achieved: AchievedStatus;
  achievedAt: string | Date | null;
  notes: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<MilestoneCategory, {
  label: Record<string, string>;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}> = {
  motor: {
    label: { pt: "Motor", en: "Motor", es: "Motor" },
    icon: <Baby className="w-4 h-4" />,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  cognitivo: {
    label: { pt: "Cognitivo", en: "Cognitive", es: "Cognitivo" },
    icon: <Brain className="w-4 h-4" />,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  linguagem: {
    label: { pt: "Linguagem", en: "Language", es: "Lenguaje" },
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  social: {
    label: { pt: "Social", en: "Social", es: "Social" },
    icon: <Heart className="w-4 h-4" />,
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
};

const TEXTS = {
  pt: {
    title: "Trilha de Desenvolvimento",
    subtitle: "Acompanhe os marcos do seu bebê",
    noMilestones: "Nenhum marco encontrado para esta idade.",
    notes_placeholder: "Adicione uma lembrança ou observação...",
    save: "Salvar",
    cancel: "Cancelar",
    achieved: "Conquistado! 🎉",
    partial: "Em progresso",
    notYet: "Ainda não",
    achievedOn: "Em",
    timeline_title: "Linha do Tempo",
    timeline_empty: "Nenhum marco registrado ainda.",
    tab_current: "Marcos Atuais",
    tab_timeline: "Linha do Tempo",
    month: "mês",
    months: "meses",
    progress: "progresso",
  },
  en: {
    title: "Development Trail",
    subtitle: "Track your baby's milestones",
    noMilestones: "No milestones found for this age.",
    notes_placeholder: "Add a memory or observation...",
    save: "Save",
    cancel: "Cancel",
    achieved: "Achieved! 🎉",
    partial: "In progress",
    notYet: "Not yet",
    achievedOn: "On",
    timeline_title: "Timeline",
    timeline_empty: "No milestones recorded yet.",
    tab_current: "Current Milestones",
    tab_timeline: "Timeline",
    month: "month",
    months: "months",
    progress: "progress",
  },
  es: {
    title: "Sendero de Desarrollo",
    subtitle: "Sigue los hitos de tu bebé",
    noMilestones: "No se encontraron hitos para esta edad.",
    notes_placeholder: "Agrega un recuerdo u observación...",
    save: "Guardar",
    cancel: "Cancelar",
    achieved: "¡Logrado! 🎉",
    partial: "En progreso",
    notYet: "Todavía no",
    achievedOn: "El",
    timeline_title: "Línea del Tiempo",
    timeline_empty: "Ningún hito registrado aún.",
    tab_current: "Hitos Actuales",
    tab_timeline: "Línea del Tiempo",
    month: "mes",
    months: "meses",
    progress: "progreso",
  },
};

// ─── NoteModal ─────────────────────────────────────────────────────────────────

function NoteModal({
  milestoneTitle,
  currentNotes,
  onSave,
  onClose,
  locale,
}: {
  milestoneTitle: string;
  currentNotes: string;
  onSave: (notes: string) => void;
  onClose: () => void;
  locale: string;
}) {
  const [notes, setNotes] = useState(currentNotes);
  const t = TEXTS[locale as keyof typeof TEXTS] ?? TEXTS.pt;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Pencil className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{milestoneTitle}</h3>
            <p className="text-sm text-gray-500 mt-0.5">Anotação pessoal</p>
          </div>
        </div>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[100px]"
          placeholder={t.notes_placeholder}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          maxLength={500}
          autoFocus
        />
        <p className="text-xs text-gray-400 text-right">{notes.length}/500</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={() => onSave(notes)}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MilestoneCard ─────────────────────────────────────────────────────────────

function MilestoneCard({
  item,
  babyMilestone,
  onToggle,
  onNote,
  locale,
}: {
  item: MilestoneContentItem;
  babyMilestone?: BabyMilestone;
  onToggle: (contentId: number, current: AchievedStatus) => void;
  onNote: (contentId: number, title: string, currentNotes: string) => void;
  locale: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const t = TEXTS[locale as keyof typeof TEXTS] ?? TEXTS.pt;
  const cfg = CATEGORY_CONFIG[item.category];
  const status = babyMilestone?.achieved ?? "no";

  const statusCycle: Record<AchievedStatus, AchievedStatus> = {
    no: "partial",
    partial: "yes",
    yes: "no",
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        status === "yes"
          ? "border-green-200 bg-green-50"
          : status === "partial"
          ? "border-amber-200 bg-amber-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Status toggle */}
          <button
            onClick={() => onToggle(item.id, status)}
            className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
            title={status === "yes" ? t.achieved : status === "partial" ? t.partial : t.notYet}
          >
            {status === "yes" ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : status === "partial" ? (
              <Clock className="w-6 h-6 text-amber-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Categoria badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                {cfg.icon}
                {cfg.label[locale] ?? cfg.label.pt}
              </span>
              {status === "yes" && babyMilestone?.achievedAt && (
                <span className="text-xs text-green-600 font-medium">
                  {t.achievedOn} {new Date(babyMilestone.achievedAt).toLocaleDateString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR")}
                </span>
              )}
            </div>
            <h4 className={`font-semibold text-sm leading-snug ${status === "yes" ? "text-green-800" : "text-gray-800"}`}>
              {item.title}
            </h4>

            {/* Nota pessoal */}
            {babyMilestone?.notes && (
              <p className="mt-1 text-xs text-gray-500 italic line-clamp-2">
                💜 {babyMilestone.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Botão de nota */}
            <button
              onClick={() => onNote(item.id, item.title, babyMilestone?.notes ?? "")}
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Adicionar nota"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {/* Expandir descrição */}
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-9">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── TimelineView ──────────────────────────────────────────────────────────────

function TimelineView({
  babyId,
  locale,
}: {
  babyId: number;
  locale: string;
}) {
  const t = TEXTS[locale as keyof typeof TEXTS] ?? TEXTS.pt;
  const { data: timeline, isLoading } = trpc.wilbor.getMilestoneTimeline.useQuery(
    { babyId, language: locale as "pt" | "en" | "es" },
    { enabled: !!babyId }
  );

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">{t.timeline_empty}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Linha vertical */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-pink-200 to-purple-100" />

      <div className="space-y-4 pl-12">
        {timeline.map((entry, idx) => {
          const cfg = CATEGORY_CONFIG[entry.category as MilestoneCategory];
          return (
            <div key={entry.milestoneId} className="relative">
              {/* Dot na timeline */}
              <div className={`absolute -left-[2.15rem] w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                idx === 0 ? "bg-purple-500" : "bg-pink-400"
              }`} />

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                <div className="flex items-start gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                    {cfg.icon}
                    {cfg.label[locale] ?? cfg.label.pt}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{entry.title}</p>
                    {entry.achievedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.achievedAt).toLocaleDateString(
                          locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR",
                          { day: "numeric", month: "long", year: "numeric" }
                        )} · {entry.month} {entry.month === 1 ? t.month : t.months}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-xs text-purple-600 italic mt-1">💜 {entry.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface MilestoneTrackerProps {
  babyId: number;
  babyName: string;
  babyAgeMonths: number;
}

export function MilestoneTracker({ babyId, babyName, babyAgeMonths }: MilestoneTrackerProps) {
  const { locale } = useI18n();
  const t = TEXTS[locale as keyof typeof TEXTS] ?? TEXTS.pt;
  const [activeTab, setActiveTab] = useState<"current" | "timeline">("current");
  const [noteModal, setNoteModal] = useState<{ contentId: number; title: string; notes: string } | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const contentQuery = trpc.wilbor.getMilestoneContent.useQuery(
    { babyAgeMonths, language: locale as "pt" | "en" | "es" },
    { enabled: !!babyId }
  );
  const babyMilestonesQuery = trpc.wilbor.getBabyMilestones.useQuery(
    { babyId },
    { enabled: !!babyId }
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveMutation = trpc.wilbor.saveMilestone.useMutation({
    onSuccess: () => {
      babyMilestonesQuery.refetch();
    },
  });

  // ── Derived state ──────────────────────────────────────────────────────────
  const babyMilestonesMap = useMemo(() => {
    const map = new Map<number, BabyMilestone>();
    babyMilestonesQuery.data?.forEach(m => map.set(m.contentId, m));
    return map;
  }, [babyMilestonesQuery.data]);

  const contentByCategory = useMemo(() => {
    const result: Record<MilestoneCategory, MilestoneContentItem[]> = {
      motor: [], cognitivo: [], linguagem: [], social: [],
    };
    contentQuery.data?.forEach(item => {
      if (result[item.category as MilestoneCategory]) {
        result[item.category as MilestoneCategory].push(item as MilestoneContentItem);
      }
    });
    return result;
  }, [contentQuery.data]);

  const totalItems = contentQuery.data?.length ?? 0;
  const achievedItems = useMemo(() => {
    return contentQuery.data?.filter(item => babyMilestonesMap.get(item.id)?.achieved === "yes").length ?? 0;
  }, [contentQuery.data, babyMilestonesMap]);

  const progressPct = totalItems > 0 ? Math.round((achievedItems / totalItems) * 100) : 0;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleToggle = (contentId: number, current: AchievedStatus) => {
    const nextStatus: Record<AchievedStatus, AchievedStatus> = {
      no: "partial",
      partial: "yes",
      yes: "no",
    };
    saveMutation.mutate({
      babyId,
      contentId,
      achieved: nextStatus[current],
      achievedAt: nextStatus[current] === "yes" ? new Date().toISOString() : undefined,
      notes: babyMilestonesMap.get(contentId)?.notes ?? undefined,
    });
  };

  const handleNote = (contentId: number, title: string, currentNotes: string) => {
    setNoteModal({ contentId, title, notes: currentNotes });
  };

  const handleSaveNote = (notes: string) => {
    if (!noteModal) return;
    const current = babyMilestonesMap.get(noteModal.contentId);
    saveMutation.mutate({
      babyId,
      contentId: noteModal.contentId,
      achieved: current?.achieved ?? "no",
      notes,
    });
    setNoteModal(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">{t.title}</h2>
            <p className="text-purple-100 text-sm mt-0.5">
              {babyName} · {babyAgeMonths} {babyAgeMonths === 1 ? t.month : t.months}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{achievedItems}</p>
            <p className="text-purple-100 text-xs">{t.achieved.replace(" 🎉", "")}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-purple-200 mb-1">
            <span>{t.progress}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(["current", "timeline"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "current" ? t.tab_current : t.tab_timeline}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "current" ? (
        contentQuery.isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
          </div>
        ) : !contentQuery.data?.length ? (
          <div className="text-center py-12 text-gray-400 text-sm">{t.noMilestones}</div>
        ) : (
          <div className="space-y-6">
            {(Object.keys(CATEGORY_CONFIG) as MilestoneCategory[]).map(cat => {
              const items = contentByCategory[cat];
              if (!items.length) return null;
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <div key={cat}>
                  <div className={`flex items-center gap-2 mb-3 px-1`}>
                    <span className={`${cfg.color}`}>{cfg.icon}</span>
                    <h3 className={`text-sm font-semibold ${cfg.color}`}>
                      {cfg.label[locale] ?? cfg.label.pt}
                    </h3>
                    <span className="text-xs text-gray-400 ml-auto">
                      {items.filter(i => babyMilestonesMap.get(i.id)?.achieved === "yes").length}/{items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <MilestoneCard
                        key={item.id}
                        item={item}
                        babyMilestone={babyMilestonesMap.get(item.id)}
                        onToggle={handleToggle}
                        onNote={handleNote}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <TimelineView babyId={babyId} locale={locale} />
      )}

      {/* Note Modal */}
      {noteModal && (
        <NoteModal
          milestoneTitle={noteModal.title}
          currentNotes={noteModal.notes}
          onSave={handleSaveNote}
          onClose={() => setNoteModal(null)}
          locale={locale}
        />
      )}
    </div>
  );
}
