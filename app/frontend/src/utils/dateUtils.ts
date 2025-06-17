// Re-exportar funções da biblioteca compartilhada
export {
  formatDate,
  formatTime,
  isDateInRange,
  isTimeInRange,
  isValidDate,
  generateAvailableHours,
  isValidReservationDate,
  isValidReservationTime,
  isWithinTableAvailability,
} from "../../../shared/utils/dateUtils";

export {
  formatToYMD as toYMD,
  formatToDMY as toDMY,
  extractYMD as onlyYMD,
} from "../../../shared/utils/dateFormat";

// Re-exportar constantes
export { MAX_DAYS_AHEAD } from "../../../shared/constants/time";
