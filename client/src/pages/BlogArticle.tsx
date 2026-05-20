import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useI18n } from "@/contexts/i18n";
import {
  Heart,
  ArrowLeft,
  Clock,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  applyBlogDocumentSeo,
  findBlogArticle,
  getBlogArticleSeo,
  type BlogLocale,
  type LocalizedBlogArticle,
} from "@/lib/blogContent";

const SUPPORTED_BLOG_LOCALES: BlogLocale[] = ["pt", "en", "es", "fr", "de"];
const PT_COLIC_SLUG = "colica-do-bebe";

type ColicTechnique = {
  label: string;
  title: string;
  description: string;
};

type ColicFaq = {
  q: string;
  a: string;
};

type ColicPageCopy = {
  badge: string;
  subtitle: string;
  trustPoints: string[];
  quickSummaryTitle: string;
  quickSummaryItems: string[];
  statLabels: [string, string, string];
  techniquesTitle: string;
  techniquesSubtitle: string;
  techniques: [ColicTechnique, ColicTechnique, ColicTechnique];
  alertTitle: string;
  alertItems: string[];
  midCtaTitle: string;
  midCtaDescription: string;
  faqTitle: string;
  faqs: ColicFaq[];
  detailsTitle: string;
  finalTitle: string;
  finalDescription: string;
  plansLabel: string;
};

