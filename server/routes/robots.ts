import { Router } from "express";

const router = Router();

const BASE_URL = "https://www.wilbor-assist.com";

router.get("/robots.txt", (req, res) => {
  const host = req.hostname || '';
  const isProduction = host.includes('wilbor-assist.com');

  // Different robots.txt for production vs other environments
  if (isProduction) {
    // Production: Allow all crawlers
    res.type("text/plain");
    res.send(`# Wilbor Assist - robots.txt
# https://www.wilbor-assist.com

User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Block admin and internal routes
Disallow: /api/
Disallow: /dashboard
Disallow: /checkout
Disallow: /buy-credits
Disallow: /admin
Disallow: /my-ebooks
Disallow: /*.json$
Disallow: /*.js$
`);
  } else {
    // Staging/Development: Block all crawlers
    res.type("text/plain");
    res.send(`# Wilbor Assist - robots.txt (Staging)
# Access blocked

User-agent: *
Disallow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`);
  }
});

export default router;
