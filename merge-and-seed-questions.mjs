#!/usr/bin/env node

/**
 * Script para combinar, desduplicar e inserir TODAS as perguntas
 * Execute com: node merge-and-seed-questions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mergeAndSeed() {
  try {
    console.log('🔄 Combinando e desduplicando perguntas...\n');
    
    // Ler ambos os arquivos
    const extracted = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'server/wilborQuestionsExtracted.json'), 'utf-8')
    );
    
    const converted = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'server/wilborQuestionsConverted.json'), 'utf-8')
    );
    
    console.log(`📊 Perguntas extraídas (SQL): ${extracted.length}`);
    console.log(`📊 Perguntas convertidas (JSON): ${converted.length}`);
    
    // Combinar
    let allQuestions = [...extracted, ...converted];
    console.log(`📊 Total antes de desduplicar: ${allQuestions.length}`);
    
    // Desduplicar por pergunta (case-insensitive)
    const seen = new Set();
    const deduplicated = [];
    let duplicates = 0;
    
    for (const q of allQuestions) {
      const key = q.question.toLowerCase().trim();
      
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(q);
      } else {
        duplicates++;
      }
    }
    
    console.log(`✅ Total após desduplicar: ${deduplicated.length}`);
    console.log(`🔄 Duplicatas removidas: ${duplicates}`);
    
    // Reorganizar IDs
    deduplicated.forEach((q, idx) => {
      q.id = idx + 1;
    });
    
    // Salvar arquivo final
    const finalFile = path.join(__dirname, 'server/wilborQuestionsAll.json');
    fs.writeFileSync(finalFile, JSON.stringify(deduplicated, null, 2), 'utf-8');
    
    console.log(`\n💾 Salvo em: ${finalFile}`);
    
    // Estatísticas
    const categories = {};
    for (const q of deduplicated) {
      const cat = q.category;
      categories[cat] = (categories[cat] || 0) + 1;
    }
    
    console.log(`\n📊 Distribuição final por categoria:`);
    const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sorted) {
      console.log(`  - ${cat}: ${count}`);
    }
    
    console.log(`\n✅ TOTAL FINAL: ${deduplicated.length} perguntas prontas para inserção!`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

mergeAndSeed();
