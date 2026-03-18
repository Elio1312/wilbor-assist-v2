import { invokeLLM } from "./_core/llm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnalysisResult {
  overallQuality: "excellent" | "good" | "needs_improvement" | "poor";
  qualityScore: number;
  hasUnnecessaryRepetitions: boolean;
  hasIgnoredQuestions: boolean;
  hasMissedPathPresentation: boolean;
  hasExcessiveLength: boolean;
  hasPrematureEnding: boolean;
  issuesDetected: string[];
  suggestionsForImprovement: string[];
  clientSatisfactionEstimate: "very_satisfied" | "satisfied" | "neutral" | "dissatisfied" | "very_dissatisfied";
  needsManualReview: boolean;
  reviewReason: string | null;
}

export async function analyzeConversation(messages: ChatMessage[]): Promise<AnalysisResult> {
  const conversationText = messages
    .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
    .join("\n\n");

  const userMessages = messages.filter((m) => m.role === "user");
  const assistantMessages = messages.filter((m) => m.role === "assistant");

  const systemPrompt = `Você é um analista de qualidade de conversas do Wilbor, uma IA especializada em maternidade e cuidados com bebês.

Sua tarefa é analisar a conversa abaixo e identificar:
1. Qualidade geral da interação da IA
2. Problemas específicos na condução da conversa
3. Sugestões de melhoria para o prompt da IA

CRITÉRIOS DE AVALIAÇÃO:

REPETIÇÕES DESNECESSÁRIAS:
- A IA repetiu a mesma pergunta que já foi respondida?
- A IA repetiu o mesmo espelhamento várias vezes?
- A IA usou frases genéricas repetidamente?

PERGUNTAS IGNORADAS:
- A mãe fez uma pergunta que a IA não respondeu?
- A mãe pediu algo específico que foi ignorado?

APRESENTAÇÃO DE SOLUÇÕES:
- Quando a mãe pediu "o que fazer?" ou "quais opções?", a IA apresentou as soluções estruturadas?
- Se não apresentou, deveria ter apresentado?

TAMANHO EXCESSIVO:
- A conversa passou de 15 mensagens sem chegar a uma conclusão?
- A IA ficou presa em loops de perguntas sem avançar?

ENCERRAMENTO PREMATURO:
- A conversa terminou antes da mãe ter clareza?
- A IA encerrou sem apresentar opções quando deveria?

SATISFAÇÃO DA MÃE:
- A mãe demonstrou frustração?
- A mãe agradeceu ou demonstrou satisfação?
- A mãe abandonou a conversa no meio?

Responda APENAS com um JSON válido no formato especificado.`;

  const userPrompt = `Analise esta conversa do Wilbor:

${conversationText}

---

ESTATÍSTICAS:
- Total de mensagens: ${messages.length}
- Mensagens do usuário: ${userMessages.length}
- Mensagens da IA: ${assistantMessages.length}

Responda com um JSON no seguinte formato:
{
  "overallQuality": "excellent" | "good" | "needs_improvement" | "poor",
  "qualityScore": 0-100,
  "hasUnnecessaryRepetitions": true/false,
  "hasIgnoredQuestions": true/false,
  "hasMissedPathPresentation": true/false,
  "hasExcessiveLength": true/false,
  "hasPrematureEnding": true/false,
  "issuesDetected": ["issue1", "issue2"],
  "suggestionsForImprovement": ["suggestion1", "suggestion2"],
  "clientSatisfactionEstimate": "very_satisfied" | "satisfied" | "neutral" | "dissatisfied" | "very_dissatisfied",
  "needsManualReview": true/false,
  "reviewReason": "razão ou null"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "conversation_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallQuality: {
                type: "string",
                enum: ["excellent", "good", "needs_improvement", "poor"],
              },
              qualityScore: { type: "integer" },
              hasUnnecessaryRepetitions: { type: "boolean" },
              hasIgnoredQuestions: { type: "boolean" },
              hasMissedPathPresentation: { type: "boolean" },
              hasExcessiveLength: { type: "boolean" },
              hasPrematureEnding: { type: "boolean" },
              issuesDetected: { type: "array", items: { type: "string" } },
              suggestionsForImprovement: { type: "array", items: { type: "string" } },
              clientSatisfactionEstimate: {
                type: "string",
                enum: ["very_satisfied", "satisfied", "neutral", "dissatisfied", "very_dissatisfied"],
              },
              needsManualReview: { type: "boolean" },
              reviewReason: { type: ["string", "null"] },
            },
            required: [
              "overallQuality",
              "qualityScore",
              "hasUnnecessaryRepetitions",
              "hasIgnoredQuestions",
              "hasMissedPathPresentation",
              "hasExcessiveLength",
              "hasPrematureEnding",
              "issuesDetected",
              "suggestionsForImprovement",
              "clientSatisfactionEstimate",
              "needsManualReview",
              "reviewReason",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error("No response from LLM");
    }

    const content = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
    const analysis = JSON.parse(content) as AnalysisResult;
    console.log("[ConversationAnalyzer] Analysis completed:", analysis.overallQuality, analysis.qualityScore);
    return analysis;
  } catch (error) {
    console.error("[ConversationAnalyzer] Error analyzing conversation:", error);
    // Return default analysis on error
    return {
      overallQuality: "needs_improvement",
      qualityScore: 50,
      hasUnnecessaryRepetitions: false,
      hasIgnoredQuestions: false,
      hasMissedPathPresentation: false,
      hasExcessiveLength: messages.length > 20,
      hasPrematureEnding: false,
      issuesDetected: ["Erro na análise automática"],
      suggestionsForImprovement: ["Revisar manualmente"],
      clientSatisfactionEstimate: "neutral",
      needsManualReview: true,
      reviewReason: "Erro na análise automática - revisar manualmente",
    };
  }
}
