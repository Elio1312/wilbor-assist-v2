# 🔍 Google Search Console - Configuração para wilbor-assist.com

## ⏰ TIMELINE

- **DNS Propagação:** 1-2 horas (em progresso)
- **Quando publicar:** Após DNS propagar
- **Configuração GSC:** Imediatamente após DNS propagar

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

### PASSO 1: Aguardar DNS Propagação (1-2h)
```bash
# Verificar propagação DNS
nslookup www.wilbor-assist.com
# Deve retornar: cname.manus.space
```

### PASSO 2: Publicar Site (após DNS propagar)
1. Clicar em "Publish" no Management UI
2. Confirmar domínio: www.wilbor-assist.com
3. Aguardar site ficar online

### PASSO 3: Acessar Google Search Console
1. Ir para: https://search.google.com/search-console
2. Fazer login com Google Account (Silva)
3. Clicar em "Adicionar propriedade"

### PASSO 4: Adicionar Propriedade
**Opção 1: URL (Recomendado)**
- Tipo: URL
- Inserir: `https://www.wilbor-assist.com`
- Clicar "Continuar"

**Opção 2: Domínio (Alternativa)**
- Tipo: Domínio
- Inserir: `wilbor-assist.com`
- Clicar "Continuar"

### PASSO 5: Verificar Propriedade
**Método 1: Arquivo HTML (Mais rápido)**
1. Google vai oferecer arquivo: `google1234567890abcdef.html`
2. Fazer download
3. Colocar em `/client/public/google1234567890abcdef.html`
4. Fazer novo checkpoint
5. Publicar novamente
6. Voltar ao GSC e clicar "Verificar"

**Método 2: Meta Tag**
1. Google vai oferecer: `<meta name="google-site-verification" content="..." />`
2. Já está em `/client/public/index.html`
3. Clicar "Verificar" no GSC

**Método 3: CNAME DNS (Mais lento)**
1. Google vai oferecer CNAME
2. Adicionar em Cloudflare
3. Aguardar propagação (24h)
4. Clicar "Verificar"

### PASSO 6: Enviar Sitemap
1. Após verificação, ir para "Sitemaps"
2. Clicar "Adicionar novo sitemap"
3. Inserir: `https://www.wilbor-assist.com/sitemap.xml`
4. Clicar "Enviar"

### PASSO 7: Verificar Indexação
1. Ir para "Cobertura"
2. Aguardar Google rastrear (pode levar 24-48h)
3. Verificar erros de rastreamento
4. Corrigir conforme necessário

### PASSO 8: Monitorar Performance
1. Ir para "Performance"
2. Verificar:
   - Cliques (CTR)
   - Impressões
   - Posição média
   - Dispositivos

---

## 📁 ARQUIVOS CRIADOS

✅ `/client/public/robots.txt` - Controla rastreamento
✅ `/client/public/sitemap.xml` - Lista de URLs
✅ `/client/public/google-site-verification.html` - Verificação alternativa
✅ `/client/public/index.html` - Contém meta tag de verificação

---

## 🎯 METAS SEO

| Métrica | Meta | Timeline |
|---------|------|----------|
| Indexação | 100% das URLs | 7 dias |
| Posição média | Top 10 | 30 dias |
| CTR | >5% | 60 dias |
| Impressões | 1000+ | 30 dias |

---

## 🚨 PROBLEMAS COMUNS

### Problema: "Propriedade não verificada"
- ✅ Solução: Usar método de arquivo HTML (mais rápido)

### Problema: "Sitemap inválido"
- ✅ Solução: Verificar URLs no sitemap.xml existem
- ✅ Solução: Usar https:// em todas as URLs

### Problema: "Não consegue rastrear"
- ✅ Solução: Verificar robots.txt não bloqueia /
- ✅ Solução: Verificar site está online

### Problema: "Muitos erros 404"
- ✅ Solução: Verificar rotas no App.tsx
- ✅ Solução: Adicionar redirects para URLs antigas

---

## 📊 PRÓXIMAS AÇÕES

1. ⏳ **Aguardar DNS propagar** (1-2h)
2. 🚀 **Publicar site** (após DNS)
3. 🔍 **Adicionar ao GSC** (imediatamente)
4. ✅ **Verificar propriedade** (arquivo HTML)
5. 📤 **Enviar sitemap** (após verificação)
6. 📈 **Monitorar performance** (diariamente)

---

## 💡 DICAS

- **Não enviar sitemap antes de verificar** - GSC rejeita
- **Usar www.wilbor-assist.com** - Consistência
- **Monitorar erros diariamente** - Primeiros 7 dias
- **Responder a erros rapidamente** - Melhora indexação

---

**Última atualização:** 2026-03-18 02:44 GMT-3
**Status:** Pronto para publicação
**Próximo passo:** Aguardar DNS propagar
