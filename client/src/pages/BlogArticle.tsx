import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Heart, ArrowRight, ArrowLeft, Share2, Clock, BookOpen, Moon, Waves, Thermometer, UtensilsCrossed, HeartPulse, CheckCircle2, Shield, Sparkles, Syringe, Baby, ShieldCheck, TrendingUp, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

// ==========================================
// BLOG ARTICLES DATA
// ==========================================
export interface BlogArticle {
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
}

export const BLOG_ARTICLES: BlogArticle[] = [
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

## Quando procurar o pediatra

- Bebê ronca ou faz pausas na respiração durante o sono
- Não dorme mais de 30 minutos seguidos após os 4 meses
- Irritabilidade extrema que não melhora com nenhuma técnica
- Perda de peso ou recusa alimentar associada

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP) e American Academy of Pediatrics (AAP).`,
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

### 5. Bicicleta
Com o bebê deitado de barriga para cima, faça movimentos de bicicleta com as perninhas. Ajuda a eliminar gases presos.

## O que NÃO fazer

- **Não dê chás ou medicamentos** sem orientação do pediatra
- **Não sacuda o bebê** — pode causar lesão cerebral grave (Síndrome do Bebê Sacudido)
- **Não mude a fórmula** sem orientação médica
- **Não se culpe** — cólica não é causada por algo que você fez ou deixou de fazer

## Quando procurar o pediatra

- Febre acima de 37,8°C
- Vômitos frequentes ou em jato
- Sangue nas fezes
- Recusa alimentar por mais de 8 horas
- Bebê inconsolável por mais de 4 horas seguidas

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP) e American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "febre-no-bebe",
    title: "Febre no bebê: quando ir ao hospital (guia por idade)",
    metaTitle: "Febre no bebê: quando ir ao hospital | Wilbor-Assist",
    metaDescription: "Bebê com febre? Saiba quando é emergência, como medir corretamente e o que fazer em cada faixa etária. Guia baseado na SBP.",
    icon: Thermometer,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    readTime: "6 min",
    category: "Febre",
    excerpt: "Saiba quando a febre do bebê é emergência, como medir corretamente e o que fazer em cada idade.",
    keywords: ["febre no bebê", "bebê com febre", "quando levar bebê ao hospital", "febre recém-nascido", "temperatura bebê"],
    schemaFAQ: [
      { question: "Qual temperatura é febre no bebê?", answer: "Temperatura axilar acima de 37,5°C é considerada febre. Entre 37,3°C e 37,5°C é estado febril. Abaixo de 37,3°C é normal." },
      { question: "Febre em recém-nascido é emergência?", answer: "Sim. Qualquer febre (acima de 37,5°C) em bebês com menos de 3 meses é considerada emergência e requer avaliação médica imediata." },
      { question: "Posso dar dipirona para bebê?", answer: "Nunca medique o bebê sem orientação do pediatra. A dosagem depende do peso e da idade. Dipirona e paracetamol são os mais usados, mas a prescrição deve ser médica." },
    ],
    content: `## Quando a febre é emergência?

A febre é um dos motivos mais comuns de consulta pediátrica. Segundo a **SBP**, a conduta depende diretamente da **idade do bebê**.

## Classificação por temperatura

| Temperatura axilar | Classificação |
|-------------------|---------------|
| Até 37,2°C | Normal |
| 37,3°C - 37,5°C | Estado febril |
| 37,6°C - 38,9°C | Febre |
| 39°C - 40°C | Febre alta |
| Acima de 40°C | Febre muito alta (emergência) |

## Conduta por idade

### 0-3 meses: SEMPRE emergência
Qualquer febre em bebê com menos de 3 meses requer **avaliação médica imediata**. Nessa idade, o sistema imunológico é imaturo e infecções podem evoluir rapidamente.

**Vá ao hospital se:** temperatura axilar acima de 37,5°C.

### 3-6 meses: atenção redobrada
- Febre acima de 38,5°C → procure o pediatra
- Febre que dura mais de 24 horas → procure o pediatra
- Bebê irritado, prostrado ou recusando mamar → emergência

### 6-12 meses: observe o estado geral
- Febre acima de 39°C → procure o pediatra
- Febre que dura mais de 48-72 horas → procure o pediatra
- Se o bebê está ativo, brincando e mamando bem, observe em casa

## Como medir corretamente

1. Use termômetro digital (nunca de mercúrio)
2. Coloque na axila por 3-5 minutos
3. Mantenha o braço do bebê junto ao corpo
4. Meça quando o bebê estiver calmo (não logo após mamar ou chorar)

## Medidas de conforto

- **Hidratação:** ofereça mama ou água com frequência
- **Roupa leve:** tire excesso de roupa e cobertores
- **Ambiente fresco:** mantenha o quarto ventilado
- **Banho morno:** pode ajudar a baixar a temperatura (nunca gelado)
- **Compressas mornas:** nas axilas e virilhas (nunca álcool)

## Sinais de alerta (vá ao hospital)

