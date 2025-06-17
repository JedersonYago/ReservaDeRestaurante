import { BaseEntity, ReservationStatus } from "./common";

/**
 * Interface unificada para reserva
 */
export interface Reservation extends BaseEntity {
  tableId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  observations?: string;
  status: ReservationStatus;
  hiddenFromUser: boolean;
  userId: string;
}

/**
 * Dados para criação de reserva
 */
export interface CreateReservationData {
  tableId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  observations?: string;
  userId: string;
}

/**
 * Dados para atualização de reserva
 */
export interface UpdateReservationData {
  tableId?: string;
  date?: string;
  time?: string;
  customerName?: string;
  customerEmail?: string;
  observations?: string;
  status?: ReservationStatus;
}
