/**
 * Teste de acurácia das respostas com LLM
 * Avalia a qualidade das respostas do Wilbor
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { invokeLLM } from './server/_core/llm';
import fs from 'fs';
import path from 'path';

interface QuestionTest {
  id: number;
  question: string;
  answerPt: string;
  category: string;
}

interface AccuracyResult {
  questionId: number;
  question: string;
  category: string;
  relevance: number; // 0-100
  clarity: number; // 0-100
  accuracy: number; // 0-100
  avgScore: number;
  feedback: string;
}

describe('Wilbor Questions Accuracy Test', () => {
  let testQuestions: QuestionTest[] = [];
  let results: AccuracyResult[] = [];

  beforeAll(() => {
    // Carregar amostra de perguntas
    const questionsFile = path.join(process.cwd(), 'server/wilborQuestionsAll.json');
    
    if (fs.existsSync(questionsFile)) {
      const allQuestions = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));
      
      // Pegar amostra de 5 perguntas para teste rápido
      testQuestions = allQuestions.slice(0, 5).map((q: any) => ({
        id: q.id,
        question: q.question,
        answerPt: q.answerPt,
        category: q.category,
      }));
      
      console.log(`📊 Carregadas ${testQuestions.length} perguntas para teste`);
    }
  });

  it('should evaluate answer relevance and accuracy', async () => {
    if (testQuestions.length === 0) {
      console.log('⏭️  Pulando teste (sem perguntas)');
      return;
    }

    console.log('\n🧪 Iniciando teste de acurácia...\n');

    for (const q of testQuestions) {
      try {
        // Usar LLM para avaliar a resposta
        const evaluation = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um avaliador de respostas médicas para mães com bebês.
              
Avalie a resposta fornecida em uma escala de 0-100 para:
1. Relevância: A resposta aborda a pergunta?
2. Clareza: A resposta é clara e fácil de entender?
3. Acurácia: A resposta é medicamente correta e segura?

Responda em JSON com este formato:
{
  "relevance": <0-100>,
  "clarity": <0-100>,
  "accuracy": <0-100>,
  "feedback": "<feedback breve>"
}`,
            },
            {
              role: 'user',
              content: `Pergunta: ${q.question}
              
Resposta: ${q.answerPt}

Avalie esta resposta.`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'evaluation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  relevance: { type: 'integer', minimum: 0, maximum: 100 },
                  clarity: { type: 'integer', minimum: 0, maximum: 100 },
                  accuracy: { type: 'integer', minimum: 0, maximum: 100 },
                  feedback: { type: 'string' },
                },
                required: ['relevance', 'clarity', 'accuracy', 'feedback'],
                additionalProperties: false,
              },
            },
          },
        });

        const content = evaluation.choices[0].message.content;
        const parsed = JSON.parse(content);

        const result: AccuracyResult = {
          questionId: q.id,
          question: q.question.substring(0, 60) + '...',
          category: q.category,
          relevance: parsed.relevance,
          clarity: parsed.clarity,
          accuracy: parsed.accuracy,
          avgScore: (parsed.relevance + parsed.clarity + parsed.accuracy) / 3,
          feedback: parsed.feedback,
        };

        results.push(result);

        console.log(`✅ Q${q.id} (${q.category}): ${result.avgScore.toFixed(1)}/100`);
        console.log(`   ${result.feedback}\n`);
      } catch (error) {
        console.error(`❌ Erro ao avaliar Q${q.id}:`, error);
      }
    }

    // Calcular estatísticas
    if (results.length > 0) {
      const avgRelevance = results.reduce((sum, r) => sum + r.relevance, 0) / results.length;
      const avgClarity = results.reduce((sum, r) => sum + r.clarity, 0) / results.length;
      const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
      const avgOverall = results.reduce((sum, r) => sum + r.avgScore, 0) / results.length;

      console.log('\n📊 RESULTADOS FINAIS:');
      console.log(`  Relevância média: ${avgRelevance.toFixed(1)}/100`);
      console.log(`  Clareza média: ${avgClarity.toFixed(1)}/100`);
      console.log(`  Acurácia média: ${avgAccuracy.toFixed(1)}/100`);
      console.log(`  Pontuação geral: ${avgOverall.toFixed(1)}/100`);

      // Salvar relatório
      const report = {
        timestamp: new Date().toISOString(),
        totalQuestionsEvaluated: results.length,
        averageScores: {
          relevance: avgRelevance,
          clarity: avgClarity,
          accuracy: avgAccuracy,
          overall: avgOverall,
        },
        results,
      };

      fs.writeFileSync(
        path.join(process.cwd(), 'accuracy-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log(`\n💾 Relatório salvo em: accuracy-report.json`);

      expect(avgOverall).toBeGreaterThan(70);
    }
  });
});
