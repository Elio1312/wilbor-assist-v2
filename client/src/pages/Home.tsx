import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart, Brain, Shield, Bell, Utensils, TrendingUp, Moon, BookOpen, Smile, Wind, Apple, Droplets, ChevronDown, Mail, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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

  const faqItems = [
    { q: "O Wilbor substitui o pediatra?", a: "Não. O Wilbor é um apoio neonatal digital. Em caso de emergência, procure atendimento presencial." },
    { q: "Como funcionam os planos do Wilbor?", a: "Temos 3 planos:\n\n🆓 VISITA LIVRE (Grátis): 5 consultas com IA/mês, Trilha de desenvolvimento, Alertas de emergência. Sem cartão.\n\n💜 PREMIUM (R$ 19,90/mês): 500 créditos IA/mês, Acesso completo, Memória do bebê. Se precisar de mais: compre extensão por R$ 9,90. Limite de segurança: máx R$ 10,00/mês em créditos extras.\n\n📚 MANUAL (R$ 29,90): Conteúdo completo sem IA, 55+ receitas, Exercícios pós-parto, Manuais SBP.\n\n💡 Dica: Premium é ideal para mães que querem IA inteligente com segurança financeira!" },
    { q: "É gratuito? Precisa de cartão?", a: "Sim, comece com 5 consultas grátis no plano Visita Livre. Sem cartão necessário." },
    { q: "Para qual idade é indicado?", a: "O Wilbor é indicado para bebês de 0 a 12 meses." },
    { q: "É baseado em protocolos confiáveis?", a: "Sim, todas as orientações seguem as recomendações oficiais da SBP, OMS e AAP." },
    { q: "Quando devo procurar atendimento médico imediatamente?", a: "Em caso de febre acima de 38°C, convulsões, sangramento ou dificuldade respiratória." },
    { q: "Posso usar em mais de um bebê?", a: "Sim! O Wilbor suporta gêmeos, trigêmeos e múltiplos bebês com perfis individuais." },
    { q: "Funciona em outros idiomas?", a: "Sim! O Wilbor está disponível em Português, Inglês e Espanhol." },
  ];

  const features = [
    { icon: Brain, title: "Chat 24h", desc: "Tire dúvidas em segundos" },
    { icon: Bell, title: "Alertas de Emergência", desc: "Detecta sinais de alerta" },
    { icon: Utensils, title: "Receitas por Idade", desc: "55 receitas com fotos" },
    { icon: TrendingUp, title: "Trilha de Desenvolvimento", desc: "Marcos semana a semana" },
    { icon: Moon, title: "Predição de Sono", desc: "Próxima soneca sugerida" },
    { icon: BookOpen, title: "Diário do Bebê", desc: "Registre momentos especiais" },
    { icon: Smile, title: "Perfil do Bebê", desc: "Respostas personalizadas" },
    { icon: Wind, title: "Técnicas de Cólica", desc: "Shantala, swaddle, I-L-U" },
  ];

  const motherFeatures = [
    { icon: Droplets, title: "Controle de Peso", desc: "Gráfico de evolução + IMC ideal" },
    { icon: Heart, title: "Exercícios em Casa", desc: "Rotinas por fase pós-parto" },
    { icon: Apple, title: "Alimentação", desc: "Emagrecer amamentando" },
    { icon: Shield, title: "Cuidados & Produtos", desc: "Estrias, cabelo, pele" },
  ];

  const plans = [
    {
      name: "Visita Livre",
      price: "Grátis",
      desc: "Conheça sem compromisso",
      features: [
        "5 consultas completas com IA",
        "Trilha de desenvolvimento",
        "Alertas de emergência",
        "Acesso básico ao chat",
      ],
    },
    {
      name: "Premium",
      price: "R$ 19,90",
      period: "/mês",
      desc: "Acesso completo + IA com 500 créditos/mês",
      popular: true,
      features: [
        "Tudo do plano Manual",
        "Chat IA com 500 créditos/mês",
        "Memória do bebê (histórico)",
        "Predição de sono inteligente",
        "Alertas de emergência",
        "Suporte prioritário",
      ],
    },
    {
      name: "Manual",
      price: "R$ 29,90",
      desc: "Conteúdo completo, sem IA",
      features: [
        "55+ receitas com fotos",
        "Exercícios pós-parto",
        "Manuais SBP completos",
        "Trilha de desenvolvimento",
        "Diário do bebê",
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
            <Link href="/blog">
              <a className="text-gray-600 hover:text-gray-900 font-medium">Blog</a>
            </Link>
            {isAuthenticated ? (
              <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
            ) : (
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = getLoginUrl()}>
                Entrar
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
                ✨ Seu companheiro de maternidade
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Você não está sozinha nessa jornada.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Wilbor é um <span className="font-semibold text-purple-600">apoio inteligente digital baseado em protocolos SBP/OMS/AAP</span> que lembra de cada detalhe do seu bebê e responde com carinho, sem julgamentos.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg h-14 rounded-full"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Testar grátis agora <ArrowRight className="ml-2 w-5 h-5" />
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
                Sem cadastro obrigatório
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Resposta em segundos
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Baseado em SBP/OMS/AAP
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Acompanhe cada fase do seu bebê</h2>
            <p className="text-xl text-gray-600">Alertas inteligentes e monitoramento em tempo real</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">A diferença que Wilbor faz</h2>
            <p className="text-xl text-gray-600">Veja como a vida muda com o apoio certo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                <span>❌</span> Antes do Wilbor
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Pânico às 3 da manhã procurando no Google</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>47 abas abertas sobre introdução alimentar</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Esquecendo datas importantes de vacinas</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Se sentindo julgada em grupos de mães</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Gastando R$200+ em consultas desnecessárias</span></li>
                <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Noites sem dormir de preocupação</span></li>
              </ul>
            </div>

            {/* After */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <span>✅</span> Com Wilbor
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>Chat que responde em segundos, 24h</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>Guia completo em um único lugar</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>Alertas automáticos de vacinas</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>IA que não julga, apenas apoia</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>Economiza R$200+ em consultas</span></li>
                <li className="flex gap-3"><span className="text-green-500 font-bold">•</span><span>Dorme tranquila com respostas confiáveis</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Para o seu bebê</h2>
            <p className="text-xl text-gray-600">Funcionalidades pensadas em cada fase do desenvolvimento</p>
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
              ✨ Novo
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">E você, mamãe?</h2>
            <p className="text-xl text-gray-600">Também merecia cuidado. Recupere seu corpo, cuide da sua saúde</p>
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
              onClick={() => window.location.href = getLoginUrl()}
            >
              Acessar "Meu Corpo" <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que as mães dizem</h2>
            <p className="text-xl text-gray-600">Resultados reais de quem usa o Wilbor</p>
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
            ✓ Conteúdo validado
          </div>
          <h2 className="text-4xl font-bold mb-6">Baseado nas diretrizes da SBP, OMS e AAP</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Todas as orientações seguem as recomendações oficiais da Sociedade Brasileira de Pediatria, Organização Mundial da Saúde e Academia Americana de Pediatria.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">384+</div>
              <div className="text-sm text-white/80">Perguntas trilíngues</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">55+</div>
              <div className="text-sm text-white/80">Receitas com fotos</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-white/80">Baseado em evidências</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos simples e transparentes</h2>
            <p className="text-xl text-gray-600">Escolha o que funciona melhor para você</p>
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
                    Mais popular
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
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Começar agora
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
              Todos os planos incluem: Sem cartão obrigatório · Cancele quando quiser · Suporte por email
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dúvidas frequentes</h2>
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
            <h2 className="text-4xl font-bold mb-6">Pronta para essa jornada?</h2>
            <p className="text-xl text-white/90 mb-8">
              Milhares de mães já confiam no Wilbor. Você também pode começar hoje, sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg h-14 rounded-full font-semibold"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Começar agora <ArrowRight className="ml-2 w-5 h-5" />
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
              <p className="text-sm">Apoio inteligente digital 24h, baseado em SBP/OMS/AAP</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog"><a className="hover:text-white">Blog</a></Link></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Redes</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.instagram.com/wilbor.assist" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
                <li><a href="https://wa.me/5512997999971" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Wilbor. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
