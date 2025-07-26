import mongoose from "mongoose";
import { config } from "./index";

export const databaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/reserva-facil",
} as const;

export const connectDB = async () => {
  // Permite conexão em modo test para testes de performance (Artillery)
  if (
    process.env.NODE_ENV === "test" &&
    !process.env.ALLOW_TEST_DB_CONNECTION
  ) {
    throw new Error(
      "connectDB() should NOT be called in test environment! The test runner is responsible for DB connection."
    );
  }
  try {
    // Configurações do Mongoose
    mongoose.set("strictQuery", true);

    // Opções de conexão
    const options = {
      autoIndex: config.server.nodeEnv === "development",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(databaseConfig.uri, options);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error);
    process.exit(1);
  }
};

// Eventos de conexão
mongoose.connection.on("error", (err) => {
  console.error("Erro na conexão com MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB desconectado");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao fechar conexão com MongoDB:", error);
    process.exit(1);
  }
});
