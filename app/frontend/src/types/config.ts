export interface Config {
  maxReservationsPerUser: number; // Número máximo de reservas por usuário
  reservationLimitHours: number; // Período em horas para o limite
  minIntervalBetweenReservations: number; // Agora representa tempo de confirmação (em minutos)
  openingHour: string;
  closingHour: string;
  updatedBy?: string;
  updatedAt?: string;
  // Flags de ativação
  isReservationLimitEnabled: boolean; // Controla limite de reservas por período
  isIntervalEnabled: boolean; // Controla tempo de confirmação automática
  isOpeningHoursEnabled: boolean;
}
