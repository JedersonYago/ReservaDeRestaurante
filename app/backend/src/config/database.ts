import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/reserva-facil";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    process.exit(1);
  }
};
