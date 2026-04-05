import { invokeLLM } from "../_core/llm";

export type AiVerdict = "VERÍDICA" | "INCONSISTENTE" | "ELOGIO";

export interface TriagemResult {
  verdict: AiVerdict;
  justification: string;
}

/**
 * Analisa se uma reclamação de feedback é tecnicamente fundamentada.
 * Atua como "Secretária Executiva" do Elio, filtrando ruído antes do relatório dominical.
 * Usa o invokeLLM nativo do projeto (econômico e sem dependência extra).
 */
export async function analyzeFeedbackTriagem(
  userComment: string,
  aiResponse: string,
  userQuestion: string
): Promise<TriagemResult> {
  const prompt = `Você é um Auditor de Qualidade Clínica para o Wilbor (Assistente de Mães).
Sua tarefa é analisar se uma reclamação de uma mãe sobre a resposta da IA é tecnicamente fundamentada.

Pergunta da Mãe: "${userQuestion}"
Resposta dada pela IA: "${aiResponse}"
Reclamação da Mãe: "${userComment}"

CRITÉRIOS DE VEREDITO:
1. 'VERÍDICA': Se a IA deu uma orientação que contradiz protocolos SBP/OMS, foi grosseira, incompleta ou potencialmente perigosa.
2. 'INCONSISTENTE': Se a mãe apenas discordou por preferência pessoal, ansiedade ou não entendeu a explicação correta da IA.
3. 'ELOGIO': Se o comentário for positivo ou neutro, apesar de ter sido marcado como feedback negativo.

Responda EXATAMENTE neste formato JSON (sem markdown, sem explicações extras):
{"verdict":"VERÍDICA","justification":"Explicação técnica curta do porquê."}`;

  try {
    const result = await invokeLLM({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 200,
    });

    const raw = result.choices[0]?.message?.content;
    const text = typeof raw === "string" ? raw.trim() : "";

    // Remove possível markdown ```json ... ```
    const clean = text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean) as TriagemResult;

    // Validação do veredito
    const validVerdicts: AiVerdict[] = ["VERÍDICA", "INCONSISTENTE", "ELOGIO"];
    if (!validVerdicts.includes(parsed.verdict)) {
      return { verdict: "INCONSISTENTE", justification: "Veredito inválido retornado pela IA." };
    }

    return parsed;
  } catch (err) {
    console.error("[aiTriagem] Erro ao analisar feedback:", err);
    return {
      verdict: "INCONSISTENTE",
      justification: "Erro na análise automática. Revisar manualmente.",
    };
  }
}
