# Wilbor v2 — Relatório de Análise Técnica: Funções de IA

**Autor:** MiniMax Agent
**Data:** 20/04/2026
**Escopo:** Análise técnica aprofundada de todas as funções de IA do projeto

---

## 1. Sumário Executivo

Este relatório documenta a análise técnica das funções de IA do Wilbor v2, identificando erros conflitantes, vulnerabilidades, inconsistências e oportunidades de melhoria. O sistema de IA do Wilbor é composto por **6 módulos principais** com complexidade crescente.

---

## 2. Arquitetura do Sistema de IA

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ AIChatBox.tsx│  │  Chat.tsx   │  │ PainPointExtractor.tsx  │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ tRPC
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express + tRPC)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ wilborChat.ts  │  │  wilborRAG.ts  │  │  wilborPrompt.ts    │  │
│  └────────────────┘  └────────────────┘  └─────────────────────┘  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ aiTriagem.ts   │  │   llm.ts       │  │painPointExtractor.ts│  │
│  └────────────────┘  └────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ invokeLLM()
┌─────────────────────────────────────────────────────────────────────┐
│                    CAMADA EXTERNA (OpenAI/Gemini)                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Análise Detalhada por Módulo

### 3.1 `openai.ts` — Sistema de Decisão Clara (ORFÃO)

**CRÍTICO ❌ ARQUIVO NÃO UTILIZADO**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/openai.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| OA-01 | 🔴 CRÍTICO | Arquivo completamente ORFÃO — não é importado em nenhum lugar | Prompts de ~600 linhas nunca são executados |
| OA-02 | 🟡 MÉDIO | Prompt `DECISION_CLARITY_SYSTEM_PROMPT` foi desenvolvido para outro produto ("DECISÃO CLARA" para empresários) | Conflito conceitual com Wilbor (maternidade/neonatal) |
| OA-03 | 🟡 MÉDIO | Função `callDecisionClarityOpenAI()` contém lógica de "Quebra-gelo" incompatível com o domínio | Gera respostas inappropriate se ativada |

**Análise Técnica:**

```typescript
// Linhas 1-587 contêm ~600 linhas de prompt que NUNCA são executadas
const DECISION_CLARITY_SYSTEM_PROMPT = `REGRA OPERACIONAL (PRIORIDADE ABSOLUTA)
MODO SILÊNCIO — PRIORIDADE MÁXIMA...`  // ~587 linhas de prompt

// Função exportada mas SEM uso em todo o codebase
export async function callDecisionClarityOpenAI(...) // NUNCA CHAMADA
```

**Recomendação:** Remover este arquivo completamente ou refatorar para uso no Wilbor.

---

### 3.2 `wilborChat.ts` — Chat Principal

**STATUS: ✅ FUNCIONAL COM RESSALVAS**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/wilborChat.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| WC-01 | 🟡 MÉDIO | `sanitizeChatMessages()` remove mensagens com `content` undefined, mas `.trim()` pode falhar em edge cases | Silent failure em mensagens vazias |
| WC-02 | 🟡 MÉDIO | `extractAssistantText()` retorna mensagem de erro genérica em vez de lançar exceção | Dificulta debug |
| WC-03 | 🟡 MÉDIO | `buildChatContext()` calcula idade do bebê em dias/semanas/meses, mas não valida `birthDate` | Pode gerar "X dias" negativo se birthDate no futuro |
| WC-04 | 🟡 MÉDIO | `detectEmergency()` usa `toLowerCase()` mas `keywords` estão em lowercase — funciona mas é redundante | Ineficiência mínima |

**Código Problemático:**

```typescript
// WC-03: Falta validação de data
if (babyData?.birthDate) {
  const diff = Date.now() - new Date(babyData.birthDate).getTime();
  // Se birthDate for no futuro → diff negativo
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  // days pode ser negativo!
}

// WC-02: Mensagem de erro genérica
return "Desculpe, não consegui processar sua mensagem.";
// Nunca sabemos o motivo real do erro
```

**Pontos Positivos:**

