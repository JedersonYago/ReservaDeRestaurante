import { IConfig } from "../models/Config";
import { addMinutes, parseISO, isBefore, isAfter } from "date-fns";

export async function applyConfigToReservation(
  config: IConfig,
  reservationDate: string,
  reservationTime: string,
  existingReservations: { date: string; time: string }[]
): Promise<{ isValid: boolean; error?: string }> {
  // Verificar horários de funcionamento
  if (config.isOpeningHoursEnabled) {
    const reservationDateTime = parseISO(
      `${reservationDate}T${reservationTime}`
    );
    const openingDateTime = parseISO(
      `${reservationDate}T${config.openingHour}`
    );
    const closingDateTime = parseISO(
      `${reservationDate}T${config.closingHour}`
    );

    if (isBefore(reservationDateTime, openingDateTime)) {
      return {
        isValid: false,
        error: `Reserva não pode ser feita antes do horário de abertura (${config.openingHour})`,
      };
    }

    if (isAfter(reservationDateTime, closingDateTime)) {
      return {
        isValid: false,
        error: `Reserva não pode ser feita após o horário de fechamento (${config.closingHour})`,
      };
    }
  }

  // Nota: O tempo de confirmação é usado apenas para definir o período de pendência
  // Não aplicamos validação de intervalo entre reservas aqui
  // As reservas ficam pendentes pelo tempo configurado em minIntervalBetweenReservations

  // Nota: O limite de reservas por usuário é validado no controller
  // Aqui não precisamos mais validar limite por horário específico
  // O novo sistema controla limite por usuário em período de tempo

  return { isValid: true };
}

export function generateAvailableTimeSlots(
  config: IConfig,
  date: string,
  existingReservations: { date: string; time: string }[]
): string[] {
  // Gerar todos os horários de 00:00 às 23:00 (intervalo de 1 hora)
  const slots: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const timeString = `${String(hour).padStart(2, "0")}:00`;

    // Verificar se o horário já tem reserva (apenas uma por horário por mesa)
    const reservationsAtTime = existingReservations.filter(
      (r) => r.date === date && r.time === timeString
    );

    // Agora não limitamos por total de reservas no horário,
    // o limite é por usuário individual no período de tempo
    if (reservationsAtTime.length === 0) {
      slots.push(timeString);
    }
  }

  return slots;
}
