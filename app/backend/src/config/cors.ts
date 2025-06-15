export const corsConfig = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
} as const;
