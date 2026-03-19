#!/usr/bin/env node

/**
 * Script para inserir TODAS as 136 perguntas no banco de dados
 * Execute com: node seed-all-questions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/mysql2/promise';
import mysql from 'mysql2/promise';
import { wilborKnowledgeBase } from './drizzle/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedAllQuestions() {
  try {
    // Ler arquivo JSON com perguntas extraídas
    const questionsFile = path.join(__dirname, 'server/wilborQuestionsExtracted.json');
    
    if (!fs.existsSync(questionsFile)) {
      console.error('❌ Arquivo wilborQuestionsExtracted.json não encontrado!');
      process.exit(1);
    }
    
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));
    
    console.log(`🌱 Iniciando população de ${questions.length} perguntas...`);
    
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
    let skipped = 0;
    let errors = 0;
    
    for (const question of questions) {
      try {
        // Verificar se já existe
        const existing = await db
          .select()
          .from(wilborKnowledgeBase)
          .where(eq(wilborKnowledgeBase.id, question.id))
          .limit(1);
        
        if (existing.length > 0) {
          skipped++;
          continue;
        }
        
        // Inserir
        await db.insert(wilborKnowledgeBase).values({
          id: question.id,
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
          isActive: question.isActive === 'true' ? 'true' : 'false',
        });
        
        inserted++;
        
        if (inserted % 20 === 0) {
          console.log(`✅ Inseridas ${inserted} perguntas...`);
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          console.error(`❌ Erro ao inserir pergunta ${question.id}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ População concluída!');
    console.log(`📊 Inseridas: ${inserted}`);
    console.log(`⏭️  Puladas (já existem): ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📈 Total processado: ${inserted + skipped + errors}/${questions.length}`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

seedAllQuestions();
