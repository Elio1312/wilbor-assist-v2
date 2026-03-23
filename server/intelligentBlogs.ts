/**
 * Intelligent Blog Articles with Wilbor Integration
 * 45 artigos otimizados para SEO com CTAs inteligentes
 * Integração com Sleep Tracker, Feeding Tracker, Growth Crises, Diary
 */

export interface IntelligentBlogArticle {
  slug: string;
  title: string;
  category: "sono" | "alimentação" | "desenvolvimento" | "saúde" | "segurança" | "materna" | "vacinas" | "cólica";
  wilborFeature?: "sleep" | "feeding" | "growth" | "diary" | "panic";
  wilborCTA?: string;
  relatedSlugs?: string[];
  excerpt: string;
  keywords: string[];
}

export const INTELLIGENT_BLOGS: IntelligentBlogArticle[] = [
  // ==========================================
  // CATEGORIA: SONO (9 blogs)
  // ==========================================
  {
    slug: "bebe-nao-dorme",
    title: "Bebê não dorme: guia completo por idade (0 a 12 meses)",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Teste o Sleep Tracker do Wilbor - Wilbor calcula automaticamente as janelas de sono do seu bebê e envia alertas quando é hora de dormir!",
    relatedSlugs: ["regressao-sono-4-meses", "bebe-acorda-noite", "ambiente-ideal-sono"],
    excerpt: "Entenda as janelas de sono do seu bebê por idade e aprenda técnicas comprovadas para melhorar as noites.",
    keywords: ["bebê não dorme", "sono do bebê", "janela de sono", "rotina de sono bebê", "bebê acorda de madrugada"],
  },
  {
    slug: "regressao-sono-4-meses",
    title: "Regressão do sono aos 4 meses: o que é e como lidar",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Use o Sleep Tracker do Wilbor para acompanhar as mudanças no padrão de sono do seu bebê durante a regressão.",
    relatedSlugs: ["bebe-nao-dorme", "ambiente-ideal-sono"],
    excerpt: "A regressão do sono aos 4 meses é normal e temporária. Aprenda técnicas para lidar com essa fase.",
    keywords: ["regressão sono 4 meses", "bebê acordando mais", "sono bebê 4 meses"],
  },
  {
    slug: "bebe-acorda-noite",
    title: "Bebê acorda de madrugada: causas e soluções práticas",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Registre cada acordada no Sleep Tracker e Wilbor vai identificar padrões para ajudar você.",
    relatedSlugs: ["bebe-nao-dorme", "ambiente-ideal-sono"],
    excerpt: "Descubra por que seu bebê acorda de madrugada e aprenda técnicas para melhorar o sono noturno.",
    keywords: ["bebê acorda de madrugada", "bebê não dorme a noite", "acordar de noite bebê"],
  },
  {
    slug: "bebe-dorme-pouco",
    title: "Bebê dorme pouco: é normal? Quando procurar o pediatra",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Monitore o total de sono do seu bebê com o Sleep Tracker e compare com os valores normais por idade.",
    relatedSlugs: ["bebe-nao-dorme"],
    excerpt: "Saiba quanto um bebê deve dormir por idade e quando procurar ajuda profissional.",
    keywords: ["bebê dorme pouco", "insônia bebê", "sono insuficiente"],
  },
  {
    slug: "ambiente-ideal-sono",
    title: "Ambiente ideal para o bebê dormir: temperatura, luz e som",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "O Sleep Tracker do Wilbor lembra você de criar o ambiente perfeito para cada soneca.",
    relatedSlugs: ["bebe-nao-dorme", "regressao-sono-4-meses"],
    excerpt: "Aprenda a criar o ambiente perfeito para o bebê dormir bem: temperatura, escuridão e ruído branco.",
    keywords: ["ambiente sono bebê", "quarto bebê", "temperatura ideal bebê"],
  },
  {
    slug: "rotina-sono-bebe",
    title: "Rotina de sono para bebê: como estabelecer desde o nascimento",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Use o Sleep Tracker para estabelecer e manter uma rotina consistente de sono.",
    relatedSlugs: ["bebe-nao-dorme", "ambiente-ideal-sono"],
    excerpt: "Uma rotina consistente é essencial para o sono do bebê. Aprenda como estabelecer desde o nascimento.",
    keywords: ["rotina sono bebê", "rotina bedtime", "estabelecer rotina sono"],
  },
  {
    slug: "sono-bebe-3-meses",
    title: "Sono do bebê aos 3 meses: o que esperar e como ajudar",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Acompanhe o desenvolvimento do sono do seu bebê com o Sleep Tracker personalizado por idade.",
    relatedSlugs: ["bebe-nao-dorme", "regressao-sono-4-meses"],
    excerpt: "Aos 3 meses, o padrão de sono do bebê começa a mudar. Entenda o que esperar.",
    keywords: ["sono bebê 3 meses", "padrão sono 3 meses", "bebê 3 meses dormindo"],
  },
  {
    slug: "sono-bebe-6-meses",
    title: "Sono do bebê aos 6 meses: consolidação do sono noturno",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "Aos 6 meses, use o Sleep Tracker para consolidar o sono noturno do seu bebê.",
    relatedSlugs: ["bebe-nao-dorme", "sono-bebe-3-meses"],
    excerpt: "Aos 6 meses, muitos bebês conseguem dormir a noite toda. Aprenda como facilitar isso.",
    keywords: ["sono bebê 6 meses", "bebê 6 meses dormindo", "sono noturno bebê"],
  },
  {
    slug: "sono-bebe-12-meses",
    title: "Sono do bebê aos 12 meses: transição para 1 soneca",
    category: "sono",
    wilborFeature: "sleep",
    wilborCTA: "O Sleep Tracker do Wilbor ajuda na transição para 1 soneca durante o dia.",
    relatedSlugs: ["bebe-nao-dorme", "sono-bebe-6-meses"],
    excerpt: "Aos 12 meses, o bebê começa a fazer apenas 1 soneca. Aprenda como fazer essa transição.",
    keywords: ["sono bebê 12 meses", "bebê 1 ano dormindo", "soneca bebê"],
  },

  // ==========================================
  // CATEGORIA: ALIMENTAÇÃO (6 blogs)
  // ==========================================
  {
    slug: "amamentacao-dificuldades",
    title: "Dificuldades na amamentação: guia prático para resolver",
    category: "alimentação",
    wilborFeature: "feeding",
    wilborCTA: "Registre cada mamada no Feeding Tracker do Wilbor e receba alertas personalizados para a próxima.",
    relatedSlugs: ["amamentacao-posicoes", "quantidade-leite-bebe"],
    excerpt: "Aprenda a resolver as principais dificuldades na amamentação: dor, pouco leite, pega incorreta.",
    keywords: ["amamentação dificuldades", "dor ao amamentar", "amamentação dor", "pega correta"],
  },
  {
    slug: "amamentacao-posicoes",
    title: "Posições corretas para amamentar: conforto e eficiência",
    category: "alimentação",
    wilborFeature: "feeding",
    wilborCTA: "Registre qual posição funciona melhor para você no Feeding Tracker do Wilbor.",
    relatedSlugs: ["amamentacao-dificuldades", "quantidade-leite-bebe"],
    excerpt: "Conheça as principais posições para amamentar e escolha a que funciona melhor para você.",
    keywords: ["posições amamentação", "posição correta amamentar", "posições de amamentar"],
  },
  {
    slug: "introducao-alimentar",
    title: "Introdução alimentar: como começar com segurança (6 meses+)",
    category: "alimentação",
    wilborFeature: "diary",
    wilborCTA: "Registre cada novo alimento no Diary do Wilbor para acompanhar possíveis reações.",
    relatedSlugs: ["alergias-alimentares", "quantidade-leite-bebe"],
    excerpt: "Guia completo para introduzir alimentos sólidos com segurança a partir dos 6 meses.",
    keywords: ["introdução alimentar", "primeiros alimentos bebê", "baby led weaning"],
  },
  {
    slug: "bebe-nao-quer-comer",
    title: "Bebê não quer comer: causas e estratégias para estimular",
    category: "alimentação",
    wilborFeature: "diary",
    wilborCTA: "Registre o que seu bebê come no Diary e identifique padrões de recusa alimentar.",
    relatedSlugs: ["quantidade-leite-bebe", "alergias-alimentares"],
    excerpt: "Seu bebê recusa comida? Aprenda as causas e estratégias práticas para estimular a alimentação.",
    keywords: ["bebê não quer comer", "recusa alimentar", "bebê não come"],
  },
  {
    slug: "quantidade-leite-bebe",
    title: "Quanto leite o bebê deve beber: guia por idade",
    category: "alimentação",
    wilborFeature: "feeding",
    wilborCTA: "Use o Feeding Tracker para garantir que seu bebê está recebendo a quantidade correta de leite.",
    relatedSlugs: ["amamentacao-dificuldades", "bebe-nao-quer-comer"],
    excerpt: "Saiba quanto leite seu bebê precisa por idade e como saber se está comendo o suficiente.",
    keywords: ["quantidade leite bebê", "quanto leite bebê bebe", "ingestão leite bebê"],
  },
  {
    slug: "alergias-alimentares",
    title: "Alergias alimentares em bebês: sinais, diagnóstico e prevenção",
    category: "alimentação",
    wilborFeature: "diary",
    wilborCTA: "Registre alimentos e reações no Diary do Wilbor para identificar possíveis alergias.",
    relatedSlugs: ["introducao-alimentar", "bebe-nao-quer-comer"],
    excerpt: "Aprenda a identificar sinais de alergia alimentar e como prevenir reações alérgicas.",
    keywords: ["alergia alimentar bebê", "intolerância alimentar", "alergia leite bebê"],
  },

  // ==========================================
  // CATEGORIA: DESENVOLVIMENTO (6 blogs)
  // ==========================================
  {
    slug: "desenvolvimento-bebe-3-meses",
    title: "Desenvolvimento do bebê aos 3 meses: marcos importantes",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Registre cada marco de desenvolvimento no Diary do Wilbor e acompanhe o progresso.",
    relatedSlugs: ["desenvolvimento-bebe-6-meses", "marcos-desenvolvimento"],
    excerpt: "Aos 3 meses, seu bebê alcança marcos importantes. Saiba quais são e como estimular.",
    keywords: ["desenvolvimento bebê 3 meses", "marcos 3 meses", "bebê 3 meses desenvolvimento"],
  },
  {
    slug: "desenvolvimento-bebe-6-meses",
    title: "Desenvolvimento do bebê aos 6 meses: o que esperar",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Acompanhe o desenvolvimento do seu bebé aos 6 meses no Diary do Wilbor.",
    relatedSlugs: ["desenvolvimento-bebe-3-meses", "desenvolvimento-bebe-12-meses"],
    excerpt: "Aos 6 meses, seu bebê alcança novos marcos. Conheça os principais e como estimular.",
    keywords: ["desenvolvimento bebê 6 meses", "marcos 6 meses", "bebê 6 meses desenvolvimento"],
  },
  {
    slug: "desenvolvimento-bebe-12-meses",
    title: "Desenvolvimento do bebê aos 12 meses: primeiros passos",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Registre os primeiros passos e marcos do seu bebê no Diary do Wilbor.",
    relatedSlugs: ["desenvolvimento-bebe-6-meses", "marcos-desenvolvimento"],
    excerpt: "Aos 12 meses, muitos bebês começam a caminhar. Saiba o que esperar e como ajudar.",
    keywords: ["desenvolvimento bebê 12 meses", "primeiros passos", "bebê 1 ano desenvolvimento"],
  },
  {
    slug: "marcos-desenvolvimento",
    title: "Marcos do desenvolvimento: guia completo de 0 a 12 meses",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Use o Diary do Wilbor para acompanhar todos os marcos de desenvolvimento do seu bebê.",
    relatedSlugs: ["desenvolvimento-bebe-3-meses", "desenvolvimento-bebe-6-meses", "desenvolvimento-bebe-12-meses"],
    excerpt: "Guia completo dos marcos de desenvolvimento esperados de 0 a 12 meses.",
    keywords: ["marcos desenvolvimento", "desenvolvimento bebê", "milestones bebê"],
  },
  {
    slug: "estimulacao-bebe",
    title: "Estimulação do bebê: atividades por idade para desenvolvimento",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Registre as atividades de estimulação no Diary e veja o progresso do seu bebê.",
    relatedSlugs: ["marcos-desenvolvimento", "motricidade-fina"],
    excerpt: "Aprenda atividades de estimulação apropriadas para cada idade do bebê.",
    keywords: ["estimulação bebê", "atividades bebê", "desenvolvimento motor bebê"],
  },
  {
    slug: "motricidade-fina",
    title: "Motricidade fina: desenvolvimento das mãos e dedos do bebê",
    category: "desenvolvimento",
    wilborFeature: "diary",
    wilborCTA: "Acompanhe o desenvolvimento da motricidade fina do seu bebê no Diary do Wilbor.",
    relatedSlugs: ["estimulacao-bebe", "marcos-desenvolvimento"],
    excerpt: "Saiba como o bebê desenvolve a motricidade fina e atividades para estimular.",
    keywords: ["motricidade fina", "desenvolvimento mãos bebê", "coordenação bebê"],
  },

  // ==========================================
  // CATEGORIA: SAÚDE (6 blogs)
  // ==========================================
  {
    slug: "febre-bebe",
    title: "Febre em bebê: quando é perigosa e o que fazer",
    category: "saúde",
    wilborFeature: "panic",
    wilborCTA: "Seu bebê tem febre? Use o Panic Button do Wilbor para respostas instantâneas sobre quando procurar o pediatra.",
    relatedSlugs: ["tosse-bebe", "diarreia-bebe"],
    excerpt: "Aprenda a medir a temperatura do bebê e quando a febre é motivo de preocupação.",
    keywords: ["febre bebê", "febre alta bebê", "quando procurar pediatra febre"],
  },
  {
    slug: "tosse-bebe",
    title: "Tosse em bebê: causas, tipos e quando procurar o pediatra",
    category: "saúde",
    wilborFeature: "diary",
    wilborCTA: "Registre a tosse do seu bebé no Diary do Wilbor para acompanhar a evolução.",
    relatedSlugs: ["febre-bebe", "diarreia-bebe"],
    excerpt: "Conheça os tipos de tosse em bebês e quando procurar ajuda profissional.",
    keywords: ["tosse bebê", "tosse seca bebê", "tosse com catarro bebê"],
  },
  {
    slug: "diarreia-bebe",
    title: "Diarreia em bebê: causas, prevenção e tratamento",
    category: "saúde",
    wilborFeature: "diary",
    wilborCTA: "Registre os sintomas de diarreia no Diary do Wilbor para acompanhar a saúde do seu bebê.",
    relatedSlugs: ["febre-bebe", "constipacao-bebe"],
    excerpt: "Aprenda a identificar diarreia em bebês e como prevenir desidratação.",
    keywords: ["diarreia bebê", "bebê com diarreia", "diarreia infantil"],
  },
  {
    slug: "constipacao-bebe",
    title: "Constipação em bebê: causas, sinais e soluções",
    category: "saúde",
    wilborFeature: "diary",
    wilborCTA: "Registre a frequência de evacuações no Diary do Wilbor para monitorar a constipação.",
    relatedSlugs: ["diarreia-bebe", "alimentacao-bebe"],
    excerpt: "Saiba quando o bebê está constipado e técnicas para aliviar o desconforto.",
    keywords: ["constipação bebê", "bebê preso", "dificuldade para evacuar bebê"],
  },
  {
    slug: "aftas-bebe",
    title: "Aftas em bebê: causas, prevenção e tratamento",
    category: "saúde",
    wilborFeature: "diary",
    wilborCTA: "Registre aftas e outras lesões na boca no Diary do Wilbor.",
    relatedSlugs: ["febre-bebe", "assaduras"],
    excerpt: "Aprenda a identificar e tratar aftas em bebês de forma segura.",
    keywords: ["aftas bebê", "feridas boca bebê", "úlceras bebê"],
  },
  {
    slug: "assaduras",
    title: "Assaduras em bebê: prevenção, tratamento e quando procurar ajuda",
    category: "saúde",
    wilborFeature: "diary",
    wilborCTA: "Registre problemas de pele no Diary do Wilbor para acompanhar a saúde da pele do seu bebê.",
    relatedSlugs: ["higiene-bebe", "febre-bebe"],
    excerpt: "Guia completo para prevenir e tratar assaduras em bebês.",
    keywords: ["assaduras bebê", "dermatite de fralda", "assadura fralda"],
  },

  // ==========================================
  // CATEGORIA: SEGURANÇA (3 blogs)
  // ==========================================
  {
    slug: "seguranca-bebe-casa",
    title: "Segurança do bebê em casa: guia de prevenção de acidentes",
    category: "segurança",
    wilborFeature: "diary",
    wilborCTA: "Use o Diary do Wilbor para registrar e acompanhar a segurança do seu bebê.",
    relatedSlugs: ["sids-prevencao", "quedas-bebe"],
    excerpt: "Aprenda a deixar sua casa segura para o bebê: prevenção de quedas, queimaduras e sufocação.",
    keywords: ["segurança bebê casa", "bebê seguro", "acidentes bebê prevenção"],
  },
  {
    slug: "sids-prevencao",
    title: "SIDS (Síndrome da Morte Súbita): prevenção e fatores de risco",
    category: "segurança",
    wilborFeature: "sleep",
    wilborCTA: "Use o Sleep Tracker do Wilbor para garantir que seu bebê está dormindo de forma segura.",
    relatedSlugs: ["seguranca-bebe-casa", "ambiente-ideal-sono"],
    excerpt: "Conheça os fatores de risco da SIDS e medidas de prevenção essenciais.",
    keywords: ["SIDS", "morte súbita bebê", "prevenção SIDS"],
  },
  {
    slug: "quedas-bebe",
    title: "Quedas em bebê: prevenção, primeiros socorros e quando procurar ajuda",
    category: "segurança",
    wilborFeature: "panic",
    wilborCTA: "Seu bebê caiu? Use o Panic Button do Wilbor para saber quando procurar o hospital.",
    relatedSlugs: ["seguranca-bebe-casa", "febre-bebe"],
    excerpt: "Aprenda a prevenir quedas e saiba como agir em caso de queda do bebê.",
    keywords: ["queda bebê", "bebê caiu", "primeiros socorros queda"],
  },

  // ==========================================
  // CATEGORIA: MATERNA (6 blogs)
  // ==========================================
  {
    slug: "depressao-pos-parto",
    title: "Depressão pós-parto: sinais, prevenção e tratamento",
    category: "materna",
    wilborFeature: "diary",
    wilborCTA: "Use o Diary do Wilbor para registrar seu humor e bem-estar emocional.",
    relatedSlugs: ["ansiedade-materna", "saude-mental-mae"],
    excerpt: "Conheça os sinais da depressão pós-parto e como procurar ajuda.",
    keywords: ["depressão pós-parto", "baby blues", "depressão materna"],
  },
  {
    slug: "ansiedade-materna",
    title: "Ansiedade materna: como lidar com a preocupação excessiva",
    category: "materna",
    wilborFeature: "diary",
    wilborCTA: "Registre seus sentimentos e preocupações no Diary do Wilbor para acompanhar sua saúde mental.",
    relatedSlugs: ["depressao-pos-parto", "saude-mental-mae"],
    excerpt: "Aprenda técnicas para lidar com a ansiedade materna e quando procurar ajuda.",
    keywords: ["ansiedade materna", "preocupação excessiva", "ansiedade pós-parto"],
  },
  {
    slug: "recuperacao-pos-parto",
    title: "Recuperação pós-parto: o que esperar nos primeiros 40 dias",
    category: "materna",
    wilborFeature: "diary",
    wilborCTA: "Registre sua recuperação no Diary do Wilbor para acompanhar a cicatrização.",
    relatedSlugs: ["saude-mental-mae", "amamentacao-materna"],
    excerpt: "Guia completo sobre a recuperação física e emocional após o parto.",
    keywords: ["recuperação pós-parto", "pós-parto", "resguardo"],
  },
  {
    slug: "amamentacao-materna",
    title: "Amamentação e saúde materna: benefícios e desafios",
    category: "materna",
    wilborFeature: "feeding",
    wilborCTA: "Use o Feeding Tracker do Wilbor para acompanhar a amamentação e sua saúde.",
    relatedSlugs: ["amamentacao-dificuldades", "recuperacao-pos-parto"],
    excerpt: "Conheça os benefícios da amamentação para você e seu bebê.",
    keywords: ["amamentação saúde", "benefícios amamentação", "amamentação materna"],
  },
  {
    slug: "saude-mental-mae",
    title: "Saúde mental da mãe: autocuidado e quando procurar ajuda",
    category: "materna",
    wilborFeature: "diary",
    wilborCTA: "Use o Diary do Wilbor para acompanhar seu bem-estar emocional.",
    relatedSlugs: ["depressao-pos-parto", "ansiedade-materna"],
    excerpt: "Aprenda a cuidar da sua saúde mental enquanto cuida do seu bebê.",
    keywords: ["saúde mental mãe", "bem-estar materna", "autocuidado mãe"],
  },
  {
    slug: "cuidados-mae",
    title: "Cuidados com a mãe: higiene, alimentação e exercício pós-parto",
    category: "materna",
    wilborFeature: "diary",
    wilborCTA: "Registre seus cuidados de saúde no Diary do Wilbor.",
    relatedSlugs: ["recuperacao-pos-parto", "saude-mental-mae"],
    excerpt: "Guia prático de cuidados essenciais para a mãe no pós-parto.",
    keywords: ["cuidados pós-parto", "higiene pós-parto", "exercício pós-parto"],
  },

  // ==========================================
  // CATEGORIA: VACINAS (3 blogs)
  // ==========================================
  {
    slug: "calendario-vacinas",
    title: "Calendário de vacinação: guia completo de 0 a 12 meses",
    category: "vacinas",
    wilborFeature: "diary",
    wilborCTA: "Registre as vacinas do seu bebê no Diary do Wilbor para não perder nenhuma.",
    relatedSlugs: ["efeitos-colaterais-vacinas", "mitos-vacinas"],
    excerpt: "Conheça o calendário de vacinação recomendado pela SBP e OMS.",
    keywords: ["calendário vacinas", "vacinação bebê", "vacinas por idade"],
  },
  {
    slug: "efeitos-colaterais-vacinas",
    title: "Efeitos colaterais das vacinas: o que é normal e quando procurar ajuda",
    category: "vacinas",
    wilborFeature: "diary",
    wilborCTA: "Registre qualquer reação após vacinação no Diary do Wilbor.",
    relatedSlugs: ["calendario-vacinas", "febre-bebe"],
    excerpt: "Aprenda a diferenciar reações normais de reações graves às vacinas.",
    keywords: ["efeitos colaterais vacina", "reação vacina", "febre após vacina"],
  },
  {
    slug: "mitos-vacinas",
    title: "Mitos sobre vacinas: o que é verdade e o que é mentira",
    category: "vacinas",
    wilborFeature: "diary",
    wilborCTA: "Use o Diary do Wilbor para acompanhar a vacinação do seu bebê com segurança.",
    relatedSlugs: ["calendario-vacinas", "efeitos-colaterais-vacinas"],
    excerpt: "Descubra a verdade por trás dos mitos mais comuns sobre vacinas.",
    keywords: ["mitos vacinas", "vacinas seguras", "autismo vacina"],
  },

  // ==========================================
  // CATEGORIA: CÓLICA (1 blog)
  // ==========================================
  {
    slug: "colica-do-bebe",
    title: "Cólica do bebê: o que fazer para aliviar (guia prático)",
    category: "cólica",
    wilborFeature: "panic",
    wilborCTA: "Seu bebê tem cólica? Use o Panic Button do Wilbor para respostas instantâneas e técnicas de alívio.",
    relatedSlugs: ["bebe-nao-dorme", "desenvolvimento-bebe-3-meses"],
    excerpt: "Técnicas comprovadas para aliviar a cólica: massagem Shantala, posição aviãozinho, swaddle e mais.",
    keywords: ["cólica do bebê", "bebê com cólica", "como aliviar cólica", "massagem para cólica"],
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getBlogBySlug(slug: string): IntelligentBlogArticle | undefined {
  return INTELLIGENT_BLOGS.find(blog => blog.slug === slug);
}

export function getBlogsByCategory(category: string): IntelligentBlogArticle[] {
  return INTELLIGENT_BLOGS.filter(blog => blog.category === category);
}

export function getRelatedBlogs(slug: string): IntelligentBlogArticle[] {
  const blog = getBlogBySlug(slug);
  if (!blog || !blog.relatedSlugs) return [];
  return blog.relatedSlugs
    .map(relatedSlug => getBlogBySlug(relatedSlug))
    .filter((blog): blog is IntelligentBlogArticle => blog !== undefined);
}

export function getAllCategories(): string[] {
  const categories = new Set(INTELLIGENT_BLOGS.map(blog => blog.category));
  return Array.from(categories);
}

export function searchBlogs(query: string): IntelligentBlogArticle[] {
  const lowerQuery = query.toLowerCase();
  return INTELLIGENT_BLOGS.filter(blog =>
    blog.title.toLowerCase().includes(lowerQuery) ||
    blog.excerpt.toLowerCase().includes(lowerQuery) ||
    blog.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
  );
}
