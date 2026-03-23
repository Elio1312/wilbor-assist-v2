import { notifyOwner } from "../_core/notification";

/**
 * Send Weekly Report Notification
 * Sends report via email and/or WhatsApp to the owner
 */
export async function sendWeeklyReportNotification(reportData: {
  weekStartDate: Date;
  weekEndDate: Date;
  totalFeedback: number;
  helpfulnessPercent: number;
  accuracyPercent: number;
  topProblems: string;
  topCategories: string;
  recommendations: string;
}) {
  const reportSummary = `
📊 **Wilbor Weekly Report**
Período: ${reportData.weekStartDate.toLocaleDateString("pt-BR")} - ${reportData.weekEndDate.toLocaleDateString("pt-BR")}

**Estatísticas de Feedback:**
- Total de avaliações: ${reportData.totalFeedback}
- Utilidade: ${reportData.helpfulnessPercent}%
- Precisão: ${reportData.accuracyPercent}%

**Principais Problemas Identificados:**
${reportData.topProblems}

**Recomendações:**
${reportData.recommendations}

**Próximas Ações:**
1. Acesse o dashboard: /admin/feedback
2. Revise as respostas com baixa avaliação
3. Implemente as correções sugeridas

---
Relatório automático do Wilbor-Assist
`;

  try {
    // Send notification via Manus built-in notification system
    // This will send to email and/or WhatsApp depending on owner's preferences
    const result = await notifyOwner({
      title: "📊 Wilbor Weekly Report",
      content: reportSummary,
    });

    if (result) {
      console.log("[Weekly Notification] Report sent successfully!");
      return true;
    } else {
      console.warn("[Weekly Notification] Notification service temporarily unavailable");
      return false;
    }
  } catch (error) {
    console.error("[Weekly Notification] Error sending notification:", error);
    return false;
  }
}

/**
 * Send Custom Notification
 * For sending alerts about critical issues
 */
export async function sendCriticalAlert(issue: {
  title: string;
  description: string;
  affectedResponses: number;
}) {
  const alertMessage = `
⚠️ **Wilbor Alert**

${issue.title}

${issue.description}

Respostas afetadas: ${issue.affectedResponses}

Acesse /admin/feedback para revisar.
`;

  try {
    const result = await notifyOwner({
      title: `⚠️ ${issue.title}`,
      content: alertMessage,
    });

    return result;
  } catch (error) {
    console.error("[Critical Alert] Error sending alert:", error);
    return false;
  }
}
