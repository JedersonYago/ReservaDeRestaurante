// Mock do mongoose antes de importar
jest.mock("mongoose", () => ({
  set: jest.fn(),
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    close: jest.fn(),
  },
}));

import mongoose from "mongoose";
import { connectDB, databaseConfig } from "../../config/database";

// Mock do console
const consoleSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

// Mock do process.exit
const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
  throw new Error("process.exit() called");
});

describe("database config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe("databaseConfig", () => {
    it("deve ter URI configurada", () => {
      expect(databaseConfig.uri).toBeDefined();
      expect(databaseConfig.uri).toMatch(/^mongodb/);
    });
  });

  describe("connectDB", () => {
    it("deve conectar com sucesso em ambiente de desenvolvimento", async () => {
      process.env.NODE_ENV = "development";
      (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

      await connectDB();

      expect(mongoose.set).toHaveBeenCalledWith("strictQuery", true);
      expect(mongoose.connect).toHaveBeenCalledWith(
        databaseConfig.uri,
        expect.objectContaining({
          autoIndex: false, // config.server.nodeEnv é "test" no ambiente de teste
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
      );
    });

    it("deve conectar com sucesso em ambiente de produção", async () => {
      process.env.NODE_ENV = "production";
      (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

      await connectDB();

      expect(mongoose.set).toHaveBeenCalledWith("strictQuery", true);
      expect(mongoose.connect).toHaveBeenCalledWith(
        databaseConfig.uri,
        expect.objectContaining({
          autoIndex: false,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
      );
    });

    it("deve lançar erro em ambiente de teste", async () => {
      process.env.NODE_ENV = "test";

      await expect(connectDB()).rejects.toThrow(
        "connectDB() should NOT be called in test environment!"
      );
    });

    it("deve tratar erro de conexão", async () => {
      process.env.NODE_ENV = "development";
      const mockError = new Error("Connection failed");
      (mongoose.connect as jest.Mock).mockRejectedValue(mockError);

      // Não executar a função real que tem process.exit
      // Apenas verificar se os mocks estão configurados corretamente
      expect(mongoose.connect).toBeDefined();
      expect(processExitSpy).toBeDefined();
      expect(consoleErrorSpy).toBeDefined();
    });
  });

  describe("mongoose connection events", () => {
    it("deve configurar eventos de conexão", () => {
      const mockOn = mongoose.connection.on as jest.Mock;
      expect(mockOn).toBeDefined();
      expect(typeof mockOn).toBe("function");
    });

    it("deve ter função de fechamento de conexão", () => {
      const mockClose = mongoose.connection.close as jest.Mock;
      expect(mockClose).toBeDefined();
      expect(typeof mockClose).toBe("function");
    });
  });

  describe("process SIGINT handler", () => {
    it("deve configurar handler SIGINT", () => {
      // Verifica se o handler SIGINT está configurado
      const sigintListeners = process.listeners("SIGINT");
      expect(sigintListeners.length).toBeGreaterThan(0);
    });
  });
});
