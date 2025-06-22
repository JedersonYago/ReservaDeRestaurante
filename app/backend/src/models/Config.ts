import { Schema, model, Document } from "mongoose";
import { DEFAULT_CONFIG, VALIDATION_LIMITS } from "../../../shared/constants";
import { VALIDATION_PATTERNS } from "../config/validationPatterns";

export interface IConfig extends Document {
  maxReservationsPerUser: number; // Número máximo de reservas por usuário
  reservationLimitHours: number; // Período em horas para o limite
  minIntervalBetweenReservations: number;
  openingHour: string;
  closingHour: string;
  updatedBy: Schema.Types.ObjectId;
  updatedAt: Date;
  // Flags de ativação
  isReservationLimitEnabled: boolean; // Limite de reservas por período
  isIntervalEnabled: boolean;
  isOpeningHoursEnabled: boolean;
}

const ConfigSchema = new Schema<IConfig>(
  {
    maxReservationsPerUser: {
      type: Number,
      required: true,
      min: VALIDATION_LIMITS.maxReservationsPerUser.min,
      max: VALIDATION_LIMITS.maxReservationsPerUser.max,
      default: DEFAULT_CONFIG.maxReservationsPerUser,
    },
    reservationLimitHours: {
      type: Number,
      required: true,
      min: VALIDATION_LIMITS.reservationLimitHours.min,
      max: VALIDATION_LIMITS.reservationLimitHours.max,
      default: DEFAULT_CONFIG.reservationLimitHours,
    },
    minIntervalBetweenReservations: {
      type: Number,
      required: true,
      min: VALIDATION_LIMITS.minIntervalBetweenReservations.min,
      max: VALIDATION_LIMITS.minIntervalBetweenReservations.max,
      default: DEFAULT_CONFIG.minIntervalBetweenReservations,
    },
    openingHour: {
      type: String,
      required: true,
      pattern: VALIDATION_PATTERNS.TIME,
      default: DEFAULT_CONFIG.openingHour,
    },
    closingHour: {
      type: String,
      required: true,
      pattern: VALIDATION_PATTERNS.TIME,
      default: DEFAULT_CONFIG.closingHour,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Flags de ativação
    isReservationLimitEnabled: {
      type: Boolean,
      default: DEFAULT_CONFIG.isReservationLimitEnabled,
    },
    isIntervalEnabled: {
      type: Boolean,
      default: DEFAULT_CONFIG.isIntervalEnabled,
    },

    isOpeningHoursEnabled: {
      type: Boolean,
      default: DEFAULT_CONFIG.isOpeningHoursEnabled,
    },
  },
  { timestamps: true }
);

export default model<IConfig>("Config", ConfigSchema);
