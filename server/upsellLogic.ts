/**
 * Lógica de Upsell Inteligente - Wilbor
 * Mapeia conversas para produtos específicos do Shop
 */

export type UpsellCategory = "casamento" | "emocoes" | "sono" | "rotina" | "alimentacao";

export function identifyUpsellCategory(text: string): UpsellCategory | null {
  const normalized = text.toLowerCase();

  // 1. Dores de Relacionamento (Ticket Alto/Urgência)
  if (normalized.match(/marido|esposo|parceiro|relação|casamento|distantes|brigando/)) {
    return "casamento";
  }

  // 2. Saúde Emocional da Mãe (LTV e Retenção)
  if (normalized.match(/triste|sozinha|cansada|esgotada|ansiedade|culpa|choro|deprimida/)) {
    return "emocoes";
  }

  // 3. Sono (Dificuldade #1)
  if (normalized.match(/dormir|soneca|acordar|noite|madrugada|insônia|berço/)) {
    return "sono";
  }

  // 4. Alimentação e Rotina
  if (normalized.match(/comer|papinha|mamadeira|peito|leite|introdução|alimento/)) {
    return "alimentacao";
  }

  if (normalized.match(/rotina|horário|tempo|organizar|dia a dia/)) {
    return "rotina";
  }

  return null;
}
