# 🔍 Google Search Console - Migração de wilborassist.com → www.wilbor-assist.com

## 📋 SITUAÇÃO ATUAL

| Item | Status | Detalhe |
|------|--------|---------|
| **Domínio antigo** | ❌ PARADO | wilborassist.com (10 URLs indexadas) |
| **Domínio novo** | ✅ ATIVO | www.wilbor-assist.com (novo) |
| **Conflito SEO** | ⚠️ CRÍTICO | Conteúdo duplicado = penalidade |
| **Redirects 301** | ✅ CONFIGURADO | Servidor Express pronto |

---

## ✅ CHECKLIST DE MIGRAÇÃO

### PASSO 1: Verificar Redirects 301 (JÁ FEITO ✅)
```typescript
// Arquivo: server/_core/index.ts
// Status: ✅ Configurado com as 10 URLs principais
// Função: Redireciona automaticamente para www.wilbor-assist.com
```

**Teste local:**
```bash
curl -I http://localhost:3000/blog/bebe-nao-dorme
# Deve retornar: HTTP/1.1 301 Moved Permanently
# Location: https://www.wilbor-assist.com/blog/bebe-nao-dorme
```

### PASSO 2: Publicar Site Novo
1. Clicar em "Publish" no Management UI
2. Confirmar domínio: www.wilbor-assist.com
3. Aguardar site ficar online (2-5 min)

### PASSO 3: Verificar Sitemap Atualizado (JÁ FEITO ✅)
```xml
<!-- Arquivo: client/public/sitemap.xml -->
<!-- Status: ✅ Contém as 10 URLs principais -->
<!-- Prioridade: 0.8 (alta) -->
```

### PASSO 4: Configurar Google Search Console

#### 4.1 - Remover URLs Antigas (wilborassist.com)
1. Acessar: https://search.google.com/search-console
2. Selecionar propriedade: **wilborassist.com**
3. Ir para "Remover URLs"
4. Remover as 10 URLs:
   - /blog/bebe-nao-dorme
   - /blog/colica-do-bebe
   - /blog/febre-no-bebe
   - /blog/introducao-alimentar
   - /blog/depressao-pos-parto
   - /blog/vacinas-do-bebe
   - /blog/amamentacao-pega-correta
   - /blog/seguranca-bebe-em-casa
   - /blog/saltos-de-desenvolvimento
   - /blog/banho-do-recem-nascido

#### 4.2 - Adicionar Propriedade Nova (www.wilbor-assist.com)
1. Clicar em "Adicionar propriedade"
2. Tipo: URL
3. Inserir: `https://www.wilbor-assist.com`
4. Clicar "Continuar"

#### 4.3 - Verificar Propriedade Nova
**Método recomendado: Arquivo HTML**
1. Google oferecerá arquivo: `google1234567890abcdef.html`
2. Fazer download
3. Colocar em `/client/public/google1234567890abcdef.html`
4. Fazer novo checkpoint
5. Publicar novamente
6. Voltar ao GSC e clicar "Verificar"

#### 4.4 - Enviar Sitemap
1. Após verificação, ir para "Sitemaps"
2. Clicar "Adicionar novo sitemap"
3. Inserir: `https://www.wilbor-assist.com/sitemap.xml`
4. Clicar "Enviar"

#### 4.5 - Configurar Mudança de Endereço (CRÍTICO!)
1. Ir para "Configurações"
2. Clicar em "Mudança de endereço"
3. Selecionar: wilborassist.com → www.wilbor-assist.com
4. Confirmar
5. **Isso transfere TODO o SEO antigo para o novo!** 💪

---

## 🔄 FLUXO AUTOMÁTICO DE REDIRECTS

```
Usuário acessa: wilborassist.com/blog/bebe-nao-dorme
         ↓
Servidor Express detecta path
         ↓
Middleware de redirects ativa
         ↓
HTTP 301 Moved Permanently
         ↓
Redireciona para: www.wilbor-assist.com/blog/bebe-nao-dorme
         ↓
Google reconhece redirect 301
         ↓
Transfere ranking para novo domínio ✅
```

---

## 📊 IMPACTO ESPERADO

### Antes da Migração
- 2 domínios diferentes
- Conteúdo duplicado
- Penalidade SEO potencial
- Ranking confuso

### Depois da Migração
- 1 domínio unificado
- Sem duplicação
- Ranking preservado
- Tráfego consolidado

---

## ⏱️ TIMELINE

| Ação | Tempo | Status |
|------|-------|--------|
| Configurar redirects 301 | ✅ Feito | Pronto |
| Atualizar sitemap.xml | ✅ Feito | Pronto |
| Publicar site novo | ⏳ Próximo | Aguardando |
| Remover URLs antigas (GSC) | ⏳ Manual | 5 min |
| Adicionar propriedade nova | ⏳ Manual | 5 min |
| Verificar propriedade | ⏳ Manual | 5 min |
| Mudança de endereço (GSC) | ⏳ Manual | 2 min |
| Enviar sitemap | ⏳ Manual | 2 min |
| **Total** | **~20 min** | |

---

## 🚨 PONTOS CRÍTICOS

### ✅ JÁ CONFIGURADO
- Redirects 301 no servidor
- Sitemap.xml atualizado
- robots.txt pronto
- Verificação HTML pronta

### ⏳ PRECISA FAZER MANUALMENTE
- Remover URLs no GSC antigo
- Adicionar propriedade no GSC novo
- Verificar propriedade
- Configurar mudança de endereço
- Enviar sitemap

### 🔴 NÃO FAZER
- ❌ Não deletar domínio antigo imediatamente
- ❌ Não remover redirects 301
- ❌ Não usar www e sem www simultaneamente

---

## 💡 DICAS

1. **Esperar 24h após redirects** antes de remover URLs antigas
2. **Monitorar GSC diariamente** nos primeiros 7 dias
3. **Manter redirects 301 permanentemente** (nunca remover)
4. **Verificar logs** para confirmar redirects funcionando

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verificar se site está online: `curl https://www.wilbor-assist.com`
2. Testar redirect: `curl -I https://www.wilborassist.com/blog/bebe-nao-dorme`
3. Verificar sitemap: `curl https://www.wilbor-assist.com/sitemap.xml`
4. Checar GSC por erros de rastreamento

---

**Última atualização:** 2026-03-18 02:33 GMT-3
**Status:** Pronto para publicação
**Próximo passo:** Publicar site + configurar GSC manualmente
