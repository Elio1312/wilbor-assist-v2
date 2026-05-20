import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Seo } from "@/components/Seo";
import { useI18n } from "@/contexts/i18n";
import { generateFAQSchema } from "@/lib/seo";
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

type TopicKey = "bebe-nao-dorme" | "colica-bebe" | "febre-bebe";
type SupportedLocale = "pt" | "en" | "es" | "fr" | "de";

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
  promiseSubtitle: string;
  promiseItems: string[];
  warningTitle: string;
  warningBody: string;
  scenariosTitle: string;
  scenarioHeaders: [string, string];
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
    promiseSubtitle: "O Wilbor orienta a mãe com mais contexto e menos ruído.",
    promiseItems: [
      "Orientação prática baseada na idade, rotina e sinais do bebê.",
      "Ajuda para diferenciar regressão, desconforto, fome, rotina ruim ou excesso de estímulo.",
      "Um caminho claro entre testar grátis, aprofundar no blog e usar apoio contínuo no Premium.",
    ],
    warningTitle: "Quando não é para insistir em tentativa caseira",
    warningBody:
      "Se o bebê estiver com dificuldade para respirar, febre, gemência, moleza fora do padrão ou recusa persistente de mamadas, a prioridade não é ajustar o sono: é buscar avaliação presencial.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarioHeaders: ["Cenário", "Melhor destino"],
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
    promiseSubtitle: "Apoio acolhedor para organizar sinais e reduzir o ruído do momento.",
    promiseItems: [
      "Ajuda a mãe a organizar sinais, horários, alimentação e padrão de choro.",
      "Orienta medidas práticas como posição, colo, rotina e técnicas de alívio sem resposta genérica demais.",
      "Mostra quando a situação parece cólica comum e quando já merece atenção presencial.",
    ],
    warningTitle: "Sinais para não tratar como cólica simples",
    warningBody:
      "Se houver febre, sangue nas fezes, vômitos persistentes, barriga muito distendida, bebê muito molinho ou irritação fora do padrão, a mãe deve procurar avaliação médica e não apenas testar medidas de conforto.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarioHeaders: ["Cenário", "Melhor destino"],
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
    promiseSubtitle: "Clareza para a mãe agir com mais segurança em um momento sensível.",
    promiseItems: [
      "Ajuda a mãe a identificar quais sinais importam junto com a febre.",
      "Diferencia cenário de observação em casa de cenário que pede pronto atendimento.",
      "Transforma busca ansiosa em uma decisão mais organizada e segura.",
    ],
    warningTitle: "Sinais de alerta que mudam tudo",
    warningBody:
      "Febre em bebê pequeno, moleza intensa, dificuldade para respirar, convulsão, manchas no corpo, recusa persistente de mamadas ou alteração importante de comportamento exigem avaliação presencial imediata.",
    scenariosTitle: "Melhor destino para cada momento",
    scenarioHeaders: ["Cenário", "Melhor destino"],
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
    promiseSubtitle: "Wilbor guides mothers with more context and less noise.",
    promiseItems: [
      "Age-aware and routine-aware support.",
      "A more practical way to interpret hunger, overstimulation, regression or discomfort.",
      "A clear path between free chat, blog content and ongoing Premium support.",
    ],
    warningTitle: "When home trial-and-error is not enough",
    warningBody:
      "If the baby has fever, breathing difficulty, unusual lethargy or persistent feeding refusal, sleep is no longer the only issue and in-person evaluation becomes the priority.",
    scenariosTitle: "Best destination for each moment",
    scenarioHeaders: ["Scenario", "Best destination"],
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
    articleSlug: "baby-wont-sleep",
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
    promiseSubtitle: "Warm guidance to organize signals and reduce confusion.",
    promiseItems: [
      "Organizes the context behind crying, feeding and routine.",
      "Offers a more practical way to assess relief measures.",
      "Helps mothers understand when the situation may need in-person care.",
    ],
    warningTitle: "Warning signs that should not be treated as simple colic",
    warningBody:
      "Fever, blood in stools, persistent vomiting, marked abdominal distension, unusual lethargy or very abnormal crying patterns deserve medical evaluation.",
    scenariosTitle: "Best destination for each moment",
    scenarioHeaders: ["Scenario", "Best destination"],
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
    articleSlug: "baby-colic-relief",
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
    promiseSubtitle: "Better clarity so the mother can act with more confidence.",
    promiseItems: [
      "Helps mothers identify which accompanying signs matter most.",
      "Separates home observation from urgent-care scenarios more clearly.",
      "Turns a worried search into a more structured decision.",
    ],
    warningTitle: "Warning signs that change the decision",
    warningBody:
      "Fever in very young babies, breathing difficulty, convulsions, unusual lethargy, persistent feeding refusal or major behavior change require in-person care.",
    scenariosTitle: "Best destination for each moment",
    scenarioHeaders: ["Scenario", "Best destination"],
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
    articleSlug: "baby-fever-guide",
  },
};

