import type { Request, Response, NextFunction } from "express";
const express = require("express");
const cors = require("cors");
import { config } from "./config";

export function createApp() {
  const {
    rateLimiter,
    helmetConfig,
    sanitizeData,
    cacheControl,
    performanceHeaders,
    compressionConfig,
    staticCacheBusting,
    cleanHeaders,
  } = require("./middlewares/security");
  const routes = require("./routes").default;
  const { apiLimiter } = require("./config/rateLimit");

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
  app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "API do Reserva Fácil" });
  });

  // Tratamento de erros
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[APP] Express error handler:", err);

    const status = err.status || 500;
    const message =
      status === 404 ? "Rota não encontrada" : "Erro interno do servidor";

    res.status(status).json({
      message,
      error: config.server.nodeEnv === "development" ? err.message : undefined,
    });
  });
  return app;
}
