/**
 * Formata uma data para o formato YYYY-MM-DD
 * @param date - Data a ser formatada (string ou Date)
 * @returns Data no formato YYYY-MM-DD
 */
export function formatToYMD(date: string | Date): string {
  if (!date) return "";

  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
      // console.error("[formatToYMD] Data inválida:", date);
      return "";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    // console.error("[formatToYMD] Erro ao formatar data:", error);
    return "";
  }
}

/**
 * Formata uma data para o formato DD/MM/YYYY
 * @param date - Data a ser formatada (string ou Date)
 * @returns Data no formato DD/MM/YYYY
 */
export function formatToDMY(date: string | Date): string {
  if (!date) return "";

  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
      // console.error("[formatToDMY] Data inválida:", date);
      return "";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
  } catch (error) {
    // console.error("[formatToDMY] Erro ao formatar data:", error);
    return "";
  }
}

/**
 * Extrai apenas a parte YYYY-MM-DD de uma string ISO
 * @param date - Data em formato ISO ou Date
 * @returns Data no formato YYYY-MM-DD
 */
export function extractYMD(date: string | Date): string {
  if (!date) return "";

  try {
    if (typeof date === "string") {
      return date.split("T")[0];
    }
    return formatToYMD(date);
  } catch (error) {
    // console.error("[extractYMD] Erro ao extrair data:", error);
    return "";
  }
}
