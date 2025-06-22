import { formatToDMY } from "./dateFormat";
import {
  MAX_DAYS_AHEAD,
  OPENING_TIME,
  LAST_RESERVATION_TIME,
} from "../constants";

/**
 * Função para gerar todos os horários disponíveis
 */
export function generateAvailableHours(): { start: string; end: string }[] {
  const hours: { start: string; end: string }[] = [];
  let currentHour = 11;

  while (currentHour < 23) {
    const start = `${currentHour.toString().padStart(2, "0")}:00`;
    const end = `${(currentHour + 1).toString().padStart(2, "0")}:00`;
    hours.push({ start, end });
    currentHour++;
  }

  return hours;
}

/**
 * Adiciona dias a uma data
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Verifica se uma data é anterior a outra
 */
function isBefore(date: Date, compareDate: Date): boolean {
  return date.getTime() < compareDate.getTime();
}

/**
 * Verifica se uma data é posterior a outra
 */
function isAfter(date: Date, compareDate: Date): boolean {
  return date.getTime() > compareDate.getTime();
}

/**
 * Converte string para Date
 */
function parseDate(date: string): Date {
  return new Date(date);
}

/**
 * Função para verificar se uma data está dentro do intervalo permitido
 */
export function isDateInRange(date: string | Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = addDays(today, MAX_DAYS_AHEAD);
  const selectedDate = typeof date === "string" ? parseDate(date) : date;

  return !isBefore(selectedDate, today) && !isAfter(selectedDate, maxDate);
}

/**
 * Função para verificar se uma data é válida para reserva
 */
export function isValidReservationDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = parseDate(date);
  selectedDate.setHours(0, 0, 0, 0);

  return !isBefore(selectedDate, today);
}

/**
 * Função para verificar se um horário é válido para reserva
 */
export function isValidReservationTime(time: string): boolean {
  return time >= OPENING_TIME && time <= LAST_RESERVATION_TIME;
}

/**
 * Função para verificar se um horário está dentro do intervalo permitido
 */
export function isTimeInRange(
  time: string,
  startTime: string,
  endTime: string
): boolean {
  return time >= startTime && time <= endTime;
}

/**
 * Função para verificar se uma data e horário estão dentro do período de disponibilidade da mesa
 */
export function isWithinTableAvailability(
  date: string,
  time: string,
  availableFrom: string,
  availableTo: string
): boolean {
  const reservationDate = parseDate(date);
  const fromDate = parseDate(availableFrom);
  const toDate = parseDate(availableTo);

  // Verifica se a data está dentro do período de disponibilidade
  if (isBefore(reservationDate, fromDate) || isAfter(reservationDate, toDate)) {
    return false;
  }

  // Verifica se o horário está dentro do horário de funcionamento
  return isValidReservationTime(time);
}

/**
 * Formata uma data para exibição (delegando para formatToDMY)
 */
export function formatDate(date: string | Date): string {
  // Delegar para a função especializada
  return formatToDMY(date);
}

/**
 * Formata um horário para exibição
 */
export function formatTime(time: string): string {
  if (!time) return "";
  return time;
}

/**
 * Verifica se uma data é válida e está dentro do intervalo permitido
 */
export function isValidDate(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = addDays(today, MAX_DAYS_AHEAD);
  const selectedDate = new Date(date);

  return !isBefore(selectedDate, today) && !isAfter(selectedDate, maxDate);
}
