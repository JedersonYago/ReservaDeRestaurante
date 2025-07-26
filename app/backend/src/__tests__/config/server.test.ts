describe("server config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Limpar cache do módulo para forçar recarregamento
    jest.resetModules();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("serverConfig", () => {
    it("deve usar porta padrão quando PORT não está definido", () => {
      delete process.env.PORT;
      const { serverConfig: freshConfig } = require("../../config/server");

      expect(freshConfig.port).toBe(3000);
    });

    it("deve usar porta do ambiente quando PORT está definido", () => {
      process.env.PORT = "8080";
      const { serverConfig: freshConfig } = require("../../config/server");

      expect(freshConfig.port).toBe("8080");
    });

    it("deve usar ambiente padrão quando NODE_ENV não está definido", () => {
      delete process.env.NODE_ENV;
      const { serverConfig: freshConfig } = require("../../config/server");

      expect(freshConfig.nodeEnv).toBe("development");
    });

    it("deve usar ambiente do NODE_ENV quando definido", () => {
      process.env.NODE_ENV = "production";
      const { serverConfig: freshConfig } = require("../../config/server");

      expect(freshConfig.nodeEnv).toBe("production");
    });

    it("deve ter configuração válida", () => {
      const { serverConfig } = require("../../config/server");
      expect(serverConfig.port).toBeDefined();
      // A porta pode ser string (quando vem do env) ou number (quando é o valor padrão)
      expect(
        typeof serverConfig.port === "string" ||
          typeof serverConfig.port === "number"
      ).toBe(true);
      expect(serverConfig.nodeEnv).toBeDefined();
      expect(typeof serverConfig.nodeEnv).toBe("string");
    });
  });
});
