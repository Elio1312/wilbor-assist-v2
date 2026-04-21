/**
 * SEO Component - Meta tags dinâmicas para SEO
 * Implementa Open Graph, Twitter Cards, Canonical e hreflang em 5 idiomas
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/contexts/i18n";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

const BASE_URL = "https://www.wilbor-assist.com";
const DEFAULT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-01-hero-principal_a9900c59.png";

// SEO presets por idioma
const SEO_CONTENT: Record<string, { home: { title: string; description: string }; blog: { title: string; description: string }; checkout: { title: string; description: string } }> = {
  pt: {
    home: {
      title: "Wilbor - AI Materno-Infantil",
      description: "Orientação confiável para mães, 24 horas por dia. Baseado em protocolos SBP, OMS e AAP.",
    },
    blog: {
      title: "Blog - Wilbor",
      description: "Artigos práticos sobre cuidados com bebê. Baseado em protocolos AAP, OMS e SBP.",
    },
    checkout: {
      title: "Escolha seu Plano - Wilbor",
      description: "Comece grátis com 5 consultas/mês ou desbloqueie IA ilimitada com Premium.",
    },
  },
  en: {
    home: {
      title: "Wilbor - AI Maternal Assistant",
      description: "Reliable guidance for mothers, 24 hours a day. Based on AAP, WHO and SBP protocols.",
    },
    blog: {
      title: "Blog - Wilbor",
      description: "Practical articles about baby care. Based on AAP, WHO and SBP protocols.",
    },
    checkout: {
      title: "Choose Your Plan - Wilbor",
      description: "Start free with 5 consultations/month or unlock unlimited AI with Premium.",
    },
  },
  es: {
    home: {
      title: "Wilbor - Asistente Materno-Infantil IA",
      description: "Orientación confiable para madres, 24 horas al día. Basado en protocolos AAP, OMS y SBP.",
    },
    blog: {
      title: "Blog - Wilbor",
      description: "Artículos prácticos sobre cuidados del bebé. Basado en protocolos AAP, OMS y SBP.",
    },
    checkout: {
      title: "Elige tu Plan - Wilbor",
      description: "Comienza gratis con 5 consultas/mes o desbloquea IA ilimitada con Premium.",
    },
  },
  fr: {
    home: {
      title: "Wilbor - Assistant Maternel IA",
      description: "Accompagnement fiable pour les mères, 24 heures sur 24. Basé sur les protocoles AAP, OMS et SBP.",
    },
    blog: {
      title: "Blog - Wilbor",
      description: "Articles pratiques sur les soins bébé. Basé sur les protocoles AAP, OMS et SBP.",
    },
    checkout: {
      title: "Choisissez votre forfait - Wilbor",
      description: "Commencez gratuitement avec 5 consultations/mois ou débloquez l'IA illimitée avec Premium.",
    },
  },
  de: {
    home: {
      title: "Wilbor - KI-Mutter-Assistent",
      description: "Zuverlässige Unterstützung für Mütter, rund um die Uhr. Basierend auf AAP-, WHO- und SBP-Protokollen.",
    },
    blog: {
      title: "Blog - Wilbor",
      description: "Praktische Artikel zur Babypflege. Basierend auf AAP-, WHO- und SBP-Protokollen.",
    },
    checkout: {
      title: "Wählen Sie Ihren Plan - Wilbor",
      description: "Starten Sie kostenlos mit 5 Beratungen/Monat oder entsperren Sie unbegrenzte KI mit Premium.",
    },
  },
};

// Locale mapping for og:locale
const OG_LOCALE: Record<string, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
};

export function Seo({ title, description, image, url, type = "website" }: SeoProps) {
  const { locale } = useI18n();
  const [location] = useLocation();

  const content = SEO_CONTENT[locale] || SEO_CONTENT.pt;
  const pageTitle = title || content.home.title;
  const pageDesc = description || content.home.description;
  const canonicalUrl = url || `${BASE_URL}${location}`;
  const fullImage = image || DEFAULT_IMAGE;
  const ogLocale = OG_LOCALE[locale] || "pt_BR";

  useEffect(() => {
    // Set document title
    document.title = pageTitle ? `${pageTitle} | Wilbor` : "Wilbor - AI Neonatal Assistant";

    // Helper to set meta tags
    const setMeta = (property: string, content: string) => {
      const existing = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      const existingName = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;

      if (existing) {
        existing.content = content;
      } else if (existingName) {
        existingName.content = content;
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("property", property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Open Graph
    setMeta("og:title", pageTitle);
    setMeta("og:description", pageDesc);
    setMeta("og:image", fullImage);
    setMeta("og:url", canonicalUrl);
    setMeta("og:type", type);
    setMeta("og:locale", ogLocale);
    setMeta("og:site_name", "Wilbor");

    // Twitter Card
    const setName = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (existing) {
        existing.content = content;
      } else {
        const meta = document.createElement("meta");
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setName("twitter:card", "summary_large_image");
    setName("twitter:title", pageTitle);
    setName("twitter:description", pageDesc);
    setName("twitter:image", fullImage);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Remove existing hreflang links
    document.querySelectorAll("link[rel='alternate']").forEach(el => el.remove());

    // Add hreflang links (remove locale prefix for clean path)
    const cleanPath = location.replace(/^\/(pt|en|es|fr|de)/, "") || "/";
    const languages = [
      { lang: "x-default", href: `${BASE_URL}${cleanPath}` },
      { lang: "pt-BR", href: `${BASE_URL}${cleanPath}` },
      { lang: "en", href: `${BASE_URL}/en${cleanPath}` },
      { lang: "es", href: `${BASE_URL}/es${cleanPath}` },
      { lang: "fr", href: `${BASE_URL}/fr${cleanPath}` },
      { lang: "de", href: `${BASE_URL}/de${cleanPath}` },
    ];

    languages.forEach(({ lang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    });

    // Add self-referencing hreflang
    const selfLink = document.createElement("link");
    selfLink.rel = "alternate";
    selfLink.hreflang = locale;
    selfLink.href = canonicalUrl;
    document.head.appendChild(selfLink);

  }, [pageTitle, pageDesc, fullImage, canonicalUrl, type, ogLocale, locale, location]);

  return null;
}

// Presets para páginas específicas (dinâmico por locale)
export function getSeoPreset(page: "home" | "blog" | "checkout") {
  return (locale: string) => {
    const content = SEO_CONTENT[locale] || SEO_CONTENT.pt;
    return {
      title: content[page].title,
      description: content[page].description,
    };
  };
}

export const SEO_PRESETS = {
  home: { title: "Wilbor - AI Materno-Infantil", description: "Orientação confiável para mães, 24 horas por dia." },
  blog: { title: "Blog - Wilbor", description: "Artigos práticos sobre cuidados com bebê." },
  checkout: { title: "Escolha seu Plano - Wilbor", description: "Comece grátis ou desbloqueie IA ilimitada." },
};