const ES_COPY: LocaleCopy = {
  "bebe-nao-dorme": {
    seoTitle: "¿El bebé no duerme? Ayuda práctica con Wilbor",
    seoDescription:
      "Entiende por qué el bebé no duerme, qué observar en la rutina y cómo Wilbor ayuda a las madres con respuestas prácticas y claras.",
    badge: "Landing de alta intención · Sueño del bebé",
    title: "¿El bebé no duerme? Ten un camino práctico antes de que la desesperación se vuelva rutina.",
    subtitle:
      "Cuando una madre llega desde Google con urgencia, no quiere teoría de más. Quiere entender qué puede estar pasando ahora y cuál es el siguiente paso más seguro.",
    urgency: "Ideal para madres cansadas, con dudas inmediatas sobre sueño, despertares, ventanas de sueño y rutina nocturna.",
    ctaPrimary: "Preguntar en el chat ahora",
    ctaSecondary: "Ver planes de Wilbor",
    relatedArticleLabel: "Leer artículo relacionado",
    promiseTitle: "Lo que la madre encuentra aquí",
    promiseSubtitle: "Wilbor orienta a la madre con más contexto y menos ruido.",
    promiseItems: [
      "Orientación práctica basada en la edad, la rutina y las señales del bebé.",
      "Ayuda a diferenciar regresión, incomodidad, hambre, mala rutina o exceso de estímulo.",
      "Un camino claro entre probar gratis, profundizar en el blog y usar apoyo continuo en Premium.",
    ],
    warningTitle: "Cuándo no conviene insistir con pruebas caseras",
    warningBody:
      "Si el bebé tiene dificultad para respirar, fiebre, quejidos, decaimiento fuera de lo habitual o rechazo persistente de las tomas, la prioridad no es ajustar el sueño, sino buscar atención presencial.",
    scenariosTitle: "Mejor destino para cada momento",
    scenarioHeaders: ["Escenario", "Mejor destino"],
    scenarios: [
      ["La madre quiere una respuesta inmediata sobre qué hacer esta noche", "Chat gratuito de Wilbor"],
      ["La duda se repite y la rutina ya es un problema diario", "Plan Premium"],
      ["Todavía está investigando y comparando", "Artículo completo del blog"],
    ],
    faqTitle: "Preguntas rápidas sobre el sueño del bebé",
    faqs: [
      {
        q: "¿Wilbor sustituye al pediatra o a una asesora de sueño?",
        a: "No. Wilbor es un apoyo digital para orientar decisiones del día a día. Ante señales de alerta o sospecha clínica, la madre debe buscar atención presencial.",
      },
      {
        q: "¿Sirve para recién nacidos y para bebés más grandes?",
        a: "Sí. Su valor está precisamente en adaptar la orientación a la etapa del bebé, porque el sueño de un recién nacido no sigue la misma lógica que el de un bebé mayor.",
      },
      {
        q: "¿Necesito pagar para saber si esto me sirve?",
        a: "No. La madre puede empezar por el chat gratuito y decidir después si quiere profundizar con un plan o una guía.",
      },
    ],
    finalTitle: "Convierte una búsqueda desesperada en una decisión práctica.",
    finalSubtitle:
      "Si la duda es de hoy, empieza por el chat. Si el problema ya se volvió un patrón, avanza hacia los planes y usa Wilbor como apoyo recurrente.",
    trust: "Basado en protocolos confiables · Lenguaje práctico · Pensado para madres reales, no para respuestas genéricas",
    articleSlug: "bebe-no-duerme",
  },
  "colica-bebe": {
    seoTitle: "Cólico del bebé: orientación práctica con Wilbor",
    seoDescription:
      "Descubre cómo diferenciar cólico, incomodidad, hambre o sobrecarga en el bebé y cómo Wilbor ayuda con respuestas rápidas y prácticas.",
    badge: "Landing de alta intención · Cólico del bebé",
    title: "¿Cólico del bebé? La madre necesita claridad, no más confusión.",
    subtitle:
      "Cuando el bebé llora sin parar, la búsqueda en Google suele llegar con urgencia emocional. Esta página existe para transformar esa búsqueda en una acción segura y objetiva.",
    urgency: "Ideal para madres que quieren saber qué probar ahora, qué observar y cuándo el llanto deja de parecer un cólico común.",
    ctaPrimary: "Resolver la duda en el chat",
    ctaSecondary: "Conocer los planes",
    relatedArticleLabel: "Leer artículo sobre cólico",
    promiseTitle: "Cómo ayuda Wilbor en este momento",
    promiseSubtitle: "Un apoyo cálido para organizar señales y reducir la confusión del momento.",
    promiseItems: [
      "Ayuda a la madre a organizar señales, horarios, alimentación y patrón de llanto.",
      "Orienta medidas prácticas como posición, brazos, rutina y técnicas de alivio sin respuestas demasiado genéricas.",
      "Muestra cuándo la situación parece un cólico común y cuándo ya merece atención presencial.",
    ],
    warningTitle: "Señales para no tratarlo como un cólico simple",
    warningBody:
      "Si hay fiebre, sangre en las heces, vómitos persistentes, abdomen muy distendido, mucho decaimiento o irritación fuera de lo normal, la madre debe buscar evaluación médica y no solo probar medidas de confort.",
    scenariosTitle: "Mejor destino para cada momento",
    scenarioHeaders: ["Escenario", "Mejor destino"],
    scenarios: [
      ["La madre quiere una orientación práctica para el llanto de ahora", "Chat gratuito de Wilbor"],
      ["El cólico se repite y ya forma parte de una rutina de sufrimiento", "Plan Premium"],
      ["Quiere profundizar primero con contenido", "Artículo detallado del blog"],
    ],
    faqTitle: "Preguntas rápidas sobre cólico",
    faqs: [
      {
        q: "¿Wilbor dice con certeza si es cólico?",
        a: "No hace un diagnóstico médico cerrado. Su papel es ayudar a la madre a interpretar señales, contexto y urgencia con mucha más claridad que una búsqueda genérica.",
      },
      {
        q: "¿Puedo usarlo si mi bebé todavía es muy pequeño?",
        a: "Sí, sobre todo porque en esa etapa la inseguridad es mayor y cada detalle de la rutina influye mucho en la lectura del problema.",
      },
      {
        q: "¿Esta orientación es solo para cólico o también sirve para otras molestias?",
        a: "También sirve para ayudar a separar cólico de hambre, mal sueño, exceso de estímulo y otras molestias comunes.",
      },
    ],
    finalTitle: "Cuando el llanto aprieta, la respuesta debe aliviar, no confundir más.",
    finalSubtitle:
      "Empieza con la duda concreta en el chat o avanza hacia los planes si este dolor ya se repite todos los días.",
    trust: "Acompañamiento práctico · Organización de señales · Apoyo continuo cuando la madre más lo necesita",
    articleSlug: "colico-del-bebe",
  },
  "febre-bebe": {
    seoTitle: "Fiebre en el bebé: qué observar y cuándo actuar",
    seoDescription:
      "Entiende la fiebre en el bebé con más claridad: qué observar, cuándo es urgente y cómo Wilbor ayuda a decidir con más seguridad.",
    badge: "Landing de alta intención · Fiebre en el bebé",
    title: "¿Fiebre en el bebé? Primero decide bien. Después actúa rápido.",
    subtitle:
      "La fiebre da miedo porque puede ser algo simple o una señal de urgencia. El valor de Wilbor aquí es ayudar a la madre a leer el contexto con más claridad y menos pánico desordenado.",
    urgency: "Ideal para madres que necesitan distinguir observación segura, señales de alerta y el momento de buscar atención presencial.",
    ctaPrimary: "Evaluar la situación en el chat",
    ctaSecondary: "Ver planes y apoyo continuo",
    relatedArticleLabel: "Leer artículo sobre fiebre",
    promiseTitle: "Lo que esta página resuelve mejor",
    promiseSubtitle: "Más claridad para actuar con seguridad en un momento delicado.",
    promiseItems: [
      "Ayuda a la madre a identificar qué señales importan junto con la fiebre.",
      "Diferencia un escenario de observación en casa de uno que requiere atención urgente.",
      "Transforma una búsqueda ansiosa en una decisión más organizada y segura.",
    ],
    warningTitle: "Señales de alerta que cambian todo",
    warningBody:
      "Fiebre en un bebé pequeño, decaimiento intenso, dificultad para respirar, convulsiones, manchas en la piel, rechazo persistente de las tomas o un cambio importante de comportamiento exigen atención presencial inmediata.",
    scenariosTitle: "Mejor destino para cada momento",
    scenarioHeaders: ["Escenario", "Mejor destino"],
    scenarios: [
      ["La madre quiere entender rápidamente el riesgo y los siguientes pasos", "Chat gratuito de Wilbor"],
      ["Quiere mantener apoyo recurrente para otros problemas del día a día", "Plan Premium"],
      ["Quiere empezar por contenido explicativo", "Artículo detallado del blog"],
    ],
    faqTitle: "Preguntas rápidas sobre fiebre en el bebé",
    faqs: [
      {
        q: "¿Wilbor sustituye una visita a urgencias?",
        a: "No. Si hay una señal de alerta, la orientación correcta sigue siendo buscar atención presencial. Wilbor ayuda a la madre a percibir ese límite con más claridad.",
      },
      {
        q: "¿Es útil incluso si ya medí la temperatura?",
        a: "Sí. La decisión no depende solo del número. La edad del bebé, su comportamiento, las tomas y los signos asociados cambian mucho la lectura.",
      },
      {
        q: "¿Puedo usar el chat gratis antes de suscribirme?",
        a: "Sí. El camino gratuito sigue siendo la mejor puerta de entrada para quien quiere probar antes de asumir un uso recurrente.",
      },
    ],
    finalTitle: "Con fiebre, la mejor ayuda es la que organiza la decisión de la madre.",
    finalSubtitle:
      "Si la situación es de ahora, ve al chat. Si quieres apoyo continuo para varios problemas del día a día, mira los planes de Wilbor.",
    trust: "Claridad en situaciones delicadas · Apoyo práctico · Respeto por las señales de urgencia",
    articleSlug: "fiebre-en-bebe",
  },
};

