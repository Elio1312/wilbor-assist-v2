/**
 * CAPTCHA Anti-Abuse Challenge
 * Simple visual challenge to prevent automated abuse
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Check, X, RefreshCw } from "lucide-react";
import { useI18n } from "@/contexts/i18n";

interface CaptchaChallengeProps {
  onVerified: () => void;
  onCancel?: () => void;
  maxAttempts?: number;
}

// Simple math challenge generator
function generateChallenge() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let answer: number;
  let expression: string;

  switch (operator) {
    case "+":
      answer = num1 + num2;
      expression = `${num1} + ${num2}`;
      break;
    case "-":
      // Ensure positive result
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      expression = `${larger} - ${smaller}`;
      break;
    case "×":
      // Keep numbers small for multiplication
      const n1 = Math.floor(Math.random() * 5) + 1;
      const n2 = Math.floor(Math.random() * 5) + 1;
      answer = n1 * n2;
      expression = `${n1} × ${n2}`;
      break;
    default:
      answer = num1 + num2;
      expression = `${num1} + ${num2}`;
  }

  return { expression, answer };
}

export function CaptchaChallenge({
  onVerified,
  onCancel,
  maxAttempts = 3
}: CaptchaChallengeProps) {
  const { t, locale } = useI18n();
  const [challenge, setChallenge] = useState(() => generateChallenge());
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const numericAnswer = parseInt(userAnswer.replace(/[^0-9]/g, ""), 10);

    if (numericAnswer === challenge.answer) {
      setSuccess(true);
      // Delay to show success state
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      // Generate new challenge
      setChallenge(generateChallenge());
      setUserAnswer("");

      // Auto-close after max attempts
      if (attempts + 1 >= maxAttempts && onCancel) {
        setTimeout(() => {
          onCancel();
        }, 2000);
      }

      // Clear error after 2 seconds
      setTimeout(() => setError(false), 2000);
    }
  }, [userAnswer, challenge.answer, attempts, maxAttempts, onVerified, onCancel]);

  const handleRefresh = useCallback(() => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setError(false);
  }, []);

  // Localized texts
  const texts = {
    pt: {
      title: "Verificação de segurança",
      subtitle: "Prove que você é humano resolvendo este cálculo:",
      placeholder: "Sua resposta...",
      submit: "Verificar",
      cancel: "Cancelar",
      success: "Verificado!",
      error: "Resposta incorreta",
      attempts: (a: number, m: number) => `Tentativa ${a} de ${m}`,
      reason: "Isso ajuda a proteger o serviço contra uso abusivo.",
    },
    en: {
      title: "Security verification",
      subtitle: "Prove you're human by solving this calculation:",
      placeholder: "Your answer...",
      submit: "Verify",
      cancel: "Cancel",
      success: "Verified!",
      error: "Incorrect answer",
      attempts: (a: number, m: number) => `Attempt ${a} of ${m}`,
      reason: "This helps protect the service against abuse.",
    },
    es: {
      title: "Verificación de seguridad",
      subtitle: "Demuestra que eres humano resolviendo este cálculo:",
      placeholder: "Tu respuesta...",
      submit: "Verificar",
      cancel: "Cancelar",
      success: "¡Verificado!",
      error: "Respuesta incorrecta",
      attempts: (a: number, m: number) => `Intento ${a} de ${m}`,
      reason: "Esto ayuda a proteger el servicio contra uso abusivo.",
    },
    fr: {
      title: "Vérification de sécurité",
      subtitle: "Prouvez que vous êtes humain en résolvant ce calcul:",
      placeholder: "Votre réponse...",
      submit: "Vérifier",
      cancel: "Annuler",
      success: "Vérifié!",
      error: "Réponse incorrecte",
      attempts: (a: number, m: number) => `Tentative ${a} sur ${m}`,
      reason: "Cela aide à protéger le service contre les abus.",
    },
    de: {
      title: "Sicherheitsüberprüfung",
      subtitle: "Beweisen Sie, dass Sie menschlich sind, indem Sie diese Berechnung lösen:",
      placeholder: "Ihre Antwort...",
      submit: "Überprüfen",
      cancel: "Abbrechen",
      success: "Verifiziert!",
      error: "Falsche Antwort",
      attempts: (a: number, m: number) => `Versuch ${a} von ${m}`,
      reason: "Dies hilft, den Service vor Missbrauch zu schützen.",
    },
  };

  const lang = locale as keyof typeof texts;
  const content = texts[lang] || texts.pt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-sm text-gray-500">{content.attempts(attempts + 1, maxAttempts)}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{content.subtitle}</p>

        {success ? (
          <div className="flex flex-col items-center py-8">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-700">{content.success}</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
                  <span className="text-3xl font-bold text-gray-900 font-mono">
                    {challenge.expression}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Nova conta"
                >
                  <RefreshCw className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={content.placeholder}
                className={`w-full px-4 py-3 border-2 rounded-xl text-center text-xl font-mono
                  focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all
                  ${error ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />

              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <X className="w-4 h-4" />
                  <span className="text-sm">{content.error}</span>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">{content.reason}</p>

              <div className="flex gap-3 mt-6">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                  >
                    {content.cancel}
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={!userAnswer.trim()}
                >
                  {content.submit}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

// Hook para gerenciar verificação CAPTCHA
const CAPTCHA_THRESHOLD_KEY = "wilbor_captcha_verified";
const CAPTCHA_VERIFIED_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useCaptchaVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  useEffect(() => {
    // Check if user was recently verified
    const verifiedAt = localStorage.getItem(CAPTCHA_THRESHOLD_KEY);
    if (verifiedAt) {
      const elapsed = Date.now() - parseInt(verifiedAt, 10);
      if (elapsed < CAPTCHA_VERIFIED_DURATION) {
        setIsVerified(true);
      } else {
        localStorage.removeItem(CAPTCHA_THRESHOLD_KEY);
      }
    }
  }, []);

  const handleVerified = useCallback(() => {
    localStorage.setItem(CAPTCHA_THRESHOLD_KEY, Date.now().toString());
    setIsVerified(true);
    setShowCaptcha(false);
  }, []);

  const requestVerification = useCallback(() => {
    if (!isVerified) {
      setShowCaptcha(true);
    }
    return !isVerified;
  }, [isVerified]);

  const dismissCaptcha = useCallback(() => {
    setShowCaptcha(false);
  }, []);

  return {
    isVerified,
    showCaptcha,
    handleVerified,
    requestVerification,
    dismissCaptcha,
    CaptchaComponent: showCaptcha ? (
      <CaptchaChallenge
        onVerified={handleVerified}
        onCancel={dismissCaptcha}
      />
    ) : null,
  };
}

export default CaptchaChallenge;
