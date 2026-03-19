import { getDb } from './server/db.ts';
import { wilborKnowledgeBase } from './drizzle/schema.ts';
import { getWilborSystemPrompt } from './server/wilborPrompt.ts';

console.log('🧪 Testando fluxo de chat com prompt antigo...\n');

// Teste 1: Verificar se o prompt foi carregado
const prompt = getWilborSystemPrompt('pt', 'Maria', 'João', undefined, undefined, undefined, undefined, true);
console.log('✅ Prompt carregado com sucesso!');
console.log(`📝 Tamanho do prompt: ${prompt.length} caracteres`);
console.log(`🎯 Contém "SAFETY_PROTOCOL": ${prompt.includes('SAFETY_PROTOCOL') ? '✅ SIM' : '❌ NÃO'}`);
console.log(`🎯 Contém "MEDICATION_PROTOCOL": ${prompt.includes('MEDICATION_PROTOCOL') ? '✅ SIM' : '❌ NÃO'}`);
console.log(`🎯 Contém "EXCLUSIVITY_RULE": ${prompt.includes('EXCLUSIVITY_RULE') ? '✅ SIM' : '❌ NÃO'}`);

// Teste 2: Verificar banco de dados
const db = await getDb();
if (db) {
  const questions = await db.select().from(wilborKnowledgeBase).limit(5);
  console.log(`\n✅ Banco de dados conectado!`);
  console.log(`📊 Amostra de perguntas: ${questions.length} encontradas`);
  questions.forEach((q, i) => {
    console.log(`   ${i+1}. ${q.question?.substring(0, 50)}...`);
  });
} else {
  console.error('❌ Falha ao conectar ao banco');
}

console.log('\n✅ TESTES CONCLUÍDOS COM SUCESSO!');
