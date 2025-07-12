import rateLimit from "express-rate-limit";

// Limite para rotas de autenticação (login, registro, etc)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 25, // 25 tentativas
  message: {
    error: "Muitas tentativas de acesso. Tente novamente em 15 minutos.",
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Limite para rotas de refresh token
export const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 tentativas
  message: {
    error: "Muitas tentativas de refresh. Tente novamente em 1 hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite geral para todas as rotas da API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: {
    error: "Muitas requisições. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
