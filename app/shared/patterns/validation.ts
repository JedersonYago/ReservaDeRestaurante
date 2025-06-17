/**
 * Padrões de validação regex compartilhados
 * Centralizados para evitar duplicação de código
 */

export const VALIDATION_PATTERNS = {
  // Pattern para horário no formato HH:mm (24h)
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,

  // Pattern para data no formato YYYY-MM-DD
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  // Pattern para username (letras, números e underscore)
  USERNAME: /^[a-zA-Z0-9_]+$/,

  // Pattern para nome (apenas letras, acentos e espaços)
  NAME: /^[a-zA-ZÀ-ÿ\s]+$/,

  // Pattern para intervalo de horário HH:mm-HH:mm
  TIME_INTERVAL:
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,

  // Pattern para senha forte (min 8 chars, maiúscula, minúscula, número, especial)
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

/**
 * Mensagens de erro padronizadas para os patterns
 */
export const VALIDATION_MESSAGES = {
  TIME: "Horário inválido. Use o formato HH:mm",
  DATE: "Data deve estar no formato YYYY-MM-DD",
  USERNAME: "O nome de usuário deve conter apenas letras, números e underscore",
  NAME: "O nome deve conter apenas letras e espaços",
  TIME_INTERVAL: "Horário deve estar no formato HH:mm-HH:mm",
  STRONG_PASSWORD:
    "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
} as const;
