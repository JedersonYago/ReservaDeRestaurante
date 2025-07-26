import { config, validateConfig } from "../../config/index";

describe("config index", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("config object", () => {
    it("deve exportar objeto de configuração completo", () => {
      expect(config).toBeDefined();
      expect(config.server).toBeDefined();
      expect(config.database).toBeDefined();
      expect(config.auth).toBeDefined();
      expect(config.cors).toBeDefined();
    });

    it("deve ter configurações do servidor", () => {
      expect(config.server).toBeDefined();
      expect(typeof config.server).toBe("object");
    });

    it("deve ter configurações do banco de dados", () => {
      expect(config.database).toBeDefined();
      expect(typeof config.database).toBe("object");
    });

    it("deve ter configurações de autenticação", () => {
      expect(config.auth).toBeDefined();
      expect(typeof config.auth).toBe("object");
    });

    it("deve ter configurações de CORS", () => {
      expect(config.cors).toBeDefined();
      expect(typeof config.cors).toBe("object");
    });
  });

  describe("validateConfig", () => {
    it("deve passar quando todas as variáveis de ambiente estão definidas", () => {
      process.env.MONGODB_URI = "mongodb://test:27017/test";
      process.env.JWT_SECRET = "test-secret";
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).not.toThrow();
    });

    it("deve lançar erro quando MONGODB_URI está faltando", () => {
      delete process.env.MONGODB_URI;
      process.env.JWT_SECRET = "test-secret";
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).toThrow("Missing required environment variables: MONGODB_URI");
    });

    it("deve lançar erro quando JWT_SECRET está faltando", () => {
      process.env.MONGODB_URI = "mongodb://test:27017/test";
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).toThrow("Missing required environment variables: JWT_SECRET");
    });

    it("deve lançar erro quando NODE_ENV está faltando", () => {
      process.env.MONGODB_URI = "mongodb://test:27017/test";
      process.env.JWT_SECRET = "test-secret";
      delete process.env.NODE_ENV;
      process.env.PORT = "3000";
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).toThrow("Missing required environment variables: NODE_ENV");
    });

    it("deve lançar erro quando PORT está faltando", () => {
      process.env.MONGODB_URI = "mongodb://test:27017/test";
      process.env.JWT_SECRET = "test-secret";
      process.env.NODE_ENV = "test";
      delete process.env.PORT;
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).toThrow("Missing required environment variables: PORT");
    });

    it("deve lançar erro quando CORS_ORIGIN está faltando", () => {
      process.env.MONGODB_URI = "mongodb://test:27017/test";
      process.env.JWT_SECRET = "test-secret";
      process.env.NODE_ENV = "test";
      process.env.PORT = "3000";
      delete process.env.CORS_ORIGIN;

      expect(() => validateConfig()).toThrow("Missing required environment variables: CORS_ORIGIN");
    });

    it("deve lançar erro quando múltiplas variáveis estão faltando", () => {
      delete process.env.MONGODB_URI;
      delete process.env.JWT_SECRET;
      delete process.env.NODE_ENV;
      process.env.PORT = "3000";
      process.env.CORS_ORIGIN = "http://localhost:3000";

      expect(() => validateConfig()).toThrow("Missing required environment variables: MONGODB_URI, JWT_SECRET, NODE_ENV");
    });

    it("deve lançar erro quando todas as variáveis estão faltando", () => {
      delete process.env.MONGODB_URI;
      delete process.env.JWT_SECRET;
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      delete process.env.CORS_ORIGIN;

      expect(() => validateConfig()).toThrow("Missing required environment variables: MONGODB_URI, JWT_SECRET, NODE_ENV, PORT, CORS_ORIGIN");
    });
  });
}); 