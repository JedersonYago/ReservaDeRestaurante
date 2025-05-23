import { Schema, model, Document } from "mongoose";

export interface ITable extends Document {
  numero: number;
  capacidade: number;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>(
  {
    numero: { type: Number, required: true, unique: true },
    capacidade: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<ITable>("Table", TableSchema);
