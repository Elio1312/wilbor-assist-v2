/**
 * SEO Configuration and Utilities
 * Handles meta tags, schema.org, and structured data
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "blog";
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(config: SEOConfig) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || "",
    og: {
      title: config.title,
      description: config.description,
      image: config.image || "https://www.wilbor-assist.com/og-image.png",
      url: config.url || "https://www.wilbor-assist.com",
      type: config.type || "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      image: config.image || "https://www.wilbor-assist.com/og-image.png",
    },
  };
}

/**
 * Generate schema.org Article structured data
 */
export function generateArticleSchema(config: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    image: config.image || "https://www.wilbor-assist.com/og-image.png",
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      "@type": "Organization",
      name: "Wilbor-Assist",
      url: "https://www.wilbor-assist.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Wilbor-Assist",
      logo: {
        "@type": "ImageObject",
        url: "https://www.wilbor-assist.com/logo.png",
      },
    },
    url: config.url,
  };
}

/**
 * Generate schema.org BreadcrumbList for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate schema.org Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wilbor-Assist",
    url: "https://www.wilbor-assist.com",
    logo: "https://www.wilbor-assist.com/logo.png",
    description: "Assistente neonatal inteligente baseado em protocolos científicos (SBP, OMS, AAP)",
    sameAs: [
      "https://www.instagram.com/wilborassist",
      "https://www.facebook.com/wilborassist",
      "https://www.youtube.com/@wilborassist",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@wilbor-assist.com",
    },
    areaServed: ["BR", "US", "ES"],
    availableLanguage: ["pt-BR", "en-US", "es-ES"],
  };
}

/**
 * Generate schema.org FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate hreflang links for multilingual content
 */
export function generateHreflang(slug: string, languages: string[] = ["pt-BR", "en-US", "es-ES"]) {
  const baseUrl = "https://www.wilbor-assist.com";
  return languages.map((lang) => ({
    rel: "alternate",
    hreflang: lang,
    href: `${baseUrl}/${lang === "pt-BR" ? "" : `?lang=${lang.split("-")[0]}`}${slug}`,
  }));
}

/**
 * SEO Configuration for homepage
 */
export const HOME_SEO: SEOConfig = {
  title: "Wilbor-Assist: Assistente Neonatal IA | Respostas Baseadas em Protocolos Científicos",
  description:
    "Wilbor-Assist oferece respostas personalizadas sobre saúde neonatal baseadas em protocolos SBP, OMS e AAP. Chat IA 24/7, trilha de desenvolvimento, receitas e monitoramento de sono.",
  keywords:
    "assistente neonatal, IA saúde bebê, protocolos SBP, desenvolvimento infantil, sono bebê, cólica, amamentação",
  type: "website",
};

/**
 * SEO Configuration for blog listing
 */
export const BLOG_SEO: SEOConfig = {
  title: "Blog Wilbor-Assist | Artigos sobre Saúde Neonatal e Desenvolvimento Infantil",
  description:
    "Explore 45+ artigos otimizados sobre saúde neonatal, desenvolvimento infantil, sono, alimentação e bem-estar materno. Baseado em protocolos científicos.",
  keywords:
    "blog saúde bebê, artigos neonatal, desenvolvimento infantil, sono bebê, cólica, amamentação, introdução alimentar",
  type: "website",
};

/**
 * Generate canonical URL
 */
export function generateCanonical(path: string): string {
  return `https://www.wilbor-assist.com${path}`;
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImage(title: string): string {
  return `https://www.wilbor-assist.com/og-image.png?title=${encodeURIComponent(title)}`;
}
