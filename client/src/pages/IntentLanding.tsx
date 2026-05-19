import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Seo } from "@/components/Seo";
import { useI18n } from "@/contexts/i18n";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Moon,
  Wind,
  Thermometer,
  ShieldAlert,
  Sparkles,
  Clock3,
  MessageCircleHeart,
} from "lucide-react";
import { useLocation } from "wouter";

type TopicKey = "bebe-nao-dorme" | "colica-bebe" | "febre-bebe";

type TopicCopy = {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  title: string;
  subtitle: string;
  urgency: string;
  ctaPrimary: string;
  ctaSecondary: string;
  relatedArticleLabel: string;
  promiseTitle: string;
  promiseItems: string[];
  warningTitle: string;
  warningBody: string;
  scenariosTitle: string;
  scenarios: Array<[string, string]>;
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
  finalTitle: string;
  finalSubtitle: string;
  trust: string;
  articleSlug: string;
};

type LocaleCopy = Record<TopicKey, TopicCopy>;

const PT_COPY: LocaleCopy = {
  "bebe-nao-dorme": {
    seoTitle: "Bebê não dorme? Ajuda prática com o Wilbor",
    seoDescription:
      "Entenda quando o bebê não dorme, o que observar na rotina e como o Wilbor ajuda com respostas práticas, sem chute e sem enrolação.",
    badge: "Landing de alta intenção · Sono do bebê",
    title: "Bebê não dorme? Tenha um caminho prático antes do desespero virar rotina.",
    subtitle:
      "Quando a mãe chega do Google com urgência, ela não quer teoria demais. Ela quer entender o que pode estar acontecendo agora e qual o próximo passo mais seguro.",
    urgency: "Ideal para mães cansadas, com dúvida imediata sobre sono, despertares, janela de sono e rotina noturna.",
    ctaPrimary: "Perguntar no chat agora",
    ctaSecondary: "Ver planos do Wilbor",
    relatedArticleLabel: "Ler artigo relacionado",
    promiseTitle: "O que a mãe encontra aqui",
    promiseItems: [
      "Orientação prática baseada na idade, rotina e sinais do bebê.",
      "Ajuda para diferenciar regressão, desconforto, fome, rotina ruim ou excesso de estímulo.",
      "Um caminho claro entre testar grátis, aprofundar no blog e usar apoio contínuo no Premium.",
    ],
    warningTitle: "Quando não é para insistir em tentativa caseira",
    warningBody:
      "Se o bebê estiver com dificuldade para respirar, febre, gemência, moleza fora do padrão ou recusa persistente de mamadas, a prioridade não é ajustar o sono: é buscar avaliação presencial.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarios: [
      ["A mãe quer resposta imediata sobre o que fazer hoje à noite", "Chat gratuito do Wilbor"],
      ["A dúvida é recorrente e a rotina virou problema diário", "Plano Premium"],
      ["Ela ainda está pesquisando e comparando", "Artigo aprofundado do blog"],
    ],
    faqTitle: "Dúvidas rápidas sobre sono do bebê",
    faqs: [
      {
        q: "O Wilbor substitui o pediatra ou consultora de sono?",
        a: "Não. O Wilbor é apoio digital para orientar a tomada de decisão cotidiana. Em sinais de alerta ou suspeita clínica, a mãe deve procurar atendimento presencial.",
      },
      {
        q: "Serve para recém-nascido e para bebê maior?",
        a: "Sim. A utilidade é justamente adaptar a resposta à fase do bebê, porque sono de recém-nascido e sono de um bebê maior não seguem a mesma lógica.",
      },
      {
        q: "Preciso pagar para entender se faz sentido para mim?",
        a: "Não. A mãe pode começar pelo chat gratuito e só depois decidir se quer aprofundar o uso com plano ou guia.",
      },
    ],
    finalTitle: "Transforme uma busca desesperada em uma decisão prática.",
    finalSubtitle:
      "Se a dúvida é sobre hoje, comece pelo chat. Se o problema virou padrão, avance para os planos e use o Wilbor como apoio recorrente.",
    trust: "Baseado em protocolos confiáveis · Linguagem prática · Pensado para mães reais, não para respostas genéricas",
    articleSlug: "bebe-nao-dorme",
  },
  "colica-bebe": {
    seoTitle: "Cólica do bebê: orientação prática com o Wilbor",
    seoDescription:
      "Saiba como diferenciar cólica, desconforto, fome ou sobrecarga no bebê e como o Wilbor ajuda a mãe com respostas rápidas e práticas.",
    badge: "Landing de alta intenção · Cólica do bebê",
    title: "Cólica do bebê? A mãe precisa de clareza, não de mais confusão.",
    subtitle:
      "Quando o bebê chora sem parar, a busca no Google normalmente vem com urgência emocional. Esta página existe para transformar essa busca em ação segura e objetiva.",
    urgency: "Ideal para mães que querem saber o que testar agora, o que observar e quando o choro deixa de parecer cólica comum.",
    ctaPrimary: "Tirar a dúvida no chat",
    ctaSecondary: "Conhecer os planos",
    relatedArticleLabel: "Ler artigo sobre cólica",
    promiseTitle: "Como o Wilbor ajuda nessa dor",
    promiseItems: [
      "Ajuda a mãe a organizar sinais, horários, alimentação e padrão de choro.",
      "Orienta medidas práticas como posição, colo, rotina e técnicas de alívio sem resposta genérica demais.",
      "Mostra quando a situação parece cólica comum e quando já merece atenção presencial.",
    ],
    warningTitle: "Sinais para não tratar como cólica simples",
    warningBody:
      "Se houver febre, sangue nas fezes, vômitos persistentes, barriga muito distendida, bebê muito molinho ou irritação fora do padrão, a mãe deve procurar avaliação médica e não apenas testar medidas de conforto.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarios: [
      ["A mãe quer uma orientação prática para o choro de agora", "Chat gratuito do Wilbor"],
      ["A cólica está recorrente e virou rotina de sofrimento", "Plano Premium"],
      ["Ela quer aprofundar primeiro com conteúdo", "Artigo detalhado do blog"],
    ],
    faqTitle: "Dúvidas rápidas sobre cólica",
    faqs: [
      {
        q: "O Wilbor diz se é cólica com certeza?",
        a: "Ele não fecha diagnóstico médico. O papel é ajudar a mãe a interpretar sinais, contexto e urgência com muito mais clareza do que uma busca genérica.",
      },
      {
        q: "Posso usar se meu bebê ainda é muito pequeno?",
        a: "Sim, principalmente porque nessa fase a insegurança é maior e cada detalhe da rotina faz diferença na leitura do problema.",
      },
      {
        q: "Essa orientação é só para cólica ou serve para outros desconfortos?",
        a: "Serve também para ajudar a separar cólica de fome, sono ruim, excesso de estímulo e outros desconfortos comuns.",
      },
    ],
    finalTitle: "Quando o choro aperta, a resposta precisa aliviar — não confundir mais.",
    finalSubtitle:
      "Comece com a dúvida concreta no chat ou avance para os planos se essa dor já está se repetindo todos os dias.",
    trust: "Acolhimento prático · Organização de sinais · Apoio contínuo quando a mãe mais precisa",
    articleSlug: "colica-do-bebe",
  },
  "febre-bebe": {
    seoTitle: "Febre no bebê: quando observar e quando agir com o Wilbor",
    seoDescription:
      "Entenda febre no bebê com mais clareza: o que observar, quando é urgência e como o Wilbor ajuda a mãe a decidir com mais segurança.",
    badge: "Landing de alta intenção · Febre no bebê",
    title: "Febre no bebê? Primeiro, decidir certo. Depois, agir rápido.",
    subtitle:
      "Febre gera medo porque pode ser algo simples ou um sinal de urgência. O valor do Wilbor aqui é ajudar a mãe a ler o contexto com mais clareza e menos pânico desorganizado.",
    urgency: "Ideal para mães que precisam distinguir observação segura, sinais de alerta e momento de procurar atendimento presencial.",
    ctaPrimary: "Avaliar a situação no chat",
    ctaSecondary: "Ver planos e suporte contínuo",
    relatedArticleLabel: "Ler artigo sobre febre",
    promiseTitle: "O que esta página resolve melhor",
    promiseItems: [
      "Ajuda a mãe a identificar quais sinais importam junto com a febre.",
      "Diferencia cenário de observação em casa de cenário que pede pronto atendimento.",
      "Transforma busca ansiosa em uma decisão mais organizada e segura.",
    ],
    warningTitle: "Sinais de alerta que mudam tudo",
    warningBody:
      "Febre em bebê pequeno, moleza intensa, dificuldade para respirar, convulsão, manchas no corpo, recusa persistente de mamadas ou alteração importante de comportamento exigem avaliação presencial imediata.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarios: [
      ["A mãe quer entender rapidamente o risco e os próximos passos", "Chat gratuito do Wilbor"],
      ["Ela quer manter apoio recorrente para outras intercorrências", "Plano Premium"],
      ["Ela quer começar por conteúdo explicativo", "Artigo detalhado do blog"],
    ],
    faqTitle: "Dúvidas rápidas sobre febre no bebê",
    faqs: [
      {
        q: "O Wilbor substitui a ida ao pronto atendimento?",
        a: "Não. Se houver sinal de alerta, a orientação correta continua sendo buscar atendimento presencial. O Wilbor ajuda a mãe a perceber esse limite com mais clareza.",
      },
      {
        q: "É útil mesmo se eu já medi a temperatura?",
        a: "Sim. A decisão não depende só do número. Idade do bebê, comportamento, mamadas e sinais associados mudam bastante a leitura.",
      },
      {
        q: "Posso usar o chat gratuitamente antes de assinar?",
        a: "Sim. O caminho gratuito continua sendo a melhor porta de entrada para quem quer testar antes de assumir uso recorrente.",
      },
    ],
    finalTitle: "Em febre, a melhor ajuda é a que organiza a decisão da mãe.",
    finalSubtitle:
      "Se a situação é de agora, vá para o chat. Se você quer apoio contínuo para várias dores do dia a dia, veja os planos do Wilbor.",
    trust: "Clareza em situações delicadas · Apoio prático · Respeito aos sinais de urgência",
    articleSlug: "febre-no-bebe",
  },
};

