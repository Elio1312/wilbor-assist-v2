import { blogArticlesData } from "../../../server/blogArticles";
import {
  blogArticlesDE,
  blogArticlesEN,
  blogArticlesES,
  blogArticlesFR,
  type BlogArticleTranslation,
} from "../pages/blogArticlesI18n";

export type BlogLocale = "pt" | "en" | "es" | "fr" | "de";

export interface LocalizedBlogArticle {
  id: string;
  locale: BlogLocale;
  slug: string;
  title: string;
  description: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  readTimeMinutes: number;
  readTimeLabel: string;
  content: string;
  alternates: Partial<Record<BlogLocale, string>>;
}

export interface BlogSeoPayload {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogType: "website" | "article";
  htmlLang: string;
  ogLocale: string;
  alternates: Array<{ hreflang: string; href: string }>;
  staticContentHtml: string;
}

const SITE_NAME = "Wilbor-Assist";
const BASE_URL = "https://www.wilbor-assist.com";
const OG_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-01-hero-principal_a9900c59.png";
const BLOG_LOCALES: BlogLocale[] = ["pt", "en", "es", "fr", "de"];

const LISTING_SEO: Record<BlogLocale, { title: string; description: string; keywords: string[] }> = {
  pt: {
    title: "Blog Wilbor-Assist | Guias sobre sono, cólica, febre e desenvolvimento do bebê",
    description:
      "Artigos práticos do Wilbor sobre sono do bebê, cólica, febre, vacinas, amamentação e desenvolvimento infantil com foco em orientação segura.",
    keywords: [
      "blog bebê",
      "sono do bebê",
      "cólica do bebê",
      "febre no bebê",
      "amamentação",
      "desenvolvimento infantil",
    ],
  },
  en: {
    title: "Wilbor Blog | Baby sleep, colic, fever and development guides",
    description:
      "Explore practical Wilbor guides about baby sleep, colic, fever, feeding, vaccines and development with safety-focused explanations.",
    keywords: [
      "baby sleep guide",
      "baby colic",
      "baby fever",
      "breastfeeding guide",
      "baby development",
      "Wilbor blog",
    ],
  },
  es: {
    title: "Blog Wilbor | Guías sobre sueño, cólico, fiebre y desarrollo del bebé",
    description:
      "Explora guías prácticas de Wilbor sobre sueño del bebé, cólico, fiebre, alimentación, vacunas y desarrollo infantil con orientación segura.",
    keywords: [
      "sueño del bebé",
      "cólico del bebé",
      "fiebre en bebé",
      "lactancia",
      "desarrollo del bebé",
      "blog Wilbor",
    ],
  },
  fr: {
    title: "Blog Wilbor | Guides sur le sommeil, les coliques, la fièvre et le développement du bébé",
    description:
      "Découvrez les guides pratiques de Wilbor sur le sommeil du bébé, les coliques, la fièvre, l'allaitement, les vaccins et le développement.",
    keywords: [
      "sommeil bébé",
      "coliques bébé",
      "fièvre bébé",
      "allaitement",
      "développement bébé",
      "blog Wilbor",
    ],
  },
  de: {
    title: "Wilbor Blog | Leitfäden zu Babyschlaf, Koliken, Fieber und Entwicklung",
    description:
      "Praktische Wilbor-Leitfäden zu Babyschlaf, Koliken, Fieber, Ernährung, Impfungen und Entwicklung mit sicherheitsorientierter Erklärung.",
    keywords: [
      "Babyschlaf",
      "Koliken Baby",
      "Fieber Baby",
      "Stillen",
      "Baby Entwicklung",
      "Wilbor Blog",
    ],
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[\-\*]\s+/gm, "")
    .replace(/^\|.*\|$/gm, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function summarizeMarkdown(markdown: string, maxLength = 420): string {
  const text = stripMarkdown(markdown).replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function getLocalePrefix(locale: BlogLocale): string {
  return locale === "pt" ? "" : `/${locale}`;
}

export function buildBlogPath(locale: BlogLocale, slug?: string): string {
  const base = `${getLocalePrefix(locale)}/blog`;
  return slug ? `${base}/${slug}` : base;
}

function getHtmlLang(locale: BlogLocale): string {
  switch (locale) {
    case "en":
      return "en-US";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    case "de":
      return "de-DE";
    default:
      return "pt-BR";
  }
}

function getOgLocale(locale: BlogLocale): string {
  return getHtmlLang(locale).replace("-", "_");
}

function inferCategoryFromText(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes("sleep") || normalized.includes("dorme") || normalized.includes("duerme") || normalized.includes("schlaf") || normalized.includes("dort")) return "sono";
  if (normalized.includes("colic") || normalized.includes("cólica") || normalized.includes("colico") || normalized.includes("coliques") || normalized.includes("kolik")) return "colica";
  if (normalized.includes("fever") || normalized.includes("febre") || normalized.includes("fiebre") || normalized.includes("fièvre") || normalized.includes("fieber")) return "febre";
  if (normalized.includes("food") || normalized.includes("aliment") || normalized.includes("beikost") || normalized.includes("diversification") || normalized.includes("feeding")) return "alimentacao";
  if (normalized.includes("vacci") || normalized.includes("vacina") || normalized.includes("impf")) return "vacinas";
  if (normalized.includes("breast") || normalized.includes("amament") || normalized.includes("lactancia") || normalized.includes("allait") || normalized.includes("stillen")) return "amamentacao";
  if (normalized.includes("safety") || normalized.includes("seguran") || normalized.includes("sécur") || normalized.includes("sicher")) return "seguranca";
  if (normalized.includes("development") || normalized.includes("desenvol") || normalized.includes("desarrollo") || normalized.includes("développement") || normalized.includes("entwicklung")) return "saltos";
  if (normalized.includes("bath") || normalized.includes("baño") || normalized.includes("banho") || normalized.includes("bain") || normalized.includes("baden")) return "higiene";
  if (normalized.includes("postpartum") || normalized.includes("posparto") || normalized.includes("post-partum") || normalized.includes("wochenbett")) return "saude";
  return "geral";
}

function parseReadTime(value: string | number | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) return Number(match[0]);
  }
  return 5;
}

