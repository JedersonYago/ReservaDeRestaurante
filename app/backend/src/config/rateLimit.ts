import rateLimit from "express-rate-limit";

// Configurações baseadas no ambiente
const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

// Configurações mais flexíveis para desenvolvimento/teste
const authConfig = {
  windowMs: isDevelopment || isTest ? 1 * 60 * 1000 : 5 * 60 * 1000, // 1min dev/test, 5min prod
  max: isTest ? 100 : isDevelopment ? 1000 : 100, // 100 para test, 1000 dev, 100 prod (aumentado)
  message: {
    error: `Muitas tentativas de acesso. Tente novamente em ${
      isDevelopment || isTest ? "1" : "5"
    } minutos.`,
  },
};

const apiConfig = {
  windowMs: isDevelopment || isTest ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5min dev/test, 15min prod
  max: isTest ? 500 : isDevelopment ? 10000 : 100, // 500 para test, 10000 dev, 100 prod
  message: {
    error: `Muitas requisições. Tente novamente em ${
      isDevelopment || isTest ? "5" : "15"
    } minutos.`,
  },
};

// Limite para rotas de autenticação (login, registro, etc)
export const authLimiter = rateLimit({
  ...authConfig,
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Limite para rotas de refresh token
export const refreshLimiter = rateLimit({
  windowMs: isDevelopment || isTest ? 30 * 60 * 1000 : 60 * 60 * 1000, // 30min dev/test, 1h prod
  max: isDevelopment || isTest ? 200 : 10, // 200 dev/test, 10 prod
  message: {
    error: `Muitas tentativas de refresh. Tente novamente em ${
      isDevelopment || isTest ? "30 minutos" : "1 hora"
    }.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite geral para todas as rotas da API
export const apiLimiter = rateLimit({
  ...apiConfig,
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração de bypass para testes automatizados
export const testBypassLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 1000, // 1000 requisições (praticamente sem limite)
  message: {
    error: "Rate limit de teste ativo.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Bypass se header especial for enviado (para testes)
    return req.headers["x-test-bypass"] === "reservafacil-test-2025";
  },
});