const EN_COPY: LocaleCopy = {
  "bebe-nao-dorme": {
    seoTitle: "Baby won’t sleep? Practical support with Wilbor",
    seoDescription:
      "Understand what may be behind baby sleep struggles and how Wilbor helps mothers decide what to do next with more clarity.",
    badge: "High-intent landing · Baby sleep",
    title: "Baby won’t sleep? Turn late-night panic into a practical next step.",
    subtitle:
      "Visitors arriving from Google usually want help now, not generic theory. This page helps them move from confusion to action.",
    urgency: "Best for mothers looking for immediate help with night waking, sleep windows and bedtime routine.",
    ctaPrimary: "Ask in chat now",
    ctaSecondary: "See Wilbor plans",
    relatedArticleLabel: "Read related article",
    promiseTitle: "What this page helps with",
    promiseItems: [
      "Age-aware and routine-aware support.",
      "A more practical way to interpret hunger, overstimulation, regression or discomfort.",
      "A clear path between free chat, blog content and ongoing Premium support.",
    ],
    warningTitle: "When home trial-and-error is not enough",
    warningBody:
      "If the baby has fever, breathing difficulty, unusual lethargy or persistent feeding refusal, sleep is no longer the only issue and in-person evaluation becomes the priority.",
    scenariosTitle: "Best destination for each moment",
    scenarios: [
      ["The mother needs practical help for tonight", "Free Wilbor chat"],
      ["Sleep problems have become a repeated pattern", "Premium plan"],
      ["She is still researching and comparing", "Related blog article"],
    ],
    faqTitle: "Quick questions about baby sleep",
    faqs: [
      { q: "Does Wilbor replace a pediatrician?", a: "No. Wilbor is digital support for daily decision-making, not a replacement for medical care." },
      { q: "Is it useful for newborns too?", a: "Yes. The value is precisely in adapting guidance to the baby’s stage and routine." },
      { q: "Can I try before paying?", a: "Yes. The free chat remains the best first step for mothers who want to test first." },
    ],
    finalTitle: "Make one urgent search lead to one clear decision.",
    finalSubtitle: "Use chat for immediate help, and Premium when sleep struggles become a repeated issue.",
    trust: "Protocol-based guidance · Practical language · Built for real mothers",
    articleSlug: "bebe-nao-dorme",
  },
  "colica-bebe": {
    seoTitle: "Baby colic: practical guidance with Wilbor",
    seoDescription:
      "Understand baby colic with more clarity and see how Wilbor helps mothers distinguish common discomfort from warning signs.",
    badge: "High-intent landing · Baby colic",
    title: "Baby colic? What mothers need most is clarity under pressure.",
    subtitle:
      "When crying becomes relentless, the search is emotional and urgent. This page helps convert that anxiety into a more practical response.",
    urgency: "Best for mothers who want to know what to test now and when crying no longer looks like ordinary colic.",
    ctaPrimary: "Ask about the crying now",
    ctaSecondary: "See Wilbor plans",
    relatedArticleLabel: "Read colic article",
    promiseTitle: "How this page helps",
    promiseItems: [
      "Organizes the context behind crying, feeding and routine.",
      "Offers a more practical way to assess relief measures.",
      "Helps mothers understand when the situation may need in-person care.",
    ],
    warningTitle: "Warning signs that should not be treated as simple colic",
    warningBody:
      "Fever, blood in stools, persistent vomiting, marked abdominal distension, unusual lethargy or very abnormal crying patterns deserve medical evaluation.",
    scenariosTitle: "Best destination for each moment",
    scenarios: [
      ["The mother wants immediate practical support", "Free Wilbor chat"],
      ["Colic has become frequent and overwhelming", "Premium plan"],
      ["She wants to read before deciding", "Related blog article"],
    ],
    faqTitle: "Quick questions about colic",
    faqs: [
      { q: "Does Wilbor diagnose colic?", a: "No. It helps organize signs and urgency with more clarity than a generic search." },
      { q: "Can I use it for very young babies?", a: "Yes, especially when routine details make a major difference in interpretation." },
      { q: "Is it only for colic?", a: "No. It also helps separate colic from hunger, poor sleep and overstimulation." },
    ],
    finalTitle: "When crying escalates, guidance should reduce noise, not add more.",
    finalSubtitle: "Start in chat for immediate doubt, or move to Premium if this has become a daily problem.",
    trust: "Practical support · Better signal reading · Ongoing help when needed most",
    articleSlug: "colica-do-bebe",
  },
  "febre-bebe": {
    seoTitle: "Fever in babies: what to watch and when to act",
    seoDescription:
      "See how Wilbor helps mothers understand fever context, warning signs and next steps with more confidence.",
    badge: "High-intent landing · Fever in babies",
    title: "Fever in babies? The first task is to decide well, then act fast.",
    subtitle:
      "Fever is scary because it can be mild or urgent. This page exists to help mothers interpret the broader picture with less chaos.",
    urgency: "Best for mothers who need to distinguish safe observation from urgent medical attention.",
    ctaPrimary: "Assess the situation in chat",
    ctaSecondary: "See Wilbor plans",
    relatedArticleLabel: "Read fever article",
    promiseTitle: "What this page solves better",
    promiseItems: [
      "Helps mothers identify which accompanying signs matter most.",
      "Separates home observation from urgent-care scenarios more clearly.",
      "Turns a worried search into a more structured decision.",
    ],
    warningTitle: "Warning signs that change the decision",
    warningBody:
      "Fever in very young babies, breathing difficulty, convulsions, unusual lethargy, persistent feeding refusal or major behavior change require in-person care.",
    scenariosTitle: "Best destination for each moment",
    scenarios: [
      ["The mother needs quick clarity right now", "Free Wilbor chat"],
      ["She wants ongoing support for multiple daily issues", "Premium plan"],
      ["She prefers content before interacting", "Related blog article"],
    ],
    faqTitle: "Quick questions about fever",
    faqs: [
      { q: "Does Wilbor replace urgent care?", a: "No. If warning signs exist, in-person care remains the correct path." },
      { q: "Is it useful even if I already measured the temperature?", a: "Yes. Age, behavior and feeding matter just as much as the number itself." },
      { q: "Can I try chat before subscribing?", a: "Yes. Free chat remains the best entry point to test first." },
    ],
    finalTitle: "In fever, the best help is the one that organizes the mother’s next decision.",
    finalSubtitle: "Use chat for the immediate situation and Premium for broader ongoing support.",
    trust: "Better clarity under pressure · Practical support · Respect for warning signs",
    articleSlug: "febre-no-bebe",
  },
};