- Febre em bebê menor de 3 meses
- Temperatura acima de 40°C em qualquer idade
- Convulsão febril (tremores, olhos revirados)
- Manchas roxas na pele
- Dificuldade para respirar
- Prostração extrema (bebê "mole", sem reação)
- Fontanela (moleira) abaulada
- Choro inconsolável por horas

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP) e American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "introducao-alimentar",
    title: "Introdução alimentar: guia completo para começar (BLW e tradicional)",
    metaTitle: "Introdução alimentar: guia completo para começar | Wilbor-Assist",
    metaDescription: "Como começar a introdução alimentar do bebê aos 6 meses? Guia com BLW, método tradicional, alimentos por idade e alergênicos. Baseado na SBP.",
    icon: UtensilsCrossed,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    readTime: "9 min",
    category: "Alimentação",
    excerpt: "Tudo sobre introdução alimentar: quando começar, BLW vs tradicional, alimentos por idade e como introduzir alergênicos.",
    keywords: ["introdução alimentar", "BLW bebê", "quando começar papinha", "alimentação bebê 6 meses", "alimentos bebê"],
    schemaFAQ: [
      { question: "Quando começar a introdução alimentar?", answer: "A SBP recomenda iniciar aos 6 meses completos, quando o bebê consegue sentar com apoio, perdeu o reflexo de protrusão da língua e demonstra interesse pela comida." },
      { question: "O que é BLW?", answer: "BLW (Baby-Led Weaning) é o método onde o bebê se alimenta sozinho com as mãos, usando alimentos em pedaços adequados. Desenvolve autonomia e coordenação motora." },
      { question: "Quais alimentos dar primeiro?", answer: "Comece com frutas (banana, abacate, mamão) e legumes cozidos (batata-doce, cenoura, abóbora). Introduza um alimento novo a cada 3 dias para observar reações alérgicas." },
    ],
    content: `## Quando começar?

A **Sociedade Brasileira de Pediatria (SBP)** e a **OMS** recomendam aleitamento materno exclusivo até os **6 meses completos**. A introdução alimentar deve começar aos 6 meses, quando o bebê apresenta sinais de prontidão.

## Sinais de prontidão

- Consegue sentar com apoio mínimo
- Sustenta a cabeça com firmeza
- Perdeu o reflexo de protrusão da língua (não empurra comida para fora)
- Demonstra interesse pela comida dos adultos
- Consegue pegar objetos e levar à boca

## Métodos: BLW vs Tradicional vs Misto

### BLW (Baby-Led Weaning)
O bebê come sozinho, com as mãos, usando alimentos em pedaços adequados.

**Vantagens:** autonomia, desenvolvimento motor, aceitação de texturas.
**Cuidados:** corte seguro (tiras do tamanho do dedo), supervisão constante.

### Tradicional (papinha)
Alimentos amassados com garfo (não liquidificados) oferecidos com colher.

**Vantagens:** controle da quantidade, menos bagunça.
**Cuidados:** evoluir texturas gradualmente, não usar liquidificador.

### Misto (recomendado pela SBP)
Combina os dois métodos conforme a refeição e o momento.

## Alimentos por idade

| Idade | Alimentos | Textura |
|-------|-----------|---------|
| 6 meses | Frutas, legumes, tubérculos | Amassado ou tiras grandes |
| 7 meses | + Feijão, lentilha, cereais | Amassado com pedacinhos |
| 8 meses | + Ovo inteiro, peixe, grão-de-bico | Picado pequeno |
| 9 meses | + Macarrão, cuscuz | Pedaços maiores |
| 10-12 meses | Comida da família | Adaptada (sem sal/açúcar) |

## Alergênicos: quando e como introduzir

A SBP recomenda **introduzir alergênicos cedo** (a partir dos 6 meses), pois isso pode **reduzir** o risco de alergia:

1. **Ovo:** comece com gema cozida, depois clara
2. **Amendoim:** pasta diluída em purê (nunca inteiro — risco de engasgo)
3. **Leite de vaca:** em preparações (não como bebida principal antes de 1 ano)
4. **Trigo:** pão, macarrão
5. **Peixe:** comece com peixes brancos (tilápia, linguado)

**Regra:** introduza 1 alergênico novo a cada 3 dias e observe reações (manchas, inchaço, vômitos).

## O que NUNCA dar antes de 1 ano

- **Mel** (risco de botulismo)
- **Sal e açúcar** (desnecessários e prejudiciais)
- **Leite de vaca como bebida** (substituir pelo materno ou fórmula)
- **Alimentos redondos inteiros** (uva, tomate-cereja, azeitona — corte ao meio)
- **Sucos** (mesmo naturais — prefira a fruta inteira)

## Engasgo vs Gag reflex

**Gag reflex** (reflexo de ânsia) é **normal** e **protetor**. O bebê tosse, faz careta e pode vomitar um pouco. É diferente de engasgo.

**Engasgo real:** bebê silencioso, sem conseguir tossir, lábios roxos → faça manobra de Heimlich adaptada e ligue 192 (SAMU).

---

**Fonte:** Protocolos da Sociedade Brasileira de Pediatria (SBP), OMS e American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "depressao-pos-parto",
    title: "Depressão pós-parto: sinais, quando buscar ajuda e o que fazer",
    metaTitle: "Depressão pós-parto: sinais e quando buscar ajuda | Wilbor-Assist",
    metaDescription: "Depressão pós-parto afeta 1 em cada 4 mães brasileiras. Conheça os sinais, diferença do baby blues e quando buscar ajuda profissional.",
    icon: HeartPulse,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    readTime: "7 min",
    category: "Saúde Materna",
    excerpt: "Depressão pós-parto afeta 1 em cada 4 mães brasileiras. Conheça os sinais e saiba quando buscar ajuda.",
    keywords: ["depressão pós-parto", "baby blues", "saúde mental materna", "tristeza pós-parto", "mãe deprimida"],
    schemaFAQ: [
      { question: "Qual a diferença entre baby blues e depressão pós-parto?", answer: "Baby blues é uma tristeza leve que dura até 2 semanas após o parto e afeta até 80% das mães. Depressão pós-parto é mais intensa, dura mais de 2 semanas e interfere no dia a dia." },
      { question: "Depressão pós-parto tem cura?", answer: "Sim. Com tratamento adequado (psicoterapia e/ou medicação), a maioria das mães se recupera completamente. Quanto antes o diagnóstico, melhor o prognóstico." },
      { question: "Posso amamentar tomando antidepressivo?", answer: "Sim, existem antidepressivos compatíveis com a amamentação. O psiquiatra pode prescrever medicações seguras. Nunca pare de amamentar por conta própria." },
    ],
    content: `## Você não está sozinha

A depressão pós-parto (DPP) afeta **1 em cada 4 mães brasileiras**. Não é frescura, não é falta de amor pelo bebê e não é culpa sua. É uma condição médica que tem tratamento.

## Baby blues vs Depressão pós-parto

| | Baby blues | Depressão pós-parto |
|---|-----------|-------------------|
| **Quando começa** | 2-3 dias após o parto | 2 semanas a 12 meses |
| **Duração** | Até 2 semanas | Meses se não tratada |
| **Intensidade** | Leve | Moderada a grave |
| **Frequência** | Até 80% das mães | 15-25% das mães |
| **Tratamento** | Apoio familiar | Profissional |

## Sinais de alerta

### Emocionais
- Tristeza persistente que não melhora
- Choro frequente sem motivo aparente
- Irritabilidade extrema
- Sentimento de culpa ou inadequação como mãe
- Medo de ficar sozinha com o bebê
- Pensamentos de que o bebê estaria melhor sem você

### Físicos
- Insônia (mesmo quando o bebê dorme)
- Fadiga extrema que não melhora com descanso
- Perda ou excesso de apetite
- Dores de cabeça ou no corpo sem causa

### Comportamentais
- Dificuldade de se conectar com o bebê
- Isolamento social (recusar visitas, não sair de casa)
- Desinteresse por atividades que antes gostava
- Dificuldade de concentração

## Fatores de risco

- Histórico pessoal ou familiar de depressão
- Gravidez não planejada
- Falta de rede de apoio
- Complicações no parto
- Bebê prematuro ou com problemas de saúde
- Dificuldades financeiras
- Violência doméstica

## O que fazer

### Para a mãe
1. **Reconheça que precisa de ajuda** — não é fraqueza
2. **Fale com alguém** — parceiro(a), mãe, amiga, profissional
3. **Procure um psicólogo ou psiquiatra** — o SUS oferece atendimento gratuito nos CAPS
4. **Não pare a medicação por conta própria** se já estiver em tratamento
5. **Aceite ajuda prática** — deixe alguém cuidar do bebê enquanto você descansa

### Para quem está ao redor
1. **Não minimize** ("vai passar", "é só cansaço")
2. **Ofereça ajuda concreta** (cozinhar, limpar, cuidar do bebê)
3. **Incentive a buscar profissional**
4. **Esteja presente** sem julgamento

## Onde buscar ajuda (gratuito)