const COLIC_PAGE_COPY: Record<BlogLocale, ColicPageCopy> = {
  pt: {
    badge: "Guia prático · Cólica do bebê",
    subtitle:
      "Se o choro aperta no fim da tarde e nada parece funcionar, esta página organiza o que costuma aliviar, o que observar e quando sair da tentativa caseira para a orientação imediata.",
    trustPoints: [
      "Escaneável para quem chegou do Google em momento de urgência.",
      "Técnicas rápidas e seguras antes de descer para o guia completo.",
      "Transição natural para chat grátis ou suporte contínuo nos planos.",
    ],
    quickSummaryTitle: "O que pode estar acontecendo",
    quickSummaryItems: [
      "O intestino do bebê ainda está amadurecendo e pode prender gases com facilidade.",
      "O pico costuma acontecer entre 6 e 8 semanas, principalmente no fim da tarde e início da noite.",
      "Excesso de estímulo, rotina desorganizada ou desconforto após mamadas podem piorar o choro.",
    ],
    statLabels: [
      "dos bebês podem passar por cólica",
      "3h/dia · 3 dias/semana · 3 semanas",
      "geralmente melhora até essa fase",
    ],
    techniquesTitle: "Técnicas que costumam ajudar mais rápido",
    techniquesSubtitle:
      "A ideia aqui é reduzir atrito: ver, entender e testar. Se quiser aprofundar, o guia completo continua logo abaixo.",
    techniques: [
      {
        label: "I-L-U",
        title: "Massagem abdominal",
        description:
          "Faça movimentos suaves seguindo o trajeto do intestino. O ideal é aplicar com o bebê calmo, antes da crise ficar intensa.",
      },
      {
        label: "1-2 min",
        title: "Bicicletinha",
        description:
          "Com o bebê de barriga para cima, mova as perninhas como se pedalasse. Isso costuma ajudar a liberar gases presos.",
      },
      {
        label: "Alívio",
        title: "Aviãozinho",
        description:
          "Coloque o bebê de bruços sobre o antebraço. A leve pressão na barriga pode reduzir desconforto e acalmar mais rápido.",
      },
    ],
    alertTitle: "Quando não vale esperar em casa",
    alertItems: [
      "Febre, vômitos frequentes, sangue nas fezes ou piora importante do estado geral.",
      "Recusa alimentar por muitas horas ou bebê muito abatido.",
      "Choro inconsolável por tempo prolongado, mesmo após tentativas de alívio.",
    ],
    midCtaTitle: "Quer orientação agora para essa crise específica?",
    midCtaDescription:
      "O chat do Wilbor ajuda a organizar sinais, rotina, mamadas e desconforto para a mãe decidir o próximo passo com mais clareza.",
    faqTitle: "Dúvidas rápidas sobre cólica do bebê",
    faqs: [
      {
        q: "Quando a cólica do bebê costuma começar?",
        a: "Normalmente entre a 2ª e a 3ª semana de vida, com pico entre 6 e 8 semanas e melhora gradual até 3-4 meses.",
      },
      {
        q: "Massagem realmente ajuda na cólica?",
        a: "Pode ajudar bastante, especialmente a técnica I-L-U e a bicicletinha, porque favorecem a eliminação de gases e reduzem tensão abdominal.",
      },
      {
        q: "Quando preciso procurar o pediatra?",
        a: "Se houver febre, vômitos persistentes, sangue nas fezes, recusa alimentar, bebê muito abatido ou choro fora do padrão habitual.",
      },
    ],
    detailsTitle: "Guia completo para aliviar cólica do bebê",
    finalTitle: "Se a cólica está se repetindo, o melhor próximo passo é ganhar contexto.",
    finalDescription:
      "Use o chat para entender o caso de agora ou veja os planos para ter apoio contínuo em cólica, sono, febre e outras dores do dia a dia.",
    plansLabel: "Ver planos",
  },
  en: {
    badge: "Practical guide · Baby colic",
    subtitle:
      "If the crying spikes in the late afternoon and nothing seems to work, this page helps mothers scan the likely cause, test practical relief steps and know when to escalate.",
    trustPoints: [
      "Built for urgent Google traffic that wants clarity fast.",
      "Fast, safe relief ideas before the full guide below.",
      "Natural transition to free chat or ongoing support plans.",
    ],
    quickSummaryTitle: "What may be happening",
    quickSummaryItems: [
      "Your baby's digestive system is still maturing, which can make gas harder to release.",
      "Colic often peaks around 6 to 8 weeks, especially in the late afternoon and evening.",
      "Overstimulation, routine disruption or post-feeding discomfort can make crying worse.",
    ],
    statLabels: [
      "of babies may experience colic",
      "3h/day · 3 days/week · 3 weeks",
      "often improves by this stage",
    ],
    techniquesTitle: "Relief techniques mothers usually try first",
    techniquesSubtitle:
      "The goal is frictionless action: scan, understand and test. The detailed article remains available right below.",
    techniques: [
      {
        label: "I-L-U",
        title: "Abdominal massage",
        description:
          "Use gentle strokes that follow the path of the intestine. Best done when baby is calm, before the crying escalates.",
      },
      {
        label: "1-2 min",
        title: "Bicycle legs",
        description:
          "With baby lying on their back, move the legs like pedaling. This often helps trapped gas move more easily.",
      },
      {
        label: "Relief",
        title: "Football hold",
        description:
          "Place baby face down on your forearm. The light belly pressure can reduce discomfort and soothe faster.",
      },
    ],
    alertTitle: "When not to wait it out at home",
    alertItems: [
      "Fever, repeated vomiting, blood in stool or a clearly worsening overall condition.",
      "Feeding refusal for many hours or unusual lethargy.",
      "Prolonged inconsolable crying even after practical relief attempts.",
    ],
    midCtaTitle: "Need guidance for this episode right now?",
    midCtaDescription:
      "Wilbor chat helps mothers organize symptoms, feeding, routine and discomfort so the next step feels clearer and less chaotic.",
    faqTitle: "Quick questions about baby colic",
    faqs: [
      {
        q: "When does baby colic usually start?",
        a: "Usually between weeks 2 and 3, with a peak around 6 to 8 weeks and gradual improvement by 3 to 4 months.",
      },
      {
        q: "Does massage really help with colic?",
        a: "It often does. I-L-U massage and bicycle legs can help gas move out more easily and reduce abdominal tension.",
      },
      {
        q: "When should I call the pediatrician?",
        a: "If there is fever, persistent vomiting, blood in stool, feeding refusal, unusual lethargy or crying that looks different from the usual pattern.",
      },
    ],
    detailsTitle: "Complete guide to baby colic relief",
    finalTitle: "If colic keeps coming back, the best next step is better context.",
    finalDescription:
      "Use the chat for the situation happening now, or review plans for continuous support across colic, sleep, fever and everyday baby concerns.",
    plansLabel: "See plans",
  },
  es: {
    badge: "Guía práctica · Cólico del bebé",
    subtitle:
      "Si el llanto empeora al final de la tarde y nada parece funcionar, aquí tienes una estructura más clara para entender, probar alivios y saber cuándo dejar la prueba casera.",
    trustPoints: [
      "Pensada para tráfico orgánico con intención alta e inmediata.",
      "Técnicas rápidas y seguras antes de bajar a la guía completa.",
      "Paso natural hacia chat gratis o soporte continuo en los planes.",
    ],
    quickSummaryTitle: "Qué puede estar pasando",
    quickSummaryItems: [
      "El sistema digestivo del bebé todavía está madurando y puede retener gases con facilidad.",
      "El pico suele aparecer entre las 6 y 8 semanas, sobre todo al final de la tarde y por la noche.",
      "La sobreestimulación, la rutina desordenada o la molestia después de las tomas pueden empeorar el llanto.",
    ],
    statLabels: [
      "de los bebés pueden tener cólico",
      "3 h/día · 3 días/semana · 3 semanas",
      "suele mejorar hacia esta etapa",
    ],
    techniquesTitle: "Técnicas que suelen ayudar primero",
    techniquesSubtitle:
      "La idea es reducir fricción: ver, entender y probar. La guía detallada sigue disponible justo debajo.",
    techniques: [
      {
        label: "I-L-U",
        title: "Masaje abdominal",
        description:
          "Haz movimientos suaves siguiendo el recorrido del intestino. Funciona mejor con el bebé calmado, antes de que la crisis aumente.",
      },
      {
        label: "1-2 min",
        title: "Bicicleta",
        description:
          "Con el bebé boca arriba, mueve las piernas como si pedaleara. Suele ayudar a expulsar gases atrapados.",
      },
      {
        label: "Alivio",
        title: "Posición avión",
        description:
          "Coloca al bebé boca abajo sobre tu antebrazo. La presión suave sobre la barriga puede aliviar y calmar más rápido.",
      },
    ],
    alertTitle: "Cuándo no conviene esperar en casa",
    alertItems: [
      "Fiebre, vómitos repetidos, sangre en las heces o deterioro importante del estado general.",
      "Rechazo de la alimentación durante muchas horas o bebé demasiado decaído.",
      "Llanto inconsolable prolongado incluso después de intentar medidas de alivio.",
    ],
    midCtaTitle: "¿Quieres orientación ahora para esta crisis concreta?",
    midCtaDescription:
      "El chat de Wilbor ayuda a ordenar señales, tomas, rutina y molestias para decidir el siguiente paso con más claridad.",
    faqTitle: "Preguntas rápidas sobre el cólico del bebé",
    faqs: [
      {
        q: "¿Cuándo suele empezar el cólico del bebé?",
        a: "Normalmente entre la semana 2 y 3 de vida, con pico entre las 6 y 8 semanas y mejora gradual hacia los 3-4 meses.",
      },
      {
        q: "¿El masaje realmente ayuda?",
        a: "Muchas veces sí. La técnica I-L-U y la bicicleta ayudan a mover gases y a reducir tensión abdominal.",
      },
      {
        q: "¿Cuándo debo consultar al pediatra?",
        a: "Si hay fiebre, vómitos persistentes, sangre en las heces, rechazo de la alimentación, mucho decaimiento o un llanto fuera del patrón habitual.",
      },
    ],
    detailsTitle: "Guía completa para aliviar el cólico del bebé",
    finalTitle: "Si el cólico se repite, el mejor siguiente paso es ganar contexto.",
    finalDescription:
      "Usa el chat para entender el episodio de ahora o revisa los planes para contar con apoyo continuo en cólico, sueño, fiebre y otras molestias del día a día.",
    plansLabel: "Ver planes",
  },
  fr: {
    badge: "Guide pratique · Coliques du bébé",
    subtitle:
      "Si les pleurs s'intensifient en fin de journée et que rien ne semble marcher, cette page aide à comprendre plus vite, tester des gestes utiles et reconnaître le moment où il faut aller plus loin.",
    trustPoints: [
      "Pensée pour une recherche Google à forte intention immédiate.",
      "Gestes rapides et sûrs avant le guide détaillé juste en dessous.",
      "Passage naturel vers le chat gratuit ou les forfaits de soutien continu.",
    ],
    quickSummaryTitle: "Ce qui peut se passer",
    quickSummaryItems: [
      "Le système digestif du bébé est encore immature et les gaz peuvent s'accumuler plus facilement.",
      "Le pic survient souvent entre 6 et 8 semaines, surtout en fin d'après-midi et en début de soirée.",
      "La surstimulation, une routine agitée ou l'inconfort après la tétée peuvent amplifier les pleurs.",
    ],
    statLabels: [
      "des bébés peuvent avoir des coliques",
      "3 h/jour · 3 jours/semaine · 3 semaines",
      "s'améliore souvent vers cet âge",
    ],
    techniquesTitle: "Techniques souvent testées en premier",
    techniquesSubtitle:
      "L'objectif est de réduire la friction : voir, comprendre et essayer. Le guide complet reste disponible juste après.",
    techniques: [
      {
        label: "I-L-U",
        title: "Massage abdominal",
        description:
          "Faites des mouvements doux qui suivent le trajet de l'intestin. À privilégier quand le bébé est calme, avant que la crise monte.",
      },
      {
        label: "1-2 min",
        title: "Jambes en vélo",
        description:
          "Allongez le bébé sur le dos et faites un mouvement de pédalage avec les jambes. Cela aide souvent à libérer les gaz.",
      },
      {
        label: "Soulager",
        title: "Position avion",
        description:
          "Placez le bébé à plat ventre sur votre avant-bras. La légère pression sur le ventre peut calmer plus vite.",
      },
    ],
    alertTitle: "Quand il ne faut pas simplement attendre à la maison",
    alertItems: [
      "Fièvre, vomissements répétés, sang dans les selles ou dégradation nette de l'état général.",
      "Refus de s'alimenter pendant plusieurs heures ou bébé inhabituellement abattu.",
      "Pleurs inconsolables prolongés malgré plusieurs tentatives de soulagement.",
    ],
    midCtaTitle: "Besoin d'une orientation immédiate pour cet épisode ?",
    midCtaDescription:
      "Le chat Wilbor aide à organiser les signes, les tétées, la routine et l'inconfort pour choisir la suite avec plus de clarté.",
    faqTitle: "Questions rapides sur les coliques du bébé",
    faqs: [
      {
        q: "Quand les coliques du bébé commencent-elles le plus souvent ?",
        a: "En général entre la 2e et la 3e semaine de vie, avec un pic vers 6 à 8 semaines puis une amélioration progressive vers 3 à 4 mois.",
      },
      {
        q: "Le massage aide-t-il vraiment ?",
        a: "Souvent oui. Le massage I-L-U et le mouvement de vélo peuvent favoriser l'évacuation des gaz et détendre l'abdomen.",
      },
      {
        q: "Quand faut-il appeler le pédiatre ?",
        a: "En cas de fièvre, vomissements persistants, sang dans les selles, refus de s'alimenter, grande somnolence ou pleurs inhabituels.",
      },
    ],
    detailsTitle: "Guide complet pour soulager les coliques du bébé",
    finalTitle: "Si les coliques reviennent souvent, la meilleure suite est d'avoir plus de contexte.",
    finalDescription:
      "Utilisez le chat pour l'épisode en cours ou consultez les forfaits pour un soutien continu sur les coliques, le sommeil, la fièvre et d'autres difficultés du quotidien.",
    plansLabel: "Voir les forfaits",
  },
  de: {
    badge: "Praktischer Leitfaden · Bauchkoliken beim Baby",
    subtitle:
      "Wenn das Weinen am späten Nachmittag stärker wird und nichts zu helfen scheint, bekommen Eltern hier eine schnellere Struktur zum Verstehen, Ausprobieren und Eskalieren.",
    trustPoints: [
      "Auf organische Suche mit hoher Sofort-Absicht ausgerichtet.",
      "Schnelle, sichere Maßnahmen vor dem ausführlichen Leitfaden weiter unten.",
      "Natürlicher Übergang zu kostenlosem Chat oder laufender Unterstützung.",
    ],
    quickSummaryTitle: "Was dahinterstecken kann",
    quickSummaryItems: [
      "Das Verdauungssystem des Babys reift noch, deshalb können Gase leichter feststecken.",
      "Der Höhepunkt liegt oft zwischen der 6. und 8. Woche, besonders am späten Nachmittag und frühen Abend.",
      "Überreizung, ein unruhiger Tagesablauf oder Unwohlsein nach dem Füttern können das Weinen verstärken.",
    ],
    statLabels: [
      "der Babys können Koliken haben",
      "3 Std./Tag · 3 Tage/Woche · 3 Wochen",
      "bessert sich oft bis zu diesem Alter",
    ],
    techniquesTitle: "Techniken, die Eltern oft zuerst ausprobieren",
    techniquesSubtitle:
      "Das Ziel ist weniger Reibung: schnell sehen, verstehen und testen. Der vollständige Leitfaden folgt direkt darunter.",
    techniques: [
      {
        label: "I-L-U",
        title: "Bauchmassage",
        description:
          "Sanfte Bewegungen entlang des Darms. Am besten anwenden, wenn das Baby ruhig ist, bevor die Krise stärker wird.",
      },
      {
        label: "1-2 Min",
        title: "Fahrradbewegung",
        description:
          "Legen Sie das Baby auf den Rücken und bewegen Sie die Beinchen wie beim Radfahren. Das hilft oft gegen feststeckende Gase.",
      },
      {
        label: "Linderung",
        title: "Fliegergriff",
        description:
          "Legen Sie das Baby bäuchlings auf Ihren Unterarm. Der leichte Druck auf den Bauch kann schneller beruhigen.",
      },
    ],
    alertTitle: "Wann Sie nicht einfach zu Hause abwarten sollten",
    alertItems: [
      "Fieber, wiederholtes Erbrechen, Blut im Stuhl oder deutlich schlechterer Allgemeinzustand.",
      "Nahrungsverweigerung über viele Stunden oder ungewöhnliche Schlappheit.",
      "Langanhaltendes untröstliches Weinen trotz mehrerer Entlastungsversuche.",
    ],
    midCtaTitle: "Brauchen Sie jetzt Hilfe für diese konkrete Situation?",
    midCtaDescription:
      "Der Wilbor-Chat hilft dabei, Zeichen, Fütterung, Tagesablauf und Unwohlsein zu ordnen, damit der nächste Schritt klarer wird.",
    faqTitle: "Kurze Fragen zu Bauchkoliken beim Baby",
    faqs: [
      {
        q: "Wann beginnen Bauchkoliken beim Baby meist?",
        a: "Meist zwischen der 2. und 3. Lebenswoche, mit einem Höhepunkt um die 6. bis 8. Woche und Besserung bis etwa 3 bis 4 Monate.",
      },
      {
        q: "Hilft Massage wirklich?",
        a: "Oft ja. I-L-U-Massage und Fahrradbewegungen können helfen, Gase zu lösen und Spannung im Bauch zu reduzieren.",
      },
      {
        q: "Wann sollte ich den Kinderarzt kontaktieren?",
        a: "Bei Fieber, anhaltendem Erbrechen, Blut im Stuhl, Nahrungsverweigerung, starker Schlappheit oder deutlich verändertem Schreimuster.",
      },
    ],
    detailsTitle: "Vollständiger Leitfaden zur Linderung von Bauchkoliken",
    finalTitle: "Wenn Koliken immer wiederkommen, ist der beste nächste Schritt mehr Kontext.",
    finalDescription:
      "Nutzen Sie den Chat für die aktuelle Situation oder sehen Sie sich die Tarife für kontinuierliche Unterstützung bei Koliken, Schlaf, Fieber und anderen Alltagsthemen an.",
    plansLabel: "Tarife ansehen",
  },
};

