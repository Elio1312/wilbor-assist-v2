/**
 * Recipe Data - 55+ receitas originais extraídas do backup
 */

export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  nutritionalBenefits: string;
  imageUrl: string;
  isPremium: boolean;
}

export const recipesData: Recipe[] = [
  {
    "id": 1,
    "slug": "arroz-feijo-preto-carne-moda-abbora",
    "title": "Arroz + Feijão Preto + Carne Moída + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "feijão preto",
      "carne moída",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/HdFRUcOhtKvszIys.png",
    "isPremium": false
  },
  {
    "id": 2,
    "slug": "arroz-lentilha-frango-desfiado-brcolis",
    "title": "Arroz + Lentilha + Frango Desfiado + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "lentilha",
      "frango desfiado",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/sMeQAkvcQIAvlxFW.png",
    "isPremium": false
  },
  {
    "id": 3,
    "slug": "batata-doce-feijo-carioca-peixe-sem-espinha-cenoura",
    "title": "Batata Doce + Feijão Carioca + Peixe Sem Espinha + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "batata doce",
      "feijão carioca",
      "peixe sem espinha",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/lYfVzYLfEcAMhdGj.png",
    "isPremium": false
  },
  {
    "id": 4,
    "slug": "mandioca-gro-de-bico-ovo-cozido-espinafre",
    "title": "Mandioca + Grão-de-bico + Ovo Cozido + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "mandioca",
      "grão-de-bico",
      "ovo cozido",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/ecwfUyskFLCUwpvG.png",
    "isPremium": true
  },
  {
    "id": 5,
    "slug": "milho-feijo-branco-carne-desfiada-abobrinha",
    "title": "Milho + Feijão Branco + Carne Desfiada + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "milho",
      "feijão branco",
      "carne desfiada",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/MDBaYjTCbLiQwLCx.png",
    "isPremium": true
  },
  {
    "id": 6,
    "slug": "macarro-integral-lentilha-frango-desfiado-chuchu",
    "title": "Macarrão Integral + Lentilha + Frango Desfiado + Chuchu",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "macarrão integral",
      "lentilha",
      "frango desfiado",
      "chuchu"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/oFchqkfhqMtIkkFk.png",
    "isPremium": true
  },
  {
    "id": 7,
    "slug": "inhame-feijo-preto-peru-desfiado-couve",
    "title": "Inhame + Feijão Preto + Peru Desfiado + Couve",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "inhame",
      "feijão preto",
      "peru desfiado",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/HihmDRWfPaqRcHwm.png",
    "isPremium": true
  },
  {
    "id": 8,
    "slug": "quinoa-gro-de-bico-carne-moda-beterraba",
    "title": "Quinoa + Grão-de-bico + Carne Moída + Beterraba",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "grão-de-bico",
      "carne moída",
      "beterraba"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/LammEbVVwhkVJpkk.png",
    "isPremium": true
  },
  {
    "id": 9,
    "slug": "car-lentilha-ovo-cozido-abbora",
    "title": "Cará + Lentilha + Ovo Cozido + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cará",
      "lentilha",
      "ovo cozido",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/lnkBxjOmuYEmfjsY.png",
    "isPremium": true
  },
  {
    "id": 10,
    "slug": "cuscuz-feijo-carioca-frango-desfiado-brcolis",
    "title": "Cuscuz + Feijão Carioca + Frango Desfiado + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cuscuz",
      "feijão carioca",
      "frango desfiado",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/WovGoXkhNQSNBGaJ.png",
    "isPremium": true
  },
  {
    "id": 11,
    "slug": "arroz-feijo-branco-patinho-desfiado-cenoura",
    "title": "Arroz + Feijão Branco + Patinho Desfiado + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "feijão branco",
      "patinho desfiado",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/eGLbdmCmDIsvcVyh.png",
    "isPremium": true
  },
  {
    "id": 12,
    "slug": "batata-inglesa-lentilha-peixe-sem-espinha-espinafre",
    "title": "Batata Inglesa + Lentilha + Peixe Sem Espinha + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "batata inglesa",
      "lentilha",
      "peixe sem espinha",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/ZzgTNBqzPMkpvSVG.png",
    "isPremium": true
  },
  {
    "id": 13,
    "slug": "mandioca-feijo-preto-frango-desfiado-abobrinha",
    "title": "Mandioca + Feijão Preto + Frango Desfiado + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "mandioca",
      "feijão preto",
      "frango desfiado",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/zjTHOWVlQyohacFv.png",
    "isPremium": true
  },
  {
    "id": 14,
    "slug": "macarro-integral-gro-de-bico-carne-moda-couve",
    "title": "Macarrão Integral + Grão-de-bico + Carne Moída + Couve",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "macarrão integral",
      "grão-de-bico",
      "carne moída",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/IMpAXVyJWJUFHjMg.png",
    "isPremium": true
  },
  {
    "id": 15,
    "slug": "milho-lentilha-peru-desfiado-chuchu",
    "title": "Milho + Lentilha + Peru Desfiado + Chuchu",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "milho",
      "lentilha",
      "peru desfiado",
      "chuchu"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/gLioSwWwMAVBGkBx.png",
    "isPremium": true
  },
  {
    "id": 16,
    "slug": "quinoa-feijo-branco-ovo-cozido-abbora",
    "title": "Quinoa + Feijão Branco + Ovo Cozido + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "feijão branco",
      "ovo cozido",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/PbAoYOHHEqddxLeO.png",
    "isPremium": true
  },
  {
    "id": 17,
    "slug": "car-feijo-carioca-carne-moda-espinafre",
    "title": "Cará + Feijão Carioca + Carne Moída + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cará",
      "feijão carioca",
      "carne moída",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/bpxYOqnbShAIkPff.png",
    "isPremium": true
  },
  {
    "id": 18,
    "slug": "inhame-gro-de-bico-frango-desfiado-cenoura",
    "title": "Inhame + Grão-de-bico + Frango Desfiado + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "inhame",
      "grão-de-bico",
      "frango desfiado",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/mQxMIfGqQoNtmSTY.png",
    "isPremium": true
  },
  {
    "id": 19,
    "slug": "cuscuz-lentilha-peixe-sem-espinha-abobrinha",
    "title": "Cuscuz + Lentilha + Peixe Sem Espinha + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cuscuz",
      "lentilha",
      "peixe sem espinha",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/MJfLNoIXlXFEosKU.png",
    "isPremium": true
  },
  {
    "id": 20,
    "slug": "arroz-feijo-preto-ovo-cozido-brcolis",
    "title": "Arroz + Feijão Preto + Ovo Cozido + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "feijão preto",
      "ovo cozido",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/LZPnMpnORLRXjCEh.png",
    "isPremium": true
  },
  {
    "id": 21,
    "slug": "fgado-de-boi-ralado-arroz-lentilha-batata-doce",
    "title": "Fígado de Boi Ralado + Arroz + Lentilha + Batata Doce",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Fígado é riquíssimo em ferro, essencial a partir dos 6 meses. Introduza...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "fígado de boi",
      "arroz",
      "lentilha",
      "batata doce"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "Fígado cozido e ralado finamente (se mistura aos outros alimentos). 6 meses: ralado fino misturado ao arroz. 9 meses+: picado em pedacinhos pequenos.",
      "Fígado deve ser bem cozido e ralado fino. Nunca oferecer em pedaços grandes. Supervisionar durante toda a refeição."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Fígado é riquíssimo em ferro, essencial a partir dos 6 meses. Introduza em pequenas porções. Supervisione sempre.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/vRHMvgvEsSsAuhTy.png",
    "isPremium": true
  },
  {
    "id": 22,
    "slug": "mandioca-feijo-branco-carne-moda-espinafre",
    "title": "Mandioca + Feijão Branco + Carne Moída + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "mandioca",
      "feijão branco",
      "carne moída",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/kqYzDHeDNYPSFVfr.png",
    "isPremium": true
  },
  {
    "id": 23,
    "slug": "macarro-curto-gro-de-bico-peru-desfiado-abbora",
    "title": "Macarrão (Curto) + Grão-de-bico + Peru Desfiado + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "macarrão curto",
      "grão-de-bico",
      "peru desfiado",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/juJTAPDcTNZKfNip.png",
    "isPremium": true
  },
  {
    "id": 24,
    "slug": "milho-feijo-carioca-ovo-cozido-couve",
    "title": "Milho + Feijão Carioca + Ovo Cozido + Couve",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "milho",
      "feijão carioca",
      "ovo cozido",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/RKsvhfzFwjgSQTwo.png",
    "isPremium": true
  },
  {
    "id": 25,
    "slug": "inhame-lentilha-peixe-sem-espinha-beterraba",
    "title": "Inhame + Lentilha + Peixe Sem Espinha + Beterraba",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "inhame",
      "lentilha",
      "peixe sem espinha",
      "beterraba"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/ztRktvvvBeUaPhIc.png",
    "isPremium": true
  },
  {
    "id": 26,
    "slug": "quinoa-feijo-preto-carne-moda-brcolis",
    "title": "Quinoa + Feijão Preto + Carne Moída + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "feijão preto",
      "carne moída",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/aYYreKHlywOcMhXi.png",
    "isPremium": true
  },
  {
    "id": 27,
    "slug": "lombo-suno-desfiado-feijo-branco-mandioca-cenoura",
    "title": "Lombo Suíno Desfiado + Feijão Branco + Mandioca + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Lombo suíno é proteína magra e saborosa. Cozinhar bem na pressão. Super...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "lombo suíno",
      "feijão branco",
      "mandioca",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "Lombo cozido na pressão até desmanchar, desfiado em fios curtíssimos. 6 meses: desfiado fino. 9 meses+: em tiras macias para BLW.",
      "Lombo deve ser cozido até ficar muito macio. Desfiar em fios curtos. Mandioca em bastões macios. Supervisionar sempre."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Lombo suíno é proteína magra e saborosa. Cozinhar bem na pressão. Supervisione durante toda a refeição.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/LkbAafTfRRZXhTla.png",
    "isPremium": true
  },
  {
    "id": 28,
    "slug": "arroz-gro-de-bico-ovo-cozido-espinafre",
    "title": "Arroz + Grão-de-bico + Ovo Cozido + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "grão-de-bico",
      "ovo cozido",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/woNDfLppKLXVkwiV.png",
    "isPremium": true
  },
  {
    "id": 29,
    "slug": "batata-inglesa-feijo-preto-carne-moda-abbora",
    "title": "Batata Inglesa + Feijão Preto + Carne Moída + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "batata inglesa",
      "feijão preto",
      "carne moída",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/dbjvWrGRDfzFigHM.png",
    "isPremium": true
  },
  {
    "id": 30,
    "slug": "cuscuz-lentilha-frango-desfiado-abobrinha",
    "title": "Cuscuz + Lentilha + Frango Desfiado + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cuscuz",
      "lentilha",
      "frango desfiado",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/LpsmuZpwUOwAyziB.png",
    "isPremium": true
  },
  {
    "id": 31,
    "slug": "quinoa-feijo-carioca-peixe-sem-espinha-cenoura",
    "title": "Quinoa + Feijão Carioca + Peixe Sem Espinha + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "feijão carioca",
      "peixe sem espinha",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/MGSAEZWFvWVocasX.png",
    "isPremium": true
  },
  {
    "id": 32,
    "slug": "inhame-gro-de-bico-carne-moda-couve",
    "title": "Inhame + Grão-de-bico + Carne Moída + Couve",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "inhame",
      "grão-de-bico",
      "carne moída",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/nrRLMjxdRSvKfrWl.png",
    "isPremium": true
  },
  {
    "id": 33,
    "slug": "milho-lentilha-ovo-cozido-espinafre",
    "title": "Milho + Lentilha + Ovo Cozido + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "milho",
      "lentilha",
      "ovo cozido",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/sAJFxFEuViBsDWWI.png",
    "isPremium": true
  },
  {
    "id": 34,
    "slug": "arroz-feijo-branco-peru-desfiado-abbora",
    "title": "Arroz + Feijão Branco + Peru Desfiado + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "feijão branco",
      "peru desfiado",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/jacSvlMJsrqzvIgI.png",
    "isPremium": true
  },
  {
    "id": 35,
    "slug": "fil-de-tilpia-no-vapor-quinoa-ervilha-abbora",
    "title": "Filé de Tilápia no Vapor + Quinoa + Ervilha + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Tilápia é peixe branco de fácil digestão. Quinoa exige mais digestão, p...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "filé de tilápia",
      "quinoa",
      "ervilha",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "Peixe em lascas grandes (BLW) ou levemente amassado. 8 meses: amassado com garfo. 9 meses+: lascas grandes para o bebê segurar.",
      "Verificar cuidadosamente se não há espinhas. Oferecer em lascas macias. Ervilha: amassar levemente para evitar engasgo. Supervisionar sempre."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Tilápia é peixe branco de fácil digestão. Quinoa exige mais digestão, por isso a partir de 8 meses. Supervisione sempre.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/siozbROBvqOOftVl.png",
    "isPremium": true
  },
  {
    "id": 36,
    "slug": "car-feijo-preto-carne-moda-cenoura",
    "title": "Cará + Feijão Preto + Carne Moída + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 6 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 6,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cará",
      "feijão preto",
      "carne moída",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/QHetunGOCyqAWmez.png",
    "isPremium": true
  },
  {
    "id": 37,
    "slug": "batata-doce-gro-de-bico-ovo-cozido-abobrinha",
    "title": "Batata Doce + Grão-de-bico + Ovo Cozido + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "batata doce",
      "grão-de-bico",
      "ovo cozido",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/AkxycFmzKiYkvVrG.png",
    "isPremium": true
  },
  {
    "id": 38,
    "slug": "macarro-curto-feijo-carioca-peixe-sem-espinha-espinafre",
    "title": "Macarrão (Curto) + Feijão Carioca + Peixe Sem Espinha + Espinafre",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "macarrão curto",
      "feijão carioca",
      "peixe sem espinha",
      "espinafre"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/BhfTIeywRGjuvcxo.png",
    "isPremium": true
  },
  {
    "id": 39,
    "slug": "quinoa-lentilha-carne-moda-abbora",
    "title": "Quinoa + Lentilha + Carne Moída + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "lentilha",
      "carne moída",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/gVdcUsVYFYRaUgoI.png",
    "isPremium": true
  },
  {
    "id": 40,
    "slug": "cuscuz-feijo-branco-frango-desfiado-beterraba",
    "title": "Cuscuz + Feijão Branco + Frango Desfiado + Beterraba",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cuscuz",
      "feijão branco",
      "frango desfiado",
      "beterraba"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/KVybKYZLPONTIYbY.png",
    "isPremium": true
  },
  {
    "id": 41,
    "slug": "arroz-gro-de-bico-peru-desfiado-cenoura",
    "title": "Arroz + Grão-de-bico + Peru Desfiado + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "grão-de-bico",
      "peru desfiado",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/qAbTgLgshHCWjjUl.png",
    "isPremium": true
  },
  {
    "id": 42,
    "slug": "batata-inglesa-feijo-preto-ovo-cozido-couve",
    "title": "Batata Inglesa + Feijão Preto + Ovo Cozido + Couve",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "batata inglesa",
      "feijão preto",
      "ovo cozido",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/pKLvFEscAOMUVVPV.png",
    "isPremium": true
  },
  {
    "id": 43,
    "slug": "inhame-lentilha-carne-moda-abobrinha",
    "title": "Inhame + Lentilha + Carne Moída + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "inhame",
      "lentilha",
      "carne moída",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/HjkvNRfaJAazaled.png",
    "isPremium": true
  },
  {
    "id": 44,
    "slug": "tofu-grelhado-gro-de-bico-arroz-integral-brcolis",
    "title": "Tofu Grelhado + Grão-de-bico + Arroz Integral + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Opção vegana rica em proteína. Grão-de-bico e tofu a partir de 8 meses....",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "tofu",
      "grão-de-bico",
      "arroz integral",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "Tofu em bastões firmes para o bebê segurar. Grão-de-bico: sem casca e amassado. 8 meses: tofu amassado + grão-de-bico sem casca. 9 meses+: bastões de tofu para BLW.",
      "Tofu em bastões do tamanho do dedo adulto. Grão-de-bico: retirar casca e amassar levemente. Brócolis em floretes macios. Supervisionar sempre."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Opção vegana rica em proteína. Grão-de-bico e tofu a partir de 8 meses. Supervisione durante toda a refeição.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/RMxzZyTpRoXCxBvN.png",
    "isPremium": true
  },
  {
    "id": 45,
    "slug": "macarro-curto-feijo-branco-peixe-sem-espinha-cenoura",
    "title": "Macarrão (Curto) + Feijão Branco + Peixe Sem Espinha + Cenoura",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "macarrão curto",
      "feijão branco",
      "peixe sem espinha",
      "cenoura"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/BkYGlPSuZLHWLsHE.png",
    "isPremium": true
  },
  {
    "id": 46,
    "slug": "quinoa-gro-de-bico-ovo-cozido-brcolis",
    "title": "Quinoa + Grão-de-bico + Ovo Cozido + Brócolis",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "quinoa",
      "grão-de-bico",
      "ovo cozido",
      "brócolis"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/CxFJjtWbwfVTOPqg.png",
    "isPremium": true
  },
  {
    "id": 47,
    "slug": "car-lentilha-peru-desfiado-abbora",
    "title": "Cará + Lentilha + Peru Desfiado + Abóbora",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "cará",
      "lentilha",
      "peru desfiado",
      "abóbora"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/lnkBxjOmuYEmfjsY.png",
    "isPremium": true
  },
  {
    "id": 48,
    "slug": "mandioca-feijo-preto-carne-moda-beterraba",
    "title": "Mandioca + Feijão Preto + Carne Moída + Beterraba",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "mandioca",
      "feijão preto",
      "carne moída",
      "beterraba"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/BPgaHJLqdUNLXRwa.png",
    "isPremium": true
  },
  {
    "id": 49,
    "slug": "arroz-lentilha-ovo-cozido-abobrinha",
    "title": "Arroz + Lentilha + Ovo Cozido + Abobrinha",
    "description": "Receita nutritiva para bebês a partir de 8 meses. Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de c...",
    "minAgeMonths": 8,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "arroz",
      "lentilha",
      "ovo cozido",
      "abobrinha"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "• 6 meses: amasse com garfo\n• 9 meses: pique pequeno\n• 12 meses+: consistência da família",
      "Oferecer alimentos macios. Cortar em cubos pequenos ou tiras grossas macias (formato dedo adulto) para BLW. Sempre supervisionar."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Supervisione durante toda a refeição. Introduza novos alimentos um de cada vez.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/izhZdnzaIpOmVJQo.png",
    "isPremium": true
  },
  {
    "id": 50,
    "slug": "moela-de-frango-picadinha-cuscuz-feijo-preto-couve",
    "title": "Moela de Frango Picadinha + Cuscuz + Feijão Preto + Couve",
    "description": "Receita nutritiva para bebês a partir de 9 meses. Não adicionar sal ou açúcar. Moela é extremamente nutritiva e rica em ferro. Cuscuz contém glúten, p...",
    "minAgeMonths": 9,
    "maxAgeMonths": 36,
    "category": "meal",
    "ingredients": [
      "moela de frango",
      "cuscuz",
      "feijão preto",
      "couve"
    ],
    "instructions": [
      "Cozinhe os alimentos até ficarem macios, sem adição de sal. Separe no prato para o bebê identificar os sabores. Ajuste a textura conforme a idade.",
      "Moela cozida exaustivamente e picada em cubinhos mínimos (2mm). 9 meses: cubinhos mínimos bem cozidos. 12 meses+: pedaços um pouco maiores para treinar mastigação.",
      "Moela deve ser cozida por tempo prolongado até ficar muito macia. Picar em cubinhos de no máximo 2mm. Cuscuz em porções pequenas. Supervisionar sempre."
    ],
    "nutritionalBenefits": "Não adicionar sal ou açúcar. Moela é extremamente nutritiva e rica em ferro. Cuscuz contém glúten, por isso a partir de 9 meses. Supervisione sempre.",
    "imageUrl": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/yUXRZnMxeZKNPHgO.png",
    "isPremium": true
  }
];