- **CVV (Centro de Valorização da Vida):** ligue 188 ou acesse cvv.org.br
- **CAPS (Centro de Atenção Psicossocial):** atendimento gratuito pelo SUS
- **UBS (Unidade Básica de Saúde):** peça encaminhamento para saúde mental
- **Maternidade onde fez o parto:** muitas têm programa de acompanhamento pós-parto

## Tratamento

O tratamento pode incluir:
- **Psicoterapia** (terapia cognitivo-comportamental é a mais estudada)
- **Medicação** (existem antidepressivos seguros para amamentação)
- **Grupos de apoio** (trocar experiências com outras mães ajuda muito)
- **Exercício físico** (caminhadas leves já fazem diferença)

---

**Fonte:** Ministério da Saúde, Sociedade Brasileira de Pediatria (SBP) e OMS.`,
  },
  {
    slug: "vacinas-do-bebe",
    title: "Vacinas do bebê: calendário completo e reações esperadas",
    metaTitle: "Vacinas do bebê: calendário completo e reações | Wilbor-Assist",
    metaDescription: "Calendário de vacinação do bebê de 0 a 12 meses com todas as doses. Saiba quais reações são normais e quando procurar o pediatra. Baseado na SBP.",
    icon: Syringe,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    readTime: "9 min",
    category: "Vacinas",
    excerpt: "Calendário completo de vacinação de 0 a 12 meses, reações esperadas e quando se preocupar.",
    keywords: ["vacinas do bebê", "calendário de vacinação", "reação vacina bebê", "vacina 2 meses", "vacina pentavalente"],
    schemaFAQ: [
      { question: "Quais vacinas o bebê toma ao nascer?", answer: "Ao nascer, o bebê recebe a BCG (contra tuberculose) e a primeira dose da Hepatite B, ambas aplicadas ainda na maternidade." },
      { question: "É normal o bebê ter febre após a vacina?", answer: "Sim. Febre leve (até 38,5°C) nas primeiras 24-48 horas após a vacinação é uma reação esperada e indica que o sistema imunológico está respondendo." },
      { question: "Posso dar banho no bebê após a vacina?", answer: "Sim, o banho pode ser dado normalmente. Evite apenas esfregar ou pressionar o local da aplicação nas primeiras horas." },
    ],
    content: `## Calendário de vacinação do bebê (0-12 meses)

O **Programa Nacional de Imunizações (PNI)** do Brasil é um dos mais completos do mundo. Todas as vacinas do calendário básico são oferecidas **gratuitamente pelo SUS**.

## Vacinas por idade

| Idade | Vacina | Protege contra |
|-------|--------|----------------|
| Ao nascer | BCG | Tuberculose (formas graves) |
| Ao nascer | Hepatite B | Hepatite B |
| 2 meses | Pentavalente (1ª dose) | Difteria, tétano, coqueluche, hepatite B, Haemophilus |
| 2 meses | VIP (1ª dose) | Poliomielite |
| 2 meses | Rotavírus (1ª dose) | Diarreia por rotavírus |
| 2 meses | Pneumocócica 10 (1ª dose) | Pneumonia, meningite, otite |
| 3 meses | Meningocócica C (1ª dose) | Meningite meningocócica |
| 4 meses | Pentavalente (2ª dose) | Reforço |
| 4 meses | VIP (2ª dose) | Poliomielite |
| 4 meses | Rotavírus (2ª dose) | Diarreia por rotavírus |
| 4 meses | Pneumocócica 10 (2ª dose) | Pneumonia, meningite |
| 5 meses | Meningocócica C (2ª dose) | Meningite meningocócica |
| 6 meses | Pentavalente (3ª dose) | Reforço |
| 6 meses | VIP (3ª dose) | Poliomielite |
| 6 meses | Influenza (anual) | Gripe |
| 9 meses | Febre Amarela | Febre amarela |
| 12 meses | Tríplice Viral (1ª dose) | Sarampo, caxumba, rubéola |
| 12 meses | Pneumocócica 10 (reforço) | Pneumonia, meningite |
| 12 meses | Meningocócica C (reforço) | Meningite meningocócica |

## Reações esperadas (normais)

Após a vacinação, é comum o bebê apresentar:

- **Febre leve** (até 38,5°C) nas primeiras 24-48 horas
- **Vermelhidão e inchaço** no local da aplicação
- **Irritabilidade** e choro mais frequente
- **Sonolência** ou alteração no apetite
- **Nódulo endurecido** no local (pode durar semanas — é normal)

### Como aliviar
- **Compressas frias** no local da aplicação (não gelo direto)
- **Paracetamol** na dose prescrita pelo pediatra (se febre acima de 38°C)
- **Amamentar** com mais frequência (conforto + hidratação)
- **Roupas leves** e ambiente fresco

## Quando procurar o pediatra após vacina

- Febre acima de **39,5°C** ou que dura mais de 48 horas
- **Choro inconsolável** por mais de 3 horas
- **Convulsão** (mesmo que breve)
- **Inchaço extenso** no membro vacinado
- **Manchas roxas** pelo corpo
- **Dificuldade para respirar** ou chiado

## Dúvidas frequentes

### Bebê gripado pode tomar vacina?
Se for um resfriado leve (coriza, tosse leve, sem febre), **sim, pode vacinar**. Se houver febre ou doença moderada/grave, adie até a melhora.

### Bebê prematuro segue o mesmo calendário?
Sim, prematuros seguem o calendário pela **idade cronológica** (data de nascimento), não pela idade corrigida. A exceção é a BCG, que exige peso mínimo de 2kg.

### Posso atrasar uma vacina?
O ideal é seguir o calendário, mas vacinas atrasadas podem ser aplicadas a qualquer momento. Converse com o pediatra para atualizar a caderneta.

---

**Fonte:** Programa Nacional de Imunizações (PNI), Sociedade Brasileira de Pediatria (SBP) e Sociedade Brasileira de Imunizações (SBIm).`,
  },
  {
    slug: "amamentacao-pega-correta",
    title: "Amamentação: pega correta, posições e dificuldades comuns",
    metaTitle: "Amamentação: pega correta e posições | Wilbor-Assist",
    metaDescription: "Guia completo de amamentação: como fazer a pega correta, melhores posições, o que fazer quando dói e como aumentar a produção de leite. Baseado na SBP.",
    icon: Baby,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    readTime: "10 min",
    category: "Amamentação",
    excerpt: "Pega correta, posições para amamentar, o que fazer quando dói e como aumentar a produção de leite.",
    keywords: ["amamentação", "pega correta", "posição para amamentar", "leite materno", "dor ao amamentar", "como amamentar"],
    schemaFAQ: [
      { question: "Como saber se a pega está correta?", answer: "Na pega correta, o bebê abocanha grande parte da aréola (não só o bico), o lábio inferior fica virado para fora, o queixo encosta no peito e você ouve o bebê engolindo. Não deve doer." },
      { question: "É normal doer para amamentar?", answer: "Uma leve sensibilidade nos primeiros dias é comum, mas dor intensa ou fissuras indicam pega incorreta. Corrija a pega e procure um consultor de amamentação se persistir." },
      { question: "Como aumentar a produção de leite?", answer: "Amamente com frequência (livre demanda), beba bastante água, descanse quando possível e evite complementos desnecessários. Quanto mais o bebê mama, mais leite é produzido." },
    ],
    content: `## A importância da amamentação