function toBlogLocale(locale: string): BlogLocale {
  return SUPPORTED_BLOG_LOCALES.includes(locale as BlogLocale) ? (locale as BlogLocale) : "pt";
}

function isColicArticle(article: LocalizedBlogArticle): boolean {
  return article.slug === PT_COLIC_SLUG || article.alternates.pt === PT_COLIC_SLUG;
}

function getDateLocale(locale: BlogLocale): string {
  switch (locale) {
    case "en":
      return "en-US";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    case "de":
      return "de-DE";
    default:
      return "pt-BR";
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { t, locale, localePath } = useI18n();

  const blogLocale = toBlogLocale(locale);
  const { article, redirectSlug } = findBlogArticle(blogLocale, slug);
  const colicCopy = article && isColicArticle(article) ? COLIC_PAGE_COPY[blogLocale] || COLIC_PAGE_COPY.pt : null;

  useEffect(() => {
    if (!article && !redirectSlug) {
      toast.error(t("common.not_found"));
      setLocation(localePath("/blog"));
      return;
    }

    const previousFaqSchema = document.getElementById("wilbor-blog-faq-schema");
    if (previousFaqSchema) {
      previousFaqSchema.remove();
    }

    if (article) {
      applyBlogDocumentSeo(getBlogArticleSeo(blogLocale, article));

      if (colicCopy) {
        const faqScript = document.createElement("script");
        faqScript.id = "wilbor-blog-faq-schema";
        faqScript.type = "application/ld+json";
        faqScript.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: colicCopy.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        });
        document.head.appendChild(faqScript);
      }
    }
  }, [article, blogLocale, colicCopy, localePath, redirectSlug, setLocation, t]);

  if (!article) {
    return null;
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t("blog.link_copied"));
  };

  const formattedDate = new Date().toLocaleDateString(getDateLocale(blogLocale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation(localePath("/blog"))} className="gap-2">
            <ArrowLeft className="size-4" /> {t("common.back")}
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="size-5 fill-purple-600 text-purple-600" />
            <span className="font-bold text-slate-900">Wilbor</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="size-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {colicCopy ? (
          <>
            <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <div>
                <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                  {colicCopy.badge}
                </span>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">{article.title}</h1>
                <p className="mt-5 text-lg leading-8 text-slate-600">{colicCopy.subtitle}</p>
                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-slate-400" /> {article.readTimeLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" /> {formattedDate}
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => setLocation(localePath("/chat"))}
                    className="h-14 rounded-full bg-purple-600 px-8 font-bold text-white hover:bg-purple-700"
                  >
                    <MessageCircle className="mr-2 size-5" />
                    {t("nav.try_free")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation(localePath("/premium"))}
                    className="h-14 rounded-full border-slate-300 px-8 font-bold text-slate-800 hover:bg-slate-50"
                  >
                    {colicCopy.plansLabel}
                  </Button>
                </div>
              </div>

            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">{colicCopy.quickSummaryTitle}</h2>
                <p className="mt-3 text-slate-600">{article.description}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {colicCopy.quickSummaryItems.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-5">
                    <CheckCircle2 className="mb-3 size-5 text-purple-600" />
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">{colicCopy.techniquesTitle}</h2>
                <p className="mt-3 text-slate-600">{colicCopy.techniquesSubtitle}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {colicCopy.techniques.map((technique) => (
                  <div key={technique.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm">
                      {technique.label}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{technique.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{technique.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 size-6 shrink-0 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{colicCopy.alertTitle}</h2>
                  <div className="mt-5 grid gap-3">
                    {colicCopy.alertItems.map((item) => (
                      <div key={item} className="rounded-2xl bg-white/80 p-4 text-sm leading-6 text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-purple-200 bg-purple-50 p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold text-slate-900">{colicCopy.midCtaTitle}</h2>
                  <p className="mt-3 text-slate-600">{colicCopy.midCtaDescription}</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setLocation(localePath("/chat"))}
                  className="h-14 rounded-full bg-purple-600 px-8 font-bold text-white hover:bg-purple-700"
                >
                  {t("nav.try_free")}
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">{colicCopy.detailsTitle}</h2>
              <article className="prose prose-purple mt-6 max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </article>
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">{colicCopy.faqTitle}</h2>
              </div>
              <div className="mt-6 space-y-4">
                {colicCopy.faqs.map((faq) => (
                  <div key={faq.q} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white shadow-xl md:p-10">
              <h2 className="text-3xl font-bold leading-tight">{colicCopy.finalTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-purple-100">{colicCopy.finalDescription}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setLocation(localePath("/chat"))}
                  className="h-14 rounded-full bg-white px-8 font-bold text-purple-600 hover:bg-purple-50"
                >
                  {t("nav.try_free")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation(localePath("/premium"))}
                  className="h-14 rounded-full border-white px-8 font-bold text-white hover:bg-white/10"
                >
                  {colicCopy.plansLabel}
                </Button>
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="mx-auto mb-8 max-w-3xl">
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-600">
                {article.category.replace(/[-_]/g, " ")}
              </span>
              <h1 className="mb-6 mt-4 text-4xl font-extrabold leading-tight text-slate-900">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-6 border-y border-slate-100 py-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" /> {article.readTimeLabel}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" /> {formattedDate}
                </div>
              </div>
            </div>

            <article className="prose prose-purple mx-auto max-w-3xl prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-800 prose-li:text-slate-600">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>

            <div className="mx-auto mt-16 max-w-3xl rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-center text-white shadow-xl">
              <h3 className="text-2xl font-bold">{t("blog.article_cta_h3")}</h3>
              <p className="mb-8 mt-4 text-purple-100">{t("blog.article_cta_desc")}</p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setLocation(localePath("/chat"))}
                  className="h-14 rounded-full bg-white px-8 font-bold text-purple-600 hover:bg-purple-50"
                >
                  {t("nav.try_free")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation(localePath("/premium"))}
                  className="h-14 rounded-full border-white px-8 font-bold text-white hover:bg-white/10"
                >
                  {locale === "pt"
                    ? "Ver planos"
                    : locale === "es"
                      ? "Ver planes"
                      : locale === "fr"
                        ? "Voir les forfaits"
                        : locale === "de"
                          ? "Tarife ansehen"
                          : "See plans"}
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
