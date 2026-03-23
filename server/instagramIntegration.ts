/**
 * Instagram Feed Integration for Wilbor
 * Exibir feed do Instagram integrado ao app
 * Publicação automática de conteúdo
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

// ==========================================
// TYPES
// ==========================================

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL";
  mediaUrl: string;
  thumbnail?: string;
  timestamp: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  profilePictureUrl: string;
  followerCount: number;
  followingCount: number;
  postsCount: number;
}

// ==========================================
// INSTAGRAM ROUTER
// ==========================================

export const instagramRouter = router({
  // Obter perfil do Instagram
  getProfile: publicProcedure
    .input(z.object({
      username: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        const profile: InstagramProfile = {
          id: "wilbor_assist",
          username: input.username || "wilbor_assist",
          name: "Wilbor - Assistente de Bebê",
          biography: "Seu mentor inteligente para cuidados com bebê 👶 Sono, alimentação, desenvolvimento e muito mais!",
          profilePictureUrl: "https://via.placeholder.com/150",
          followerCount: 5432,
          followingCount: 234,
          postsCount: 89,
        };

        return {
          success: true,
          profile,
        };
      } catch (error) {
        console.error("[Instagram] Get profile error:", error);
        throw new Error("Failed to get profile");
      }
    }),

  // Obter feed do Instagram
  getFeed: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
      after: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        const posts: InstagramPost[] = [
          {
            id: "post_1",
            caption: "Dica: Use o Sleep Tracker para registrar as sonecas do seu bebê! 😴",
            mediaType: "IMAGE",
            mediaUrl: "https://via.placeholder.com/500x500",
            thumbnail: "https://via.placeholder.com/150x150",
            timestamp: Date.now() - 86400000,
            likeCount: 234,
            commentCount: 45,
            engagementRate: 5.2,
          },
          {
            id: "post_2",
            caption: "Seu bebê tem cólica? Conheça as técnicas de alívio que funcionam! 🍼",
            mediaType: "VIDEO",
            mediaUrl: "https://via.placeholder.com/500x500",
            thumbnail: "https://via.placeholder.com/150x150",
            timestamp: Date.now() - 172800000,
            likeCount: 567,
            commentCount: 89,
            engagementRate: 8.1,
          },
          {
            id: "post_3",
            caption: "Marcos do desenvolvimento: o que esperar aos 6 meses 📈",
            mediaType: "CAROUSEL",
            mediaUrl: "https://via.placeholder.com/500x500",
            thumbnail: "https://via.placeholder.com/150x150",
            timestamp: Date.now() - 259200000,
            likeCount: 345,
            commentCount: 67,
            engagementRate: 6.3,
          },
        ];

        return {
          success: true,
          posts,
          hasMore: true,
          nextCursor: "cursor_next",
        };
      } catch (error) {
        console.error("[Instagram] Get feed error:", error);
        throw new Error("Failed to get feed");
      }
    }),

  // Publicar post no Instagram
  publishPost: protectedProcedure
    .input(z.object({
      caption: z.string(),
      imageUrl: z.string(),
      mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL"]).default("IMAGE"),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          postId: `post_${Date.now()}`,
          caption: input.caption,
          mediaType: input.mediaType,
          publishedAt: new Date().toISOString(),
          status: "published",
        };
      } catch (error) {
        console.error("[Instagram] Publish post error:", error);
        throw new Error("Failed to publish post");
      }
    }),

  // Agendar post no Instagram
  schedulePost: protectedProcedure
    .input(z.object({
      caption: z.string(),
      imageUrl: z.string(),
      scheduledTime: z.string(),
      mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL"]).default("IMAGE"),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          postId: `post_${Date.now()}`,
          caption: input.caption,
          scheduledTime: input.scheduledTime,
          status: "scheduled",
        };
      } catch (error) {
        console.error("[Instagram] Schedule post error:", error);
        throw new Error("Failed to schedule post");
      }
    }),

  // Obter insights do Instagram
  getInsights: protectedProcedure
    .input(z.object({
      period: z.enum(["day", "week", "month"]).default("week"),
    }))
    .query(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          period: input.period,
          metrics: {
            impressions: 12543,
            reach: 8234,
            engagement: 1234,
            engagementRate: 9.8,
            followers: 5432,
            newFollowers: 234,
            topPost: {
              id: "post_1",
              engagement: 567,
              engagementRate: 12.3,
            },
          },
        };
      } catch (error) {
        console.error("[Instagram] Get insights error:", error);
        throw new Error("Failed to get insights");
      }
    }),

  // Responder comentários automaticamente
  respondToComments: protectedProcedure
    .input(z.object({
      postId: z.string(),
      autoRespond: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          postId: input.postId,
          autoRespond: input.autoRespond,
          respondedCount: 5,
          message: "Respostas automáticas ativadas",
        };
      } catch (error) {
        console.error("[Instagram] Respond to comments error:", error);
        throw new Error("Failed to respond to comments");
      }
    }),

  // Obter comentários recentes
  getComments: publicProcedure
    .input(z.object({
      postId: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      try {
        // Aqui você integraria com Instagram API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          postId: input.postId,
          comments: [
            {
              id: "comment_1",
              author: "user_1",
              text: "Adorei essa dica! 😍",
              timestamp: Date.now() - 3600000,
              likeCount: 23,
            },
            {
              id: "comment_2",
              author: "user_2",
              text: "Muito útil, obrigada!",
              timestamp: Date.now() - 7200000,
              likeCount: 45,
            },
          ],
        };
      } catch (error) {
        console.error("[Instagram] Get comments error:", error);
        throw new Error("Failed to get comments");
      }
    }),

  // Conectar conta do Instagram
  connectAccount: protectedProcedure
    .input(z.object({
      accessToken: z.string(),
      username: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você salvaria o token no banco de dados
        // Por enquanto, retornamos um mock
        return {
          success: true,
          username: input.username,
          connected: true,
          connectedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[Instagram] Connect account error:", error);
        throw new Error("Failed to connect account");
      }
    }),

  // Desconectar conta do Instagram
  disconnectAccount: protectedProcedure
    .mutation(async () => {
      try {
        // Aqui você removeria o token do banco de dados
        // Por enquanto, retornamos um mock
        return {
          success: true,
          disconnected: true,
          message: "Conta desconectada com sucesso",
        };
      } catch (error) {
        console.error("[Instagram] Disconnect account error:", error);
        throw new Error("Failed to disconnect account");
      }
    }),
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function generateInstagramCaption(topic: string, cta?: string): string {
  const captions: Record<string, string> = {
    sleep: "💤 Dica de sono: Use o Sleep Tracker do Wilbor para registrar as sonecas do seu bebê e receber alertas personalizados!",
    feeding: "🍼 Dica de alimentação: Registre cada mamada no Feeding Tracker e saiba quando é a próxima!",
    development: "📈 Marcos do desenvolvimento: Acompanhe o progresso do seu bebê no Diary do Wilbor!",
    colic: "😢 Cólica: Use o Panic Button do Wilbor para respostas instantâneas!",
    default: "👶 Dica de cuidados com bebê: Use o Wilbor para acompanhar a saúde do seu bebê!",
  };

  let caption = captions[topic] || captions.default;

  if (cta) {
    caption += `\n\n${cta}`;
  }

  caption += "\n\n#Wilbor #CuidadosComBebê #Maternidade #Paternidade #BebêSaudável";

  return caption;
}

export function isValidInstagramUsername(username: string): boolean {
  // Instagram usernames: 1-30 characters, letters, numbers, periods, underscores
  const regex = /^[a-zA-Z0-9._]{1,30}$/;
  return regex.test(username);
}

export function formatInstagramUrl(username: string): string {
  return `https://instagram.com/${username}`;
}
