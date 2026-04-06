/**
 * ebookOfferDetector.ts
 * Detecta intenção contextual na mensagem da mãe e retorna oferta de ebook relevante
 * Regra do Mentor: oferta SEMPRE depois da resposta útil, nunca antes.
 * Pool (Manus) - 06/04/2026
 */

export type EbookIntent = "sleep" | "colic" | "sexuality" | null;

export type EbookOffer = {
  intent: EbookIntent;
  ebookId: string;       // ID do produto em shopProducts.ts
  title: string;
  teaser: string;        // Copy contextual (Gemini)
  ctaLabel: string;
  shopUrl: string;
};

// ─── Keywords por intent e idioma ──────────────────────────────────────────────

const INTENT_KEYWORDS: Record<string, Record<EbookIntent & string, string[]>> = {
  pt: {
    sleep: [
      "não dorme", "nao dorme", "acorda muito", "acorda de madrugada",
      "não consegue dormir", "nao consegue dormir", "privação de sono",
      "privacao de sono", "cansada", "exausta", "exausta de acordar",
      "5 vezes", "toda hora", "noite toda", "insônia", "insonia",
      "rotina de sono", "método", "metodo", "choro na madrugada",
    ],
    colic: [
      "cólica", "colica", "gases", "barriga dura", "choro inconsolável",
      "choro inconsolavel", "chora muito", "chora sem parar", "massagem",
      "barriga", "estômago", "estomago", "refluxo", "arroto",
    ],
    sexuality: [
      "marido não ajuda", "marido nao ajuda", "sozinha", "sem vontade",
      "intimidade", "relação", "relacao", "sexo", "desejo",
      "casal", "parceiro", "distância", "distancia", "fria",
      "não me sinto", "nao me sinto", "me sinto feia", "corpo mudou",
      "pós-parto", "pos-parto", "parto", "autoestima",
    ],
  },
  en: {
    sleep: [
      "won't sleep", "wont sleep", "wakes up", "up all night",
      "exhausted", "sleep deprivation", "sleep training", "every hour",
      "middle of the night", "sleep routine", "can't sleep", "cant sleep",
    ],
    colic: [
      "colic", "gas", "gassy", "hard belly", "inconsolable crying",
      "crying non-stop", "massage", "reflux", "burping",
    ],
    sexuality: [
      "husband doesn't help", "husband wont help", "alone", "no desire",
      "intimacy", "relationship", "sex drive", "partner", "distant",
      "postpartum", "body changed", "self esteem", "feel ugly",
    ],
  },
  es: {
    sleep: [
      "no duerme", "se despierta", "toda la noche", "agotada",
      "privación de sueño", "rutina de sueño", "llora de madrugada",
    ],
    colic: [
      "cólico", "colico", "gases", "barriga dura", "llanto inconsolable",
      "llora mucho", "masaje", "reflujo",
    ],
    sexuality: [
      "marido no ayuda", "sola", "sin ganas", "intimidad",
      "relación", "sexo", "deseo", "pareja", "distante",
      "posparto", "cuerpo cambió", "autoestima",
    ],
  },
  fr: {
    sleep: [
      "ne dort pas", "se réveille", "toute la nuit", "épuisée",
      "privation de sommeil", "routine de sommeil", "pleure la nuit",
    ],
    colic: [
      "colique", "gaz", "ventre dur", "pleurs inconsolables",
      "massage", "reflux",
    ],
    sexuality: [
      "mari n'aide pas", "seule", "sans envie", "intimité",
      "relation", "sexe", "désir", "partenaire", "post-partum",
    ],
  },
  de: {
    sleep: [
      "schläft nicht", "wacht auf", "die ganze nacht", "erschöpft",
      "schlafentzug", "schlaftraining", "schlafroutine",
    ],
    colic: [
      "kolik", "blähungen", "harter bauch", "untröstliches weinen",
      "massage", "reflux",
    ],
    sexuality: [
      "mann hilft nicht", "allein", "keine lust", "intimität",
      "beziehung", "sex", "verlangen", "partner", "wochenbett",
    ],
  },
};

