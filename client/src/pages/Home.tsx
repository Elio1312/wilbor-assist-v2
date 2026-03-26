import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart, Brain, Shield, Bell, Utensils, TrendingUp, Moon, BookOpen, Smile, Wind, Apple, Droplets, ChevronDown, Mail, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useI18n } from "@/contexts/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
  const isAuthenticated = !!user;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const loginUrl = getLoginUrl();
  const { t, locale, localePath } = useI18n();

  const faqItemsPt = [
    { q: "O Wilbor substitui o pediatra?", a: "Não. O Wilbor é um apoio neonatal digital. Em caso de emergência, procure atendimento presencial." },
    { q: "Como funcionam os planos do Wilbor?", a: "Temos 3 planos: VISITA LIVRE (Grátis): 5 consultas com IA/mês. PREMIUM (R$ 19,90/mês): 500 créditos IA/mês. MANUAL (R$ 29,90): Conteúdo completo sem IA." },
    { q: "É gratuito? Precisa de cartão?", a: "Sim, comece com 5 consultas grátis no plano Visita Livre. Sem cartão necessário." },
    { q: "Para qual idade é indicado?", a: "O Wilbor é indicado para bebês de 0 a 12 meses." },
    { q: "É baseado em protocolos confiáveis?", a: "Sim, todas as orientações seguem as recomendações oficiais da SBP, OMS e AAP." },
    { q: "Quando devo procurar atendimento médico imediatamente?", a: "Em caso de febre acima de 38°C, convulsões, sangramento ou dificuldade respiratória." },
    { q: "Posso usar em mais de um bebê?", a: "Sim! O Wilbor suporta gêmeos, trigêmeos e múltiplos bebês com perfis individuais." },
    { q: "Funciona em outros idiomas?", a: "Sim! O Wilbor está disponível em Português, Inglês e Espanhol." },
  ];
  const faqItemsEn = [
    { q: "Does Wilbor replace a pediatrician?", a: "No. Wilbor is digital neonatal support. In case of emergency, seek in-person care." },
    { q: "How do Wilbor plans work?", a: "We have 3 plans: FREE VISIT: 5 AI consultations/month. PREMIUM ($9.90/mo): 500 AI credits/month. MANUAL ($14.90): Full content without AI." },
    { q: "Is it free? Do I need a credit card?", a: "Yes, start with 5 free consultations on the Free Visit plan. No credit card required." },
    { q: "What age range is it for?", a: "Wilbor is designed for babies from 0 to 12 months." },
    { q: "Is it based on reliable protocols?", a: "Yes, all guidance follows official recommendations from AAP, WHO, and SBP." },
    { q: "When should I seek immediate medical attention?", a: "In case of fever above 100.4°F (38°C), seizures, bleeding, or difficulty breathing." },
    { q: "Can I use it for more than one baby?", a: "Yes! Wilbor supports twins, triplets, and multiple babies with individual profiles." },
    { q: "Does it work in other languages?", a: "Yes! Wilbor is available in Portuguese, English, and Spanish." },
  ];
  const faqItemsEs = [
    { q: "¿Wilbor reemplaza al pediatra?", a: "No. Wilbor es apoyo neonatal digital. En caso de emergencia, busque atención presencial." },
    { q: "¿Cómo funcionan los planes de Wilbor?", a: "Tenemos 3 planes: VISITA LIBRE (Gratis): 5 consultas IA/mes. PREMIUM ($9.90/mes): 500 créditos IA/mes. MANUAL ($14.90): Contenido completo sin IA." },
    { q: "¿Es gratis? ¿Necesito tarjeta?", a: "Sí, empieza con 5 consultas gratis en el plan Visita Libre. Sin tarjeta necesaria." },
    { q: "¿Para qué edad está indicado?", a: "Wilbor está diseñado para bebés de 0 a 12 meses." },
    { q: "¿Está basado en protocolos confiables?", a: "Sí, todas las orientaciones siguen las recomendaciones oficiales de AAP, OMS y SBP." },
    { q: "¿Cuándo debo buscar atención médica inmediata?", a: "En caso de fiebre superior a 38°C, convulsiones, sangrado o dificultad respiratoria." },
    { q: "¿Puedo usarlo para más de un bebé?", a: "¡Sí! Wilbor soporta gemelos, trillizos y múltiples bebés con perfiles individuales." },
    { q: "¿Funciona en otros idiomas?", a: "¡Sí! Wilbor está disponible en Portugués, Inglés y Español." },
  ];
  const faqItems = locale === "en" ? faqItemsEn : locale === "es" ? faqItemsEs : faqItemsPt;

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

  return (
    <div className="min-h-screen bg-white">
      {/* WhatsApp Floating Button */}
      <WhatsAppButton 
        phoneNumber="+55 12 997999971"
        message="Olá! Gostaria de conhecer o Wilbor"
        variant="floating"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-purple-600 fill-purple-600" />
            <span className="text-xl font-bold text-gray-900">Wilbor</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href={localePath("/blog")}>
              <a className="text-gray-600 hover:text-gray-900 font-medium">{t("nav.blog")}</a>
            </Link>
            {isAuthenticated ? (
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = localePath('/dashboard')}>{t("nav.dashboard")}</Button>
            ) : (
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = localePath('/chat')}>
                {t("nav.enter")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION - COM IMAGEM ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Texto + CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                {t("hero.badge")}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t("hero.h1")}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t("hero.desc")}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg h-14 rounded-full"
                onClick={() => window.location.href = localePath('/chat')}
              >
                {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <WhatsAppButton 
                phoneNumber="+55 12 997999971"
                message="Olá! Gostaria de conhecer o Wilbor"
                variant="fixed"
                className="text-base h-14"
              />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                {t("hero.trust_1")}
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                {t("hero.trust_2")}
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                {t("hero.trust_3")}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img 
              src={IMAGES.hero} 
              alt="Wilbor - Assistente Neonatal IA com Sleep Tracker, Feeding Tracker e Panic Button" 
              className="rounded-3xl shadow-2xl w-full"
              loading="eager"
              width="1920"
              height="1080"
            />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* ===== GROWTH CRISES + SLEEP TRACKER SECTION ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("trackers.h2")}</h2>
            <p className="text-xl text-gray-600">{t("trackers.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Growth Crises */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={IMAGES.growth} 
                alt="Infográfico Crises de Crescimento do Bebê - 1, 3, 6 e 12 meses com alertas Wilbor" 
                className="w-full"
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>

            {/* Sleep Tracker */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={IMAGES.sleep} 
                alt="Wilbor Sleep Tracker - Monitoramento de sono do bebê com previsão de próxima soneca" 
                className="w-full"
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEEDING TRACKER + EXERCISES SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feeding Tracker */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={IMAGES.feeding} 
                alt="Wilbor Feeding Tracker - Controle de mamadas com timer e histórico diário" 
                className="w-full"
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>

            {/* Postpartum Exercises */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={IMAGES.exercises} 
                alt="Exercícios pós-parto com Wilbor - Recuperação e vínculo mãe-bebê" 
                className="w-full"
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== BEFORE/AFTER SECTION ===== */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("compare.h2")}</h2>
            <p className="text-xl text-gray-600">{t("compare.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                <span>❌</span> {t("compare.before")}
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_1")}</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_2")}</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_3")}</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_4")}</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_5")}</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>{t("compare.before_6")}</span></li>
              </ul>
            </div>

            {/* After */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <span>✅</span> {t("compare.after")}
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_1")}</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_2")}</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_3")}</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_4")}</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_5")}</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>{t("compare.after_6")}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("features.h2")}</h2>
            <p className="text-xl text-gray-600">{t("features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOTHER FEATURES SECTION ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t("mother.badge")}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("mother.h2")}</h2>
            <p className="text-xl text-gray-600">{t("mother.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {motherFeatures.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg h-14 rounded-full"
              onClick={() => window.location.href = localePath('/checkout')}
            >
              {t("mother.cta")} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("testimonials.h2")}</h2>
            <p className="text-xl text-gray-600">{t("testimonials.subtitle")}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={IMAGES.testimonials} 
              alt="Depoimentos de mães que usam Wilbor - Growth Crises, Sleep Tracker e Panic Button" 
              className="w-full"
              loading="lazy"
              width="1200"
              height="600"
            />
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY SECTION ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-6xl mx-auto text-white text-center">
          <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t("credibility.badge")}
          </div>
          <h2 className="text-4xl font-bold mb-6">{t("credibility.h2")}</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            {t("credibility.desc")}
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">{t("credibility.stat_1")}</div>
              <div className="text-sm text-white/80">{t("credibility.stat_1_label")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">{t("credibility.stat_2")}</div>
              <div className="text-sm text-white/80">{t("credibility.stat_2_label")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">{t("credibility.stat_3")}</div>
              <div className="text-sm text-white/80">{t("credibility.stat_3_label")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("pricing.h2")}</h2>
            <p className="text-xl text-gray-600">{t("pricing.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`rounded-2xl p-8 transition-all ${
                  plan.popular 
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105" 
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {t("pricing.premium_popular")}
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.popular ? "text-white/80" : "text-gray-600"}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.popular ? "text-white/90" : "text-gray-600"}`}>{plan.desc}</p>

                <Button 
                  size="lg"
                  className={`w-full mb-8 h-12 rounded-full font-semibold ${
                    plan.popular 
                      ? "bg-white text-purple-600 hover:bg-gray-100" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  onClick={() => window.location.href = localePath('/checkout')}
                >
                  {t("pricing.cta")}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex gap-3 items-start">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-white" : "text-green-600"}`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              {t("pricing.footer")}
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("faq.h2")}</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">{item.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 border-t border-gray-200 whitespace-pre-line">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA WITH IMAGE ===== */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">{t("final_cta.h2")}</h2>
            <p className="text-xl text-white/90 mb-8">
              {t("final_cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg h-14 rounded-full font-semibold"
                onClick={() => window.location.href = localePath('/checkout')}
              >
                {t("pricing.cta")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <WhatsAppButton 
                phoneNumber="+55 12 997999971"
                message="Olá! Gostaria de conhecer o Wilbor"
                variant="fixed"
                className="text-base h-14 border-2 border-white text-white hover:bg-white/10"
              />
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src={IMAGES.cta} 
              alt="Comece sua jornada com Wilbor - Sleep Tracker, Feeding Tracker, Panic Button e WhatsApp" 
              className="rounded-2xl shadow-2xl w-full opacity-90"
              loading="lazy"
              width="1200"
              height="600"
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
                <span className="font-bold text-white">Wilbor</span>
              </div>
              <p className="text-sm">{t("footer.tagline")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href={localePath("/blog")}><a className="hover:text-white">{t("footer.blog")}</a></Link></li>
                <li><a href="#" className="hover:text-white">{t("footer.pricing")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.faq")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">{t("footer.privacy")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.terms")}</a></li>
                <li><a href="#" className="hover:text-white">{t("footer.contact")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.social")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.instagram.com/wilbor.assist" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
                <li><a href="https://wa.me/5512997999971" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
