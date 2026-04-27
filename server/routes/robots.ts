import { Router } from "express";

const router = Router();

// ─── URL canônica SEM www ────────────────────────────────────────────────────
const BASE_URL = "https://wilbor-assist.com";

router.get("/robots.txt", (req, res) => {
  const host = req.hostname || "";

  // ─── CORREÇÃO: detecção de produção corrigida ────────────────────────────
  // Antes: host.includes('[wilbor-assist.com](http://wilbor-assist.com)')
  // que nunca era verdadeiro porque incluía markdown no texto.
  // Agora: checa corretamente se é o domínio de produção (com ou sem www).
  const isProduction =
    host === "wilbor-assist.com" || host === "www.wilbor-assist.com";

  res.type("text/plain");

  if (isProduction) {
    res.send(`# Wilbor Assist - robots.txt
# ${BASE_URL}
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
    // Staging/Development: bloqueia todos os crawlers
    res.send(`# Wilbor Assist - robots.txt (Staging)
# Acesso bloqueado
User-agent: *
Disallow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`);
  }
});

export default router;

