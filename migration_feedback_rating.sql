-- ============================================================
-- MIGRATION: Adicionar feedbackRating na tabela wilborMessages
-- Gerado por: Pool (Manus) - 06/04/2026
-- Objetivo: Implementar sistema de rating 5 estrelas + alarme CEO
-- ============================================================

-- 1. Adicionar coluna feedbackRating (nullable, 1-5 estrelas)
ALTER TABLE wilborMessages 
ADD COLUMN IF NOT EXISTS feedbackRating INT NULL COMMENT 'Rating 1-5 estrelas da mãe. NULL = sem feedback. <=2 = alarme CEO';

-- 2. Verificar se coluna foi adicionada
SELECT 
  COLUMN_NAME, 
  DATA_TYPE, 
  IS_NULLABLE,
  COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'wilborMessages' 
  AND COLUMN_NAME = 'feedbackRating'
  AND TABLE_SCHEMA = DATABASE();

-- ============================================================
-- COMO RODAR:
-- No terminal do Koyeb ou Railway:
-- mysql -u root -p railway < migration_feedback_rating.sql
-- OU via painel Railway > Query:
-- Cole apenas o ALTER TABLE acima
-- ============================================================
