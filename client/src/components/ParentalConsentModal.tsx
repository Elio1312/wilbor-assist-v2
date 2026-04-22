/**
 * Parental Consent Modal - GDPR/LGPD Compliance
 * Collects parental consent before collecting child data
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Baby, Lock, Info } from "lucide-react";
import { useI18n } from "@/contexts/i18n";

interface ParentalConsentModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const CONSENT_TEXTS: Record<string, {
  title: string;
  subtitle: string;
  intro: string;
  dataCollected: string;
  dataItems: string[];
  purpose: string;
  purposeItems: string[];
  rights: string;
  rightsItems: string[];
  acceptBtn: string;
  declineBtn: string;
  privacyLink: string;
  ageWarning: string;
  legalBasis: string;
}> = {
  pt: {
    title: "Consentimento Parental",
    subtitle: "Precisamos da sua permissão para personalizar a experiência do seu bebé",
    intro: "Para oferecer orientação especializada e personalizada para o seu bebé, precisamos coletar alguns dados básicos. A sua privacidade é nossa prioridade.",
    dataCollected: "Dados que coletamos:",
    dataItems: [
      "Nome do bebé (opcional)",
      "Data de nascimento do bebé",
      "Idade gestacional ao nascer",
      "Condições especiais de saúde (opcional)",
      "Informações de sono e alimentação"
    ],
    purpose: "Como usamos seus dados:",
    purposeItems: [
      "Personalizar respostas do assistente IA",
      "Adaptar recomendações à idade do bebé",
      "Acompanhar marcos do desenvolvimento",
      "Melhorar a experiência do produto"
    ],
    rights: "Seus direitos (LGPD):",
    rightsItems: [
      "Acessar seus dados a qualquer momento",
      "Solicitar correção ou exclusão",
      "Revogar consentimento quando quiser"
    ],
    acceptBtn: "Aceitar e continuar",
    declineBtn: "Recusar",
    privacyLink: "Leia nossa Política de Privacidade completa",
    ageWarning: "Este serviço é destinado a pais/responsáveis de crianças de 0 a 3 anos.",
    legalBasis: "Base legal: Consentimento explícito conforme Art. 14 do GDPR e Art. 14 da LGPD."
  },
  en: {
    title: "Parental Consent",
    subtitle: "We need your permission to personalize your baby's experience",
    intro: "To provide expert guidance personalized for your baby, we need to collect some basic data. Your privacy is our priority.",
    dataCollected: "Data we collect:",
    dataItems: [
      "Baby's name (optional)",
      "Baby's date of birth",
      "Gestational age at birth",
      "Special health conditions (optional)",
      "Sleep and feeding information"
    ],
    purpose: "How we use your data:",
    purposeItems: [
      "Personalize AI assistant responses",
      "Adapt recommendations to baby's age",
      "Track developmental milestones",
      "Improve product experience"
    ],
    rights: "Your rights (GDPR):",
    rightsItems: [
      "Access your data at any time",
      "Request correction or deletion",
      "Withdraw consent anytime"
    ],
    acceptBtn: "Accept and continue",
    declineBtn: "Decline",
    privacyLink: "Read our full Privacy Policy",
    ageWarning: "This service is intended for parents/guardians of children ages 0-3.",
    legalBasis: "Legal basis: Explicit consent per Article 14 of GDPR and COPPA."
  },
  es: {
    title: "Consentimiento Parental",
    subtitle: "Necesitamos su permiso para personalizar la experiencia de su bebé",
    intro: "Para proporcionar orientación experta personalizada para su bebé, necesitamos recopilar algunos datos básicos. Su privacidad es nuestra prioridad.",
    dataCollected: "Datos que recopilamos:",
    dataItems: [
      "Nombre del bebé (opcional)",
      "Fecha de nacimiento del bebé",
      "Edad gestacional al nacer",
      "Condiciones especiales de salud (opcional)",
      "Información sobre sueño y alimentación"
    ],
    purpose: "Cómo usamos sus datos:",
    purposeItems: [
      "Personalizar respuestas del asistente IA",
      "Adaptar recomendaciones a la edad del bebé",
      "Seguimiento de hitos del desarrollo",
      "Mejorar la experiencia del producto"
    ],
    rights: "Sus derechos:",
    rightsItems: [
      "Acceder a sus datos en cualquier momento",
      "Solicitar corrección o eliminación",
      "Revocar el consentimiento cuando quiera"
    ],
    acceptBtn: "Aceptar y continuar",
    declineBtn: "Rechazar",
    privacyLink: "Lea nuestra Política de Privacidad completa",
    ageWarning: "Este servicio está destinado a padres/tutores de niños de 0 a 3 años.",
    legalBasis: "Base legal: Consentimiento explícito según el Artículo 14 del RGPD."
  },
  fr: {
    title: "Consentement Parental",
    subtitle: "Nous avons besoin de votre permission pour personnaliser l'expérience de votre bébé",
    intro: "Pour fournir des conseils d'experts personnalisés pour votre bébé, nous devons collecter certaines données de base. Votre vie privée est notre priorité.",
    dataCollected: "Données que nous collectons:",
    dataItems: [
      "Nom du bébé (optionnel)",
      "Date de naissance du bébé",
      "Âge gestationnel à la naissance",
      "Conditions de santé spéciales (optionnel)",
      "Informations sur le sommeil et l'alimentation"
    ],
    purpose: "Comment nous utilisons vos données:",
    purposeItems: [
      "Personnaliser les réponses de l'assistant IA",
      "Adapter les recommandations à l'âge du bébé",
      "Suivre les étapes du développement",
      "Améliorer l'expérience produit"
    ],
    rights: "Vos droits (RGPD):",
    rightsItems: [
      "Accéder à vos données à tout moment",
      "Demander correction ou suppression",
      "Retirer le consentement à tout moment"
    ],
    acceptBtn: "Accepter et continuer",
    declineBtn: "Refuser",
    privacyLink: "Lisez notre Politique de Confidentialité complète",
    ageWarning: "Ce service est destiné aux parents/tuteurs d'enfants de 0 à 3 ans.",
    legalBasis: "Base légale: Consentement explicite selon l'Article 14 du RGPD."
  },
  de: {
    title: "Elterliche Einwilligung",
    subtitle: "Wir benötigen Ihre Erlaubnis, um die Erfahrung Ihres Babys zu personalisieren",
    intro: "Um fachkundige, personalisierte Anleitungen für Ihr Baby zu bieten, müssen wir einige grundlegende Daten sammeln. Ihre Privatsphäre hat für uns Priorität.",
    dataCollected: "Daten, die wir sammeln:",
    dataItems: [
      "Name des Babys (optional)",
      "Geburtsdatum des Babys",
      "Gestationsalter bei der Geburt",
      "Besondere Gesundheitsbedingungen (optional)",
      "Schlaf- und Fütterungsinformationen"
    ],
    purpose: "Wie wir Ihre Daten verwenden:",
    purposeItems: [
      "Personalisieren von KI-Assistent-Antworten",
      "Anpassen von Empfehlungen an das Alter des Babys",
      "Verfolgen von Entwicklung Meilensteinen",
      "Verbessern der Produkterfahrung"
    ],
    rights: "Ihre Rechte (DSGVO):",
    rightsItems: [
      "Jederzeit auf Ihre Daten zugreifen",
      "Korrektur oder Löschung anfordern",
      "Einwilligung jederzeit widerrufen"
    ],
    acceptBtn: "Akzeptieren und fortfahren",
    declineBtn: "Ablehnen",
    privacyLink: "Lesen Sie unsere vollständige Datenschutzrichtlinie",
    ageWarning: "Dieser Service richtet sich an Eltern/Erziehungsberechtigte von Kindern von 0-3 Jahren.",
    legalBasis: "Rechtsgrundlage: Ausdrückliche Einwilligung gemäß Artikel 14 der DSGVO."
  }
};

const CONSENT_STORAGE_KEY = "wilbor_parental_consent";
const CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

export function useParentalConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already consented
    const consentData = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (consentData) {
      try {
        const { accepted, timestamp } = JSON.parse(consentData);
        const elapsed = Date.now() - timestamp;
        if (elapsed < CONSENT_DURATION) {
          setHasConsented(accepted);
          return;
        }
      } catch {
        // Invalid data, show consent again
      }
    }
    // Show consent modal
    setShowConsent(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      accepted: true,
      timestamp: Date.now()
    }));
    setHasConsented(true);
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      accepted: false,
      timestamp: Date.now()
    }));
    setHasConsented(false);
    setShowConsent(false);
  };

  return {
    showConsent,
    hasConsented,
    handleAccept,
    handleDecline
  };
}

export function ParentalConsentModal({ open, onAccept, onDecline }: ParentalConsentModalProps) {
  const { locale } = useI18n();
  const [agreed, setAgreed] = useState(false);

  const lang = locale as keyof typeof CONSENT_TEXTS;
  const content = CONSENT_TEXTS[lang] || CONSENT_TEXTS.pt;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">{content.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{content.subtitle}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Intro */}
          <p className="text-sm text-gray-600">{content.intro}</p>

          {/* Data collected */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">{content.dataCollected}</h4>
            </div>
            <ul className="space-y-2">
              {content.dataItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="text-blue-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Purpose */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900">{content.purpose}</h4>
            </div>
            <ul className="space-y-2">
              {content.purposeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rights */}
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-amber-600" />
              <h4 className="font-semibold text-amber-900">{content.rights}</h4>
            </div>
            <ul className="space-y-2">
              {content.rightsItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Agreement checkbox */}
          <div className="flex items-start gap-3 p-4 border-2 border-purple-200 rounded-xl bg-purple-50">
            <Checkbox
              id="consent-agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="consent-agree"
              className="text-sm text-gray-700 cursor-pointer"
            >
              {content.privacyLink}
            </label>
          </div>

          {/* Age warning */}
          <p className="text-xs text-gray-500 text-center">{content.ageWarning}</p>

          {/* Legal basis */}
          <p className="text-xs text-gray-400 text-center">{content.legalBasis}</p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            {content.declineBtn}
          </Button>
          <Button
            onClick={onAccept}
            disabled={!agreed}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            {content.acceptBtn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ParentalConsentModal;