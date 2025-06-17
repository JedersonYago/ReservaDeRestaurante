import { formatToYMD } from "./dateFormat";
import {
  MAX_DAYS_AHEAD,
  OPENING_TIME,
  CLOSING_TIME,
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
 * Formata uma data para exibição
 */
export function formatDate(
  date: string | Date,
  formatStr: string = "dd/MM/yyyy"
): string {
  if (!date) return "";

  try {
    let dateObj: Date;

    if (typeof date === "string") {
      // Se for string no formato YYYY-MM-DD
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
      // Se for Date
      dateObj = date;
    }

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      // console.error("Data inválida:", date);
      return typeof date === "string" ? date : date.toString();
    }

    // Formatação simples baseada no formatStr
    if (formatStr === "dd/MM/yyyy") {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return dateObj.toLocaleDateString("pt-BR");
  } catch (error) {
    // console.error("Erro ao formatar data:", error);
    return typeof date === "string" ? date : date.toString();
  }
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