const FR_COPY: LocaleCopy = {
  "bebe-nao-dorme": {
    seoTitle: "Bébé ne dort pas ? Un soutien pratique avec Wilbor",
    seoDescription:
      "Comprenez pourquoi bébé ne dort pas, quoi observer dans la routine et comment Wilbor aide les mères avec des réponses claires et concrètes.",
    badge: "Landing à forte intention · Sommeil de bébé",
    title: "Bébé ne dort pas ? Ayez une voie pratique avant que le désespoir ne devienne une routine.",
    subtitle:
      "Quand une mère arrive depuis Google avec urgence, elle ne veut pas trop de théorie. Elle veut comprendre ce qui peut se passer maintenant et quelle est la prochaine étape la plus sûre.",
    urgency: "Idéal pour les mères fatiguées qui ont un doute immédiat sur le sommeil, les réveils nocturnes, les fenêtres de sommeil et la routine du soir.",
    ctaPrimary: "Poser la question dans le chat",
    ctaSecondary: "Voir les forfaits Wilbor",
    relatedArticleLabel: "Lire l’article associé",
    promiseTitle: "Ce que la mère trouve ici",
    promiseSubtitle: "Wilbor guide la mère avec plus de contexte et moins de bruit.",
    promiseItems: [
      "Une orientation pratique basée sur l’âge, la routine et les signes du bébé.",
      "Une aide pour distinguer régression, inconfort, faim, mauvaise routine ou surstimulation.",
      "Un chemin clair entre essai gratuit, approfondissement via le blog et soutien continu avec Premium.",
    ],
    warningTitle: "Quand il ne faut pas insister avec des essais à la maison",
    warningBody:
      "Si le bébé a du mal à respirer, de la fièvre, des gémissements, une grande mollesse inhabituelle ou un refus persistant des tétées, la priorité n’est pas d’ajuster le sommeil mais de chercher une évaluation en présentiel.",
    scenariosTitle: "Meilleure destination pour chaque moment",
    scenarioHeaders: ["Scénario", "Meilleure destination"],
    scenarios: [
      ["La mère veut une réponse immédiate sur quoi faire cette nuit", "Chat gratuit Wilbor"],
      ["Le doute revient souvent et la routine est devenue un problème quotidien", "Forfait Premium"],
      ["Elle cherche encore et compare", "Article détaillé du blog"],
    ],
    faqTitle: "Questions rapides sur le sommeil de bébé",
    faqs: [
      {
        q: "Wilbor remplace-t-il le pédiatre ou une consultante en sommeil ?",
        a: "Non. Wilbor est un soutien numérique pour orienter les décisions du quotidien. En cas de signes d’alerte ou de suspicion clinique, la mère doit consulter en présentiel.",
      },
      {
        q: "Est-ce utile pour un nouveau-né et pour un bébé plus grand ?",
        a: "Oui. Sa valeur est précisément d’adapter l’orientation à l’étape du bébé, car le sommeil d’un nouveau-né ne suit pas la même logique que celui d’un bébé plus grand.",
      },
      {
        q: "Dois-je payer pour voir si cela me convient ?",
        a: "Non. La mère peut commencer par le chat gratuit et décider ensuite si elle veut approfondir avec un forfait ou un guide.",
      },
    ],
    finalTitle: "Transformez une recherche désespérée en décision pratique.",
    finalSubtitle:
      "Si le doute concerne aujourd’hui, commencez par le chat. Si le problème devient un schéma, passez aux forfaits et utilisez Wilbor comme soutien récurrent.",
    trust: "Basé sur des protocoles fiables · Langage pratique · Pensé pour de vraies mères, pas pour des réponses génériques",
    articleSlug: "bebe-ne-dort-pas",
  },
  "colica-bebe": {
    seoTitle: "Coliques bébé : des conseils pratiques avec Wilbor",
    seoDescription:
      "Découvrez comment distinguer coliques, inconfort, faim ou surcharge chez bébé et comment Wilbor aide avec des réponses rapides et concrètes.",
    badge: "Landing à forte intention · Coliques bébé",
    title: "Coliques bébé ? Une mère a besoin de clarté, pas de plus de confusion.",
    subtitle:
      "Quand bébé pleure sans s’arrêter, la recherche sur Google arrive généralement avec une urgence émotionnelle. Cette page existe pour transformer cette recherche en action sûre et objective.",
    urgency: "Idéal pour les mères qui veulent savoir quoi tester maintenant, quoi observer et quand les pleurs ne ressemblent plus à de simples coliques.",
    ctaPrimary: "Clarifier le doute dans le chat",
    ctaSecondary: "Découvrir les forfaits",
    relatedArticleLabel: "Lire l’article sur les coliques",
    promiseTitle: "Comment Wilbor aide dans cette situation",
    promiseSubtitle: "Un soutien chaleureux pour organiser les signes et apaiser la confusion du moment.",
    promiseItems: [
      "Aide la mère à organiser les signes, les horaires, l’alimentation et le schéma des pleurs.",
      "Propose des mesures pratiques comme la position, le portage, la routine et les techniques de soulagement sans réponses trop génériques.",
      "Montre quand la situation ressemble à des coliques simples et quand une consultation en présentiel devient plus importante.",
    ],
    warningTitle: "Signes pour ne pas traiter cela comme de simples coliques",
    warningBody:
      "S’il y a de la fièvre, du sang dans les selles, des vomissements persistants, un ventre très distendu, une grande mollesse ou une irritabilité inhabituelle, la mère doit demander une évaluation médicale et pas seulement tester des mesures de confort.",
    scenariosTitle: "Meilleure destination pour chaque moment",
    scenarioHeaders: ["Scénario", "Meilleure destination"],
    scenarios: [
      ["La mère veut un conseil pratique pour les pleurs de maintenant", "Chat gratuit Wilbor"],
      ["Les coliques reviennent souvent et la souffrance devient quotidienne", "Forfait Premium"],
      ["Elle veut d’abord approfondir avec du contenu", "Article détaillé du blog"],
    ],
    faqTitle: "Questions rapides sur les coliques",
    faqs: [
      {
        q: "Wilbor dit-il avec certitude s’il s’agit de coliques ?",
        a: "Il ne pose pas de diagnostic médical définitif. Son rôle est d’aider la mère à interpréter les signes, le contexte et l’urgence avec bien plus de clarté qu’une recherche générique.",
      },
      {
        q: "Puis-je l’utiliser si mon bébé est encore très petit ?",
        a: "Oui, surtout parce qu’à ce stade l’insécurité est plus forte et chaque détail de la routine influence l’interprétation du problème.",
      },
      {
        q: "Ces conseils servent-ils seulement pour les coliques ?",
        a: "Non. Ils aident aussi à distinguer les coliques de la faim, d’un mauvais sommeil, d’une surstimulation et d’autres inconforts courants.",
      },
    ],
    finalTitle: "Quand les pleurs montent, la réponse doit apaiser, pas embrouiller davantage.",
    finalSubtitle:
      "Commencez par la question concrète dans le chat ou passez aux forfaits si cette douleur se répète déjà tous les jours.",
    trust: "Soutien pratique · Organisation des signes · Aide continue quand la mère en a le plus besoin",
    articleSlug: "coliques-bebe",
  },
  "febre-bebe": {
    seoTitle: "Fièvre chez bébé : quoi observer et quand agir",
    seoDescription:
      "Comprenez mieux la fièvre chez bébé : quoi observer, quand c’est urgent et comment Wilbor aide la mère à décider avec plus de sécurité.",
    badge: "Landing à forte intention · Fièvre chez bébé",
    title: "Fièvre chez bébé ? D’abord bien décider. Ensuite agir vite.",
    subtitle:
      "La fièvre fait peur car elle peut être simple ou être un signe d’urgence. La valeur de Wilbor ici est d’aider la mère à lire le contexte avec plus de clarté et moins de panique désorganisée.",
    urgency: "Idéal pour les mères qui ont besoin de distinguer observation sûre, signes d’alerte et moment où il faut consulter en présentiel.",
    ctaPrimary: "Évaluer la situation dans le chat",
    ctaSecondary: "Voir les forfaits et le soutien continu",
    relatedArticleLabel: "Lire l’article sur la fièvre",
    promiseTitle: "Ce que cette page résout le mieux",
    promiseSubtitle: "Plus de clarté pour agir avec confiance dans un moment délicat.",
    promiseItems: [
      "Aide la mère à identifier quels signes comptent le plus avec la fièvre.",
      "Distingue une observation à la maison d’une situation qui demande une consultation urgente.",
      "Transforme une recherche anxieuse en décision plus structurée et plus sûre.",
    ],
    warningTitle: "Signes d’alerte qui changent tout",
    warningBody:
      "Fièvre chez un tout-petit, grande mollesse, difficulté à respirer, convulsions, taches sur le corps, refus persistant des tétées ou changement important de comportement exigent une évaluation immédiate en présentiel.",
    scenariosTitle: "Meilleure destination pour chaque moment",
    scenarioHeaders: ["Scénario", "Meilleure destination"],
    scenarios: [
      ["La mère veut comprendre rapidement le risque et les prochaines étapes", "Chat gratuit Wilbor"],
      ["Elle veut garder un soutien récurrent pour d’autres situations du quotidien", "Forfait Premium"],
      ["Elle préfère commencer par du contenu explicatif", "Article détaillé du blog"],
    ],
    faqTitle: "Questions rapides sur la fièvre de bébé",
    faqs: [
      {
        q: "Wilbor remplace-t-il une visite aux urgences ?",
        a: "Non. S’il y a un signe d’alerte, la bonne orientation reste de chercher une prise en charge en présentiel. Wilbor aide la mère à percevoir cette limite avec plus de clarté.",
      },
      {
        q: "Est-ce utile même si j’ai déjà pris la température ?",
        a: "Oui. La décision ne dépend pas seulement du chiffre. L’âge du bébé, son comportement, les tétées et les signes associés changent beaucoup l’interprétation.",
      },
      {
        q: "Puis-je utiliser le chat gratuitement avant de m’abonner ?",
        a: "Oui. Le parcours gratuit reste la meilleure porte d’entrée pour celles qui veulent tester avant d’adopter un usage récurrent.",
      },
    ],
    finalTitle: "En cas de fièvre, la meilleure aide est celle qui organise la décision de la mère.",
    finalSubtitle:
      "Si la situation est immédiate, allez au chat. Si vous voulez un soutien continu pour plusieurs difficultés du quotidien, regardez les forfaits Wilbor.",
    trust: "Clarté dans les situations délicates · Soutien pratique · Respect des signes d’urgence",
    articleSlug: "fievre-bebe",
  },
};

