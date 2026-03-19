import { getDb } from "./db";
import fs from "fs";
import path from "path";
import { wilborKnowledgeBase } from "../drizzle/schema";

/**
 * Script para popular perguntas no banco de dados
 * Execute com: node seed-questions.mjs
 */

// Mapeamento de categorias do JSON para o ENUM do banco
const categoryMap: Record<string, string> = {
  sono: 'sono',
  colica: 'colica',
  amamentacao: 'amamentacao',
  'amamentação': 'amamentacao',
  salto: 'salto',
  seguranca: 'seguranca',
  'segurança': 'seguranca',
  febre: 'febre',
  alimentacao: 'alimentacao',
  'alimentação': 'alimentacao',
  vacina: 'vacina',
  higiene_oral: 'higiene_oral',
  higiene: 'higiene_oral',
  motor: 'motor',
  desenvolvimento: 'motor',
  saude_materna: 'geral',
  'saúde_materna': 'geral',
  geral: 'geral',
  freio_lingual: 'alimentacao',
  'freio lingual': 'alimentacao',
  dentes: 'higiene_oral',
  'erupção': 'higiene_oral',
  'erupçao': 'higiene_oral',
};

export async function seedQuestions() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("❌ Falha ao conectar ao banco de dados");
      return { success: false, error: 'Banco de dados não disponível' };
    }

    // Carregar perguntas do arquivo JSON
    const questionsFile = path.join(process.cwd(), 'server/wilborQuestionsAll.json');
    let wilborQuestions = [];
    
    if (fs.existsSync(questionsFile)) {
      const fileContent = fs.readFileSync(questionsFile, 'utf-8');
      wilborQuestions = JSON.parse(fileContent);
      console.log(`✅ Carregadas ${wilborQuestions.length} perguntas do arquivo JSON`);
    } else {
      console.error(`❌ Arquivo não encontrado: ${questionsFile}`);
      return { success: false, error: 'Arquivo de perguntas não encontrado', inserted: 0, skipped: 0 };
    }

    console.log(`\n🌱 Iniciando população de ${wilborQuestions.length} perguntas...`);

    let inserted = 0;
    let skipped = 0;

    for (const question of wilborQuestions) {
      try {
        // Mapear categoria do JSON para ENUM válido
        const rawCategory = (question.category || 'geral').toLowerCase().trim();
        const mappedCategory = categoryMap[rawCategory] || 'geral';

        // Inserir pergunta
        await db.insert(wilborKnowledgeBase).values({
          question: question.question,
          category: mappedCategory as any,
          keywords: question.keywords || '',
          ageRangeStart: question.ageRangeStart || 0,
          ageRangeEnd: question.ageRangeEnd || 52,
          answerPt: question.answerPt || '',
          answerEn: question.answerEn || '',
          answerEs: question.answerEs || '',
          source: question.source || 'Wilbor KB',
          priority: question.priority || 5,
          isActive: "true",
        });

        inserted++;
        if (inserted % 10 === 0) {
          console.log(`✅ ${inserted}. [${mappedCategory}] ${question.question.substring(0, 50)}...`);
        }
      } catch (error: any) {
        skipped++;
        // Silenciar erros de duplicação ou constraint
        if (error?.code !== 'ER_DUP_ENTRY') {
          // Apenas log de erros não-duplicação
          // console.error(`⚠️ ${question.question.substring(0, 30)}...`);
        }
      }
    }

    console.log(`\n✅ População concluída!`);
    console.log(`📊 Inseridas: ${inserted}`);
    console.log(`⏭️  Puladas/Falhadas: ${skipped}`);
    console.log(`📈 Taxa de sucesso: ${((inserted / wilborQuestions.length) * 100).toFixed(1)}%`);

    const result = {
      success: inserted > 0,
      inserted,
      skipped,
      total: inserted,
      successRate: ((inserted / wilborQuestions.length) * 100).toFixed(1),
    };
    console.log(`\n${JSON.stringify(result, null, 2)}`);
    return result;
  } catch (error) {
    console.error("❌ Erro fatal:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuestions().then((result) => {
    if (result) {
      console.log("\n📋 Resultado:", result);
      process.exit(result.success ? 0 : 1);
    }
  });
}
