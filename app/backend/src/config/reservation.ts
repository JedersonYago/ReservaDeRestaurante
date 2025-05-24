import Config from "../models/Config";

export const getReservationLimits = async () => {
  const config = await Config.findOne().sort({ updatedAt: -1 });

  return {
    // Limite de reservas por horário
    MAX_RESERVATIONS_PER_TIME: config?.maxReservationsPerTime || 5,

    // Intervalo mínimo entre reservas (em minutos)
    MIN_INTERVAL_BETWEEN_RESERVATIONS:
      config?.minIntervalBetweenReservations || 30,

    // Horário de funcionamento
    OPENING_HOUR: config?.openingHour || "11:00",
    CLOSING_HOUR: config?.closingHour || "23:00",

    // Intervalos de tempo para reservas (em minutos)
    TIME_SLOTS: config?.timeSlots || 60,
  };
};
