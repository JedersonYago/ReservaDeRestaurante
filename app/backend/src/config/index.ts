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
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  // Log das configurações (sem valores sensíveis)
  console.log("📋 Configurações carregadas:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   PORT: ${process.env.PORT || 3000}`);
  console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ Não configurado'}`);
}
