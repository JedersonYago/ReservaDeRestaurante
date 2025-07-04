import Config from "../models/Config";
import { OPENING_TIME, CLOSING_TIME } from "./constants";

export const getReservationLimits = async () => {
  const config = await Config.findOne().sort({ updatedAt: -1 });

  return {
    // Limite de reservas por usuário (novo sistema)
    MAX_RESERVATIONS_PER_USER: config?.maxReservationsPerUser || 5,

    // Período de limitação em horas (novo sistema)
    RESERVATION_LIMIT_HOURS: config?.reservationLimitHours || 24,

    // Tempo de confirmação automática (em minutos)
    // Reservas ficam pendentes por este tempo antes de serem confirmadas
    MIN_INTERVAL_BETWEEN_RESERVATIONS:
      config?.minIntervalBetweenReservations || 10,

    // Horário de funcionamento
    OPENING_HOUR: config?.openingHour || OPENING_TIME,
    CLOSING_HOUR: config?.closingHour || CLOSING_TIME,

    // Intervalo fixo de tempo (em minutos)
    TIME_SLOTS: 60,
  };
};

// Configurações padrão removidas - agora usar a versão do shared
// import { DEFAULT_CONFIG } from "../../../shared/constants";

export const reservationConfig = {
  openingHour: process.env.OPENING_HOUR || "11:00",
  closingHour: process.env.CLOSING_HOUR || "23:00",
  minIntervalBetweenReservations:
    Number(process.env.MIN_INTERVAL_BETWEEN_RESERVATIONS) || 30,
  maxReservationsPerTimeSlot:
    Number(process.env.MAX_RESERVATIONS_PER_TIME_SLOT) || 4,
} as const;
