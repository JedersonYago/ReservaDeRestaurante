import { format } from "date-fns";

/**
 * Utilitários para validação de data e hora
 * Centralizados para evitar duplicação de código
 */

/**
 * Verifica se uma data é anterior ao dia atual
 * @param date - Data no formato YYYY-MM-DD
 * @returns true se a data for anterior ao dia atual
 */
export function isPastDate(date: string): boolean {
  if (!date) return false;
  const today = format(new Date(), "yyyy-MM-dd");
  return date < today;
}

/**
 * Verifica se um horário é anterior ao horário atual (para o dia atual)
 * @param date - Data no formato YYYY-MM-DD
 * @param time - Horário no formato HH:mm
 * @returns true se for o dia atual e o horário for anterior ao atual
 */
export function isPastTime(date: string, time: string): boolean {
  if (!date || !time) return false;

  const today = format(new Date(), "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm");

  // Se não for hoje, não é passado
  if (date > today) return false;

  // Se for hoje, verifica se o horário já passou
  return date === today && time < currentTime;
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns Data atual formatada
 */
export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Obtém o horário atual no formato HH:mm
 * @returns Horário atual formatado
 */
export function getCurrentTimeString(): string {
  return format(new Date(), "HH:mm");
}
