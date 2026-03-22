import { Router } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

/**
 * Dynamic sitemap.xml endpoint
 * Includes all 45 blog articles + main pages
 * Supports language variants for SEO
 */
router.get("/sitemap.xml", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).send("Database not available");
      return;
    }

    // Fetch all blog articles
    const articlesQuery = sql`
      SELECT slug, language, created_at, updated_at
      FROM blog_articles
      WHERE priority = 'tier1'
      ORDER BY language, slug
    `;

    const [articles] = await db.execute(articlesQuery);
    const articlesList = Array.isArray(articles) ? articles : [];

    // Build sitemap XML
    const baseUrl = "https://www.wilbor-assist.com";
    const today = new Date().toISOString().split("T")[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

  <!-- Homepage with language variants -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/?lang=en" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="${baseUrl}/?lang=es" />
  </url>

  <!-- Blog listing page -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/blog?lang=en" />
    <xhtml:link rel="alternate" hreflang="es-ES" href="${baseUrl}/blog?lang=es" />
  </url>

  <!-- Dashboard -->
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog articles with language variants -->
`;

    // Group articles by slug to create hreflang links
    const articlesBySlug = new Map<string, any[]>();
    for (const article of articlesList) {
      const slug = (article as any).slug;
      if (!articlesBySlug.has(slug)) {
        articlesBySlug.set(slug, []);
      }
      articlesBySlug.get(slug)!.push(article);
    }

    // Add each article with language variants
    const sitemapEntries = Array.from(articlesBySlug.entries());
      for (const [slug, variants] of sitemapEntries) {
        const mainArticle = variants[0] as any;
      const lastmod = mainArticle.updated_at
        ? new Date(mainArticle.updated_at).toISOString().split("T")[0]
        : today;

      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;

      // Add hreflang for each language variant
      const langMap: Record<string, string> = {
        "pt-BR": "pt-BR",
        "en-US": "en-US",
        "es-ES": "es-ES",
      };

      for (const [lang, hreflang] of Object.entries(langMap)) {
        const hasVariant = variants.some((v: any) => v.language === lang);
        if (hasVariant) {
          sitemap += `
    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${baseUrl}/blog/${slug}?lang=${lang.split("-")[0]}" />`;
        }
      }

      sitemap += `
  </url>`;
    }

    sitemap += `
</urlset>`;

    res.type("application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

/**
 * Sitemap index for large sites (future use)
 * Can split into multiple sitemaps if needed
 */
router.get("/sitemap-index.xml", async (req, res) => {
  const baseUrl = "https://www.wilbor-assist.com";
  const today = new Date().toISOString().split("T")[0];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.type("application/xml");
  res.send(sitemapIndex);
});

export default router;
