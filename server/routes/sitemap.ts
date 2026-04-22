import { Router } from "express";

const router = Router();

// 5 language prefixes with hreflang codes
const LANGS = [
  { prefix: "",    hreflang: "pt-BR" },
  { prefix: "/en", hreflang: "en"    },
  { prefix: "/es", hreflang: "es"    },
  { prefix: "/fr", hreflang: "fr"    },
  { prefix: "/de", hreflang: "de"    },
];

// Static pages — PUBLIC only (no auth required)
// DO NOT add /dashboard, /checkout, /buy-credits — they redirect unauthenticated users (Soft 404)
const STATIC_PAGES = [
  { path: "",      priority: "1.0", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "daily"  },
  { path: "/chat", priority: "0.8", changefreq: "weekly" },
];

// Blog slugs per language (each language has its own set of articles)
const BLOG_SLUGS_PT = [
  "bebe-nao-dorme",
  "colica-do-bebe",
  "febre-no-bebe",
  "introducao-alimentar",
  "depressao-pos-parto",
  "vacinas-do-bebe",
  "amamentacao-pega-correta",
  "seguranca-bebe-em-casa",
  "saltos-de-desenvolvimento",
  "banho-do-recem-nascido",
  "algoritmo-predicao-sono-bebe",
  "ia-que-le-entrelinhas-mae",
  "surtos-de-crescimento-do-bebe",
  "ictericia-neonatal-causas-e-tratamento",
  "dentição-do-bebe-sintomas-e-alivio",
  "ansiedade-pos-parto-vs-depressao-diferencas",
  "por-que-wilbor-nunca-prescreve-remedios",
];

const BLOG_SLUGS_EN = [
  "baby-wont-sleep",
  "baby-colic-relief",
  "baby-fever-guide",
  "baby-food-introduction",
  "postpartum-depression",
  "baby-vaccination-schedule",
  "breastfeeding-latch-guide",
  "baby-safety-home",
  "baby-developmental-leaps",
  "newborn-bath-guide",
  "when-do-babies-start-sleeping-through-the-night",
  "baby-growth-spurts-signs-and-what-to-do",
  "newborn-jaundice-causes-and-treatment",
  "baby-teething-symptoms-and-relief",
  "postpartum-anxiety-vs-depression-key-differences",
  "why-wilbor-never-prescribes-medication",
];

const BLOG_SLUGS_ES = [
  "bebe-no-duerme",
  "colico-del-bebe",
  "fiebre-en-bebe",
  "introduccion-alimentaria",
  "depresion-posparto",
  "vacunas-del-bebe",
  "lactancia-agarre-correcto",
  "seguridad-bebe-hogar",
  "saltos-desarrollo-bebe",
  "bano-recien-nacido",
  "cuando-empiezan-los-bebes-a-dormir-toda-la-noche",
  "denticion-del-bebe-sintomas-y-alivio",
  "ictericia-neonatal-causas-y-tratamiento",
  "ansiedad-posparto-sintomas-y-diferencias-con-depresion",
  "crecimiento-del-bebe-tablas-de-peso-y-talla-oms",
  "por-que-wilbor-nunca-receta-medicamentos",
];

const BLOG_SLUGS_FR = [
  "bebe-ne-dort-pas",
  "coliques-bebe",
  "fievre-bebe",
  "diversification-alimentaire",
  "vaccins-bebe",
  "allaitement-guide-complet",
  "developpement-moteur-bebe",
  "securite-bebe-maison",
  "pics-developpement-bebe",
  "bain-nouveau-ne",
  "algorithme-predit-sommeil-bebe",
  "ia-lit-entre-les-lignes",
  "poussees-de-croissance-du-bebe",
  "ictere-neonatal-causes-et-traitement",
  "dentition-du-bebe-symptomes-et-soulagement",
  "anxiete-post-partum-vs-depression-differences",
  "pourquoi-wilbor-ne-prescrit-jamais-de-medicaments",
];

const BLOG_SLUGS_DE = [
  "baby-schlaeft-nicht",
  "bauchkoliken-baby",
  "fieber-baby",
  "beikosteinfuehrung",
  "impfkalender-baby",
  "stillen-leitfaden",
  "motorische-entwicklung-baby",
  "babysicherheit-zuhause",
  "entwicklungsspruenge-baby",
  "neugeborenes-baden",
  "algorithmus-schlafvorhersage-baby",
  "ki-liest-zwischen-den-zeilen",
  "wachstumsschube-beim-baby",
  "neugeborenengelbsucht-ursachen-und-behandlung",
  "zahnen-beim-baby-symptome-und-linderung",
  "wochenbettangst-vs-wochenbettdepression-unterschiede",
  "warum-wilbor-niemals-medikamente-verschreibt",
];

// Map language prefix to its slug array
const LANG_SLUGS: Record<string, string[]> = {
  "": BLOG_SLUGS_PT,
  "/en": BLOG_SLUGS_EN,
  "/es": BLOG_SLUGS_ES,
  "/fr": BLOG_SLUGS_FR,
  "/de": BLOG_SLUGS_DE,
};

  router.get("/sitemap.xml", (req, res) => {
	  const baseUrl = "https://www.wilbor-assist.com";
  const today = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Static pages — 5 languages each
  for (const page of STATIC_PAGES) {
    for (const lang of LANGS) {
      const loc = `${baseUrl}${lang.prefix}${page.path}`;
      sitemap += `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>`;
      for (const alt of LANGS) {
        sitemap += `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${baseUrl}${alt.prefix}${page.path}" />`;
      }
      sitemap += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en${page.path}" />\n  </url>`;
    }
  }

  // Blog articles — each language has its own set of slugs
  // CRITICAL: Each localized version MUST list all language variants (Google requirement)
  for (const lang of LANGS) {
    const slugs = LANG_SLUGS[lang.prefix] ?? BLOG_SLUGS_PT;
    for (const slug of slugs) {
      const loc = `${baseUrl}${lang.prefix}/blog/${slug}`;
      sitemap += `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>`;
      // Add ALL language variants for this article (Google SEO requirement)
      for (const alt of LANGS) {
        sitemap += `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${baseUrl}${alt.prefix}/blog/${slug}" />`;
      }
      sitemap += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/blog/${slug}" />\n  </url>`;
    }
  }

  sitemap += `\n\n</urlset>`;
  res.type("application/xml");
  res.send(sitemap);
});

	router.get("/sitemap-index.xml", (req, res) => {
	  const baseUrl = "https://www.wilbor-assist.com";
  const today = new Date().toISOString().split("T")[0];
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${baseUrl}/sitemap.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n</sitemapindex>`);
});

export default router;
