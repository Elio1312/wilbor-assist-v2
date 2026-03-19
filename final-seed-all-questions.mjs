#!/usr/bin/env node

/**
 * Script final para inserir TODAS as 326 perguntas no banco de dados
 * Execute com: node final-seed-all-questions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/mysql2/promise';
import mysql from 'mysql2/promise';
import { wilborKnowledgeBase } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedAllQuestions() {
  try {
    // Ler arquivo JSON com todas as perguntas
    const questionsFile = path.join(__dirname, 'server/wilborQuestionsAll.json');
    
    if (!fs.existsSync(questionsFile)) {
      console.error('❌ Arquivo wilborQuestionsAll.json não encontrado!');
      process.exit(1);
    }
    
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));
    
    console.log(`🌱 Iniciando população de ${questions.length} perguntas...\n`);
    
    // Conectar ao banco
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'wilbor',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
    });
    
    const db = drizzle(connection);
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    for (const question of questions) {
      try {
        // Verificar se já existe
        const existing = await db
          .select()
          .from(wilborKnowledgeBase)
          .where(eq(wilborKnowledgeBase.question, question.question))
          .limit(1);
        
        if (existing.length > 0) {
          // Atualizar
          await db
            .update(wilborKnowledgeBase)
            .set({
              category: question.category,
              ageRangeStart: question.ageRangeStart,
              ageRangeEnd: question.ageRangeEnd,
              keywords: question.keywords,
              answerPt: question.answerPt,
              answerEn: question.answerEn,
              answerEs: question.answerEs,
              source: question.source,
              priority: question.priority,
              isActive: question.isActive,
            })
            .where(eq(wilborKnowledgeBase.question, question.question));
          
          updated++;
        } else {
          // Inserir
          await db.insert(wilborKnowledgeBase).values({
            category: question.category,
            ageRangeStart: question.ageRangeStart,
            ageRangeEnd: question.ageRangeEnd,
            question: question.question,
            keywords: question.keywords,
            answerPt: question.answerPt,
            answerEn: question.answerEn,
            answerEs: question.answerEs,
            source: question.source,
            priority: question.priority,
            isActive: question.isActive,
          });
          
          inserted++;
        }
        
        if ((inserted + updated) % 50 === 0) {
          console.log(`✅ Processadas ${inserted + updated} perguntas...`);
        }
      } catch (error) {
        errors++;
        if (errors <= 3) {
          console.error(`❌ Erro ao processar pergunta "${question.question.substring(0, 50)}...":`, error.message);
        }
      }
    }
    
    console.log('\n✅ População concluída!');
    console.log(`📊 Inseridas: ${inserted}`);
    console.log(`🔄 Atualizadas: ${updated}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📈 Total processado: ${inserted + updated + errors}/${questions.length}`);
    
    // Verificar total no banco
    const total = await db.select().from(wilborKnowledgeBase);
    console.log(`\n🎉 Total de perguntas no banco: ${total.length}`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

seedAllQuestions();
