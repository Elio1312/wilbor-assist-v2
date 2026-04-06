/**
 * shopRoutes.ts
 * Rotas tRPC para a Loja de Ebooks Wilbor
 * Pool (Manus) - 06/04/2026
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { wilborEbooks, wilborEbookPurchases } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { EBOOK_PRODUCTS, BUNDLE_PRICES, CATEGORIES } from "./shopProducts";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY_CUSTOM || process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY não configurada");
    stripeInstance = new Stripe(secretKey, { apiVersion: "2023-10-16" as any });
  }
  return stripeInstance;
}

const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "https://wilborassist.com";

export const shopRouter = router({
  /**
   * Listar todos os ebooks disponíveis (público)
   */
  listEbooks: publicProcedure
    .input(z.object({
      category: z.enum(["sleep", "colic", "sexuality", "all"]).default("all"),
      lang: z.enum(["pt", "en", "es", "fr", "de", "all"]).default("all"),
    }).optional())
    .query(async ({ input }) => {
      let products = EBOOK_PRODUCTS;

      if (input?.category && input.category !== "all") {
        products = products.filter(p => p.category === input.category);
      }
      if (input?.lang && input.lang !== "all") {
        products = products.filter(p => p.lang === input.lang);
      }

      // Retorna sem pdfUrl (não expor URL antes da compra)
      return products.map(({ pdfUrl: _pdfUrl, ...p }) => p);
    }),

  /**
   * Obter detalhes de um ebook (público)
   */
  getEbook: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const product = EBOOK_PRODUCTS.find(p => p.id === input.id);
      if (!product) throw new Error("Ebook não encontrado");
      const { pdfUrl: _pdfUrl, ...safe } = product;
      return safe;
    }),

  /**
   * Verificar se usuário já comprou um ebook
   */
  checkPurchase: protectedProcedure
    .input(z.object({ ebookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { purchased: false };

      const purchase = await db
        .select()
        .from(wilborEbookPurchases)
        .where(
          and(
            eq(wilborEbookPurchases.userId, ctx.user.id),
            eq(wilborEbookPurchases.ebookId, input.ebookId),
            eq(wilborEbookPurchases.status, "completed")
          )
        )
        .limit(1);

      return { purchased: purchase.length > 0 };
    }),

  /**
   * Listar ebooks comprados pelo usuário
   */
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const purchases = await db
      .select()
      .from(wilborEbookPurchases)
      .where(
        and(
          eq(wilborEbookPurchases.userId, ctx.user.id),
          eq(wilborEbookPurchases.status, "completed")
        )
      );

    // Retorna os ebooks comprados com URL de download
    return purchases.map(purchase => {
      const product = EBOOK_PRODUCTS.find(p => p.id === purchase.ebookId);
      if (!product) return null;
      return {
        ...purchase,
        title: product.title,
        category: product.category,
        lang: product.lang,
        pdfUrl: product.pdfUrl, // URL exposta apenas para compradores
      };
    }).filter(Boolean);
  }),

  /**
   * Obter URL de download (apenas para compradores)
   */
  getDownloadUrl: protectedProcedure
    .input(z.object({ ebookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const purchase = await db
        .select()
        .from(wilborEbookPurchases)
        .where(
          and(
            eq(wilborEbookPurchases.userId, ctx.user.id),
            eq(wilborEbookPurchases.ebookId, input.ebookId),
            eq(wilborEbookPurchases.status, "completed")
          )
        )
        .limit(1);

      if (purchase.length === 0) {
        throw new Error("Você não tem acesso a este ebook");
      }

      const product = EBOOK_PRODUCTS.find(p => p.id === input.ebookId);
      if (!product) throw new Error("Ebook não encontrado");

      return { url: product.pdfUrl };
    }),

  /**
   * Criar sessão de checkout Stripe para ebook individual
   */
  createEbookCheckout: protectedProcedure
    .input(z.object({
      ebookId: z.string(),
      currency: z.enum(["BRL", "USD", "EUR", "GBP"]).default("BRL"),
    }))
    .mutation(async ({ ctx, input }) => {
      const product = EBOOK_PRODUCTS.find(p => p.id === input.ebookId);
      if (!product) throw new Error("Ebook não encontrado");

      // Verificar se já comprou
      const db = await getDb();
      if (db) {
        const existing = await db
          .select()
          .from(wilborEbookPurchases)
          .where(
            and(
              eq(wilborEbookPurchases.userId, ctx.user.id),
              eq(wilborEbookPurchases.ebookId, input.ebookId),
              eq(wilborEbookPurchases.status, "completed")
            )
          )
          .limit(1);

        if (existing.length > 0) {
          throw new Error("Você já possui este ebook");
        }
      }

      const stripe = getStripe();
      const currencyMap: Record<string, number> = {
        BRL: product.priceBRL,
        USD: product.priceUSD,
        EUR: product.priceEUR,
        GBP: product.priceGBP,
      };

      const amount = currencyMap[input.currency];
      const currency = input.currency.toLowerCase();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: product.title,
                description: product.subtitle,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${FRONTEND_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}&ebook=${input.ebookId}`,
        cancel_url: `${FRONTEND_URL}/shop?payment=cancelled`,
        metadata: {
          userId: String(ctx.user.id),
          ebookId: input.ebookId,
          currency: input.currency,
          type: "ebook_purchase",
        },
      });

      // Registrar compra pendente
      if (db) {
        await db.insert(wilborEbookPurchases).values({
          userId: ctx.user.id,
          ebookId: input.ebookId,
          amount,
          currency: input.currency,
          stripeSessionId: session.id,
          status: "pending",
        });
      }

      return { success: true, sessionId: session.id, url: session.url };
    }),

  /**
   * Criar sessão de checkout para bundle (3 ebooks da mesma categoria/idioma)
   */
  createBundleCheckout: protectedProcedure
    .input(z.object({
      ebookIds: z.array(z.string()).min(2).max(3),
      currency: z.enum(["BRL", "USD", "EUR", "GBP"]).default("BRL"),
    }))
    .mutation(async ({ ctx, input }) => {
      const products = input.ebookIds.map(id => EBOOK_PRODUCTS.find(p => p.id === id)).filter(Boolean);
      if (products.length !== input.ebookIds.length) throw new Error("Ebook(s) não encontrado(s)");

      const stripe = getStripe();
      const bundleAmount = BUNDLE_PRICES[input.currency];
      const currency = input.currency.toLowerCase();

      const titles = products.map(p => p!.title).join(" + ");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Bundle Wilbor: ${titles}`,
                description: `Pacote com ${products.length} ebooks`,
              },
              unit_amount: bundleAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${FRONTEND_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}&bundle=${input.ebookIds.join(",")}`,
        cancel_url: `${FRONTEND_URL}/shop?payment=cancelled`,
        metadata: {
          userId: String(ctx.user.id),
          ebookIds: input.ebookIds.join(","),
          currency: input.currency,
          type: "ebook_bundle",
        },
      });

      // Registrar compras pendentes para cada ebook do bundle
      const db = await getDb();
      if (db) {
        for (const ebookId of input.ebookIds) {
          await db.insert(wilborEbookPurchases).values({
            userId: ctx.user.id,
            ebookId,
            amount: Math.round(bundleAmount / input.ebookIds.length),
            currency: input.currency,
            stripeSessionId: `${session.id}_${ebookId}`,
            status: "pending",
          });
        }
      }

      return { success: true, sessionId: session.id, url: session.url };
    }),

  /**
   * Confirmar compra após webhook Stripe (chamado pelo frontend após redirect)
   */
  confirmPurchase: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      if (session.payment_status !== "paid") {
        return { success: false, message: "Pagamento não confirmado" };
      }

      const db = await getDb();
      if (!db) return { success: false, message: "Database error" };

      // Atualizar status para completed
      await db
        .update(wilborEbookPurchases)
        .set({ status: "completed" })
        .where(
          and(
            eq(wilborEbookPurchases.userId, ctx.user.id),
            eq(wilborEbookPurchases.stripeSessionId, input.sessionId)
          )
        );

      // Para bundles, atualizar todos os ebooks do bundle
      if (session.metadata?.type === "ebook_bundle" && session.metadata.ebookIds) {
        const ebookIds = session.metadata.ebookIds.split(",");
        for (const ebookId of ebookIds) {
          await db
            .update(wilborEbookPurchases)
            .set({ status: "completed" })
            .where(
              and(
                eq(wilborEbookPurchases.userId, ctx.user.id),
                eq(wilborEbookPurchases.stripeSessionId, `${input.sessionId}_${ebookId}`)
              )
            );
        }
      }

      return { success: true };
    }),

  /**
   * Dados das categorias para UI
   */
  getCategories: publicProcedure.query(() => {
    return CATEGORIES;
  }),
});
