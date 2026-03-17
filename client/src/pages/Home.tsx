import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Heart, Brain, Shield, Bell, Utensils, TrendingUp, Moon, BookOpen, Smile, Wind, Apple, Droplets, ChevronDown, Mail } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const faqItems = [
    { q: "O Wilbor substitui o pediatra?", a: "Não. O Wilbor é um apoio neonatal digital. Em caso de emergência, procure atendimento presencial." },
    { q: "É gratuito? Precisa de cartão?", a: "Sim, comece com 2 consultas grátis. Sem cartão para o plano Visita Livre." },
    { q: "Para qual idade é indicado?", a: "O Wilbor é indicado para bebês de 0 a 12 meses." },
    { q: "É baseado em protocolos confiáveis?", a: "Sim, todas as orientações seguem as recomendações oficiais da SBP, OMS e AAP." },
    { q: "Quando devo procurar atendimento médico imediatamente?", a: "Em caso de febre acima de 38°C, convulsões, sangramento ou dificuldade respiratória." },
    { q: "Posso usar em mais de um bebê?", a: "Sim! O Wilbor suporta gêmeos, trigêmeos e múltiplos bebês com perfis individuais." },
    { q: "Funciona em outros idiomas?", a: "Sim! O Wilbor está disponível em Português, Inglês e Espanhol." },
  ];

  const features = [
    { icon: Brain, title: "Chat 24h", desc: "Tire dúvidas em segundos" },
    { icon: Bell, title: "Alertas de Emergência", desc: "Detecta sinais de alerta" },
    { icon: Utensils, title: "Receitas por Idade", desc: "50 receitas com fotos" },
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
        "2 consultas completas com IA",
        "Receitas e exercícios",
        "Trilha de desenvolvimento",
        "Diário do bebê",
      ],
    },
    {
      name: "Premium",
      price: "R$ 19,90",
      period: "/mês",
      desc: "Acesso completo + IA ilimitada",
      popular: true,
      trial: "5 dias grátis para testar",
      features: [
        "Tudo do plano Manual",
        "Chat IA ilimitado 24h",
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
        "50+ receitas com fotos",
        "Exercícios pós-parto",
        "Manuais SBP completos",
        "Trilha de desenvolvimento",
        "Diário do bebê",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-purple-600 fill-purple-600" />
            <span className="text-xl font-bold text-gray-900">Wilbor</span>
          </div>
          {isAuthenticated ? (
            <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
          ) : (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href = getLoginUrl()}>
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 text-center">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IAs respondem genericamente.</h1>
          <p className="text-2xl font-bold text-purple-600 mb-6">Wilbor lembra que seu filho teve cólica semana passada.</p>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            O Wilbor tem <strong>memória exclusiva do seu bebê</strong>. Ele sabe o nome, a idade, o histórico de conversas e as condições especiais. Cada resposta é personalizada — não é uma IA genérica.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Banco de dados SBP</span>
            </div>
            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Memória por bebê</span>
            </div>
            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Alertas de vacinas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Baseado em SBP Section */}
      <section className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-block bg-white/20 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-medium">Conteúdo validado</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Baseado nas diretrizes da SBP, OMS e AAP</h2>
            <p className="text-lg opacity-90 mb-6">
              Todas as orientações seguem as recomendações oficiais da Sociedade Brasileira de Pediatria (SBP), Organização Mundial da Saúde (OMS) e Academia Americana de Pediatria (AAP).
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold mb-2">100%</div>
            <p className="text-lg opacity-90">Baseado em evidências</p>
            <div className="mt-8 text-4xl font-bold">0-12</div>
            <p className="text-lg opacity-90">meses de cobertura</p>
          </div>
        </div>
      </section>

      {/* Meu Corpo Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block text-green-600 mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">E você, mamãe?</h2>
          <p className="text-2xl font-bold text-green-600">Também merece cuidado.</p>
          <p className="text-gray-700 mt-4">Recupere seu corpo, cuide da sua saúde e sinta-se bem consigo mesma — sem culpa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {motherFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition">
              <feature.icon className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button className="bg-green-600 hover:bg-green-700 rounded-full px-8 py-6 text-lg">
            ❤️ Acessar "Meu Corpo"
          </Button>
          <p className="text-sm text-gray-600 mt-4">Calculadora de calorias • Exercícios por fase • Dicas de produtos</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
              <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Teste grátis agora</h3>
          <p className="text-gray-600 mb-8">Sem cartão. Sem compromisso. Pergunte o que quiser sobre seu bebê.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6 text-lg">
            Começar agora — é grátis →
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-purple-900 to-purple-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-white/20 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-medium">Escolha seu plano</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Invista no cuidado do seu bebê</h2>
            <p className="text-lg opacity-90">Comece com 2 consultas grátis. Depois, escolha o plano ideal para você.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition transform hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-purple-400 relative"
                    : "bg-purple-800/50 border border-purple-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                      Mais popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="opacity-75">{plan.period}</span>}
                  </div>
                  <p className="text-sm opacity-75">{plan.desc}</p>
                  {plan.trial && <p className="text-sm text-purple-200 mt-2">{plan.trial}</p>}
                </div>
                <Button
                  className={`w-full rounded-full py-3 font-bold mb-6 ${
                    plan.popular
                      ? "bg-white text-purple-900 hover:bg-gray-100"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Escolher plano
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Dúvidas frequentes</h2>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 text-left">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition transform ${expandedFaq === idx ? "rotate-180" : ""}`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ainda com dúvida?</h2>
          <p className="text-gray-600">Envie sua pergunta. Responderemos em até 24 horas.</p>
        </div>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <textarea
            placeholder="Sua dúvida..."
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-3 text-lg">
            Enviar pergunta →
          </Button>
        </form>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Sua dúvida não pode esperar mais.</h2>
          <p className="text-lg opacity-90 mb-8">Pergunte agora. Wilbor responde na hora, com base na SBP.</p>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-bold">
            Falar com o Wilbor agora →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
              <span className="text-lg font-bold">Wilbor-Assist</span>
            </div>
            <p className="text-gray-400">Sua IA Assistente neonatal digital. Baseado nos protocolos da SBP.</p>
          </div>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">📷</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">👍</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <span className="text-2xl">💬</span>
            </a>
          </div>
          <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition">Termos de Uso</a>
            <a href="#" className="hover:text-white transition">Blog</a>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>O Wilbor é apoio neonatal e não substitui avaliação médica. Em caso de emergência, procure atendimento presencial.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5512997999971"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition transform hover:scale-110"
      >
        <span className="text-2xl">💬</span>
      </a>
    </div>
  );
}
