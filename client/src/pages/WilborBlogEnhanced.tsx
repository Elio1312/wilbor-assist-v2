import { useLocation, useRoute, Link } from "wouter";
import { Heart, ArrowRight, ArrowLeft, Share2, Clock, BookOpen, Moon, Waves, Thermometer, UtensilsCrossed, HeartPulse, CheckCircle2, Shield, Sparkles, Syringe, Baby, ShieldCheck, TrendingUp, Bath, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

// ==========================================
// ENHANCED BLOG ARTICLES WITH WILBOR CONTEXT
// ==========================================

export interface EnhancedBlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
  keywords: string[];
  schemaFAQ: { question: string; answer: string }[];
  // NEW: Wilbor integration
  wilborFeature?: "sleep" | "feeding" | "growth" | "diary" | "panic";
  wilborCTA?: string;
  wilborLink?: string;
  relatedArticles?: string[]; // slugs of related articles
}

export const ENHANCED_BLOG_ARTICLES: EnhancedBlogArticle[] = [
  {
    slug: "bebe-nao-dorme",
    title: "Bebê não dorme: guia completo por idade (0 a 12 meses)",
    metaTitle: "Bebê não dorme: guia completo por idade | Wilbor-Assist",
    metaDescription: "Seu bebê não dorme? Guia completo com janelas de sono, rotinas e técnicas por idade (0-12 meses). Baseado nos protocolos da SBP e AAP.",
    icon: Moon,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    readTime: "8 min",
    category: "Sono",
    excerpt: "Entenda as janelas de sono do seu bebê por idade e aprenda técnicas comprovadas para melhorar as noites.",
    keywords: ["bebê não dorme", "sono do bebê", "janela de sono", "rotina de sono bebê", "bebê acorda de madrugada"],
    schemaFAQ: [
      { question: "Quantas horas um recém-nascido deve dormir?", answer: "Um recém-nascido dorme entre 16 e 18 horas por dia, em ciclos curtos de 2 a 4 horas, sem distinção entre dia e noite." },
      { question: "O que é janela de sono?", answer: "Janela de sono é o tempo máximo que o bebê consegue ficar acordado sem ficar irritado. Varia de 45-60 minutos no recém-nascido até 3-4 horas aos 12 meses." },
      { question: "Como fazer o bebê dormir a noite toda?", answer: "A partir dos 4-6 meses, estabeleça uma rotina consistente: banho, mamada, história, escurecer o quarto. Evite estímulos 30 minutos antes de dormir." },
      { question: "Como o Wilbor ajuda com o sono do bebê?", answer: "O Sleep Tracker do Wilbor calcula automaticamente as janelas de sono do seu bebê por idade e envia alertas quando é a hora ideal para dormir. Você registra cada soneca e Wilbor prevê a próxima com 100% de precisão." },
    ],
    content: `## Por que meu bebê não dorme?

O sono do bebê é uma das maiores preocupações das mães brasileiras. Segundo a **Sociedade Brasileira de Pediatria (SBP)**, os padrões de sono variam significativamente conforme a idade, e entender essas fases é o primeiro passo para noites mais tranquilas.

## Janelas de sono por idade

A **janela de sono** é o tempo máximo que seu bebê consegue ficar acordado antes de ficar irritado e ter dificuldade para dormir. Respeitar essa janela é fundamental.

| Idade | Janela de sono | Total de sono/dia | Sonecas |
|-------|---------------|-------------------|---------|
| 0-1 mês | 45-60 min | 16-18h | 4-6 |
| 1-2 meses | 60-90 min | 15-17h | 4-5 |
| 3-4 meses | 75-120 min | 14-16h | 3-4 |
| 5-6 meses | 2-2,5h | 14-15h | 2-3 |
| 7-9 meses | 2,5-3h | 13-14h | 2 |
| 10-12 meses | 3-4h | 12-14h | 1-2 |

## Sinais de sono

Fique atenta aos sinais que indicam que seu bebê está pronto para dormir:

- **Sinais iniciais:** esfregar os olhos, bocejar, olhar fixo, puxar a orelha
- **Sinais tardios:** choro, irritabilidade, movimentos bruscos, arqueamento das costas

**Dica importante:** Quando você percebe os sinais tardios, o bebê já passou do ponto ideal. Tente colocá-lo para dormir nos primeiros sinais.

## Técnicas para melhorar o sono

### Ambiente ideal
- **Temperatura:** entre 22°C e 24°C
- **Escuridão:** use cortinas blackout
- **Ruído branco:** ventilador, app de ruído branco ou "shhhh" contínuo
- **Posição:** sempre de barriga para cima (recomendação SBP/AAP)

### Rotina do sono (a partir de 2-3 meses)
1. Banho morno (não quente)
2. Massagem suave com movimentos lentos
3. Mamada em ambiente calmo e escuro
4. Canção de ninar ou ruído branco
5. Colocar no berço sonolento, mas acordado

### Regressão do sono (4 meses)
Por volta dos 4 meses, muitos bebês passam por uma **regressão do sono**. Isso acontece porque o padrão de sono está amadurecendo. É temporário (1-3 semanas) e faz parte do desenvolvimento normal.

## 💡 Wilbor Sleep Tracker: Seu Assistente de Sono

O **Sleep Tracker do Wilbor** transforma o registro de sono em inteligência acionável:

✅ **Calcula automaticamente** as janelas de sono do seu bebê por idade  
✅ **Envia alertas** quando é a hora ideal para dormir  
✅ **Prevê a próxima soneca** com 100% de precisão (baseado em tabelas científicas)  
✅ **Registra histórico** de todas as sonecas  
✅ **Mostra padrões** de sono do seu bebê  

**Como usar:**
1. Registre quando o bebê dormiu
2. Wilbor calcula a próxima janela de sono
3. Receba alertas 30 minutos antes
4. Seu bebê dorme melhor e você dorme tranquila!

[👉 Teste o Sleep Tracker Grátis](/wilbor/sleep)

## Quando procurar o pediatra

- Bebê ronca ou faz pausas na respiração durante o sono
- Não dorme mais de 30 minutos seguidos após os 4 meses
- Irritabilidade extrema que não melhora com nenhuma técnica
- Perda de peso ou recusa alimentar associada

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP) e American Academy of Pediatrics (AAP).`,
    wilborFeature: "sleep",
    wilborCTA: "Teste o Sleep Tracker Grátis",
    wilborLink: "/wilbor/sleep",
    relatedArticles: ["regressao-sono-4-meses", "bebe-acorda-noite", "ambiente-ideal-sono"],
  },
  {
    slug: "colica-do-bebe",
    title: "Cólica do bebê: o que fazer para aliviar (guia prático)",
    metaTitle: "Cólica do bebê: o que fazer para aliviar | Wilbor-Assist",
    metaDescription: "Bebê com cólica? Aprenda técnicas comprovadas para aliviar: massagem Shantala, posição aviãozinho, swaddle e mais. Baseado na SBP.",
    icon: Waves,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    readTime: "7 min",
    category: "Cólica",
    excerpt: "Técnicas comprovadas para aliviar a cólica: massagem Shantala, posição aviãozinho, swaddle e mais.",
    keywords: ["cólica do bebê", "bebê com cólica", "como aliviar cólica", "massagem para cólica", "bebê chorando"],
    schemaFAQ: [
      { question: "Quando começa a cólica do bebê?", answer: "A cólica geralmente começa entre 2 e 3 semanas de vida e pode durar até os 3-4 meses. Segue a 'regra dos 3': choro por mais de 3 horas, mais de 3 dias por semana, por mais de 3 semanas." },
      { question: "Massagem ajuda na cólica?", answer: "Sim. A massagem Shantala e os movimentos I-L-U no abdômen ajudam a aliviar gases e desconforto intestinal. Faça com o bebê calmo, não durante a crise." },
      { question: "Cólica é perigosa?", answer: "A cólica em si não é perigosa e é autolimitada. Porém, se houver febre, vômitos, sangue nas fezes ou recusa alimentar, procure o pediatra imediatamente." },
      { question: "Como o Wilbor ajuda com a cólica?", answer: "O Panic Button do Wilbor oferece respostas instantâneas durante crises de cólica. Além disso, o Diary permite registrar quando a cólica acontece para identificar padrões e gatilhos." },
    ],
    content: `## O que é cólica do bebê?

A cólica é definida pela **regra dos 3**: choro intenso por mais de **3 horas por dia**, mais de **3 dias por semana**, por mais de **3 semanas**. Afeta cerca de 20-25% dos bebês e geralmente começa entre 2-3 semanas de vida.

## Quando acontece

- **Início:** 2-3 semanas de vida
- **Pico:** 6-8 semanas
- **Fim:** geralmente aos 3-4 meses
- **Horário mais comum:** final da tarde e início da noite (17h-23h)

## Técnicas de alívio comprovadas

### 1. Massagem Shantala (I-L-U)
A técnica I-L-U é uma massagem abdominal que segue o trajeto do intestino:

1. **I** — Deslize a mão do lado esquerdo do bebê, de cima para baixo
2. **L** — Deslize da direita para a esquerda e depois para baixo (formando um L invertido)
3. **U** — Deslize de baixo para cima no lado direito, cruze por cima e desça pelo lado esquerdo (formando um U invertido)

**Quando fazer:** com o bebê calmo, antes da crise. Use óleo vegetal nas mãos.

### 2. Posição aviãozinho
Coloque o bebê de bruços sobre seu antebraço, com a cabeça apoiada na sua mão. A pressão suave no abdômen ajuda a aliviar os gases.

### 3. Swaddle (enrolamento)
Enrole o bebê firmemente em um pano ou cueiro, com os braços junto ao corpo. Simula o ambiente do útero e reduz o reflexo de Moro.

**Atenção:** pare de usar swaddle quando o bebê começar a rolar (por volta dos 2-3 meses).

### 4. Ruído branco + balanço
O "shhhh" contínuo próximo ao ouvido do bebê, combinado com um balanço suave, ativa o reflexo de calma. O som deve ser tão alto quanto o choro do bebê.

## 🚨 Wilbor Panic Button: Ajuda Instantânea

Durante uma crise de cólica, você precisa de respostas AGORA. O **Panic Button do Wilbor** oferece:

✅ **Respostas instantâneas** baseadas em protocolos médicos  
✅ **Técnicas de alívio** passo a passo  
✅ **Quando procurar o pediatra** (sinais de alerta)  
✅ **Suporte 24/7** sem julgamentos  

**Como usar:**
1. Quando a cólica começar, abra o Wilbor
2. Clique no Panic Button 🚨
3. Receba respostas instantâneas e técnicas de alívio
4. Você se sente mais segura e confiante

[👉 Teste o Panic Button Grátis](/wilbor/panic)

## 📔 Registre no Diary

Adicione cada crise de cólica ao seu **Diary do Wilbor**:
- Hora que começou
- Duração
- Técnicas que funcionaram
- Como você se sentiu

Isso ajuda a identificar padrões e gatilhos!

[👉 Abra seu Diary](/wilbor/diary)

## Quando procurar o pediatra

- Febre associada à cólica
- Vômitos ou sangue nas fezes
- Recusa alimentar
- Choro que não melhora com nenhuma técnica

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP).`,
    wilborFeature: "panic",
    wilborCTA: "Teste o Panic Button Grátis",
    wilborLink: "/wilbor/panic",
    relatedArticles: ["bebe-nao-dorme", "alimentacao-bebe", "desenvolvimento-bebe-3-meses"],
  },
];

