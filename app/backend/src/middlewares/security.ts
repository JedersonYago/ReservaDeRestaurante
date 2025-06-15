import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "../config";

// Configuração do rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: config.server.nodeEnv === "development" ? 5000 : 100, // limite muito maior em desenvolvimento
  message: "Muitas requisições deste IP, tente novamente mais tarde",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    config.server.nodeEnv === "development" &&
    req.path.startsWith("/api/reservations"), // Ignora rate limit para rotas de reservas em desenvolvimento
});

// Configuração do Helmet
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Middleware para sanitizar dados
export const sanitizeData = (req: any, res: any, next: any) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
