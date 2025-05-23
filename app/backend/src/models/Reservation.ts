import { Schema, model, Document, Types } from "mongoose";

export interface IReservation extends Document {
  data: Date;
  hora: string;
  numeroPessoas: number;
  mesa: Types.ObjectId;
  cliente: Types.ObjectId;
  status: "confirmada" | "cancelada" | "pendente";
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    data: { type: Date, required: true },
    hora: { type: String, required: true },
    numeroPessoas: { type: Number, required: true },
    mesa: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    cliente: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["confirmada", "cancelada", "pendente"],
      default: "pendente",
    },
  },
  { timestamps: true }
);

export default model<IReservation>("Reservation", ReservationSchema);
