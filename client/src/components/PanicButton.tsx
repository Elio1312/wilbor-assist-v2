/**
 * Panic Button Component
 * Botão de emergência para respostas rápidas sobre problemas com bebê
 * Suporte completo a 5 idiomas: PT, EN, ES, FR, DE
 */

import { useState } from "react";
import { AlertCircle, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/i18n";

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

type PanicLocale = "pt" | "en" | "es" | "fr" | "de";

const PANIC_RESPONSES_I18N: Record<PanicLocale, Record<string, PanicResponse>> = {
  pt: {
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
      resources: ["Protocolo SBP - Febre em Bebês", "Quando procurar emergência", "Medicamentos seguros para bebê"],
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
      resources: ["Técnicas de alívio de cólica", "Alimentos para amamentação", "Quando é normal vs. preocupante"],
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
      resources: ["Primeiros socorros para queda", "Sinais de alerta após queda", "Quando ir ao hospital"],
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
      whenToCall: "EMERGÊNCIA IMEDIATA - Ligue 192 ou 112",
      resources: ["Manobra de Heimlich para bebês", "Prevenção de engasgo", "RCP básica para bebês"],
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
      resources: ["Frequência respiratória normal por idade", "Sinais de alerta respiratório", "Quando procurar emergência"],
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
      resources: ["Tipos comuns de erupções em bebês", "Assaduras vs. outras erupções", "Quando procurar ajuda"],
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
      resources: ["Sinais de desidratação", "Alimentos seguros durante diarreia", "Quando procurar emergência"],
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
      resources: ["Sinais de desidratação", "Diferença entre vômito e regurgitação", "Quando procurar emergência"],
    },
  },
  en: {
    fever: {
      title: "Baby Fever",
      severity: "high",
      actions: [
        "Measure temperature with a digital thermometer",
        "Offer fluids frequently",
        "Dress baby in light clothing",
        "Lukewarm bath (not cold)",
        "Monitor other symptoms",
      ],
      whenToCall: "See pediatrician if: fever > 38.5°C (101.3°F), lasts > 3 days, or other symptoms",
      resources: ["AAP Fever Protocol", "When to seek emergency care", "Safe medications for babies"],
    },
    colic: {
      title: "Baby Colic",
      severity: "medium",
      actions: [
        "Shantala massage (circular movements on tummy)",
        "Airplane position (baby face-down on your forearm)",
        "Gentle rocking motion",
        "Swaddle the baby",
        "White noise or calm music",
      ],
      whenToCall: "See pediatrician if: intense pain, feeding refusal, or vomiting",
      resources: ["Colic relief techniques", "Breastfeeding diet tips", "Normal vs. concerning colic"],
    },
    fall: {
      title: "Baby Fall",
      severity: "critical",
      actions: [
        "Do NOT move the baby unnecessarily",
        "Check if baby is conscious",
        "Look for bruising or deformities",
        "Check pupils and response",
        "Call emergency if: loss of consciousness, vomiting, seizure",
      ],
      whenToCall: "ALWAYS seek emergency after a fall from height or strong impact",
      resources: ["First aid for falls", "Warning signs after a fall", "When to go to the hospital"],
    },
    choking: {
      title: "Choking/Suffocation",
      severity: "critical",
      actions: [
        "If baby cannot breathe: adapted Heimlich maneuver",
        "Baby < 1 year: 5 back blows + 5 chest compressions",
        "Baby > 1 year: abdominal compression",
        "Call emergency immediately",
        "Do not put fingers in the throat",
      ],
      whenToCall: "IMMEDIATE EMERGENCY - Call 911 or 112",
      resources: ["Heimlich maneuver for babies", "Choking prevention", "Basic CPR for babies"],
    },
    breathing: {
      title: "Breathing Difficulty",
      severity: "critical",
      actions: [
        "Place baby in semi-upright position",
        "Stay calm and speak softly",
        "Check for wheezing or stridor",
        "Count breathing rate",
        "Call emergency if: > 60 breaths/min, retractions, cyanosis",
      ],
      whenToCall: "EMERGENCY if: severe difficulty, bluish color, or abnormal sounds",
      resources: ["Normal breathing rate by age", "Respiratory warning signs", "When to seek emergency"],
    },
    rash: {
      title: "Skin Rash",
      severity: "medium",
      actions: [
        "Take a photo to show the pediatrician",
        "Check if it is hives (disappears with pressure)",
        "Look for fever or other symptoms",
        "Avoid irritating products",
        "Keep skin clean and dry",
      ],
      whenToCall: "See pediatrician if: widespread rash, fever, or intense itching",
      resources: ["Common rash types in babies", "Diaper rash vs. other rashes", "When to seek help"],
    },
    diarrhea: {
      title: "Diarrhea",
      severity: "medium",
      actions: [
        "Offer oral rehydration solution frequently",
        "Maintain strict hygiene",
        "Continue breastfeeding if possible",
        "Monitor signs of dehydration",
        "Record frequency and consistency",
      ],
      whenToCall: "See pediatrician if: > 10 stools/day, blood in stool, or dehydration",
      resources: ["Signs of dehydration", "Safe foods during diarrhea", "When to seek emergency"],
    },
    vomiting: {
      title: "Vomiting",
      severity: "high",
      actions: [
        "Offer small amounts of fluid",
        "Wait 30 min before offering food",
        "Keep baby hydrated",
        "Monitor signs of dehydration",
        "Record frequency and appearance",
      ],
      whenToCall: "See pediatrician if: persistent vomiting, blood, or dehydration",
      resources: ["Signs of dehydration", "Vomiting vs. spitting up", "When to seek emergency"],
    },
  },
  es: {
    fever: {
      title: "Fiebre en el Bebé",
      severity: "high",
      actions: [
        "Mida la temperatura con termómetro digital",
        "Ofrezca líquidos frecuentemente",
        "Vista al bebé con ropa ligera",
        "Baño tibio (no frío)",
        "Monitoree otros síntomas",
      ],
      whenToCall: "Consulte al pediatra si: fiebre > 38.5°C, duración > 3 días, u otros síntomas",
      resources: ["Protocolo de fiebre en bebés", "Cuándo buscar emergencia", "Medicamentos seguros para bebés"],
    },
    colic: {
      title: "Cólico del Bebé",
      severity: "medium",
      actions: [
        "Masaje Shantala (movimientos circulares en el abdomen)",
        "Posición avión (boca abajo sobre tu antebrazo)",
        "Movimiento de balanceo suave",
        "Swaddle (envolver al bebé)",
        "Ruido blanco o música tranquila",
      ],
      whenToCall: "Consulte al pediatra si: dolor intenso, rechazo del alimento, o vómito",
      resources: ["Técnicas de alivio del cólico", "Alimentación durante la lactancia", "Normal vs. preocupante"],
    },
    fall: {
      title: "Caída del Bebé",
      severity: "critical",
      actions: [
        "NO mueva al bebé innecesariamente",
        "Verifique si está consciente",
        "Busque hematomas o deformidades",
        "Verifique pupilas y respuesta",
        "Llame a emergencias si: pérdida de conciencia, vómito, convulsión",
      ],
      whenToCall: "SIEMPRE busque emergencia tras caída de altura o impacto fuerte",
      resources: ["Primeros auxilios para caídas", "Señales de alerta tras caída", "Cuándo ir al hospital"],
    },
    choking: {
      title: "Atragantamiento/Asfixia",
      severity: "critical",
      actions: [
        "Si no puede respirar: maniobra de Heimlich adaptada",
        "Bebé < 1 año: 5 golpes en la espalda + 5 compresiones en el pecho",
        "Bebé > 1 año: compresión abdominal",
        "Llame a emergencias inmediatamente",
        "No meta los dedos en la garganta",
      ],
      whenToCall: "EMERGENCIA INMEDIATA - Llame al 112 o 911",
      resources: ["Maniobra de Heimlich para bebés", "Prevención de atragantamiento", "RCP básica para bebés"],
    },
    breathing: {
      title: "Dificultad Respiratoria",
      severity: "critical",
      actions: [
        "Coloque al bebé en posición semi-sentada",
        "Mantenga la calma y hable suavemente",
        "Verifique si hay sibilancias o estridor",
        "Cuente la frecuencia respiratoria",
        "Llame a emergencias si: > 60 respiraciones/min, tiraje, cianosis",
      ],
      whenToCall: "EMERGENCIA si: dificultad severa, color azulado, o sonidos anormales",
      resources: ["Frecuencia respiratoria normal por edad", "Señales de alerta respiratorio", "Cuándo buscar emergencia"],
    },
    rash: {
      title: "Erupción Cutánea",
      severity: "medium",
      actions: [
        "Tome una foto para mostrar al pediatra",
        "Verifique si es urticaria (desaparece con presión)",
        "Busque fiebre u otros síntomas",
        "Evite productos irritantes",
        "Mantenga la piel limpia y seca",
      ],
      whenToCall: "Consulte al pediatra si: erupción generalizada, fiebre, o picazón intensa",
      resources: ["Tipos comunes de erupciones en bebés", "Dermatitis vs. otras erupciones", "Cuándo buscar ayuda"],
    },
    diarrhea: {
      title: "Diarrea",
      severity: "medium",
      actions: [
        "Ofrezca suero oral frecuentemente",
        "Mantenga higiene rigurosa",
        "Continúe la lactancia si es posible",
        "Monitoree signos de deshidratación",
        "Registre frecuencia y consistencia",
      ],
      whenToCall: "Consulte al pediatra si: > 10 deposiciones/día, sangre en heces, o deshidratación",
      resources: ["Signos de deshidratación", "Alimentos seguros durante diarrea", "Cuándo buscar emergencia"],
    },
    vomiting: {
      title: "Vómito",
      severity: "high",
      actions: [
        "Ofrezca pequeñas cantidades de líquido",
        "Espere 30 min antes de ofrecer alimento",
        "Mantenga al bebé hidratado",
        "Monitoree signos de deshidratación",
        "Registre frecuencia y apariencia",
      ],
      whenToCall: "Consulte al pediatra si: vómito persistente, sangre, o deshidratación",
      resources: ["Signos de deshidratación", "Vómito vs. regurgitación", "Cuándo buscar emergencia"],
    },
  },
  fr: {
    fever: {
      title: "Fièvre du Bébé",
      severity: "high",
      actions: [
        "Mesurez la température avec un thermomètre numérique",
        "Proposez des liquides fréquemment",
        "Habillez le bébé légèrement",
        "Bain tiède (pas froid)",
        "Surveillez les autres symptômes",
      ],
      whenToCall: "Consultez le pédiatre si : fièvre > 38,5°C, durée > 3 jours, ou autres symptômes",
      resources: ["Protocole fièvre nourrisson", "Quand consulter en urgence", "Médicaments sûrs pour bébé"],
    },
    colic: {
      title: "Coliques du Bébé",
      severity: "medium",
      actions: [
        "Massage Shantala (mouvements circulaires sur le ventre)",
        "Position avion (ventre sur votre avant-bras)",
        "Mouvement de balancement doux",
        "Emmaillotage du bébé",
        "Bruit blanc ou musique douce",
      ],
      whenToCall: "Consultez le pédiatre si : douleur intense, refus d'alimentation, ou vomissements",
      resources: ["Techniques de soulagement des coliques", "Alimentation pendant l'allaitement", "Normal vs. préoccupant"],
    },
    fall: {
      title: "Chute du Bébé",
      severity: "critical",
      actions: [
        "NE déplacez PAS le bébé inutilement",
        "Vérifiez s'il est conscient",
        "Recherchez des hématomes ou déformations",
        "Vérifiez les pupilles et la réponse",
        "Appelez les secours si : perte de conscience, vomissements, convulsions",
      ],
      whenToCall: "Consultez TOUJOURS les urgences après une chute de hauteur ou un impact fort",
      resources: ["Premiers secours pour chutes", "Signes d'alerte après chute", "Quand aller à l'hôpital"],
    },
    choking: {
      title: "Étouffement/Suffocation",
      severity: "critical",
      actions: [
        "Si le bébé ne peut pas respirer : manœuvre de Heimlich adaptée",
        "Bébé < 1 an : 5 tapes dans le dos + 5 compressions thoraciques",
        "Bébé > 1 an : compression abdominale",
        "Appelez les secours immédiatement",
        "Ne mettez pas les doigts dans la gorge",
      ],
      whenToCall: "URGENCE IMMÉDIATE - Appelez le 15 (SAMU) ou le 112",
      resources: ["Manœuvre de Heimlich pour bébés", "Prévention de l'étouffement", "RCP de base pour bébés"],
    },
    breathing: {
      title: "Difficultés Respiratoires",
      severity: "critical",
      actions: [
        "Placez le bébé en position semi-assise",
        "Restez calme et parlez doucement",
        "Vérifiez la présence de sifflements ou stridor",
        "Comptez la fréquence respiratoire",
        "Appelez les secours si : > 60 respirations/min, tirage, cyanose",
      ],
      whenToCall: "URGENCE si : difficulté sévère, couleur bleutée, ou sons anormaux",
      resources: ["Fréquence respiratoire normale par âge", "Signes d'alerte respiratoires", "Quand consulter en urgence"],
    },
    rash: {
      title: "Éruption Cutanée",
      severity: "medium",
      actions: [
        "Prenez une photo pour montrer au pédiatre",
        "Vérifiez s'il s'agit d'urticaire (disparaît à la pression)",
        "Recherchez de la fièvre ou d'autres symptômes",
        "Évitez les produits irritants",
        "Gardez la peau propre et sèche",
      ],
      whenToCall: "Consultez le pédiatre si : éruption généralisée, fièvre, ou démangeaisons intenses",
      resources: ["Types courants d'éruptions chez les bébés", "Érythème fessier vs. autres éruptions", "Quand consulter"],
    },
    diarrhea: {
      title: "Diarrhée",
      severity: "medium",
      actions: [
        "Proposez une solution de réhydratation orale fréquemment",
        "Maintenez une hygiène rigoureuse",
        "Continuez l'allaitement si possible",
        "Surveillez les signes de déshydratation",
        "Notez la fréquence et la consistance",
      ],
      whenToCall: "Consultez le pédiatre si : > 10 selles/jour, sang dans les selles, ou déshydratation",
      resources: ["Signes de déshydratation", "Aliments sûrs pendant la diarrhée", "Quand consulter en urgence"],
    },
    vomiting: {
      title: "Vomissements",
      severity: "high",
      actions: [
        "Proposez de petites quantités de liquide",
        "Attendez 30 min avant de proposer de la nourriture",
        "Maintenez le bébé hydraté",
        "Surveillez les signes de déshydratation",
        "Notez la fréquence et l'apparence",
      ],
      whenToCall: "Consultez le pédiatre si : vomissements persistants, sang, ou déshydratation",
      resources: ["Signes de déshydratation", "Vomissements vs. régurgitations", "Quand consulter en urgence"],
    },
  },
  de: {
    fever: {
      title: "Fieber beim Baby",
      severity: "high",
      actions: [
        "Temperatur mit digitalem Thermometer messen",
        "Häufig Flüssigkeit anbieten",
        "Baby leicht anziehen",
        "Lauwarmes Bad (nicht kalt)",
        "Andere Symptome beobachten",
      ],
      whenToCall: "Kinderarzt aufsuchen bei: Fieber > 38,5°C, Dauer > 3 Tage oder anderen Symptomen",
      resources: ["Fieber-Protokoll für Babys", "Wann Notaufnahme aufsuchen", "Sichere Medikamente für Babys"],
    },
    colic: {
      title: "Babykoliken",
      severity: "medium",
      actions: [
        "Shantala-Massage (kreisende Bewegungen am Bauch)",
        "Flugzeugposition (Baby bäuchlings auf Ihrem Unterarm)",
        "Sanfte Schaukelbewegung",
        "Baby einwickeln (Swaddling)",
        "Weißes Rauschen oder ruhige Musik",
      ],
      whenToCall: "Kinderarzt aufsuchen bei: starken Schmerzen, Nahrungsverweigerung oder Erbrechen",
      resources: ["Techniken zur Koliklinderung", "Ernährung beim Stillen", "Normal vs. besorgniserregend"],
    },
    fall: {
      title: "Sturz des Babys",
      severity: "critical",
      actions: [
        "Baby NICHT unnötig bewegen",
        "Prüfen, ob Baby bei Bewusstsein ist",
        "Nach Hämatomen oder Verformungen suchen",
        "Pupillen und Reaktion prüfen",
        "Notarzt rufen bei: Bewusstlosigkeit, Erbrechen, Krampfanfall",
      ],
      whenToCall: "IMMER Notaufnahme nach Sturz aus der Höhe oder starkem Aufprall aufsuchen",
      resources: ["Erste Hilfe bei Stürzen", "Warnsignale nach einem Sturz", "Wann ins Krankenhaus"],
    },
    choking: {
      title: "Verschlucken/Erstickung",
      severity: "critical",
      actions: [
        "Wenn Baby nicht atmen kann: angepasstes Heimlich-Manöver",
        "Baby < 1 Jahr: 5 Rückenschläge + 5 Brustkompressionen",
        "Baby > 1 Jahr: Bauchkompression",
        "Sofort Notarzt rufen",
        "Keine Finger in den Hals stecken",
      ],
      whenToCall: "SOFORTIGER NOTFALL - Rufen Sie 112",
      resources: ["Heimlich-Manöver für Babys", "Erstickungsprävention", "Grundlegende HLW für Babys"],
    },
    breathing: {
      title: "Atemnot",
      severity: "critical",
      actions: [
        "Baby in halb aufrechte Position bringen",
        "Ruhig bleiben und sanft sprechen",
        "Auf Pfeifen oder Stridor achten",
        "Atemfrequenz zählen",
        "Notarzt rufen bei: > 60 Atemzüge/min, Einziehungen, Zyanose",
      ],
      whenToCall: "NOTFALL bei: schwerer Atemnot, bläulicher Farbe oder abnormalen Geräuschen",
      resources: ["Normale Atemfrequenz nach Alter", "Atemwarnzeichen", "Wann Notaufnahme aufsuchen"],
    },
    rash: {
      title: "Hautausschlag",
      severity: "medium",
      actions: [
        "Foto machen, um dem Kinderarzt zu zeigen",
        "Prüfen, ob es Nesselsucht ist (verschwindet bei Druck)",
        "Nach Fieber oder anderen Symptomen suchen",
        "Reizende Produkte vermeiden",
        "Haut sauber und trocken halten",
      ],
      whenToCall: "Kinderarzt aufsuchen bei: generalisiertem Ausschlag, Fieber oder starkem Juckreiz",
      resources: ["Häufige Ausschlagsarten bei Babys", "Windeldermatitis vs. andere Ausschläge", "Wann Hilfe suchen"],
    },
    diarrhea: {
      title: "Durchfall",
      severity: "medium",
      actions: [
        "Häufig orale Rehydrationslösung anbieten",
        "Strenge Hygiene einhalten",
        "Stillen wenn möglich fortsetzen",
        "Auf Dehydrierungszeichen achten",
        "Häufigkeit und Konsistenz notieren",
      ],
      whenToCall: "Kinderarzt aufsuchen bei: > 10 Stühle/Tag, Blut im Stuhl oder Dehydrierung",
      resources: ["Zeichen der Dehydrierung", "Sichere Lebensmittel bei Durchfall", "Wann Notaufnahme aufsuchen"],
    },
    vomiting: {
      title: "Erbrechen",
      severity: "high",
      actions: [
        "Kleine Flüssigkeitsmengen anbieten",
        "30 min warten, bevor Nahrung angeboten wird",
        "Baby hydratisiert halten",
        "Auf Dehydrierungszeichen achten",
        "Häufigkeit und Aussehen notieren",
      ],
      whenToCall: "Kinderarzt aufsuchen bei: anhaltendem Erbrechen, Blut oder Dehydrierung",
      resources: ["Zeichen der Dehydrierung", "Erbrechen vs. Spucken", "Wann Notaufnahme aufsuchen"],
    },
  },
};

