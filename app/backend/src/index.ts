import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import reservationRoutes from "./routes/reservationRoutes";
import configRoutes from "./routes/configRoutes";
import {
  rateLimiter,
  helmetConfig,
  sanitizeData,
} from "./middlewares/security";
import routes from "./routes";
import { config } from "./config";
import { startPeriodicCheck } from "./services/schedulerService";

const app = express();

// Middlewares
app.use(cors(config.cors));
app.use(express.json());
app.use(helmetConfig);
app.use(rateLimiter);
app.use(sanitizeData);

// Rotas
app.use("/api", routes);

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
    res.status(500).json({
      message: "Erro interno do servidor",
      error: config.server.nodeEnv === "development" ? err.message : undefined,
    });
  }
);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();

    // Iniciar sistema de verificação periódica de reservas
    startPeriodicCheck();

    // Iniciar o servidor
    const server = app.listen(config.server.port, () => {
      console.log(`Servidor rodando na porta ${config.server.port}`);
      console.log(`Ambiente: ${config.server.nodeEnv}`);
    });

    // Tratamento de encerramento gracioso
    process.on("SIGTERM", () => {
      console.log("SIGTERM recebido. Encerrando servidor...");
      server.close(() => {
        console.log("Servidor encerrado");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
