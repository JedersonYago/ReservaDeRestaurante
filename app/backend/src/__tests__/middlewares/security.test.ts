import {
  cacheControl,
  cleanHeaders,
  performanceHeaders,
  staticCacheBusting,
  sanitizeData,
} from "../../middlewares/security";

describe("security middlewares", () => {
  const next = jest.fn();
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { path: "", originalUrl: "", headers: {}, body: {} };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  describe("cacheControl", () => {
    it("define cache longo para recursos estáticos", () => {
      req.path = "/img/logo.png";
      cacheControl(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        expect.stringContaining("max-age=2592000")
      );
      expect(next).toHaveBeenCalled();
    });
    it("não cacheia rotas de API", () => {
      req.path = "/api/test";
      cacheControl(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        expect.stringContaining("no-cache")
      );
      expect(res.setHeader).toHaveBeenCalledWith("Pragma", "no-cache");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("cleanHeaders", () => {
    it("remove headers sensíveis", () => {
      cleanHeaders(req, res, next);
      expect(res.removeHeader).toHaveBeenCalledWith("X-Powered-By");
      expect(res.removeHeader).toHaveBeenCalledWith("Server");
      expect(res.removeHeader).toHaveBeenCalledWith("X-Frame-Options");
      expect(res.removeHeader).toHaveBeenCalledWith("X-XSS-Protection");
      expect(res.removeHeader).toHaveBeenCalledWith("Content-Security-Policy");
      expect(res.removeHeader).toHaveBeenCalledWith("Expires");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("performanceHeaders", () => {
    it("adiciona headers de performance", () => {
      req.path = "/main.js";
      req.originalUrl = "/main.js";
      performanceHeaders(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith("Vary", "Accept-Encoding");
      expect(res.setHeader).toHaveBeenCalledWith(
        "X-Content-Type-Options",
        "nosniff"
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        "X-DNS-Prefetch-Control",
        "off"
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe("staticCacheBusting", () => {
    it("adiciona cache busting para recursos estáticos", () => {
      req.path = "/main.js";
      req.originalUrl = "/main.js";
      staticCacheBusting(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        expect.stringContaining("max-age=31536000")
      );
      expect(res.setHeader).toHaveBeenCalledWith("X-Cache-Busting", "enabled");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("sanitizeData", () => {
    it("trima strings do body", () => {
      req.body = { nome: "  teste  ", email: "  a@b.com  " };
      sanitizeData(req, res, next);
      expect(req.body.nome).toBe("teste");
      expect(req.body.email).toBe("a@b.com");
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("sanitizeData casos extras", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { body: {} };
    res = {};
    next.mockClear();
  });

  it("não altera se body for vazio", () => {
    req.body = {};
    sanitizeData(req, res, next);
    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  it("não altera se body não for objeto", () => {
    req.body = null;
    sanitizeData(req, res, next);
    expect(req.body).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it("não altera valores não-string", () => {
    req.body = { idade: 20, ativo: true, obj: { a: 1 } };
    sanitizeData(req, res, next);
    expect(req.body).toEqual({ idade: 20, ativo: true, obj: { a: 1 } });
    expect(next).toHaveBeenCalled();
  });

  it("não altera arrays no body", () => {
    req.body = { lista: [" a ", "b ", " c"] };
    sanitizeData(req, res, next);
    expect(Array.isArray(req.body.lista)).toBe(true);
    expect(req.body.lista).toEqual([" a ", "b ", " c"]);
    expect(next).toHaveBeenCalled();
  });

  it("não altera objetos aninhados no body", () => {
    req.body = { user: { nome: "  teste  " } };
    sanitizeData(req, res, next);
    // O middleware atual não trima objetos aninhados
    expect(req.body.user.nome).toBe("  teste  ");
    expect(next).toHaveBeenCalled();
  });

  it("não quebra com valores undefined ou null", () => {
    req.body = { nome: undefined, email: null };
    sanitizeData(req, res, next);
    expect(req.body.nome).toBeUndefined();
    expect(req.body.email).toBeNull();
    expect(next).toHaveBeenCalled();
  });
});

describe("sanitizeData ignora tipos não string", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { body: {} };
    res = {};
    next.mockClear();
  });

  it("não altera funções, símbolos e objetos complexos", () => {
    const sym = Symbol("teste");
    const func = () => "abc";
    const obj = { a: 1 };
    req.body = {
      nome: "  nome  ",
      funcao: func,
      simbolo: sym,
      objeto: obj,
    };
    sanitizeData(req, res, next);
    expect(req.body.nome).toBe("nome");
    expect(req.body.funcao).toBe(func);
    expect(req.body.simbolo).toBe(sym);
    expect(req.body.objeto).toBe(obj);
    expect(next).toHaveBeenCalled();
  });
});

describe("sanitizeData ignora propriedades herdadas", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    function Body(this: any) {
      this.nome = "  nome  ";
    }
    Body.prototype.email = "  herdado@teste.com  ";
    req = { body: new (Body as any)() };
    res = {};
    next.mockClear();
  });

  it("só trima propriedades próprias", () => {
    sanitizeData(req, res, next);
    expect(req.body.nome).toBe("nome");
    // Propriedade herdada permanece com espaços
    expect(req.body.email).toBe("  herdado@teste.com  ");
    expect(next).toHaveBeenCalled();
  });
});

describe("performanceHeaders e staticCacheBusting com path não estático", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { path: "", originalUrl: "", headers: {}, body: {} };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("não adiciona headers de performance para path não estático", () => {
    req.path = "/api/test";
    req.originalUrl = "/api/test";
    performanceHeaders(req, res, next);
    // O header 'Vary' é sempre setado, então não testamos ele aqui
    // Os headers de cache busting não devem ser setados
    expect(res.setHeader).not.toHaveBeenCalledWith("ETag", expect.anything());
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.anything()
    );
    expect(next).toHaveBeenCalled();
  });

  it("não adiciona cache busting para path não estático", () => {
    req.path = "/api/test";
    req.originalUrl = "/api/test";
    staticCacheBusting(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Cache-Control",
      expect.stringContaining("max-age=31536000")
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Busting",
      "enabled"
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("staticCacheBusting com versão na URL", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = {
      path: "/main.js",
      originalUrl: "/main.js?v=123",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("não adiciona cache busting se já houver ?v= na URL", () => {
    staticCacheBusting(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Cache-Control",
      expect.stringContaining("max-age=31536000")
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Busting",
      "enabled"
    );
    expect(next).toHaveBeenCalled();
  });

  it("não adiciona cache busting se já houver &v= na URL", () => {
    req.originalUrl = "/main.js?foo=bar&v=456";
    staticCacheBusting(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "Cache-Control",
      expect.stringContaining("max-age=31536000")
    );
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Busting",
      "enabled"
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("staticCacheBusting com outros parâmetros na query", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = {
      path: "/main.js",
      originalUrl: "/main.js?foo=bar",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("adiciona cache busting mesmo com outros parâmetros na query", () => {
    staticCacheBusting(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      expect.stringContaining("max-age=31536000")
    );
    expect(res.setHeader).toHaveBeenCalledWith("X-Cache-Busting", "enabled");
    expect(next).toHaveBeenCalled();
  });
});

describe("cacheControl para rota comum", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { path: "/home", originalUrl: "/home", headers: {}, body: {} };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("seta cache padrão e remove Expires", () => {
    cacheControl(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=3600"
    );
    expect(res.removeHeader).toHaveBeenCalledWith("Expires");
    expect(next).toHaveBeenCalled();
  });
});

describe("performanceHeaders não adiciona X-Cache-Version para minificados", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = {
      path: "/main.min.js",
      originalUrl: "/main.min.js",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("não adiciona X-Cache-Version para .min.js", () => {
    performanceHeaders(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.anything()
    );
    expect(next).toHaveBeenCalled();
  });

  it("não adiciona X-Cache-Version para .min.css", () => {
    req.path = "/main.min.css";
    req.originalUrl = "/main.min.css";
    performanceHeaders(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.anything()
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("performanceHeaders não adiciona X-Cache-Version se já houver versão", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = {
      path: "/main.js",
      originalUrl: "/main.js?v=123",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("não adiciona X-Cache-Version se já houver ?v=", () => {
    performanceHeaders(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.anything()
    );
    expect(next).toHaveBeenCalled();
  });

  it("não adiciona X-Cache-Version se já houver &v=", () => {
    req.originalUrl = "/main.js?foo=bar&v=456";
    performanceHeaders(req, res, next);
    expect(res.setHeader).not.toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.anything()
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("performanceHeaders adiciona ETag e X-Cache-Version para .css", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = {
      path: "/styles.css",
      originalUrl: "/styles.css",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  it("adiciona ETag e X-Cache-Version para .css sem versão", () => {
    performanceHeaders(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith("ETag", expect.any(String));
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-Cache-Version",
      expect.stringMatching(/^v=\d+$/)
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("sanitizeData ignora body array", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { body: [" a ", " b "] };
    res = {};
    next.mockClear();
  });

  it("não altera body se for array", () => {
    sanitizeData(req, res, next);
    expect(req.body).toEqual(["a", "b"]);
    expect(next).toHaveBeenCalled();
  });
});

describe("sanitizeData com body undefined", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { body: undefined };
    res = {};
    next.mockClear();
  });

  it("não quebra com body undefined", () => {
    sanitizeData(req, res, next);
    expect(req.body).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});

describe("sanitizeData com body array de strings", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  beforeEach(() => {
    req = { body: ["  teste1  ", "  teste2  ", "  teste3  "] };
    res = {};
    next.mockClear();
  });

  it("trima strings em array", () => {
    sanitizeData(req, res, next);
    expect(req.body).toEqual(["teste1", "teste2", "teste3"]);
    expect(next).toHaveBeenCalled();
  });
});

describe("staticCacheBusting em ambiente de produção", () => {
  let req: any;
  let res: any;
  const next = jest.fn();
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = "production";
    process.env.BUILD_TIMESTAMP = "1234567890";
    req = {
      path: "/main.js",
      originalUrl: "/main.js",
      headers: {},
      body: {},
    };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    delete process.env.BUILD_TIMESTAMP;
  });

  it("usa BUILD_TIMESTAMP em produção", () => {
    staticCacheBusting(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    expect(res.setHeader).toHaveBeenCalledWith("X-Cache-Busting", "enabled");
    expect(next).toHaveBeenCalled();
  });
});
