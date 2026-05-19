import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Seo } from "@/components/Seo";
import { useI18n } from "@/contexts/i18n";
import { Check, ArrowRight, Heart, ShieldCheck, Sparkles, Globe } from "lucide-react";
import { useLocation } from "wouter";

const PAGE_COPY: Record<string, any> = {
  pt: {
    seoTitle: "Planos Wilbor Premium",
    seoDescription: "Compare Free, Premium e Manual do Wilbor. Entenda para quem serve, o que desbloqueia e qual caminho faz mais sentido para cada mãe.",
    badge: "Planos Wilbor",
    title: "A forma mais segura de transformar visitas do Google em mães ativas dentro do Wilbor",
    subtitle:
      "Aqui você entende rapidamente a diferença entre testar grátis, assinar o Premium e comprar um guia específico. Esta página é comercial, pública e feita para quem já chegou com intenção de decidir.",
    primaryCta: "Testar grátis no chat",
    secondaryCta: "Ir para checkout seguro",
    compareTitle: "Qual caminho faz mais sentido hoje?",
    compareSubtitle:
      "O Wilbor agora separa melhor descoberta, teste e compra. Isso reduz atrito para o tráfego orgânico e melhora a decisão.",
    cards: {
      free: {
        name: "Visita Livre",
        price: "Grátis",
        description: "Para conhecer o Wilbor antes de pagar.",
        features: [
          "5 consultas gratuitas",
          "Chat com orientação baseada em protocolos",
          "Ideal para primeira experiência",
        ],
        cta: "Experimentar agora",
      },
      premium: {
        name: "Wilbor Premium",
        price: "A partir de R$ 19,90/mês",
        description: "Para mães que querem apoio contínuo e rotina de uso.",
        features: [
          "Chat IA com uso ampliado ou ilimitado conforme plano",
          "Perfil do bebê e recursos completos",
          "Trilha de desenvolvimento e receitas",
        ],
        cta: "Ver planos no checkout",
      },
      manual: {
        name: "Guias e Manuais",
        price: "Compra única",
        description: "Para quem quer resolver uma dor específica com ticket menor.",
        features: [
          "Tema específico por dor",
          "Compra pontual",
          "Boa porta de entrada para monetização orgânica",
        ],
        cta: "Explorar guias",
      },
    },
    forTitle: "Quando cada opção converte melhor",
    forRows: [
      ["Chegou do Google com dúvida urgente", "Chat grátis"],
      ["Já entendeu o valor e quer uso recorrente", "Premium"],
      ["Quer resolver um problema específico primeiro", "Guia / manual"],
      ["Ainda está comparando soluções", "Esta página de planos"],
    ],
    benefitsTitle: "Por que esta página aumenta a conversão orgânica",
    benefits: [
      "Dá ao Google uma landing comercial indexável, sem depender do checkout técnico.",
      "Separa intenção informacional de intenção comercial.",
      "Explica Free, Premium e compra única sem confundir a visitante.",
      "Permite que a mãe escolha entre testar, assinar ou comprar um material específico.",
    ],
    faqTitle: "Dúvidas rápidas antes de decidir",
    faqs: [
      {
        q: "Preciso pagar para testar?",
        a: "Não. O caminho gratuito continua existindo pelo chat, com limite inicial de consultas.",
      },
      {
        q: "O Premium substitui o pediatra?",
        a: "Não. O Wilbor é apoio digital baseado em protocolos; em emergência, a mãe deve procurar atendimento presencial.",
      },
      {
        q: "Se eu não quiser assinatura, ainda posso comprar algo?",
        a: "Sim. A estratégia do Wilbor também comporta guias e manuais de compra única para dores específicas.",
      },
    ],
    finalTitle: "Comece pelo formato que combina com o momento da mãe",
    finalSubtitle:
      "Se a intenção é entender o produto, vá para o chat. Se a intenção já é comprar, avance para o checkout. Se a dor é específica, explore os guias.",
    trust: "Pagamento seguro via Stripe · Cancelamento simples · Conteúdo baseado em protocolos confiáveis",
    tableHeaders: ["Cenário", "Melhor destino"],
  },
  en: {
    seoTitle: "Wilbor Premium Plans",
    seoDescription: "Compare Wilbor Free, Premium and one-time guides. Understand which path fits each visitor best.",
    badge: "Wilbor Plans",
    title: "A clearer commercial page for visitors arriving from Google",
    subtitle:
      "This page explains the difference between trying Wilbor for free, subscribing to Premium and buying a specific guide.",
    primaryCta: "Try free chat",
    secondaryCta: "Go to secure checkout",
    compareTitle: "Which path makes more sense now?",
    compareSubtitle: "Wilbor now separates discovery, trial and purchase more clearly.",
    cards: {
      free: {
        name: "Free Visit",
        price: "Free",
        description: "To try Wilbor before paying.",
        features: ["5 free consultations", "Protocol-based guidance", "Best for first experience"],
        cta: "Try now",
      },
      premium: {
        name: "Wilbor Premium",
        price: "From $5.99/month",
        description: "For mothers who want continuous support.",
        features: ["Expanded or unlimited AI access", "Baby profile and core tools", "Milestones and recipes"],
        cta: "See plans in checkout",
      },
      manual: {
        name: "Guides & Manuals",
        price: "One-time purchase",
        description: "For a specific pain point with a smaller ticket.",
        features: ["Specific topic", "One-time payment", "Good organic entry offer"],
        cta: "Explore guides",
      },
    },
    forTitle: "When each option converts better",
    forRows: [
      ["Visitor arrives with an urgent question", "Free chat"],
      ["Visitor already sees the value and wants ongoing support", "Premium"],
      ["Visitor wants to solve one specific issue first", "Guide / manual"],
      ["Visitor is still comparing options", "This plans page"],
    ],
    benefitsTitle: "Why this page improves organic conversion",
    benefits: [
      "Gives Google an indexable commercial landing page.",
      "Separates informational from transactional intent.",
      "Explains Free, Premium and one-time offers more clearly.",
      "Lets the user choose between trial, subscription or a focused guide.",
    ],
    faqTitle: "Quick questions before deciding",
    faqs: [
      { q: "Do I need to pay to test it?", a: "No. The free chat path remains available with an initial consultation limit." },
      { q: "Does Premium replace a pediatrician?", a: "No. Wilbor is protocol-based digital support; emergencies still require in-person care." },
      { q: "Can I buy something without subscribing?", a: "Yes. Wilbor can also monetize through one-time guides for specific problems." },
    ],
    finalTitle: "Start with the format that matches the visitor’s moment",
    finalSubtitle: "Try chat first, go to checkout if purchase intent is already clear, or explore guides for a specific need.",
    trust: "Secure Stripe payment · Easy cancellation · Protocol-based content",
    tableHeaders: ["Scenario", "Best destination"],
  },
};