const DE_COPY: LocaleCopy = {
  "bebe-nao-dorme": {
    seoTitle: "Baby schläft nicht? Praktische Hilfe mit Wilbor",
    seoDescription:
      "Verstehen Sie, warum das Baby nicht schläft, worauf in der Routine zu achten ist und wie Wilbor Müttern mit klaren Antworten hilft.",
    badge: "Landing mit hoher Absicht · Babyschlaf",
    title: "Baby schläft nicht? Ein praktischer Weg, bevor Verzweiflung zur Routine wird.",
    subtitle:
      "Wenn eine Mutter mit dringender Google-Suche ankommt, möchte sie nicht zu viel Theorie. Sie möchte verstehen, was jetzt passieren könnte und welcher nächste Schritt am sichersten ist.",
    urgency: "Ideal für müde Mütter mit einer sofortigen Frage zu Schlaf, nächtlichem Aufwachen, Schlafphasen und Abendroutine.",
    ctaPrimary: "Jetzt im Chat fragen",
    ctaSecondary: "Wilbor-Pläne ansehen",
    relatedArticleLabel: "Passenden Artikel lesen",
    promiseTitle: "Was die Mutter hier findet",
    promiseSubtitle: "Wilbor begleitet Mütter mit mehr Kontext und weniger Verwirrung.",
    promiseItems: [
      "Praktische Orientierung basierend auf Alter, Routine und Signalen des Babys.",
      "Hilft dabei, Regression, Unwohlsein, Hunger, schlechte Routine oder Überreizung zu unterscheiden.",
      "Ein klarer Weg zwischen kostenlosem Test, Blog-Inhalten und fortlaufender Premium-Begleitung.",
    ],
    warningTitle: "Wann man nicht weiter nur zu Hause ausprobieren sollte",
    warningBody:
      "Wenn das Baby Atemprobleme, Fieber, Stöhnen, ungewöhnliche Schlappheit oder anhaltende Nahrungsverweigerung zeigt, ist nicht die Schlafanpassung die Priorität, sondern eine persönliche Untersuchung.",
    scenariosTitle: "Beste Anlaufstelle für jeden Moment",
    scenarioHeaders: ["Situation", "Beste Anlaufstelle"],
    scenarios: [
      ["Die Mutter braucht sofort eine Antwort für heute Nacht", "Kostenloser Wilbor-Chat"],
      ["Die Frage kehrt immer wieder zurück und die Routine ist zum Alltagsproblem geworden", "Premium-Plan"],
      ["Sie recherchiert und vergleicht noch", "Ausführlicher Blogartikel"],
    ],
    faqTitle: "Schnelle Fragen zum Babyschlaf",
    faqs: [
      {
        q: "Ersetzt Wilbor den Kinderarzt oder eine Schlafberaterin?",
        a: "Nein. Wilbor ist digitale Unterstützung für tägliche Entscheidungen. Bei Warnzeichen oder klinischem Verdacht sollte die Mutter persönliche medizinische Hilfe suchen.",
      },
      {
        q: "Ist es für Neugeborene und ältere Babys geeignet?",
        a: "Ja. Der Nutzen liegt genau darin, die Orientierung an die Phase des Babys anzupassen, denn der Schlaf eines Neugeborenen folgt nicht derselben Logik wie der eines älteren Babys.",
      },
      {
        q: "Muss ich zahlen, um zu sehen, ob es für mich sinnvoll ist?",
        a: "Nein. Die Mutter kann mit dem kostenlosen Chat beginnen und erst danach entscheiden, ob sie mit einem Plan oder einem Guide weitermachen möchte.",
      },
    ],
    finalTitle: "Machen Sie aus einer verzweifelten Suche eine praktische Entscheidung.",
    finalSubtitle:
      "Wenn die Frage für heute ist, beginnen Sie mit dem Chat. Wenn das Problem zum Muster geworden ist, gehen Sie zu den Plänen weiter und nutzen Sie Wilbor als laufende Unterstützung.",
    trust: "Auf verlässlichen Protokollen basiert · Praktische Sprache · Für echte Mütter gedacht, nicht für generische Antworten",
    articleSlug: "baby-schlaeft-nicht",
  },
  "colica-bebe": {
    seoTitle: "Bauchkoliken beim Baby: praktische Hilfe mit Wilbor",
    seoDescription:
      "Erfahren Sie, wie man Koliken, Unwohlsein, Hunger oder Überlastung beim Baby besser unterscheidet und wie Wilbor mit schnellen, praktischen Antworten hilft.",
    badge: "Landing mit hoher Absicht · Bauchkoliken beim Baby",
    title: "Bauchkoliken beim Baby? Eine Mutter braucht Klarheit, nicht noch mehr Verwirrung.",
    subtitle:
      "Wenn das Baby ununterbrochen weint, ist die Google-Suche meist emotional und dringend. Diese Seite hilft, diese Suche in eine sichere und objektive Handlung zu verwandeln.",
    urgency: "Ideal für Mütter, die wissen möchten, was sie jetzt testen können, worauf sie achten sollten und wann das Weinen nicht mehr wie gewöhnliche Koliken aussieht.",
    ctaPrimary: "Frage jetzt im Chat klären",
    ctaSecondary: "Pläne kennenlernen",
    relatedArticleLabel: "Artikel zu Koliken lesen",
    promiseTitle: "Wie Wilbor in diesem Moment hilft",
    promiseSubtitle: "Eine einfühlsame Unterstützung, um Signale zu ordnen und Verwirrung zu reduzieren.",
    promiseItems: [
      "Hilft der Mutter, Signale, Uhrzeiten, Ernährung und Weinen zu ordnen.",
      "Empfiehlt praktische Maßnahmen wie Position, Tragen, Routine und Beruhigungstechniken ohne zu allgemeine Antworten.",
      "Zeigt, wann die Situation nach gewöhnlichen Koliken aussieht und wann persönliche ärztliche Hilfe wichtiger wird.",
    ],
    warningTitle: "Warnzeichen, die nicht wie einfache Koliken behandelt werden sollten",
    warningBody:
      "Bei Fieber, Blut im Stuhl, anhaltendem Erbrechen, stark aufgeblähtem Bauch, ausgeprägter Schlappheit oder ungewöhnlicher Reizbarkeit sollte die Mutter medizinische Hilfe suchen und nicht nur beruhigende Maßnahmen ausprobieren.",
    scenariosTitle: "Beste Anlaufstelle für jeden Moment",
    scenarioHeaders: ["Situation", "Beste Anlaufstelle"],
    scenarios: [
      ["Die Mutter möchte sofort eine praktische Orientierung zum aktuellen Weinen", "Kostenloser Wilbor-Chat"],
      ["Die Koliken kehren immer wieder und der Alltag wird davon bestimmt", "Premium-Plan"],
      ["Sie möchte sich zuerst mit Inhalten vertiefen", "Detaillierter Blogartikel"],
    ],
    faqTitle: "Schnelle Fragen zu Koliken",
    faqs: [
      {
        q: "Sagt Wilbor sicher, ob es Koliken sind?",
        a: "Es stellt keine abschließende medizinische Diagnose. Seine Aufgabe ist es, der Mutter zu helfen, Signale, Kontext und Dringlichkeit viel klarer einzuordnen als eine generische Suche.",
      },
      {
        q: "Kann ich es auch bei einem sehr kleinen Baby nutzen?",
        a: "Ja, besonders weil in dieser Phase die Unsicherheit größer ist und jedes Detail der Routine die Einschätzung stark beeinflusst.",
      },
      {
        q: "Gilt diese Orientierung nur für Koliken oder auch für andere Beschwerden?",
        a: "Sie hilft auch dabei, Koliken von Hunger, schlechtem Schlaf, Überreizung und anderen häufigen Beschwerden zu unterscheiden.",
      },
    ],
    finalTitle: "Wenn das Weinen zunimmt, sollte die Antwort entlasten und nicht noch mehr verwirren.",
    finalSubtitle:
      "Beginnen Sie mit der konkreten Frage im Chat oder gehen Sie zu den Plänen über, wenn sich dieses Problem bereits jeden Tag wiederholt.",
    trust: "Praktische Begleitung · Bessere Ordnung der Signale · Laufende Hilfe, wenn die Mutter sie am meisten braucht",
    articleSlug: "bauchkoliken-baby",
  },
  "febre-bebe": {
    seoTitle: "Fieber beim Baby: worauf achten und wann handeln",
    seoDescription:
      "Verstehen Sie Fieber beim Baby klarer: worauf man achten sollte, wann es dringend ist und wie Wilbor hilft, sicherer zu entscheiden.",
    badge: "Landing mit hoher Absicht · Fieber beim Baby",
    title: "Fieber beim Baby? Zuerst richtig entscheiden. Dann schnell handeln.",
    subtitle:
      "Fieber macht Angst, weil es harmlos sein oder ein Warnsignal darstellen kann. Der Wert von Wilbor besteht hier darin, der Mutter zu helfen, den Kontext klarer und mit weniger ungeordneter Panik zu lesen.",
    urgency: "Ideal für Mütter, die sichere Beobachtung, Warnzeichen und den richtigen Zeitpunkt für persönliche medizinische Hilfe unterscheiden müssen.",
    ctaPrimary: "Situation im Chat bewerten",
    ctaSecondary: "Pläne und laufende Unterstützung ansehen",
    relatedArticleLabel: "Artikel über Fieber lesen",
    promiseTitle: "Was diese Seite besser löst",
    promiseSubtitle: "Mehr Klarheit, um in einem sensiblen Moment sicherer zu handeln.",
    promiseItems: [
      "Hilft der Mutter zu erkennen, welche Begleitzeichen zusammen mit dem Fieber wichtig sind.",
      "Unterscheidet Beobachtung zu Hause von Situationen, die eine dringende Untersuchung erfordern.",
      "Verwandelt eine ängstliche Suche in eine geordnetere und sicherere Entscheidung.",
    ],
    warningTitle: "Warnzeichen, die alles verändern",
    warningBody:
      "Fieber bei einem kleinen Baby, starke Schlappheit, Atemnot, Krampfanfälle, Flecken auf der Haut, anhaltende Nahrungsverweigerung oder deutliche Verhaltensänderung erfordern sofortige persönliche Abklärung.",
    scenariosTitle: "Beste Anlaufstelle für jeden Moment",
    scenarioHeaders: ["Situation", "Beste Anlaufstelle"],
    scenarios: [
      ["Die Mutter möchte Risiko und nächste Schritte schnell verstehen", "Kostenloser Wilbor-Chat"],
      ["Sie möchte laufende Unterstützung für weitere Alltagssituationen behalten", "Premium-Plan"],
      ["Sie möchte lieber mit erklärenden Inhalten beginnen", "Detaillierter Blogartikel"],
    ],
    faqTitle: "Schnelle Fragen zu Fieber beim Baby",
    faqs: [
      {
        q: "Ersetzt Wilbor einen Besuch in der Notaufnahme?",
        a: "Nein. Wenn Warnzeichen vorliegen, bleibt persönliche medizinische Hilfe der richtige Weg. Wilbor hilft der Mutter, diese Grenze klarer zu erkennen.",
      },
      {
        q: "Ist es auch nützlich, wenn ich die Temperatur schon gemessen habe?",
        a: "Ja. Die Entscheidung hängt nicht nur vom Wert ab. Alter des Babys, Verhalten, Trinkverhalten und Begleitzeichen verändern die Einschätzung deutlich.",
      },
      {
        q: "Kann ich den Chat kostenlos nutzen, bevor ich ein Abo abschließe?",
        a: "Ja. Der kostenlose Einstieg bleibt der beste Weg für alle, die erst testen möchten, bevor sie eine laufende Nutzung übernehmen.",
      },
    ],
    finalTitle: "Bei Fieber ist die beste Hilfe die, die die nächste Entscheidung der Mutter ordnet.",
    finalSubtitle:
      "Wenn die Situation aktuell ist, gehen Sie in den Chat. Wenn Sie laufende Unterstützung für mehrere Alltagsprobleme möchten, sehen Sie sich die Wilbor-Pläne an.",
    trust: "Klarheit in sensiblen Situationen · Praktische Unterstützung · Respekt vor Warnzeichen",
    articleSlug: "fieber-baby",
  },
};