// Labels de UI por idioma
const UI_LABELS: Record<PanicLocale, {
  dialogTitle: string;
  selectPrompt: string;
  whatToDo: string;
  whenToCall: string;
  usefulResources: string;
  emergency: string;
  emergencyDesc: string;
  emergencyNumbers: string;
  back: string;
  severityCritical: string;
  severityHigh: string;
  severityMedium: string;
  severityLow: string;
  inlineTitle: string;
  buttonTitle: string;
}> = {
  pt: {
    dialogTitle: "Assistência de Emergência - Wilbor",
    selectPrompt: "Selecione o problema do seu bebê para receber orientações rápidas:",
    whatToDo: "✅ O que fazer agora:",
    whenToCall: "📞 Quando procurar ajuda:",
    usefulResources: "📚 Recursos úteis:",
    emergency: "🚨 Emergência:",
    emergencyDesc: "Se o bebê está em perigo imediato, ligue para:",
    emergencyNumbers: "192 (SAMU) · 911 (EUA) · 112 (Europa)",
    back: "← Voltar",
    severityCritical: "🚨 EMERGÊNCIA",
    severityHigh: "⚠️ URGENTE",
    severityMedium: "⚡ IMPORTANTE",
    severityLow: "ℹ️ INFORMAÇÃO",
    inlineTitle: "Assistência de Emergência",
    buttonTitle: "Clique para emergências com seu bebê",
  },
  en: {
    dialogTitle: "Emergency Assistance - Wilbor",
    selectPrompt: "Select your baby's issue to receive quick guidance:",
    whatToDo: "✅ What to do now:",
    whenToCall: "📞 When to seek help:",
    usefulResources: "📚 Useful resources:",
    emergency: "🚨 Emergency:",
    emergencyDesc: "If the baby is in immediate danger, call:",
    emergencyNumbers: "911 (USA) · 999 (UK) · 112 (Europe)",
    back: "← Back",
    severityCritical: "🚨 EMERGENCY",
    severityHigh: "⚠️ URGENT",
    severityMedium: "⚡ IMPORTANT",
    severityLow: "ℹ️ INFO",
    inlineTitle: "Emergency Assistance",
    buttonTitle: "Click for baby emergencies",
  },
  es: {
    dialogTitle: "Asistencia de Emergencia - Wilbor",
    selectPrompt: "Seleccione el problema de su bebé para recibir orientación rápida:",
    whatToDo: "✅ Qué hacer ahora:",
    whenToCall: "📞 Cuándo buscar ayuda:",
    usefulResources: "📚 Recursos útiles:",
    emergency: "🚨 Emergencia:",
    emergencyDesc: "Si el bebé está en peligro inmediato, llame a:",
    emergencyNumbers: "112 (Europa) · 911 (EUA)",
    back: "← Volver",
    severityCritical: "🚨 EMERGENCIA",
    severityHigh: "⚠️ URGENTE",
    severityMedium: "⚡ IMPORTANTE",
    severityLow: "ℹ️ INFORMACIÓN",
    inlineTitle: "Asistencia de Emergencia",
    buttonTitle: "Haga clic para emergencias con su bebé",
  },
  fr: {
    dialogTitle: "Assistance d'Urgence - Wilbor",
    selectPrompt: "Sélectionnez le problème de votre bébé pour recevoir des conseils rapides :",
    whatToDo: "✅ Que faire maintenant :",
    whenToCall: "📞 Quand consulter :",
    usefulResources: "📚 Ressources utiles :",
    emergency: "🚨 Urgence :",
    emergencyDesc: "Si le bébé est en danger immédiat, appelez le :",
    emergencyNumbers: "15 (SAMU) · 112 (Europe)",
    back: "← Retour",
    severityCritical: "🚨 URGENCE",
    severityHigh: "⚠️ URGENT",
    severityMedium: "⚡ IMPORTANT",
    severityLow: "ℹ️ INFO",
    inlineTitle: "Assistance d'Urgence",
    buttonTitle: "Cliquez pour les urgences bébé",
  },
  de: {
    dialogTitle: "Notfallhilfe - Wilbor",
    selectPrompt: "Wählen Sie das Problem Ihres Babys für schnelle Anleitung:",
    whatToDo: "✅ Was jetzt zu tun ist:",
    whenToCall: "📞 Wann Hilfe suchen:",
    usefulResources: "📚 Nützliche Ressourcen:",
    emergency: "🚨 Notfall:",
    emergencyDesc: "Wenn das Baby in unmittelbarer Gefahr ist, rufen Sie an:",
    emergencyNumbers: "112 (Europa) · 110 (Polizei DE)",
    back: "← Zurück",
    severityCritical: "🚨 NOTFALL",
    severityHigh: "⚠️ DRINGEND",
    severityMedium: "⚡ WICHTIG",
    severityLow: "ℹ️ INFO",
    inlineTitle: "Notfallhilfe",
    buttonTitle: "Klicken Sie für Baby-Notfälle",
  },
};

