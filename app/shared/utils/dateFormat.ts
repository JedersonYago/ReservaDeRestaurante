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
      // Se for string no formato YYYY-MM-DD (evita problema de fuso horário)
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split("-");
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Se for string no formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
      else if (date.includes("T")) {
        dateObj = new Date(date);
      }
      // Outros formatos de string
      else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
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
      // Se for string no formato YYYY-MM-DD (evita problema de fuso horário)
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split("-");
        dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Se for string no formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
      else if (date.includes("T")) {
        dateObj = new Date(date);
      }
      // Outros formatos de string
      else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
  } catch (error) {
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
    return "";
  }
}

// Aliases mais intuitivos
export const formatDate = formatToDMY;
export const toYMD = formatToYMD;
export const toDMY = formatToDMY;
export const onlyYMD = extractYMD;