// ─── Copy das ofertas por idioma ───────────────────────────────────────────────

const OFFER_COPY: Record<string, Record<EbookIntent & string, { teaser: string; cta: string }>> = {
  pt: {
    sleep: {
      teaser: "A privação de sono é o maior desafio da maternidade real. O guia **\"Bebê não dorme, mãe exausta\"** tem estratégias de 0 a 24 meses que já ajudaram milhares de famílias a recuperarem o descanso. Quer ver como funciona?",
      cta: "Ver o guia de sono →",
    },
    colic: {
      teaser: "Além dessas técnicas, a organização da rotina é o que realmente traz paz a longo prazo. O guia **\"Cólicas & Saúde\"** tem um plano de 14 dias para estabilizar o sistema do seu pequeno. Quer conhecer?",
      cta: "Ver o guia de cólicas →",
    },
    sexuality: {
      teaser: "Muitas mães percebem que a sobrecarga afeta diretamente a intimidade do casal. O guia **\"Quando o marido não ajuda\"** ajuda a resgatar o desejo e a conexão de forma gentil. Posso te mostrar?",
      cta: "Ver o guia de vida íntima →",
    },
  },
  en: {
    sleep: {
      teaser: "Sleep deprivation is the hardest part of real motherhood. The guide **\"Baby Won't Sleep, Mom Is Exhausted\"** has strategies from 0 to 24 months that helped thousands of families recover their rest. Want to see how it works?",
      cta: "See the sleep guide →",
    },
    colic: {
      teaser: "Beyond these techniques, routine organization is what truly brings long-term peace. The guide **\"Colic & Baby Health\"** has a 14-day plan to stabilize your little one's system. Want to know more?",
      cta: "See the colic guide →",
    },
    sexuality: {
      teaser: "Many moms find that the overload directly affects intimacy as a couple. The guide **\"Sexuality After Baby\"** helps you gently reclaim desire and connection. Want to take a look?",
      cta: "See the intimacy guide →",
    },
  },
  es: {
    sleep: {
      teaser: "La privación de sueño es el mayor desafío de la maternidad real. La guía **\"El bebé no duerme, mamá está agotada\"** tiene estrategias de 0 a 24 meses. ¿Quieres ver cómo funciona?",
      cta: "Ver la guía de sueño →",
    },
    colic: {
      teaser: "Además de estas técnicas, organizar la rutina es lo que realmente trae paz a largo plazo. La guía **\"Cólicos y Salud\"** tiene un plan de 14 días. ¿Quieres conocerla?",
      cta: "Ver la guía de cólicos →",
    },
    sexuality: {
      teaser: "Muchas mamás sienten que la sobrecarga afecta directamente la intimidad de pareja. La guía **\"Sexualidad después del bebé\"** ayuda a recuperar el deseo de forma gentil. ¿Te la muestro?",
      cta: "Ver la guía de intimidad →",
    },
  },
  fr: {
    sleep: {
      teaser: "La privation de sommeil est le plus grand défi de la maternité réelle. Le guide **\"Bébé ne dort pas, maman est épuisée\"** a des stratégies de 0 à 24 mois. Voulez-vous voir comment ça fonctionne?",
      cta: "Voir le guide sommeil →",
    },
    colic: {
      teaser: "En plus de ces techniques, l'organisation de la routine est ce qui apporte vraiment la paix. Le guide **\"Coliques & Santé du Bébé\"** a un plan de 14 jours. Voulez-vous le découvrir?",
      cta: "Voir le guide coliques →",
    },
    sexuality: {
      teaser: "Beaucoup de mamans remarquent que la surcharge affecte directement l'intimité du couple. Le guide **\"Sexualité après bébé\"** aide à retrouver le désir doucement. Je vous le montre?",
      cta: "Voir le guide intimité →",
    },
  },
  de: {
    sleep: {
      teaser: "Schlafentzug ist die größte Herausforderung der echten Mutterschaft. Der Leitfaden **\"Baby schläft nicht, Mutter ist erschöpft\"** hat Strategien von 0 bis 24 Monaten. Möchten Sie sehen, wie es funktioniert?",
      cta: "Schlaf-Leitfaden ansehen →",
    },
    colic: {
      teaser: "Neben diesen Techniken ist die Routineorganisation das, was langfristig wirklich Frieden bringt. Der Leitfaden **\"Koliken & Babygesundheit\"** hat einen 14-Tage-Plan. Möchten Sie ihn kennenlernen?",
      cta: "Kolik-Leitfaden ansehen →",
    },
    sexuality: {
      teaser: "Viele Mütter stellen fest, dass die Überlastung die Intimität des Paares direkt beeinflusst. Der Leitfaden **\"Sexualität nach dem Baby\"** hilft, das Verlangen sanft zurückzugewinnen. Soll ich ihn Ihnen zeigen?",
      cta: "Intimität-Leitfaden ansehen →",
    },
  },
};