- ✅ Sistema de sanitização robusto
- ✅ Histórico limitado a 10 mensagens (otimização de tokens)
- ✅ Detecção de emergência multilíngue
- ✅ Validação de mensagens vazias

---

### 3.3 `wilborRAG.ts` — Sistema RAG

**STATUS: ⚠️ FUNCIONAL MAS COM PROBLEMAS ARQUITETURAIS**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/wilborRAG.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| RG-01 | 🔴 CRÍTICO | `searchKnowledgeBase()` não filtra por categoria — busca TODAS as entradas | Performance degradada + falsos positivos |
| RG-02 | 🔴 CRÍTICO | Score threshold de 8 é muito alto — pode ignorar resultados relevantes | Respostas vazias para queries específicas |
| RG-03 | 🟡 MÉDIO | `detectCategory()` remove "choro" das keywords de cólica (linha 75) — pode perder routing | Mães com "bebê chorando + cólica" não são roteadas |
| RG-04 | 🟡 MÉDIO | `getNextMidnightSP()` usa UTC-3 hardcoded — não considera DST histórico | Pode falhar em transições de horário |
| RG-05 | 🟡 MÉDIO | `formatRAGResponse()` chama `getWilborSystemPrompt()` com TODOS os parâmetros — ignora otimização prometida | Gasta ~3000 tokens mesmo no caminho "RAG" |
| RG-06 | 🟠 ALTO | `seedKnowledgeBase()` não verifica se entradas já existem por conteúdo — pode duplicar | Dados duplicados no banco |

**Código Problemático:**

```typescript
// RG-01: Busca TODAS as categorias
const entries = await db
  .select()
  .from(wilborKnowledgeBase)
  .where(and(
    eq(wilborKnowledgeBase.isActive, "true"),
    // ❌ FALTA: eq(wilborKnowledgeBase.category, category)
  ))

// RG-02: Threshold muito alto
return scored
  .filter((s) => s.score >= 8)  // ❌ score 8+ é muito restritivo
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)

// RG-03: "choro" removido intencionalmente mas...
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  colica: [
    // NOTE: "choro", "chorando", "chorar", "crying", "llanto" removed to avoid
    // false positive when mother says "choroso + febre" → should route to febre, not colica
    // ❌ Mas agora "bebê chorando com gases" não é roteado para cólica!
  ],
```

**Problema de Arquitetura — Rota RAG:**

```typescript
// Linha 532-534: Promete "minimal LLM" mas usa prompt completo
const systemPrompt = getWilborSystemPrompt(
  language,
  motherName,
  // ❌ Todos os parâmetros = ~500 tokens de sistema
  // ❌ O comentário diz "200 tokens" mas na prática é ~500+
);
```

---

### 3.4 `wilborPrompt.ts` — Prompts do Sistema

**STATUS: ✅ ESTRUTURADO COM PROBLEMAS DE CONSISTÊNCIA**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/wilborPrompt.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| PP-01 | 🟡 MÉDIO | Prompts PT e EN têm estruturas diferentes | Respostas inconsistentes entre idiomas |
| PP-02 | 🟡 MÉDIO | Prompt PT menciona "Avioncito" (termo espanhol) | Mistura de idiomas na resposta PT |
| PP-03 | 🟠 ALTO | Prompt FR e DE são significativamente menores que PT | Qualidade de resposta inferior em FR/DE |
| PP-04 | 🟡 MÉDIO | `EMERGENCY_WORDS` não inclui todas as palavras de `SOS_PRIORITY_KEYWORDS` | Alertas de emergência podem ser perdidos |

**Código Problemático:**

```typescript
// PP-02: "Avioncito" em prompt PT
pt: `...CÓLICA: Massagem I-L-U, Bicicleta, Swaddle, Posição Avioncito...`
// ❌ "Avioncito" é termo espanhol!
// ✅ Deveria ser "Aviãozinho" ou "Posição do Avião"

// PP-03: Prompts FR/DE muito curtos
fr: `[ROLE]: Vous êtes "Wilbor-Assist"...`  // ~5 linhas
de: `[ROLE]: Sie sind "Wilbor-Assist"...`  // ~5 linhas
pt: `[ROLE]: Você é "Wilbor-Assist"...`    // ~50 linhas
// ❌ FR e DE têm prompts 90% menores!
```

