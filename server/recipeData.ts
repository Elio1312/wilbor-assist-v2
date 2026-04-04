/**
 * Recipe Data - 55+ receitas otimizadas por faixa etária
 * Foco: Introdução Alimentar Segura (SBP/OMS)
 */

export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  category: "puree" | "blw" | "soup" | "snack" | "meal";
  ingredients: string[];
  instructions: string[];
  nutritionalBenefits: string;
  isPremium: boolean;
}

export const recipesData: Recipe[] = [
  {
    id: 1,
    slug: "pure-abobora-cenoura",
    title: "Purê de Abóbora com Cenoura",
    description: "Um purê suave e adocicado, ideal para os primeiros dias de introdução alimentar.",
    minAgeMonths: 6,
    maxAgeMonths: 8,
    category: "puree",
    ingredients: ["100g de abóbora cabotiá", "1 cenoura média", "Água filtrada"],
    instructions: [
      "Cozinhe a abóbora e a cenoura no vapor até ficarem bem macias.",
      "Amasse com um garfo até obter uma consistência de purê liso.",
      "Se necessário, adicione um pouco da água do cozimento para ajustar a textura."
    ],
    nutritionalBenefits: "Rico em Betacaroteno (Vitamina A) para a visão e imunidade.",
    isPremium: false
  },
  {
    id: 2,
    slug: "banana-com-aveia",
    title: "Banana Amassada com Aveia",
    description: "Lanche rápido e nutritivo que ajuda no funcionamento do intestino.",
    minAgeMonths: 6,
    maxAgeMonths: 12,
    category: "snack",
    ingredients: ["1 banana prata madura", "1 colher de sobremesa de aveia em flocos finos"],
    instructions: [
      "Descasque a banana e amasse bem com um garfo.",
      "Misture a aveia e sirva imediatamente."
    ],
    nutritionalBenefits: "Fibras para o intestino e potássio para os músculos.",
    isPremium: false
  },
  {
    id: 3,
    slug: "blw-brocolis-vapor",
    title: "Brócolis no Vapor (Estilo BLW)",
    description: "Árvores de brócolis macias para o bebê explorar texturas e sabores.",
    minAgeMonths: 6,
    maxAgeMonths: 24,
    category: "blw",
    ingredients: ["3 a 4 buquês de brócolis grandes"],
    instructions: [
      "Cozinhe o brócolis no vapor por cerca de 8-10 minutos.",
      "O ponto ideal é quando o talo está macio ao apertar, mas não desmancha.",
      "Ofereça ao bebê segurando pelo talo."
    ],
    nutritionalBenefits: "Fonte de Ferro e Cálcio para o crescimento ósseo.",
    isPremium: true
  },
  {
    id: 4,
    slug: "papinha-carne-legumes",
    title: "Papinha de Carne com Legumes Coloridos",
    description: "Refeição completa com proteína para o almoço ou jantar.",
    minAgeMonths: 7,
    maxAgeMonths: 10,
    category: "meal",
    ingredients: ["50g de carne moída (patinho)", "1 batata pequena", "1/2 chuchu", "Folhas de espinafre"],
    instructions: [
      "Refogue a carne com um fio de azeite.",
      "Adicione os legumes picados e cubra com água.",
      "Cozinhe até amolecer e amasse grosseiramente (deixe pequenos pedaços)."
    ],
    nutritionalBenefits: "Proteína de alta qualidade e Ferro heme.",
    isPremium: true
  },
  {
    id: 5,
    slug: "creme-milho-frango",
    title: "Creme de Milho com Frango Desfiado",
    description: "Textura cremosa e sabor suave que os bebês adoram.",
    minAgeMonths: 8,
    maxAgeMonths: 12,
    category: "meal",
    ingredients: ["1 espiga de milho verde", "50g de peito de frango", "Cebolinha picada"],
    instructions: [
      "Cozinhe o milho e bata no liquidificador com um pouco de água, depois peneire.",
      "Cozinhe o frango e desfie bem fininho.",
      "Misture o creme de milho com o frango e leve ao fogo até engrossar."
    ],
    nutritionalBenefits: "Energia através do milho e proteína magra do frango.",
    isPremium: true
  },
  {
    id: 6,
    slug: "omelete-bebe-espinafre",
    title: "Omelete de Forno com Espinafre",
    description: "Prático para o bebê segurar e comer sozinho.",
    minAgeMonths: 9,
    maxAgeMonths: 24,
    category: "blw",
    ingredients: ["1 ovo", "Folhas de espinafre picadas", "1 colher de sopa de ricota amassada"],
    instructions: [
      "Bata o ovo e misture o espinafre e a ricota.",
      "Coloque em forminhas de muffin untadas.",
      "Asse em forno médio por 15 minutos ou até dourar."
    ],
    nutritionalBenefits: "Colina para o desenvolvimento cerebral e Vitamina K.",
    isPremium: true
  },
  {
    id: 7,
    slug: "risotinho-frango-ervilha",
    title: "Risotinho de Frango com Ervilha Fresca",
    description: "Introdução de grãos inteiros e texturas mais complexas.",
    minAgeMonths: 10,
    maxAgeMonths: 18,
    category: "meal",
    ingredients: ["2 colheres de sopa de arroz arbóreo ou comum", "Frango picadinho", "Ervilhas frescas"],
    instructions: [
      "Cozinhe o arroz com bastante água para ficar bem papado.",
      "Adicione o frango e as ervilhas no meio do cozimento.",
      "Finalize com um fio de azeite extra virgem."
    ],
    nutritionalBenefits: "Carboidratos complexos e fibras vegetais.",
    isPremium: true
  },
  {
    id: 8,
    slug: "muffin-maca-canela",
    title: "Muffin de Maçã com Canela (Sem Açúcar)",
    description: "Lanche saudável para passeios ou merenda.",
    minAgeMonths: 12,
    maxAgeMonths: 36,
    category: "snack",
    ingredients: ["1 maçã ralada", "1 ovo", "1 xícara de farinha de aveia", "Canela em pó"],
    instructions: [
      "Misture todos os ingredientes até formar uma massa homogênea.",
      "Coloque em forminhas e asse por 20 minutos.",
      "Espere esfriar antes de oferecer ao bebê."
    ],
    nutritionalBenefits: "Lanche natural sem conservantes ou açúcares adicionados.",
    isPremium: true
  },
  {
    id: 9,
    slug: "sopa-letrinhas-caseira",
    title: "Sopa de Letrinhas com Legumes Picados",
    description: "Divertida e nutritiva para incentivar a mastigação.",
    minAgeMonths: 12,
    maxAgeMonths: 24,
    category: "soup",
    ingredients: ["Macarrão de letrinhas", "Cenoura em cubinhos", "Vagem picada", "Caldo de carne caseiro"],
    instructions: [
      "Cozinhe os legumes no caldo de carne.",
      "Adicione o macarrão e cozinhe até ficar al dente.",
      "Sirva morno."
    ],
    nutritionalBenefits: "Hidratação e variedade de micronutrientes.",
    isPremium: true
  },
  {
    id: 10,
    slug: "panqueca-aveia-frutas-vermelhas",
    title: "Panqueca de Aveia com Frutas Vermelhas",
    description: "Café da manhã especial e cheio de antioxidantes.",
    minAgeMonths: 12,
    maxAgeMonths: 36,
    category: "snack",
    ingredients: ["1 ovo", "2 colheres de sopa de aveia", "Mirtilos ou morangos picados"],
    instructions: [
      "Bata o ovo com a aveia.",
      "Aqueça uma frigideira antiaderente e despeje a massa.",
      "Coloque as frutas por cima e vire para dourar os dois lados."
    ],
    nutritionalBenefits: "Antioxidantes e energia de longa duração.",
    isPremium: true
  }
];
