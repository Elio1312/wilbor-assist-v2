# 🚀 WILBOR v2 — RELATÓRIO DE HANDOFF PARA MANUS 2

**Data:** 24/03/2026  
**Projeto:** Wilbor-Assist v2  
**Domínio de produção:** https://www.wilbor-assist.com  
**Repositório local:** `/home/ubuntu/wilbor-assist-v2`  
**Checkpoint atual:** `163995e2`  
**Stack:** React 19 + Tailwind 4 + Express 4 + tRPC 11 + MySQL (Drizzle ORM)

---

## ⚠️ REGRAS OBRIGATÓRIAS

1. **NUNCA use `git reset --hard`** — use `webdev_rollback_checkpoint` para reverter
2. **SEMPRE salve checkpoint** antes de mudanças grandes
3. **SEMPRE leia o `todo.md`** antes de começar qualquer tarefa
4. **Modo econômico de créditos** — sem pesquisas externas sem necessidade
5. **Quando terminar**, zip o projeto e envie ao Silva para hospedar aqui (este Manus é o único que pode publicar em `www.wilbor-assist.com`)

---

## ✅ O QUE JÁ ESTÁ FEITO (NÃO REFAZER)

| Funcionalidade | Status |
|---|---|
| Landing page completa PT/EN/ES | ✅ |
| Sistema i18n (contexto + hook + traduções) | ✅ |
| Seletor de idioma BR/EN/ES no header | ✅ |
| Rotas `/en/` e `/es/` para todas as páginas | ✅ |
| 20 artigos blog PT (10 originais + 10 novos) | ✅ |
| 20 artigos blog EN (10 traduzidos + 5 novos) | ✅ |
| 20 artigos blog ES (10 traduzidos + 5 novos) | ✅ |
| 20 imagens premium integradas (CDN) | ✅ |
| Hreflang tags + sitemap multilíngue | ✅ |
| Stripe BRL/USD/EUR + página `/checkout` | ✅ |
| Chat Wilbor com 336 perguntas integradas | ✅ |
| Dashboard do usuário | ✅ |
| Sistema de créditos | ✅ |
| OAuth (login Manus) | ✅ |

---

## ❌ TAREFAS PENDENTES (FAZER NO MANUS 2)

### TAREFA 1 — Paywall (PRIORIDADE MÁXIMA — ROI imediato)

**O que fazer:** Bloquear o chat após 2 consultas gratuitas e redirecionar para `/checkout`.

**Arquivos a modificar:**
- `server/db.ts` — adicionar função `getUserFreeConsultations(userId)`
- `server/routers.ts` — verificar contador antes de responder no chat
- `client/src/pages/Dashboard.tsx` — mostrar contador de consultas restantes
- `client/src/components/AIChatBox.tsx` — mostrar modal de upgrade após 2 consultas

**Lógica:**
```typescript
// Em server/routers.ts, no procedure do chat:
const freeCount = await getUserFreeConsultations(ctx.user.id);
if (freeCount >= 2 && !userHasActiveSubscription(ctx.user.id)) {
  throw new TRPCError({ 
    code: 'FORBIDDEN', 
    message: 'FREE_LIMIT_REACHED' 
  });
}
```

**No frontend (AIChatBox.tsx):**
- Quando receber erro `FREE_LIMIT_REACHED`, mostrar modal com:
  - Texto: "Você usou suas 2 consultas gratuitas! 💜 Continue com o Wilbor Premium"
  - Botão: "Ver planos" → redireciona para `/checkout`
  - Versão EN: "You've used your 2 free consultations! Continue with Wilbor Premium"
  - Versão ES: "¡Usaste tus 2 consultas gratuitas! Continúa con Wilbor Premium"

**Schema necessário (drizzle/schema.ts):**
```typescript
// Verificar se já existe campo free_consultations_used na tabela users
// Se não existir, adicionar:
freeConsultationsUsed: int('free_consultations_used').default(0),
```

---

### TAREFA 2 — Corrigir testes Blog DB (15 falhas)

**Problema:** Os testes em `server/routers/blog.test.ts` esperam artigos no banco de dados (tabela `blog_articles`), mas o blog atual usa arquivo estático `client/src/pages/blogArticlesData` (dentro de `Blog.tsx`).

**Solução mais simples:** Atualizar os testes para refletir a arquitetura atual (arquivo estático), não o banco.

**Arquivo:** `server/routers/blog.test.ts`

**O que mudar:** Substituir queries ao banco por imports do arquivo estático e verificar que os 20 artigos PT existem no array.

---

### TAREFA 3 — Revisão completa do Chat Wilbor (336 perguntas)

**O que fazer:** Testar as respostas do chat para as principais categorias de perguntas e identificar falhas.

**Arquivo de perguntas:** `server/wilborQuestions.ts` (ou similar — verificar com `grep -rn "336\|questions" /home/ubuntu/wilbor-assist-v2/server/`)

**Categorias a testar:**
1. Sono do bebê (ex: "Meu bebê de 2 meses não dorme mais de 2 horas")
2. Amamentação (ex: "Meu leite secou, o que fazer?")
3. Cólica (ex: "Bebê chora muito à noite, pode ser cólica?")
4. Febre (ex: "Bebê com 38.5°C, o que fazer?")
5. Desenvolvimento (ex: "Meu bebê de 4 meses ainda não sorri")
6. Alimentação complementar (ex: "Quando posso dar fruta para o bebê?")
7. Vacinação (ex: "Quais vacinas o bebê toma com 2 meses?")
8. Emergências (ex: "Bebê engasgou, o que fazer?")