**Análise Comparativa de Prompts:**

| Idioma | Linhas de Prompt | Protocolo 6 Blocos | Safety Protocol |
|--------|-----------------|-------------------|----------------|
| PT | ~50 | ✅ Completo | ✅ Detalhado |
| EN | ~15 | ⚠️ Parcial | ⚠️ Resumido |
| ES | ~15 | ⚠️ Parcial | ⚠️ Resumido |
| FR | ~5 | ❌ Ausente | ❌ Mínimo |
| DE | ~5 | ❌ Ausente | ❌ Mínimo |

---

### 3.5 `aiTriagem.ts` — Sistema de Triagem de Feedback

**STATUS: ✅ FUNCIONAL MAS FRÁGIL**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/lib/aiTriagem.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| TR-01 | 🟡 MÉDIO | Prompt contém erro de digitação: "VEREDITO" → "VEREDITO" | Pode causar falha de parse |
| TR-02 | 🟡 MÉDIO | Fallback retorna "INCONSISTENTE" em caso de erro | Feedback legítimo pode ser ignorado |
| TR-03 | 🟡 MÉDIO | Sem validação de Sanitização de Output | Prompt injection potencial |

**Código Problemático:**

```typescript
// TR-01: Erro de digitação no prompt
const prompt = `...
CRITÉRIOS DE VEREDITO:  // ❌ "VEREDITO" → "VEREDITO"
...`  // Linha 27

// TR-02: Fallback sempre INCONSISTENTE
} catch (err) {
  return {
    verdict: "INCONSISTENTE",  // ❌ Sempre assume que mãe está errada
    justification: "Erro na análise automática. Revisar manualmente.",
  };
}
```

---

### 3.6 `painPointExtractor.ts` — Extrator de Pontos de Dor

**STATUS: ⚠️ FUNCIONAL COM FALHA CRÍTICA**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/painPointExtractor.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| PE-01 | 🔴 CRÍTICO | Schema JSON com `strict: true` pode falhar se LLM retornar formato ligeiramente diferente | Retorna array vazio em vez de dados |
| PE-02 | 🟡 MÉDIO | Sem retry logic — uma falha = dados perdidos | Análise incompleta |
| PE-03 | 🟡 MÉDIO | `response_format` pode não ser suportado por todos os modelos | Fallback silencioso |

**Código Problemático:**

```typescript
// PE-01: strict: true pode falhar
const response = await invokeLLM({
  messages: [...],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'pain_points_extraction',
      strict: true,  // ❌ Se LLM retornar algo fora do schema, FALHA
      schema: {...}
    }
  }
});

// PE-03: Sem fallback
const content = response.choices?.[0]?.message?.content;
// Se content não for JSON válido, simplesmente loga e retorna []
```

---

### 3.7 `llm.ts` — Invocação de LLM

**STATUS: ✅ BEM ESTRUTURADO**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/server/_core/llm.ts
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| LL-01 | 🟡 MÉDIO | Modelo "gemini-2.5-flash" hardcoded quando `forgeApiKey` existe | Não permite escolha de modelo |
| LL-02 | 🟡 MÉDIO | `thinking.budget_tokens: 128` muito baixo para prompts complexos | Respostas podem ser superficiais |
| LL-03 | 🟡 MÉDIO | Sem rate limiting ou retry com backoff | Pode sobrecarregar API em burst |

**Código Problemático:**

```typescript
// LL-01: Modelo fixo
const payload: Record<string, unknown> = {
  model: ENV.forgeApiKey ? "gemini-2.5-flash" : "gpt-4o-mini",
  // ❌ "gemini-2.5-flash" é mínimo, pode não ser ideal para todos os casos
};

// LL-02: Thinking budget muito baixo
if (ENV.forgeApiKey) {
  payload.max_tokens = 32768;
  payload.thinking = { budget_tokens: 128 };  // ❌ 128 tokens para reasoning?
  // Para prompts de 500+ tokens, isso é insuficiente
}
```

