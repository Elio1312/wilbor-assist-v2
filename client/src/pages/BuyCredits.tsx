import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, Loader2, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function BuyCredits() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const creditOptions = trpc.stripe.getCreditOptions.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  useEffect(() => {
    // Verificar se voltou do Stripe com sucesso
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentStatus("success");
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    }
  }, [setLocation]);

  const handleBuyCredits = async (amountReais: number) => {
    if (!user) return;

    setIsLoading(true);
    setPaymentStatus("processing");
    setSelectedOption(amountReais.toString());

    try {
      const result = await createCheckout.mutateAsync({ amountReais });

      if (result.success && result.url) {
        // Redirecionar para Stripe Checkout
        window.location.href = result.url;
      } else {
        setPaymentStatus("error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setPaymentStatus("error");
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="p-8 text-center max-w-md">
          <Heart className="mx-auto mb-4 size-12 text-purple-600" />
          <h2 className="mb-4 text-2xl font-bold">Faça login primeiro</h2>
          <p className="mb-6 text-gray-600">
            Você precisa estar logado para comprar créditos
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Voltar à Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compre Créditos Extras
          </h1>
          <p className="text-xl text-gray-600">
            Continue usando IA inteligente com créditos adicionais
          </p>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === "success" && (
          <div className="mb-8 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
            <Check className="mx-auto mb-3 size-12 text-green-600" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              ✅ Pagamento Recebido!
            </h3>
            <p className="text-green-700">
              Seus créditos foram adicionados. Redirecionando para o dashboard...
            </p>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-6 text-center">
            <h3 className="text-xl font-bold text-red-900 mb-2">
              ❌ Erro ao processar pagamento
            </h3>
            <p className="text-red-700 mb-4">
              Não conseguimos processar sua solicitação. Tente novamente.
            </p>
            <Button
              onClick={() => setPaymentStatus("idle")}
              className="bg-red-600 hover:bg-red-700"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Credit Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {creditOptions.data?.map((option) => (
            <Card
              key={option.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedOption === option.amountReais.toString()
                  ? "ring-2 ring-purple-600 shadow-lg"
                  : "hover:shadow-lg"
              } ${option.popular ? "md:scale-105" : ""}`}
              onClick={() => setSelectedOption(option.amountReais.toString())}
            >
              {option.popular && (
                <div className="mb-4 inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Mais Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  R$ {option.amountReais.toFixed(2)}
                </h3>
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {option.creditsReceived}
                </p>
                <p className="text-sm text-gray-600">créditos</p>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>Acesso imediato</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>Válido por 30 dias</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-4 text-green-600" />
                  <span>Sem cancelamento automático</span>
                </div>
              </div>

              <Button
                onClick={() => handleBuyCredits(option.amountReais)}
                disabled={isLoading}
                className={`w-full ${
                  option.popular
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                {isLoading && selectedOption === option.amountReais.toString() ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Comprar Agora"
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="bg-purple-50 p-6 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">💡 Como funciona?</h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>✅ Seus créditos extras são adicionados imediatamente após o pagamento</li>
            <li>✅ Créditos não utilizados passam para o próximo mês</li>
            <li>✅ Você só paga quando precisa de créditos extras</li>
            <li>✅ Suporte prioritário incluído</li>
          </ul>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
