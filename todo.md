# Wilbor-Assist v2 - TODO

## Fase 1: Análise e Planejamento
- [x] Analisar código-fonte extraído
- [x] Entender estrutura do banco de dados
- [x] Revisar guia de deployment
- [x] Inicializar projeto web-db-user no Manus

## Fase 2: Migração e Configuração BD
- [x] Copiar schema.ts completo do projeto antigo
- [x] Executar migrations do banco de dados
- [x] Importar 120+ perguntas da base de conhecimento (trilíngues)
- [x] Configurar variáveis de ambiente (DATABASE_URL, JWT_SECRET, etc)

## Fase 3: Funcionalidades Principais
- [x] Chat de IA 24h com memória por bebê
- [x] Sistema de cadastro de múltiplos bebês
- [x] Perfis individuais (nome, idade, peso, semanas gestacionais, condições especiais)
- [x] Trilha de desenvolvimento com marcos semanais (Wonder Weeks)
- [x] Banco de 55 receitas por idade com 58 fotos no CDN
- [x] Landing page com 8 seções (Hero, Features, Pricing, FAQ, Footer)

## Fase 4: Funcionalidades Avançadas
- [x] Registro e predição de sono
- [x] Janelas de vigília por faixa etária
- [x] Protocolos de emergência com detecção de sinais de alerta
- [x] Seção 'Meu Corpo' com 4 cards (Exercícios, Nutrição, Pele, Peso)
- [x] Nutrição materna e controle de peso
- [x] Cuidados com pele, cabelo e estrias

## Fase 5: Integrações e Sistema Trilíngue
- [x] Integração com Stripe (3 planos: Free, Premium R$19.90/mês, Manual R$29.90 lifetime)
- [x] Integração com WhatsApp documentada (15 fluxos via ManyChat)
- [x] Sistema trilíngue (PT, EN, ES)
- [x] Prompts de IA especializados por idioma com protocolos de segurança
- [x] Seletor de idioma na interface

## Fase 6: Testes e Entrega
- [x] Limpeza de erros TypeScript
- [x] Remoção de remnants do projeto antigo
- [x] Validação de fluxos críticos
- [x] Otimização de performance
- [x] Checkpoint final e pronto para publicação

## Componentes Críticos - IMPLEMENTADOS
- [x] wilborPrompt.ts - Prompts trilíngues da IA com 6 blocos de medicação
- [x] wilborChat.ts - Lógica do chat com RAG e detecção de emergências
- [x] wilborDb.ts - Queries do banco com 13 tabelas
- [x] wilborRAG.ts - Retrieval Augmented Generation com 120+ Q&A
- [x] wilborRecipes.ts - Sistema de 55 receitas (6 meses a 2 anos, SBP/OMS/AAP)
- [x] stripeProducts.ts - Integração Stripe com 3 planos
- [x] WhatsApp notifications - 15 fluxos documentados

## Status Final
- ✅ Backend: 100% funcional
- ✅ Frontend: Landing page pixel-perfect + Dashboard
- ✅ Database: 13 tabelas + 120+ Q&A trilíngues
- ✅ Receitas: 55 completas com 58 imagens no CDN
- ✅ Integrações: Stripe + WhatsApp documentadas
- ✅ TypeScript: Sem erros
- ✅ PRONTO PARA PUBLICAÇÃO

## Próximos Passos (Usuário)
1. Clicar em "Publish" no Management UI (após checkpoint)
2. Reivindicar domínio wilborassist.com nas configurações de domínio
3. Configurar chaves Stripe para ativar pagamentos
4. Configurar ManyChat para WhatsApp
