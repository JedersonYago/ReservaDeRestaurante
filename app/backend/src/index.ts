import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import reservationRoutes from "./routes/reservationRoutes";
import configRoutes from "./routes/configRoutes";
import {
  rateLimiter,
  helmetConfig,
  sanitizeData,
  cacheControl,
  performanceHeaders,
  compressionConfig,
  staticCacheBusting,
  cleanHeaders,
} from "./middlewares/security";
import routes from "./routes";
import { config } from "./config";
import {
  startPeriodicCheck,
  startDailyCleanup,
} from "./services/schedulerService";
import { apiLimiter } from "./config/rateLimit";

const app = express();

// Middlewares de segurança e performance
app.use(cors(config.cors));
app.use(express.json());
app.use(compressionConfig); // Compressão deve vir antes de outros middlewares
app.use(helmetConfig);
app.use(cleanHeaders); // Limpar headers desnecessários
app.use(staticCacheBusting); // Cache busting para recursos estáticos
app.use(cacheControl);
app.use(performanceHeaders);
app.use(rateLimiter);
app.use(sanitizeData);

// Rate limiting geral para todas as rotas da API
app.use("/api", apiLimiter);

// Rotas
app.use("/api", routes);

// Rota de teste
app.get("/", (_req, res) => {
  res.json({ message: "API do Reserva Fácil" });
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

    // Iniciar limpeza diária de mesas e reservas expiradas
    startDailyCleanup();

    // Iniciar o servidor
    const server = app.listen(config.server.port, () => {
      console.log(`🚀 ReservaFácil Backend - Porta ${config.server.port}`);
      if (config.server.nodeEnv === 'development') {
        console.log(`📝 API: http://localhost:${config.server.port}/api`);
      }
    });

    // Tratamento de encerramento
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
