/**
 * AAP/CDC Content Adapter for US Market
 * Replaces SBP references with American Academy of Pediatrics guidelines
 */

// AAP-specific content for US market
export const AAP_CONTENT = {
  // Vaccination schedules
  vaccination: {
    en: {
      title: "Vaccination Schedule",
      source: "CDC/AAP Recommendations",
      notice: "Follow your pediatrician and your state's immunization schedule. The CDC and AAP recommend the following key vaccines:",
      vaccines: [
        { month: "Birth", vaccine: "Hepatitis B (1st dose)", notes: "Within 24 hours of birth" },
        { month: "2 months", vaccine: "DTaP, Hib, IPV, PCV13, Rotavirus (2nd dose)", notes: "Combo vaccines may be used" },
        { month: "4 months", vaccine: "DTaP, Hib, IPV, PCV13, Rotavirus (3rd dose)", notes: "" },
        { month: "6 months", vaccine: "Hepatitis B, DTaP, Hib, IPV, PCV13, Rotavirus, Flu", notes: "Annual flu vaccine recommended" },
        { month: "12 months", vaccine: "Hepatitis A (1st dose), MMR, Varicella, PCV13 (4th dose)", notes: "" },
        { month: "15 months", vaccine: "Hib (4th dose), DTaP (4th dose)", notes: "" },
        { month: "18 months", vaccine: "Hepatitis A (2nd dose)", notes: "6 months after 1st dose" },
        { month: "4-6 years", vaccine: "DTaP, IPV, MMR, Varicella", notes: "Before school entry" }
      ],
      disclaimer: "This is a simplified schedule. Your pediatrician may recommend a different schedule based on your child's health."
    },
    pt: {
      title: "Calendário de Vacinação",
      source: "Sociedade Brasileira de Pediatria / Ministério da Saúde",
      notice: "Siga sempre o calendário do Programa Nacional de Imunizações (PNI) e as orientações do seu pediatra.",
      vaccines: [
        { month: "Ao nascer", vaccine: "BCG, Hepatite B (1ª dose)", notes: "" },
        { month: "2 meses", vaccine: "VIP, VORH, Pentavalente, Pneumocócica", notes: "" },
        { month: "3 meses", vaccine: "Meningocócica C", notes: "" },
        { month: "4 meses", vaccine: "VIP, VORH, Pentavalente, Pneumocócica", notes: "" },
        { month: "5 meses", vaccine: "Meningocócica C", notes: "" },
        { month: "6 meses", vaccine: "Hepatite B, Pentavalente, Poliomielite", notes: "" },
        { month: "9 meses", vaccine: "Sarampo (1ª dose)", notes: "Vacina SRP" },
        { month: "12 meses", vaccine: "Pneumocócica, Meningocócica C, Sarampo", notes: "" },
        { month: "15 meses", vaccine: "Hepatite A, Varicela, Tetra viral", notes: "" },
        { month: "18 meses", vaccine: "Pentavalente, Poliomielite", notes: "" },
        { month: "4 anos", vaccine: "Poliomielite, DTP, Sarampo", notes: "Antes da escola" }
      ],
      disclaimer: "Calendário simplificado. Seu pediatra pode recomendar um calendário diferente."
    }
  },

  // Sleep recommendations
  sleep: {
    en: {
      title: "Safe Sleep - AAP Guidelines",
      source: "American Academy of Pediatrics",
      recommendations: [
        "Always place babies on their back for every sleep until 1 year old",
        "Use a firm, flat sleep surface covered by a fitted sheet",
        "Keep soft objects, bedding, and loose items out of the sleep area",
        "Room-sharing without bed-sharing is recommended for at least the first 6 months",
        "Avoid wedge pillows, positioners, and bouncer devices for sleep",
        "Offer a pacifier at naptime and bedtime",
        "Avoid overheating - keep room at comfortable temperature (68-72°F)",
        "Breastfeeding is associated with reduced SIDS risk"
      ],
      donts: [
        "Don't place baby on soft surfaces (couches, armchairs)",
        "Don't share sleep surfaces with baby",
        "Don't use loose blankets, bumpers, or soft toys in crib",
        "Don't smoke, drink alcohol, or use drugs during pregnancy"
      ],
      citation: "Source: AAP Safe Sleep Guidelines 2022"
    },
    pt: {
      title: "Sono Seguro",
      source: "Sociedade Brasileira de Pediatria",
      recommendations: [
        "Sempre coloque o bebé de costas para dormir até 1 ano",
        "Use colchão firme e plano com lençol ajustado",
        "Mantenha objetos macios e travesseiros fora do berço",
        "Co-leito nos primeiros 6 meses (sem compartir cama)",
        "Evite almofadas, posicionadores e dispositivos para sono",
        "Ofereça chupeta na hora do sono",
        "Evite superaquecimento - mantenha temperatura ambiente (20-24°C)",
        "Amamentação reduz o risco de morte súbita"
      ],
      donts: [
        "Não coloque em superfícies moles (sofás, poltronas)",
        "Não compartilhe a cama com o bebé",
        "Não use cobertores soltos, protetores ou brinquedos no berço",
        "Não fume, beba álcool ou use drogas durante a gestação"
      ],
      citation: "Fonte: SBP - Manual de Seguimento do Recém-Nascido"
    }
  },

  // Temperature guidelines
  temperature: {
    en: {
      unit: "Fahrenheit",
      fever: {
        low: "< 100.4°F (38°C) - Usually not serious",
        moderate: "100.4-102.2°F (38-39°C) - May need attention",
        high: "> 102.2°F (39°C) - Contact pediatrician",
        emergency: "> 104°F (40°C) - Seek immediate care"
      },
      roomTemp: {
        recommended: "68-72°F (20-22°C)",
        tooCold: "< 65°F (18°C)",
        tooHot: "> 75°F (24°C)"
      },
      bathTemp: {
        recommended: "98-100°F (37-38°C)",
        testMethod: "Test with elbow or wrist - should feel warm, not hot"
      }
    },
    pt: {
      unit: "Celsius",
      fever: {
        low: "< 38°C - Geralmente não é grave",
        moderate: "38-39°C - Pode precisar de atenção",
        high: "> 39°C - Contatar o pediatra",
        emergency: "> 40°C - Buscar atendimento imediato"
      },
      roomTemp: {
        recommended: "20-24°C",
        tooCold: "< 18°C",
        tooHot: "> 26°C"
      },
      bathTemp: {
        recommended: "36-38°C",
        testMethod: "Teste com o cotovelo ou pulso - deve ser morna, não quente"
      }
    }
  },

  // Growth charts reference
  growth: {
    en: {
      source: "CDC Growth Charts",
      charts: [
        "Length-for-age (0-24 months)",
        "Weight-for-age (0-24 months)",
        "Weight-for-length (0-24 months)",
        "Head circumference-for-age (0-36 months)",
        "BMI-for-age (2-20 years)"
      ],
      percentileNote: "Percentiles 5th to 95th are considered normal. Consistency in growth pattern is more important than hitting a specific percentile.",
      whoVsCdc: "WHO standards are recommended for breastfed babies (0-2 years), CDC for formula-fed and older children."
    },
    pt: {
      source: "Curvas de Crescimento - MS/OPAS/OMS",
      charts: [
        "Comprimento para idade (0-2 anos)",
        "Peso para idade (0-2 anos)",
        "Peso para comprimento (0-2 anos)",
        "Perímetro cefálico para idade (0-3 anos)"
      ],
      percentileNote: "Percentis entre 3 e 97 são considerados normais. A consistência no padrão de crescimento é mais importante que atingir um percentil específico.",
      whoVsCdc: "Use as curvas OMS para crianças em aleitamento materno e curvas do MS para crianças em aleitamento artificial."
    }
  },

  // Development milestones (AAP-referenced)
  milestones: {
    en: {
      twoMonths: {
        motor: "Holds head up when on tummy, moves both arms and legs",
        social: "Begins to smile at people, can briefly calm self, tries to look at parent",
        cognitive: "Pays attention to faces, begins to follow things with eyes, recognizes people at a distance, begins to act bored if change isn't happening"
      },
      fourMonths: {
        motor: "Holds head steady, pushes up on elbows, brings hands to mouth, rolls from tummy to back",
        social: "Smiles at people automatically, loves to look at parents/caregivers, copies some facial expressions",
        cognitive: "Begins to babble, has different cries for different needs, tries to get parent's attention"
      },
      sixMonths: {
        motor: "Rolls in both directions, begins to sit without support, rocks back and forth",
        social: "Recognizes familiar faces, begins to show fear of strangers, likes to look at self in mirror",
        cognitive: "Responds to own name, makes consonant sounds, strings vowels together when babbling"
      },
      nineMonths: {
        motor: "Gets to sitting position without help, moves between sitting and lying down, crawls",
        social: "Is clingy with familiar adults, has favorite toys, shows specific facial expressions",
        cognitive: "Understands 'no', makes a lot of different sounds, points at things, picks up small objects"
      },
      twelveMonths: {
        motor: "Pulls up to stand, walks holding on to furniture, may take a few steps alone",
        social: "Plays games like pat-a-cake and peek-a-boo, waves bye-bye",
        cognitive: "Explores objects in different ways (shaking, banging, throwing), starts to use things correctly (phone, cup)",
        language: "Says 'mama' or 'dada' (specific), points to ask for things, shakes head for 'no'"
      }
    }
  },

  // Feeding guidelines
  feeding: {
    en: {
      title: "Feeding Guidelines - AAP",
      breastmilk: {
        duration: "Exclusive breastfeeding for ~6 months, continue until 12+ months",
        storage: [
          "Room temperature: up to 4 hours",
          "Refrigerator: up to 4 days",
          "Freezer: up to 6-12 months"
        ]
      },
      formula: {
        preparation: "Follow label instructions, use within 1 hour of preparation",
        storage: "Prepared formula: up to 24 hours refrigerated"
      },
      solids: {
        when: "Around 6 months, when baby can sit with support and show interest in food",
        firstFoods: "Iron-fortified cereals, pureed meats, pureed vegetables, pureed fruits",
        noHoney: "Do NOT give honey before 12 months - risk of botulism",
        noWholeMilk: "Do NOT give cow's milk as main drink before 12 months"
      },
      allergenIntro: "Current research suggests introducing peanut and egg early (4-6 months) may prevent allergies. Consult your pediatrician."
    },
    pt: {
      title: "Orientações de Alimentação - SBP",
      breastmilk: {
        duration: "Aleitamento materno exclusivo até 6 meses, manter até 2 anos ou mais",
        storage: [
          "Temperatura ambiente: até 4 horas",
          "Geladeira: até 24 horas",
          "Freezer: até 3 meses"
        ]
      },
      formula: {
        preparation: "Siga as instruções da embalagem, use em até 1 hora após preparo",
        storage: "Fórmula preparada: até 24 horas na geladeira"
      },
      solids: {
        when: "Por volta dos 6 meses, quando o bebé consegue sentar com apoio e mostra interesse pela comida",
        firstFoods: "Cereais fortificados com ferro, purês de carne, legumes e frutas",
        noHoney: "NÃO dar mel antes de 1 ano - risco de botulismo",
        noWholeMilk: "Leite de vaca integral não antes de 1 ano"
      },
      allergenIntro: "Pesquisas atuais sugerem introduzir amendoim e ovo cedo (4-6 meses) pode prevenir alergias. Converse com o seu pediatra."
    }
  }
};

// Helper to get content based on locale and context
export function getAAPContent(locale: string, context: keyof typeof AAP_CONTENT) {
  const lang = locale === 'en' ? 'en' : 'pt'; // Default to pt for ES/FR/DE
  return AAP_CONTENT[context]?.[lang] || AAP_CONTENT[context]?.pt;
}

// Format temperature based on locale
export function formatTemperature(temp: number, locale: string): string {
  if (locale === 'en') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${fahrenheit.toFixed(0)}°F / ${temp.toFixed(0)}°C`;
  }
  return `${temp.toFixed(0)}°C`;
}

export default AAP_CONTENT;