A **Organização Mundial da Saúde (OMS)** e a **SBP** recomendam aleitamento materno **exclusivo até os 6 meses** e complementado até os 2 anos ou mais. O leite materno é o alimento mais completo para o bebê, com anticorpos, nutrientes e na temperatura ideal.

## Pega correta: o segredo da amamentação

A maioria dos problemas de amamentação (dor, fissuras, baixa produção) está relacionada à **pega incorreta**.

### Sinais de pega correta
- Boca bem aberta, abocanhando **grande parte da aréola**
- Lábio inferior **virado para fora** (como boca de peixe)
- Queixo encostando no peito
- Nariz livre para respirar
- Bochechas arredondadas (não encovadas)
- Você **ouve o bebê engolindo** ("glub glub")
- **Não dói** (pode haver leve sensibilidade nos primeiros dias)

### Sinais de pega incorreta
- Bebê pega só o bico do peito
- Lábios para dentro
- Estalos durante a mamada
- Dor intensa ou fissuras
- Bebê mama por muito tempo mas parece insatisfeito

### Como corrigir
1. Quebre a sucção colocando o dedo mindinho no canto da boca do bebê
2. Reposicione: traga o bebê ao peito (não o peito ao bebê)
3. Espere a boca abrir bem e encaixe rapidamente

## Melhores posições para amamentar

### 1. Tradicional (Madonna)
Bebê de lado, barriga com barriga, cabeça apoiada no antebraço. A posição mais clássica.

### 2. Invertida (Cross-cradle)
Igual à tradicional, mas a mão oposta segura a cabeça do bebê. Dá mais controle da pega — ideal para recém-nascidos.

### 3. Futebol americano (Rugby)
Bebê embaixo do braço, pernas para trás. Ótima para:
- Mães que fizeram cesárea (não pressiona a barriga)
- Seios grandes
- Gêmeos (um de cada lado)

### 4. Deitada de lado
Mãe e bebê deitados frente a frente. Ideal para mamadas noturnas e pós-cesárea.

### 5. Cavalinho
Bebê sentado no colo da mãe, de frente para o peito. Para bebês maiores (a partir de 4-5 meses) ou com refluxo.

## Problemas comuns e soluções

### Fissuras no mamilo
- **Causa:** pega incorreta (quase sempre)
- **O que fazer:** corrigir a pega, passar o próprio leite no mamilo após a mamada, deixar secar ao ar
- **Evite:** pomadas sem orientação, conchas de silicone por tempo prolongado

### Ingurgitamento (peito empedrado)
- **Causa:** leite acumulado, mamadas espaçadas
- **O que fazer:** amamentar com frequência, compressas mornas antes da mamada, ordenha manual para aliviar
- **Atenção:** se houver febre + vermelhidão + dor intensa, pode ser **mastite** — procure o médico

### Baixa produção de leite
- **Amamente em livre demanda** (quanto mais mama, mais produz)
- **Beba pelo menos 3 litros de água por dia**
- **Descanse** quando o bebê dormir
- **Evite complementos** desnecessários (mamadeira reduz estímulo)
- **Ordenhe** entre as mamadas para estimular

### Bebê que recusa o peito
- Tente em ambiente calmo e escuro
- Ofereça quando o bebê está sonolento
- Pele a pele (bebê só de fralda no colo da mãe)
- Verifique se há freio lingual curto (língua presa)

## Quando procurar ajuda

- Dor que não melhora após corrigir a pega
- Fissuras que sangram ou não cicatrizam
- Febre + vermelhidão no peito (possível mastite)
- Bebê não ganha peso adequadamente
- Bebê não faz pelo menos 6 fraldas molhadas por dia

---

**Fonte:** Sociedade Brasileira de Pediatria (SBP), OMS e Caderno de Atenção Básica nº 23 (Ministério da Saúde).`,
  },
  {
    slug: "seguranca-bebe-em-casa",
    title: "Segurança do bebê em casa: prevenção de acidentes por idade",
    metaTitle: "Segurança do bebê em casa: prevenção de acidentes | Wilbor-Assist",
    metaDescription: "Como proteger seu bebê de acidentes em casa: quedas, engasgos, queimaduras e afogamentos. Guia de prevenção por idade baseado na SBP.",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    readTime: "8 min",
    category: "Segurança",
    excerpt: "Prevenção de acidentes domésticos por idade: quedas, engasgos, queimaduras e mais.",
    keywords: ["segurança do bebê", "prevenção de acidentes", "bebê engasgou", "queda do bebê", "casa segura para bebê"],
    schemaFAQ: [
      { question: "Qual o acidente doméstico mais comum com bebês?", answer: "Quedas são o acidente mais comum em todas as idades. Em bebês menores, quedas do trocador, cama e sofá. Em bebês que engatinham, quedas de escadas e móveis." },
      { question: "O que fazer se o bebê engasgar?", answer: "Em bebês menores de 1 ano: coloque de bruços sobre seu antebraço, com a cabeça mais baixa, e dê 5 tapas firmes nas costas entre as escápulas. Se não resolver, vire de barriga para cima e faça 5 compressões no peito." },
      { question: "Quando começar a usar grade na escada?", answer: "Instale grades de proteção nas escadas assim que o bebê começar a se arrastar ou engatinhar (por volta dos 6-8 meses). Use grades fixas no topo e portões de pressão na base." },
    ],
    content: `## Acidentes domésticos: a principal causa de morte evitável

Segundo a **SBP**, acidentes domésticos são a **principal causa de morte em crianças de 1 a 14 anos** no Brasil. A maioria é **prevenível** com medidas simples de segurança.

## Riscos por idade

### 0-3 meses: quedas e sufocamento
- **Nunca deixe o bebê sozinho** em superfícies altas (trocador, cama, sofá)
- **Sono seguro:** sempre de barriga para cima, sem travesseiros, cobertores soltos ou bichos de pelúcia no berço
- **Não use protetores de berço** (risco de sufocamento)
- **Cuidado com cordões** de cortinas, chupetas e roupas perto do pescoço

### 4-6 meses: quedas e objetos pequenos
- Bebê começa a rolar — **nunca deixe sozinho** em superfícies sem proteção
- **Tudo vai à boca** — retire objetos pequenos do alcance (moedas, botões, tampas)
- **Cadeirinha de alimentação** com cinto de segurança
- **Não use andador** (proibido pela SBP — risco de quedas graves)

### 7-9 meses: engatinhar = explorar tudo
- **Instale grades** nas escadas (topo e base)
- **Proteja tomadas** com tampas de segurança
- **Trave armários** com produtos de limpeza, medicamentos e objetos cortantes
- **Proteja quinas** de mesas e móveis
- **Fixe móveis pesados** na parede (estantes, cômodas, TVs)

