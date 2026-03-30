import { Router } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

// 5 language variants
const LANGS = [
  { prefix: "",    hreflang: "pt-BR" },
  { prefix: "/en", hreflang: "en"    },
  { prefix: "/es", hreflang: "es"    },
  { prefix: "/fr", hreflang: "fr"    },
  { prefix: "/de", hreflang: "de"    },
];

const STATIC_PAGES = [
  { path: "",           priority: "1.0", changefreq: "weekly"  },
  { path: "/blog",      priority: "0.9", changefreq: "daily"   },
  { path: "/chat",      priority: "0.8", changefreq: "weekly"  },
  { path: "/dashboard", priority: "0.7", changefreq: "weekly"  },
  { path: "/checkout",  priority: "0.6", changefreq: "monthly" },
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) { res.status(500).send("Database not available"); return; }

    const [articles] = await db.execute(sql`
      SELECT slug, language, created_at, updated_at
      FROM blog_articles WHERE priority = 'tier1' ORDER BY language, slug
    `);
    const articlesList = Array.isArray(articles) ? articles : [];

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

    // Blog articles grouped by slug
    const langPrefixMap: Record<string, string> = { "pt-BR": "", "en-US": "/en", "es-ES": "/es", "fr-FR": "/fr", "de-DE": "/de" };
    const hreflangMap: Record<string, string>   = { "pt-BR": "pt-BR", "en-US": "en", "es-ES": "es", "fr-FR": "fr", "de-DE": "de" };

    const bySlug = new Map<string, any[]>();
    for (const a of articlesList) {
      const slug = (a as any).slug;
      if (!bySlug.has(slug)) bySlug.set(slug, []);
      bySlug.get(slug)!.push(a);
    }

    for (const [slug, variants] of Array.from(bySlug.entries())) {
      const main = variants[0] as any;
      const lastmod = main.updated_at ? new Date(main.updated_at).toISOString().split("T")[0] : today;
      const canonical = variants.find((v: any) => v.language === "pt-BR") || main;
      const canonPrefix = langPrefixMap[(canonical as any).language] ?? "";

      sitemap += `\n  <url>\n    <loc>${baseUrl}${canonPrefix}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>`;
      for (const v of variants) {
        const lang = (v as any).language as string;
        sitemap += `\n    <xhtml:link rel="alternate" hreflang="${hreflangMap[lang] ?? lang}" href="${baseUrl}${langPrefixMap[lang] ?? ""}/blog/${slug}" />`;
      }
      const enV = variants.find((v: any) => v.language === "en-US");
      sitemap += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${enV ? "/en" : canonPrefix}/blog/${slug}" />\n  </url>`;
    }

    sitemap += `\n\n</urlset>`;
    res.type("application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("[Sitemap] Error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

router.get("/sitemap-index.xml", async (req, res) => {
  const baseUrl = "https://www.wilbor-assist.com";
  const today = new Date().toISOString().split("T")[0];
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${baseUrl}/sitemap.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n</sitemapindex>`);
});

export default router;
