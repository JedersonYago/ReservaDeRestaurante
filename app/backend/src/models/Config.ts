import { Schema, model, Document } from "mongoose";

export interface IConfig extends Document {
  maxReservationsPerTime: number;
  minIntervalBetweenReservations: number;
  openingHour: string;
  closingHour: string;
  timeSlots: number;
  updatedBy: Schema.Types.ObjectId;
  updatedAt: Date;
}

const ConfigSchema = new Schema<IConfig>(
  {
    maxReservationsPerTime: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 5,
    },
    minIntervalBetweenReservations: {
      type: Number,
      required: true,
      min: 15,
      max: 120,
      default: 30,
    },
    openingHour: {
      type: String,
      required: true,
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      default: "11:00",
    },
    closingHour: {
      type: String,
      required: true,
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      default: "23:00",
    },
    timeSlots: {
      type: Number,
      required: true,
      min: 15,
      max: 120,
      default: 60,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IConfig>("Config", ConfigSchema);
