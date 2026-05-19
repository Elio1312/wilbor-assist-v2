const BASE_URL = "https://wilbor-assist.com";

type SupportedLocale = "pt" | "en" | "es" | "fr" | "de";
type SupportedPath = "/premium" | "/bebe-nao-dorme" | "/colica-bebe" | "/febre-bebe";

type PublicPageSeoEntry = {
  title: string;
  description: string;
  keywords: string[];
  staticContentHtml: string;
};

type PublicPageSeoRecord = Record<SupportedPath, Record<SupportedLocale, PublicPageSeoEntry>>;

const LOCALE_PREFIX: Record<SupportedLocale, string> = {
  pt: "",
  en: "/en",
  es: "/es",
  fr: "/fr",
  de: "/de",
};

const HTML_LANG: Record<SupportedLocale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
};

const OG_LOCALE: Record<SupportedLocale, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
};

const HREFLANG: Record<SupportedLocale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
};

const PUBLIC_PAGE_SEO: PublicPageSeoRecord = {
  "/premium": {
    pt: {
      title: "Planos Wilbor Premium",
      description:
        "Compare Free, Premium e guias do Wilbor. Entenda qual caminho faz mais sentido para cada mãe antes de decidir.",
      keywords: ["wilbor premium", "planos wilbor", "chat para mães", "apoio materno infantil", "assistente para mães de bebê"],
      staticContentHtml:
        "<h1>Planos Wilbor Premium</h1><p>Compare o chat gratuito, o Premium e os guias do Wilbor para escolher o melhor caminho para cada momento da mãe.</p><h2>O que esta página ajuda a decidir</h2><ul><li>Quando começar pelo chat gratuito.</li><li>Quando avançar para o Premium.</li><li>Quando um guia específico faz mais sentido.</li></ul>",
    },
    en: {
      title: "Wilbor Premium Plans",
      description:
        "Compare Wilbor Free, Premium and one-time guides to understand which option fits each visitor best.",
      keywords: ["wilbor premium", "wilbor plans", "baby support app", "maternal ai assistant", "baby care guidance"],
      staticContentHtml:
        "<h1>Wilbor Premium Plans</h1><p>Compare free chat, Premium and one-time guides to choose the best path for each mother.</p><h2>What this page helps visitors decide</h2><ul><li>When to start with free chat.</li><li>When ongoing Premium support makes more sense.</li><li>When a focused guide is enough.</li></ul>",
    },
    es: {
      title: "Planes Wilbor Premium",
      description:
        "Compara Wilbor Free, Premium y guías de compra única para entender qué opción encaja mejor con cada madre.",
      keywords: ["wilbor premium", "planes wilbor", "chat para madres", "asistente maternal con ia", "guia para cuidado del bebé"],
      staticContentHtml:
        "<h1>Planes Wilbor Premium</h1><p>Compara el chat gratuito, Premium y las guías de compra única para elegir la mejor opción para cada momento de la madre.</p><h2>Lo que esta página ayuda a decidir</h2><ul><li>Cuándo empezar con el chat gratuito.</li><li>Cuándo conviene pasar a Premium.</li><li>Cuándo una guía específica es suficiente.</li></ul>",
    },
    fr: {
      title: "Forfaits Wilbor Premium",
      description:
        "Comparez Wilbor Free, Premium et les guides à achat unique pour choisir l’option la plus adaptée à chaque mère.",
      keywords: ["wilbor premium", "forfaits wilbor", "chat pour mamans", "assistant maternel ia", "conseils bebe"],
      staticContentHtml:
        "<h1>Forfaits Wilbor Premium</h1><p>Comparez le chat gratuit, Premium et les guides à achat unique pour choisir la meilleure option selon le moment de chaque mère.</p><h2>Ce que cette page aide à décider</h2><ul><li>Quand commencer par le chat gratuit.</li><li>Quand le support Premium continu devient pertinent.</li><li>Quand un guide ciblé suffit.</li></ul>",
    },
    de: {
      title: "Wilbor Premium-Pläne",
      description:
        "Vergleichen Sie Wilbor Free, Premium und Einzelguides, um die passende Option für jede Mutter zu finden.",
      keywords: ["wilbor premium", "wilbor pläne", "chat für mütter", "ki assistent für mütter", "babypflege hilfe"],
      staticContentHtml:
        "<h1>Wilbor Premium-Pläne</h1><p>Vergleichen Sie den kostenlosen Chat, Premium und Einzelguides, um den besten Weg für die jeweilige Mutter zu wählen.</p><h2>Wobei diese Seite hilft</h2><ul><li>Wann der kostenlose Chat der beste Einstieg ist.</li><li>Wann laufender Premium-Support sinnvoller ist.</li><li>Wann ein fokussierter Guide ausreicht.</li></ul>",
    },
  },
  "/bebe-nao-dorme": {
    pt: {
      title: "Bebê não dorme? Ajuda prática com o Wilbor",
      description:
        "Entenda quando o bebê não dorme, o que observar na rotina e como o Wilbor ajuda com respostas práticas e seguras.",
      keywords: ["bebê não dorme", "sono do bebê", "rotina do bebê", "despertares noturnos", "wilbor"],
      staticContentHtml:
        "<h1>Bebê não dorme? Ajuda prática com o Wilbor</h1><p>Esta página ajuda mães a entender o que observar quando o bebê não dorme e qual o próximo passo mais seguro.</p><h2>Como o Wilbor ajuda</h2><ul><li>Organiza sinais, rotina e janelas de sono.</li><li>Diferencia regressão, fome, desconforto e excesso de estímulo.</li><li>Mostra quando procurar avaliação presencial.</li></ul>",
    },
    en: {
      title: "Baby won’t sleep? Practical support with Wilbor",
      description:
        "Understand what may be behind baby sleep struggles and how Wilbor helps mothers decide the next step with more clarity.",
      keywords: ["baby won't sleep", "baby sleep help", "night wakings", "baby bedtime routine", "wilbor"],
      staticContentHtml:
        "<h1>Baby won’t sleep? Practical support with Wilbor</h1><p>This page helps mothers understand what to observe when a baby will not sleep and what to do next more safely.</p><h2>How Wilbor helps</h2><ul><li>Organizes signs, routine and sleep windows.</li><li>Separates regression, hunger, discomfort and overstimulation.</li><li>Highlights when in-person care should come first.</li></ul>",
    },
    es: {
      title: "¿El bebé no duerme? Ayuda práctica con Wilbor",
      description:
        "Entiende por qué el bebé no duerme, qué observar en la rutina y cómo Wilbor ayuda a las madres con respuestas más claras.",
      keywords: ["bebé no duerme", "sueño del bebé", "despertares nocturnos", "rutina del bebé", "wilbor"],
      staticContentHtml:
        "<h1>¿El bebé no duerme? Ayuda práctica con Wilbor</h1><p>Esta página ayuda a las madres a entender qué observar cuando el bebé no duerme y cuál es el siguiente paso más seguro.</p><h2>Cómo ayuda Wilbor</h2><ul><li>Organiza señales, rutina y ventanas de sueño.</li><li>Diferencia regresión, hambre, incomodidad y exceso de estímulo.</li><li>Muestra cuándo buscar atención presencial.</li></ul>",
    },
    fr: {
      title: "Bébé ne dort pas ? Un soutien pratique avec Wilbor",
      description:
        "Comprenez pourquoi bébé ne dort pas, quoi observer dans la routine et comment Wilbor aide les mères à décider plus sereinement.",
      keywords: ["bébé ne dort pas", "sommeil bébé", "réveils nocturnes", "routine bébé", "wilbor"],
      staticContentHtml:
        "<h1>Bébé ne dort pas ? Un soutien pratique avec Wilbor</h1><p>Cette page aide les mères à comprendre quoi observer quand bébé ne dort pas et quelle est la prochaine étape la plus sûre.</p><h2>Comment Wilbor aide</h2><ul><li>Organise les signes, la routine et les fenêtres de sommeil.</li><li>Distingue régression, faim, inconfort et surstimulation.</li><li>Indique quand une évaluation en présentiel devient prioritaire.</li></ul>",
    },
    de: {
      title: "Baby schläft nicht? Praktische Hilfe mit Wilbor",
      description:
        "Verstehen Sie, warum das Baby nicht schläft, worauf in der Routine zu achten ist und wie Wilbor Müttern mit klaren Antworten hilft.",
      keywords: ["baby schläft nicht", "babyschlaf", "nächtliches aufwachen", "babyroutine", "wilbor"],
      staticContentHtml:
        "<h1>Baby schläft nicht? Praktische Hilfe mit Wilbor</h1><p>Diese Seite hilft Müttern zu verstehen, worauf sie achten sollten, wenn das Baby nicht schläft, und welcher nächste Schritt sicherer ist.</p><h2>Wie Wilbor hilft</h2><ul><li>Ordnet Signale, Routine und Schlafphasen.</li><li>Unterscheidet Regression, Hunger, Unwohlsein und Überreizung.</li><li>Zeigt, wann eine persönliche Untersuchung wichtig wird.</li></ul>",
    },
  },
  "/colica-bebe": {
    pt: {
      title: "Cólica do bebê: orientação prática com o Wilbor",
      description:
        "Saiba como diferenciar cólica, desconforto, fome ou sobrecarga no bebê e como o Wilbor ajuda com respostas rápidas.",
      keywords: ["cólica do bebê", "bebê chorando", "desconforto do bebê", "alívio da cólica", "wilbor"],
      staticContentHtml:
        "<h1>Cólica do bebê: orientação prática com o Wilbor</h1><p>Esta página ajuda mães a entender quando o choro parece cólica comum e quando merece atenção presencial.</p><h2>Como o Wilbor ajuda</h2><ul><li>Organiza sinais, horários, alimentação e padrão de choro.</li><li>Mostra medidas práticas de alívio com mais contexto.</li><li>Diferencia sinais de alerta de desconfortos mais comuns.</li></ul>",
    },
    en: {
      title: "Baby colic: practical guidance with Wilbor",
      description:
        "Understand baby colic with more clarity and see how Wilbor helps mothers distinguish common discomfort from warning signs.",
      keywords: ["baby colic", "crying baby help", "baby discomfort", "colic relief", "wilbor"],
      staticContentHtml:
        "<h1>Baby colic: practical guidance with Wilbor</h1><p>This page helps mothers understand when crying still looks like ordinary colic and when medical evaluation may be needed.</p><h2>How Wilbor helps</h2><ul><li>Organizes crying, feeding and routine clues.</li><li>Suggests practical relief measures with more context.</li><li>Highlights warning signs that should not be ignored.</li></ul>",
    },
    es: {
      title: "Cólico del bebé: orientación práctica con Wilbor",
      description:
        "Entiende mejor el cólico del bebé y descubre cómo Wilbor ayuda a diferenciar molestias comunes de señales de alerta.",
      keywords: ["cólico del bebé", "bebé llora mucho", "molestia del bebé", "alivio cólico", "wilbor"],
      staticContentHtml:
        "<h1>Cólico del bebé: orientación práctica con Wilbor</h1><p>Esta página ayuda a las madres a entender cuándo el llanto parece un cólico común y cuándo conviene buscar atención médica.</p><h2>Cómo ayuda Wilbor</h2><ul><li>Organiza señales del llanto, la alimentación y la rutina.</li><li>Ofrece medidas prácticas de alivio con más contexto.</li><li>Destaca señales de alerta que no deben ignorarse.</li></ul>",
    },
    fr: {
      title: "Coliques bébé : des conseils pratiques avec Wilbor",
      description:
        "Comprenez mieux les coliques de bébé et voyez comment Wilbor aide à distinguer l’inconfort courant des signes d’alerte.",
      keywords: ["coliques bébé", "bébé pleure beaucoup", "inconfort bébé", "soulagement coliques", "wilbor"],
      staticContentHtml:
        "<h1>Coliques bébé : des conseils pratiques avec Wilbor</h1><p>Cette page aide les mères à comprendre quand les pleurs ressemblent à des coliques simples et quand une consultation devient importante.</p><h2>Comment Wilbor aide</h2><ul><li>Organise les signes liés aux pleurs, à l’alimentation et à la routine.</li><li>Propose des mesures de soulagement plus concrètes.</li><li>Met en avant les signes d’alerte à ne pas négliger.</li></ul>",
    },
    de: {
      title: "Bauchkoliken beim Baby: praktische Hilfe mit Wilbor",
      description:
        "Verstehen Sie Bauchkoliken beim Baby besser und sehen Sie, wie Wilbor Müttern hilft, häufiges Unwohlsein von Warnzeichen zu unterscheiden.",
      keywords: ["bauchkoliken baby", "baby schreit viel", "unwohlsein baby", "koliken hilfe", "wilbor"],
      staticContentHtml:
        "<h1>Bauchkoliken beim Baby: praktische Hilfe mit Wilbor</h1><p>Diese Seite hilft Müttern zu verstehen, wann Weinen noch wie gewöhnliche Koliken wirkt und wann medizinische Hilfe sinnvoll ist.</p><h2>Wie Wilbor hilft</h2><ul><li>Ordnet Hinweise aus Weinen, Füttern und Routine.</li><li>Zeigt praktische Entlastungsmaßnahmen mit mehr Kontext.</li><li>Hebt Warnzeichen hervor, die nicht ignoriert werden sollten.</li></ul>",
    },
  },
  "/febre-bebe": {
    pt: {
      title: "Febre no bebê: quando observar e quando agir com o Wilbor",
      description:
        "Entenda febre no bebê com mais clareza: o que observar, quando é urgência e como o Wilbor ajuda a decidir com mais segurança.",
      keywords: ["febre no bebê", "urgência bebê", "temperatura bebê", "sinais de alerta bebê", "wilbor"],
      staticContentHtml:
        "<h1>Febre no bebê: quando observar e quando agir com o Wilbor</h1><p>Esta página ajuda mães a entender o contexto da febre e a decidir quando observar em casa e quando buscar atendimento presencial.</p><h2>Como o Wilbor ajuda</h2><ul><li>Organiza sinais que importam junto com a febre.</li><li>Diferencia observação em casa de urgência presencial.</li><li>Ajuda a transformar busca ansiosa em decisão mais segura.</li></ul>",
    },
    en: {
      title: "Fever in babies: what to watch and when to act",
      description:
        "See how Wilbor helps mothers understand fever context, warning signs and next steps with more confidence.",
      keywords: ["baby fever", "fever in babies", "warning signs baby", "urgent care baby", "wilbor"],
      staticContentHtml:
        "<h1>Fever in babies: what to watch and when to act</h1><p>This page helps mothers understand fever context and decide when home observation is enough and when urgent care is needed.</p><h2>How Wilbor helps</h2><ul><li>Highlights the signs that matter most alongside fever.</li><li>Separates home observation from urgent-care scenarios.</li><li>Supports calmer and more structured decision-making.</li></ul>",
    },
    es: {
      title: "Fiebre en el bebé: qué observar y cuándo actuar",
      description:
        "Descubre cómo Wilbor ayuda a las madres a entender el contexto de la fiebre, las señales de alerta y los siguientes pasos.",
      keywords: ["fiebre en el bebé", "señales de alerta bebé", "urgencia bebé", "temperatura bebé", "wilbor"],
      staticContentHtml:
        "<h1>Fiebre en el bebé: qué observar y cuándo actuar</h1><p>Esta página ayuda a las madres a entender el contexto de la fiebre y a decidir cuándo observar en casa y cuándo acudir a atención médica.</p><h2>Cómo ayuda Wilbor</h2><ul><li>Destaca las señales que más importan junto con la fiebre.</li><li>Separa observación en casa de situaciones urgentes.</li><li>Favorece decisiones más ordenadas y seguras.</li></ul>",
    },
    fr: {
      title: "Fièvre chez bébé : quoi observer et quand agir",
      description:
        "Découvrez comment Wilbor aide les mères à comprendre le contexte de la fièvre, les signes d’alerte et les prochaines étapes.",
      keywords: ["fièvre bébé", "signes d'alerte bébé", "urgence bébé", "température bébé", "wilbor"],
      staticContentHtml:
        "<h1>Fièvre chez bébé : quoi observer et quand agir</h1><p>Cette page aide les mères à comprendre le contexte de la fièvre et à décider quand surveiller à la maison et quand consulter rapidement.</p><h2>Comment Wilbor aide</h2><ul><li>Met en avant les signes importants associés à la fièvre.</li><li>Distingue surveillance à domicile et urgence.</li><li>Aide à prendre une décision plus calme et structurée.</li></ul>",
    },
    de: {
      title: "Fieber beim Baby: worauf achten und wann handeln",
      description:
        "Erfahren Sie, wie Wilbor Müttern hilft, den Zusammenhang von Fieber, Warnzeichen und nächsten Schritten sicherer einzuordnen.",
      keywords: ["fieber baby", "warnzeichen baby", "notfall baby", "temperatur baby", "wilbor"],
      staticContentHtml:
        "<h1>Fieber beim Baby: worauf achten und wann handeln</h1><p>Diese Seite hilft Müttern, Fieber besser einzuordnen und zu entscheiden, wann Beobachtung zu Hause reicht und wann ärztliche Hilfe nötig ist.</p><h2>Wie Wilbor hilft</h2><ul><li>Hebt wichtige Begleitzeichen neben dem Fieber hervor.</li><li>Unterscheidet Beobachtung zu Hause von akuten Situationen.</li><li>Unterstützt ruhigere und strukturiertere Entscheidungen.</li></ul>",
    },
  },
};

