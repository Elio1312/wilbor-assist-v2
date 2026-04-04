import { getDb } from "./server/db";
import { wilborEbooks } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const EBOOKS = [
  {
    id: "casamento-01",
    titlePt: "Quando o marido não ajuda: Como conversar sem brigar",
    descriptionPt: "Comunicação não-violenta, divisão de tarefas, técnicas de negociação.",
    category: "casamento",
    priceBrl: 2990,
    priceUsd: 990,
    priceEur: 990,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-01.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-01.pdf",
  },
  {
    id: "casamento-02",
    titlePt: "Sexualidade após bebê: Recuperando a intimidade",
    descriptionPt: "Libido baixa, como retomar relações, timing certo, conexão emocional.",
    category: "casamento",
    priceBrl: 3990,
    priceUsd: 1290,
    priceEur: 1290,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-02.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-02.pdf",
  },
  {
    id: "casamento-03",
    titlePt: "Depressão pós-parto afeta o casamento: O que fazer",
    descriptionPt: "Reconhecer sinais, como o marido pode ajudar, quando procurar ajuda.",
    category: "casamento",
    priceBrl: 2990,
    priceUsd: 990,
    priceEur: 990,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-03.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-03.pdf",
  },
  {
    id: "casamento-04",
    titlePt: "Ciúmes do bebê: Marido se sente abandonado",
    descriptionPt: "Reconhecer o problema, técnicas de reconexão, date night com bebê.",
    category: "casamento",
    priceBrl: 2490,
    priceUsd: 790,
    priceEur: 790,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-04.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-04.pdf",
  },
  {
    id: "casamento-05",
    titlePt: "Cansaço extremo: Como manter o casamento vivo",
    descriptionPt: "Gerenciamento de energia, pequenos gestos, quando pedir ajuda.",
    category: "casamento",
    priceBrl: 1990,
    priceUsd: 590,
    priceEur: 590,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-05.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-05.pdf",
  },
  {
    id: "casamento-06",
    titlePt: "Divisão de tarefas: Guia prático para casais",
    descriptionPt: "Tabela de responsabilidades, como negociar, evitar ressentimento.",
    category: "casamento",
    priceBrl: 2490,
    priceUsd: 790,
    priceEur: 790,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-06.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-06.pdf",
  },
  {
    id: "casamento-07",
    titlePt: "Volta ao trabalho: Impacto no casamento",
    descriptionPt: "Estresse duplo, organização familiar, apoio mútuo.",
    category: "casamento",
    priceBrl: 2990,
    priceUsd: 990,
    priceEur: 990,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-07.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-07.pdf",
  },
  {
    id: "casamento-08",
    titlePt: "Diferenças na paternidade: Ele quer, ela não quer",
    descriptionPt: "Planejamento familiar, conversas difíceis, terapia de casal.",
    category: "casamento",
    priceBrl: 3490,
    priceUsd: 1090,
    priceEur: 1090,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-08.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-08.pdf",
  },
  {
    id: "casamento-09",
    titlePt: "Sogra/Família: Como proteger o casamento",
    descriptionPt: "Limites saudáveis, comunicação com família, unidade do casal.",
    category: "casamento",
    priceBrl: 2490,
    priceUsd: 790,
    priceEur: 790,
    coverImage: "https://files.manuscdn.com/wilbor/ebooks/casamento-09.png",
    pdfUrl: "https://files.manuscdn.com/wilbor/ebooks/pdf/casamento-09.pdf",
  },
];

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding e-books...");

  for (const ebook of EBOOKS) {
    const existing = await db.select().from(wilborEbooks).where(eq(wilborEbooks.id, ebook.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(wilborEbooks).values({
        ...ebook,
        titleEn: ebook.titlePt, // Fallback to PT for now
        titleEs: ebook.titlePt,
        descriptionEn: ebook.descriptionPt,
        descriptionEs: ebook.descriptionPt,
      });
      console.log(`Inserted: ${ebook.titlePt}`);
    } else {
      console.log(`Skipped (exists): ${ebook.titlePt}`);
    }
  }

  console.log("Seed completed!");
}

seed().catch(console.error);