const TOPIC_ICON = {
  "bebe-nao-dorme": Moon,
  "colica-bebe": Wind,
  "febre-bebe": Thermometer,
} as const;

function getCopy(locale: string): LocaleCopy {
  if (locale === "pt") return PT_COPY;
  return EN_COPY;
}

function IntentLanding({ topic }: { topic: TopicKey }) {
  const { locale, localePath } = useI18n();
  const [, setLocation] = useLocation();
  const copy = getCopy(locale)[topic] || PT_COPY[topic];
  const Icon = TOPIC_ICON[topic];

  const chatHref = localePath("/chat");
  const premiumHref = localePath("/premium");
  const blogHref = localePath(`/blog/${copy.articleSlug}`);
  const canonicalUrl = `https://wilbor-assist.com${localePath(`/${topic}`)}`;

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} url={canonicalUrl} type="website" />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <button onClick={() => setLocation(localePath("/"))} className="flex items-center gap-2 text-left">
              <Heart className="w-7 h-7 text-purple-600 fill-purple-600" />
              <span className="text-xl font-bold text-slate-900">Wilbor</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span>{copy.badge}</span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-14 space-y-14">
          <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                <Icon className="w-4 h-4" /> {copy.badge}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
                {copy.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-5">{copy.subtitle}</p>
              <p className="text-sm md:text-base text-rose-700 font-medium mb-8">{copy.urgency}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button asChild size="lg" className="rounded-full px-8 h-14 bg-purple-600 hover:bg-purple-700">
                  <a href={chatHref}>
                    {copy.ctaPrimary} <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <a href={premiumHref}>{copy.ctaSecondary}</a>
                </Button>
              </div>

              <div className="text-sm text-slate-500">{copy.trust}</div>
            </div>

            <Card className="rounded-3xl border-rose-100 bg-white/90 shadow-xl p-8">
              <div className="flex items-center gap-3 mb-5 text-slate-900">
                <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                  <MessageCircleHeart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">{copy.promiseTitle}</h2>
                  <p className="text-sm text-slate-500">Wilbor orienta a mãe com mais contexto e menos ruído.</p>
                </div>
              </div>

              <ul className="space-y-4">
                {copy.promiseItems.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
            <Card className="rounded-3xl border-amber-200 bg-amber-50 p-8">
              <div className="flex items-center gap-3 mb-4 text-amber-900">
                <ShieldAlert className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{copy.warningTitle}</h2>
              </div>
              <p className="text-amber-950/80 leading-relaxed">{copy.warningBody}</p>
            </Card>

            <Card className="rounded-3xl border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3 mb-5 text-slate-900">
                <Clock3 className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">{copy.scenariosTitle}</h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 bg-slate-900 text-white text-sm font-semibold">
                  <div className="px-4 py-3">Cenário</div>
                  <div className="px-4 py-3">Melhor destino</div>
                </div>
                {copy.scenarios.map(([left, right], index) => (
                  <div key={left} className={`grid grid-cols-2 ${index < copy.scenarios.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div className="px-4 py-4 bg-slate-50 text-slate-700 text-sm leading-relaxed">{left}</div>
                    <div className="px-4 py-4 bg-white text-slate-900 text-sm font-medium leading-relaxed">{right}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid lg:grid-cols-[1fr_1fr] gap-8">
            <Card className="rounded-3xl border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{copy.faqTitle}</h2>
              <div className="space-y-5">
                {copy.faqs.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl border-purple-100 bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-4">{copy.finalTitle}</h2>
              <p className="text-purple-50 leading-relaxed mb-8">{copy.finalSubtitle}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 h-14 bg-white text-purple-700 hover:bg-purple-50">
                  <a href={chatHref}>{copy.ctaPrimary}</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 border-white text-white hover:bg-white/10">
                  <a href={blogHref}>{copy.relatedArticleLabel}</a>
                </Button>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}

export function BabySleepLanding() {
  return <IntentLanding topic="bebe-nao-dorme" />;
}

export function ColicLanding() {
  return <IntentLanding topic="colica-bebe" />;
}

export function FeverLanding() {
  return <IntentLanding topic="febre-bebe" />;
}
