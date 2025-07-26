// Configuração de CORS para permitir múltiplos domínios
const getCorsOrigins = () => {
  const corsOrigin = process.env.CORS_ORIGIN;

  if (corsOrigin) {
    // Se CORS_ORIGIN está definido, usar ele + domínios padrão
    return [
      corsOrigin,
      "http://localhost:5173", // Desenvolvimento local
      "https://suareservafacil.vercel.app", // Deploy do Vercel
    ];
  }

  // Fallback para desenvolvimento
  return ["http://localhost:5173"];
};

export const corsConfig = {
  origin: getCorsOrigins(),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
} as const;
