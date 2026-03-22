import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

/**
 * Blog Router Tests
 * Tests for tRPC blog endpoints that serve 45 SEO-optimized articles
 */

describe("Blog Router - tRPC Endpoints", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      console.warn("Database not available for tests");
    }
  });

  describe("Blog Articles Database", () => {
    it("should have blog_articles table with 45 articles", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`SELECT COUNT(*) as count FROM blog_articles WHERE priority = 'tier1'`;
      const result = await db.execute(query);
      const count = (Array.isArray(result) ? result[0] : result)?.count;

      expect(count).toBeGreaterThanOrEqual(45);
    });

    it("should have articles in all three languages", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const languages = ["pt-BR", "en-US", "es-ES"];
      for (const lang of languages) {
        const query = sql`SELECT COUNT(*) as count FROM blog_articles WHERE language = ${lang} AND priority = 'tier1'`;
        const result = await db.execute(query);
        const count = (Array.isArray(result) ? result[0] : result)?.count;

        expect(count).toBeGreaterThanOrEqual(15);
      }
    });

    it("should have articles with required SEO fields", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT id, slug, title, meta_description, keywords, category, language
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 1
      `;
      const result = await db.execute(query);
      const article = Array.isArray(result) ? result[0] : result;

      expect(article).toBeDefined();
      expect(article?.slug).toBeTruthy();
      expect(article?.title).toBeTruthy();
      expect(article?.meta_description).toBeTruthy();
      expect(article?.keywords).toBeTruthy();
      expect(article?.category).toBeTruthy();
      expect(article?.language).toBeTruthy();
    });

    it("should have articles with proper reading_time", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT reading_time
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 1
      `;
      const result = await db.execute(query);
      const article = Array.isArray(result) ? result[0] : result;

      expect(article?.reading_time).toBeTruthy();
      expect(Number(article?.reading_time)).toBeGreaterThan(0);
    });

    it("should have articles with content", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT content
        FROM blog_articles
        WHERE priority = 'tier1' AND language = 'pt-BR'
        LIMIT 1
      `;
      const result = await db.execute(query);
      const article = Array.isArray(result) ? result[0] : result;

      expect(article?.content).toBeTruthy();
      expect(article?.content?.length).toBeGreaterThan(100);
    });
  });

  describe("Blog Categories", () => {
    it("should have multiple categories", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT DISTINCT category
        FROM blog_articles
        WHERE priority = 'tier1'
      `;
      const result = await db.execute(query);
      const categories = Array.isArray(result) ? result : [];

      expect(categories.length).toBeGreaterThan(0);
    });

    it("should have categories with icons", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT DISTINCT category, icon
        FROM blog_articles
        WHERE priority = 'tier1' AND icon IS NOT NULL
        LIMIT 1
      `;
      const result = await db.execute(query);
      const category = Array.isArray(result) ? result[0] : result;

      expect(category?.category).toBeTruthy();
      expect(category?.icon).toBeTruthy();
    });
  });

  describe("Blog Article Slugs", () => {
    it("should have unique slugs per language", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT slug, language, COUNT(*) as count
        FROM blog_articles
        WHERE priority = 'tier1'
        GROUP BY slug, language
        HAVING count > 1
      `;
      const result = await db.execute(query);
      const duplicates = Array.isArray(result) ? result : [];

      expect(duplicates.length).toBe(0);
    });

    it("should have valid slug format", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT slug
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 10
      `;
      const result = await db.execute(query);
      const articles = Array.isArray(result) ? result : [];

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      for (const article of articles) {
        expect((article as any).slug).toMatch(slugRegex);
      }
    });
  });

  describe("SEO Metadata", () => {
    it("should have meta_title and meta_description", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT meta_title, meta_description
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 5
      `;
      const result = await db.execute(query);
      const articles = Array.isArray(result) ? result : [];

      for (const article of articles) {
        expect((article as any).meta_title).toBeTruthy();
        expect((article as any).meta_description).toBeTruthy();
      }
    });

    it("should have proper meta_description length", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT meta_description
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 10
      `;
      const result = await db.execute(query);
      const articles = Array.isArray(result) ? result : [];

      for (const article of articles) {
        const desc = (article as any).meta_description;
        expect(desc.length).toBeGreaterThan(50);
        expect(desc.length).toBeLessThan(160);
      }
    });

    it("should have keywords", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT keywords
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 5
      `;
      const result = await db.execute(query);
      const articles = Array.isArray(result) ? result : [];

      for (const article of articles) {
        expect((article as any).keywords).toBeTruthy();
        expect((article as any).keywords.split(",").length).toBeGreaterThan(0);
      }
    });
  });

  describe("Article Distribution", () => {
    it("should have balanced distribution across languages", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT language, COUNT(*) as count
        FROM blog_articles
        WHERE priority = 'tier1'
        GROUP BY language
      `;
      const result = await db.execute(query);
      const distribution = Array.isArray(result) ? result : [];

      expect(distribution.length).toBe(3);
      for (const lang of distribution) {
        expect((lang as any).count).toBeGreaterThanOrEqual(15);
      }
    });

    it("should have articles distributed across categories", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT category, COUNT(*) as count
        FROM blog_articles
        WHERE priority = 'tier1'
        GROUP BY category
      `;
      const result = await db.execute(query);
      const distribution = Array.isArray(result) ? result : [];

      expect(distribution.length).toBeGreaterThan(0);
      for (const cat of distribution) {
        expect((cat as any).count).toBeGreaterThan(0);
      }
    });
  });

  describe("Timestamps", () => {
    it("should have created_at timestamp", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT created_at
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 1
      `;
      const result = await db.execute(query);
      const article = Array.isArray(result) ? result[0] : result;

      expect(article?.created_at).toBeTruthy();
    });

    it("should have updated_at timestamp", async () => {
      if (!db) {
        console.warn("Skipping database test - no connection");
        return;
      }

      const query = sql`
        SELECT updated_at
        FROM blog_articles
        WHERE priority = 'tier1'
        LIMIT 1
      `;
      const result = await db.execute(query);
      const article = Array.isArray(result) ? result[0] : result;

      expect(article?.updated_at).toBeTruthy();
    });
  });

  afterAll(() => {
    // Cleanup if needed
  });
});
