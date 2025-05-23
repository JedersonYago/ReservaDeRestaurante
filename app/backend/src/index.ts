import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/authRoutes";
import tableRoutes from "./routes/tableRoutes";
import reservationRoutes from "./routes/reservationRoutes";

// Configuração do ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);

// Rota de teste
app.get("/", (_req, res) => {
  res.json({ message: "API do Sistema de Reservas de Restaurante" });
});

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
