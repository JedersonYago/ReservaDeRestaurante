import * as dotenv from "dotenv";

// IMPORTANTE: Carrega as variáveis de ambiente ANTES de importar outros módulos
dotenv.config();

import { databaseConfig } from "./database";
import { adminConfig } from "./admin";
import { serverConfig } from "./server";
import { corsConfig } from "./cors";

export const config = {
  // Configurações do servidor
  server: serverConfig,

  // Configurações do banco de dados
  database: databaseConfig,

  // Configurações de autenticação
  auth: adminConfig,

  // Configurações de CORS
  cors: corsConfig,
} as const;

// Validação das configurações
export function validateConfig() {
  const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "NODE_ENV",
    "PORT",
    "CORS_ORIGIN",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}
