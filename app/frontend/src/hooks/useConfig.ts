import type { Config } from "../types/config";

export function useConfig() {
  // Configuração padrão para evitar erros 404
  const defaultConfig: Config = {
    maxReservationsPerUser: 5,
    reservationLimitHours: 24,
    minIntervalBetweenReservations: 30,
    openingHour: "11:00",
    closingHour: "23:00",
    isReservationLimitEnabled: true,
    isIntervalEnabled: true,
    isOpeningHoursEnabled: true,
  };

  return {
    config: defaultConfig,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
