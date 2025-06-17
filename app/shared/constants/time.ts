/**
 * Constantes relacionadas a tempo e datas
 */

// Constantes de data e horário
export const MAX_DAYS_AHEAD = 30;
export const OPENING_TIME = "11:00";
export const CLOSING_TIME = "23:00";
export const LAST_RESERVATION_TIME = "22:00";

// Constantes de reserva
export const MAX_RESERVATIONS_PER_USER = 3;
export const AUTO_APPROVAL_MINUTES = 30;

// Configuração padrão do sistema
export const DEFAULT_CONFIG = {
  // Limites de reservas por usuário
  maxReservationsPerUser: 5,
  reservationLimitHours: 24,
  minIntervalBetweenReservations: 10,

  // Horários padrão
  openingHour: "11:00",
  closingHour: "23:00",

  // Flags de ativação
  isReservationLimitEnabled: true,
  isIntervalEnabled: true,
  isOpeningHoursEnabled: true,
} as const;

// Limites de validação
export const VALIDATION_LIMITS = {
  maxReservationsPerUser: {
    min: 1,
    max: 20,
  },
  reservationLimitHours: {
    min: 1,
    max: 168, // 7 dias
  },
  minIntervalBetweenReservations: {
    min: 1,
    max: 120, // 2 horas
  },
} as const;
