import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Check, ChevronDown, Brain, Bell, Utensils, TrendingUp, Moon, BookOpen, Smile, Wind, Droplets, Apple, Shield, Mail } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useI18n } from "@/contexts/i18n";
import { getLoginUrl } from "@/const";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState, useMemo } from "react";
import { getAnonymousSessionId } from "@/lib/anonymousSession";

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
        { q: "Como funcionam os planos do Wilbor?", a: "Temos 3 planos: VISITA LIVRE (Grátis): 5 consultas com IA/mês. PREMIUM (R$ 29,00/mês): 500 créditos IA/mês. MANUAL (R$ 45,00): Conteúdo completo sem IA." },
        { q: "É gratuito? Precisa de cartão?", a: "Sim, comece com 5 consultas grátis no plano Visita Livre. Sem cartão necessário." },
        { q: "Para qual idade é indicado?", a: "O Wilbor é indicado para bebês de 0 a 12 meses." },
        { q: "É baseado em protocolos confiáveis?", a: "Sim, todas as orientações seguem as recomendações oficiais da SBP, OMS e AAP." },
        { q: "Quando devo procurar atendimento médico imediatamente?", a: "Em caso de febre acima de 38°C, convulsões, sangramento ou dificuldade respiratória." },
        { q: "Posso usar em mais de um bebê?", a: "Sim! O Wilbor suporta gêmeos, trigêmeos e múltiplos bebês com perfis individuais." },
        { q: "Funciona em outros idiomas?", a: "Sim! O Wilbor está disponível em Português, Inglês, Espanhol, Francês e Alemão." },
      ],
      en: [
        { q: "Does Wilbor replace a pediatrician?", a: "No. Wilbor is digital neonatal support based on AAP/WHO. In case of emergency, seek in-person care." },
        { q: "How do Wilbor plans work?", a: "We have 3 plans: FREE VISIT: 5 AI consultations/month. PREMIUM ($9.00/mo): 500 AI credits/month. MANUAL ($14.00): Full content without AI." },
        { q: "Is it free? Do I need a credit card?", a: "Yes, start with 5 free consultations on the Free Visit plan. No credit card required." },
        { q: "What age range is it for?", a: "Wilbor is designed for babies from 0 to 12 months." },
        { q: "Is it based on reliable protocols?", a: "Yes, all guidance follows official recommendations from AAP, WHO, and SBP." },
        { q: "When should I seek immediate medical attention?", a: "In case of fever above 100.4°F (38°C), seizures, bleeding, or difficulty breathing." },
        { q: "Can I use it for more than one baby?", a: "Yes! Wilbor supports twins, triplets, and multiple babies with individual profiles." },
        { q: "Does it work in other languages?", a: "Yes! Wilbor is available in Portuguese, English, Spanish, French and German." },
      ],
      es: [
        { q: "¿Wilbor reemplaza al pediatra?", a: "No. Wilbor es apoyo neonatal digital. En caso de emergencia, busque atención presencial." },
        { q: "¿Cómo funcionan los planes de Wilbor?", a: "Tenemos 3 planes: VISITA LIBRE (Gratis): 5 consultas IA/mes. PREMIUM ($9.00/mes): 500 créditos IA/mes. MANUAL ($14.00): Contenido completo sin IA." },
        { q: "¿Es gratis? ¿Necesito tarjeta?", a: "Sí, empieza con 5 consultas gratis en el plan Visita Libre. Sin tarjeta necesaria." },
        { q: "¿Para qué edad está indicado?", a: "Wilbor está diseñado para bebés de 0 a 12 meses." },
        { q: "¿Está basado en protocolos confiables?", a: "Sí, todas las orientaciones siguen las recomendaciones oficiales de AAP, OMS y SBP." },
        { q: "¿Cuándo debo buscar atención médica inmediata?", a: "En caso de fiebre superior a 38°C, convulsiones, sangrado o dificultad respiratoria." },
        { q: "¿Puedo usarlo para más de un bebé?", a: "¡Sí! Wilbor soporta gemelos, trillizos y múltiples bebés con perfiles individuales." },
        { q: "¿Funciona en otros idiomas?", a: "¡Sí! Wilbor está disponible en Portugués, Inglés, Español, Francés y Alemán." },
      ],
      fr: [
        { q: "Wilbor remplace-t-il le pédiatre ?", a: "Non. Wilbor est un soutien néonatal numérique. En cas d'urgence, consultez un médecin en personne." },
        { q: "Comment fonctionnent les abonnements Wilbor ?", a: "Nous avons 3 plans : VISITE LIBRE (Gratuit) : 5 consultations IA/mois. PREMIUM (9,00€/mois) : 500 réponses IA/mois. MANUEL (14,00€) : Contenu complet sans IA." },
        { q: "Est-ce gratuit ? Ai-je besoin d'une carte bancaire ?", a: "Oui, commencez avec 5 consultations gratuites. Aucune carte bancaire requise." },
        { q: "Pour quelle tranche d'âge est-il indiqué ?", a: "Wilbor est conçu pour les bébés de 0 à 12 mois." },
        { q: "Est-il basé sur des protocoles fiables ?", a: "Oui, toutes les recommandations suivent les directives officielles de l'AAP, de l'OMS et de la SFP." },
        { q: "Quand dois-je consulter un médecin immédiatement ?", a: "En cas de fièvre supérieure à 38°C, convulsions, saignements ou difficultés respiratoires." },
        { q: "Puis-je l'utiliser pour plusieurs bébés ?", a: "Oui ! Wilbor supporte les jumeaux, triplettes et plusieurs bébés avec des profils individuels." },
        { q: "Fonctionne-t-il dans d'autres langues ?", a: "Oui ! Wilbor est disponible en Portugais, Anglais, Espagnol, Français et Allemand." },
      ],
      de: [
        { q: "Ersetzt Wilbor den Kinderarzt?", a: "Nein. Wilbor ist digitale neonatale Unterstützung. Im Notfall suchen Sie bitte einen Arzt auf." },
        { q: "Wie funktionieren die Wilbor-Pläne?", a: "Wir haben 3 Pläne: FREIER BESUCH (Kostenlos): 5 KI-Beratungen/Monat. PREMIUM (9,00€/Monat): 500 Antworten/Monat. HANDBUCH (14,00€): Vollständiger Inhalt ohne KI." },
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

  const chatHref = localePath("/chat");
  const checkoutHref = localePath("/checkout");

  const warmAnonymousSession = () => {
    try {
      getAnonymousSessionId();
    } catch (error) {
      console.warn("Failed to initialize anonymous session before navigation", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* WhatsApp Floating Button */}
      <WhatsAppButton 
        phoneNumber="+55 12 997999971"
        message="Olá! Gostaria de conhecer o Wilbor"
        variant="floating"
      />

      {/* Header Blindado */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href={localePath("/")} className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-8 h-8 text-purple-600 fill-purple-600" />
            <span className="text-xl font-bold text-gray-900">Wilbor</span>
          </a>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button 
              asChild
              variant="ghost" 
              className="hidden md:flex"
            >
              <a href={localePath("/blog")}>{t("nav.blog")}</a>
            </Button>
            {user ? (
              <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full px-6">
                <a href={localePath("/dashboard")}>{t("nav.dashboard")}</a>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <a href={getLoginUrl()}>{t("nav.enter")}</a>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full px-6">
                  <a href={chatHref} onClick={warmAnonymousSession}>{t("nav.try_free")}</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section Otimizada para Conversão */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
              <Check className="w-4 h-4" /> {t("hero.badge")}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
              {t("hero.h1")}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {t("hero.desc")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-16 px-8 rounded-full text-lg shadow-xl hover:scale-105 transition-transform"
              >
                <a href={chatHref} onClick={warmAnonymousSession}>
                  {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <WhatsAppButton 
                phoneNumber="+55 12 997999971"
                message="Olá! Gostaria de conhecer o Wilbor"
                variant="fixed" 
                className="h-16 border-2 border-purple-200 text-purple-700 hover:bg-purple-50" 
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-purple-200 blur-3xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity" />
            <img 
              src={IMAGES.hero} 
              alt={t("hero.mockup_alt")}
              className="relative rounded-3xl shadow-2xl border-8 border-white"
              loading="eager"
              width="1200"
              height="800"
            />
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
                <a href={chatHref} onClick={warmAnonymousSession}>{t("mother.cta")}</a>
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
                  <a href={checkoutHref}>{t("pricing.cta")}</a>
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
  );
}
