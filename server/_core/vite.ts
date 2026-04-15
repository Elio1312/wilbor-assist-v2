import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getBlogSeoFromPath } from "../../client/src/lib/blogContent";
import viteConfig from "../../vite.config";

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function upsertMeta(html: string, attribute: "name" | "property", key: string, content: string): string {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*content=["'][^"']*["'][^>]*>`, "i");
  const replacement = `<meta ${attribute}="${key}" content="${content}" />`;
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `  ${replacement}\n  </head>`);
}

function upsertLink(html: string, rel: string, href: string): string {
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<link\\s+rel=["']${escapedRel}["'][^>]*href=["'][^"']*["'][^>]*>`, "i");
  const replacement = `<link rel="${rel}" href="${href}" />`;
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("</head>", `  ${replacement}\n  </head>`);
}

function replaceAlternateLinks(html: string, alternates: Array<{ hreflang: string; href: string }>): string {
  const cleaned = html.replace(/\s*<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gi, "\n");
  const block = alternates
    .map((alternate) => `    <link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`)
    .join("\n");
  return cleaned.replace("</head>", `${block}\n  </head>`);
}

function injectBlogSeo(html: string, requestUrl: string): string {
  const pathname = requestUrl.startsWith("http") ? new URL(requestUrl).pathname : new URL(requestUrl, "https://www.wilbor-assist.com").pathname;
  const seo = getBlogSeoFromPath(pathname);

  if (!seo) {
    return html.replace(
      /<title>[^<]*<\/title>/i,
      "<title>Wilbor-Assist: Assistente Neonatal IA | Protocolos SBP, OMS e AAP</title>"
    );
  }

  let nextHtml = html;
  nextHtml = replaceTag(nextHtml, /<html[^>]*lang=["'][^"']*["'][^>]*>/i, `<html lang="${seo.htmlLang}">`);
  nextHtml = replaceTag(nextHtml, /<title>[^<]*<\/title>/i, `<title>${seo.title}</title>`);
  nextHtml = replaceTag(
    nextHtml,
    /<script>document\.title=["'][^"']*["'];<\/script>/i,
    `<script>document.title=${JSON.stringify(seo.title)};</script>`
  );
  nextHtml = upsertMeta(nextHtml, "name", "title", seo.title);
  nextHtml = upsertMeta(nextHtml, "name", "description", seo.description);
  nextHtml = upsertMeta(nextHtml, "name", "keywords", seo.keywords.join(", "));
  nextHtml = upsertMeta(nextHtml, "name", "language", seo.htmlLang);
  nextHtml = upsertMeta(nextHtml, "property", "og:type", seo.ogType);
  nextHtml = upsertMeta(nextHtml, "property", "og:url", seo.canonicalUrl);
  nextHtml = upsertMeta(nextHtml, "property", "og:title", seo.title);
  nextHtml = upsertMeta(nextHtml, "property", "og:description", seo.description);
  nextHtml = upsertMeta(nextHtml, "property", "og:locale", seo.ogLocale);
  nextHtml = upsertMeta(nextHtml, "name", "twitter:url", seo.canonicalUrl);
  nextHtml = upsertMeta(nextHtml, "name", "twitter:title", seo.title);
  nextHtml = upsertMeta(nextHtml, "name", "twitter:description", seo.description);
  nextHtml = upsertLink(nextHtml, "canonical", seo.canonicalUrl);
  nextHtml = replaceAlternateLinks(nextHtml, seo.alternates);
  nextHtml = nextHtml.replace(
    /<div id="seo-content"[\s\S]*?<\/div>/i,
    `<div id="seo-content" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">${seo.staticContentHtml}</div>`
  );

  return nextHtml;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      template = injectBlogSeo(template, url);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  app.use(express.static(distPath));

  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    try {
      let html = fs.readFileSync(indexPath, "utf-8");
      html = injectBlogSeo(html, req.originalUrl);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch {
      res.sendFile(indexPath);
    }
  });
}
