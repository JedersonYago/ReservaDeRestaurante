import api from "./api";
import type {
  Reservation,
  CreateReservationData,
  UpdateReservationData,
} from "../types/reservation";

export const reservationService = {
  async list(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>("/reservations");
    return response.data;
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  async create(data: CreateReservationData): Promise<Reservation> {
    const response = await api.post<Reservation>("/reservations", data);
    return response.data;
  },

  async update(id: string, data: UpdateReservationData): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  async cancel(id: string): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}/cancel`);
    return response.data;
  },

  async getAvailableTimes(date: string): Promise<string[]> {
    const response = await api.get<string[]>("/reservations/available-times", {
      params: { date },
    });
    return response.data;
  },
};
