export const serverConfig = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
