// Configuração de CORS para permitir múltiplos domínios
const getCorsOrigins = () => {
  const corsOrigin = process.env.CORS_ORIGIN;
  const nodeEnv = process.env.NODE_ENV || "development";

  // Em produção, sempre incluir o domínio do Vercel
  const productionOrigins = [
    "https://suareservafacil.vercel.app",
    "https://reservafacil.vercel.app",
    "https://*.vercel.app", // Permitir subdomínios do Vercel
    "https://reserva-de-restaurante-git-main-jedersons-projects-2f854022.vercel.app",
    "https://reserva-de-restaurante-eo26xtgwz-jedersons-projects-2f854022.vercel.app",
  ];

  if (corsOrigin) {
    // Se CORS_ORIGIN está definido, usar ele + domínios padrão
    return [
      corsOrigin,
      "http://localhost:5173", // Desenvolvimento local
      "http://localhost:3000", // Desenvolvimento local alternativo
      ...(nodeEnv === "production" ? productionOrigins : []),
    ];
  }

  // Fallback para desenvolvimento
  return [
    "http://localhost:5173",
    "http://localhost:3000",
    ...(nodeEnv === "production" ? productionOrigins : []),
  ];
};

export const corsConfig = {
  origin: true, // Permitir TODAS as origens temporariamente
  credentials: false, // Desabilitar credentials para evitar problemas
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
  optionsSuccessStatus: 200, // Para compatibilidade com alguns navegadores
} as const;
