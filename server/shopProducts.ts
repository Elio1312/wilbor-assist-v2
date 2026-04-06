/**
 * shopProducts.ts
 * Catálogo de ebooks da loja Wilbor
 * Pool (Manus) - 06/04/2026
 * 
 * ESTRATÉGIA: Ebook = isca → converte para Wilbor Premium
 * Dentro de cada ebook há CTAs para o Wilbor
 */

export type EbookProduct = {
  id: string;
  category: "sleep" | "colic" | "sexuality" | "bonus";
  lang: "pt" | "en" | "es" | "fr" | "de";
  title: string;
  subtitle: string;
  description: string;
  pdfUrl: string;
  // Preços em centavos
  priceBRL: number;  // R$
  priceUSD: number;  // USD cents
  priceEUR: number;  // EUR cents
  priceGBP: number;  // GBP pence
  stripePriceId?: string; // preencher após criar no Stripe
  bundleEligible: boolean;
};

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663323996241/mZboHNpvSfpNytZ6fcTMzd";

export const EBOOK_PRODUCTS: EbookProduct[] = [
  // ─── SONO DO BEBÊ ───────────────────────────────────────────────────────────
  {
    id: "sleep-pt",
    category: "sleep",
    lang: "pt",
    title: "Bebê não dorme? Mamãe exausta.",
    subtitle: "Guia completo baseado em ciência",
    description: "Descubra por que seu bebê resiste ao sono e como criar uma rotina que funciona de verdade — sem choro sem fim.",
    pdfUrl: `${CDN}/Bebe-nao-dorme-mae-exausta_cbd743ac.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sleep-en",
    category: "sleep",
    lang: "en",
    title: "Baby Won't Sleep, Mom Is Exhausted",
    subtitle: "The complete science-based guide",
    description: "Discover why your baby fights sleep and how to build a routine that actually works — without endless crying.",
    pdfUrl: `${CDN}/Baby-Wont-Sleep-Mom-Is-Exhausted_7de0287d.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sleep-es",
    category: "sleep",
    lang: "es",
    title: "El bebé no duerme, mamá está agotada",
    subtitle: "Guía completa basada en ciencia",
    description: "Descubre por qué tu bebé lucha contra el sueño y cómo crear una rutina que funcione de verdad.",
    pdfUrl: `${CDN}/El-bebe-no-duerme-mama-esta-agotada_3dcccf05.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sleep-fr",
    category: "sleep",
    lang: "fr",
    title: "Bébé ne dort pas, maman est épuisée",
    subtitle: "Le guide complet basé sur la science",
    description: "Découvrez pourquoi votre bébé résiste au sommeil et comment créer une routine qui fonctionne vraiment.",
    pdfUrl: `${CDN}/Bebe-ne-dort-pas-maman-est-epuisee_32d4b969.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sleep-de",
    category: "sleep",
    lang: "de",
    title: "Baby schläft nicht, Mutter ist erschöpft",
    subtitle: "Der vollständige wissenschaftsbasierte Leitfaden",
    description: "Entdecken Sie, warum Ihr Baby gegen den Schlaf kämpft und wie Sie eine Routine aufbauen, die wirklich funktioniert.",
    pdfUrl: `${CDN}/Das-Baby-schlaft-nicht-die-Mutter-ist-erschopft_182fcb66.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },

  // ─── CÓLICAS & SAÚDE ────────────────────────────────────────────────────────
  {
    id: "colic-pt",
    category: "colic",
    lang: "pt",
    title: "Cólica do bebê: o que fazer na prática",
    subtitle: "Alívio imediato e prevenção baseados em evidências",
    description: "Técnicas comprovadas para aliviar a cólica, entender o choro e manter a calma quando tudo parece difícil.",
    pdfUrl: `${CDN}/Colicas-and-Saude_823803a5.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "colic-fr",
    category: "colic",
    lang: "fr",
    title: "Coliques et Santé du Bébé",
    subtitle: "Soulagement immédiat et prévention basés sur les preuves",
    description: "Techniques éprouvées pour soulager les coliques, comprendre les pleurs et garder son calme.",
    pdfUrl: `${CDN}/Coliques-and-Sante-du-Bebe_71498fce.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "colic-de",
    category: "colic",
    lang: "de",
    title: "Koliken und Babygesundheit",
    subtitle: "Sofortige Linderung und evidenzbasierte Prävention",
    description: "Bewährte Techniken zur Linderung von Koliken, zum Verstehen des Weinens und zur Ruhe.",
    pdfUrl: `${CDN}/Koliken-and-Babygesundheit_16dec94e.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },

  // ─── SEXUALIDADE APÓS O BEBÊ ─────────────────────────────────────────────────
  {
    id: "sexuality-pt",
    category: "sexuality",
    lang: "pt",
    title: "Quando o marido não ajuda",
    subtitle: "Vida íntima após o bebê (sem pressão, sem culpa)",
    description: "Como reconectar com seu parceiro, cuidar de você mesma e reconstruir a intimidade no pós-parto.",
    pdfUrl: `${CDN}/Quando-o-Marido-Nao-Ajuda_392a29a4.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sexuality-es",
    category: "sexuality",
    lang: "es",
    title: "Sexualidad después del bebé",
    subtitle: "Vida íntima sin presión, sin culpa",
    description: "Cómo reconectar con tu pareja, cuidarte y reconstruir la intimidad en el posparto.",
    pdfUrl: `${CDN}/Sexualidad-Despues-del-Bebe_dfbb804e.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sexuality-fr",
    category: "sexuality",
    lang: "fr",
    title: "Sexualité après bébé",
    subtitle: "Vie intime sans pression, sans culpabilité",
    description: "Comment vous reconnecter avec votre partenaire, prendre soin de vous et reconstruire l'intimité après l'accouchement.",
    pdfUrl: `${CDN}/Sexualite-Apres-Bebe_b55ace09.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
  {
    id: "sexuality-de",
    category: "sexuality",
    lang: "de",
    title: "Sexualität nach dem Baby",
    subtitle: "Intimleben ohne Druck, ohne Schuldgefühle",
    description: "Wie Sie sich mit Ihrem Partner wieder verbinden, für sich selbst sorgen und die Intimität nach der Geburt wiederaufbauen.",
    pdfUrl: `${CDN}/Sexualitat-Nach-Dem-Baby_48b90286.pdf`,
    priceBRL: 2900,
    priceUSD: 700,
    priceEUR: 700,
    priceGBP: 600,
    bundleEligible: true,
  },
];

// Preços de bundle (3 ebooks do mesmo idioma)
export const BUNDLE_PRICES = {
  BRL: 6900,  // R$69
  USD: 1700,  // $17
  EUR: 1700,  // €17
  GBP: 1500,  // £15
};

// Categorias disponíveis
export const CATEGORIES = {
  sleep: { label: { pt: "Sono do Bebê", en: "Baby Sleep", es: "Sueño del Bebé", fr: "Sommeil du Bébé", de: "Babyschlaf" }, emoji: "😴" },
  colic: { label: { pt: "Cólicas & Saúde", en: "Colic & Health", es: "Cólicos y Salud", fr: "Coliques & Santé", de: "Koliken & Gesundheit" }, emoji: "🍼" },
  sexuality: { label: { pt: "Vida Íntima", en: "Intimate Life", es: "Vida Íntima", fr: "Vie Intime", de: "Intimleben" }, emoji: "💕" },
};
