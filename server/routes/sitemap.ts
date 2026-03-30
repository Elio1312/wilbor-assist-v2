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

// Static pages — all 5 languages
const STATIC_PAGES = [
  { path: "",           priority: "1.0", changefreq: "weekly"  },
  { path: "/blog",      priority: "0.9", changefreq: "daily"   },
  { path: "/chat",      priority: "0.8", changefreq: "weekly"  },
  { path: "/dashboard", priority: "0.7", changefreq: "weekly"  },
  { path: "/checkout",  priority: "0.6", changefreq: "monthly" },
];

// Real slugs from BlogArticle.tsx BLOG_ARTICLES array (the actual rendered pages)
const BLOG_SLUGS = [
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
];

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

  // Blog articles — each slug in all 5 languages
  for (const slug of BLOG_SLUGS) {
    for (const lang of LANGS) {
      const loc = `${baseUrl}${lang.prefix}/blog/${slug}`;
      sitemap += `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>`;
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