export function PanicButton({ className, variant = "floating" }: PanicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useI18n();

  const lang = (["pt", "en", "es", "fr", "de"].includes(locale) ? locale : "pt") as PanicLocale;
  const PANIC_RESPONSES = PANIC_RESPONSES_I18N[lang];
  const UI = UI_LABELS[lang];

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
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-orange-600 text-white";
      case "medium": return "bg-yellow-600 text-white";
      default: return "bg-blue-600 text-white";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return UI.severityCritical;
      case "high": return UI.severityHigh;
      case "medium": return UI.severityMedium;
      default: return UI.severityLow;
    }
  };

  if (variant === "floating") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 animate-pulse",
            "bg-red-600 text-white hover:bg-red-700",
            className
          )}
          title={UI.buttonTitle}
        >
          <Heart className="w-6 h-6" />
        </button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                {UI.dialogTitle}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="h-[70vh]">
              {!selectedIssue ? (
                <div className="space-y-3 pr-4">
                  <p className="text-sm text-gray-600 mb-4">{UI.selectPrompt}</p>
                  {Object.entries(PANIC_RESPONSES).map(([key, resp]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectIssue(key)}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                        getSeverityColor(resp.severity),
                        "hover:opacity-90"
                      )}
                    >
                      <div className="font-semibold">{resp.title}</div>
                      <div className="text-sm opacity-90 mt-1">{getSeverityLabel(resp.severity)}</div>
                    </button>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
              ) : response ? (
                <div className="space-y-6 pr-4">
                  <div className={cn("p-4 rounded-lg", getSeverityColor(response.severity))}>
                    <div className="text-lg font-bold">{response.title}</div>
                    <div className="text-sm mt-1">{getSeverityLabel(response.severity)}</div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">{UI.whatToDo}</h3>
                    <ol className="space-y-2">
                      {response.actions.map((action, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="font-bold text-red-600 flex-shrink-0">{idx + 1}.</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
                    <h3 className="font-bold text-orange-900 mb-2">{UI.whenToCall}</h3>
                    <p className="text-orange-800">{response.whenToCall}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">{UI.usefulResources}</h3>
                    <ul className="space-y-2">
                      {response.resources.map((resource, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-gray-700">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                    <h3 className="font-bold text-red-900 mb-2">{UI.emergency}</h3>
                    <p className="text-red-800 mb-2">{UI.emergencyDesc}</p>
                    <div className="text-lg font-bold text-red-900">{UI.emergencyNumbers}</div>
                  </div>

                  <Button onClick={() => setSelectedIssue(null)} variant="outline" className="w-full">
                    {UI.back}
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
          <h3 className="font-bold text-red-900">{UI.inlineTitle}</h3>
        </div>

        {!selectedIssue ? (
          <div className="space-y-2">
            {Object.entries(PANIC_RESPONSES).map(([key, resp]) => (
              <Button key={key} onClick={() => handleSelectIssue(key)} variant="outline" className="w-full justify-start">
                {resp.title}
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
              <h4 className="font-bold mb-2">{UI.whatToDo}</h4>
              <ul className="space-y-1 text-sm">
                {response.actions.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => setSelectedIssue(null)} variant="outline" size="sm" className="w-full">
              {UI.back}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PanicButton;
