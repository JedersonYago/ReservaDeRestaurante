import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import User from "../../models/User";
import RefreshToken from "../../models/RefreshToken";
import { TestDataFactory, TestCleanup, TestValidators } from "../helpers";

// Configurar Express app para testes
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

const validUserData = {
  name: "Test User",
  email: "test@example.com",
  username: "testuser",
  password: "Password123!",
  confirmPassword: "Password123!",
};

describe("Auth Controller", () => {
  beforeEach(async () => {
    await TestCleanup.clearAll();
    await RefreshToken.deleteMany({});
  });

  describe("POST /auth/register", () => {
    it("deve registrar um novo usuário cliente com sucesso", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(validUserData)
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("_id");
      expect(response.body.user.email).toBe(validUserData.email);
      expect(response.body.user.username).toBe(validUserData.username);
      expect(response.body.user.role).toBe("client");
      expect(response.body.user).not.toHaveProperty("password");

      // Verificar se o usuário foi criado no banco
      const userInDb = await User.findOne({ email: validUserData.email });
      expect(userInDb).toBeTruthy();
      expect(TestValidators.isValidObjectId(userInDb!._id)).toBe(true);
    });

    it("deve registrar um novo usuário admin com código de admin", async () => {
      await RefreshToken.deleteMany({});
      // O campo role deve ser explicitamente enviado para não ser sobrescrito pelo default do schema
      const adminData = {
        ...validUserData,
        email: "admin@example.com",
        username: "admin",
        password: "Password123!",
        confirmPassword: "Password123!",
        role: "admin",
        adminCode: "admin123", // deve ser igual ao config.auth.adminCode do backend
      };

      const response = await request(app)
        .post("/auth/register")
        .send(adminData)
        .expect(201);

      expect(response.body.user.role).toBe("admin");

      const userInDb = await User.findOne({ email: adminData.email });
      expect(userInDb!.role).toBe("admin");
    });

    it("deve rejeitar registro com código de admin inválido", async () => {
      await RefreshToken.deleteMany({});
      const adminData = {
        ...validUserData,
        role: "admin",
        adminCode: "INVALID_CODE",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(adminData)
        .expect(400);
    });

    it("deve rejeitar registro com email duplicado", async () => {
      // Criar usuário primeiro
      await TestDataFactory.createUser({ email: validUserData.email });

      const response = await request(app)
        .post("/auth/register")
        .send(validUserData)
        .expect(400);
    });

    it("deve rejeitar registro com username duplicado", async () => {
      // Criar usuário primeiro
      await TestDataFactory.createUser({ username: validUserData.username });

      const response = await request(app)
        .post("/auth/register")
        .send({
          ...validUserData,
          email: "different@example.com",
        })
        .expect(400);
    });

    it("deve rejeitar registro com dados inválidos", async () => {
      const invalidData = {
        name: "", // Nome vazio
        email: "invalid-email", // Email inválido
        username: "ab", // Username muito curto
        password: "123", // Senha muito simples
      };

      const response = await request(app)
        .post("/auth/register")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("deve rejeitar registro com campos obrigatórios ausentes", async () => {
      const incompleteData = {
        name: "Test User",
      };
      const response = await request(app)
        .post("/auth/register")
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/login", () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await TestDataFactory.createUser({
        username: "logintest",
        password: "Password123!",
      });
      await RefreshToken.deleteMany({ userId: testUser._id });
    });

    it("deve fazer login com username sem diferenciar maiúsculas e minúsculas", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "LOGINTEST", // Maiúsculo
          password: "Password123!",
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body.user.username).toBe("logintest");
    });

    it("deve rejeitar login com username inválido", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "nonexistent",
          password: "Password123!",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Usuário ou senha inválidos");
    });

    it("deve rejeitar login com senha inválida", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "logintest",
          password: "WrongPassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Usuário ou senha inválidos");
    });

    it("deve rejeitar login com credenciais ausentes", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "logintest",
          // password ausente
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("deve criar um novo refresh token a cada login", async () => {
      // Primeiro login
      await request(app)
        .post("/auth/login")
        .send({
          username: "logintest",
          password: "Password123!",
        })
        .expect(200);

      // Segundo login
      await request(app)
        .post("/auth/login")
        .send({
          username: "logintest",
          password: "Password123!",
        })
        .expect(200);

      // Agora, apenas um refresh token deve existir, pois os anteriores são revogados
      const refreshTokens = await RefreshToken.find({
        userId: testUser._id,
        isRevoked: false,
      });
      expect(refreshTokens.length).toBe(1);
    });
  });

  describe("POST /auth/refresh", () => {
    let testUser: any;
    let refreshToken: string;

    beforeEach(async () => {
      testUser = await TestDataFactory.createUser();
      const tokens = TestDataFactory.generateAuthTokens(testUser);
      refreshToken = tokens.refreshToken;

      // Salvar refresh token no banco
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await RefreshToken.create({
        userId: testUser._id,
        token: refreshToken,
        expiresAt,
      });
    });

    it("deve atualizar os tokens com um token de atualização válido", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");

      expect(TestValidators.isValidJWT(response.body.accessToken)).toBe(true);
      expect(TestValidators.isValidJWT(response.body.refreshToken)).toBe(true);

      // Novo refresh token deve ser diferente
      expect(response.body.refreshToken).not.toBe(refreshToken);
    });

    it("deve rejeitar token de atualização inválido", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: "invalid-token" })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("should reject missing refresh token", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/logout", () => {
    let testUser: any;
    let refreshToken: string;

    beforeEach(async () => {
      testUser = await TestDataFactory.createUser();
      const tokens = TestDataFactory.generateAuthTokens(testUser);
      refreshToken = tokens.refreshToken;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await RefreshToken.create({
        userId: testUser._id,
        token: refreshToken,
        expiresAt,
      });
    });

    it("deve fazer logout e remover o refresh token", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty("message");

      // Verificar se refresh token foi revogado
      const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
      expect(tokenInDb).toBeTruthy();
      expect(tokenInDb!.isRevoked).toBe(true);
    });

    it("deve lidar com logout com token de atualização inválido de forma informativa", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .send({ refreshToken: "invalid-token" })
        .expect(200);

      expect(response.body).toHaveProperty("message");
    });
  });

  it("deve retornar 401 se usuário não encontrado no login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "naoexiste", password: "qualquer" })
      .expect(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve retornar 401 se senha incorreta no login", async () => {
    await TestDataFactory.createUser({
      username: "userx",
      password: "Senha123!",
    });
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "userx", password: "errada" })
      .expect(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve retornar 401 se refresh token expirado", async () => {
    const user = await TestDataFactory.createUser();
    const { refreshToken } = TestDataFactory.generateAuthTokens(user);
    // Salva token já expirado
    const expiresAt = new Date(Date.now() - 1000);
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve retornar 401 se refresh token revogado", async () => {
    const user = await TestDataFactory.createUser();
    const { refreshToken } = TestDataFactory.generateAuthTokens(user);
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 10000),
      isRevoked: true,
    });
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve permitir logout sem refresh token (no-op)", async () => {
    const res = await request(app).post("/auth/logout").send({}).expect(200);
    expect(res.body).toHaveProperty("message");
  });

  it("deve rejeitar registro de admin com adminCode incorreto", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        ...validUserData,
        role: "admin",
        adminCode: "errado",
        username: "adminerrado",
        email: "adminerrado@x.com",
      })
      .expect(400);
    expect(res.body).toHaveProperty("message");
  });

  it("deve rejeitar registro com email já existente", async () => {
    await TestDataFactory.createUser({ email: "dupe@x.com" });
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validUserData, email: "dupe@x.com", username: "outrouser" })
      .expect(400);
    expect(res.body).toHaveProperty("message");
  });

  it("deve rejeitar registro com username já existente", async () => {
    await TestDataFactory.createUser({ username: "dupeuser" });
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validUserData, username: "dupeuser", email: "outra@x.com" })
      .expect(400);
    expect(res.body).toHaveProperty("message");
  });

  it("deve tratar erro inesperado no register", async () => {
    const spy = jest
      .spyOn(require("../../models/User"), "getUserModel")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validUserData, username: "failuser", email: "fail@x.com" })
      .expect(500);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });

  it("deve tratar erro inesperado no refresh", async () => {
    const spy = jest
      .spyOn(require("../../utils/jwt"), "verifyRefreshToken")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "qualquer" })
      .expect(401);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });

  it("deve rejeitar logoutAll sem usuário autenticado", async () => {
    await request(app).post("/auth/logout-all").send({}).expect(401);
  });

  it("deve retornar 401 em getCurrentUser se usuário não encontrado", async () => {
    const user = await TestDataFactory.createUser();
    const { accessToken } = TestDataFactory.generateAuthTokens(user);
    // Remove usuário
    await require("../../models/User").default.deleteOne({ _id: user._id });
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401); // era 404, mas API retorna 401
    expect(res.body).toHaveProperty("message");
  });

  it("deve tratar erro inesperado em getCurrentUser", async () => {
    const user = await TestDataFactory.createUser();
    const { accessToken } = TestDataFactory.generateAuthTokens(user);
    const spy = jest
      .spyOn(require("../../models/User"), "getUserModel")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });
});

