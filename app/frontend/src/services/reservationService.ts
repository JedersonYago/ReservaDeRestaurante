import api from "./api";
import type { Reservation, CreateReservationData } from "../types/reservation";

export const reservationService = {
  async create(data: CreateReservationData): Promise<Reservation> {
    const response = await api.post<Reservation>("/reservations", data);
    return response.data;
  },

  async list(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>("/reservations");
    return response.data;
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  async cancel(id: string): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}/cancel`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`);
  },

  async clear(id: string): Promise<void> {
    await api.patch(`/reservations/${id}/clear`);
  },

  confirm: (id: string) =>
    api.put<Reservation>(`/reservations/${id}/confirm`).then((res) => res.data),
};
