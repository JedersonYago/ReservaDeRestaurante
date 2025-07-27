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
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Permitir requisições sem origin (como mobile apps ou Postman)
    if (!origin) {
      console.log("🌐 CORS: Requisição sem origin permitida");
      return callback(null, true);
    }

    const allowedOrigins = getCorsOrigins();

    // Log para debug
    console.log(`🌐 CORS: Origin recebida: ${origin}`);
    console.log(`🌐 CORS: Origins permitidas:`, allowedOrigins);

    // Verificar se a origin está na lista de permitidas
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      // Suporte para wildcards
      if (allowedOrigin.includes("*")) {
        const pattern = allowedOrigin.replace("*", ".*");
        const matches = new RegExp(pattern).test(origin);
        console.log(
          `🌐 CORS: Testando wildcard ${allowedOrigin} -> ${pattern} -> ${matches}`
        );
        return matches;
      }
      const matches = allowedOrigin === origin;
      console.log(
        `🌐 CORS: Testando exact match ${allowedOrigin} -> ${matches}`
      );
      return matches;
    });

    if (isAllowed) {
      console.log(`✅ CORS: Origin ${origin} permitida`);
      callback(null, true);
    } else {
      console.log(`🚫 CORS bloqueado para origin: ${origin}`);
      console.log(`✅ Origins permitidas:`, allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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
