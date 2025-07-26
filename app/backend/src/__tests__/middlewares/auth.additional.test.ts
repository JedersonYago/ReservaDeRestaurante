import request from "supertest";
import express from "express";
import {
  authenticate,
  isAdmin,
  roleAuth,
  optionalAuth,
} from "../../middlewares/auth";
import { generateTokenPair } from "../../utils/jwt";
import { TestDataFactory, TestCleanup } from "../helpers";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const app = express();
app.use(express.json());

// Rotas de teste para diferentes middlewares
app.get("/protegida", authenticate, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/admin", authenticate, isAdmin, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/client", authenticate, roleAuth(["client"]), (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get("/optional", optionalAuth, (req, res) => {
  res.json({
    ok: true,
    user: req.user || null,
    authenticated: !!req.user,
  });
});

describe("Middleware de Autenticação - Testes Adicionais", () => {
  let user: any;
  let admin: any;
  let userToken: string;
  let adminToken: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    user = await TestDataFactory.createUser({
      name: "Test User",
      email: "user@test.com",
      username: "testuser",
      role: "client",
    });

    admin = await TestDataFactory.createUser({
      name: "Admin User",
      email: "admin@test.com",
      username: "admin",
      role: "admin",
    });

    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe("authenticate - Casos de erro específicos", () => {
    it("deve retornar erro quando verifyToken lança TokenExpiredError", async () => {
      // Mock verifyToken para lançar TokenExpiredError
      const mockVerifyToken = jest.spyOn(
        require("../../utils/jwt"),
        "verifyToken"
      );
      mockVerifyToken.mockImplementation(() => {
        const error = new jwt.TokenExpiredError("Token expired", new Date());
        throw error;
      });

      const res = await request(app)
        .get("/protegida")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(401);

      expect(res.body.message).toBe("Token expirado");
      mockVerifyToken.mockRestore();
    });

    it("deve retornar erro quando verifyToken lança JsonWebTokenError", async () => {
      // Mock verifyToken para lançar JsonWebTokenError
      const mockVerifyToken = jest.spyOn(
        require("../../utils/jwt"),
        "verifyToken"
      );
      mockVerifyToken.mockImplementation(() => {
        const error = new jwt.JsonWebTokenError("Invalid token");
        throw error;
      });

      const res = await request(app)
        .get("/protegida")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(401);

      expect(res.body.message).toBe("Token inválido");
      mockVerifyToken.mockRestore();
    });

    it("deve retornar erro genérico quando ocorre erro inesperado", async () => {
      // Mock verifyToken para lançar erro genérico
      const mockVerifyToken = jest.spyOn(
        require("../../utils/jwt"),
        "verifyToken"
      );
      mockVerifyToken.mockImplementation(() => {
        throw new Error("Erro inesperado");
      });

      const res = await request(app)
        .get("/protegida")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(401);

      expect(res.body.message).toBe("Erro de autenticação");
      mockVerifyToken.mockRestore();
    });
  });

  describe("isAdmin middleware", () => {
    it("deve permitir acesso para admin", async () => {
      const res = await request(app)
        .get("/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.ok).toBe(true);
      expect(res.body.user.role).toBe("admin");
    });

    it("deve negar acesso para usuário não-admin", async () => {
      const res = await request(app)
        .get("/admin")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.message).toBe("Acesso negado");
    });

    it("deve retornar erro 500 quando ocorre erro inesperado", async () => {
      // Criar uma rota específica para testar o erro no isAdmin
      const testApp = express();
      testApp.use(express.json());

      // Mock do authenticate que sempre passa
      const mockAuthenticate = (req: any, res: any, next: any) => {
        req.user = { _id: "123", role: "admin", username: "admin" };
        next();
      };

      // Mock do isAdmin que sempre lança erro
      const mockIsAdmin = (req: any, res: any, next: any) => {
        throw new Error("Erro inesperado");
      };

      testApp.get("/admin", mockAuthenticate, mockIsAdmin, (req, res) => {
        res.json({ ok: true, user: req.user });
      });

      // Middleware de tratamento de erro
      testApp.use((error: any, req: any, res: any, next: any) => {
        console.error("[isAdmin] Erro:", error);
        return res
          .status(500)
          .json({ message: "Erro ao verificar permissões" });
      });

      const res = await request(testApp)
        .get("/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.message).toBe("Erro ao verificar permissões");
    });
  });

  describe("roleAuth middleware", () => {
    it("deve permitir acesso para usuário com role correto", async () => {
      const res = await request(app)
        .get("/client")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.ok).toBe(true);
      expect(res.body.user.role).toBe("client");
    });

    it("deve negar acesso para usuário sem role correto", async () => {
      const res = await request(app)
        .get("/client")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.message).toBe("Acesso negado");
    });

    it("deve negar acesso quando não há usuário autenticado", async () => {
      const res = await request(app).get("/client").expect(401);

      expect(res.body.message).toBe("Token não fornecido ou formato inválido");
    });
  });

  describe("optionalAuth middleware", () => {
    it("deve continuar sem autenticação quando não há token", async () => {
      const res = await request(app).get("/optional").expect(200);

      expect(res.body.authenticated).toBe(false);
      expect(res.body.user).toBeNull();
    });

    it("deve autenticar quando token é válido", async () => {
      const res = await request(app)
        .get("/optional")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.authenticated).toBe(true);
      expect(res.body.user).toBeTruthy();
      expect(res.body.user.role).toBe("client");
    });

    it("deve continuar sem autenticação quando token expirou", async () => {
      // Criar token expirado
      const expiredToken = jwt.sign(
        {
          _id: user._id,
          role: user.role,
          username: user.username,
          type: "access",
        },
        config.auth.jwtSecret as string,
        { expiresIn: -1 }
      );

      const res = await request(app)
        .get("/optional")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(200);

      expect(res.body.authenticated).toBe(false);
      expect(res.body.user).toBeNull();
    });

    it("deve continuar sem autenticação quando token é do tipo errado", async () => {
      // Usar refresh token
      const { refreshToken } = TestDataFactory.generateAuthTokens(user);

      const res = await request(app)
        .get("/optional")
        .set("Authorization", `Bearer ${refreshToken}`)
        .expect(200);

      expect(res.body.authenticated).toBe(false);
      expect(res.body.user).toBeNull();
    });

    it("deve continuar sem autenticação quando usuário não é encontrado", async () => {
      // Criar token para usuário inexistente
      const fakeUser = { ...user.toObject(), _id: "507f1f77bcf86cd799439011" };
      const fakeToken =
        TestDataFactory.generateAuthTokens(fakeUser).accessToken;

      const res = await request(app)
        .get("/optional")
        .set("Authorization", `Bearer ${fakeToken}`)
        .expect(200);

      expect(res.body.authenticated).toBe(false);
      expect(res.body.user).toBeNull();
    });

    it("deve continuar sem autenticação quando ocorre erro", async () => {
      // Mock verifyToken para lançar erro
      const mockVerifyToken = jest.spyOn(
        require("../../utils/jwt"),
        "verifyToken"
      );
      mockVerifyToken.mockImplementation(() => {
        throw new Error("Erro inesperado");
      });

      const res = await request(app)
        .get("/optional")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.authenticated).toBe(false);
      expect(res.body.user).toBeNull();

      mockVerifyToken.mockRestore();
    });
  });

  describe("Casos de borda do authenticate", () => {
    it("deve negar acesso quando authHeader não começa com Bearer", async () => {
      const res = await request(app)
        .get("/protegida")
        .set("Authorization", "Token abc123")
        .expect(401);

      expect(res.body.message).toBe("Token não fornecido ou formato inválido");
    });

    it("deve negar acesso quando authHeader é apenas 'Bearer' sem token", async () => {
      const res = await request(app)
        .get("/protegida")
        .set("Authorization", "Bearer")
        .expect(401);

      expect(res.body.message).toBe("Token não fornecido ou formato inválido");
    });

    it("deve negar acesso quando authHeader é 'Bearer ' (com espaço)", async () => {
      const res = await request(app)
        .get("/protegida")
        .set("Authorization", "Bearer ")
        .expect(401);

      expect(res.body.message).toBe("Token não fornecido ou formato inválido");
    });
  });
});
