import api from "./api";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  numberOfPeople: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  numberOfPeople: number;
}

export const reservationService = {
  async getAll(): Promise<Reservation[]> {
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

  async cancel(id: string): Promise<void> {
    await api.patch(`/reservations/${id}/cancel`);
  },

  async update(
    id: string,
    data: Partial<CreateReservationData>
  ): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  async getAvailableTimes(date: string): Promise<string[]> {
    const response = await api.get<string[]>("/reservations/available-times", {
      params: { date },
    });
    return response.data;
  },
};
