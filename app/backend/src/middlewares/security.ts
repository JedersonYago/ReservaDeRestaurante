import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
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

// Configuração de compressão
export const compressionConfig = compression({
  filter: (req, res) => {
    // Não comprimir se o cliente não suporta
    if (req.headers["x-no-compression"]) {
      return false;
    }

    // Comprimir respostas maiores que 1KB
    return compression.filter(req, res);
  },
  level: 6, // Nível de compressão (1-9, 6 é um bom balance entre velocidade e tamanho)
  threshold: 1024, // Só comprimir se > 1KB
});

// Configuração do Helmet melhorada
export const helmetConfig = helmet({
  // Desabilitar CSP completamente se não for necessário
  contentSecurityPolicy: false,
  // Desabilitar X-Frame-Options completamente
  frameguard: false,
  // Desabilitar X-XSS-Protection completamente
  xssFilter: false,
  // Configurar HSTS apenas em produção
  hsts:
    process.env.NODE_ENV === "production"
      ? {
          maxAge: 31536000, // 1 ano
          includeSubDomains: true,
          preload: true,
        }
      : false,
  // Configurar Referrer Policy
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  // Configurar outros headers de segurança
  noSniff: true,
  dnsPrefetchControl: true,
  ieNoOpen: true,
  permittedCrossDomainPolicies: false,
});

// Middleware para controle de cache
export const cacheControl = (req: any, res: any, next: any) => {
  // Configurar cache para recursos estáticos
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    // Cache de 30 dias para recursos estáticos
    res.setHeader("Cache-Control", "public, max-age=2592000, immutable");

    // Content-Type correto para JavaScript e CSS
    if (req.path.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    } else if (req.path.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css; charset=utf-8");
    }
  } else if (req.path.startsWith("/api/")) {
    // Não cachear respostas da API
    res.setHeader(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, private"
    );
    res.setHeader("Pragma", "no-cache");
  } else {
    // Cache padrão para outras rotas
    res.setHeader("Cache-Control", "public, max-age=3600");
  }

  // Garantir que header Expires não seja enviado
  res.removeHeader("Expires");

  next();
};

// Middleware para limpar headers desnecessários
export const cleanHeaders = (req: any, res: any, next: any) => {
  // Remover headers que podem ser problemáticos
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");
  res.removeHeader("X-Frame-Options");
  res.removeHeader("X-XSS-Protection");
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("Expires");

  next();
};

// Middleware para adicionar headers de performance
export const performanceHeaders = (req: any, res: any, next: any) => {
  // Adicionar header de compressão
  res.setHeader("Vary", "Accept-Encoding");

  // Cache busting para recursos estáticos
  if (req.path.match(/\.(css|js)$/)) {
    // Adicionar hash baseado no timestamp para cache busting
    const timestamp = Date.now();
    res.setHeader("ETag", `"${timestamp}"`);

    // Para recursos JS/CSS, adicionar hash na URL se não existir
    if (!req.path.includes("?v=") && !req.path.includes(".min.")) {
      const originalUrl = req.originalUrl;
      const hasQuery = originalUrl.includes("?");
      const separator = hasQuery ? "&" : "?";

      // Adicionar versão como query param se não existir
      if (!originalUrl.includes("v=")) {
        const versionParam = `v=${timestamp}`;
        res.setHeader("X-Cache-Version", versionParam);
      }
    }
  }

  // Headers de performance adicionais
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-DNS-Prefetch-Control", "off");

  next();
};

// Middleware específico para cache busting de recursos estáticos
export const staticCacheBusting = (req: any, res: any, next: any) => {
  // Verificar se é um recurso estático
  if (
    req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  ) {
    // Se não tem versão na URL, adicionar automaticamente
    if (!req.originalUrl.includes("?v=") && !req.originalUrl.includes("&v=")) {
      const timestamp =
        process.env.NODE_ENV === "production"
          ? process.env.BUILD_TIMESTAMP || Date.now()
          : Date.now();

      // Adicionar timestamp como query parameter
      const separator = req.originalUrl.includes("?") ? "&" : "?";
      const versionedUrl = `${req.originalUrl}${separator}v=${timestamp}`;

      // Definir cache longo para recursos versionados
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Cache-Busting", "enabled");
    }
  }

  next();
};

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