function buildReadTimeLabel(locale: BlogLocale, minutes: number): string {
  switch (locale) {
    case "en":
      return `${minutes} min read`;
    case "es":
      return `${minutes} min de lectura`;
    case "fr":
      return `${minutes} min de lecture`;
    case "de":
      return `${minutes} Min. Lesezeit`;
    default:
      return `${minutes} min`;
  }
}

function normalizePtArticles(): LocalizedBlogArticle[] {
  return blogArticlesData.map((article, index) => {
    const minutes = parseReadTime(article.readTimeMinutes);
    return {
      id: `article-${index + 1}`,
      locale: "pt",
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      seoTitle: `${article.title} | ${SITE_NAME}`,
      seoDescription: article.seoMetaDescription || article.description,
      seoKeywords: article.seoKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      readTimeMinutes: minutes,
      readTimeLabel: buildReadTimeLabel("pt", minutes),
      content: article.content,
      alternates: {},
    };
  });
}

function normalizeTranslatedArticles(locale: BlogLocale, articles: BlogArticleTranslation[], fallbackCategories: string[]): LocalizedBlogArticle[] {
  return articles.map((article, index) => {
    const minutes = parseReadTime(article.readTime);
    return {
      id: `article-${index + 1}`,
      locale,
      slug: article.slug,
      title: article.title,
      description: article.excerpt || article.metaDescription,
      category: fallbackCategories[index] || inferCategoryFromText(`${article.slug} ${article.title}`),
      seoTitle: article.metaTitle,
      seoDescription: article.metaDescription,
      seoKeywords: article.keywords,
      readTimeMinutes: minutes,
      readTimeLabel: buildReadTimeLabel(locale, minutes),
      content: article.content,
      alternates: {},
    };
  });
}

const ptArticles = normalizePtArticles();
const fallbackCategories = ptArticles.map((article) => article.category);

const articlesByLocale: Record<BlogLocale, LocalizedBlogArticle[]> = {
  pt: ptArticles,
  en: normalizeTranslatedArticles("en", blogArticlesEN, fallbackCategories),
  es: normalizeTranslatedArticles("es", blogArticlesES, fallbackCategories),
  fr: normalizeTranslatedArticles("fr", blogArticlesFR, fallbackCategories),
  de: normalizeTranslatedArticles("de", blogArticlesDE, fallbackCategories),
};

const maxArticleCount = Math.max(...BLOG_LOCALES.map((locale) => articlesByLocale[locale].length));
for (let index = 0; index < maxArticleCount; index += 1) {
  const alternates = BLOG_LOCALES.reduce<Partial<Record<BlogLocale, string>>>((acc, locale) => {
    const article = articlesByLocale[locale][index];
    if (article) acc[locale] = article.slug;
    return acc;
  }, {});

  BLOG_LOCALES.forEach((locale) => {
    const article = articlesByLocale[locale][index];
    if (article) article.alternates = alternates;
  });
}

export function getBlogArticles(locale: BlogLocale): LocalizedBlogArticle[] {
  return articlesByLocale[locale] || articlesByLocale.pt;
}

export function findBlogArticle(locale: BlogLocale, slug?: string | null): { article: LocalizedBlogArticle | null; redirectSlug?: string } {
  if (!slug) return { article: null };

  const exact = getBlogArticles(locale).find((article) => article.slug === slug);
  if (exact) return { article: exact };

  for (const currentLocale of BLOG_LOCALES) {
    const index = articlesByLocale[currentLocale].findIndex((article) => article.slug === slug);
    if (index >= 0) {
      const localizedEquivalent = articlesByLocale[locale][index];
      if (localizedEquivalent) {
        return {
          article: localizedEquivalent,
          redirectSlug: localizedEquivalent.slug !== slug ? localizedEquivalent.slug : undefined,
        };
      }
      return { article: articlesByLocale.pt[index] || null };
    }
  }

  return { article: null };
}

