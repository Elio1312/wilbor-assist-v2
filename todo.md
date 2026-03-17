# Wilbor-Assist v2 - TODO

## Fase 1: Análise e Planejamento
- [x] Analisar código-fonte extraído
- [x] Entender estrutura do banco de dados
- [x] Revisar guia de deployment
- [x] Inicializar projeto web-db-user no Manus

## Fase 2: Migração e Configuração BD
- [ ] Copiar schema.ts completo do projeto antigo
- [ ] Executar migrations do banco de dados
- [ ] Importar 384 perguntas da base de conhecimento
- [ ] Configurar variáveis de ambiente (DATABASE_URL, JWT_SECRET, etc)

## Fase 3: Funcionalidades Principais
- [ ] Chat de IA 24h com memória por bebê
- [ ] Sistema de cadastro de múltiplos bebês
- [ ] Perfis individuais (nome, idade, peso, semanas gestacionais, condições especiais)
- [ ] Trilha de desenvolvimento com marcos semanais (Wonder Weeks)
- [ ] Banco de receitas por idade com fotos
- [ ] Dashboard principal com navegação

## Fase 4: Funcionalidades Avançadas
- [ ] Registro e predição de sono
- [ ] Janelas de vigília por faixa etária
- [ ] Protocolos de emergência com detecção de sinais de alerta
- [ ] Seção 'Meu Corpo' com exercícios pós-parto
- [ ] Nutrição materna e controle de peso
- [ ] Cuidados com pele, cabelo e estrias

## Fase 5: Integrações e Sistema Trilíngue
- [ ] Integração com Stripe (3 planos: Visita Livre, Premium, Manual)
- [ ] Integração com WhatsApp para consultas
- [ ] Notificações semanais via WhatsApp
- [ ] Sistema trilíngue (PT, EN, ES)
- [ ] Prompts de IA especializados por idioma
- [ ] Seletor de idioma na interface

## Fase 6: Testes e Entrega
- [ ] Testes unitários (vitest)
- [ ] Testes de integração
- [ ] Validação de fluxos críticos
- [ ] Otimização de performance
- [ ] Checkpoint final e publicação

## Componentes Críticos
- [ ] wilborPrompt.ts - Prompts trilíngues da IA
- [ ] wilborChat.ts - Lógica do chat
- [ ] wilborDb.ts - Queries do banco
- [ ] wilborRAG.ts - Retrieval Augmented Generation
- [ ] wilborRecipes.ts - Sistema de receitas
- [ ] stripeProducts.ts - Integração Stripe
- [ ] WhatsApp notifications - Notificações

## Notas
- Base de conhecimento: 384 perguntas trilíngues
- Protocolos: SBP, OMS, AAP
- Banco de dados: MySQL/TiDB com Drizzle ORM
- Frontend: React 19 + Tailwind 4
- Backend: Express + tRPC
