import { getReservationLimits } from "../config/reservation";
import Reservation from "../models/Reservation";

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
  const limits = await getReservationLimits();
  const [hours, minutes] = time.split(":").map(Number);
  return minutes % limits.MIN_INTERVAL_BETWEEN_RESERVATIONS === 0;
};

export const checkReservationLimit = async (
  date: string,
  time: string
): Promise<boolean> => {
  const limits = await getReservationLimits();
  const count = await Reservation.countDocuments({
    data: date,
    horario: time,
  });
  return count < limits.MAX_RESERVATIONS_PER_TIME;
};

export const getAvailableTimeSlots = async (
  date: string
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

    const isAvailable = await checkReservationLimit(date, time);
    if (isAvailable) {
      timeSlots.push(time);
    }
  }

  return timeSlots;
};