function buildAlternateLinksFromSlugMap(slugMap: Partial<Record<BlogLocale, string>>): Array<{ hreflang: string; href: string }> {
  const alternates = BLOG_LOCALES.filter((locale) => slugMap[locale]).map((locale) => ({
    hreflang: getHtmlLang(locale),
    href: `${BASE_URL}${buildBlogPath(locale, slugMap[locale])}`,
  }));

  const xDefaultSlug = slugMap.en || slugMap.pt;
  if (xDefaultSlug) {
    alternates.push({
      hreflang: "x-default",
      href: `${BASE_URL}${buildBlogPath(slugMap.en ? "en" : "pt", xDefaultSlug)}`,
    });
  }

  return alternates;
}

function buildListingAlternateLinks(): Array<{ hreflang: string; href: string }> {
  const alternates = BLOG_LOCALES.map((locale) => ({
    hreflang: getHtmlLang(locale),
    href: `${BASE_URL}${buildBlogPath(locale)}`,
  }));
  alternates.push({ hreflang: "x-default", href: `${BASE_URL}${buildBlogPath("en")}` });
  return alternates;
}

export function getBlogListingSeo(locale: BlogLocale): BlogSeoPayload {
  const listing = LISTING_SEO[locale] || LISTING_SEO.pt;
  const articles = getBlogArticles(locale).slice(0, 8);
  const items = articles
    .map((article) => `<li><a href="${escapeHtml(`${BASE_URL}${buildBlogPath(locale, article.slug)}`)}">${escapeHtml(article.title)}</a></li>`)
    .join("");

  return {
    title: listing.title,
    description: listing.description,
    keywords: listing.keywords,
    canonicalUrl: `${BASE_URL}${buildBlogPath(locale)}`,
    ogType: "website",
    htmlLang: getHtmlLang(locale),
    ogLocale: getOgLocale(locale),
    alternates: buildListingAlternateLinks(),
    staticContentHtml: `<h1>${escapeHtml(listing.title)}</h1><p>${escapeHtml(listing.description)}</p><ul>${items}</ul>`,
  };
}

export function getBlogArticleSeo(locale: BlogLocale, article: LocalizedBlogArticle): BlogSeoPayload {
  const summary = summarizeMarkdown(article.content);
  const canonicalUrl = `${BASE_URL}${buildBlogPath(locale, article.slug)}`;
  const alternateLinks = buildAlternateLinksFromSlugMap(article.alternates);

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.seoKeywords,
    canonicalUrl,
    ogType: "article",
    htmlLang: getHtmlLang(locale),
    ogLocale: getOgLocale(locale),
    alternates: alternateLinks,
    staticContentHtml: `<article><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.description)}</p><p>${escapeHtml(summary)}</p><p><a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a></p></article>`,
  };
}

function setMetaTag(attribute: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  let tag = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url: string) {
  if (typeof document === "undefined") return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setAlternateLinks(alternates: Array<{ hreflang: string; href: string }>) {
  if (typeof document === "undefined") return;
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());
  alternates.forEach((alternate) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", alternate.hreflang);
    link.setAttribute("href", alternate.href);
    document.head.appendChild(link);
  });
}

export function applyBlogDocumentSeo(seo: BlogSeoPayload) {
  if (typeof document === "undefined") return;

  document.title = seo.title;
  document.documentElement.lang = seo.htmlLang;

  setMetaTag("name", "title", seo.title);
  setMetaTag("name", "description", seo.description);
  setMetaTag("name", "keywords", seo.keywords.join(", "));
  setMetaTag("name", "language", seo.htmlLang);
  setMetaTag("property", "og:type", seo.ogType);
  setMetaTag("property", "og:url", seo.canonicalUrl);
  setMetaTag("property", "og:title", seo.title);
  setMetaTag("property", "og:description", seo.description);
  setMetaTag("property", "og:image", OG_IMAGE);
  setMetaTag("property", "og:site_name", SITE_NAME);
  setMetaTag("property", "og:locale", seo.ogLocale);
  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:url", seo.canonicalUrl);
  setMetaTag("name", "twitter:title", seo.title);
  setMetaTag("name", "twitter:description", seo.description);
  setMetaTag("name", "twitter:image", OG_IMAGE);
  setCanonical(seo.canonicalUrl);
  setAlternateLinks(seo.alternates);
}

export function getBlogSeoFromPath(pathname: string): BlogSeoPayload | null {
  const match = pathname.match(/^\/(en|es|fr|de)?\/?blog(?:\/([^/?#]+))?\/?$/i) || pathname.match(/^\/blog(?:\/([^/?#]+))?\/?$/i);
  if (!match) return null;

  const locale = (match[1]?.toLowerCase() as BlogLocale | undefined) || "pt";
  const slug = match[2] ? decodeURIComponent(match[2]) : undefined;

  if (!slug) return getBlogListingSeo(locale);

  const { article } = findBlogArticle(locale, slug);
  if (!article) return null;
  return getBlogArticleSeo(locale, article);
}