// Mapa de intent → ebookId por idioma
const EBOOK_ID_MAP: Record<string, Record<EbookIntent & string, string>> = {
  pt: { sleep: "sleep-pt", colic: "colic-pt", sexuality: "sexuality-pt" },
  en: { sleep: "sleep-en", colic: "colic-en", sexuality: "sexuality-en" },
  es: { sleep: "sleep-es", colic: "colic-es", sexuality: "sexuality-es" },
  fr: { sleep: "sleep-fr", colic: "colic-fr", sexuality: "sexuality-fr" },
  de: { sleep: "sleep-de", colic: "colic-de", sexuality: "sexuality-de" },
};

// Fallback para ebooks que ainda não existem (colic EN/ES)
const EBOOK_FALLBACK: Record<string, string> = {
  "colic-en": "colic-pt",
  "colic-es": "colic-pt",
};

/**
 * Detecta o intent da mensagem da mãe
 * Retorna null se não houver match (sem oferta)
 */
export function detectEbookIntent(
  userMessage: string,
  lang: string = "pt"
): EbookIntent {
  const normalizedLang = ["pt", "en", "es", "fr", "de"].includes(lang) ? lang : "pt";
  const keywords = INTENT_KEYWORDS[normalizedLang] || INTENT_KEYWORDS.pt;
  const msg = userMessage.toLowerCase();

  // Ordem de prioridade: sono > cólica > sexualidade
  for (const intent of ["sleep", "colic", "sexuality"] as EbookIntent[]) {
    if (!intent) continue;
    const list = keywords[intent] || [];
    if (list.some(k => msg.includes(k))) {
      return intent;
    }
  }

  return null;
}

/**
 * Monta a oferta completa para retornar ao frontend
 */
export function buildEbookOffer(
  intent: EbookIntent,
  lang: string = "pt"
): EbookOffer | null {
  if (!intent) return null;

  const normalizedLang = ["pt", "en", "es", "fr", "de"].includes(lang) ? lang : "pt";
  const copy = OFFER_COPY[normalizedLang]?.[intent] || OFFER_COPY.pt[intent];
  const rawEbookId = EBOOK_ID_MAP[normalizedLang]?.[intent] || `${intent}-pt`;
  const ebookId = EBOOK_FALLBACK[rawEbookId] || rawEbookId;

  const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "https://wilborassist.com";

  return {
    intent,
    ebookId,
    title: copy.teaser.match(/\*\*"(.+?)"\*\*/)?.[1] || "",
    teaser: copy.teaser,
    ctaLabel: copy.cta,
    shopUrl: `${FRONTEND_URL}/shop?highlight=${ebookId}`,
  };
}
