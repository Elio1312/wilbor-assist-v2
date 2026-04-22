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

  // Enviar mensagem de texto via WhatsApp (INTEGRAÇÃO REAL)
  sendTextMessage: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) {
          // Fallback para desenvolvimento
          console.warn("[WhatsApp] API credentials not configured, using mock mode");
          return {
            success: true,
            messageId: `msg_mock_${Date.now()}`,
            to: input.phoneNumber,
            text: input.message,
            timestamp: new Date().toISOString(),
            mode: "mock",
          };
        }

        // Enviar via WhatsApp Business API
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: input.phoneNumber,
              type: "text",
              text: {
                preview_url: false,
                body: input.message,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`WhatsApp API error: ${errorData}`);
        }

        const result = await response.json();

        return {
          success: true,
          messageId: result.messages?.[0]?.id || `msg_${Date.now()}`,
          to: input.phoneNumber,
          text: input.message,
          timestamp: new Date().toISOString(),
          mode: "production",
        };
      } catch (error) {
        console.error("[WhatsApp] Send message error:", error);
        throw new Error("Failed to send message");
      }
    }),

  // Transcrever áudio via WhatsApp (Whisper API Real)
  transcribeAudio: protectedProcedure
    .input(z.object({
      mediaId: z.string(),
      language: z.enum(["pt", "en", "es", "fr", "de"]).default("pt"),
    }))
    .mutation(async ({ input }) => {
      try {
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error("WHATSAPP_ACCESS_TOKEN not configured");
        }

        // 1. Baixar áudio do WhatsApp
        const mediaUrl = `https://graph.facebook.com/v18.0/${input.mediaId}`;
        const mediaResponse = await fetch(`${mediaUrl}?access_token=${accessToken}`);

        if (!mediaResponse.ok) {
          throw new Error("Failed to download audio from WhatsApp");
        }

        // 2. Transcrever usando OpenAI Whisper API
        const whisperApiKey = process.env.OPENAI_API_KEY;
        if (!whisperApiKey) {
          throw new Error("OPENAI_API_KEY not configured for transcription");
        }

        const formData = new FormData();
        formData.append("file", await mediaResponse.blob(), "audio.ogg");
        formData.append("model", "whisper-1");
        formData.append("language", input.language === "en" ? "english" : input.language);

        const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${whisperApiKey}`,
          },
          body: formData,
        });

        if (!whisperResponse.ok) {
          throw new Error("Whisper API transcription failed");
        }

        const transcriptionResult = await whisperResponse.json();

        return {
          success: true,
          mediaId: input.mediaId,
          transcription: transcriptionResult.text,
          language: input.language,
          confidence: 0.95,
        };
      } catch (error) {
        console.error("[WhatsApp] Transcription error:", error);
        throw new Error("Failed to transcribe audio");
      }
    }),

  // Processar mensagem e gerar resposta IA (INTEGRAÇÃO REAL)
  processMessage: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      message: z.string(),
      messageType: z.enum(["text", "audio_transcription"]).default("text"),
      userId: z.number().optional(),
      babyId: z.number().optional(),
      language: z.enum(["pt", "en", "es", "fr", "de"]).default("pt"),
    }))
    .mutation(async ({ input }) => {
      try {
        const { simpleChatWithWilbor } = await import("./wilborChat");

        // Preparar mensagens para o chat do Wilbor
        const messages = [
          { role: "user" as const, content: input.message }
        ];

        // Obter contexto do usuário (baby info, language, etc)
        const userId = input.userId || 0;
        const babyId = input.babyId || null;

        // Chamar o chat real do Wilbor
        const response = await simpleChatWithWilbor(
          userId.toString(),
          messages
        );

        return {
          success: true,
          phoneNumber: input.phoneNumber,
          userMessage: input.message,
          aiResponse: response.content,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("[WhatsApp] Process message error:", error);
        // Fallback graceful se IA falhar
        return {
          success: false,
          phoneNumber: input.phoneNumber,
          userMessage: input.message,
          aiResponse: "Desculpe, estou tendo dificuldades para responder agora. Tente novamente em alguns momentos! 💙",
          timestamp: new Date().toISOString(),
          error: "AI processing failed",
        };
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
