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
