export interface Reservation {
  id: string;
  date: string;
  time: string;
  numberOfPeople: number;
  name: string;
  phone: string;
  email: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  date: string;
  time: string;
  numberOfPeople: number;
  name: string;
  phone: string;
  email: string;
}

export interface UpdateReservationData extends Partial<CreateReservationData> {
  status?: "pending" | "confirmed" | "cancelled";
}