### 10-12 meses: primeiros passos = mais quedas
- **Tapetes antiderrapantes** no banheiro e cozinha
- **Portas com trava** para cozinha e banheiro
- **Cabos de panela** virados para dentro do fogão
- **Fios elétricos** fora do alcance
- **Janelas com tela** ou limitador de abertura

## Engasgo: o que fazer

O engasgo é uma das emergências mais comuns e assustadoras. Saiba agir:

### Bebê menor de 1 ano (Manobra de Heimlich adaptada)
1. Coloque o bebê **de bruços sobre seu antebraço**, com a cabeça mais baixa que o corpo
2. Dê **5 tapas firmes** nas costas, entre as escápulas
3. Se não resolver, **vire de barriga para cima** e faça **5 compressões** no centro do peito (2 dedos)
4. **Repita** até o objeto sair ou o bebê tossir/chorar
5. Se perder a consciência, **ligue 192 (SAMU)** e inicie RCP

### Prevenção de engasgo
- Corte alimentos em pedaços pequenos e adequados à idade
- **Alimentos perigosos:** uva inteira, pipoca, amendoim, salsicha em rodelas, balas duras
- Supervisione **todas** as refeições
- Não dê alimentos no carro em movimento

## Queimaduras: prevenção

- **Teste a temperatura da água** do banho (ideal: 37°C) — use o cotovelo
- **Não segure o bebê** enquanto bebe líquidos quentes
- **Cozinhe nas bocas de trás** do fogão
- **Ferro de passar:** guarde quente em local alto e inacessível
- **Protetor solar:** só a partir dos 6 meses

## Afogamento: atenção redobrada

- **Nunca deixe o bebê sozinho** na banheira, piscina ou balde — nem por 1 segundo
- Bebês podem se afogar em **menos de 5 cm de água**
- **Esvazie baldes e bacias** após o uso
- **Piscinas:** cerca de 1,5m com portão e trava

## Kit de primeiros socorros

Tenha em casa:
- Termômetro digital
- Soro fisiológico
- Gaze estéril
- Micropore
- Tesoura de ponta redonda
- Antitérmico prescrito pelo pediatra
- Número do SAMU (192) e do pediatra visíveis

---

**Fonte:** Sociedade Brasileira de Pediatria (SBP) e Ministério da Saúde — Programa de Prevenção de Acidentes na Infância.`,
  },
  {
    slug: "saltos-de-desenvolvimento",
    title: "Saltos de desenvolvimento do bebê: o que esperar mês a mês",
    metaTitle: "Saltos de desenvolvimento do bebê mês a mês | Wilbor-Assist",
    metaDescription: "Entenda os saltos de desenvolvimento do bebê de 0 a 12 meses: quando acontecem, sinais, como lidar com a irritabilidade e marcos esperados. Baseado na SBP.",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    readTime: "9 min",
    category: "Desenvolvimento",
    excerpt: "Quando acontecem os saltos, sinais de cada fase e como lidar com a irritabilidade do bebê.",
    keywords: ["saltos de desenvolvimento", "desenvolvimento do bebê", "marcos do bebê", "bebê irritado", "regressão do sono", "semana de pico"],
    schemaFAQ: [
      { question: "O que é um salto de desenvolvimento?", answer: "É um período em que o cérebro do bebê passa por uma reorganização, adquirindo novas habilidades. Durante o salto, o bebê pode ficar mais irritado, choroso e grudento — é temporário e sinal de evolução." },
      { question: "Quantos saltos o bebê tem no primeiro ano?", answer: "No primeiro ano, o bebê passa por aproximadamente 8 a 10 saltos de desenvolvimento, com picos nas semanas 5, 8, 12, 19, 26, 37, 46 e 55." },
      { question: "Como ajudar o bebê durante um salto?", answer: "Ofereça mais colo, amamente com mais frequência, mantenha a rotina o mais estável possível e tenha paciência. O salto dura de 1 a 6 semanas e passa." },
    ],
    content: `## O que são saltos de desenvolvimento?

Os **saltos de desenvolvimento** (também chamados de "semanas de pico" ou "wonder weeks") são períodos em que o cérebro do bebê passa por uma **reorganização neurológica intensa**. Durante esses períodos, o bebê adquire novas habilidades — mas o processo pode deixá-lo irritado, choroso e grudento.

## Calendário dos saltos (0-12 meses)

| Semana | Idade aprox. | O que muda | Duração |
|--------|-------------|------------|----------|
| Semana 5 | 1 mês | Sensações (visão, audição mais aguçadas) | 1-2 semanas |
| Semana 8 | 2 meses | Padrões (reconhece rostos, mãos) | 1-2 semanas |
| Semana 12 | 3 meses | Transições suaves (movimentos mais coordenados) | 1-2 semanas |
| Semana 19 | 4,5 meses | Eventos (entende causa e efeito) | 1-5 semanas |
| Semana 26 | 6 meses | Relações (distância, dentro/fora) | 1-5 semanas |
| Semana 37 | 8,5 meses | Categorias (agrupa objetos por semelhança) | 3-6 semanas |
| Semana 46 | 10,5 meses | Sequências (entende ordem das coisas) | 3-6 semanas |
| Semana 55 | 12,5 meses | Programas (testa estratégias, resolve problemas) | 3-6 semanas |

## Sinais de que o bebê está em um salto

- **Mais choroso e irritado** do que o habitual
- **Mais grudento** — quer colo o tempo todo
- **Alteração no sono** — acorda mais, dorme menos
- **Alteração no apetite** — mama mais ou recusa
- **Ansiedade de separação** — chora quando você sai do campo de visão

## Marcos de desenvolvimento mês a mês

### 1 mês
- Fixa o olhar brevemente
- Reage a sons altos
- Levanta a cabeça brevemente quando de bruços

### 2 meses
- Primeiro sorriso social
- Segue objetos com os olhos
- Emite sons ("ahhh", "ohhh")

### 3 meses
- Sustenta a cabeça
- Ri alto
- Abre e fecha as mãos
- Descobre as próprias mãos

### 4 meses
- Rola de barriga para cima (ou vice-versa)
- Pega objetos com as duas mãos
- Reconhece rostos familiares

### 5-6 meses
- Senta com apoio
- Transfere objetos de uma mão para outra
- Balbucia sílabas ("ba-ba", "ma-ma")
- Começa a demonstrar preferência por pessoas

### 7-8 meses
- Senta sem apoio
- Engatinha (ou se arrasta)
- Ansiedade de separação (chora com estranhos)
- Bate palmas, dá tchau

### 9-10 meses
- Fica de pé com apoio
- Pinça (pega objetos pequenos com polegar e indicador)
- Entende "não"
- Aponta para o que quer

### 11-12 meses
- Primeiros passos (com ou sem apoio)
- Primeiras palavras com significado ("mamã", "papá")
- Imita gestos e sons
- Brinca de esconde-esconde

## Como ajudar durante os saltos

1. **Mais colo e contato pele a pele** — o bebê precisa de segurança
2. **Amamente com mais frequência** — conforto + nutrição
3. **Mantenha a rotina** — previsibilidade acalma
4. **Ofereça estímulos adequados** — brinquedos novos, texturas, sons
5. **Tenha paciência** — o salto é temporário (1-6 semanas)
6. **Não compare** — cada bebê tem seu ritmo

