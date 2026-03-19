#!/usr/bin/env node

/**
 * Script para popular perguntas no banco de dados
 * Execute com: node seed-questions.mjs
 */

import { drizzle } from "drizzle-orm/mysql2/promise";
import mysql from "mysql2/promise";
import { wilborKnowledgeBase } from "./drizzle/schema.ts";

const questions = [
  {
    category: "sono",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Meu bebê não dorme à noite",
    keywords: "sono, insônia, noite, despertares",
    answerPt: "Bebês têm ciclos de sono diferentes. Recém-nascidos dormem 16-17h/dia em períodos curtos. Crie rotina: banho, alimentação, ambiente escuro. Se persistir após 3 meses, procure pediatra.",
    answerEn: "Babies have different sleep cycles. Newborns sleep 16-17h/day in short periods. Create routine: bath, feeding, dark environment. If persists after 3 months, see pediatrician.",
    answerEs: "Los bebés tienen ciclos de sueño diferentes. Los recién nacidos duermen 16-17h/día en períodos cortos. Crea rutina: baño, alimentación, ambiente oscuro. Si persiste después de 3 meses, consulta pediatra.",
    source: "SBP 2024",
    priority: 10,
    isActive: "true",
  },
  {
    category: "colica",
    ageRangeStart: 0,
    ageRangeEnd: 3,
    question: "Meu bebê tem cólica - o que fazer?",
    keywords: "cólica, dor, choro, desconforto",
    answerPt: "Cólicas são normais até 3 meses. Técnicas: massagem na barriguinha em círculos, posição de gás, pano quente. Evite alimentos que causam gases (se amamentando). Simeticona pode ajudar.",
    answerEn: "Colic is normal until 3 months. Techniques: belly massage in circles, gas position, warm cloth. Avoid gas-causing foods (if breastfeeding). Simethicone may help.",
    answerEs: "Los cólicos son normales hasta 3 meses. Técnicas: masaje en la barriguita en círculos, posición de gas, paño caliente. Evita alimentos que causan gases (si amamantas). La simeticona puede ayudar.",
    source: "SBP 2024",
    priority: 9,
    isActive: "true",
  },
  {
    category: "amamentacao",
    ageRangeStart: 0,
    ageRangeEnd: 6,
    question: "Dúvidas sobre amamentação",
    keywords: "amamentação, leite, pega, mama",
    answerPt: "Pega correta é essencial. Bebê deve pegar toda a aréola, não apenas o bico. Amamente em livre demanda (8-12x/dia). Se dor, procure consultora de lactação. Leite materno é o melhor alimento.",
    answerEn: "Correct latch is essential. Baby should grasp entire areola, not just nipple. Breastfeed on demand (8-12x/day). If pain, see lactation consultant. Breast milk is best food.",
    answerEs: "El agarre correcto es esencial. El bebé debe agarrar toda la areola, no solo el pezón. Amamanta a demanda (8-12x/día). Si hay dolor, consulta consultora de lactancia. La leche materna es el mejor alimento.",
    source: "SBP 2024",
    priority: 10,
    isActive: "true",
  },
  {
    category: "febre",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Meu bebê tem febre - é grave?",
    keywords: "febre, temperatura, infecção",
    answerPt: "Febre é defesa do corpo. Bebê < 3 meses com febre: procure PS imediatamente. Bebê > 3 meses: se febre < 38.5°C e ativo, observe. Mantenha hidratado. Paracetamol/ibuprofeno conforme peso.",
    answerEn: "Fever is body's defense. Baby < 3 months with fever: go to ER immediately. Baby > 3 months: if fever < 38.5°C and active, observe. Keep hydrated. Acetaminophen/ibuprofen by weight.",
    answerEs: "La fiebre es defensa del cuerpo. Bebé < 3 meses con fiebre: ve a urgencias inmediatamente. Bebé > 3 meses: si fiebre < 38.5°C y activo, observa. Mantén hidratado. Paracetamol/ibuprofeno por peso.",
    source: "SBP 2024",
    priority: 10,
    isActive: "true",
  },
  {
    category: "alimentacao",
    ageRangeStart: 6,
    ageRangeEnd: 12,
    question: "Como iniciar alimentação complementar?",
    keywords: "alimentação, papinha, introdução, 6 meses",
    answerPt: "Inicie aos 6 meses com frutas (maçã, banana). Depois legumes (cenoura, abóbora). Espere 3 dias entre novos alimentos. Ofereça 1-2 colheres. Mantenha leite materno/fórmula como principal.",
    answerEn: "Start at 6 months with fruits (apple, banana). Then vegetables (carrot, squash). Wait 3 days between new foods. Offer 1-2 spoons. Keep breast/formula milk as main.",
    answerEs: "Comienza a los 6 meses con frutas (manzana, plátano). Luego verduras (zanahoria, calabaza). Espera 3 días entre nuevos alimentos. Ofrece 1-2 cucharadas. Mantén leche materna/fórmula como principal.",
    source: "SBP 2024",
    priority: 9,
    isActive: "true",
  },
  {
    category: "vacina",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Calendário de vacinação do bebê",
    keywords: "vacina, imunização, calendário",
    answerPt: "Siga o calendário do SUS: BCG (nascimento), Hepatite B (nascimento), Pentavalente (2,4,6 meses), Poliomielite (2,4,6 meses), Rotavírus (2,4 meses). Reações leves são normais.",
    answerEn: "Follow SUS schedule: BCG (birth), Hepatitis B (birth), Pentavalent (2,4,6 months), Polio (2,4,6 months), Rotavirus (2,4 months). Mild reactions are normal.",
    answerEs: "Sigue calendario SUS: BCG (nacimiento), Hepatitis B (nacimiento), Pentavalente (2,4,6 meses), Polio (2,4,6 meses), Rotavirus (2,4 meses). Reacciones leves son normales.",
    source: "SBP 2024",
    priority: 10,
    isActive: "true",
  },
  {
    category: "salto",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Meu bebê está em um 'salto de desenvolvimento'",
    keywords: "desenvolvimento, salto, marcos",
    answerPt: "Saltos ocorrem aos 5, 8, 12, 16, 19, 26 semanas. Bebê fica mais irritável, dorme mal, quer mais contato. É normal! Dura 1-2 semanas. Ofereça segurança e contato físico.",
    answerEn: "Leaps occur at 5, 8, 12, 16, 19, 26 weeks. Baby becomes fussier, sleeps poorly, wants more contact. Normal! Lasts 1-2 weeks. Offer security and physical contact.",
    answerEs: "Los saltos ocurren a las 5, 8, 12, 16, 19, 26 semanas. El bebé se vuelve más irritable, duerme mal, quiere más contacto. ¡Normal! Dura 1-2 semanas. Ofrece seguridad y contacto físico.",
    source: "SBP 2024",
    priority: 8,
    isActive: "true",
  },
  {
    category: "seguranca",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Como deixar o berço seguro?",
    keywords: "segurança, berço, morte súbita, SIDS",
    answerPt: "Colchão firme, sem travesseiro/almofada. Bebê de costas. Temperatura ambiente 18-22°C. Chupeta pode ajudar. Evite co-sleeping. Mantenha objetos longe do berço.",
    answerEn: "Firm mattress, no pillow/cushion. Baby on back. Room temp 18-22°C. Pacifier may help. Avoid co-sleeping. Keep objects away from crib.",
    answerEs: "Colchón firme, sin almohada/cojín. Bebé boca arriba. Temperatura 18-22°C. Chupete puede ayudar. Evita co-dormir. Mantén objetos lejos de la cuna.",
    source: "SBP 2024",
    priority: 10,
    isActive: "true",
  },
  {
    category: "higiene_oral",
    ageRangeStart: 6,
    ageRangeEnd: 12,
    question: "Primeiros dentes - cuidados",
    keywords: "dentes, erupção, higiene, escova",
    answerPt: "Primeiros dentes: 6-12 meses. Limpar com gaze úmida. Aos 12 meses: escova macia. Sem pasta com flúor antes de 2 anos. Procure dentista.",
    answerEn: "First teeth: 6-12 months. Clean with wet gauze. At 12 months: soft brush. No fluoride toothpaste before 2 years. See dentist.",
    answerEs: "Primeros dientes: 6-12 meses. Limpiar con gasa húmeda. A los 12 meses: cepillo suave. Sin pasta fluorada antes de 2 años. Consulta dentista.",
    source: "SBP 2024",
    priority: 7,
    isActive: "true",
  },
  {
    category: "geral",
    ageRangeStart: 0,
    ageRangeEnd: 12,
    question: "Depressão pós-parto - como reconhecer?",
    keywords: "depressão, pós-parto, tristeza, ansiedade",
    answerPt: "Tristeza persistente, falta de interesse, insônia, ansiedade extrema. Procure psicólogo/psiquiatra. Não é fraqueza! Tratamento funciona. Converse com família sobre apoio.",
    answerEn: "Persistent sadness, lack of interest, insomnia, extreme anxiety. See psychologist/psychiatrist. Not weakness! Treatment works. Talk to family about support.",
    answerEs: "Tristeza persistente, falta de interés, insomnio, ansiedad extrema. Consulta psicólogo/psiquiatra. ¡No es debilidad! El tratamiento funciona. Habla con familia sobre apoyo.",
    source: "SBP 2024",
    priority: 9,
    isActive: "true",
  },
];

async function seedQuestions() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "wilbor",
    });

    const db = drizzle(connection);

    console.log("🌱 Iniciando população de perguntas...");
    console.log(`📝 Total de perguntas: ${questions.length}`);

    let inserted = 0;

    for (const question of questions) {
      try {
        await db.insert(wilborKnowledgeBase).values({
          question: question.question,
          category: question.category,
          keywords: question.keywords,
          ageRangeStart: question.ageRangeStart,
          ageRangeEnd: question.ageRangeEnd,
          answerPt: question.answerPt,
          answerEn: question.answerEn,
          answerEs: question.answerEs,
          source: question.source,
          priority: question.priority,
          isActive: question.isActive,
        });

        inserted++;
        console.log(`✅ ${inserted}. ${question.question}`);
      } catch (error) {
        console.error(`❌ Erro ao inserir: ${question.question}`, error);
      }
    }

    console.log("\n✅ População concluída!");
    console.log(`📊 Inseridas: ${inserted}/${questions.length}`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  }
}

seedQuestions();