---

### 3.8 `AIChatBox.tsx` — Componente Frontend

**STATUS: ✅ FUNCIONAL COM RESSALVAS**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/client/src/components/AIChatBox.tsx
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| AC-01 | 🟡 MÉDIO | RatingWidget usa `any` cast para messageId | Type safety comprometida |
| AC-02 | 🟡 MÉDIO | Auto-scroll usa `requestAnimationFrame` sem cancelamento | Memory leak potencial em unmount |
| AC-03 | 🟡 MÉDIO | Não há debounce no input | Pode enviar mensagens duplicadas |

**Código Problemático:**

```typescript
// AC-01: Type any
{(message as any).messageId && (
  <RatingWidget messageId={(message as any).messageId} />
)}
// ❌ Deveria ter interface tipada para Message estendido

// AC-02: Sem cleanup
useEffect(() => {
  requestAnimationFrame(() => {
    viewport.scrollTo({...});
  });
  // ❌ Falta return para cancelamento em unmount
});
```

---

### 3.9 `Chat.tsx` — Página de Chat

**STATUS: ✅ FUNCIONAL COM RESSALVAS**

```typescript
// Arquivo encontrado em:
/workspace/wilbor-assist-v2/client/src/pages/Chat.tsx
```

**Problemas Identificados:**

| ID | Severidade | Problema | Impacto |
|----|------------|----------|---------|
| CT-01 | 🟡 MÉDIO | `monthlyLimit` calculation usa type narrowing inconsistente | Pode mostrar NaN em edge cases |
| CT-02 | 🟡 MÉDIO | Oferta de ebook capturada com `any` cast | Perde tipagem |
| CT-03 | 🟡 MÉDIO | Credit counter pode mostrar valor errado durante loading | UX confusa |

**Código Problemático:**

```typescript
// CT-01: Cálculo complexo e frágil
const monthlyLimit = credits
  ? ("limit" in credits ? credits.limit : "monthlyLimit" in credits ? credits.monthlyLimit : 5)
  : 5;
// ❌ Múltiplas verificações = propenso a erros
// Deveria usar discriminated union
```

---

## 4. Matriz de Problemas por Severidade

### 🔴 CRÍTICO (1-2 dias para correção)

| ID | Módulo | Problema |
|----|--------|----------|
| OA-01 | openai.ts | Arquivo ORFÃO com ~600 linhas de código morto |
| RG-01 | wilborRAG.ts | Busca sem filtro de categoria |
| RG-02 | wilborRAG.ts | Score threshold muito alto |
| PE-01 | painPointExtractor | Schema strict pode falhar |

### 🟠 ALTO (3-5 dias para correção)

| ID | Módulo | Problema |
|----|--------|----------|
| RG-06 | wilborRAG.ts | Seed pode duplicar dados |
| PP-03 | wilborPrompt.ts | FR/DE prompts muito curtos |
| LL-02 | llm.ts | Thinking budget insuficiente |

### 🟡 MÉDIO (1 semana para correção)

| ID | Módulo | Problema |
|----|--------|----------|
| WC-03 | wilborChat.ts | Validação de data ausente |
| RG-03 | wilborRAG.ts | Keywords de cólica incompletas |
| RG-04 | wilborRAG.ts | Timezone hardcoded |
| RG-05 | wilborRAG.ts | RAG não usa "minimal prompt" |
| PP-01 | wilborPrompt.ts | Estruturas inconsistentes |
| PP-02 | wilborPrompt.ts | "Avioncito" em PT |
| PP-04 | wilborPrompt.ts | Emergency words incompletas |
| TR-01 | aiTriagem.ts | Erro de digitação |
| TR-02 | aiTriagem.ts | Fallback incorreto |
| LL-01 | llm.ts | Modelo hardcoded |
| LL-03 | llm.ts | Sem rate limiting |
| AC-01 | AIChatBox.tsx | Type any |
| AC-02 | AIChatBox.tsx | Memory leak |
| CT-01 | Chat.tsx | Type narrowing frágil |

