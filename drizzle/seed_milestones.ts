import { getDb } from "../server/db";
import { wilborMilestoneContent } from "./schema";

const milestones = [
  {
    "month": 0,
    "category": "motor",
    "titlePt": "Reflexo de preensão",
    "descriptionPt": "O bebê recém-nascido fecha a mão com força ao sentir algo na palma, um reflexo inato que demonstra saúde neurológica.",
    "titleEn": "Grasping reflex",
    "descriptionEn": "The newborn baby tightly closes their hand when something touches their palm, an innate reflex showing neurological health.",
    "titleEs": "Reflejo de prensión",
    "descriptionEs": "El bebé recién nacido cierra la mano con fuerza al sentir algo en la palma, un reflejo innato que demonstra salud neurológica.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 1,
    "category": "social",
    "titlePt": "Sorriso Social",
    "descriptionPt": "O bebê começa a sorrir em resposta a estímulos externos, especialmente o rosto e a voz dos pais.",
    "titleEn": "Social Smile",
    "descriptionEn": "The baby begins to smile in response to external stimuli, especially the face and voice of the parents.",
    "titleEs": "Sonrisa Social",
    "descriptionEs": "El bebé comienza a sonreír en respuesta a estímulos externos, especialmente el rostro y la voz de los padres.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 4,
    "category": "motor",
    "titlePt": "Rolar de bruços para as costas",
    "descriptionPt": "O bebê ganha força cervical e abdominal suficiente para girar o corpo voluntariamente.",
    "titleEn": "Rolling from tummy to back",
    "descriptionEn": "The baby gains enough cervical and abdominal strength to voluntarily rotate their body.",
    "titleEs": "Rodar de boca abajo a boca arriba",
    "descriptionEs": "El bebé gana suficiente fuerza cervical y abdominal para girar el cuerpo voluntariamente.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 6,
    "category": "cognitivo",
    "titlePt": "Curiosidade sobre o ambiente",
    "descriptionPt": "O bebê tenta alcançar objetos fora do seu alcance e demonstra interesse ativo em explorar texturas.",
    "titleEn": "Curiosity about the environment",
    "descriptionEn": "The baby tries to reach for objects out of reach and shows active interest in exploring textures.",
    "titleEs": "Curiosidad sobre el entorno",
    "descriptionEs": "El bebé intenta alcanzar objetos fuera de su alcance y demuestra interés activo en explorar texturas.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 9,
    "category": "linguagem",
    "titlePt": "Balbucio polissilábico",
    "descriptionPt": "O bebê combina sons como 'ba-ba', 'da-da' e 'ma-ma' sem necessariamente atribuir significado ainda.",
    "titleEn": "Polysyllabic babbling",
    "descriptionEn": "The baby combines sounds like 'ba-ba', 'da-da', and 'ma-ma' without necessarily assigning meaning yet.",
    "titleEs": "Balbuceo polisilábico",
    "descriptionEs": "El bebé combina sonidos como 'ba-ba', 'da-da' y 'ma-ma' sin necesariamente atribuir significado aún.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 12,
    "category": "motor",
    "titlePt": "Primeiros passos independentes",
    "descriptionPt": "Muitos bebês conseguem dar alguns passos sem apoio, demonstrando equilíbrio e controle muscular.",
    "titleEn": "First independent steps",
    "descriptionEn": "Many babies can take a few steps without support, demonstrating balance and muscular control.",
    "titleEs": "Primeros pasos independientes",
    "descriptionEs": "Muchos bebés logran dar algunos pasos sin apoyo, demostrando equilibrio y control muscular.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 15,
    "category": "social",
    "titlePt": "Imitação de tarefas domésticas",
    "descriptionPt": "O bebê tenta imitar ações dos pais, como 'limpar' a mesa ou 'falar' ao telefone.",
    "titleEn": "Imitation of household tasks",
    "descriptionEn": "The baby tries to imitate parents' actions, such as 'wiping' the table or 'talking' on the phone.",
    "titleEs": "Imitación de tareas domésticas",
    "descriptionEs": "El bebé intenta imitar acciones de los padres, como 'limpiar' por teléfono.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 18,
    "category": "linguagem",
    "titlePt": "Vocabulário de 10 a 20 palavras",
    "descriptionPt": "A criança já utiliza palavras isoladas para nomear objetos comuns e expressar desejos.",
    "titleEn": "Vocabulary of 10 to 20 words",
    "descriptionEn": "The child already uses isolated words to name common objects and express desires.",
    "titleEs": "Vocabulario de 10 a 20 palabras",
    "descriptionEs": "El niño ya utiliza palabras aisladas para nombrar objetos comunes y expresar deseos.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 24,
    "category": "cognitivo",
    "titlePt": "Brincadeira Simbólica",
    "descriptionPt": "A criança utiliza objetos para representar outros (ex: um bloco vira um carrinho), demonstrando pensamento abstrato.",
    "titleEn": "Symbolic Play",
    "descriptionEn": "The child uses objects to represent others (e.g., a block becomes a car), demonstrating abstract thinking.",
    "titleEs": "Juego Simbólico",
    "descriptionEs": "El niño utiliza objetos para representar otros (ej: un bloque se convierte en un coche), demostrando pensamiento abstracto.",
    "order": 1,
    "isActive": "true"
  }
];

async function seed() {
  console.log("🌱 Starting milestone seed...");
  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // Inserção em lote (bulk insert)
    await db.insert(wilborMilestoneContent).values(milestones as any);
    console.log(`✅ Successfully inserted ${milestones.length} milestones!`);
  } catch (error) {
    console.error("❌ Error seeding milestones:", error);
    process.exit(1);
  }
}

seed();
