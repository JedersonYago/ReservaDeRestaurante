import { Schema, model, Document } from "mongoose";

export interface IReservation extends Document {
  data: string;
  horario: string;
  numeroPessoas: number;
  nome: string;
  telefone: string;
  email: string;
  status: "confirmada" | "cancelada" | "pendente";
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    data: { type: String, required: true },
    horario: { type: String, required: true },
    numeroPessoas: { type: Number, required: true },
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["confirmada", "cancelada", "pendente"],
      default: "pendente",
    },
  },
  { timestamps: true }
);

export default model<IReservation>("Reservation", ReservationSchema);
