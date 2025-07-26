import { Schema, model, Document } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: "client" | "admin";
  // Controle de mudanças de email
  emailChanges: {
    count: number;
    lastChangeAt?: Date;
    blockedUntil?: Date;
  };
  // Controle de mudanças de username
  usernameChanges: {
    count: number;
    lastChangeAt?: Date;
    blockedUntil?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    // Controle de mudanças de email
    emailChanges: {
      count: { type: Number, default: 0 },
      lastChangeAt: { type: Date },
      blockedUntil: { type: Date },
    },
    // Controle de mudanças de username
    usernameChanges: {
      count: { type: Number, default: 0 },
      lastChangeAt: { type: Date },
      blockedUntil: { type: Date },
    },
  },
  { timestamps: true }
);

// Índices case-insensitive para username e email
UserSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
UserSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

// Middleware para normalizar username/email e hash da senha antes de salvar
UserSchema.pre("save", async function (next) {
  // Normalizar username para lowercase se foi modificado
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase().trim();
  }

  // Normalizar email para lowercase se foi modificado
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
  }

  // Hash da senha se foi modificada
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

import mongoose from "mongoose";
// Força singleton absoluto do modelo User, mesmo em ambiente de teste/hot reload
const globalAny = global as any;
function getUserModel() {
  if (!globalAny.User) {
    globalAny.User = mongoose.models.User || mongoose.model("User", UserSchema);
  }
  return globalAny.User;
}
export { getUserModel };

const User = getUserModel();
export default User;
