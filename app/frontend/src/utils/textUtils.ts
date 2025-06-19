/**
 * Trunca um texto para um tamanho máximo
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo permitido
 * @param suffix - Sufixo a ser adicionado (padrão: "...")
 * @returns Texto truncado
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text) return "";
  return text.length > maxLength
    ? `${text.slice(0, maxLength)}${suffix}`
    : text;
}

/**
 * Capitaliza a primeira letra de uma string
 * @param text - Texto a ser capitalizado
 * @returns Texto com primeira letra maiúscula
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converte texto para formato de título (primeira letra de cada palavra maiúscula)
 * @param text - Texto a ser convertido
 * @returns Texto em formato de título
 */
export function toTitleCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Remove acentos de uma string
 * @param text - Texto com acentos
 * @returns Texto sem acentos
 */
export function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Converte status em texto legível
 * @param status - Status a ser convertido
 * @returns Texto legível do status
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    // Table status
    available: "Disponível",
    occupied: "Ocupada",
    reserved: "Reservada",
    maintenance: "Manutenção",

    // Reservation status
    pending: "Pendente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",

    // General status
    active: "Ativo",
    inactive: "Inativo",
    partial: "Parcialmente Ocupada",
  };

  return statusMap[status] || capitalize(status);
}