## Quando se preocupar

Procure o pediatra se o bebê:
- Não sustenta a cabeça aos 4 meses
- Não senta sem apoio aos 9 meses
- Não faz contato visual
- Não reage a sons
- Perdeu habilidades que já tinha (regressão)

---

**Fonte:** Sociedade Brasileira de Pediatria (SBP), "The Wonder Weeks" (Van de Rijt & Plooij) e AAP.`,
  },
  {
    slug: "banho-do-recem-nascido",
    title: "Banho do recém-nascido: passo a passo seguro e completo",
    metaTitle: "Banho do recém-nascido: passo a passo seguro | Wilbor-Assist",
    metaDescription: "Como dar banho no recém-nascido com segurança: temperatura da água, frequência, cuidados com o umbigo e produtos recomendados. Guia baseado na SBP.",
    icon: Bath,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
    readTime: "7 min",
    category: "Higiene",
    excerpt: "Passo a passo completo para dar banho no recém-nascido com segurança e confiança.",
    keywords: ["banho do recém-nascido", "como dar banho no bebê", "temperatura banho bebê", "cuidados com umbigo", "primeiro banho bebê"],
    schemaFAQ: [
      { question: "Qual a temperatura ideal da água para o banho do bebê?", answer: "A temperatura ideal é entre 36°C e 37°C. Teste com o cotovelo ou use um termômetro de banho. A água deve estar morna, nunca quente." },
      { question: "Pode dar banho no bebê com o umbigo ainda não caiu?", answer: "Sim, pode dar banho normalmente. Após o banho, seque bem o coto umbilical com gaze limpa. Ele cairá naturalmente entre 7 e 21 dias." },
      { question: "Quantas vezes por dia devo dar banho no bebê?", answer: "Um banho por dia é suficiente para recém-nascidos. Em dias muito quentes, pode dar um segundo banho rápido apenas com água. Banhos excessivos ressecam a pele." },
    ],
    content: `## O primeiro banho: quando e como

O primeiro banho do recém-nascido costuma gerar muita ansiedade nas mães. A **SBP** recomenda que o primeiro banho seja dado **após a estabilização do bebê**, geralmente nas primeiras 24 horas de vida.

## Preparação: tudo pronto ANTES de começar

Antes de tirar a roupa do bebê, deixe tudo ao alcance da mão:

- **Banheira** com água morna (36-37°C)
- **Toalha** macia com capuz
- **Fralda** limpa
- **Roupa** limpa
- **Sabonete** líquido neutro (específico para bebê)
- **Algodão** ou gaze para o rosto
- **Termômetro de banho** (opcional, mas recomendado)

**Regra de ouro:** NUNCA deixe o bebê sozinho na banheira, nem por 1 segundo.

## Passo a passo do banho

### 1. Temperatura da água
- **Ideal:** 36°C a 37°C
- **Como testar:** mergulhe o cotovelo — deve estar morna, confortável
- **Nível da água:** suficiente para cobrir os ombros do bebê quando sentado

### 2. Ambiente
- **Temperatura do quarto:** entre 22°C e 26°C
- **Sem correntes de ar** — feche janelas e portas
- **Horário:** preferencialmente antes da mamada (não logo após)

### 3. Segurança ao segurar
- Apoie a cabeça e o pescoço do bebê no seu antebraço
- Segure firmemente pela axila com a mão
- A outra mão fica livre para lavar
- **Nunca solte** — bebês são escorregadios quando molhados

### 4. Ordem de lavagem
1. **Rosto** — com algodão ou pano úmido (sem sabonete)
2. **Cabeça** — com pouco sabonete, massageie suavemente
3. **Corpo** — pescoço, braços, mãos, tronco
4. **Dobrinhas** — pescoço, axilas, virilha (onde acumula sujeira)
5. **Genitais** — por último (meninas: sempre de frente para trás)
6. **Costas** — vire o bebê com cuidado

### 5. Duração
- **5 a 10 minutos** é suficiente
- Banhos longos resfriam a água e ressecam a pele

### 6. Após o banho
- Envolva imediatamente na toalha
- Seque bem as **dobrinhas** (pescoço, axilas, virilha, atrás das orelhas)
- Seque o **coto umbilical** com gaze limpa
- Vista rapidamente para não esfriar

## Cuidados com o coto umbilical

- **Limpeza:** seque com gaze limpa após o banho e a cada troca de fralda
- **Não use:** álcool 70%, mercúrio, pomadas ou faixas (recomendação atual da SBP)
- **Fralda:** dobre para baixo, deixando o coto exposto ao ar
- **Queda:** entre 7 e 21 dias (pode ter um pouco de sangue — é normal)
- **Procure o pediatra se:** vermelhidão ao redor, secreção com cheiro forte, inchaço

## Produtos recomendados

- **Sabonete:** líquido, neutro, sem fragrância forte (pH 5,5)
- **Shampoo:** só a partir dos 2-3 meses (antes, use o sabonete)
- **Hidratante:** só se a pele estiver ressecada, com indicação do pediatra
- **Evite:** talco, colônia, lenços umedecidos com álcool

## Banho de ofurô (balde)

O banho de ofurô simula o ambiente do útero e pode acalmar bebês agitados:

- Use um balde específico para bebê
- Água na mesma temperatura (36-37°C)
- Bebê fica imerso até os ombros, em posição fetal
- Ótimo para bebês com cólica
- **Sempre com supervisão** — segure o bebê o tempo todo

## Dicas extras

- **Banho noturno** pode ajudar na rotina de sono
- **Massagem após o banho** relaxa e fortalece o vínculo
- **Não precisa lavar o cabelo** todos os dias
- **Unhas:** corte com tesoura de ponta redonda, preferencialmente quando o bebê dorme

---

**Fonte:** Sociedade Brasileira de Pediatria (SBP) e Caderno de Atenção Básica nº 23 (Ministério da Saúde).`,
  },
  {
    slug: "algoritmo-predicao-sono-bebe",
    title: "O Algoritmo que Prevê Quando Seu Bebê Vai Dormir (e Por Que Isso Muda Tudo)",
    metaTitle: "Algoritmo de Previsão de Sono do Bebê | Wilbor-Assist",
    metaDescription: "Saiba exatamente quando seu bebê precisa dormir — antes do choro começar. O Wilbor aprende o padrão do seu filho e te dá mais controle sobre a rotina.",
    icon: Moon,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    readTime: "6 min",
    category: "Tecnologia & Sono",
    excerpt: "Imagine saber antes do choro começar que seu bebê precisa dormir. O Wilbor aprende o padrão único do seu filho e te avisa na hora certa.",
    keywords: ["previsão de sono bebê", "algoritmo sono", "janela de vigília", "soneca bebê", "wilbor sono"],
    schemaFAQ: [
      { question: "Como o Wilbor prevê a próxima soneca?", answer: "O algoritmo cruza a tabela médica de janelas de vigília por idade com o histórico real de sono do bebê, usando média ponderada de 60% dados reais + 40% referência médica." },
      { question: "O que é janela de vigília?", answer: "É o tempo máximo que o bebê consegue ficar acordado sem ficar irritado. Varia de 45-60 minutos no recém-nascido até 3-4 horas aos 12 meses." },
    ],
    content: `# Quando Seu Bebê Vai Dormir? O Wilbor Sabe.

