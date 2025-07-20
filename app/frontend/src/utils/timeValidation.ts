import type { Config } from "../types/config";

export interface TimeValidationResult {
  isValid: boolean;
  warning?: string;
}

/**
 * Valida se um horário está dentro do horário de funcionamento configurado
 */
export function validateTimeAgainstBusinessHours(
  time: string,
  config: Config | null
): TimeValidationResult {
  // Se não há configuração ou horários não estão habilitados, não há restrição
  if (!config || !config.isOpeningHoursEnabled) {
    return { isValid: true };
  }

  const [timeHour, timeMinute] = time.split(":").map(Number);
  const [openingHour, openingMinute] = config.openingHour
    .split(":")
    .map(Number);
  const [closingHour, closingMinute] = config.closingHour
    .split(":")
    .map(Number);

  const timeInMinutes = timeHour * 60 + timeMinute;
  const openingInMinutes = openingHour * 60 + openingMinute;
  const closingInMinutes = closingHour * 60 + closingMinute;

  if (timeInMinutes < openingInMinutes || timeInMinutes > closingInMinutes) {
    return {
      isValid: false,
      warning: `Este horário está fora do funcionamento (${config.openingHour} - ${config.closingHour}). Clientes só conseguirão fazer reservas durante o horário de funcionamento.`,
    };
  }

  return { isValid: true };
}

/**
 * Valida um intervalo de tempo (startTime-endTime) contra horário de funcionamento
 */
export function validateTimeIntervalAgainstBusinessHours(
  startTime: string,
  endTime: string,
  config: Config | null
): TimeValidationResult {
  // Se não há configuração ou horários não estão habilitados, não há restrição
  if (!config || !config.isOpeningHoursEnabled) {
    return { isValid: true };
  }

  const startValidation = validateTimeAgainstBusinessHours(startTime, config);
  const endValidation = validateTimeAgainstBusinessHours(endTime, config);

  if (!startValidation.isValid || !endValidation.isValid) {
    return {
      isValid: false,
      warning: `Este intervalo está parcial ou totalmente fora do funcionamento (${config.openingHour} - ${config.closingHour}). Clientes só conseguirão fazer reservas durante o horário de funcionamento.`,
    };
  }

  return { isValid: true };
}

/**
 * Valida múltiplos intervalos e retorna avisos específicos para cada um
 */
export function validateMultipleTimeIntervals(
  intervals: { startTime: string; endTime: string; id: string }[],
  config: Config | null
): Record<string, TimeValidationResult> {
  const results: Record<string, TimeValidationResult> = {};

  intervals.forEach((interval) => {
    results[interval.id] = validateTimeIntervalAgainstBusinessHours(
      interval.startTime,
      interval.endTime,
      config
    );
  });

  return results;
}

/**
 * Verifica se o sistema está dentro do horário de funcionamento atual
 * (controla quando é possível fazer reservas)
 */
export function isWithinBusinessHours(config: Config | null): {
  isOpen: boolean;
  message?: string;
} {
  // Se não há configuração ou horários não estão habilitados, sistema sempre aberto
  if (!config || !config.isOpeningHoursEnabled) {
    return { isOpen: true };
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const [currentHour, currentMinute] = currentTime.split(":").map(Number);
  const [openingHour, openingMinute] = config.openingHour
    .split(":")
    .map(Number);
  const [closingHour, closingMinute] = config.closingHour
    .split(":")
    .map(Number);

  const currentInMinutes = currentHour * 60 + currentMinute;
  const openingInMinutes = openingHour * 60 + openingMinute;
  const closingInMinutes = closingHour * 60 + closingMinute;

  if (currentInMinutes < openingInMinutes) {
    return {
      isOpen: false,
      message: `Sistema de reservas disponível a partir das ${config.openingHour}`,
    };
  }

  if (currentInMinutes > closingInMinutes) {
    return {
      isOpen: false,
      message: `Sistema de reservas encerrado. Horário: ${config.openingHour} - ${config.closingHour}`,
    };
  }

  return { isOpen: true };
}

/**
 * Detecta se dois intervalos de tempo se sobrepõem
 */
function timeIntervalsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const [start1Hours, start1Minutes] = start1.split(":").map(Number);
  const [end1Hours, end1Minutes] = end1.split(":").map(Number);
  const [start2Hours, start2Minutes] = start2.split(":").map(Number);
  const [end2Hours, end2Minutes] = end2.split(":").map(Number);

  const start1InMinutes = start1Hours * 60 + start1Minutes;
  const end1InMinutes = end1Hours * 60 + end1Minutes;
  const start2InMinutes = start2Hours * 60 + start2Minutes;
  const end2InMinutes = end2Hours * 60 + end2Minutes;

  // Dois intervalos se sobrepõem se:
  // - O início do primeiro está antes do fim do segundo E
  // - O início do segundo está antes do fim do primeiro
  return start1InMinutes < end2InMinutes && start2InMinutes < end1InMinutes;
}

/**
 * Verifica se um novo intervalo se sobrepõe com intervalos existentes
 */
export function checkTimeIntervalOverlap(
  newStartTime: string,
  newEndTime: string,
  existingIntervals: { startTime: string; endTime: string }[]
): { hasOverlap: boolean; overlappingInterval?: string } {
  for (const interval of existingIntervals) {
    if (
      timeIntervalsOverlap(
        newStartTime,
        newEndTime,
        interval.startTime,
        interval.endTime
      )
    ) {
      return {
        hasOverlap: true,
        overlappingInterval: `${interval.startTime}-${interval.endTime}`,
      };
    }
  }

  return { hasOverlap: false };
}

/**
 * Verifica se um novo intervalo (formato "HH:MM-HH:MM") se sobrepõe com intervalos existentes
 */
export function checkTimeIntervalOverlapString(
  newInterval: string,
  existingIntervals: string[]
): { hasOverlap: boolean; overlappingInterval?: string } {
  const [newStartTime, newEndTime] = newInterval.split("-");

  for (const existingInterval of existingIntervals) {
    const [existingStartTime, existingEndTime] = existingInterval.split("-");

    if (
      timeIntervalsOverlap(
        newStartTime,
        newEndTime,
        existingStartTime,
        existingEndTime
      )
    ) {
      return {
        hasOverlap: true,
        overlappingInterval: existingInterval,
      };
    }
  }

  return { hasOverlap: false };
}
