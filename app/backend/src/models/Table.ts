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
  status: "available" | "occupied" | "reserved" | "maintenance";
  reservations?: Types.ObjectId[];
  availability: AvailabilityBlock[];
}

const tableSchema = new Schema<ITable>(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
    },
    reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
    availability: [
      {
        date: { type: String, required: true },
        times: [{ type: String, required: true }],
      },
    ],
  },
  { timestamps: true }
);

export default model<ITable>("Table", tableSchema);
