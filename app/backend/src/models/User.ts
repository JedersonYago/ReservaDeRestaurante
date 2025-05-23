import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  nome: string;
  email: string;
  username: string;
  senha: string;
  role: "cliente" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ["cliente", "admin"], default: "cliente" },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
