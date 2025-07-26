import { Schema, model, Document, Types } from "mongoose";
import Reservation from "./Reservation";

interface AvailabilityBlock {
  date: string;
  times: string[];
}

export interface ITable extends Document {
  _id: Types.ObjectId;
  name: string;
  capacity: number;
  status: "available" | "reserved" | "maintenance" | "expired";
  reservations?: Types.ObjectId[];
  availability: AvailabilityBlock[];
}

const tableSchema = new Schema<ITable>(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["available", "reserved", "maintenance", "expired"],
      default: "available",
    },
    reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
    availability: {
      type: [
        {
          date: { type: String, required: true },
          times: {
            type: [String],
            required: true,
            validate: [
              (arr: string[]) => Array.isArray(arr) && arr.length > 0,
              'Pelo menos um horário deve ser informado'
            ]
          },
        }
      ],
      required: true,
      validate: [
        (arr: any[]) => Array.isArray(arr) && arr.length > 0,
        'Pelo menos um bloco de disponibilidade deve ser informado'
      ]
    },
  },
  { timestamps: true }
);

export default model<ITable>("Table", tableSchema);
