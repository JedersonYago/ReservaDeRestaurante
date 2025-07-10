import mongoose, { Document, Schema } from "mongoose";

export interface IPasswordReset extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para limpar tokens expirados automaticamente
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Índice composto para consultas eficientes
passwordResetSchema.index({ token: 1, used: 1, expiresAt: 1 });

// Método para verificar se o token é válido
passwordResetSchema.methods.isValid = function (): boolean {
  return !this.used && new Date() < this.expiresAt;
};

// Método para marcar token como usado
passwordResetSchema.methods.markAsUsed = function (): Promise<IPasswordReset> {
  this.used = true;
  return this.save();
};

export const PasswordReset = mongoose.model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);