Imagine saber, com antecedência, que seu bebê vai precisar dormir em breve — antes mesmo do choro começar. Não por intuição, mas por um padrão real que o Wilbor aprende sobre o seu filho.

## O Que é a Janela de Vigília?

A medicina neonatal sabe que cada bebê tem um tempo máximo que consegue ficar acordado antes de ficar irritado e com dificuldade para dormir. Esse tempo se chama **janela de vigília** e muda conforme a idade:

- **0–6 semanas:** bebê aguenta apenas 45–60 minutos acordado
- **3–4 meses:** já suporta 75–90 minutos entre sonecas
- **6 meses:** consegue ficar até 2,5 horas acordado

Quando a mãe coloca o bebê para dormir depois dessa janela, ele já está cansado demais — e é mais difícil adormecer.

## Como o Wilbor Aprende o Padrão do Seu Bebê

O Wilbor combina duas informações para prever a próxima soneca:

1. **A tabela médica** da AAP e SBP com as janelas de vigília por idade
2. **O histórico real** das sonecas do seu bebê, que você registra no app

Com o tempo, quanto mais você registra, mais personalizada fica a previsão — porque o Wilbor aprende os ritmos únicos do seu filho.

## O Que Muda na Prática

- **Menos choro** — você age antes do cansaço extremo
- **Rotina mais previsível** — você planeja seu dia com mais segurança
- **Sono mais profundo** — bebê dorme na hora certa, não depois

---

**Baseado em:** Protocolo de Janelas de Vigília da AAP e dados de sono neonatal da SBP.

## Precisa de ajuda agora?

Nem sempre dá tempo de interpretar tudo isso sozinha — principalmente na madrugada ou quando o bebê está chorando.

O Wilbor organiza essas informações para você e te orienta em tempo real, de forma personalizada para o seu bebê.

→ Receba respostas claras, no momento em que você precisa
→ Entenda o que está acontecendo sem dúvida
→ Tenha mais segurança nas decisões do dia a dia

Comece gratuitamente.`,
  },
  {
    slug: "ia-que-le-entrelinhas-mae",
    title: "A IA que Lê as Entrelinhas: Como o Wilbor Entende o Que Você Não Disse",
    metaTitle: "IA que Detecta Depressão Pós-Parto e Exaustão Materna | Wilbor-Assist",
    metaDescription: "O Wilbor percebe quando você precisa de mais do que uma resposta sobre o bebê — e responde com empatia, sem julgamentos, no momento certo.",
    icon: HeartPulse,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    readTime: "7 min",
    category: "Inteligência Artificial & Bem-Estar",
    excerpt: "O Wilbor percebe quando você precisa de mais do que uma resposta sobre o bebê — e responde com empatia, sem julgamentos, no momento certo.",
    keywords: ["depressão pós-parto", "IA emocional", "saúde mental materna", "exaustão materna", "pain point extractor"],
    schemaFAQ: [
      { question: "O Wilbor detecta depressão pós-parto?", answer: "O Wilbor não diagnostica, mas identifica sinais emocionais nas mensagens e responde com empatia calibrada. Em casos críticos, sugere buscar apoio profissional." },
      { question: "Meus dados emocionais ficam armazenados?", answer: "A análise emocional opera de forma ética, sem armazenar dados sensíveis além do necessário para a sessão de conversa." },
    ],
    content: `# O Wilbor Entende o Que Você Não Disse

Uma mãe digita: "meu bebê não para de chorar e eu não sei mais o que fazer."

Qualquer assistente comum responderia sobre cólica ou sono. O Wilbor faz algo diferente: **percebe o que está por trás da mensagem**.

## Como o Wilbor Lê o Contexto Emocional

O Wilbor possui um sistema de leitura de contexto emocional que opera em segundo plano, invisível para você, mas presente em cada conversa.

Enquanto responde sobre o bebê, ele também identifica o que a mãe está sentindo — mesmo quando ela não pede ajuda diretamente:

- **Exaustão** — "não durmo há 3 dias"
- **Ansiedade** — "será que estou fazendo certo?"
- **Culpa** — "acho que fiz algo errado"
- **Isolamento** — "não tenho ninguém para conversar"
- **Falta de confiança** — "não sei se meu leite é suficiente"
- **Medo de julgamento** — "tenho vergonha de perguntar"

Para cada sinal identificado, o Wilbor ajusta o tom da resposta — com mais acolhimento, mais segurança, mais presença.

## Por Que Isso Importa

A depressão pós-parto afeta **1 em cada 5 mães** — e a maioria não pede ajuda porque não reconhece os próprios sintomas.

O Wilbor não diagnostica. Mas ele **percebe** quando algo vai além do choro do bebê. E responde com empatia para aquele momento específico.

Em situações mais delicadas, o Wilbor também sugere buscar apoio profissional — com cuidado, sem alarme.

---

**Privacidade garantida.** O Wilbor não armazena dados emocionais sensíveis além do necessário para a conversa.

## Precisa de ajuda agora?

Nem sempre dá tempo de interpretar tudo isso sozinha — principalmente na madrugada ou quando o bebê está chorando.

O Wilbor organiza essas informações para você e te orienta em tempo real, de forma personalizada para o seu bebê.

→ Receba respostas claras, no momento em que você precisa
→ Entenda o que está acontecendo sem dúvida
→ Tenha mais segurança nas decisões do dia a dia

