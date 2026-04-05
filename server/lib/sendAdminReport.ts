/**
 * sendAdminReport.ts
 * Envia o Relatório Dominical de Feedbacks Verídicos para o WhatsApp do Elio.
 * Roda todo domingo às 21h via agendamento automático.
 */

// Número do WhatsApp do Elio (admin)
const ADMIN_WHATSAPP = "5512997999902"; // +55 12 99799-9902

/**
 * Envia uma mensagem de texto via WhatsApp Business API (Meta)
 */
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("[sendAdminReport] WHATSAPP_ACCESS_TOKEN ou WHATSAPP_PHONE_NUMBER_ID não configurados.");
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("[sendAdminReport] Erro ao enviar WhatsApp:", err);
  } else {
    console.log(`[sendAdminReport] Relatório enviado para ${to} com sucesso.`);
  }
}

export interface FeedbackItem {
  id: number;
  userQuestion: string;
  aiResponse: string;
  comment: string | null;
  aiJustification: string | null;
  createdAt: Date;
}

/**
 * Formata e envia o relatório semanal de feedbacks VERÍDICOS para o WhatsApp do Elio.
 */
export async function sendAdminReport(feedbacks: FeedbackItem[]): Promise<void> {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (feedbacks.length === 0) {
    const msg = `✅ *Relatório Wilbor — ${dateStr}*\n\n🎉 Nenhum erro técnico verificado esta semana!\n\nO Wilbor está respondendo dentro dos protocolos SBP/OMS. Ótimo trabalho! 💜`;
    await sendWhatsAppMessage(ADMIN_WHATSAPP, msg);
    return;
  }

  // Cabeçalho do relatório
  let report = `⚠️ *Relatório Wilbor — ${dateStr}*\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n`;
  report += `🔍 *${feedbacks.length} erro(s) técnico(s) confirmado(s) esta semana*\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Detalhes de cada feedback verídico
  feedbacks.forEach((fb, index) => {
    report += `*[${index + 1}] Erro Confirmado*\n`;
    report += `❓ *Pergunta:* ${fb.userQuestion.substring(0, 120)}${fb.userQuestion.length > 120 ? "..." : ""}\n`;
    report += `🤖 *Resposta da IA:* ${fb.aiResponse.substring(0, 120)}${fb.aiResponse.length > 120 ? "..." : ""}\n`;
    report += `💬 *Reclamação:* ${(fb.comment || "Sem comentário").substring(0, 100)}\n`;
    report += `📋 *Veredito IA:* ${fb.aiJustification || "Sem justificativa"}\n`;
    report += `\n`;
  });

  report += `━━━━━━━━━━━━━━━━━━━━\n`;
  report += `🚀 Acesse o Admin Dashboard para ajustar os prompts:\n`;
  report += `https://www.wilbor-assist.com/admin-secret-panel`;

  // WhatsApp tem limite de 4096 caracteres por mensagem
  if (report.length > 4096) {
    // Envia em partes se necessário
    const parts = [];
    let current = report;
    while (current.length > 4000) {
      const cutAt = current.lastIndexOf("\n\n", 4000);
      parts.push(current.substring(0, cutAt));
      current = current.substring(cutAt);
    }
    parts.push(current);

    for (const part of parts) {
      await sendWhatsAppMessage(ADMIN_WHATSAPP, part);
      // Pequena pausa entre mensagens para evitar rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } else {
    await sendWhatsAppMessage(ADMIN_WHATSAPP, report);
  }
}
