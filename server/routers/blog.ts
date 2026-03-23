import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { INTELLIGENT_BLOGS, getBlogBySlug, getRelatedBlogs, searchBlogs, getBlogsByCategory } from "../intelligentBlogs";

export const blogRouter = router({
  // Get all articles for a specific language
  getArticles: publicProcedure
    .input(
      z.object({
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
        category: z.string().optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return [];
        }

        let query = sql`
          SELECT 
            id,
            slug,
            title,
            meta_description,
            keywords,
            reading_time,
            category,
            icon,
            priority,
            language,
            created_at
          FROM blog_articles
          WHERE language = ${input.language} AND priority = 'tier1'
        `;

        if (input.category) {
          query = sql`${query} AND category = ${input.category}`;
        }

        query = sql`${query} ORDER BY created_at DESC LIMIT ${input.limit} OFFSET ${input.offset}`;

        const [rows] = await db.execute(query);
        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("[Blog] Error fetching articles:", error);
        return [];
      }
    }),

  // Get single article by slug
  getArticle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return null;
        }

        const query = sql`
          SELECT 
            id,
            slug,
            title,
            meta_description,
            keywords,
            reading_time,
            category,
            icon,
            priority,
            language,
            content,
            created_at,
            updated_at
          FROM blog_articles
          WHERE slug = ${input.slug} AND language = ${input.language}
          LIMIT 1
        `;

        const [rows] = await db.execute(query);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      } catch (error) {
        console.error("[Blog] Error fetching article:", error);
        return null;
      }
    }),

  // Search articles by keywords
  searchArticles: publicProcedure
    .input(
      z.object({
        query: z.string().min(2),
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
        limit: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return [];
        }

        const searchQuery = `%${input.query}%`;
        const query = sql`
          SELECT 
            id,
            slug,
            title,
            meta_description,
            reading_time,
            category,
            icon,
            language,
            created_at
          FROM blog_articles
          WHERE language = ${input.language} AND priority = 'tier1'
          AND (title LIKE ${searchQuery} OR meta_description LIKE ${searchQuery} OR keywords LIKE ${searchQuery})
          ORDER BY created_at DESC
          LIMIT ${input.limit}
        `;

        const [rows] = await db.execute(query);

        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("[Blog] Error searching articles:", error);
        return [];
      }
    }),

  // Get articles by category
  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return [];
        }

        const query = sql`
          SELECT 
            id,
            slug,
            title,
            meta_description,
            reading_time,
            category,
            icon,
            language,
            created_at
          FROM blog_articles
          WHERE language = ${input.language} AND category = ${input.category} AND priority = 'tier1'
          ORDER BY created_at DESC
          LIMIT ${input.limit}
        `;

        const [rows] = await db.execute(query);

        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("[Blog] Error fetching articles by category:", error);
        return [];
      }
    }),

  // Get related articles
  getRelated: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
        limit: z.number().default(3),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return [];
        }

        // First get the category of the current article
        const currentQuery = sql`
          SELECT category FROM blog_articles
          WHERE slug = ${input.slug} AND language = ${input.language}
          LIMIT 1
        `;

        const [currentRows] = await db.execute(currentQuery);

        if (!Array.isArray(currentRows) || currentRows.length === 0) {
          return [];
        }

        const category = (currentRows[0] as any)?.category;
        if (!category) return [];

        // Then get related articles from the same category
        const relatedQuery = sql`
          SELECT 
            id,
            slug,
            title,
            meta_description,
            reading_time,
            category,
            icon,
            language,
            created_at
          FROM blog_articles
          WHERE language = ${input.language} AND category = ${category} AND slug != ${input.slug} AND priority = 'tier1'
          ORDER BY created_at DESC
          LIMIT ${input.limit}
        `;

         const [rows] = await db.execute(relatedQuery);
        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("[Blog] Error fetching related articles:", error);
        return [];
      }
    }),

  // Get all categories
  getCategories: publicProcedure
    .input(
      z.object({
        language: z.enum(["pt-BR", "en-US", "es-ES"]).default("pt-BR"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Blog] Database not available");
          return [];
        }

        const query = sql`
          SELECT DISTINCT category, icon
          FROM blog_articles
          WHERE language = ${input.language} AND priority = 'tier1'
          ORDER BY category ASC
        `;

        const [rows] = await db.execute(query);
        return Array.isArray(rows) ? rows : [];
      } catch (error) {
        console.error("[Blog] Error fetching categories:", error);
        return [];
      }
    }),

  // ==========================================
  // INTELLIGENT BLOGS ENDPOINTS
  // ==========================================

  // Get all intelligent blogs
  getAllIntelligentBlogs: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(({ input }) => {
      if (input.category) {
        return getBlogsByCategory(input.category);
      }
      return INTELLIGENT_BLOGS;
    }),

  // Get intelligent blog by slug
  getIntelligentBlog: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      return getBlogBySlug(input.slug) || null;
    }),

  // Get related intelligent blogs
  getRelatedIntelligentBlogs: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      return getRelatedBlogs(input.slug);
    }),

  // Search intelligent blogs
  searchIntelligentBlogs: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return searchBlogs(input.query);
    }),

  // Get intelligent blogs by category
  getIntelligentBlogsByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return getBlogsByCategory(input.category);
    }),
});