const TOPIC_ICON = {
  "bebe-nao-dorme": Moon,
  "colica-bebe": Wind,
  "febre-bebe": Thermometer,
} as const;

function getCopy(locale: string): LocaleCopy {
  switch (locale as SupportedLocale) {
    case "en":
      return EN_COPY;
    case "es":
      return ES_COPY;
    case "fr":
      return FR_COPY;
    case "de":
      return DE_COPY;
    case "pt":
    default:
      return PT_COPY;
  }
}

function IntentLanding({ topic }: { topic: TopicKey }) {
  const { locale, localePath } = useI18n();
  const copy = getCopy(locale)[topic] || PT_COPY[topic];
  const Icon = TOPIC_ICON[topic];

  const dashboardHref = localePath("/dashboard");
  const premiumHref = localePath("/premium");
  const blogHref = localePath(`/blog/${copy.articleSlug}`);
  const canonicalUrl = `https://wilbor-assist.com${localePath(`/${topic}`)}`;

  // ── FAQPage schema (rich results no Google) ──────────────────────────────
  useEffect(() => {
    const schema = generateFAQSchema(
      copy.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))
    );
    const script = document.createElement("script");
    script.id = "wilbor-faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => {
      document.getElementById("wilbor-faq-schema")?.remove();
    };
  }, [copy.faqs]);

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} url={canonicalUrl} type="website" />

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <a href={localePath("/")} className="flex items-center gap-2 text-left">
              <Heart className="w-7 h-7 text-purple-600 fill-purple-600" />
              <span className="text-xl font-bold text-slate-900">Wilbor</span>
            </a>

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
                  <a href={dashboardHref}>
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
                  <p className="text-sm text-slate-500">{copy.promiseSubtitle}</p>
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
                  <div className="px-4 py-3">{copy.scenarioHeaders[0]}</div>
                  <div className="px-4 py-3">{copy.scenarioHeaders[1]}</div>
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
                  <a href={dashboardHref}>{copy.ctaPrimary}</a>
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