const PRICING_LOCALE_FALLBACK = {
  es: "en",
  fr: "en",
  de: "en",
};

export default function Premium() {
  const { locale, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const effectiveLocale = PAGE_COPY[locale] ? locale : (PRICING_LOCALE_FALLBACK as any)[locale] || "pt";
  const copy = PAGE_COPY[effectiveLocale] || PAGE_COPY.pt;

  const chatHref = localePath("/chat");
  const checkoutHref = localePath("/checkout");
  const shopHref = localePath("/shop");
  const premiumUrl = `https://wilbor-assist.com${localePath("/premium")}`;

  return (
    <>
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        url={premiumUrl}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setLocation(localePath("/"))}
              className="flex items-center gap-2 text-left"
            >
              <Heart className="w-7 h-7 text-purple-600 fill-purple-600" />
              <span className="text-xl font-bold text-slate-900">Wilbor</span>
            </button>

            <div className="hidden md:flex items-center gap-3 text-sm text-slate-500">
              <Globe className="w-4 h-4" />
              <span>{copy.badge}</span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-14 space-y-14">
          <section className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" /> {copy.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
              {copy.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8">
              {copy.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-14 bg-purple-600 hover:bg-purple-700">
                <a href={chatHref}>
                  {copy.primaryCta} <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 border-purple-200 text-purple-700 hover:bg-purple-50">
                <a href={checkoutHref}>{copy.secondaryCta}</a>
              </Button>
            </div>
          </section>

          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{copy.compareTitle}</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">{copy.compareSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: "free", href: chatHref, highlight: false },
                { key: "premium", href: checkoutHref, highlight: true },
                { key: "manual", href: shopHref, highlight: false },
              ].map((item) => {
                const card = copy.cards[item.key];
                return (
                  <Card
                    key={item.key}
                    className={`rounded-3xl p-8 border-2 ${item.highlight ? "border-purple-600 shadow-xl bg-white" : "border-slate-200 bg-white/90"}`}
                  >
                    <div className="mb-5">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{card.name}</h3>
                      <div className="text-3xl font-extrabold text-purple-700 mb-2">{card.price}</div>
                      <p className="text-slate-600">{card.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      className={`w-full h-12 rounded-full ${item.highlight ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-900 hover:bg-black"}`}
                    >
                      <a href={item.href}>{card.cta}</a>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="rounded-3xl p-8 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{copy.forTitle}</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">{copy.tableHeaders[0]}</th>
                      <th className="text-left px-4 py-3 font-semibold">{copy.tableHeaders[1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copy.forRows.map((row: string[], index: number) => (
                      <tr key={row[0]} className={index < copy.forRows.length - 1 ? "border-b border-slate-100" : ""}>
                        <td className="px-4 py-4 text-slate-700">{row[0]}</td>
                        <td className="px-4 py-4 font-semibold text-purple-700">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="rounded-3xl p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl border-0">
              <h2 className="text-2xl font-bold mb-5">{copy.benefitsTitle}</h2>
              <ul className="space-y-4 mb-8">
                {copy.benefits.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-sm md:text-base text-purple-50">
                    <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 rounded-2xl p-4 text-sm text-purple-50">
                {copy.trust}
              </div>
            </Card>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">{copy.faqTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {copy.faqs.map((faq: { q: string; a: string }) => (
                <div key={faq.q} className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center bg-slate-900 text-white rounded-3xl px-8 py-12 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">{copy.finalTitle}</h2>
            <p className="text-slate-300 max-w-3xl mx-auto mb-8">{copy.finalSubtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-14 bg-purple-600 hover:bg-purple-700">
                <a href={chatHref}>{copy.primaryCta}</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 border-slate-600 text-white hover:bg-slate-800">
                <a href={shopHref}>{copy.cards.manual.cta}</a>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
