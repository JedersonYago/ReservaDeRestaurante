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
      warning: `⚠️ Este horário está fora do funcionamento (${config.openingHour} - ${config.closingHour}). Clientes não poderão fazer reservas neste horário.`,
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
      warning: `⚠️ Este intervalo está parcial ou totalmente fora do funcionamento (${config.openingHour} - ${config.closingHour}). Clientes não poderão fazer reservas nestes horários.`,
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
