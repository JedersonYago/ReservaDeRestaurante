import { adminConfig, validateAdminCode } from "../../config/admin";

describe("admin config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("adminConfig", () => {
    it("deve usar valores padrão em desenvolvimento", () => {
      process.env.NODE_ENV = "development";
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.REFRESH_TOKEN_EXPIRES_IN;
      delete process.env.ADMIN_CODE;

      // Re-import para pegar os novos valores
      const { adminConfig: freshConfig } = require("../../config/admin");

      expect(freshConfig.jwtSecret).toBe("dev-secret-key");
      expect(freshConfig.jwtExpiresIn).toBe("1h");
      expect(freshConfig.refreshTokenExpiresIn).toBe("7d");
      expect(freshConfig.adminCode).toBe("admin123");
    });

    it("deve usar valores do ambiente quando disponíveis", () => {
      process.env.NODE_ENV = "development";
      process.env.JWT_SECRET = "custom-secret";
      process.env.JWT_EXPIRES_IN = "2h";
      process.env.REFRESH_TOKEN_EXPIRES_IN = "14d";
      process.env.ADMIN_CODE = "custom-admin";

      // Re-import para pegar os novos valores
      const { adminConfig: freshConfig } = require("../../config/admin");

      expect(freshConfig.jwtSecret).toBe("custom-secret");
      expect(freshConfig.jwtExpiresIn).toBe("2h");
      expect(freshConfig.refreshTokenExpiresIn).toBe("14d");
      expect(freshConfig.adminCode).toBe("custom-admin");
    });

    it("deve lançar erro se JWT_SECRET não estiver definido em produção", () => {
      process.env.NODE_ENV = "production";
      delete process.env.JWT_SECRET;

      expect(() => {
        require("../../config/admin");
      }).toThrow("JWT_SECRET é obrigatório para a segurança da aplicação em produção");
    });

    it("não deve lançar erro se JWT_SECRET estiver definido em produção", () => {
      process.env.NODE_ENV = "production";
      process.env.JWT_SECRET = "production-secret";

      expect(() => {
        require("../../config/admin");
      }).not.toThrow();
    });

    it("não deve lançar erro em desenvolvimento mesmo sem JWT_SECRET", () => {
      process.env.NODE_ENV = "development";
      delete process.env.JWT_SECRET;

      expect(() => {
        require("../../config/admin");
      }).not.toThrow();
    });
  });

  describe("validateAdminCode", () => {
    it("deve retornar true para código válido", () => {
      expect(validateAdminCode("admin123")).toBe(true);
    });

    it("deve retornar false para código inválido", () => {
      expect(validateAdminCode("wrong-code")).toBe(false);
      expect(validateAdminCode("")).toBe(false);
      expect(validateAdminCode("admin")).toBe(false);
    });

    it("deve ser case sensitive", () => {
      expect(validateAdminCode("ADMIN123")).toBe(false);
      expect(validateAdminCode("Admin123")).toBe(false);
    });
  });
}); 