**O que verificar:**
- A resposta menciona protocolos SBP/OMS/AAP?
- A resposta é empática e não alarmista?
- A resposta sugere consultar pediatra quando necessário?
- Há mensagens de erro ou respostas vazias?

**Como testar:** Usar o chat no dashboard em `https://www.wilbor-assist.com/dashboard` (precisa de login)

**Formato de relatório:**
```
PERGUNTA: [pergunta testada]
RESPOSTA: [resumo da resposta]
STATUS: ✅ OK / ⚠️ MELHORAR / ❌ FALHA
OBSERVAÇÃO: [o que melhorar]
```

---

### TAREFA 4 — ManyChat EN/ES (conteúdo, não código)

**O que fazer:** Criar os textos dos fluxos ManyChat em EN e ES para integração futura.

**Fluxo básico a criar:**
1. Mensagem de boas-vindas EN: "Hi! I'm Wilbor, your 24/7 AI newborn assistant 💜 What would you like help with today?"
2. Menu EN: Sleep | Feeding | Colic | Development | Emergency
3. Mensagem de boas-vindas ES: "¡Hola! Soy Wilbor, tu asistente IA neonatal 24/7 💜 ¿En qué puedo ayudarte hoy?"
4. Menu ES: Sueño | Alimentación | Cólico | Desarrollo | Emergencia

**Entrega:** Documento `.md` com todos os textos organizados por idioma e fluxo.

---

### TAREFA 5 — Google Ads textos (conteúdo, não código)

**O que fazer:** Criar textos de anúncios Google Ads para PT/EN/ES.

**Formato necessário (por anúncio):**
- Headline 1 (30 chars máx)
- Headline 2 (30 chars máx)
- Headline 3 (30 chars máx)
- Description 1 (90 chars máx)
- Description 2 (90 chars máx)
- URL de destino

**Criar 3 anúncios por idioma = 9 anúncios total**

**Palavras-chave alvo:**
- PT: "assistente bebê", "dúvidas bebê", "sono bebê", "cólica bebê"
- EN: "newborn assistant", "baby sleep help", "baby colic relief"
- ES: "asistente bebé", "sueño bebé", "cólico bebé"

---

## 📁 ESTRUTURA DO PROJETO (ARQUIVOS-CHAVE)

```
wilbor-assist-v2/
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx              ← Landing page (PT/EN/ES)
│   │   ├── Blog.tsx              ← Blog com artigos estáticos
│   │   ├── BlogArticle.tsx       ← Página de artigo individual
│   │   ├── blogArticlesI18n.ts   ← Artigos EN + ES
│   │   ├── Dashboard.tsx         ← Dashboard do usuário
│   │   ├── Checkout.tsx          ← Página de checkout BRL/USD/EUR
│   │   └── BuyCredits.tsx        ← Compra de créditos extras
│   ├── contexts/
│   │   └── i18n.tsx              ← Sistema de tradução PT/EN/ES
│   ├── components/
│   │   ├── AIChatBox.tsx         ← Chat Wilbor (ADICIONAR PAYWALL AQUI)
│   │   └── LanguageSwitcher.tsx  ← Seletor de idioma
│   └── App.tsx                   ← Rotas (PT + /en/ + /es/)
├── server/
│   ├── routers.ts                ← tRPC procedures principais
│   ├── db.ts                     ← Queries do banco
│   ├── stripeIntegration.ts      ← Stripe SDK (BRL)
│   ├── stripeMultiCurrency.ts    ← Stripe USD/EUR
│   ├── stripeProducts.ts         ← Produtos e preços
│   └── wilborQuestions.ts        ← 336 perguntas do chat
├── drizzle/
│   └── schema.ts                 ← Schema do banco de dados
└── todo.md                       ← Lista de tarefas (SEMPRE ATUALIZAR)
```

---

## 🔧 COMO RODAR O PROJETO

O projeto já está configurado no Manus com todas as variáveis de ambiente. Ao abrir o projeto, o servidor já está rodando.

**Comandos úteis:**
```bash
# Ver status do servidor
webdev_check_status

# Reiniciar servidor
webdev_restart_server

# Rodar testes
cd /home/ubuntu/wilbor-assist-v2 && npx vitest run

# Ver logs de erro
tail -50 /home/ubuntu/wilbor-assist-v2/.manus-logs/devserver.log
```

---

## 📤 COMO ENTREGAR AO SILVA

Quando terminar as tarefas, **NÃO publique** — apenas:

1. Salve checkpoint: `webdev_save_checkpoint`
2. Zip o projeto: `zip -r wilbor-v2-final.zip /home/ubuntu/wilbor-assist-v2 --exclude "*/node_modules/*" --exclude "*/.git/*"`
3. Envie o zip ao Silva
4. Silva traz o zip para este Manus (conta principal) para publicar em `www.wilbor-assist.com`

---

## 💡 DICAS IMPORTANTES

- **Modo econômico:** Não faça pesquisas externas sem necessidade. Use o código existente como referência.
- **Testes:** Sempre rode `npx vitest run` após mudanças e corrija falhas antes de entregar.
- **Checkpoint:** Salve checkpoint após cada tarefa concluída.
- **i18n:** Para textos novos, adicione em `client/src/contexts/i18n.tsx` nas três seções (pt, en, es).
- **Stripe:** O checkout BRL já funciona. Para USD/EUR, use `stripeMultiCurrencyRouter`.

---

*Relatório gerado em 24/03/2026 — Manus 1.6 (conta principal)*
