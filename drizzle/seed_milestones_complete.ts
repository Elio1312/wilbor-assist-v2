import { getDb } from "../server/db";
import { wilborMilestoneContent } from "./schema";

// Complete milestone set with all age gaps filled
const milestones = [
  // === 0-2 Months ===
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
    "month": 2,
    "category": "motor",
    "titlePt": "Controle cervical inicial",
    "descriptionPt": "O bebê consegue levantar brevemente a cabeça quando deitado de bruços, demonstrando força no pescoço.",
    "titleEn": "Early head control",
    "descriptionEn": "Baby can briefly lift head when lying on tummy, showing neck strength development.",
    "titleEs": "Control cefálico inicial",
    "descriptionEs": "El bebé puede levantar brevemente la cabeza cuando está boca abajo, mostrando desarrollo de fuerza en el cuello.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 2,
    "category": "social",
    "titlePt": "Reconhecimento de rostos",
    "descriptionPt": "O bebê começa a prestar atenção em rostos e consegue seguí-los com os olhos.",
    "titleEn": "Face recognition",
    "descriptionEn": "Baby begins to pay attention to faces and can follow them with their eyes.",
    "titleEs": "Reconocimiento de rostros",
    "descriptionEs": "El bebé comienza a prestar atención a los rostros y puede seguirlos con los ojos.",
    "order": 2,
    "isActive": "true"
  },

  // === 4-6 Months (Gap 1) ===
  {
    "month": 4,
    "category": "motor",
    "titlePt": "Rolar de bruços para as costas",
    "descriptionPt": "O bebê ganha força cervical e abdominal suficiente para girar o corpo voluntariamente.",
    "titleEn": "Rolling from tummy to back",
    "descriptionEn": "Baby gains enough cervical and abdominal strength to voluntarily roll from tummy to back.",
    "titleEs": "Rodar de boca abajo a boca arriba",
    "descriptionEs": "El bebé gana suficiente fuerza cervical y abdominal para rodar voluntariamente.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 4,
    "category": "motor",
    "titlePt": "Senta com apoio",
    "descriptionPt": "O bebê consegue sentar quando apoiado por almofadas ou pelos pais, mantendo a cabeça erguida.",
    "titleEn": "Sits with support",
    "descriptionEn": "Baby can sit when supported by pillows or parents, keeping head upright.",
    "titleEs": "Se sienta con apoyo",
    "descriptionEs": "El bebé puede sentarse cuando se le apoya con almohadas o por los padres.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 4,
    "category": "motor",
    "titlePt": "Alcance e preensão",
    "descriptionPt": "O bebê começa a alcançar objetos intencionalmente e tentar agarrá-los com as mãos.",
    "titleEn": "Reaching and grasping",
    "descriptionEn": "Baby begins to intentionally reach for objects and try to grab them with hands.",
    "titleEs": "Alcance y prensión",
    "descriptionEs": "El bebé comienza a alcanzar objetos intencionalmente e intentar agarrarlos con las manos.",
    "order": 3,
    "isActive": "true"
  },
  {
    "month": 4,
    "category": "sensory",
    "titlePt": "Exploração oral",
    "descriptionPt": "O bebê explora objetos levando-os à boca, uma etapa importante do desenvolvimento sensorial.",
    "titleEn": "Oral exploration",
    "descriptionEn": "Baby explores objects by bringing them to mouth, an important sensory development stage.",
    "titleEs": "Exploración oral",
    "descriptionEs": "El bebé explora objetos llevándolos a la boca, una etapa importante del desarrollo sensorial.",
    "order": 4,
    "isActive": "true"
  },
  {
    "month": 4,
    "category": "social",
    "titlePt": "Sorriso social automático",
    "descriptionPt": "O bebê sorri automaticamente para pessoas, demonstrando desenvolvimento social precoce.",
    "titleEn": "Automatic social smile",
    "descriptionEn": "Baby smiles automatically at people, showing early social development.",
    "titleEs": "Sonrisa social automática",
    "descriptionEs": "El bebé sonríe automáticamente ante las personas, mostrando desarrollo social temprano.",
    "order": 5,
    "isActive": "true"
  },
  {
    "month": 5,
    "category": "motor",
    "titlePt": "Rolar de costas para bruços",
    "descriptionPt": "O bebê consegue rolar em ambas as direções, demonstrando força muscular bilateral.",
    "titleEn": "Rolling back to tummy",
    "descriptionEn": "Baby can roll in both directions, showing bilateral muscle strength.",
    "titleEs": "Rodar de boca arriba a boca abajo",
    "descriptionEs": "El bebé puede rodar en ambas direcciones, mostrando fuerza muscular bilateral.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 5,
    "category": "cognitive",
    "titlePt": "Segue objetos em movimento",
    "descriptionPt": "O bebê consegue acompanhar objetos que se movem horizontalmente com os olhos.",
    "titleEn": "Tracks moving objects",
    "descriptionEn": "Baby can track objects moving horizontally with eyes.",
    "titleEs": "Sigue objetos en movimiento",
    "descriptionEs": "El bebé puede seguir objetos que se mueven horizontalmente con los ojos.",
    "order": 2,
    "isActive": "true"
  },

  // === 6-9 Months (Gap 2) ===
  {
    "month": 6,
    "category": "motor",
    "titlePt": "Senta sem apoio",
    "descriptionPt": "O bebê consegue sentar sozinho sem apoio, mantendo equilíbrio por vários minutos.",
    "titleEn": "Sits without support",
    "descriptionEn": "Baby can sit alone without support, maintaining balance for several minutes.",
    "titleEs": "Se sienta sin apoyo",
    "descriptionEs": "El bebé puede sentarse solo sin apoyo, manteniendo el equilibrio durante varios minutos.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 6,
    "category": "cognitivo",
    "titlePt": "Curiosidade sobre o ambiente",
    "descriptionPt": "O bebê tenta alcançar objetos fora do seu alcance e demonstra interesse ativo em explorar texturas.",
    "titleEn": "Curiosity about environment",
    "descriptionEn": "Baby tries to reach for objects out of reach and shows active interest in exploring textures.",
    "titleEs": "Curiosidad sobre el entorno",
    "descriptionEs": "El bebé intenta alcanzar objetos fuera de su alcance y demuestra interés activo en explorar texturas.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 6,
    "category": "sensory",
    "titlePt": "Resposta ao próprio nome",
    "descriptionPt": "O bebê reconhece seu nome e responde voltando a cabeça ou olhando para quem chamou.",
    "titleEn": "Responds to own name",
    "descriptionEn": "Baby recognizes their name and responds by turning head or looking at who called.",
    "titleEs": "Responde a su propio nombre",
    "descriptionEs": "El bebé reconoce su nombre y responde volviendo la cabeza o mirando a quien llamó.",
    "order": 3,
    "isActive": "true"
  },
  {
    "month": 6,
    "category": "social",
    "titlePt": "Ansiedade de estranho (Stranger Anxiety)",
    "descriptionPt": "O bebê pode demonstrar medo ou desconforto com pessoas desconhecidas, um marco normal do desenvolvimento.",
    "titleEn": "Stranger anxiety",
    "descriptionEn": "Baby may show fear or discomfort with unfamiliar people, a normal developmental milestone.",
    "titleEs": "Ansiedad ante desconocidos",
    "descriptionEs": "El bebé puede demostrar miedo o incomodidad con personas desconocidas, un hito normal del desarrollo.",
    "order": 4,
    "isActive": "true"
  },
  {
    "month": 7,
    "category": "motor",
    "titlePt": "Engatinha",
    "descriptionPt": "O bebê começa a se mover de bruços, puxando-se com os braços ou engatinhando.",
    "titleEn": "Crawling begins",
    "descriptionEn": "Baby begins to move on tummy, pulling with arms or crawling.",
    "titleEs": "Gateo",
    "descriptionEs": "El bebé comienza a moverse boca abajo, tirando con los brazos o gateando.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 7,
    "category": "cognitive",
    "titlePt": "Jogo 'Cadê? Onde? Estou?''",
    "descriptionPt": "O bebê demonstra interesse em jogos de esconde-esconde simples, como cobrir o rosto com as mãos.",
    "titleEn": "Peek-a-boo game",
    "descriptionEn": "Baby shows interest in simple hide-and-seek games, like covering face with hands.",
    "titleEs": "Juego de cucú",
    "descriptionEs": "El bebé demuestra interés en juegos de escondite simples, como cubrirse la cara con las manos.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 8,
    "category": "motor",
    "titlePt": "Transferência de objetos",
    "descriptionPt": "O bebê consegue passar objetos de uma mão para a outra com coordenação.",
    "titleEn": "Object transfer",
    "descriptionEn": "Baby can pass objects from one hand to the other with coordination.",
    "titleEs": "Transferencia de objetos",
    "descriptionEs": "El bebé puede pasar objetos de una mano a la otra con coordinación.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 8,
    "category": "social",
    "titlePt": "Apego aos cuidadores",
    "descriptionPt": "O bebê demonstra forte vínculo com os pais e busca proximidade quando precisa de conforto.",
    "titleEn": "Attachment to caregivers",
    "descriptionEn": "Baby shows strong bond with parents and seeks closeness when needing comfort.",
    "titleEs": "Apego a los cuidadores",
    "descriptionEs": "El bebé demuestra un fuerte vínculo con los padres y busca proximidad cuando necesita consuelo.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 9,
    "category": "linguagem",
    "titlePt": "Balbucio polissilábico",
    "descriptionPt": "O bebê combina sons como 'ba-ba', 'da-da' e 'ma-ma' sem necessariamente atribuir significado ainda.",
    "titleEn": "Polysyllabic babbling",
    "descriptionEn": "Baby combines sounds like 'ba-ba', 'da-da', and 'ma-ma' without necessarily assigning meaning yet.",
    "titleEs": "Balbuceo polisilábico",
    "descriptionEs": "El bebé combina sonidos como 'ba-ba', 'da-da' y 'ma-ma' sin necesariamente atribuir significado aún.",
    "order": 1,
    "isActive": "true"
  },

  // === 12-15 Months (Gap 3) ===
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
    "month": 12,
    "category": "motor",
    "titlePt": "Sobe degraus com apoio",
    "descriptionPt": "O bebê consegue subir escadas ou degraus quando seguro pela mão de um adulto.",
    "titleEn": "Climbs stairs with support",
    "descriptionEn": "Baby can climb stairs or steps when held by an adult's hand.",
    "titleEs": "Sube escaleras con apoyo",
    "descriptionEs": "El bebé puede subir escaleras o escalones cuando se le sostiene de la mano de un adulto.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 12,
    "category": "linguagem",
    "titlePt": "Primeiras palavras",
    "descriptionPt": "O bebê pode dizer 2-3 palavras com significado, como 'mamã', 'papá' ou nomes simples.",
    "titleEn": "First words",
    "descriptionEn": "Baby may say 2-3 meaningful words like 'mama', 'dada' or simple names.",
    "titleEs": "Primeras palabras",
    "descriptionEs": "El bebé puede decir 2-3 palabras con significado, como 'mamá', 'papá' o nombres simples.",
    "order": 3,
    "isActive": "true"
  },
  {
    "month": 12,
    "category": "linguagem",
    "titlePt": "Aponta para pedir",
    "descriptionPt": "O bebê usa o dedo indicador para apontar e pedir coisas que deseja.",
    "titleEn": "Points to ask for things",
    "descriptionEn": "Baby uses index finger to point and ask for things they want.",
    "titleEs": "Señala para pedir",
    "descriptionEs": "El bebé usa el dedo índice para señalar y pedir cosas que desea.",
    "order": 4,
    "isActive": "true"
  },
  {
    "month": 12,
    "category": "cognitive",
    "titlePt": "Uso correto de objetos",
    "descriptionPt": "O bebé usa objetos de forma adequada: bebe no copo, escova no cabelo, telefone na orelha.",
    "titleEn": "Appropriate object use",
    "descriptionEn": "Baby uses objects correctly: drinks from cup, brush on hair, phone to ear.",
    "titleEs": "Uso correcto de objetos",
    "descriptionEs": "El bebé usa objetos de forma adecuada: bebe en el vaso, cepillo en el pelo, teléfono en la oreja.",
    "order": 5,
    "isActive": "true"
  },
  {
    "month": 13,
    "category": "social",
    "titlePt": "Demonstrações afetuosas",
    "descriptionPt": "O bebê inicia demonstrações de afeto como beijos, abraços e acenos de despedida.",
    "titleEn": "Affectionate gestures",
    "descriptionEn": "Baby initiates affectionate gestures like kisses, hugs, and waves goodbye.",
    "titleEs": "Gestos afectuosos",
    "descriptionEs": "El bebé inicia gestos afectuosos como besos, abrazos y señales de despedida.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 14,
    "category": "motor",
    "titlePt": "Anda com confiança",
    "descriptionPt": "O bebê anda com mais confiança, pode carregar objetos enquanto caminha.",
    "titleEn": "Walking with confidence",
    "descriptionEn": "Baby walks with more confidence, may carry objects while walking.",
    "titleEs": "Camina con confianza",
    "descriptionEs": "El bebé camina con más confianza, puede cargar objetos mientras camina.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 14,
    "category": "cognitive",
    "titlePt": "Imitação de ações",
    "descriptionPt": "O bebê imita ações que vê outros fazerem, como varrer,拍手, usar utensílios.",
    "titleEn": "Action imitation",
    "descriptionEn": "Baby imitates actions they see others do, like sweeping, clapping, using utensils.",
    "titleEs": "Imitación de acciones",
    "descriptionEs": "El bebé imita acciones que ve hacer a otros, como barrer, aplaudir, usar utensilios.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 15,
    "category": "social",
    "titlePt": "Imitação de tarefas domésticas",
    "descriptionPt": "O bebê tenta imitar ações dos pais, como 'limpar' a mesa ou 'falar' ao telefone.",
    "titleEn": "Imitation of household tasks",
    "descriptionEn": "Baby tries to imitate parents' actions, such as 'wiping' the table or 'talking' on the phone.",
    "titleEs": "Imitación de tareas domésticas",
    "descriptionEs": "El bebé intenta imitar acciones de los padres, como 'limpiar' la mesa o 'hablar' por teléfono.",
    "order": 1,
    "isActive": "true"
  },

  // === 18-24 Months ===
  {
    "month": 18,
    "category": "linguagem",
    "titlePt": "Vocabulário de 10 a 20 palavras",
    "descriptionPt": "A criança já utiliza palavras isoladas para nomear objetos comuns e expressar desejos.",
    "titleEn": "Vocabulary of 10 to 20 words",
    "descriptionEn": "Child uses isolated words to name common objects and express desires.",
    "titleEs": "Vocabulario de 10 a 20 palabras",
    "descriptionEs": "El niño ya utiliza palabras aisladas para nombrar objetos comunes y expresar deseos.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 18,
    "category": "motor",
    "titlePt": "Corre atrás da bola",
    "descriptionPt": "A criança consegue correr atrás de uma bola e tentar chutá-la.",
    "titleEn": "Runs after ball",
    "descriptionEn": "Child can run after a ball and try to kick it.",
    "titleEs": "Corre detrás de la pelota",
    "descriptionEs": "El niño puede correr detrás de una pelota e intentar patearla.",
    "order": 2,
    "isActive": "true"
  },
  {
    "month": 18,
    "category": "cognitive",
    "titlePt": "Identifica partes do corpo",
    "descriptionPt": "A criança consegue apontar para partes do corpo quando perguntada (cabeça, olhos, nariz).",
    "titleEn": "Identifies body parts",
    "descriptionEn": "Child can point to body parts when asked (head, eyes, nose).",
    "titleEs": "Identifica partes del cuerpo",
    "descriptionEs": "El niño puede señalar partes del cuerpo cuando se le pregunta (cabeza, ojos, nariz).",
    "order": 3,
    "isActive": "true"
  },
  {
    "month": 24,
    "category": "cognitivo",
    "titlePt": "Brincadeira Simbólica",
    "descriptionPt": "A criança utiliza objetos para representar outros (ex: um bloco vira um carrinho), demonstrando pensamento abstrato.",
    "titleEn": "Symbolic Play",
    "descriptionEn": "Child uses objects to represent others (e.g., a block becomes a car), demonstrating abstract thinking.",
    "titleEs": "Juego Simbólico",
    "descriptionEs": "El niño utiliza objetos para representar otros (ej: un bloque se convierte en un coche), demostrando pensamiento abstracto.",
    "order": 1,
    "isActive": "true"
  },
  {
    "month": 24,
    "category": "linguagem",
    "titlePt": "Frases de 2 palavras",
    "descriptionPt": "A criança começa a combinar duas palavras para formar frases simples como 'mais água' ou 'papai vai'.",
    "titleEn": "Two-word phrases",
    "descriptionEn": "Child begins combining two words into simple phrases like 'more water' or 'daddy go'.",
    "titleEs": "Frases de dos palabras",
    "descriptionEs": "El niño comienza a combinar dos palabras para formar frases simples como 'más agua' o 'papá va'.",
    "order": 2,
    "isActive": "true"
  }
];

async function seed() {
  console.log("🌱 Starting complete milestone seed...");
  console.log(`📊 Total milestones to insert: ${milestones.length}`);

  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // First, clear existing milestones to avoid duplicates
    console.log("🗑️ Clearing existing milestones...");
    await db.delete(wilborMilestoneContent);

    // Insert all milestones
    await db.insert(wilborMilestoneContent).values(milestones as any);
    console.log(`✅ Successfully inserted ${milestones.length} milestones!`);

    // Group by month for verification
    const byMonth: Record<number, number> = {};
    milestones.forEach(m => {
      byMonth[m.month] = (byMonth[m.month] || 0) + 1;
    });

    console.log("\n📅 Milestones by month:");
    Object.entries(byMonth)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([month, count]) => {
        console.log(`  Mês ${month}: ${count} marcos`);
      });

  } catch (error) {
    console.error("❌ Error seeding milestones:", error);
    process.exit(1);
  }
}

seed();