import request from "supertest";
import express from "express";
import { authenticate } from "../../middlewares/auth";
import { generateTokenPair } from "../../utils/jwt";
import { getUserModel } from "../../models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const app = express();
app.use(express.json());
app.get("/protegida", authenticate, (req, res) => {
  res.json({ ok: true, user: req.user });
});

describe("Middleware de autenticação", () => {
  let user: any;
  let accessToken: string;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/test-auth"
    );
  });

  beforeEach(async () => {
    await getUserModel().deleteMany({});
    user = await getUserModel().create({
      name: "Auth Test",
      email: "auth@x.com",
      username: "authuser",
      password: "Senha123!",
    });
    ({ accessToken } = generateTokenPair(user));
  });

  afterAll(async () => {
    await getUserModel().deleteMany({});
    await mongoose.connection.close();
  });

  it("deve negar acesso sem token", async () => {
    const res = await request(app).get("/protegida");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token expirado", async () => {
    // Gera token expirado manualmente
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
      .get("/protegida")
      .set("Authorization", `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token inválido", async () => {
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", "Bearer tokeninvalido");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token de tipo errado", async () => {
    // Gera refresh token
    const { refreshToken } = generateTokenPair(user);
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${refreshToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso se usuário não encontrado", async () => {
    // Gera token para usuário inexistente
    const fakeUser = { ...user.toObject(), _id: new mongoose.Types.ObjectId() };
    const fakeToken = generateTokenPair(fakeUser).accessToken;
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${fakeToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve permitir acesso com token válido", async () => {
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("user");
  });

  it("deve negar acesso com prefixo de token errado", async () => {
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Token ${accessToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token vazio após Bearer", async () => {
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", "Bearer ");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token válido mas sem _id no payload", async () => {
    // Gera token sem _id
    const badToken = jwt.sign(
      {
        role: user.role,
        username: user.username,
        type: "access",
      },
      config.auth.jwtSecret as string,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token válido mas sem role no payload", async () => {
    // Gera token sem role
    const badToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        type: "access",
      },
      config.auth.jwtSecret as string,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token válido mas sem username no payload", async () => {
    // Gera token sem username
    const badToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        type: "access",
      },
      config.auth.jwtSecret as string,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token válido mas sem type no payload", async () => {
    // Gera token sem type
    const badToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
      },
      config.auth.jwtSecret as string,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso com token válido mas type inesperado no payload", async () => {
    // Gera token com type inesperado
    const badToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
        type: "foo",
      },
      config.auth.jwtSecret as string,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("deve negar acesso se ocorrer erro ao buscar usuário no banco", async () => {
    const userModel = getUserModel();
    const spy = jest.spyOn(userModel, "findById").mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await request(app)
      .get("/protegida")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });
});