// ==========================================
// BLOG COMPONENT
// ==========================================

export default function EnhancedWilborBlog() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/blog/:slug");

  if (match) {
    const article = ENHANCED_BLOG_ARTICLES.find(a => a.slug === params?.slug);
    
    if (!article) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
            <Button onClick={() => navigate("/blog")}>Voltar ao Blog</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </button>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${article.iconBg}`}>
                <article.icon className={`w-8 h-8 ${article.iconColor}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full border">{article.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none mb-8">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Wilbor CTA Card */}
          {article.wilborFeature && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {article.wilborCTA}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    O Wilbor oferece ferramentas inteligentes para ajudar você nessa situação. Teste grátis por 30 dias!
                  </p>
                  <Button 
                    onClick={() => navigate(article.wilborLink || "/wilbor")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Começar Agora <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Artigos Relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.relatedArticles.map(slug => {
                  const related = ENHANCED_BLOG_ARTICLES.find(a => a.slug === slug);
                  return related ? (
                    <Card 
                      key={slug}
                      className="p-4 hover:shadow-lg cursor-pointer transition-shadow"
                      onClick={() => navigate(`/blog/${slug}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${related.iconBg}`}>
                          <related.icon className={`w-5 h-5 ${related.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{related.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{related.readTime}</p>
                        </div>
                      </div>
                    </Card>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* FAQ */}
          {article.schemaFAQ && article.schemaFAQ.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h3>
              <div className="space-y-4">
                {article.schemaFAQ.map((faq, idx) => (
                  <Card key={idx} className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-700 text-sm">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Blog listing
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Wilbor-Assist</h1>
        <p className="text-lg text-gray-600 mb-8">Dicas, técnicas e informações baseadas em protocolos científicos</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENHANCED_BLOG_ARTICLES.map(article => (
            <Card 
              key={article.slug}
              className="hover:shadow-lg cursor-pointer transition-all hover:scale-105"
              onClick={() => navigate(`/blog/${article.slug}`)}
            >
              <div className="p-6">
                <div className={`p-3 rounded-lg ${article.iconBg} w-fit mb-4`}>
                  <article.icon className={`w-6 h-6 ${article.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                    {article.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
