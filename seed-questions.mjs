import { seedQuestions } from './server/seedQuestions.ts';

console.log('🌱 Iniciando seed de perguntas...\n');
const result = await seedQuestions();
console.log('\n✅ Seed finalizado!');
console.log(JSON.stringify(result, null, 2));
process.exit(result?.success ? 0 : 1);