function getLocaleFromPath(pathname: string): SupportedLocale {
  const match = pathname.match(/^\/(pt|en|es|fr|de)(?=\/|$)/);
  return (match?.[1] as SupportedLocale | undefined) || "pt";
}

function getCleanPath(pathname: string): SupportedPath | null {
  const stripped = pathname.replace(/^\/(pt|en|es|fr|de)(?=\/|$)/, "") || "/";
  return stripped in PUBLIC_PAGE_SEO ? (stripped as SupportedPath) : null;
}

function buildLocalizedPath(locale: SupportedLocale, path: SupportedPath): string {
  return `${LOCALE_PREFIX[locale]}${path}` || "/";
}

export function getPublicPageSeoFromPath(pathname: string) {
  const locale = getLocaleFromPath(pathname);
  const cleanPath = getCleanPath(pathname);

  if (!cleanPath) {
    return null;
  }

  const entry = PUBLIC_PAGE_SEO[cleanPath][locale] || PUBLIC_PAGE_SEO[cleanPath].pt;

  return {
    htmlLang: HTML_LANG[locale],
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    ogType: "website" as const,
    canonicalUrl: `${BASE_URL}${buildLocalizedPath(locale, cleanPath)}`,
    ogLocale: OG_LOCALE[locale],
    alternates: [
      { hreflang: HREFLANG.pt, href: `${BASE_URL}${buildLocalizedPath("pt", cleanPath)}` },
      { hreflang: HREFLANG.en, href: `${BASE_URL}${buildLocalizedPath("en", cleanPath)}` },
      { hreflang: HREFLANG.es, href: `${BASE_URL}${buildLocalizedPath("es", cleanPath)}` },
      { hreflang: HREFLANG.fr, href: `${BASE_URL}${buildLocalizedPath("fr", cleanPath)}` },
      { hreflang: HREFLANG.de, href: `${BASE_URL}${buildLocalizedPath("de", cleanPath)}` },
      { hreflang: "x-default", href: `${BASE_URL}${buildLocalizedPath("en", cleanPath)}` },
    ],
    staticContentHtml: entry.staticContentHtml,
  };
}
