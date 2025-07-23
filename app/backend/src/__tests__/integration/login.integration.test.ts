import { createApp } from "../../app";
import User from "../../models/User";

let app: any;
const testUser = {
  name: "Usuário Teste",
  email: "login@example.com",
  username: "logintest",
  password: "SenhaForte123!",
  confirmPassword: "SenhaForte123!",
  role: "client",
};

beforeAll(async () => {
  // Limpa o usuário de teste antes de tudo
  await User.deleteMany({ email: testUser.email });
  app = createApp();
});

// afterAll removido, limpeza já é feita globalmente

describe("Integração - Login", () => {
  it("deve registrar e autenticar um usuário, retornando JWT", async () => {
    const supertest = require("supertest");
    const req = supertest(app);

    // Registrar usuário
    const registerRes = await req.post("/api/auth/register").send(testUser);
    expect(registerRes.status).toBe(201);

    // Login
    const loginRes = await req.post("/api/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    expect(loginRes.body).toHaveProperty("refreshToken");
    expect(typeof loginRes.body.accessToken).toBe("string");
    expect(typeof loginRes.body.refreshToken).toBe("string");
  });

  it("deve falhar ao autenticar com senha incorreta", async () => {
    const supertest = require("supertest");
    const req = supertest(app);

    const loginRes = await req.post("/api/auth/login").send({
      username: testUser.username,
      password: "SenhaErrada123!",
    });

    expect(loginRes.status).toBe(401); // ou 400, conforme sua API
    expect(loginRes.body).not.toHaveProperty("accessToken");
    expect(loginRes.body).not.toHaveProperty("refreshToken");
  });

  it("deve falhar ao autenticar usuário inexistente", async () => {
    const supertest = require("supertest");
    const req = supertest(app);

    const loginRes = await req.post("/api/auth/login").send({
      username: "usuarioinexistente",
      password: "SenhaForte123!",
    });

    expect(loginRes.status).toBe(401); // ou 400, conforme sua API
    expect(loginRes.body).not.toHaveProperty("accessToken");
    expect(loginRes.body).not.toHaveProperty("refreshToken");
  });

  it("deve falhar ao autenticar com campos obrigatórios faltando", async () => {
    const supertest = require("supertest");
    const req = supertest(app);

    const loginRes = await req.post("/api/auth/login").send({
      username: testUser.username,
      // password ausente
    });

    expect(loginRes.status).toBe(400); // ou 422, conforme sua API
    expect(loginRes.body).not.toHaveProperty("accessToken");
    expect(loginRes.body).not.toHaveProperty("refreshToken");
  });
});
