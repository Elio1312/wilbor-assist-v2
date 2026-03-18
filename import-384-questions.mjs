import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('./wilbor_kb_384_trilingual.json', 'utf-8'));

// Gerar SQL INSERT
const questions = data.perguntas_traduzidas || [];
console.log(`📊 Total de perguntas: ${questions.length}`);

// Agrupar por ID original para consolidar
const consolidated = {};
questions.forEach(q => {
  const id = q.id_original;
  if (!consolidated[id]) {
    consolidated[id] = {
      pt: null,
      en: null,
      es: null,
      categoria: q.categoria
    };
  }
  consolidated[id][q.idioma] = {
    pergunta: q.pergunta,
    resposta: q.resposta
  };
});

console.log(`✅ Consolidadas ${Object.keys(consolidated).length} perguntas únicas`);

// Gerar SQL
let sql = '';
let count = 0;
Object.entries(consolidated).forEach(([id, data]) => {
  if (data.pt && data.pt.pergunta && data.pt.resposta) {
    const pergunta = data.pt.pergunta.replace(/'/g, "''");
    const resposta = data.pt.resposta.replace(/'/g, "''");
    const categoria = data.categoria || 'geral';
    
    sql += `INSERT INTO wilborKnowledgeBase (pergunta, resposta, categoria, idioma, createdAt) VALUES ('${pergunta}', '${resposta}', '${categoria}', 'pt', NOW());\n`;
    count++;
  }
});

console.log(`✅ Gerando SQL para ${count} perguntas`);
fs.writeFileSync('wilbor_kb_384_import.sql', sql);
console.log('✅ Arquivo wilbor_kb_384_import.sql criado!');