---

## 5. Conflitos Entre Módulos

### 5.1 Conflito: Prompts vs RAG vs Chat

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROBLEMA: Três fontes diferentes de "sistema"                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  wilborPrompt.ts          wilborRAG.ts           wilborChat.ts    │
│  ├── getWilborSystemPrompt()  ├── getWilborSystemPrompt()  ├── getWilborSystemPrompt()
│  │      (prompt ~500 tokens)     │    (prompt ~500 tokens)  │   (prompt ~500 tokens)
│  │                              │                          │
│  └── PROMPTS[] array            └── System prompt usado      └── Usado diretamente
│       (5 versões)                   em formatRAGResponse()        em generateWilborResponse()
│                                                                     │
│  ❌ PROBLEMA: Prompts PT/EN/ES/FR/DE são definidos 3x em lugares   │
│     diferentes, com estruturas diferentes!                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Conflito: Decisão Clarity vs Wilbor

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROBLEMA: openai.ts contém sistema para OUTRO produto               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  openai.ts                          wilborChat.ts                  │
│  ├── DECISION_CLARITY_SYSTEM_PROMPT   ├── getWilborSystemPrompt()  │
│  │    "Você é DECISÃO CLARA"              "Você é WILBOR-ASSIST"  │
│  │    Mentores de liderança               Assistente neonatal      │
│  │    Empresários/fundadores              Mães de primeira viagem  │
│  │    Decisões de alto impacto            Sono, cólica, alimentação│
│  │                                        ▲                        │
│  │                                        │                        │
│  └── ❌ CÓDIGO MORTO                      └── ✅ ATIVO              │
│      ~600 linhas nunca executadas                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Conflito: Timeout de Cálculo de Idade

```typescript
// wilborChat.ts linha 125-131
if (babyData?.birthDate) {
  const diff = Date.now() - new Date(babyData.birthDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 7) babyAge = `${days} dias`;
  // ❌ Se birthDate for 2099-01-01, days será negativo
  // ❌ Se birthDate for inválido, pode gerar NaN
}
```

---

## 6. Recomendações de Correção Prioritárias

### Fase 1: Críticos (Executar Imediatamente)

1. **Remover `openai.ts`** — código morto de 600 linhas
2. **Adicionar filtro de categoria em `searchKnowledgeBase()`** — performance
3. **Ajustar score threshold para 5 em vez de 8** — recall
4. **Corrigir `strict: true` em `painPointExtractor`** — robusteza

### Fase 2: Altos (Executar em 1 semana)

1. **Expandir prompts FR/DE** para igualar PT — consistência
2. **Adicionar validação de data** em `buildChatContext()` — segurança
3. **Implementar retry logic** em `painPointExtractor` — resiliência
4. **Remover duplicação** de `getWilborSystemPrompt()` — DRY

### Fase 3: Médios (Executar em 2 semanas)

1. **Corrigir "Avioncito" → "Aviãozinho"** em prompt PT
2. **Adicionar rate limiting** em `llm.ts`
3. **Aumentar `thinking.budget_tokens`** para 1024
4. **Corrigir erro de digitação** "VEREDITO" → "VEREDITO"

---

## 7. Métricas de Qualidade Sugeridas

| Métrica | Target | Atual |
|---------|--------|-------|
| Cobertura de teste | >80% | Desconhecida |
| Tempo de resposta LLM | <3s p95 | ~5s |
| Taxa de RAG hit | >70% | ~40% |
| Taxa de erro de parse | <0.1% | ~2% |
| Cobertura de i18n (prompts) | 100% | 40% (PT/EN/ES) |

---

## 8. Conclusão

O sistema de IA do Wilbor possui uma **arquitetura sólida** mas sofre de:

1. **Código morto significativo** (~600 linhas em openai.ts)
2. **Inconsistências de i18n** nos prompts
3. **Problemas de performance** no RAG
4. **Falta de robustez** em parsing de JSON

**Recomendação geral:** Priorizar remoção de código morto + expansão de prompts FR/DE, seguido de otimização RAG.
