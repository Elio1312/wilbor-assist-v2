import { getDb } from "./db";
import fs from "fs";
import path from "path";
import { wilborKnowledgeBase } from "../drizzle/schema";

/**
 * Script para popular perguntas no banco de dados
 * Execute com: node seed-questions.mjs
 */

export async function seedQuestions() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("❌ Falha ao conectar ao banco de dados");
      return;
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
      return { success: false, error: 'Arquivo de perguntas não encontrado' };
    }

    console.log("🌱 Iniciando população de perguntas...");
    console.log(`📝 Total de perguntas: ${wilborQuestions.length}`);

    let inserted = 0;
    let skipped = 0;

    for (const question of wilborQuestions) {
      try {
        // Verificar se pergunta já existe (skip for now)
        // const existing = await db.query.wilborKnowledgeBase.findFirst({
        //   where: (table) => table.question.eq(question.question),
        // });
        const existing = null;

        // if (existing) {
        //   skipped++;
        //   continue;
        // }

        // Inserir pergunta
        await db.insert(wilborKnowledgeBase).values({
          question: question.question,
          category: question.category as any,
          keywords: question.keywords,
          ageRangeStart: question.ageRangeStart,
          ageRangeEnd: question.ageRangeEnd,
          answerPt: question.answerPt,
          answerEn: question.answerEn,
          answerEs: question.answerEs,
          source: question.source,
          priority: question.priority,
          isActive: "true",
        });

        inserted++;
        if (inserted % 5 === 0) {
          console.log(`✅ ${inserted}. ${question.question.substring(0, 50)}...`);
        }
      } catch (error) {
        console.error(`❌ Erro ao inserir: ${question.question}`, error);
      }
    }

    console.log("\n✅ População concluída!");
    console.log(`📊 Inseridas: ${inserted}`);
    console.log(`⏭️  Puladas (já existem): ${skipped}`);
    console.log(`📈 Total no banco: ${inserted + skipped}`);

    return {
      success: true,
      inserted,
      skipped,
      total: inserted + skipped,
    };
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
