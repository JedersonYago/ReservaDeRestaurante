import { Schema, model, Document, Types } from "mongoose";

export interface IReservation extends Document {
  tableId: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  observations?: string;
  status: "pending" | "confirmed" | "cancelled";
  hiddenFromUser: boolean; // Campo para esconder reserva do usuário (mantendo no histórico admin)
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId;
}

const reservationSchema = new Schema<IReservation>(
  {
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    observations: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    hiddenFromUser: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Índices para otimização
reservationSchema.index({ tableId: 1, date: 1, time: 1 });
reservationSchema.index({ customerEmail: 1 });

export default model<IReservation>("Reservation", reservationSchema);
