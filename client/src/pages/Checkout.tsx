import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/contexts/i18n";
import { Heart, Check, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { t, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("premium");

  // Prevent Google from indexing private/auth-required pages
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  
  // 1. Mutação conectada ao Stripe Multi-Currency revisado
  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error(t("checkout.error"));
    }
  });

  const handleSubscribe = () => {
    const amount = selectedPlan === "premium" ? 29 : 9.9;
    checkout.mutate({ amount, currency: "brl" });
  };

  const features = t("paywall.features").split(",");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setLocation(localePath("/dashboard"))}
          className="mb-8 gap-2 text-gray-500"
        >
          <ArrowLeft className="size-4" /> {t("common.back")}
        </Button>

        <div className="text-center mb-12">
          <Heart className="size-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">{t("checkout.title")}</h1>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{t("checkout.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {(["basic", "premium"] as const).map((plan) => (
            <Card 
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 cursor-pointer transition-all border-2 flex flex-col ${
                selectedPlan === plan ? "border-purple-600 shadow-md" : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-purple-600">
                  {plan === "premium" ? t("pricing.premium_popular") : t("pricing.free_name")}
                </span>
                {selectedPlan === plan && <Check className="size-5 text-purple-600" />}
              </div>
              <h2 className="text-xl font-bold mb-4 capitalize">
                {plan === "premium" ? t("pricing.premium_name") : t("pricing.free_name")}
              </h2>
              <ul className="space-y-3 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="size-4 text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Button
            onClick={handleSubscribe}
            disabled={checkout.isPending}
            className="w-full max-w-md h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-transform"
          >
            {checkout.isPending ? (
              <Loader2 className="size-5 animate-spin mr-2" />
            ) : (
              t("checkout.cta")
            )}
          </Button>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <ShieldCheck className="size-4 text-green-500" /> Pagamento Seguro via Stripe
            </div>
            <span className="hidden sm:inline">•</span>
            <div>Cancelamento fácil a qualquer momento</div>
          </div>
        </div>
      </div>
    </div>
  );
}
