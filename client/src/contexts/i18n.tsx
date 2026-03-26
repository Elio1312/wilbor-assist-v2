import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";

export type Locale = "pt" | "en" | "es";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Detect locale from URL path prefix: /en/... /es/... or default pt
function detectLocaleFromPath(): Locale {
  const path = window.location.pathname;
  if (path.startsWith("/en")) return "en";
  if (path.startsWith("/es")) return "es";
  return "pt";
}

// Translation dictionaries - PT is the source, EN/ES are placeholders until translated
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
    "chat.subtitle": "Seu assistente neonatal IA",
    "chat.welcome": "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
    "chat.error": "Desculpe, houve um erro. Tente novamente.",

    // Hero
    "hero.badge": "Seu companheiro de maternidade",
    "hero.h1": "Você não está sozinha nessa jornada.",
    "hero.desc": "Wilbor é um apoio inteligente digital baseado em protocolos SBP/OMS/AAP que lembra de cada detalhe do seu bebê e responde com carinho, sem julgamentos.",
    "hero.cta": "Testar grátis agora",
    "hero.whatsapp": "Fale no WhatsApp",
    "hero.trust_1": "Sem cadastro obrigatório",
    "hero.trust_2": "Resposta em segundos",
    "hero.trust_3": "Baseado em SBP/OMS/AAP",

    // Features
    "features.h2": "Para o seu bebê",
    "features.subtitle": "Funcionalidades pensadas em cada fase do desenvolvimento",
    "features.chat": "Chat 24h",
    "features.chat_desc": "Tire dúvidas em segundos",
    "features.emergency": "Alertas de Emergência",
    "features.emergency_desc": "Detecta sinais de alerta",
    "features.recipes": "Receitas por Idade",
    "features.recipes_desc": "55 receitas com fotos",
    "features.milestones": "Trilha de Desenvolvimento",
    "features.milestones_desc": "Marcos semana a semana",
    "features.sleep": "Predição de Sono",
    "features.sleep_desc": "Próxima soneca sugerida",
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
    "compare.before_1": "Pânico às 3 da manhã procurando no Google",
    "compare.before_2": "47 abas abertas sobre introdução alimentar",
    "compare.before_3": "Esquecendo datas importantes de vacinas",
    "compare.before_4": "Se sentindo julgada em grupos de mães",
    "compare.before_5": "Gastando R$200+ em consultas desnecessárias",
    "compare.before_6": "Noites sem dormir de preocupação",
    "compare.after_1": "Chat que responde em segundos, 24h",
    "compare.after_2": "Guia completo em um único lugar",
    "compare.after_3": "Alertas automáticos de vacinas",
    "compare.after_4": "IA que não julga, apenas apoia",
    "compare.after_5": "Economiza R$200+ em consultas",
    "compare.after_6": "Dorme tranquila com respostas confiáveis",

    // Mother
    "mother.badge": "Novo",
    "mother.h2": "E você, mamãe?",
    "mother.subtitle": "Também merecia cuidado. Recupere seu corpo, cuide da sua saúde",
    "mother.weight": "Controle de Peso",
    "mother.weight_desc": "Gráfico de evolução + IMC ideal",
    "mother.exercise": "Exercícios em Casa",
    "mother.exercise_desc": "Rotinas por fase pós-parto",
    "mother.food": "Alimentação",
    "mother.food_desc": "Emagrecer amamentando",
    "mother.care": "Cuidados & Produtos",
    "mother.care_desc": "Estrias, cabelo, pele",
    "mother.cta": "Acessar Meu Corpo",

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
    "pricing.free_f1": "5 consultas IA/mês",
    "pricing.free_f2": "Chat 24h",
    "pricing.free_f3": "Sem cartão necessário",
    "pricing.free_f4": "Suporte por email",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "R$ 19,90",
    "pricing.premium_period": "/mês",
    "pricing.premium_desc": "Mais respostas, mais apoio",
    "pricing.premium_popular": "Mais popular",
    "pricing.premium_f1": "500 créditos IA/mês",
    "pricing.premium_f2": "Chat ilimitado",
    "pricing.premium_f3": "Diário do bebê",
    "pricing.premium_f4": "Alertas de vacinas",
    "pricing.premium_f5": "Trilha de desenvolvimento",
    "pricing.premium_f6": "Suporte prioritário",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "R$ 29,90",
    "pricing.manual_desc": "Conteúdo completo",
    "pricing.manual_f1": "Todos os guias",
    "pricing.manual_f2": "Receitas completas",
    "pricing.manual_f3": "Sem IA (conteúdo estático)",
    "pricing.manual_f4": "Acesso vitalício",
    "pricing.manual_f5": "Suporte por email",
    "pricing.cta": "Começar agora",
    "pricing.footer": "Todos os planos incluem 2 consultas grátis com IA.",

    // FAQ
    "faq.h2": "Dúvidas frequentes",

    // Final CTA
    "final_cta.h2": "Pronta para essa jornada?",
    "final_cta.desc": "Milhares de mães já confiam no Wilbor. Você também pode começar hoje, sem compromisso.",

    // Footer
    "footer.tagline": "Apoio inteligente digital 24h, baseado em SBP/OMS/AAP",
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
    "blog.article_cta_h3": "Tire suas dúvidas com o Wilbor",
    "blog.article_cta_desc": "O Wilbor responde em segundos, personalizado para o seu bebê. Baseado na SBP.",
    "blog.article_cta_note": "Sem cadastro · Resposta imediata · 2 consultas grátis",
    "blog.faq_title": "Perguntas frequentes",
    "blog.back_to_blog": "Ver todos os artigos",

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
    "chat.subtitle": "Your AI neonatal assistant",
    "chat.welcome": "Hello! I'm Wilbor, your AI neonatal assistant. How can I help you and your baby today?",
    "chat.error": "Sorry, there was an error. Please try again.",

    // Hero
    "hero.badge": "Your Maternity Companion",
    "hero.h1": "You Are Not Alone on This Journey.",
    "hero.desc": "Wilbor is an intelligent digital support based on SBP/WHO/AAP protocols that remembers every detail about your baby and responds with care, without judgment.",
    "hero.cta": "Try It Free Now",
    "hero.whatsapp": "Chat on WhatsApp",
    "hero.trust_1": "No Mandatory Registration",
    "hero.trust_2": "Answers in Seconds",
    "hero.trust_3": "Based on SBP/WHO/AAP",

    // Features
    "features.h2": "For Your Baby",
    "features.subtitle": "Features designed for every stage of development",
    "features.chat": "24/7 Chat Support",
    "features.chat_desc": "Get your questions answered in seconds",
    "features.emergency": "Emergency Alerts",
    "features.emergency_desc": "Detects warning signs promptly",
    "features.recipes": "Age-Appropriate Recipes",
    "features.recipes_desc": "55 recipes with photos",
    "features.milestones": "Developmental Milestones",
    "features.milestones_desc": "Week-by-week milestones",
    "features.sleep": "Sleep Prediction",
    "features.sleep_desc": "Next nap suggested",
    "features.diary": "Baby Journal",
    "features.diary_desc": "Record special moments",
    "features.profile": "Baby Profile",
    "features.profile_desc": "Personalized responses",
    "features.colic": "Colic Relief Techniques",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Track Every Stage of Your Baby's Growth",
    "trackers.subtitle": "Smart Alerts and Real-Time Monitoring",

    // Before/After
    "compare.h2": "The Difference Wilbor Makes",
    "compare.subtitle": "See How Life Changes with the Right Support",
    "compare.before": "Before Wilbor",
    "compare.after": "With Wilbor",
    "compare.before_1": "3 AM panic searching on Google",
    "compare.before_2": "47 tabs open about complementary feeding",
    "compare.before_3": "Forgetting important vaccination dates",
    "compare.before_4": "Feeling judged in mom groups",
    "compare.before_5": "Spending $40+ on unnecessary consultations",
    "compare.before_6": "Sleepless nights of worry",
    "compare.after_1": "Chat that answers in seconds, 24/7",
    "compare.after_2": "Complete guide in one place",
    "compare.after_3": "Automatic vaccination alerts",
    "compare.after_4": "AI that doesn't judge, just supports",
    "compare.after_5": "Saves $40+ on consultations",
    "compare.after_6": "Sleep soundly with reliable answers",

    // Mother
    "mother.badge": "New",
    "mother.h2": "And you, mom?",
    "mother.subtitle": "You also deserve care. Recover your body, take care of your health",
    "mother.weight": "Weight Control",
    "mother.weight_desc": "Evolution chart + ideal BMI",
    "mother.exercise": "Home Exercises",
    "mother.exercise_desc": "Routines by postpartum phase",
    "mother.food": "Nutrition",
    "mother.food_desc": "Lose weight while breastfeeding",
    "mother.care": "Care & Products",
    "mother.care_desc": "Stretch marks, hair, skin",
    "mother.cta": "Access My Body",

    // Testimonials
    "testimonials.h2": "What Moms Say",
    "testimonials.subtitle": "Real results from Wilbor users",

    // Credibility
    "credibility.badge": "Validated content",
    "credibility.h2": "Trusted by professionals",
    "credibility.desc": "Developed with pediatricians and international scientific protocols",
    "credibility.stat_1": "AAP",
    "credibility.stat_1_label": "American Academy of Pediatrics protocols",
    "credibility.stat_2": "WHO",
    "credibility.stat_2_label": "World Health Organization recommendations",
    "credibility.stat_3": "SBP",
    "credibility.stat_3_label": "Brazilian Society of Pediatrics",

    // Pricing
    "pricing.h2": "Plans for Every Mom",
    "pricing.subtitle": "Start free, no credit card",
    "pricing.free_name": "Free Visit",
    "pricing.free_price": "Free",
    "pricing.free_desc": "Perfect to get started",
    "pricing.free_f1": "5 AI consultations/month",
    "pricing.free_f2": "24/7 Chat",
    "pricing.free_f3": "No credit card required",
    "pricing.free_f4": "Email support",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.90",
    "pricing.premium_period": "/month",
    "pricing.premium_desc": "More answers, more support",
    "pricing.premium_popular": "Most popular",
    "pricing.premium_f1": "500 AI credits/month",
    "pricing.premium_f2": "Unlimited chat",
    "pricing.premium_f3": "Baby journal",
    "pricing.premium_f4": "Vaccination alerts",
    "pricing.premium_f5": "Developmental milestones",
    "pricing.premium_f6": "Priority support",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "$14.90",
    "pricing.manual_desc": "Complete content",
    "pricing.manual_f1": "All guides",
    "pricing.manual_f2": "Complete recipes",
    "pricing.manual_f3": "No AI (static content)",
    "pricing.manual_f4": "Lifetime access",
    "pricing.manual_f5": "Email support",
    "pricing.cta": "Get Started",
    "pricing.footer": "All plans include 2 free AI consultations.",

    // FAQ
    "faq.h2": "Frequently Asked Questions",

    // Final CTA
    "final_cta.h2": "Ready for this journey?",
    "final_cta.desc": "Thousands of moms already trust Wilbor. You can start today, no commitment.",

    // Footer
    "footer.tagline": "24/7 intelligent digital support, based on SBP/WHO/AAP",
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
    "blog.article_cta_h3": "Ask Wilbor your questions",
    "blog.article_cta_desc": "Wilbor answers in seconds, personalized for your baby. Based on AAP.",
    "blog.article_cta_note": "No signup · Instant answers · 2 free consultations",
    "blog.faq_title": "Frequently asked questions",
    "blog.back_to_blog": "View all articles",

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
    "chat.subtitle": "Tu asistente neonatal IA",
    "chat.welcome": "¡Hola! Soy Wilbor, tu asistente neonatal IA. ¿Cómo puedo ayudarte a ti y a tu bebé hoy?",
    "chat.error": "Lo siento, hubo un error. Por favor, intenta de nuevo.",

    // Hero
    "hero.badge": "Tu compañero de maternidad",
    "hero.h1": "No estás sola en este camino.",
    "hero.desc": "Wilbor es un apoyo digital inteligente basado en protocolos AAP/OMS/SBP que recuerda cada detalle de tu bebé y responde con cariño, sin juicios.",
    "hero.cta": "Empezar gratis ahora",
    "hero.whatsapp": "Habla por WhatsApp",
    "hero.trust_1": "Sin registro obligatorio",
    "hero.trust_2": "Respuesta en segundos",
    "hero.trust_3": "Basado en AAP/OMS/SBP",

    // Features
    "features.h2": "Para tu bebé",
    "features.subtitle": "Funcionalidades pensadas para cada etapa del desarrollo",
    "features.chat": "Chat 24h",
    "features.chat_desc": "Resuelve dudas en segundos",
    "features.emergency": "Alertas de Emergencia",
    "features.emergency_desc": "Detecta señales de alerta",
    "features.recipes": "Recetas por Edad",
    "features.recipes_desc": "55 recetas con fotos",
    "features.milestones": "Ruta de Desarrollo",
    "features.milestones_desc": "Hitos semana a semana",
    "features.sleep": "Predicción de Sueño",
    "features.sleep_desc": "Próxima siesta sugerida",
    "features.diary": "Diario del Bebé",
    "features.diary_desc": "Registra momentos especiales",
    "features.profile": "Perfil del Bebé",
    "features.profile_desc": "Respuestas personalizadas",
    "features.colic": "Técnicas de Cólico",
    "features.colic_desc": "Shantala, swaddle, I-L-U",

    // Trackers
    "trackers.h2": "Acompaña cada etapa de tu bebé",
    "trackers.subtitle": "Alertas inteligentes y monitoreo en tiempo real",

    // Before/After
    "compare.h2": "La diferencia que hace Wilbor",
    "compare.subtitle": "Mira cómo cambia la vida con el apoyo correcto",
    "compare.before": "Antes de Wilbor",
    "compare.after": "Con Wilbor",
    "compare.before_1": "Pánico a las 3am buscando en Google",
    "compare.before_2": "47 pestañas abiertas sobre alimentación",
    "compare.before_3": "Olvidando fechas importantes de vacunas",
    "compare.before_4": "Sintiéndote juzgada en grupos de mamás",
    "compare.before_5": "Gastando $40+ en consultas innecesarias",
    "compare.before_6": "Noches sin dormir de preocupación",
    "compare.after_1": "Chat que responde en segundos, 24/7",
    "compare.after_2": "Guía completa en un solo lugar",
    "compare.after_3": "Alertas automáticas de vacunas",
    "compare.after_4": "IA que no juzga, solo apoya",
    "compare.after_5": "Ahorra $40+ en consultas",
    "compare.after_6": "Duerme tranquila con respuestas confiables",

    // Mother
    "mother.badge": "Nuevo",
    "mother.h2": "¿Y tú, mamá?",
    "mother.subtitle": "También mereces cuidado. Recupera tu cuerpo, cuida tu salud",
    "mother.weight": "Control de Peso",
    "mother.weight_desc": "Gráfico de evolución + IMC ideal",
    "mother.exercise": "Ejercicios en Casa",
    "mother.exercise_desc": "Rutinas por fase posparto",
    "mother.food": "Alimentación",
    "mother.food_desc": "Adelgazar amamantando",
    "mother.care": "Cuidados & Productos",
    "mother.care_desc": "Estrías, cabello, piel",
    "mother.cta": "Acceder a Mi Cuerpo",

    // Testimonials
    "testimonials.h2": "Lo que dicen las madres",
    "testimonials.subtitle": "Resultados reales de quienes usan Wilbor",

    // Credibility
    "credibility.badge": "Contenido validado",
    "credibility.h2": "Confiado por profesionales",
    "credibility.desc": "Desarrollado con pediatras y protocolos científicos internacionales",
    "credibility.stat_1": "AAP",
    "credibility.stat_1_label": "Protocolos de la Academia Americana de Pediatría",
    "credibility.stat_2": "OMS",
    "credibility.stat_2_label": "Recomendaciones de la Organización Mundial de la Salud",
    "credibility.stat_3": "SBP",
    "credibility.stat_3_label": "Sociedad Brasileña de Pediatría",

    // Pricing
    "pricing.h2": "Planes para cada mamá",
    "pricing.subtitle": "Comienza gratis, sin tarjeta",
    "pricing.free_name": "Visita Libre",
    "pricing.free_price": "Gratis",
    "pricing.free_desc": "Perfecto para comenzar",
    "pricing.free_f1": "5 consultas IA/mes",
    "pricing.free_f2": "Chat 24/7",
    "pricing.free_f3": "Sin tarjeta necesaria",
    "pricing.free_f4": "Soporte por email",
    "pricing.premium_name": "Premium",
    "pricing.premium_price": "$9.90",
    "pricing.premium_period": "/mes",
    "pricing.premium_desc": "Más respuestas, más apoyo",
    "pricing.premium_popular": "Más popular",
    "pricing.premium_f1": "500 créditos IA/mes",
    "pricing.premium_f2": "Chat ilimitado",
    "pricing.premium_f3": "Diario del bebé",
    "pricing.premium_f4": "Alertas de vacunas",
    "pricing.premium_f5": "Hitos de desarrollo",
    "pricing.premium_f6": "Soporte prioritario",
    "pricing.manual_name": "Manual",
    "pricing.manual_price": "$14.90",
    "pricing.manual_desc": "Contenido completo",
    "pricing.manual_f1": "Todas las guías",
    "pricing.manual_f2": "Recetas completas",
    "pricing.manual_f3": "Sin IA (contenido estático)",
    "pricing.manual_f4": "Acceso de por vida",
    "pricing.manual_f5": "Soporte por email",
    "pricing.cta": "Comenzar ahora",
    "pricing.footer": "Todos los planes incluyen 2 consultas gratis con IA.",

    // FAQ
    "faq.h2": "Preguntas frecuentes",

    // Final CTA
    "final_cta.h2": "¿Lista para este viaje?",
    "final_cta.desc": "Miles de madres ya confían en Wilbor. Tú también puedes comenzar hoy, sin compromiso.",

    // Footer
    "footer.tagline": "Soporte digital inteligente 24/7, basado en OMS/AAP/SBP",
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
    "blog.article_cta_note": "Sin registro · Respuesta inmediata · 2 consultas gratis",
    "blog.faq_title": "Preguntas frecuentes",
    "blog.back_to_blog": "Ver todos los artículos",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.not_found": "Página no encontrada",
    "common.back": "Volver",
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
