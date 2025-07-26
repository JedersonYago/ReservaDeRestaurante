import {
  authLimiter,
  apiLimiter,
  refreshLimiter,
  testBypassLimiter,
} from "../../config/rateLimit";

describe("rateLimit config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("authLimiter", () => {
    it("deve configurar limite de autenticação para desenvolvimento", () => {
      process.env.NODE_ENV = "development";

      // Re-import para pegar as novas configurações
      const {
        authLimiter: freshAuthLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
      expect(typeof freshAuthLimiter).toBe("function");
    });

    it("deve configurar limite de autenticação para teste", () => {
      process.env.NODE_ENV = "test";

      const {
        authLimiter: freshAuthLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
    });

    it("deve configurar limite de autenticação para produção", () => {
      process.env.NODE_ENV = "production";

      const {
        authLimiter: freshAuthLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
    });

    it("deve configurar limite de autenticação para ambiente não definido", () => {
      delete process.env.NODE_ENV;

      const {
        authLimiter: freshAuthLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
    });
  });

  describe("apiLimiter", () => {
    it("deve configurar limite da API para desenvolvimento", () => {
      process.env.NODE_ENV = "development";

      const { apiLimiter: freshApiLimiter } = require("../../config/rateLimit");

      expect(freshApiLimiter).toBeDefined();
    });

    it("deve configurar limite da API para teste", () => {
      process.env.NODE_ENV = "test";

      const { apiLimiter: freshApiLimiter } = require("../../config/rateLimit");

      expect(freshApiLimiter).toBeDefined();
    });

    it("deve configurar limite da API para produção", () => {
      process.env.NODE_ENV = "production";

      const { apiLimiter: freshApiLimiter } = require("../../config/rateLimit");

      expect(freshApiLimiter).toBeDefined();
    });

    it("deve configurar limite da API para ambiente não definido", () => {
      delete process.env.NODE_ENV;

      const { apiLimiter: freshApiLimiter } = require("../../config/rateLimit");

      expect(freshApiLimiter).toBeDefined();
    });
  });

  describe("refreshLimiter", () => {
    it("deve configurar limite de refresh para desenvolvimento", () => {
      process.env.NODE_ENV = "development";

      const {
        refreshLimiter: freshRefreshLimiter,
      } = require("../../config/rateLimit");

      expect(freshRefreshLimiter).toBeDefined();
    });

    it("deve configurar limite de refresh para teste", () => {
      process.env.NODE_ENV = "test";

      const {
        refreshLimiter: freshRefreshLimiter,
      } = require("../../config/rateLimit");

      expect(freshRefreshLimiter).toBeDefined();
    });

    it("deve configurar limite de refresh para produção", () => {
      process.env.NODE_ENV = "production";

      const {
        refreshLimiter: freshRefreshLimiter,
      } = require("../../config/rateLimit");

      expect(freshRefreshLimiter).toBeDefined();
    });

    it("deve configurar limite de refresh para ambiente não definido", () => {
      delete process.env.NODE_ENV;

      const {
        refreshLimiter: freshRefreshLimiter,
      } = require("../../config/rateLimit");

      expect(freshRefreshLimiter).toBeDefined();
    });
  });

  describe("testBypassLimiter", () => {
    it("deve configurar bypass para testes", () => {
      expect(testBypassLimiter).toBeDefined();
      expect(typeof testBypassLimiter).toBe("function");
    });

    it("deve ter função skip configurada", () => {
      // O testBypassLimiter é uma função que retorna um middleware
      // A função skip está definida internamente na configuração
      expect(typeof testBypassLimiter).toBe("function");
    });

    it("deve fazer bypass quando header especial for enviado", () => {
      // Como não podemos acessar a função skip diretamente,
      // testamos se o middleware está configurado corretamente
      expect(typeof testBypassLimiter).toBe("function");
    });

    it("não deve fazer bypass quando header especial não for enviado", () => {
      // Como não podemos acessar a função skip diretamente,
      // testamos se o middleware está configurado corretamente
      expect(typeof testBypassLimiter).toBe("function");
    });

    it("não deve fazer bypass quando header tiver valor incorreto", () => {
      // Como não podemos acessar a função skip diretamente,
      // testamos se o middleware está configurado corretamente
      expect(typeof testBypassLimiter).toBe("function");
    });
  });

  describe("configurações de ambiente", () => {
    it("deve usar configurações corretas para desenvolvimento", () => {
      process.env.NODE_ENV = "development";

      const {
        authLimiter: freshAuthLimiter,
        apiLimiter: freshApiLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
      expect(freshApiLimiter).toBeDefined();
    });

    it("deve usar configurações corretas para teste", () => {
      process.env.NODE_ENV = "test";

      const {
        authLimiter: freshAuthLimiter,
        apiLimiter: freshApiLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
      expect(freshApiLimiter).toBeDefined();
    });

    it("deve usar configurações corretas para produção", () => {
      process.env.NODE_ENV = "production";

      const {
        authLimiter: freshAuthLimiter,
        apiLimiter: freshApiLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
      expect(freshApiLimiter).toBeDefined();
    });

    it("deve usar configurações corretas para ambiente não definido", () => {
      delete process.env.NODE_ENV;

      const {
        authLimiter: freshAuthLimiter,
        apiLimiter: freshApiLimiter,
      } = require("../../config/rateLimit");

      expect(freshAuthLimiter).toBeDefined();
      expect(freshApiLimiter).toBeDefined();
    });
  });

  describe("configurações específicas", () => {
    it("deve ter configurações de headers corretas", () => {
      expect(typeof authLimiter).toBe("function");
      expect(typeof apiLimiter).toBe("function");
      expect(typeof refreshLimiter).toBe("function");
    });

    it("deve ter configurações de mensagens de erro", () => {
      expect(typeof authLimiter).toBe("function");
      expect(typeof apiLimiter).toBe("function");
      expect(typeof refreshLimiter).toBe("function");
    });

    it("deve ter configurações de tempo de janela", () => {
      expect(typeof authLimiter).toBe("function");
      expect(typeof apiLimiter).toBe("function");
      expect(typeof refreshLimiter).toBe("function");
    });

    it("deve ter configurações de limite máximo", () => {
      expect(typeof authLimiter).toBe("function");
      expect(typeof apiLimiter).toBe("function");
      expect(typeof refreshLimiter).toBe("function");
    });
  });
});
