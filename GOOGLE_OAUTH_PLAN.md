# Plano de Implementação: Google OAuth + Fingerprinting

## Status Atual (Análise Completa)

### Arquitetura de Autenticação
- **Atual:** Manus OAuth (desativado por falta de créditos)
- **Arquivo:** `/server/_core/oauth.ts` e `/server/_core/sdk.ts`
- **Fluxo:** 
  1. Usuário clica "Entrar" → redireciona para Manus OAuth
  2. Manus retorna código → `/api/oauth/callback`
  3. SDK troca código por token → cria sessão JWT
  4. Sessão salva em cookie `manus-session-token`

### Banco de Dados
- **Tabela `users`:** Autenticação (openId, email, loginMethod, lastSignedIn)
- **Tabela `wilborUsers`:** Produto (email, name, trialExpiresAt, subscriptionStatus, messageCount)
- **Tabela `wilborUserCredits`:** Planos (plan: free/premium/manual, monthlyLimit: 5/500, messagesUsed, periodStart/End)

### Fluxo de Créditos Atual
1. Usuário faz login → cria entrada em `wilborUserCredits` com plan=free, monthlyLimit=5
2. Cada mensagem incrementa `messagesUsed`
3. Se `messagesUsed >= monthlyLimit` → bloqueia com erro `CREDIT_LIMIT_REACHED`
4. PaywallModal aparece → usuário clica em upgrade → Stripe checkout

### Acesso Anônimo (Implementado)
- Chat permite usuários sem autenticação (publicProcedure)
- userId gerado como `anon-{timestamp}-{random}`
- **PROBLEMA:** Sem limite de 5 mensagens para anônimos (não há rastreamento)

---

## Implementação: Google OAuth + Fingerprinting

### Fase 1: Substituir Manus OAuth por Google OAuth

#### 1.1 Criar Credenciais no Google Cloud
- [ ] Projeto: "Wilbor Assist" (já criado)
- [ ] OAuth consent screen: External (já criado)
- [ ] Credenciais: OAuth 2.0 Client ID (Web application)
  - Redirect URIs:
    - `https://wilbor-assist.com/api/auth/google/callback`
    - `https://www.wilbor-assist.com/api/auth/google/callback`
    - `http://localhost:5173/api/auth/google/callback` (dev)

#### 1.2 Adicionar Variáveis de Ambiente
```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

#### 1.3 Implementar Google OAuth Routes
- Criar `/server/_core/googleOAuth.ts`
- Rota GET `/api/auth/google` → redireciona para Google
- Rota GET `/api/auth/google/callback` → troca código por token → cria usuário/sessão

#### 1.4 Atualizar SDK
- Manter `sdk.createSessionToken()` e `sdk.verifySession()` (reutilizável)
- Remover dependência do Manus OAuth

### Fase 2: Implementar Fingerprinting de Dispositivo

#### 2.1 Adicionar Tabela de Fingerprints Anônimos
```sql
CREATE TABLE wilborAnonymousFingerprints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deviceFingerprint VARCHAR(255) NOT NULL UNIQUE,
  messagesUsed INT DEFAULT 0,
  monthlyLimit INT DEFAULT 5,
  periodStart TIMESTAMP DEFAULT NOW(),
  periodEnd TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

#### 2.2 Adicionar Biblioteca de Fingerprinting
- Usar `@fingerprintjs/fingerprintjs` (gratuito, confiável)
- Gera ID único por dispositivo/navegador
- Envia ao servidor em cada requisição

#### 2.3 Lógica de Controle de Uso Anônimo
```
1. Usuário acessa chat
2. Frontend gera deviceFingerprint
3. Envia mensagem com fingerprint
4. Backend verifica:
   - Se fingerprint existe em wilborAnonymousFingerprints
   - Se messagesUsed < monthlyLimit
   - Se sim → incrementa messagesUsed
   - Se não → retorna erro "ANONYMOUS_LIMIT_REACHED"
5. Frontend mostra PaywallModal → "Crie sua conta para continuar"
```

### Fase 3: Fluxo Completo (Usuário Novo)

```
1. Acessa wilbor-assist.com
2. Clica "Testar grátis agora"
3. Chat carrega → gera deviceFingerprint
4. Envia 5 mensagens (limite anônimo)
5. Na 6ª mensagem → PaywallModal: "Crie sua conta para continuar"
6. Clica "Entrar com Google"
7. Redireciona para Google → volta com token
8. Backend:
   - Cria usuário em `users` (googleId, email, name)
   - Cria usuário em `wilborUsers` (email, name, trialExpiresAt=5 dias)
   - Cria entrada em `wilborUserCredits` (plan=free, monthlyLimit=5, messagesUsed=0)
   - Cria sessão JWT
9. Frontend redireciona para /dashboard
10. Usuário tem mais 5 mensagens (total 10: 5 anônimas + 5 autenticadas)
11. Após 5 autenticadas → PaywallModal: "Upgrade para Premium"
12. Clica upgrade → Stripe checkout → pagamento → plan=premium, monthlyLimit=500
```

---

## Arquivos a Modificar

### Backend
1. `/server/_core/env.ts` → Adicionar GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
2. `/server/_core/googleOAuth.ts` → NOVO arquivo com Google OAuth routes
3. `/server/_core/oauth.ts` → Remover Manus OAuth (ou manter como fallback)
4. `/server/routers.ts` → Adicionar fingerprinting na mutation de chat
5. `/drizzle/schema.ts` → Adicionar tabela wilborAnonymousFingerprints
6. `/server/wilborDb.ts` → Adicionar funções para fingerprinting

### Frontend
1. `/client/src/const.ts` → Remover getLoginUrl() do Manus, adicionar Google OAuth
2. `/client/src/_core/hooks/useAuth.ts` → Adaptar para Google OAuth
3. `/client/src/pages/Chat.tsx` → Adicionar fingerprinting, enviar com cada mensagem
4. `/client/src/components/PaywallModal.tsx` → Atualizar copy para "Crie sua conta"

### Banco de Dados
1. Criar migration: `wilborAnonymousFingerprints` table

---

## Pacotes NPM Necessários

### Backend
```bash
npm install passport-google-oauth20
npm install @types/passport-google-oauth20 --save-dev
```

### Frontend
```bash
npm install @fingerprintjs/fingerprintjs
```

---

## Variáveis de Ambiente (Koyeb)

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
JWT_SECRET=seu_secret_aqui (já existe)
DATABASE_URL=sua_url_railway (já existe)
```

---

## Timeline Estimada

| Fase | Tarefa | Tempo |
|------|--------|-------|
| 1 | Setup Google Cloud + credenciais | 5 min |
| 2 | Implementar Google OAuth routes | 15 min |
| 3 | Atualizar SDK e autenticação | 10 min |
| 4 | Criar tabela de fingerprints | 5 min |
| 5 | Implementar fingerprinting backend | 15 min |
| 6 | Implementar fingerprinting frontend | 15 min |
| 7 | Testes e ajustes | 15 min |
| **Total** | | **80 min** |

---

## Próximos Passos

1. ✅ Elio termina configuração do Google Cloud
2. ⏳ Implementar Google OAuth routes
3. ⏳ Adicionar fingerprinting
4. ⏳ Deploy e testes
