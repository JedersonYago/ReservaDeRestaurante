import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/authRoutes";
import tableRoutes from "./routes/tableRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import {
  rateLimiter,
  corsOptions,
  helmetConfig,
  sanitizeData,
} from "./middlewares/security";

// Configuração do ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares de segurança
app.use(helmetConfig);
app.use(corsOptions);
app.use(rateLimiter);
app.use(express.json());
app.use(sanitizeData);

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);

// Rota de teste
app.get("/", (_req, res) => {
  res.json({ message: "API do Sistema de Reservas de Restaurante" });
});

// Tratamento de erros
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
