import { getReservationLimits } from "../config/reservation";
import { Types } from "mongoose";
import Reservation from "../models/Reservation";
import Table from "../models/Table";
import { IReservation } from "../models/Reservation";
import { ITable } from "../models/Table";

export const validateTimeSlot = async (time: string): Promise<boolean> => {
  const limits = await getReservationLimits();
  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;
  const [openingHours, openingMinutes] =
    limits.OPENING_HOUR.split(":").map(Number);
  const [closingHours, closingMinutes] =
    limits.CLOSING_HOUR.split(":").map(Number);
  const openingInMinutes = openingHours * 60 + openingMinutes;
  const closingInMinutes = closingHours * 60 + closingMinutes;

  return timeInMinutes >= openingInMinutes && timeInMinutes <= closingInMinutes;
};

export const validateTimeInterval = async (time: string): Promise<boolean> => {
  const [hours, minutes] = time.split(":").map(Number);
  // Validação básica: horário válido (0-23h, 0-59min)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export const checkReservationLimit = async (
  date: string,
  time: string,
  tableId?: string
): Promise<boolean> => {
  // Se uma mesa específica foi fornecida, verifica apenas se ela está disponível
  if (tableId) {
    const existingReservation = await Reservation.findOne({
      tableId: tableId,
      date,
      time,
      status: { $ne: "cancelled" },
    });
    return !existingReservation;
  }

  // Para o novo sistema, não limitamos por horário específico globalmente
  // O limite agora é por usuário no período de tempo (validado no controller)
  // Aqui apenas verificamos se existe alguma reserva para esse horário/mesa
  return true; // Sempre disponível se não especificar mesa
};

export const getAvailableTimeSlots = async (
  date: string,
  tableId?: string
): Promise<string[]> => {
  const limits = await getReservationLimits();
  const [openingHours, openingMinutes] =
    limits.OPENING_HOUR.split(":").map(Number);
  const [closingHours, closingMinutes] =
    limits.CLOSING_HOUR.split(":").map(Number);
  const openingInMinutes = openingHours * 60 + openingMinutes;
  const closingInMinutes = closingHours * 60 + closingMinutes;

  const timeSlots: string[] = [];
  for (
    let minutes = openingInMinutes;
    minutes <= closingInMinutes - limits.TIME_SLOTS;
    minutes += limits.MIN_INTERVAL_BETWEEN_RESERVATIONS
  ) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const time = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;

    const isAvailable = await checkReservationLimit(date, time, tableId);
    if (isAvailable) {
      timeSlots.push(time);
    }
  }

  return timeSlots;
};

export const isTableAvailable = async (
  tableId: string,
  date: Date,
  time: string
): Promise<boolean> => {
  const existingReservation = await Reservation.findOne({
    tableId,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  return !existingReservation;
};

export const updateTableStatus = async (
  tableId: string,
  status: "available" | "reserved" | "maintenance"
): Promise<void> => {
  await Table.findByIdAndUpdate(tableId, { status });
};

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
 * Valida se há sobreposições de horários na disponibilidade de uma mesa
 * @param availability Array de blocos de disponibilidade
 * @returns {isValid: boolean, error?: string}
 */
export const validateTableAvailabilityOverlaps = (
  availability: { date: string; times: string[] }[]
): { isValid: boolean; error?: string } => {
  for (const block of availability) {
    const { date, times } = block;

    // Verificar sobreposições dentro do mesmo bloco (mesmo dia)
    for (let i = 0; i < times.length; i++) {
      for (let j = i + 1; j < times.length; j++) {
        const [start1, end1] = times[i].split("-");
        const [start2, end2] = times[j].split("-");

        if (timeIntervalsOverlap(start1, end1, start2, end2)) {
          return {
            isValid: false,
            error: `Horários sobrepostos encontrados na data ${date}: ${times[i]} e ${times[j]}. Ajuste os horários para evitar conflitos.`,
          };
        }
      }
    }
  }

  return { isValid: true };
};
