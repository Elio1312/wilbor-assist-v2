import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Check, ChevronDown, Brain, Bell, Utensils, TrendingUp, Moon, BookOpen, Smile, Wind, Droplets, Apple, Shield, Mail, Sparkles, Baby, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useI18n } from "@/contexts/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Seo, SEO_PRESETS } from "@/components/Seo";
import { useState, useMemo } from "react";
import { getAnonymousSessionId } from "@/lib/anonymousSession";
import { AnalyticsEvents } from "@/lib/analytics";

// CDN Image URLs
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-01-hero-principal_a9900c59.png",
  growth: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-02-growth-crises_133ac9d8.png",
  sleep: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-03-sleep-tracker_26c55d8b.png",
  feeding: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-04-feeding-tracker_0aced0af.png",
  exercises: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-05-postpartum-exercises_3d66de4d.png",
  testimonials: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-06-testimonials_530a6347.png",
  cta: "https://d2xsxph8kpxj0f.cloudfront.net/310519663445560822/LJucsyXHjSVaXkbocW4u2f/wilbor-07-cta-final_c90bd4b9.png",
};

export default function Home() {
  const { data: user } = trpc.auth.me.useQuery();
  const { t, locale, localePath } = useI18n();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // 1. Otimização: FAQ carregado sob demanda por idioma (Performance)
  const faqItems = useMemo(() => {
    const items: Record<string, any[]> = {
      pt: [
        { q: "O Wilbor substitui o pediatra?", a: "Não. O Wilbor é um apoio neonatal digital baseado em SBP/OMS. Em emergências, procure o PS." },
        { q: "Como funcionam os planos do Wilbor?", a: "Temos 2 planos: VISITA LIVRE (Grátis): 5 consultas IA/mês. PREMIUM (R$ 29,00/mês): IA ilimitada 24h + Manual (R$ 59,00 único): Acesso vitalício ao conteúdo completo." },
        { q: "É gratuito? Precisa de cartão?", a: "Sim, comece com 5 consultas grátis no plano Visita Livre. Sem cartão necessário." },
        { q: "Para qual idade é indicado?", a: "O Wilbor é indicado para bebês de 0 a 12 meses." },
        { q: "É baseado em protocolos confiáveis?", a: "Sim, todas as orientações seguem as recomendações oficiais da SBP, OMS e AAP." },
        { q: "Quando devo procurar atendimento médico imediatamente?", a: "Em caso de febre acima de 38°C, convulsões, sangramento ou dificuldade respiratória." },
        { q: "Posso usar em mais de um bebê?", a: "Sim! O Wilbor suporta gêmeos, trigêmeos e múltiplos bebês com perfis individuais." },
        { q: "Funciona em outros idiomas?", a: "Sim! O Wilbor está disponível em Português, Inglês, Espanhol, Francês e Alemão." },
      ],
      en: [
        { q: "Does Wilbor replace a pediatrician?", a: "No. Wilbor is digital neonatal support based on AAP/WHO. In case of emergency, seek in-person care." },
        { q: "How do Wilbor plans work?", a: "We have 2 plans: FREE VISIT: 5 AI consultations/month. PREMIUM ($5.99/mo): Unlimited AI 24h + MANUAL ($12.99 one-time): Lifetime access to all content." },
        { q: "Is it free? Do I need a credit card?", a: "Yes, start with 5 free consultations on the Free Visit plan. No credit card required." },
        { q: "What age range is it for?", a: "Wilbor is designed for babies from 0 to 12 months." },
        { q: "Is it based on reliable protocols?", a: "Yes, all guidance follows official recommendations from AAP, WHO, and SBP." },
        { q: "When should I seek immediate medical attention?", a: "In case of fever above 100.4°F (38°C), seizures, bleeding, or difficulty breathing." },
        { q: "Can I use it for more than one baby?", a: "Yes! Wilbor supports twins, triplets, and multiple babies with individual profiles." },
        { q: "Does it work in other languages?", a: "Yes! Wilbor is available in Portuguese, English, Spanish, French and German." },
      ],
      es: [
        { q: "¿Wilbor reemplaza al pediatra?", a: "No. Wilbor es apoyo neonatal digital. En caso de emergencia, busque atención presencial." },
        { q: "¿Cómo funcionan los planes de Wilbor?", a: "Tenemos 2 planes: VISITA LIBRE (Gratis): 5 consultas IA/mes. PREMIUM ($5.99/mes): IA ilimitada 24h + MANUAL ($12.99 único): Acceso de por vida a todo el contenido." },
        { q: "¿Es gratis? ¿Necesito tarjeta?", a: "Sí, empieza con 5 consultas gratis en el plan Visita Libre. Sin tarjeta necesaria." },
        { q: "¿Para qué edad está indicado?", a: "Wilbor está diseñado para bebés de 0 a 12 meses." },
        { q: "¿Está basado en protocolos confiables?", a: "Sí, todas las orientaciones siguen las recomendaciones oficiales de AAP, OMS y SBP." },
        { q: "¿Cuándo debo buscar atención médica inmediata?", a: "En caso de fiebre superior a 38°C, convulsiones, sangrado o dificultad respiratoria." },
        { q: "¿Puedo usarlo para más de un bebé?", a: "¡Sí! Wilbor soporta gemelos, trillizos y múltiples bebés con perfiles individuales." },
        { q: "¿Funciona en otros idiomas?", a: "¡Sí! Wilbor está disponible en Portugués, Inglés, Español, Francés y Alemán." },
      ],
      fr: [
        { q: "Wilbor remplace-t-il le pédiatre ?", a: "Non. Wilbor est un soutien néonatal numérique. En cas d'urgence, consultez un médecin en personne." },
        { q: "Comment fonctionnent les abonnements Wilbor ?", a: "Nous avons 2 plans : VISITE LIBRE (Gratuit) : 5 consultations IA/mois. PREMIUM (£4.99/mois) : IA illimitée 24h + MANUEL (£10.99 unique) : Accès à vie à tout le contenu." },
        { q: "Est-ce gratuit ? Ai-je besoin d'une carte bancaire ?", a: "Oui, commencez avec 5 consultations gratuites. Aucune carte bancaire requise." },
        { q: "Pour quelle tranche d'âge est-il indiqué ?", a: "Wilbor est conçu pour les bébés de 0 à 12 mois." },
        { q: "Est-il basé sur des protocoles fiables ?", a: "Oui, toutes les recommandations suivent les directives officielles de l'AAP, de l'OMS et de la SFP." },
        { q: "Quand dois-je consulter un médecin immédiatement ?", a: "En cas de fièvre supérieure à 38°C, convulsions, saignements ou difficultés respiratoires." },
        { q: "Puis-je l'utiliser pour plusieurs bébés ?", a: "Oui ! Wilbor supporte les jumeaux, triplettes et plusieurs bébés avec des profils individuels." },
        { q: "Fonctionne-t-il dans d'autres langues ?", a: "Oui ! Wilbor est disponible en Portugais, Anglais, Espagnol, Français et Allemand." },
      ],
      de: [
        { q: "Ersetzt Wilbor den Kinderarzt?", a: "Nein. Wilbor ist digitale neonatale Unterstützung. Im Notfall suchen Sie bitte einen Arzt auf." },
        { q: "Wie funktionieren die Wilbor-Pläne?", a: "Wir haben 2 Pläne: FREIER BESUCH (Kostenlos): 5 KI-Beratungen/Monat. PREMIUM (£4.99/Monat): Unbegrenzte KI rund um die Uhr + HANDBUCH (£10.99 einmalig): Lebenslanger Zugang zu allen Inhalten." },
        { q: "Ist es kostenlos? Brauche ich eine Kreditkarte?", a: "Ja, starten Sie mit 5 kostenlosen Beratungen. Keine Kreditkarte erforderlich." },
        { q: "Für welche Altersgruppe ist es geeignet?", a: "Wilbor ist für Babys von 0 bis 12 Monaten konzipiert." },
        { q: "Basiert es auf zuverlässigen Protokollen?", a: "Ja, alle Empfehlungen folgen den offiziellen Richtlinien der AAP, WHO und DGKJ." },
        { q: "Wann sollte ich sofort einen Arzt aufsuchen?", a: "Bei Fieber über 38°C, Krämpfen, Blutungen oder Atemschwierigkeiten." },
        { q: "Kann ich es für mehr als ein Baby verwenden?", a: "Ja! Wilbor unterstützt Zwillinge, Drillinge und mehrere Babys mit individuellen Profilen." },
        { q: "Funktioniert es in anderen Sprachen?", a: "Ja! Wilbor ist auf Portugiesisch, Englisch, Spanisch, Französisch und Deutsch verfügbar." },
      ],
    };
    return items[locale] || items.pt;
  }, [locale]);

  const features = [
    { icon: Brain, title: t("features.chat"), desc: t("features.chat_desc") },
    { icon: Bell, title: t("features.emergency"), desc: t("features.emergency_desc") },
    { icon: Utensils, title: t("features.recipes"), desc: t("features.recipes_desc") },
    { icon: TrendingUp, title: t("features.milestones"), desc: t("features.milestones_desc") },
    { icon: Moon, title: t("features.sleep"), desc: t("features.sleep_desc") },
    { icon: BookOpen, title: t("features.diary"), desc: t("features.diary_desc") },
    { icon: Smile, title: t("features.profile"), desc: t("features.profile_desc") },
    { icon: Wind, title: t("features.colic"), desc: t("features.colic_desc") },
  ];

  const motherFeatures = [
    { icon: Droplets, title: t("mother.weight"), desc: t("mother.weight_desc") },
    { icon: Heart, title: t("mother.exercise"), desc: t("mother.exercise_desc") },
    { icon: Apple, title: t("mother.food"), desc: t("mother.food_desc") },
    { icon: Shield, title: t("mother.care"), desc: t("mother.care_desc") },
  ];

  const plans = [
    {
      name: t("pricing.free_name"),
      price: t("pricing.free_price"),
      desc: t("pricing.free_desc"),
      features: [
        t("pricing.free_f1"),
        t("pricing.free_f2"),
        t("pricing.free_f3"),
        t("pricing.free_f4"),
      ],
    },
    {
      name: t("pricing.premium_name"),
      price: t("pricing.premium_price"),
      period: t("pricing.premium_period"),
      desc: t("pricing.premium_desc"),
      popular: true,
      features: [
        t("pricing.premium_f1"),
        t("pricing.premium_f2"),
        t("pricing.premium_f3"),
        t("pricing.premium_f4"),
        t("pricing.premium_f5"),
        t("pricing.premium_f6"),
      ],
    },
    {
      name: t("pricing.manual_name"),
      price: t("pricing.manual_price"),
      desc: t("pricing.manual_desc"),
      features: [
        t("pricing.manual_f1"),
        t("pricing.manual_f2"),
        t("pricing.manual_f3"),
        t("pricing.manual_f4"),
        t("pricing.manual_f5"),
      ],
    },
  ];

  const dashboardHref = localePath("/dashboard");
  const premiumHref = localePath("/premium");

  const heroTrustItems = locale === "pt"
    ? [
        "Apoio 24h para dúvidas reais do dia a dia",
        "Baseado em protocolos confiáveis",
        "Comece grátis e avance só se fizer sentido",
      ]
    : [
        "24/7 support for real daily questions",
        "Based on trusted protocols",
        "Start free and upgrade only if it makes sense",
      ];

  const warmAnonymousSession = () => {
    try {
      getAnonymousSessionId();
    } catch (error) {
      console.warn("Failed to initialize anonymous session before navigation", error);
    }
  };

  // Analytics: CTA Click tracking
  const handleCTAClick = (ctaName: string) => {
    AnalyticsEvents.ctaClick(ctaName, 'homepage');
  };

  return (
    <>
      <Seo />
      <div className="min-h-screen bg-white">
      {/* WhatsApp Floating Button */}
      <WhatsAppButton 
        phoneNumber="+55 12 997999971"
        message="Olá! Gostaria de conhecer o Wilbor"
        variant="floating"
      />

      {/* Header Blindado */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3">
            <a href={localePath("/")} className="flex items-center gap-2 cursor-pointer min-w-0">
              <Heart className="h-8 w-8 shrink-0 fill-purple-600 text-purple-600" />
              <span className="truncate text-xl font-bold text-gray-900">Wilbor</span>
            </a>

            {user ? (
              <Button asChild className="rounded-full bg-purple-600 px-5 hover:bg-purple-700 sm:hidden">
                <a href={localePath("/dashboard")}>{t("nav.dashboard")}</a>
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-purple-600 px-5 hover:bg-purple-700 sm:hidden">
                <a href={dashboardHref} onClick={() => { warmAnonymousSession(); handleCTAClick('header_try_free'); }}>{t("nav.try_free")}</a>
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <LanguageSwitcher className="sm:max-w-none" />
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              <Button 
                asChild
                variant="ghost" 
                className="hidden md:flex"
              >
                <a href={localePath("/blog")}>{t("nav.blog")}</a>
              </Button>
              <Button asChild variant="ghost" className="hidden md:flex text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                <a href={premiumHref}>
                  {locale === 'pt' ? 'Planos' : locale === 'es' ? 'Planes' : locale === 'fr' ? 'Forfaits' : locale === 'de' ? 'Tarife' : 'Plans'}
                </a>
              </Button>
              {user ? (
                <Button asChild className="rounded-full bg-purple-600 px-6 hover:bg-purple-700">
                  <a href={localePath("/dashboard")}>{t("nav.dashboard")}</a>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hidden sm:inline-flex">
                    <a href={dashboardHref} onClick={() => { warmAnonymousSession(); handleCTAClick('header_enter'); }}>{t("nav.enter")}</a>
                  </Button>
                  <Button asChild className="rounded-full bg-purple-600 px-6 hover:bg-purple-700">
                    <a href={dashboardHref} onClick={() => { warmAnonymousSession(); handleCTAClick('header_try_free'); }}>{t("nav.try_free")}</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Otimizada para Conversão */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" /> {t("hero.badge")}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
              {t("hero.h1")}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              {t("hero.desc")}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 max-w-2xl">
              {heroTrustItems.map((item) => (
                <div key={item} className="rounded-2xl border border-rose-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-16 px-8 rounded-full text-lg shadow-xl hover:scale-105 transition-transform"
              >
                <a href={dashboardHref} onClick={() => { warmAnonymousSession(); handleCTAClick('hero_cta'); }}>
                  {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50">
                <a href={premiumHref} onClick={() => handleCTAClick('hero_view_plans')}>
                  {locale === 'pt' ? 'Ver planos' : locale === 'es' ? 'Ver planes' : locale === 'fr' ? 'Voir les forfaits' : locale === 'de' ? 'Tarife ansehen' : 'See plans'}
                </a>
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-6 bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 blur-3xl rounded-[3rem]" />
            <div className="relative rounded-[2rem] bg-white border border-rose-100 shadow-2xl p-4 md:p-5">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-rose-100 via-pink-50 to-white p-6 md:p-8 border border-rose-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-700">
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-rose-700">
                        {locale === 'pt' ? 'Mais acolhimento para a mãe' : 'More care-centered support'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {locale === 'pt' ? 'Menos ruído, mais clareza prática' : 'Less noise, more practical clarity'}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3">
                    {locale === 'pt'
                      ? 'Um apoio que combina acolhimento humano com orientação prática.'
                      : 'Support that combines emotional warmth with practical guidance.'}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {locale === 'pt'
                      ? 'O Wilbor ajuda a mãe a decidir melhor em momentos de dúvida sobre sono, cólica, febre, alimentação e rotina do bebê.'
                      : 'Wilbor helps mothers make better decisions around sleep, colic, fever, feeding and baby routine.'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 border border-rose-100 shadow-sm"><Moon className="w-4 h-4 text-purple-500" /> {locale === 'pt' ? 'Sono' : 'Sleep'}</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 border border-rose-100 shadow-sm"><Wind className="w-4 h-4 text-pink-500" /> {locale === 'pt' ? 'Cólica' : 'Colic'}</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 border border-rose-100 shadow-sm"><Bell className="w-4 h-4 text-rose-500" /> {locale === 'pt' ? 'Alertas' : 'Alerts'}</span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-slate-900 text-white p-4 md:p-5 shadow-lg">
                  <div className="text-xs uppercase tracking-[0.18em] text-purple-200 mb-3">
                    {locale === 'pt' ? 'Prova de produto' : 'Product proof'}
                  </div>
                  <img 
                    src={IMAGES.hero} 
                    alt={t("hero.mockup_alt")}
                    className="rounded-2xl shadow-xl border border-white/10"
                    loading="eager"
                    width="1200"
                    height="800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("features.h2")}</h2>
            <p className="text-xl text-gray-600">{t("features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors group">
                <f.icon className="w-10 h-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Differentials Section */}
      <section className="py-16 px-6 bg-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {locale === 'pt' ? 'Por que o Wilbor é diferente?' :
               locale === 'es' ? '¿Por qué Wilbor es diferente?' :
               locale === 'fr' ? 'Pourquoi Wilbor est différent ?' :
               locale === 'de' ? 'Warum ist Wilbor anders?' :
               'Why is Wilbor different?'}
            </h2>
            <p className="text-gray-500 text-lg">
              {locale === 'pt' ? 'O que os outros apps não fazem — e o Wilbor faz.' :
               locale === 'es' ? 'Lo que otras apps no hacen — y Wilbor sí.' :
               locale === 'fr' ? 'Ce que les autres apps ne font pas — et que Wilbor fait.' :
               locale === 'de' ? 'Was andere Apps nicht tun — und Wilbor tut.' :
               "What other apps don't do \u2014 and Wilbor does."}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 bg-gray-800 text-white text-sm font-bold">
              <div className="px-5 py-3 text-gray-400">
                {locale === 'pt' ? 'Outros apps' : locale === 'es' ? 'Otras apps' : locale === 'fr' ? 'Autres apps' : locale === 'de' ? 'Andere Apps' : 'Other apps'}
              </div>
              <div className="px-5 py-3 text-purple-300">Wilbor ✅</div>
            </div>
            {[
              {
                icon: '\uD83E\uDD16',
                painText: locale === 'pt' ? 'IA genérica — mesma resposta para qualquer bebê' : locale === 'es' ? 'IA genérica — misma respuesta para cualquier bebé' : locale === 'fr' ? 'IA générique — même réponse pour n\'importe quel bébé' : locale === 'de' ? 'Generische KI — gleiche Antwort für jedes Baby' : 'Generic AI — same answer for any baby',
                wilborText: locale === 'pt' ? 'Responde sobre o SEU bebê, com a idade e rotina dele' : locale === 'es' ? 'Responde sobre TU bebé, con su edad y rutina' : locale === 'fr' ? 'Répond sur VOTRE bébé, avec son âge et sa routine' : locale === 'de' ? 'Antwortet über IHR Baby, mit Alter und Tagesablauf' : 'Answers about YOUR baby, with their age and routine',
              },
              {
                icon: '\uD83D\uDCB0',
                painText: locale === 'pt' ? 'Paywall agressivo — 3 perguntas e bate no muro' : locale === 'es' ? 'Paywall agresivo — 3 preguntas y muro' : locale === 'fr' ? 'Paywall agressif — 3 questions et blocage' : locale === 'de' ? 'Aggressiver Paywall — 3 Fragen und Schluss' : 'Aggressive paywall — 3 questions and you hit a wall',
                wilborText: locale === 'pt' ? 'Acesso completo por R$29,90 — sem limite de perguntas' : locale === 'es' ? 'Acceso completo — sin límite de preguntas' : locale === 'fr' ? 'Accès complet — questions illimitées' : locale === 'de' ? 'Vollzugang — unbegrenzte Fragen' : 'Full access — unlimited questions',
              },
              {
                icon: '\uD83D\uDD12',
                painText: locale === 'pt' ? 'Vendem dados do seu filho para terceiros' : locale === 'es' ? 'Venden datos de tu hijo a terceros' : locale === 'fr' ? 'Vendent les données de votre enfant' : locale === 'de' ? 'Verkaufen Daten Ihres Kindes' : "Sell your child's data to third parties",
                wilborText: locale === 'pt' ? 'Seus dados não são vendidos para ninguém' : locale === 'es' ? 'Tus datos no se venden a nadie' : locale === 'fr' ? 'Vos données ne sont vendues à personne' : locale === 'de' ? 'Ihre Daten werden an niemanden verkauft' : 'Your data is never sold to anyone',
              },
              {
                icon: '\uD83D\uDC68\u200D\u2695\uFE0F',
                painText: locale === 'pt' ? '"Consulte um médico" em qualquer pergunta' : locale === 'es' ? '"Consulta al médico" para todo' : locale === 'fr' ? '"Consultez un médecin" pour tout' : locale === 'de' ? '"Arzt aufsuchen" bei jeder Frage' : '"See a doctor" for every question',
                wilborText: locale === 'pt' ? 'Respostas práticas, não respostas com medo' : locale === 'es' ? 'Respuestas prácticas, no con miedo' : locale === 'fr' ? 'Réponses pratiques, pas par peur' : locale === 'de' ? 'Praktische Antworten, keine Angstantworten' : 'Practical answers, not fear-driven answers',
              },
              {
                icon: '\uD83D\uDCF2',
                painText: locale === 'pt' ? 'Só iOS ou só Android — precisa baixar app' : locale === 'es' ? 'Solo iOS o Android — hay que descargar' : locale === 'fr' ? 'Seulement iOS ou Android — téléchargement requis' : locale === 'de' ? 'Nur iOS oder Android — Download nötig' : 'iOS only or Android only — requires download',
                wilborText: locale === 'pt' ? 'Funciona agora no seu celular, sem baixar nada' : locale === 'es' ? 'Funciona en tu celular, sin descargar nada' : locale === 'fr' ? 'Fonctionne sur votre téléphone, sans télécharger' : locale === 'de' ? 'Funktioniert auf Ihrem Handy, kein Download' : 'Works now on your phone, no download needed',
              },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-2 ${i < 4 ? 'border-b border-gray-100' : ''}`}>
                <div className="bg-gray-50 px-5 py-4 flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{row.icon}</span>
                  <p className="text-sm text-gray-400 line-through leading-snug">{row.painText}</p>
                </div>
                <div className="bg-white px-5 py-4 flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">\u2705</span>
                  <p className="text-sm text-gray-900 font-semibold leading-snug">{row.wilborText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mother Care Section */}
      <section className="py-24 px-6 bg-purple-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/10 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
                {t("mother.badge")}
              </div>
              <h2 className="text-4xl font-bold mb-6">{t("mother.h2")}</h2>
              <p className="text-xl text-purple-100 mb-12">{t("mother.subtitle")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {motherFeatures.map((f, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <f.icon className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{f.title}</h4>
                      <p className="text-sm text-purple-200">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-12 bg-pink-500 hover:bg-pink-600 h-14 px-8 rounded-full text-lg">
                <a href={dashboardHref} onClick={() => { warmAnonymousSession(); handleCTAClick('mother_cta'); }}>{t("mother.cta")}</a>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={IMAGES.exercises} 
                alt={t("img.exercises_alt")}
                className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("pricing.h2")}</h2>
            <p className="text-xl text-gray-600">{t("pricing.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`rounded-3xl p-8 transition-all ${
                  plan.popular 
                    ? "bg-white shadow-2xl border-4 border-purple-600 scale-105 relative" 
                    : "bg-white border border-gray-200 hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    {t("pricing.premium_popular")}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-2">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-8">{plan.desc}</p>
                <Button asChild className={`w-full h-14 rounded-full text-lg font-bold mb-8 ${
                  plan.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-900 hover:bg-black"
                }`}>
                  <a href={premiumHref}>{t("pricing.cta")}</a>
                </Button>
                <ul className="space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex gap-3 items-start text-sm text-gray-600">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              ⭐⭐⭐⭐⭐ {locale === 'pt' ? 'O que as mães dizem' : locale === 'es' ? 'Lo que dicen las mamás' : locale === 'fr' ? 'Ce que disent les mamans' : locale === 'de' ? 'Was Mütter sagen' : 'What mothers say'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              {locale === 'pt' ? 'Mães reais. Resultados reais.' : locale === 'es' ? 'Mamás reales. Resultados reales.' : locale === 'fr' ? 'Vraies mamans. Vrais résultats.' : locale === 'de' ? 'Echte Mütter. Echte Ergebnisse.' : 'Real mothers. Real results.'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Depoimento 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 flex flex-col gap-6">
              <div className="flex gap-1 text-yellow-400 text-lg">{'★★★★★'}</div>
              <p className="text-gray-700 leading-relaxed text-base italic">
                {locale === 'pt' ? '"Eram 2h da manhã, o Enzo chorava sem parar e eu não sabia se era cólica ou fome. Perguntei pro Wilbor e em 30 segundos ele me disse exatamente o que fazer. Funcionou na hora."' :
                 locale === 'es' ? '"Eran las 2 de la madrugada, mi bebé lloraba sin parar. Le pregunté a Wilbor y en 30 segundos me dijo exactamente qué hacer. Funcionó de inmediato."' :
                 locale === 'fr' ? '"Il était 2h du matin, mon bébé pleurait sans arrêt. J\'ai demandé à Wilbor et en 30 secondes il m\'a dit exactement quoi faire. Ça a marché."' :
                 locale === 'de' ? '"Es war 2 Uhr morgens, mein Baby weinte ohne Aufhören. Ich fragte Wilbor und in 30 Sekunden wusste ich genau was zu tun war. Es hat sofort funktioniert."' :
                 '"It was 2am, Ethan wouldn\'t stop crying and I had no idea if it was colic or hunger. I asked Wilbor and in 30 seconds it told me exactly what to do. It worked immediately."'}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/PGVjkdaKvMTBINPE.png" alt="Juliana" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{locale === 'pt' ? 'Juliana M.' : locale === 'es' ? 'Juliana M.' : 'Juliana M.'}</p>
                  <p className="text-gray-500 text-xs">{locale === 'pt' ? 'Mãe do Enzo, 6 semanas — São Paulo' : locale === 'es' ? 'Mamá de Enzo, 6 semanas — São Paulo' : locale === 'fr' ? 'Maman d\'Enzo, 6 semaines — São Paulo' : locale === 'de' ? 'Mutter von Enzo, 6 Wochen — São Paulo' : 'Mother of Ethan, 6 weeks — São Paulo'}</p>
                </div>
              </div>
            </div>
            {/* Depoimento 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 flex flex-col gap-6">
              <div className="flex gap-1 text-yellow-400 text-lg">{'★★★★★'}</div>
              <p className="text-gray-700 leading-relaxed text-base italic">
                {locale === 'pt' ? '"Já tive dois filhos antes sem o Wilbor. Com o terceiro foi completamente diferente — é como ter uma pediatra de plantão no bolso 24 horas por dia."' :
                 locale === 'es' ? '"Ya tuve dos hijos antes sin Wilbor. Con el tercero fue completamente diferente — es como tener una pediatra de guardia en el bolsillo las 24 horas."' :
                 locale === 'fr' ? '"J\'ai eu deux enfants avant Wilbor. Avec le troisième c\'était complètement différent — c\'est comme avoir une pédiatre de garde dans ma poche 24h/24."' :
                 locale === 'de' ? '"Ich hatte zwei Kinder vor Wilbor. Mit dem dritten war es völlig anders — es ist wie eine Kinderärztin rund um die Uhr in der Tasche zu haben."' :
                 '"I had two kids before Wilbor. With the third it was completely different — it\'s like having a pediatrician on call in my pocket 24 hours a day."'}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/jlUIgsEOudOlliwm.png" alt="Fernanda" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Fernanda C.</p>
                  <p className="text-gray-500 text-xs">{locale === 'pt' ? 'Mãe de 3 filhos — Curitiba' : locale === 'es' ? 'Mamá de 3 hijos — Curitiba' : locale === 'fr' ? 'Maman de 3 enfants — Curitiba' : locale === 'de' ? 'Mutter von 3 Kindern — Curitiba' : 'Mother of 3 — Curitiba'}</p>
                </div>
              </div>
            </div>
            {/* Depoimento 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 flex flex-col gap-6">
              <div className="flex gap-1 text-yellow-400 text-lg">{'★★★★★'}</div>
              <p className="text-gray-700 leading-relaxed text-base italic">
                {locale === 'pt' ? '"Perguntei sobre a cólica da Sofia e o Wilbor me ensinou a técnica I-L-U com instruções passo a passo. Funcionou na primeira tentativa. Chorei de alívio."' :
                 locale === 'es' ? '"Le pregunté sobre los cólicos de Sofía y Wilbor me enseñó la técnica I-L-U paso a paso. Funcionó en el primer intento. Lloré de alivio."' :
                 locale === 'fr' ? '"J\'ai demandé à propos des coliques de Sofia et Wilbor m\'a appris la technique I-L-U étape par étape. Ça a marché du premier coup. J\'ai pleuré de soulagement."' :
                 locale === 'de' ? '"Ich fragte nach Sofias Koliken und Wilbor lehrte mir die I-L-U-Technik Schritt für Schritt. Es funktionierte beim ersten Versuch. Ich weinte vor Erleichterung."' :
                 '"I asked about Sofia\'s colic and Wilbor taught me the I-L-U technique step by step. It worked on the first try. I cried with relief."'}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663323996241/OFCmCrGseirhncuu.png" alt="Ana Beatriz" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Ana Beatriz S.</p>
                  <p className="text-gray-500 text-xs">{locale === 'pt' ? 'Mãe da Sofia, 2 meses — Belo Horizonte' : locale === 'es' ? 'Mamá de Sofía, 2 meses — Belo Horizonte' : locale === 'fr' ? 'Maman de Sofia, 2 mois — Belo Horizonte' : locale === 'de' ? 'Mutter von Sofia, 2 Monate — Belo Horizonte' : 'Mother of Sofia, 2 months — Belo Horizonte'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section Otimizada */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">{t("faq.h2")}</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-gray-900">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Blindado */}
      <footer className="bg-gray-900 text-gray-400 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-8 h-8 text-purple-500 fill-purple-500" />
                <span className="text-2xl font-bold text-white">Wilbor</span>
              </div>
              <p className="text-sm leading-relaxed">{t("footer.tagline")}</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.product")}</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href={localePath("/blog")}><a className="hover:text-white transition-colors">{t("footer.blog")}</a></Link></li>
                <li><Link href={localePath("/pricing")}><a className="hover:text-white transition-colors">{t("footer.pricing")}</a></Link></li>
                <li><Link href={localePath("/faq")}><a className="hover:text-white transition-colors">{t("footer.faq")}</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.legal")}</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href={localePath("/privacy")}><a className="hover:text-white transition-colors">{t("footer.privacy")}</a></Link></li>
                <li><Link href={localePath("/terms")}><a className="hover:text-white transition-colors">{t("footer.terms")}</a></Link></li>
                <li><Link href={localePath("/contact")}><a className="hover:text-white transition-colors">{t("footer.contact")}</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.social")}</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com/wilbor.assist" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                  <Smile className="w-5 h-5 text-white" />
                </a>
                <a href="https://wa.me/5512997999971" target="_blank" rel="noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>{t("footer.copyright")}</p>
            <p className="max-w-md text-center md:text-right opacity-50">{t("footer.disclaimer")}</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