Comece gratuitamente.`,
  },
];

// ==========================================
// BLOG LIST PAGE
// ==========================================
export function BlogList() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Set meta tags for blog listing
    document.title = "Blog Wilbor-Assist | Guias sobre cuidados com bebê";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Artigos sobre sono, cólica, febre, alimentação e saúde materna. Guias práticos baseados nos protocolos da SBP para mães de bebês de 0 a 12 meses.");
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-800" style={{ fontFamily: "'Nunito', sans-serif" }}>Wilbor</span>
            </div>
          </Link>
          <Button size="sm" className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-full px-5" onClick={() => navigate('/wilbor/dashboard')}>
            Testar grátis
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12" style={{ background: 'linear-gradient(160deg, #E8F5E9 0%, #F3E5F5 40%, #E1F5FE 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-50 text-fuchsia-600 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" /> Blog Wilbor
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Guias para mães de primeira viagem
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Artigos práticos baseados nos protocolos da SBP, AAP e OMS. Escritos para você entender rápido e agir com segurança.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BLOG_ARTICLES.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="p-6 bg-white border-slate-100 hover:shadow-lg transition-all hover:scale-[1.02] rounded-2xl cursor-pointer h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${article.iconBg}`}>
                    <article.icon className={`w-6 h-6 ${article.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600">{article.category}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                  <h2 className="font-bold text-slate-900 mb-2 leading-snug" style={{ fontFamily: "'Nunito', sans-serif" }}>{article.title}</h2>
                  <p className="text-sm text-slate-500 flex-1">{article.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-fuchsia-600 text-sm font-semibold">
                    Ler artigo <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ backgroundColor: '#FDF2F8' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Precisa de orientação personalizada?
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            O Wilbor responde suas dúvidas em segundos, com base no perfil do seu bebê.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white gap-2 rounded-full px-8"
            onClick={() => navigate('/wilbor/dashboard')}
          >
            <Sparkles className="w-5 h-5" />
            Testar grátis agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Wilbor-Assist</span>
          </div>
          <p className="text-xs text-slate-500">
            O Wilbor é apoio neonatal e não substitui avaliação médica. Em caso de emergência, procure atendimento presencial.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <Link href="/privacidade"><span className="hover:text-pink-400 cursor-pointer">Privacidade</span></Link>
            <span className="text-slate-700">|</span>
            <Link href="/termos"><span className="hover:text-pink-400 cursor-pointer">Termos</span></Link>
            <span className="text-slate-700">|</span>
            <Link href="/blog"><span className="hover:text-pink-400 cursor-pointer">Blog</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// BLOG ARTICLE PAGE
// ==========================================
import type { RouteComponentProps } from 'wouter';

export function BlogArticle({ params }: RouteComponentProps<{ slug: string }>) {
  const slug = params.slug;
  const [, navigate] = useLocation();
  const article = BLOG_ARTICLES.find(a => a.slug === slug);

  useEffect(() => {
    // Scroll to top when article opens
    window.scrollTo(0, 0);
    if (article) {
      document.title = article.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", article.metaDescription);

      // Inject Article schema
      const existingSchema = document.getElementById('blog-article-schema');
      if (existingSchema) existingSchema.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "author": { "@type": "Organization", "name": "Wilbor-Assist" },
        "publisher": {
          "@type": "Organization",
          "name": "Wilbor-Assist",
          "url": "https://wilborassist.com"
        },
        "mainEntityOfPage": `https://wilborassist.com/blog/${article.slug}`,
        "keywords": article.keywords.join(", "),
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.schemaFAQ.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      };

      const scriptEl = document.createElement('script');
      scriptEl.id = 'blog-article-schema';
      scriptEl.type = 'application/ld+json';
      scriptEl.textContent = JSON.stringify([schema, faqSchema]);
      document.head.appendChild(scriptEl);

      return () => {
        const el = document.getElementById('blog-article-schema');
        if (el) el.remove();
      };
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Artigo não encontrado</h1>
          <Button onClick={() => navigate('/blog')} className="bg-fuchsia-500 text-white rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao blog
          </Button>
        </div>
      </div>
    );
  }

  // Simple markdown to JSX renderer for article content
  const renderArticleContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    const flushTable = () => {
      if (tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-fuchsia-200">
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="text-left py-2 px-3 font-bold text-slate-800 bg-fuchsia-50/50">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-slate-600">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    };

    lines.forEach((line, i) => {
      // Table detection
      if (line.trim().startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          // Separator row — skip
          return;
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>{line.slice(3)}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>{line.slice(4)}</h3>);
        return;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-8 border-slate-200" />);
        return;
      }

      // List items
      if (line.trim().startsWith('- **') || line.trim().startsWith('- ')) {
        const text = line.trim().slice(2);
        elements.push(
          <li key={i} className="ml-4 mb-1.5 text-slate-600 leading-relaxed list-disc" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
        );
        return;
      }

      // Numbered list
      const numMatch = line.trim().match(/^(\d+)\.\s+\*\*(.+?)\*\*\s*(.*)$/);
      if (numMatch) {
        elements.push(
          <li key={i} className="ml-4 mb-1.5 text-slate-600 leading-relaxed list-decimal">
            <strong className="text-slate-800">{numMatch[2]}</strong> {numMatch[3]}
          </li>
        );
        return;
      }
      const numMatch2 = line.trim().match(/^(\d+)\.\s+(.+)$/);
      if (numMatch2) {
        elements.push(
          <li key={i} className="ml-4 mb-1.5 text-slate-600 leading-relaxed list-decimal" dangerouslySetInnerHTML={{ __html: numMatch2[2].replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={i} className="text-slate-600 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
      );
    });

    if (inTable) flushTable();
    return elements;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-800" style={{ fontFamily: "'Nunito', sans-serif" }}>Wilbor</span>
            </div>
          </Link>
          <Button size="sm" className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-full px-5" onClick={() => navigate('/wilbor/dashboard')}>
            Testar grátis
          </Button>
        </div>
      </nav>

      {/* Article */}
      <article className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/"><span className="hover:text-fuchsia-600 cursor-pointer">Início</span></Link>
            <span>/</span>
            <Link href="/blog"><span className="hover:text-fuchsia-600 cursor-pointer">Blog</span></Link>
            <span>/</span>
            <span className="text-slate-600">{article.category}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600">{article.category}</span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime} de leitura</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Baseado nos protocolos da SBP</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose-custom">
            {renderArticleContent(article.content)}
          </div>

          {/* Share */}
          <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-800 mb-3">Compartilhe com outra mãe:</p>
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Li esse artigo sobre "${article.title}" e achei muito útil! Baseado na SBP:\nhttps://wilborassist.com/blog/${article.slug}`
                );
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundColor: '#25D366', color: 'white', boxShadow: '0 2px 12px rgba(37,211,102,0.3)' }}
            >
              <Share2 className="w-4 h-4" />
              Compartilhar no WhatsApp
            </button>
          </div>

          {/* CTA */}
          <div className="mt-8 p-8 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #D946EF15, #7C3AED15)' }}>
            <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Tire suas dúvidas com o Wilbor
            </h3>
            <p className="text-slate-600 mb-5">
              O Wilbor responde em segundos, personalizado para o seu bebê. Baseado na SBP.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white gap-2 rounded-full px-8"
              onClick={() => navigate('/wilbor/dashboard')}
            >
              <Sparkles className="w-5 h-5" />
              Testar grátis agora
            </Button>
            <p className="text-xs text-slate-400 mt-3">Sem cadastro · Resposta imediata · 5 consultas grátis</p>
          </div>

          {/* FAQ */}
          {article.schemaFAQ.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>Perguntas frequentes</h2>
              <div className="space-y-4">
                {article.schemaFAQ.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-2">{faq.question}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-10 text-center">
            <Button variant="outline" onClick={() => navigate('/blog')} className="rounded-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Ver todos os artigos
            </Button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Wilbor-Assist</span>
          </div>
          <p className="text-xs text-slate-500">
            O Wilbor é apoio neonatal e não substitui avaliação médica.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <Link href="/privacidade"><span className="hover:text-pink-400 cursor-pointer">Privacidade</span></Link>
            <span className="text-slate-700">|</span>
            <Link href="/termos"><span className="hover:text-pink-400 cursor-pointer">Termos</span></Link>
            <span className="text-slate-700">|</span>
            <Link href="/blog"><span className="hover:text-pink-400 cursor-pointer">Blog</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
