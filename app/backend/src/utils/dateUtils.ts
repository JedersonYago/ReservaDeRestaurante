// Re-exportações centralizadas para o backend
export {
  generateAvailableHours,
  isDateInRange,
  isValidReservationDate,
  isValidReservationTime,
  isTimeInRange,
  isWithinTableAvailability,
  isValidDate,
  formatTime,
} from "../../../shared/utils/dateUtils";

export {
  formatDate,
  toYMD,
  toDMY,
  onlyYMD,
} from "../../../shared/utils/dateFormat";

import { parseISO, isBefore, format } from "date-fns";

/**
 * Verifica se uma data e horário estão no passado (considerando fuso horário do Brasil)
 * @param date - Data no formato YYYY-MM-DD
 * @param time - Horário no formato HH:mm
 * @returns true se a data/horário estão no passado
 */
export function isPastDateTime(date: string, time: string): boolean {
  if (!date || !time) return false;

  const today = format(new Date(), "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm");

  // Se não for hoje, não é passado
  if (date > today) return false;

  // Se for hoje, verifica se o horário já passou
  return date === today && time < currentTime;
}

/**
 * Valida se todos os horários de disponibilidade de uma mesa não estão no passado
 * @param availability - Array de blocos de disponibilidade
 * @returns {isValid: boolean, error?: string}
 */
export function validateTableAvailabilityNotPast(
  availability: { date: string; times: string[] }[]
): { isValid: boolean; error?: string } {
  const today = format(new Date(), "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm");

  for (const block of availability) {
    const { date, times } = block;

    // Se a data é passada, invalida
    if (date < today) {
      return {
        isValid: false,
        error: `Não é possível cadastrar horários para datas passadas. Data inválida: ${date}`,
      };
    }

    // Se é hoje, verificar se os horários não passaram
    if (date === today) {
      for (const timeRange of times) {
        const [startTime] = timeRange.split("-");
        if (startTime < currentTime) {
          return {
            isValid: false,
            error: `Não é possível cadastrar horários que já passaram. Horário inválido: ${startTime} (hoje às ${currentTime})`,
          };
        }
      }
    }
  }

  return { isValid: true };
}