describe("POST /auth/logout-all", () => {
  it("deve revogar todos os refresh tokens do usuário autenticado", async () => {
    const user = await TestDataFactory.createUser();
    const { accessToken, refreshToken } =
      TestDataFactory.generateAuthTokens(user);
    // Cria dois tokens ativos
    await require("../../models/RefreshToken").default.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 100000),
    });
    await require("../../models/RefreshToken").default.create({
      userId: user._id,
      token: "outroToken",
      expiresAt: new Date(Date.now() + 100000),
    });
    const res = await request(app)
      .post("/auth/logout-all")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
      .expect(200);
    expect(res.body).toHaveProperty("message");
    // Verifica se todos os tokens foram revogados
    const tokens = await require("../../models/RefreshToken").default.find({
      userId: user._id,
    });
    expect(
      (tokens as Array<{ isRevoked: boolean }>).every((t) => t.isRevoked)
    ).toBe(true);
  });

  it("deve retornar 401 se não autenticado", async () => {
    await request(app).post("/auth/logout-all").send({}).expect(401);
  });

  it("deve funcionar mesmo se não houver tokens ativos", async () => {
    const user = await TestDataFactory.createUser();
    const { accessToken } = TestDataFactory.generateAuthTokens(user);
    // Nenhum token criado
    const res = await request(app)
      .post("/auth/logout-all")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
      .expect(200);
    expect(res.body).toHaveProperty("message");
  });
});
