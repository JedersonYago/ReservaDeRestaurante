import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

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
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
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

// Middleware para hash da senha antes de salvar
UserSchema.pre("save", async function (next) {
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

export default model<IUser>("User", UserSchema);
