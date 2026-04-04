import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { wilborEbooks, wilborEbookPurchases } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";

// Initialize Stripe with a stable API version
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2023-10-16" as any,
  });
};

export const shopRouter = router({
  // 1. Listagem Inteligente (SEO e Conversão)
  listEbooks: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      orderBy: z.enum(["price", "rating", "newest"]).default("newest"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DATABASE_NOT_AVAILABLE");
      
      let query = db.select().from(wilborEbooks);
      
      if (input.category) {
        query = query.where(eq(wilborEbooks.category, input.category)) as any;
      }
      
      const results = await query;
      
      // Manual sorting for performance on small tables
      return results.sort((a, b) => {
        if (input.orderBy === "price") return a.priceBrl - b.priceBrl;
        if (input.orderBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }),

  // 2. Detalhes do Produto (95% de Assertividade na Informação)
  getEbook: publicProcedure
    .input(z.object({ ebookId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DATABASE_NOT_AVAILABLE");
      
      const [ebook] = await db
        .select()
        .from(wilborEbooks)
        .where(eq(wilborEbooks.id, input.ebookId))
        .limit(1);
      
      if (!ebook) throw new Error("EBOOK_NOT_FOUND");
      return ebook;
    }),

  // 3. Checkout de Venda Única (ROI de Renda Rápida)
  createEbookCheckout: protectedProcedure
    .input(z.object({ ebookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DATABASE_NOT_AVAILABLE");
      
      const stripe = getStripe();
      if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED");

      const [ebook] = await db
        .select()
        .from(wilborEbooks)
        .where(eq(wilborEbooks.id, input.ebookId))
        .limit(1);

      if (!ebook) throw new Error("EBOOK_NOT_FOUND");

      // Detecção de Moeda Baseada no Idioma do Usuário (Internacionalização)
      const userLang = ctx.user.language || "pt";
      const currencyMap: Record<string, { code: string; price: number }> = {
        pt: { code: "brl", price: ebook.priceBrl },
        en: { code: "usd", price: ebook.priceUsd },
        es: { code: "eur", price: ebook.priceEur },
      };

      const { code, price } = currencyMap[userLang] || currencyMap.pt;

      // Criação da Sessão de PAGAMENTO ÚNICO no Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: code,
              product_data: {
                name: userLang === "en" ? (ebook.titleEn || ebook.titlePt) : userLang === "es" ? (ebook.titleEs || ebook.titlePt) : ebook.titlePt,
                description: userLang === "en" ? (ebook.descriptionEn || ebook.descriptionPt) : userLang === "es" ? (ebook.descriptionEs || ebook.descriptionPt) : ebook.descriptionPt,
                images: [ebook.coverImage],
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: "payment", // Essencial para Venda de E-book
        success_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/shop`,
        customer_email: ctx.user.email || undefined,
        metadata: {
          userId: ctx.user.id.toString(),
          ebookId: ebook.id,
          type: "ebook_purchase"
        },
      });

      return { url: session.url };
    }),

  // 4. Listagem de E-books Comprados (Biblioteca Privada)
  getMyPurchasedEbooks: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DATABASE_NOT_AVAILABLE");

      const purchases = await db
        .select({
          purchase: wilborEbookPurchases,
          ebook: wilborEbooks,
        })
        .from(wilborEbookPurchases)
        .innerJoin(wilborEbooks, eq(wilborEbookPurchases.ebookId, wilborEbooks.id))
        .where(
          and(
            eq(wilborEbookPurchases.userId, ctx.user.id),
            eq(wilborEbookPurchases.status, "completed")
          )
        );

      return purchases;
    }),
});
