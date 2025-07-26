import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import User from "../../models/User";
import RefreshToken from "../../models/RefreshToken";
import { TestDataFactory, TestCleanup } from "../helpers";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Controller - Testes Adicionais", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe("POST /auth/register - Validações adicionais", () => {
    it("deve rejeitar registro com nome muito curto", async () => {
      const invalidData = {
        name: "A", // Muito curto
        email: "test@example.com",
        username: "testuser",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain(
        "O nome deve ter no mínimo 2 caracteres"
      );
    });

    it("deve rejeitar registro com email em formato inválido", async () => {
      const invalidData = {
        name: "Test User",
        email: "invalid-email",
        username: "testuser",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar registro com username muito curto", async () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        username: "ab", // Muito curto
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar registro com senha fraca", async () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "123", // Senha fraca
        confirmPassword: "123",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar registro com senhas não coincidentes", async () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "Password123!",
        confirmPassword: "DifferentPassword123!",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("As senhas não coincidem");
    });

    it("deve tratar erro inesperado durante registro", async () => {
      // Mock User.create para lançar erro
      const spy = jest.spyOn(User, "create").mockImplementation(() => {
        throw new Error("Database error");
      });

      const validData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      const res = await request(app)
        .post("/auth/register")
        .send(validData)
        .expect(500);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("POST /auth/login - Casos de erro específicos", () => {
    it("deve rejeitar login com dados incompletos", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: "testuser" }) // Sem senha
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar login com senha incorreta", async () => {
      const user = await TestDataFactory.createUser({
        username: "testuser",
        password: "CorrectPassword123!",
      });

      const res = await request(app)
        .post("/auth/login")
        .send({
          username: "testuser",
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(res.body).toHaveProperty("message");
    });

    it("deve tratar erro inesperado durante login", async () => {
      // Mock User.findOne para lançar erro
      const spy = jest.spyOn(User, "findOne").mockImplementation(() => {
        throw new Error("Database error");
      });

      const res = await request(app)
        .post("/auth/login")
        .send({
          username: "testuser",
          password: "Password123!",
        })
        .expect(500);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("POST /auth/refresh - Casos de erro específicos", () => {
    it("deve rejeitar refresh com token inválido", async () => {
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: "invalid-token" })
        .expect(401);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar refresh com token expirado", async () => {
      const user = await TestDataFactory.createUser();

      // Criar token expirado
      const expiredToken = jwt.sign(
        {
          _id: user._id,
          type: "refresh",
        },
        config.auth.jwtSecret as string,
        { expiresIn: -1 }
      );

      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: expiredToken })
        .expect(401);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar refresh com token revogado", async () => {
      const user = await TestDataFactory.createUser();
      const { refreshToken } = TestDataFactory.generateAuthTokens(user);

      // Criar token no banco como revogado
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 100000),
        isRevoked: true,
      });

      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(401);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar refresh quando usuário não existe", async () => {
      // Criar token para usuário inexistente
      const fakeUserId = "507f1f77bcf86cd799439011";
      const fakeToken = jwt.sign(
        {
          _id: fakeUserId,
          type: "refresh",
        },
        config.auth.jwtSecret as string,
        { expiresIn: "7d" }
      );

      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: fakeToken })
        .expect(401);

      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/logout - Casos de erro específicos", () => {
    it("deve tratar erro inesperado durante logout", async () => {
      const user = await TestDataFactory.createUser();
      const { accessToken, refreshToken } =
        TestDataFactory.generateAuthTokens(user);

      // Mock RefreshToken.findOneAndUpdate para lançar erro
      const spy = jest
        .spyOn(RefreshToken, "findOneAndUpdate")
        .mockImplementation(() => {
          throw new Error("Database error");
        });

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(500);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("POST /auth/logout-all - Casos de erro específicos", () => {
    it("deve tratar erro inesperado durante logout-all", async () => {
      const user = await TestDataFactory.createUser();
      const { accessToken } = TestDataFactory.generateAuthTokens(user);

      // Mock RefreshToken.updateMany para lançar erro
      const spy = jest
        .spyOn(RefreshToken, "updateMany")
        .mockImplementation(() => {
          throw new Error("Database error");
        });

      const res = await request(app)
        .post("/auth/logout-all")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({})
        .expect(500);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("GET /auth/me - Casos de erro específicos", () => {
    it("deve tratar erro inesperado ao buscar usuário atual", async () => {
      const user = await TestDataFactory.createUser();
      const { accessToken } = TestDataFactory.generateAuthTokens(user);

      // Mock User.findById para lançar erro
      const spy = jest.spyOn(User, "findById").mockImplementation(() => {
        return Promise.reject(new Error("Database error"));
      });

      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(401);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("POST /auth/forgot-password - Casos de erro específicos", () => {
    it("deve rejeitar solicitação com email inválido", async () => {
      const res = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "invalid-email" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve tratar erro inesperado durante forgot-password", async () => {
      // Mock User.findOne para lançar erro
      const spy = jest.spyOn(User, "findOne").mockImplementation(() => {
        throw new Error("Database error");
      });

      const res = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "test@example.com" })
        .expect(500);

      expect(res.body).toHaveProperty("message");
      spy.mockRestore();
    });
  });

  describe("POST /auth/reset-password - Casos de erro específicos", () => {
    it("deve rejeitar reset com token inválido", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .send({
          token: "invalid-token",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        })
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar reset com senhas não coincidentes", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .send({
          token: "valid-token",
          newPassword: "NewPassword123!",
          confirmPassword: "DifferentPassword123!",
        })
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });

    it("deve rejeitar reset com senha fraca", async () => {
      const res = await request(app)
        .post("/auth/reset-password")
        .send({
          token: "valid-token",
          newPassword: "123",
          confirmPassword: "123",
        })
        .expect(400);

      expect(res.body).toHaveProperty("message");
    });
  });
});
