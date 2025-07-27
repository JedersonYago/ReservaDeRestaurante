import { createApp } from "./app";
import { connectDB } from "./config/database";
import { config, validateConfig } from "./config";
import {
  startPeriodicCheck,
  startExpirationCheck,
} from "./services/schedulerService";
import { initializeDefaultConfig } from "./utils/initUtils";

// Inicialização do servidor
const startServer = async () => {
  try {
    console.log("🚀 Iniciando servidor...");
    console.log("📋 Validando configurações...");
    validateConfig();
    console.log("✅ Configurações validadas");

    console.log("🔌 Conectando ao banco de dados...");
    await connectDB();
    console.log("✅ MongoDB conectado");

    console.log("🔧 Inicializando configurações padrão...");
    await initializeDefaultConfig();
    console.log("✅ Configurações inicializadas");

    console.log("⏰ Iniciando serviços agendados...");
    startPeriodicCheck();
    startExpirationCheck();

    console.log("🌐 Criando aplicação...");
    const app = createApp();

    console.log(`🚀 Servidor iniciando na porta ${config.server.port}...`);
    const server = app.listen(config.server.port, () => {
      console.log(`✅ Servidor rodando na porta ${config.server.port}`);
    });

    process.on("SIGTERM", () => {
      console.log("🛑 Recebido SIGTERM, encerrando servidor...");
      server.close(() => {
        console.log("✅ Servidor encerrado");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}
