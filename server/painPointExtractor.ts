import { invokeLLM } from './_core/llm';

// Categorias de pontos de dor de mães
export type PainPointCategory = 
  | 'sleep'            // Problemas de sono do bebê
  | 'feeding'          // Dificuldades de alimentação
  | 'crying'           // Choro excessivo/cólica
  | 'development'      // Preocupações com desenvolvimento
  | 'health'           // Problemas de saúde
  | 'postpartum'       // Depressão/ansiedade pós-parto
  | 'exhaustion'       // Exaustão/cansaço materno
  | 'confidence'       // Falta de confiança como mãe
  | 'relationship'     // Relacionamento/suporte
  | 'other';           // Outros pontos de dor

export type PainPointSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ExtractedPainPoint {
  category: PainPointCategory;
  description: string;
  severity: PainPointSeverity;
  rawQuote: string;
}

const PAIN_POINT_EXTRACTION_PROMPT = `Você é um sistema especializado em identificar preocupações e dores de mães.

Analise a mensagem da mãe e extraia os principais pontos de dor mencionados, mesmo que de forma implícita ou não estruturada.

CATEGORIAS DE PONTOS DE DOR:
- sleep: Problemas de sono do bebê (não dorme, acorda à noite, insônia)
- feeding: Dificuldades de alimentação (amamentação, desmame, recusa de comida)
- crying: Choro excessivo/cólica (bebê chora muito, cólica, desconforto)
- development: Preocupações com desenvolvimento (atraso, marcos, comportamento)
- health: Problemas de saúde (febre, infecção, alergias, medicamentos)
- postpartum: Depressão/ansiedade pós-parto (tristeza, ansiedade, medo)
- exhaustion: Exaustão/cansaço materno (cansada, sem energia, burnout)
- confidence: Falta de confiança como mãe (insegurança, culpa, dúvidas)
- relationship: Relacionamento/suporte (parceiro, família, isolamento)
- other: Outros pontos de dor não categorizados acima

SEVERIDADE:
- low: Incômodo leve, mencionado de passagem
- medium: Problema recorrente, causa frustração
- high: Problema sério, impacta o bem-estar significativamente
- critical: Problema urgente, está causando danos graves ou iminentes

REGRAS:
1. Extraia APENAS pontos de dor claramente identificáveis na mensagem
2. Se não houver pontos de dor, retorne um array vazio
3. Capture a citação original (rawQuote) que evidencia o ponto de dor
4. Seja preciso na categorização - use "other" apenas quando não se encaixar em nenhuma categoria
5. Avalie a severidade pelo tom e contexto da mensagem

Responda APENAS com um JSON válido no formato:
{
  "painPoints": [
    {
      "category": "categoria",
      "description": "descrição clara e objetiva do ponto de dor",
      "severity": "severidade",
      "rawQuote": "trecho exato da mensagem que evidencia o ponto de dor"
    }
  ]
}

Se não houver pontos de dor identificáveis, responda:
{
  "painPoints": []
}`;

export async function extractPainPoints(userMessage: string): Promise<ExtractedPainPoint[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: PAIN_POINT_EXTRACTION_PROMPT
        },
        {
          role: 'user',
          content: `Analise esta mensagem e extraia os pontos de dor:\n\n"${userMessage}"`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'pain_points_extraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              painPoints: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: {
                      type: 'string',
                      enum: ['sleep', 'feeding', 'crying', 'development', 'health', 'postpartum', 'exhaustion', 'confidence', 'relationship', 'other']
                    },
                    description: { type: 'string' },
                    severity: {
                      type: 'string',
                      enum: ['low', 'medium', 'high', 'critical']
                    },
                    rawQuote: { type: 'string' }
                  },
                  required: ['category', 'description', 'severity', 'rawQuote'],
                  additionalProperties: false
                }
              }
            },
            required: ['painPoints'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices?.[0]?.message?.content;
    
    if (!content) {
      console.log('[PainPointExtractor] No content in response');
      return [];
    }

    // Parse the JSON response
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const parsed = JSON.parse(contentStr);
    
    if (!parsed.painPoints || !Array.isArray(parsed.painPoints)) {
      console.log('[PainPointExtractor] Invalid response format');
      return [];
    }

    console.log(`[PainPointExtractor] Extracted ${parsed.painPoints.length} pain points`);
    return parsed.painPoints as ExtractedPainPoint[];

  } catch (error) {
    console.error('[PainPointExtractor] Error extracting pain points:', error);
    return [];
  }
}

// Função para obter descrição legível da categoria
export function getCategoryLabel(category: PainPointCategory): string {
  const labels: Record<PainPointCategory, string> = {
    sleep: 'Problemas de Sono',
    feeding: 'Dificuldades de Alimentação',
    crying: 'Choro/Cólica',
    development: 'Preocupações com Desenvolvimento',
    health: 'Problemas de Saúde',
    postpartum: 'Saúde Mental Pós-Parto',
    exhaustion: 'Exaustão Materna',
    confidence: 'Confiança como Mãe',
    relationship: 'Relacionamento/Suporte',
    other: 'Outros'
  };
  return labels[category] || category;
}

// Função para obter cor da severidade
export function getSeverityColor(severity: PainPointSeverity): string {
  const colors: Record<PainPointSeverity, string> = {
    low: '#22c55e',      // green
    medium: '#eab308',   // yellow
    high: '#f97316',     // orange
    critical: '#ef4444'  // red
  };
  return colors[severity] || '#6b7280';
}
