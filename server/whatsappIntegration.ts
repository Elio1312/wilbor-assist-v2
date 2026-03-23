/**
 * WhatsApp Integration for Wilbor
 * Webhook para receber mensagens e áudio do WhatsApp
 * Integração com transcrição de áudio e respostas IA
 */

import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

// ==========================================
// TYPES
// ==========================================

export interface WhatsAppMessage {
  from: string;
  to: string;
  type: "text" | "audio" | "image" | "document";
  text?: string;
  mediaUrl?: string;
  mediaId?: string;
  timestamp: number;
  messageId: string;
}

export interface WhatsAppResponse {
  to: string;
  type: "text" | "audio";
  text?: string;
  mediaUrl?: string;
}

// ==========================================
// WHATSAPP WEBHOOK HANDLER
// ==========================================

export const whatsappRouter = router({
  // Webhook para receber mensagens do WhatsApp
  webhook: publicProcedure
    .input(z.object({
      object: z.string(),
      entry: z.array(z.object({
        id: z.string(),
        changes: z.array(z.object({
          value: z.object({
            messaging_product: z.string(),
            messages: z.array(z.object({
              from: z.string(),
              id: z.string(),
              timestamp: z.string(),
              type: z.enum(["text", "audio", "image", "document"]),
              text: z.object({ body: z.string() }).optional(),
              audio: z.object({ id: z.string(), mime_type: z.string() }).optional(),
              image: z.object({ id: z.string(), mime_type: z.string() }).optional(),
              document: z.object({ id: z.string(), mime_type: z.string(), filename: z.string() }).optional(),
            })).optional(),
            contacts: z.array(z.object({
              profile: z.object({ name: z.string() }),
              wa_id: z.string(),
            })).optional(),
          }),
        })),
      })),
    }))
    .mutation(async ({ input }) => {
      try {
        const messages: WhatsAppMessage[] = [];

        for (const entry of input.entry) {
          for (const change of entry.changes) {
            const value = change.value;

            if (value.messages) {
              for (const msg of value.messages) {
                const message: WhatsAppMessage = {
                  from: msg.from,
                  to: value.messaging_product,
                  type: msg.type,
                  timestamp: parseInt(msg.timestamp),
                  messageId: msg.id,
                };

                // Processar diferentes tipos de mensagem
                if (msg.type === "text" && msg.text) {
                  message.text = msg.text.body;
                } else if (msg.type === "audio" && msg.audio) {
                  message.mediaId = msg.audio.id;
                  message.mediaUrl = `https://graph.instagram.com/v18.0/${msg.audio.id}?fields=media_product_type&access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`;
                } else if (msg.type === "image" && msg.image) {
                  message.mediaId = msg.image.id;
                } else if (msg.type === "document" && msg.document) {
                  message.mediaId = msg.document.id;
                }

                messages.push(message);
              }
            }
          }
        }

        return {
          success: true,
          messagesProcessed: messages.length,
          messages,
        };
      } catch (error) {
        console.error("[WhatsApp] Webhook error:", error);
        return {
          success: false,
          error: "Failed to process webhook",
        };
      }
    }),

  // Enviar mensagem de texto via WhatsApp
  sendTextMessage: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com WhatsApp API
        // Por enquanto, retornamos um mock
        return {
          success: true,
          messageId: `msg_${Date.now()}`,
          to: input.phoneNumber,
          text: input.message,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[WhatsApp] Send message error:", error);
        throw new Error("Failed to send message");
      }
    }),

  // Transcrever áudio via WhatsApp
  transcribeAudio: protectedProcedure
    .input(z.object({
      mediaId: z.string(),
      language: z.enum(["pt", "en", "es"]).default("pt"),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com Whisper API ou similar
        // Por enquanto, retornamos um mock
        return {
          success: true,
          mediaId: input.mediaId,
          transcription: "Transcrição do áudio do WhatsApp",
          language: input.language,
          confidence: 0.95,
        };
      } catch (error) {
        console.error("[WhatsApp] Transcription error:", error);
        throw new Error("Failed to transcribe audio");
      }
    }),

  // Processar mensagem e gerar resposta IA
  processMessage: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
      messageType: z.enum(["text", "audio_transcription"]).default("text"),
    }))
    .mutation(async ({ input }) => {
      try {
        // Aqui você integraria com LLM (GPT, Gemini, etc)
        // Por enquanto, retornamos um mock
        const responses: Record<string, string> = {
          "meu bebê não dorme": "Seu bebê não dorme? Use o Sleep Tracker do Wilbor para registrar as sonecas e receber alertas personalizados!",
          "cólica": "Seu bebê tem cólica? Use o Panic Button do Wilbor para respostas instantâneas sobre técnicas de alívio.",
          "quanto leite": "Use o Feeding Tracker do Wilbor para registrar cada mamada e saber quando é a próxima.",
          "default": "Olá! Sou o Wilbor, seu assistente inteligente para cuidados com bebê. Como posso ajudar?",
        };

        const lowerMessage = input.message.toLowerCase();
        let response = responses.default;

        for (const [key, value] of Object.entries(responses)) {
          if (key !== "default" && lowerMessage.includes(key)) {
            response = value;
            break;
          }
        }

        return {
          success: true,
          phoneNumber: input.phoneNumber,
          userMessage: input.message,
          aiResponse: response,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[WhatsApp] Process message error:", error);
        throw new Error("Failed to process message");
      }
    }),

  // Registrar usuário via WhatsApp
  registerUser: publicProcedure
    .input(z.object({
      phoneNumber: z.string(),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        return {
          success: true,
          phoneNumber: input.phoneNumber,
          name: input.name || "Usuário WhatsApp",
          registeredAt: new Date().toISOString(),
          message: "Bem-vindo ao Wilbor! Você foi registrado com sucesso.",
        };
      } catch (error) {
        console.error("[WhatsApp] Register user error:", error);
        throw new Error("Failed to register user");
      }
    }),

  // Obter histórico de mensagens
  getMessageHistory: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      try {
        // Aqui você buscaria do banco de dados
        // Por enquanto, retornamos um mock
        return {
          phoneNumber: input.phoneNumber,
          messages: [
            {
              from: "user",
              text: "Meu bebê não dorme",
              timestamp: Date.now() - 3600000,
            },
            {
              from: "wilbor",
              text: "Use o Sleep Tracker para registrar as sonecas",
              timestamp: Date.now() - 3590000,
            },
          ],
        };
      } catch (error) {
        console.error("[WhatsApp] Get history error:", error);
        throw new Error("Failed to get message history");
      }
    }),

  // Verificar token do webhook (para validação do WhatsApp)
  verifyWebhook: publicProcedure
    .input(z.object({
      mode: z.string(),
      token: z.string(),
      challenge: z.string(),
    }))
    .query(({ input }) => {
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "wilbor_webhook_token";

      if (input.mode === "subscribe" && input.token === verifyToken) {
        return {
          success: true,
          challenge: input.challenge,
        };
      }

      return {
        success: false,
        error: "Invalid token",
      };
    }),
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function formatPhoneNumber(phone: string): string {
  // Remove caracteres especiais
  const cleaned = phone.replace(/\D/g, "");
  // Formato: +55 11 99999-9999
  if (cleaned.length === 11) {
    return `+55${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function extractPhoneFromMessage(message: string): string | null {
  const phoneRegex = /(\+?55)?(\s)?(\()?(\d{2})(\))?(\s)?(\d{4,5})(-)?(\d{4})/g;
  const match = message.match(phoneRegex);
  return match ? match[0] : null;
}
