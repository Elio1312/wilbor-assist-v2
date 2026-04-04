import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";

export type Locale = "pt" | "en" | "es" | "fr" | "de";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Detect locale from URL path prefix: /en/... /es/... /fr/... /de/... or default pt
function detectLocaleFromPath(): Locale {
  const path = window.location.pathname;
  if (path.startsWith("/en")) return "en";
  if (path.startsWith("/es")) return "es";
  if (path.startsWith("/fr")) return "fr";
  if (path.startsWith("/de")) return "de";
  return "pt";
}

// Translation dictionaries - PT is the source, EN/ES/FR/DE are translated versions
const translations: Record<Locale, Record<string, string>> = {
  pt: {
    // Nav
    "nav.blog": "Blog",
    "nav.enter": "Entrar",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Preços",
    "nav.try_free": "Testar grátis",
    "nav.start_free": "Testar grátis agora",

    // Chat
    "chat.subtitle": "Sua companheira de maternidade 24h",
    "chat.welcome": "Olá! Sou o Wilbor. Estou aqui para te ajudar com seu bebê a qualquer hora — sem julgamentos, com carinho. O que está acontecendo?",
    "chat.error": "Desculpe, houve um erro. Tente novamente.",
    "chat.placeholder": "Digite sua mensagem...",
    "chat.empty_state": "Comece uma conversa com o Wilbor",

    // Hero
    "hero.badge": "Apoio real para mães de verdade",
    "hero.h1": "Saiba o que fazer com seu bebê, em qualquer momento do dia.",
    "hero.desc": "O Wilbor lembra de cada detalhe do seu bebê e te dá orientação confiável com carinho, sem julgamentos — baseado nos protocolos da SBP, OMS e AAP.",
    "hero.cta": "Testar grátis agora",
    "hero.whatsapp": "Fale no WhatsApp",
    "hero.trust_1": "Sem cadastro obrigatório",
    "hero.trust_2": "Resposta em segundos",
    "hero.trust_3": "Baseado em SBP/OMS/AAP",

    // Hero Mockup Dinâmico
    "hero.mockup_alt": "Wilbor - Orientação confiável para mães 24h",
    "hero.mockup_title": "Seu mentor inteligente para cuidados com bebê",
    "hero.mockup_sleep": "Sleep Tracker",
    "hero.mockup_feeding": "Feeding Tracker",
    "hero.mockup_panic": "Botão de Emergência",
    "hero.mockup_cta1": "Testar Grátis",
    "hero.mockup_cta2": "WhatsApp",
    "hero.mockup_tagline": "Orientação confiável para mães, 24h por dia",

    // How Wilbor Responds
    "how.badge": "Inteligência Médica",
    "how.h2": "Como o Wilbor responde?",
    "how.subtitle": "Não é um chat genérico. É um protocolo clínico de segurança.",
    "how.step1_title": "1. Acolhimento",
    "how.step1_desc": "Entende sua angústia e valida sua preocupação sem julgamentos.",
    "how.step2_title": "2. Triagem Clínica",
    "how.step2_desc": "Faz perguntas essenciais para entender a gravidade da situação.",
    "how.step3_title": "3. Base de Conhecimento",
    "how.step3_desc": "Cruza os sintomas com os protocolos da SBP, OMS e AAP.",
    "how.step4_title": "4. Orientação Segura",
    "how.step4_desc": "Indica o que fazer em casa e os sinais exatos de alerta para ir ao hospital.",

    // Features
    "features.h2": "Para o seu bebê",
    "features.subtitle": "Tudo funciona junto para organizar a rotina do seu bebê de forma simples e previsível.",
    "features.chat": "Chat 24h",
    "features.chat_desc": "Tire dúvidas em segundos",
    "features.emergency": "Alertas de Emergência",
    "features.emergency_desc": "Detecta sinais de alerta",
    "features.recipes": "Receitas por Idade",
    "features.recipes_desc": "55 receitas com fotos",
    "features.milestones": "Trilha de Desenvolvimento",
    "features.milestones_desc": "Marcos semana a semana",
    "features.sleep": "Previsão de Sono",
    "features.sleep_desc": "Saiba exatamente quando seu bebê precisa dormir",
    "features.diary": "Diário do Bebê",
    "features.diary_desc": "Registre momentos especiais",
    "features.profile": "Perfil do Bebê",
    "features.profile_desc": "Respostas personalizadas",
    "features.colic": "Técnicas de Cólica",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Acompanhe cada fase do seu bebê",
    "trackers.subtitle": "Alertas inteligentes e monitoramento em tempo real",

    // Before/After
    "compare.h2": "A diferença que Wilbor faz",
    "compare.subtitle": "Veja como a vida muda com o apoio certo",
    "compare.before": "Antes do Wilbor",
    "compare.after": "Com Wilbor",
    "compare.before_1": "Pânico às 3 da manhã sem saber o que fazer",
    "compare.before_2": "47 abas abertas sobre introdução alimentar",
    "compare.before_3": "Esquecendo datas importantes de vacinas",
    "compare.before_4": "Se sentindo julgada em grupos de mães",
    "compare.before_5": "Insegurança nas decisões do dia a dia",
    "compare.before_6": "Noites sem dormir de preocupação",
    "compare.after_1": "Chat que responde em segundos, 24h",
    "compare.after_2": "Guia completo em um único lugar",
    "compare.after_3": "Alertas automáticos de vacinas",
    "compare.after_4": "Orientação sem julgamento, com clareza e segurança",
    "compare.after_5": "Decisões com mais segurança e menos ansiedade",
    "compare.after_6": "Dorme tranquila com respostas confiáveis",

    // Mother
    "mother.badge": "Novo",
    "mother.h2": "E você, mãe?",
    "mother.subtitle": "Você também merece cuidado. Saúde e bem-estar no pós-parto",
    "mother.weight": "Acompanhamento do corpo no pós-parto",
    "mother.weight_desc": "Gráfico de evolução + IMC ideal",
    "mother.exercise": "Exercícios em Casa",
    "mother.exercise_desc": "Rotinas por fase pós-parto",
    "mother.food": "Alimentação",
    "mother.food_desc": "Alimentação saudável no pós-parto",
    "mother.care": "Cuidados & Produtos",
    "mother.care_desc": "Estrias, cabelo, pele",
    "mother.cta": "Cuidar de Mim Também",

    // Testimonials
    "testimonials.h2": "O que as mães dizem",
    "testimonials.subtitle": "Resultados reais de quem usa Wilbor",

    // Credibility
    "credibility.badge": "Conteúdo validado",
    "credibility.h2": "Confiado por profissionais",
    "credibility.desc": "Desenvolvido com pediatras e protocolos científicos internacionais",
    "credibility.stat_1": "SBP",
    "credibility.stat_1_label": "Protocolos da Sociedade Brasileira de Pediatria",
    "credibility.stat_2": "OMS",
    "credibility.stat_2_label": "Recomendações da Organização Mundial da Saúde",
    "credibility.stat_3": "AAP",
    "credibility.stat_3_label": "Academia Americana de Pediatria",

    // Pricing
    "pricing.h2": "Planos para cada mãe",
    "pricing.subtitle": "Comece grátis, sem cartão",
    "pricing.free_name": "Visita Livre",
    "pricing.free_price": "Grátis",
    "pricing.free_desc": "Perfeito para começar",
    "pricing.free_f1": "5 perguntas por mês",
    "pricing.free_f2": "Chat 24h",
    "pricing.free_f3": "Sem cartão necessário",
    "pricing.free_f4": "Suporte por email",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "R$ 29,00",
    "pricing.premium_period": "/mês",
    "pricing.premium_desc": "Mais respostas, mais apoio",
    "pricing.premium_popular": "Mais popular",
    "pricing.premium_f1": "Uso ampliado com respostas sempre disponíveis",
    "pricing.premium_f2": "Chat ilimitado",
    "pricing.premium_f3": "Diário do bebê",
    "pricing.premium_f4": "Alertas de vacinas",
    "pricing.premium_f5": "Trilha de desenvolvimento",
    "pricing.premium_f6": "Suporte prioritário",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "R$ 45,00",
    "pricing.manual_desc": "Conteúdo completo",
    "pricing.manual_f1": "Todos os guias",
    "pricing.manual_f2": "Receitas completas",
    "pricing.manual_f3": "Conteúdo completo para consultar quando quiser",
    "pricing.manual_f4": "Acesso vitalício",
    "pricing.manual_f5": "Suporte por email",
    "pricing.cta": "Começar agora",
    "pricing.footer": "Todos os planos incluem 5 perguntas grátis para começar.",

    // FAQ
    "faq.h2": "Dúvidas frequentes",

    // Final CTA
    "final_cta.h2": "Comece agora e tenha respostas sempre que precisar.",
    "final_cta.desc": "Milhares de mães já encontraram orientação confiável com o Wilbor. Você pode começar agora, sem cadastro obrigatório.",

    // Footer
    "footer.tagline": "Apoio confiável para mães, 24h por dia",
    "footer.product": "Produto",
    "footer.legal": "Legal",
    "footer.social": "Redes",
    "footer.blog": "Blog",
    "footer.pricing": "Preços",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacidade",
    "footer.terms": "Termos",
    "footer.contact": "Contato",
    "footer.copyright": "© 2026 Wilbor. Todos os direitos reservados.",
    "footer.disclaimer": "O Wilbor é apoio neonatal e não substitui avaliação médica. Em caso de emergência, procure atendimento presencial.",

    // Image alt texts
    "img.growth_alt": "Infográfico Crises de Crescimento do Bebê - 1, 3, 6 e 12 meses com alertas Wilbor",
    "img.sleep_alt": "Wilbor Sleep Tracker - Monitoramento de sono do bebê com previsão de próxima soneca",
    "img.feeding_alt": "Wilbor Feeding Tracker - Controle de mamadas com timer e histórico diário",
    "img.exercises_alt": "Exercícios pós-parto com Wilbor - Recuperação e vínculo mãe-bebê",
    "img.testimonials_alt": "Depoimentos de mães que usam Wilbor - Growth Crises, Sleep Tracker e Panic Button",
    "img.cta_alt": "Comece sua jornada com Wilbor - Sleep Tracker, Feeding Tracker, Panic Button e WhatsApp",

    // Blog
    "blog.badge": "Blog Wilbor",
    "blog.h1": "Guias para mães de primeira viagem",
    "blog.subtitle": "Artigos práticos baseados nos protocolos da SBP, AAP e OMS. Escritos para você entender rápido e agir com segurança.",
    "blog.read_article": "Ler artigo",
    "blog.cta_h2": "Precisa de orientação personalizada?",
    "blog.cta_desc": "O Wilbor responde suas dúvidas em segundos, com base no perfil do seu bebê.",
    "blog.breadcrumb_home": "Início",
    "blog.breadcrumb_blog": "Blog",
    "blog.based_on": "Baseado nos protocolos da SBP",
    "blog.share_label": "Compartilhe com outra mãe:",
    "blog.share_whatsapp": "Compartilhar no WhatsApp",
    "blog.article_cta_h3": "Precisa de ajuda agora?",
    "blog.article_cta_desc": "O Wilbor te dá orientação confiável em tempo real, personalizada para o seu bebê — no momento em que você precisa.",
    "blog.article_cta_note": "Sem cadastro · Resposta imediata · 5 consultas grátis",
    "blog.faq_title": "Perguntas frequentes",
    "blog.back_to_blog": "Ver todos os artigos",

    // WhatsApp
    "whatsapp.aria_label": "Fale conosco no WhatsApp",
    "whatsapp.button_text": "Fale no WhatsApp",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.not_found": "Página não encontrada",
    "common.back": "Voltar",
  },

  en: {
    // Nav
    "nav.blog": "Blog",
    "nav.enter": "Sign In",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Pricing",
    "nav.try_free": "Try free",
    "nav.start_free": "Start free now",

    // Chat
    "chat.subtitle": "Your 24h motherhood companion",
    "chat.welcome": "Hi! I'm Wilbor. I'm here to help you with your baby anytime — without judgment, with care. What's happening?",
    "chat.error": "Sorry, something went wrong. Try again.",
    "chat.placeholder": "Type your message...",
    "chat.empty_state": "Start a conversation with Wilbor",

    // Hero
    "hero.badge": "Real support for real mothers",
    "hero.h1": "Know what to do with your baby, at any moment of the day.",
    "hero.desc": "Wilbor remembers every detail about your baby and gives you reliable guidance with care, without judgment — based on SBP, WHO and AAP protocols.",
    "hero.cta": "Start free now",
    "hero.whatsapp": "Talk on WhatsApp",
    "hero.trust_1": "No mandatory registration",
    "hero.trust_2": "Response in seconds",
    "hero.trust_3": "Based on SBP/WHO/AAP",

    // Hero Mockup Dinâmico EN
    "hero.mockup_alt": "Wilbor - Reliable guidance for mothers 24/7",
    "hero.mockup_title": "Your intelligent mentor for baby care",
    "hero.mockup_sleep": "Sleep Tracker",
    "hero.mockup_feeding": "Feeding Tracker",
    "hero.mockup_panic": "Emergency Button",
    "hero.mockup_cta1": "Try Free",
    "hero.mockup_cta2": "WhatsApp",
    "hero.mockup_tagline": "Reliable guidance for mothers, 24 hours a day",

    // How Wilbor Responds
    "how.badge": "Medical Intelligence",
    "how.h2": "How does Wilbor respond?",
    "how.subtitle": "It's not a generic chat. It's a clinical safety protocol.",
    "how.step1_title": "1. Empathy",
    "how.step1_desc": "Understands your distress and validates your concern without judgment.",
    "how.step2_title": "2. Clinical Triage",
    "how.step2_desc": "Asks essential questions to understand the severity of the situation.",
    "how.step3_title": "3. Knowledge Base",
    "how.step3_desc": "Cross-references symptoms with AAP, WHO, and SBP protocols.",
    "how.step4_title": "4. Safe Guidance",
    "how.step4_desc": "Tells you what to do at home and the exact warning signs to go to the hospital.",

    // Features
    "features.h2": "For your baby",
    "features.subtitle": "Everything works together to organize your baby's routine in a simple and predictable way.",
    "features.chat": "24h Chat",
    "features.chat_desc": "Get answers in seconds",
    "features.emergency": "Emergency Alerts",
    "features.emergency_desc": "Detects warning signs",
    "features.recipes": "Recipes by Age",
    "features.recipes_desc": "55 recipes with photos",
    "features.milestones": "Development Path",
    "features.milestones_desc": "Weekly milestones",
    "features.sleep": "Sleep Prediction",
    "features.sleep_desc": "Know exactly when your baby needs to sleep",
    "features.diary": "Baby Diary",
    "features.diary_desc": "Record special moments",
    "features.profile": "Baby Profile",
    "features.profile_desc": "Personalized answers",
    "features.colic": "Colic Techniques",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Track every stage of your baby",
    "trackers.subtitle": "Smart alerts and real-time monitoring",

    // Before/After
    "compare.h2": "The difference Wilbor makes",
    "compare.subtitle": "See how life changes with the right support",
    "compare.before": "Before Wilbor",
    "compare.after": "With Wilbor",
    "compare.before_1": "Panic at 3 a.m. without knowing what to do",
    "compare.before_2": "47 tabs open about introducing food",
    "compare.before_3": "Forgetting important vaccine dates",
    "compare.before_4": "Feeling judged in mom groups",
    "compare.before_5": "Insecurity in daily decisions",
    "compare.before_6": "Sleepless nights from worry",
    "compare.after_1": "Chat that answers in seconds, 24h",
    "compare.after_2": "Complete guide in one place",
    "compare.after_3": "Automatic vaccine alerts",
    "compare.after_4": "Judgment-free guidance, with clarity and safety",
    "compare.after_5": "More confident decisions with less anxiety",
    "compare.after_6": "Sleep peacefully with reliable answers",

    // Mother
    "mother.badge": "New",
    "mother.h2": "And you, mom?",
    "mother.subtitle": "You deserve care too. Health and well-being postpartum",
    "mother.weight": "Postpartum body tracking",
    "mother.weight_desc": "Progress chart + ideal BMI",
    "mother.exercise": "Home Exercises",
    "mother.exercise_desc": "Routines by postpartum stage",
    "mother.food": "Nutrition",
    "mother.food_desc": "Healthy postpartum nutrition",
    "mother.care": "Care & Products",
    "mother.care_desc": "Stretch marks, hair, skin",
    "mother.cta": "Take Care of Me Too",

    // Testimonials
    "testimonials.h2": "What Moms Say",
    "testimonials.subtitle": "Real results from Wilbor users",

    // Credibility
    "credibility.badge": "Validated content",
    "credibility.h2": "Trusted by professionals",
    "credibility.desc": "Developed with pediatricians and international scientific protocols",
    "credibility.stat_1": "SBP",
    "credibility.stat_1_label": "Brazilian Society of Pediatrics protocols",
    "credibility.stat_2": "WHO",
    "credibility.stat_2_label": "World Health Organization recommendations",
    "credibility.stat_3": "AAP",
    "credibility.stat_3_label": "American Academy of Pediatrics",

    // Pricing
    "pricing.h2": "Plans for every mother",
    "pricing.subtitle": "Start free, no card required",
    "pricing.free_name": "Free Visit",
    "pricing.free_price": "Free",
    "pricing.free_desc": "Perfect to start",
    "pricing.free_f1": "5 questions per month",
    "pricing.free_f2": "24h Chat",
    "pricing.free_f3": "No card required",
    "pricing.free_f4": "Email support",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.00",
    "pricing.premium_period": "/month",
    "pricing.premium_desc": "More answers, more support",
    "pricing.premium_popular": "Most popular",
    "pricing.premium_f1": "Extended use with always-available responses",
    "pricing.premium_f2": "Unlimited chat",
    "pricing.premium_f3": "Baby diary",
    "pricing.premium_f4": "Vaccine alerts",
    "pricing.premium_f5": "Development path",
    "pricing.premium_f6": "Priority support",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "$14.00",
    "pricing.manual_desc": "Complete content",
    "pricing.manual_f1": "All guides",
    "pricing.manual_f2": "Full recipes",
    "pricing.manual_f3": "Complete content to consult anytime",
    "pricing.manual_f4": "Lifetime access",
    "pricing.manual_f5": "Email support",
    "pricing.cta": "Start now",
    "pricing.footer": "All plans include 5 free questions to start.",

    // FAQ
    "faq.h2": "Frequently asked questions",

    // Final CTA
    "final_cta.h2": "Start now and have answers whenever you need.",
    "final_cta.desc": "Thousands of mothers have already found reliable guidance with Wilbor. You can start now, without mandatory registration.",

    // Footer
    "footer.tagline": "Reliable support for mothers, 24h a day",
    "footer.product": "Product",
    "footer.legal": "Legal",
    "footer.social": "Social",
    "footer.blog": "Blog",
    "footer.pricing": "Pricing",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
    "footer.copyright": "© 2026 Wilbor. All rights reserved.",
    "footer.disclaimer": "Wilbor is neonatal support and does not replace medical evaluation. In case of emergency, seek in-person care.",

    // Image alt texts
    "img.growth_alt": "Baby Growth Crises Infographic - 1, 3, 6 and 12 months with Wilbor alerts",
    "img.sleep_alt": "Wilbor Sleep Tracker - Baby sleep monitoring with next nap prediction",
    "img.feeding_alt": "Wilbor Feeding Tracker - Feeding control with timer and daily history",
    "img.exercises_alt": "Postpartum exercises with Wilbor - Recovery and mother-baby bonding",
    "img.testimonials_alt": "Testimonials from mothers using Wilbor - Growth Crises, Sleep Tracker and Panic Button",
    "img.cta_alt": "Start your journey with Wilbor - Sleep Tracker, Feeding Tracker, Panic Button and WhatsApp",

    // Blog
    "blog.badge": "Wilbor Blog",
    "blog.h1": "Guides for First-Time Moms",
    "blog.subtitle": "Practical articles based on SBP, AAP and WHO protocols. Written for you to understand quickly and act safely.",
    "blog.read_article": "Read article",
    "blog.cta_h2": "Need personalized guidance?",
    "blog.cta_desc": "Wilbor answers your questions in seconds, based on your baby's profile.",
    "blog.breadcrumb_home": "Home",
    "blog.breadcrumb_blog": "Blog",
    "blog.based_on": "Based on AAP protocols",
    "blog.share_label": "Share with another mom:",
    "blog.share_whatsapp": "Share on WhatsApp",
    "blog.article_cta_h3": "Need help now?",
    "blog.article_cta_desc": "Wilbor gives you reliable guidance in real time, personalized for your baby — when you need it most.",
    "blog.article_cta_note": "No signup · Instant answers · 5 free questions",
    "blog.faq_title": "Frequently asked questions",
    "blog.back_to_blog": "View all articles",

    // WhatsApp
    "whatsapp.aria_label": "Contact us on WhatsApp",
    "whatsapp.button_text": "Chat on WhatsApp",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.not_found": "Page not found",
    "common.back": "Back",
  },

  es: {
    // Nav
    "nav.blog": "Blog",
    "nav.enter": "Iniciar sesión",
    "nav.dashboard": "Panel de control",
    "nav.pricing": "Precios",
    "nav.try_free": "Probar gratis",
    "nav.start_free": "Empezar gratis ahora",

    // Chat
    "chat.subtitle": "Tu compañera de maternidad 24h",
    "chat.welcome": "¡Hola! Soy Wilbor. Estoy aquí para ayudarte con tu bebé en cualquier momento — sin juicios, con cariño. ¿Qué está pasando?",
    "chat.error": "Lo sentimos, ocurrió un error. Intenta nuevamente.",

    // Hero
    "hero.badge": "Apoyo real para madres reales",
    "hero.h1": "Sabe qué hacer con tu bebé, en cualquier momento del día.",
    "hero.desc": "Wilbor recuerda cada detalle de tu bebé y te da orientación confiable con cariño, sin juicios — basado en los protocolos de la SBP, OMS y AAP.",
    "hero.cta": "Probar gratis ahora",
    "hero.whatsapp": "Hablar por WhatsApp",
    "hero.trust_1": "Sin registro obligatorio",
    "hero.trust_2": "Respuesta en segundos",
    "hero.trust_3": "Basado en SBP/OMS/AAP",

    // Hero Mockup Dinâmico ES
    "hero.mockup_alt": "Wilbor - Orientación confiable para madres 24h",
    "hero.mockup_title": "Tu mentor inteligente para el cuidado del bebé",
    "hero.mockup_sleep": "Sleep Tracker",
    "hero.mockup_feeding": "Feeding Tracker",
    "hero.mockup_panic": "Botón de Emergencia",
    "hero.mockup_cta1": "Probar Gratis",
    "hero.mockup_cta2": "WhatsApp",
    "hero.mockup_tagline": "Orientación confiable para madres, 24 horas al día",

    // How Wilbor Responds
    "how.badge": "Inteligencia Médica",
    "how.h2": "¿Cómo responde Wilbor?",
    "how.subtitle": "No es un chat genérico. Es un protocolo clínico de seguridad.",
    "how.step1_title": "1. Empatía",
    "how.step1_desc": "Entiende tu angustia y valida tu preocupación sin juzgar.",
    "how.step2_title": "2. Triaje Clínico",
    "how.step2_desc": "Hace preguntas esenciales para entender la gravedad de la situación.",
    "how.step3_title": "3. Base de Conocimiento",
    "how.step3_desc": "Cruza los síntomas con los protocolos de la AAP, OMS y SBP.",
    "how.step4_title": "4. Orientación Segura",
    "how.step4_desc": "Indica qué hacer en casa y las señales exactas de alerta para ir al hospital.",

    // Features
    "features.h2": "Para tu bebé",
    "features.subtitle": "Todo funciona en conjunto para organizar la rutina de tu bebé de forma simple y predecible.",
    "features.chat": "Chat 24h",
    "features.chat_desc": "Resuelve dudas en segundos",
    "features.emergency": "Alertas de Emergencia",
    "features.emergency_desc": "Detecta señales de alerta",
    "features.recipes": "Recetas por Edad",
    "features.recipes_desc": "55 recetas con fotos",
    "features.milestones": "Ruta de Desarrollo",
    "features.milestones_desc": "Hitos semana a semana",
    "features.sleep": "Predicción de Sueño",
    "features.sleep_desc": "Sabe exactamente cuándo tu bebé necesita dormir",
    "features.diary": "Diario del Bebé",
    "features.diary_desc": "Registra momentos especiales",
    "features.profile": "Perfil del Bebé",
    "features.profile_desc": "Respuestas personalizadas",
    "features.colic": "Técnicas para Cólico",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Sigue cada etapa de tu bebé",
    "trackers.subtitle": "Alertas inteligentes y monitoreo en tiempo real",

    // Before/After
    "compare.h2": "La diferencia que hace Wilbor",
    "compare.subtitle": "Mira cómo cambia la vida con el apoyo correcto",
    "compare.before": "Antes de Wilbor",
    "compare.after": "Con Wilbor",
    "compare.before_1": "Pánico a las 3 de la mañana sin saber qué hacer",
    "compare.before_2": "47 pestañas abiertas sobre alimentación",
    "compare.before_3": "Olvidando fechas importantes de vacunas",
    "compare.before_4": "Sintiendo juicio en grupos de madres",
    "compare.before_5": "Inseguridad en decisiones del día a día",
    "compare.before_6": "Noches sin dormir por preocupación",
    "compare.after_1": "Chat que responde en segundos, 24h",
    "compare.after_2": "Guía completa en un solo lugar",
    "compare.after_3": "Alertas automáticas de vacunas",
    "compare.after_4": "Orientación sin juicio, con claridad y seguridad",
    "compare.after_5": "Decisiones más seguras y menos ansiedad",
    "compare.after_6": "Duerme tranquila con respuestas confiables",

    // Mother
    "mother.badge": "Nuevo",
    "mother.h2": "¿Y tú, mamá?",
    "mother.subtitle": "Tú también mereces cuidado. Salud y bienestar en el posparto",
    "mother.weight": "Seguimiento del cuerpo posparto",
    "mother.weight_desc": "Gráfico de evolución + IMC ideal",
    "mother.exercise": "Ejercicios en Casa",
    "mother.exercise_desc": "Rutinas por fase posparto",
    "mother.food": "Alimentación",
    "mother.food_desc": "Alimentación saludable en el posparto",
    "mother.care": "Cuidados & Productos",
    "mother.care_desc": "Estrías, cabello, piel",
    "mother.cta": "Cuidarme También",

    // Testimonials
    "testimonials.h2": "Lo que dicen las madres",
    "testimonials.subtitle": "Resultados reales de quienes usan Wilbor",

    // Credibility
    "credibility.badge": "Contenido validado",
    "credibility.h2": "Confiado por profesionales",
    "credibility.desc": "Desarrollado con pediatras y protocolos científicos internacionales",
    "credibility.stat_1": "SBP",
    "credibility.stat_1_label": "Protocolos de la Sociedad Brasileña de Pediatría",
    "credibility.stat_2": "OMS",
    "credibility.stat_2_label": "Recomendaciones de la Organización Mundial de la Salud",
    "credibility.stat_3": "AAP",
    "credibility.stat_3_label": "Academia Americana de Pediatría",

    // Pricing
    "pricing.h2": "Planes para cada madre",
    "pricing.subtitle": "Empieza gratis, sin tarjeta",
    "pricing.free_name": "Visita Libre",
    "pricing.free_price": "Gratis",
    "pricing.free_desc": "Perfecto para empezar",
    "pricing.free_f1": "5 preguntas por mes",
    "pricing.free_f2": "Chat 24h",
    "pricing.free_f3": "Sin tarjeta necesaria",
    "pricing.free_f4": "Soporte por email",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.00",
    "pricing.premium_period": "/mes",
    "pricing.premium_desc": "Más respuestas, más apoyo",
    "pricing.premium_popular": "Más popular",
    "pricing.premium_f1": "Uso ampliado con respuestas siempre disponibles",
    "pricing.premium_f2": "Chat ilimitado",
    "pricing.premium_f3": "Diario del bebé",
    "pricing.premium_f4": "Alertas de vacunas",
    "pricing.premium_f5": "Ruta de desarrollo",
    "pricing.premium_f6": "Soporte prioritario",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "$14.00",
    "pricing.manual_desc": "Contenido completo",
    "pricing.manual_f1": "Todas las guías",
    "pricing.manual_f2": "Recetas completas",
    "pricing.manual_f3": "Contenido completo para consultar cuando quieras",
    "pricing.manual_f4": "Acceso de por vida",
    "pricing.manual_f5": "Soporte por email",
    "pricing.cta": "Empezar ahora",
    "pricing.footer": "Todos los planes incluyen 5 preguntas gratis para empezar.",

    // FAQ
    "faq.h2": "Preguntas frecuentes",

    // Final CTA
    "final_cta.h2": "Empieza ahora y ten respuestas cuando las necesites.",
    "final_cta.desc": "Miles de madres ya encontraron orientación confiable con Wilbor. Puedes empezar ahora, sin registro obligatorio.",

    // Footer
    "footer.tagline": "Orientación confiable para madres, 24h al día",
    "footer.product": "Producto",
    "footer.legal": "Legal",
    "footer.social": "Redes",
    "footer.blog": "Blog",
    "footer.pricing": "Precios",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.contact": "Contacto",
    "footer.copyright": "© 2026 Wilbor. Todos los derechos reservados.",
    "footer.disclaimer": "Wilbor es apoyo neonatal y no sustituye la evaluación médica. En caso de emergencia, busque atención presencial.",

    // Image alt texts
    "img.growth_alt": "Infografía de Crisis de Crecimiento del Bebé - 1, 3, 6 y 12 meses con alertas Wilbor",
    "img.sleep_alt": "Wilbor Sleep Tracker - Monitoreo del sueño del bebé con predicción de próxima siesta",
    "img.feeding_alt": "Wilbor Feeding Tracker - Control de tomas con temporizador e historial diario",
    "img.exercises_alt": "Ejercicios posparto con Wilbor - Recuperación y vínculo madre-bebé",
    "img.testimonials_alt": "Testimonios de madres que usan Wilbor - Crisis de Crecimiento, Sleep Tracker y Panic Button",
    "img.cta_alt": "Comienza tu viaje con Wilbor - Sleep Tracker, Feeding Tracker, Panic Button y WhatsApp",

    // Blog
    "blog.badge": "Blog Wilbor",
    "blog.h1": "Guías para mamás primerizas",
    "blog.subtitle": "Artículos prácticos basados en protocolos AAP, OMS y SBP. Escritos para que entiendas rápido y actúes con seguridad.",
    "blog.read_article": "Leer artículo",
    "blog.cta_h2": "¿Necesitas orientación personalizada?",
    "blog.cta_desc": "Wilbor responde tus dudas en segundos, según el perfil de tu bebé.",
    "blog.breadcrumb_home": "Inicio",
    "blog.breadcrumb_blog": "Blog",
    "blog.based_on": "Basado en protocolos AAP",
    "blog.share_label": "Comparte con otra mamá:",
    "blog.share_whatsapp": "Compartir en WhatsApp",
    "blog.article_cta_h3": "Pregúntale a Wilbor",
    "blog.article_cta_desc": "Wilbor responde en segundos, personalizado para tu bebé. Basado en AAP.",
    "blog.article_cta_note": "Sin registro · Respuesta inmediata · 5 preguntas gratis",
    "blog.faq_title": "Preguntas frecuentes",
    "blog.back_to_blog": "Ver todos los artículos",

    // WhatsApp
    "whatsapp.aria_label": "Contáctenos en WhatsApp",
    "whatsapp.button_text": "Hablar en WhatsApp",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.not_found": "Página no encontrada",
    "common.back": "Volver",
  },

  fr: {
    // Nav
    "nav.blog": "Blog",
    "nav.enter": "Se connecter",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Tarifs",
    "nav.try_free": "Essayer gratuitement",
    "nav.start_free": "Essayer gratuitement maintenant",

    // Chat
    "chat.subtitle": "Votre compagne de maternité 24h/24",
    "chat.welcome": "Bonjour ! Je suis Wilbor. Je suis là pour vous aider avec votre bébé à tout moment — sans jugement, avec bienveillance. Que se passe-t-il ?",
    "chat.placeholder": "Que se passe-t-il avec votre bébé en ce moment ?",
    "chat.error": "Désolé, une erreur s'est produite. Veuillez réessayer.",

    // Hero
    "hero.badge": "Un soutien réel pour de vraies mères",
    "hero.h1": "Sachez quoi faire avec votre bébé, à tout moment de la journée.",
    "hero.desc": "Wilbor se souvient de chaque détail de votre bébé et vous offre des conseils fiables avec bienveillance, sans jugement — basés sur les protocoles SBP, OMS et AAP.",
    "hero.cta": "Essayer gratuitement maintenant",
    "hero.whatsapp": "Parler sur WhatsApp",
    "hero.trust_1": "Sans inscription obligatoire",
    "hero.trust_2": "Réponse en quelques secondes",
    "hero.trust_3": "Basé sur SBP/OMS/AAP",

    // Hero Mockup Dinâmico FR
    "hero.mockup_alt": "Wilbor - Conseils fiables pour les mères 24h/24",
    "hero.mockup_title": "Votre mentor intelligent pour les soins de bébé",
    "hero.mockup_sleep": "Suivi du sommeil",
    "hero.mockup_feeding": "Suivi de l'alimentation",
    "hero.mockup_panic": "Bouton d'urgence",
    "hero.mockup_cta1": "Essayer gratuitement",
    "hero.mockup_cta2": "WhatsApp",
    "hero.mockup_tagline": "Conseils fiables pour les mères, 24 heures sur 24",

    // How Wilbor Responds
    "how.badge": "Intelligence Médicale",
    "how.h2": "Comment Wilbor répond-il ?",
    "how.subtitle": "Ce n'est pas un chat générique. C'est un protocole de sécurité clinique.",
    "how.step1_title": "1. Empathie",
    "how.step1_desc": "Comprend votre détresse et valide votre inquiétude sans jugement.",
    "how.step2_title": "2. Triage Clinique",
    "how.step2_desc": "Pose des questions essentielles pour comprendre la gravité de la situation.",
    "how.step3_title": "3. Base de Connaissances",
    "how.step3_desc": "Croise les symptômes avec les protocoles de l'AAP, de l'OMS et de la SFP.",
    "how.step4_title": "4. Orientation Sûre",
    "how.step4_desc": "Indique quoi faire à la maison et les signes d'alerte exacts pour aller à l'hôpital.",

    // Features
    "features.h2": "Pour votre bébé",
    "features.subtitle": "Tout fonctionne ensemble pour organiser la routine de votre bébé de manière simple et prévisible.",
    "features.chat": "Chat 24h/24",
    "features.chat_desc": "Obtenez des réponses en quelques secondes",
    "features.emergency": "Alertes d'Urgence",
    "features.emergency_desc": "Détecte les signes d'alerte",
    "features.recipes": "Recettes par Âge",
    "features.recipes_desc": "55 recettes avec photos",
    "features.milestones": "Parcours de Développement",
    "features.milestones_desc": "Étapes semaine par semaine",
    "features.sleep": "Prévision du Sommeil",
    "features.sleep_desc": "Sachez exactement quand votre bébé doit dormir",
    "features.diary": "Journal du Bébé",
    "features.diary_desc": "Enregistrez les moments spéciaux",
    "features.profile": "Profil du Bébé",
    "features.profile_desc": "Réponses personnalisées",
    "features.colic": "Techniques contre les Coliques",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Suivez chaque étape de votre bébé",
    "trackers.subtitle": "Alertes intelligentes et suivi en temps réel",

    // Before/After
    "compare.h2": "La différence que fait Wilbor",
    "compare.subtitle": "Voyez comment la vie change avec le bon soutien",
    "compare.before": "Avant Wilbor",
    "compare.after": "Avec Wilbor",
    "compare.before_1": "Panique à 3h du matin sans savoir quoi faire",
    "compare.before_2": "47 onglets ouverts sur l'alimentation",
    "compare.before_3": "Oublier des dates importantes de vaccination",
    "compare.before_4": "Se sentir jugée dans les groupes de mères",
    "compare.before_5": "Insécurité dans les décisions quotidiennes",
    "compare.before_6": "Nuits blanches à cause de l'inquiétude",
    "compare.after_1": "Chat qui répond en quelques secondes, 24h/24",
    "compare.after_2": "Guide complet en un seul endroit",
    "compare.after_3": "Alertes automatiques de vaccins",
    "compare.after_4": "Conseils sans jugement, avec clarté et sécurité",
    "compare.after_5": "Décisions plus sûres et moins d'anxiété",
    "compare.after_6": "Dormez paisiblement avec des réponses fiables",

    // Mother
    "mother.badge": "Nouveau",
    "mother.h2": "Et vous, maman ?",
    "mother.subtitle": "Vous méritez aussi des soins. Santé et bien-être post-partum",
    "mother.weight": "Suivi du corps post-partum",
    "mother.weight_desc": "Graphique d'évolution + IMC idéal",
    "mother.exercise": "Exercices à domicile",
    "mother.exercise_desc": "Programmes par phase post-partum",
    "mother.food": "Alimentation",
    "mother.food_desc": "Alimentation saine post-partum",
    "mother.care": "Soins & Produits",
    "mother.care_desc": "Vergetures, cheveux, peau",
    "mother.cta": "Prendre soin de moi aussi",

    // Testimonials
    "testimonials.h2": "Ce que disent les mères",
    "testimonials.subtitle": "Des résultats réels de celles qui utilisent Wilbor",

    // Credibility
    "credibility.badge": "Contenu validé",
    "credibility.h2": "Approuvé par des professionnels",
    "credibility.desc": "Développé avec des pédiatres et des protocoles scientifiques internationaux",
    "credibility.stat_1": "SBP",
    "credibility.stat_1_label": "Protocoles de la Société Brésilienne de Pédiatrie",
    "credibility.stat_2": "OMS",
    "credibility.stat_2_label": "Recommandations de l'Organisation Mondiale de la Santé",
    "credibility.stat_3": "AAP",
    "credibility.stat_3_label": "Académie Américaine de Pédiatrie",

    // Pricing
    "pricing.h2": "Des offres pour chaque mère",
    "pricing.subtitle": "Commencez gratuitement, sans carte",
    "pricing.free_name": "Visite Libre",
    "pricing.free_price": "Gratuit",
    "pricing.free_desc": "Parfait pour commencer",
    "pricing.free_f1": "5 questions par mois",
    "pricing.free_f2": "Chat 24h/24",
    "pricing.free_f3": "Sans carte nécessaire",
    "pricing.free_f4": "Support par e-mail",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.00",
    "pricing.premium_period": "/mois",
    "pricing.premium_desc": "Plus de réponses, plus de soutien",
    "pricing.premium_popular": "Le plus populaire",
    "pricing.premium_f1": "Utilisation étendue avec des réponses toujours disponibles",
    "pricing.premium_f2": "Chat illimité",
    "pricing.premium_f3": "Journal du bébé",
    "pricing.premium_f4": "Alertes de vaccins",
    "pricing.premium_f5": "Parcours de développement",
    "pricing.premium_f6": "Support prioritaire",
    "pricing.manual_name": "Manuel",
    "pricing.manual_price": "$14.00",
    "pricing.manual_desc": "Contenu complet",
    "pricing.manual_f1": "Tous les guides",
    "pricing.manual_f2": "Recettes complètes",
    "pricing.manual_f3": "Contenu complet à consulter quand vous voulez",
    "pricing.manual_f4": "Accès à vie",
    "pricing.manual_f5": "Support par e-mail",
    "pricing.cta": "Commencer maintenant",
    "pricing.footer": "Toutes les offres incluent 5 questions gratuites pour commencer.",

    // FAQ
    "faq.h2": "Questions fréquentes",

    // Final CTA
    "final_cta.h2": "Commencez maintenant et obtenez des réponses chaque fois que vous en avez besoin.",
    "final_cta.desc": "Des milliers de mères ont déjà trouvé une orientation fiable avec Wilbor. Vous pouvez commencer maintenant, sans inscription obligatoire.",

    // Footer
    "footer.tagline": "Un soutien fiable pour les mères, 24h/24",
    "footer.product": "Produit",
    "footer.legal": "Mentions légales",
    "footer.social": "Réseaux",
    "footer.blog": "Blog",
    "footer.pricing": "Tarifs",
    "footer.faq": "FAQ",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.contact": "Contact",
    "footer.copyright": "© 2026 Wilbor. Tous droits réservés.",
    "footer.disclaimer": "Wilbor est un soutien néonatal et ne remplace pas une évaluation médicale. En cas d'urgence, recherchez une prise en charge en présentiel.",

    // Image alt texts
    "img.growth_alt": "Infographie des Crises de Croissance du Bébé - 1, 3, 6 et 12 mois avec alertes Wilbor",
    "img.sleep_alt": "Wilbor Sleep Tracker - Suivi du sommeil du bébé avec prédiction de la prochaine sieste",
    "img.feeding_alt": "Wilbor Feeding Tracker - Contrôle des tétées avec minuterie et historique quotidien",
    "img.exercises_alt": "Exercices post-partum avec Wilbor - Récupération et lien mère-bébé",
    "img.testimonials_alt": "Témoignages de mères utilisant Wilbor - Crises de Croissance, Sleep Tracker et Panic Button",
    "img.cta_alt": "Commencez votre parcours avec Wilbor - Sleep Tracker, Feeding Tracker, Panic Button et WhatsApp",

    // Blog
    "blog.badge": "Blog Wilbor",
    "blog.h1": "Guides pour les mères pour la première fois",
    "blog.subtitle": "Des articles pratiques basés sur les protocoles de la SBP, de l'AAP et de l'OMS. Écrits pour que vous compreniez vite et agissiez en toute sécurité.",
    "blog.read_article": "Lire l'article",
    "blog.cta_h2": "Besoin d'une orientation personnalisée ?",
    "blog.cta_desc": "Wilbor répond à vos questions en quelques secondes, en se basant sur le profil de votre bébé.",
    "blog.breadcrumb_home": "Accueil",
    "blog.breadcrumb_blog": "Blog",
    "blog.based_on": "Basé sur les protocoles de la SBP",
    "blog.share_label": "Partagez avec une autre mère :",
    "blog.share_whatsapp": "Partager sur WhatsApp",
    "blog.article_cta_h3": "Besoin d'aide maintenant ?",
    "blog.article_cta_desc": "Wilbor vous donne une orientation fiable en temps réel, personnalisée pour votre bébé — au moment où vous en avez besoin.",
    "blog.article_cta_note": "Sans inscription · Réponse immédiate · 5 questions gratuites",
    "blog.faq_title": "Questions fréquentes",
    "blog.back_to_blog": "Voir tous les articles",

    // WhatsApp
    "whatsapp.aria_label": "Contactez-nous sur WhatsApp",
    "whatsapp.button_text": "Discuter sur WhatsApp",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.not_found": "Page non trouvée",
    "common.back": "Retour",
  },

  de: {
    // Nav
    "nav.blog": "Blog",
    "nav.enter": "Anmelden",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Preise",
    "nav.try_free": "Kostenlos testen",
    "nav.start_free": "Jetzt kostenlos testen",

    // Chat
    "chat.subtitle": "Ihre 24h-Mutterschaftsbegleiterin",
    "chat.welcome": "Hallo! Ich bin Wilbor. Ich bin hier, um Ihnen jederzeit mit Ihrem Baby zu helfen — ohne Bewertung, mit Fürsorge. Was passiert gerade?",
    "chat.placeholder": "Was passiert gerade mit Ihrem Baby?",
    "chat.error": "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",

    // Hero
    "hero.badge": "Echte Unterstützung für echte Mütter",
    "hero.h1": "Wissen Sie, was Sie mit Ihrem Baby tun können — jederzeit.",
    "hero.desc": "Wilbor merkt sich jedes Detail Ihres Babys und gibt Ihnen verlässliche Orientierung mit Fürsorge, ohne Bewertung — basierend auf SBP-, WHO- und AAP-Protokollen.",
    "hero.cta": "Jetzt kostenlos testen",
    "hero.whatsapp": "Auf WhatsApp sprechen",
    "hero.trust_1": "Keine Registrierung erforderlich",
    "hero.trust_2": "Antwort in Sekunden",
    "hero.trust_3": "Basierend auf SBP/WHO/AAP",

    // Hero Mockup Dinâmico DE
    "hero.mockup_alt": "Wilbor - Zuverlässige Unterstützung für Mütter 24/7",
    "hero.mockup_title": "Ihr intelligenter Mentor für die Babypflege",
    "hero.mockup_sleep": "Schlaf-Tracker",
    "hero.mockup_feeding": "Fütterungs-Tracker",
    "hero.mockup_panic": "Notfall-Schaltfläche",
    "hero.mockup_cta1": "Kostenlos testen",
    "hero.mockup_cta2": "WhatsApp",
    "hero.mockup_tagline": "Zuverlässige Unterstützung für Mütter, 24 Stunden am Tag",

    // How Wilbor Responds
    "how.badge": "Medizinische Intelligenz",
    "how.h2": "Wie antwortet Wilbor?",
    "how.subtitle": "Es ist kein generischer Chat. Es ist ein klinisches Sicherheitsprotokoll.",
    "how.step1_title": "1. Empathie",
    "how.step1_desc": "Versteht Ihre Not und validiert Ihre Sorge ohne Urteil.",
    "how.step2_title": "2. Klinische Triage",
    "how.step2_desc": "Stellt wesentliche Fragen, um die Schwere der Situation zu verstehen.",
    "how.step3_title": "3. Wissensdatenbank",
    "how.step3_desc": "Gleicht Symptome mit den Protokollen der AAP, WHO und DGKJ ab.",
    "how.step4_title": "4. Sichere Anleitung",
    "how.step4_desc": "Zeigt, was zu Hause zu tun ist und die genauen Warnzeichen, um ins Krankenhaus zu gehen.",

    // Features
    "features.h2": "Für Ihr Baby",
    "features.subtitle": "Alles arbeitet zusammen, um die Routine Ihres Babys einfach und vorhersehbar zu organisieren.",
    "features.chat": "24h Chat",
    "features.chat_desc": "Fragen in Sekunden klären",
    "features.emergency": "Notfallwarnungen",
    "features.emergency_desc": "Erkennt Warnsignale",
    "features.recipes": "Rezepte nach Alter",
    "features.recipes_desc": "55 Rezepte mit Fotos",
    "features.milestones": "Entwicklungspfad",
    "features.milestones_desc": "Meilensteine Woche für Woche",
    "features.sleep": "Schlafvorhersage",
    "features.sleep_desc": "Wissen Sie genau, wann Ihr Baby schlafen muss",
    "features.diary": "Baby-Tagebuch",
    "features.diary_desc": "Besondere Momente festhalten",
    "features.profile": "Baby-Profil",
    "features.profile_desc": "Personalisierte Antworten",
    "features.colic": "Kolik-Techniken",
    "features.colic_desc": "Shantala, Pucken, I-L-U",

    // Trackers
    "trackers.h2": "Verfolgen Sie jede Phase Ihres Babys",
    "trackers.subtitle": "Intelligente Warnungen und Echtzeit-Überwachung",

    // Before/After
    "compare.h2": "Der Unterschied, den Wilbor macht",
    "compare.subtitle": "Sehen Sie, wie sich das Leben mit der richtigen Unterstützung verändert",
    "compare.before": "Vor Wilbor",
    "compare.after": "Mit Wilbor",
    "compare.before_1": "Panik um 3 Uhr morgens, ohne zu wissen, was zu tun ist",
    "compare.before_2": "47 offene Tabs zur Beikosteinführung",
    "compare.before_3": "Wichtige Impftermine vergessen",
    "compare.before_4": "Sich in Muttergruppen beurteilt fühlen",
    "compare.before_5": "Unsicherheit bei täglichen Entscheidungen",
    "compare.before_6": "Schlaflose Nächte vor Sorge",
    "compare.after_1": "Chat, der in Sekunden antwortet, 24h",
    "compare.after_2": "Kompletter Leitfaden an einem Ort",
    "compare.after_3": "Automatische Impf-Erinnerungen",
    "compare.after_4": "Urteilsfreie Orientierung mit Klarheit und Sicherheit",
    "compare.after_5": "Sicherere Entscheidungen mit weniger Angst",
    "compare.after_6": "Ruhig schlafen mit verlässlichen Antworten",

    // Mother
    "mother.badge": "Neu",
    "mother.h2": "Und Sie, Mama?",
    "mother.subtitle": "Auch Sie verdienen Fürsorge. Gesundheit und Wohlbefinden im Wochenbett",
    "mother.weight": "Körper-Tracking nach der Geburt",
    "mother.weight_desc": "Fortschrittsdiagramm + idealer BMI",
    "mother.exercise": "Übungen zu Hause",
    "mother.exercise_desc": "Routinen nach Wochenbettphase",
    "mother.food": "Ernährung",
    "mother.food_desc": "Gesunde Ernährung im Wochenbett",
    "mother.care": "Pflege & Produkte",
    "mother.care_desc": "Dehnungsstreifen, Haare, Haut",
    "mother.cta": "Mich auch kümmern",

    // Testimonials
    "testimonials.h2": "Was Mütter sagen",
    "testimonials.subtitle": "Echte Ergebnisse von Nutzerinnen von Wilbor",

    // Credibility
    "credibility.badge": "Validierter Inhalt",
    "credibility.h2": "Von Fachleuten vertraut",
    "credibility.desc": "Entwickelt mit Kinderärtzten und internationalen wissenschaftlichen Protokollen",
    "credibility.stat_1": "SBP",
    "credibility.stat_1_label": "Protokolle der Brasilianischen Gesellschaft für Pädiatrie",
    "credibility.stat_2": "OMS",
    "credibility.stat_2_label": "Empfehlungen der Weltgesundheitsorganisation",
    "credibility.stat_3": "AAP",
    "credibility.stat_3_label": "Amerikanische Akademie für Pädiatrie",

    // Pricing
    "pricing.h2": "Pläne für jede Mutter",
    "pricing.subtitle": "Starten Sie kostenlos, ohne Karte",
    "pricing.free_name": "Freier Zugang",
    "pricing.free_price": "Kostenlos",
    "pricing.free_desc": "Perfekt für den Einstieg",
    "pricing.free_f1": "5 Fragen pro Monat",
    "pricing.free_f2": "24h Chat",
    "pricing.free_f3": "Keine Karte erforderlich",
    "pricing.free_f4": "E-Mail-Support",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.00",
    "pricing.premium_period": "/Monat",
    "pricing.premium_desc": "Mehr Antworten, mehr Unterstützung",
    "pricing.premium_popular": "Am beliebtesten",
    "pricing.premium_f1": "Erweiterte Nutzung mit stets verfügbaren Antworten",
    "pricing.premium_f2": "Unbegrenzter Chat",
    "pricing.premium_f3": "Baby-Tagebuch",
    "pricing.premium_f4": "Impf-Erinnerungen",
    "pricing.premium_f5": "Entwicklungspfad",
    "pricing.premium_f6": "Priorisierter Support",
    "pricing.manual_name": "Handbuch",
    "pricing.manual_price": "$14.00",
    "pricing.manual_desc": "Vollständige Inhalte",
    "pricing.manual_f1": "Alle Leitfäden",
    "pricing.manual_f2": "Vollständige Rezepte",
    "pricing.manual_f3": "Komplette Inhalte jederzeit verfügbar",
    "pricing.manual_f4": "Lebenslanger Zugang",
    "pricing.manual_f5": "E-Mail-Support",
    "pricing.cta": "Jetzt starten",
    "pricing.footer": "Alle Pläne enthalten 5 kostenlose Fragen zum Start.",

    // FAQ
    "faq.h2": "Häufig gestellte Fragen",

    // Final CTA
    "final_cta.h2": "Starten Sie jetzt und erhalten Sie Antworten, wann immer Sie sie brauchen.",
    "final_cta.desc": "Tausende Mütter haben bereits verlässliche Orientierung mit Wilbor gefunden. Sie können jetzt starten, ohne Registrierung.",

    // Footer
    "footer.tagline": "Zuverlässige Unterstützung für Mütter, 24 Stunden am Tag",
    "footer.product": "Produkt",
    "footer.legal": "Rechtliches",
    "footer.social": "Soziale Netzwerke",
    "footer.blog": "Blog",
    "footer.pricing": "Preise",
    "footer.faq": "FAQ",
    "footer.privacy": "Datenschutz",
    "footer.terms": "Bedingungen",
    "footer.contact": "Kontakt",
    "footer.copyright": "© 2026 Wilbor. Alle Rechte vorbehalten.",
    "footer.disclaimer": "Wilbor ist eine neonatale Unterstützung und ersetzt keine medizinische Bewertung. Im Notfall suchen Sie bitte eine persönliche medizinische Versorgung auf.",

    // Image alt texts
    "img.growth_alt": "Infografik zu Babywachstumskrisen - 1, 3, 6 und 12 Monate mit Wilbor-Warnungen",
    "img.sleep_alt": "Wilbor Sleep Tracker - Babyschlafsurveillance mit Vorhersage des nächsten Schlafs",
    "img.feeding_alt": "Wilbor Feeding Tracker - Stillkontrolle mit Timer und täglichem Verlauf",
    "img.exercises_alt": "Postpartum-Übungen mit Wilbor - Erholung und Mutter-Baby-Bindung",
    "img.testimonials_alt": "Erfahrungsberichte von Müttern, die Wilbor nutzen - Wachstumskrisen, Sleep Tracker und Panic Button",
    "img.cta_alt": "Beginnen Sie Ihre Reise mit Wilbor - Sleep Tracker, Feeding Tracker, Panic Button und WhatsApp",

    // Blog
    "blog.badge": "Wilbor Blog",
    "blog.h1": "Leitfäden für Erstlingsmütter",
    "blog.subtitle": "Praktische Artikel basierend auf den Protokollen von SBP, AAP und OMS. Geschrieben, damit Sie schnell verstehen und sicher handeln können.",
    "blog.read_article": "Artikel lesen",
    "blog.cta_h2": "Brauchen Sie personalisierte Orientierung?",
    "blog.cta_desc": "Wilbor beantwortet Ihre Fragen in Sekunden, basierend auf dem Profil Ihres Babys.",
    "blog.breadcrumb_home": "Startseite",
    "blog.breadcrumb_blog": "Blog",
    "blog.based_on": "Basierend auf SBP-Protokollen",
    "blog.share_label": "Mit einer anderen Mutter teilen:",
    "blog.share_whatsapp": "Auf WhatsApp teilen",
    "blog.article_cta_h3": "Brauchen Sie jetzt Hilfe?",
    "blog.article_cta_desc": "Wilbor gibt Ihnen verlässliche Orientierung in Echtzeit, personalisiert für Ihr Baby — genau dann, wenn Sie es brauchen.",
    "blog.article_cta_note": "Keine Registrierung · Sofortige Antwort · 5 kostenlose Anfragen",
    "blog.faq_title": "Häufige Fragen",
    "blog.back_to_blog": "Alle Artikel ansehen",

    // WhatsApp
    "whatsapp.aria_label": "Kontaktieren Sie uns auf WhatsApp",
    "whatsapp.button_text": "WhatsApp-Chat",

    // Common
    "common.loading": "Wird geladen...",
    "common.error": "Fehler",
    "common.not_found": "Seite nicht gefunden",
    "common.back": "Zurück",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocaleFromPath());

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Update URL to reflect locale
    const currentPath = window.location.pathname;
    let basePath = currentPath;
    // Strip existing locale prefix
    if (basePath.startsWith("/en")) basePath = basePath.slice(3) || "/";
    if (basePath.startsWith("/es")) basePath = basePath.slice(3) || "/";
    if (basePath.startsWith("/fr")) basePath = basePath.slice(3) || "/";
    if (basePath.startsWith("/de")) basePath = basePath.slice(3) || "/";
    
    const newPath = newLocale === "pt" ? basePath : `/${newLocale}${basePath === "/" ? "" : basePath}`;
    window.history.pushState({}, "", newPath);
  }, []);

  // Listen for popstate (back/forward)
  useEffect(() => {
    const handlePop = () => setLocaleState(detectLocaleFromPath());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const t = useCallback((key: string): string => {
    const currentLocale = detectLocaleFromPath();
    return translations[currentLocale][key] || translations.pt[key] || key;
  }, []);

  // Always use current locale from URL, not from state
  const localePath = useCallback((path: string): string => {
    const currentLocale = detectLocaleFromPath();
    if (currentLocale === "pt") return path;
    return `/${currentLocale}${path === "/" ? "" : path}`;
  }, []);


  // Sync locale state with URL on every render
  const currentLocale = detectLocaleFromPath();
  if (currentLocale !== locale) {
    setLocaleState(currentLocale);
  }

  return (
    <I18nContext.Provider value={{ locale: currentLocale, setLocale, t, localePath }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
