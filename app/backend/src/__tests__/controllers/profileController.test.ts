import request from "supertest";
import express from "express";
import profileRoutes from "../../routes/profileRoutes";
import User from "../../models/User";
import { TestDataFactory, TestCleanup } from "../helpers";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/profile", profileRoutes);

describe("Profile Controller", () => {
  let user: any;
  let token: string;
  let errorSpy: jest.SpyInstance;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("deve obter perfil de usuário", async () => {
    const res = await request(app)
      .get(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty("username", user.username);
    expect(res.body).toHaveProperty("email", user.email);
  });

  it("deve atualizar o perfil do usuário", async () => {
    const res = await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Novo Nome",
        email: "novo@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("name", "Novo Nome");
    expect(res.body.user).toHaveProperty("email", "novo@teste.com");
  });

  it("deve alterar a senha do usuário", async () => {
    const res = await request(app)
      .put(`/profile/${user.username}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Senha123!",
        newPassword: "NovaSenha123!",
        confirmPassword: "NovaSenha123!",
      })
      .expect(200);
    expect(res.body).toHaveProperty("message");
  });

  it("deve excluir a conta do usuário", async () => {
    const res = await request(app)
      .delete(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Senha123!",
        confirmation: "DELETE",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    const deleted = await User.findOne({ username: user.username });
    expect(deleted).toBeNull();
  });

  it("deve rejeitar atualização por outro usuário", async () => {
    const other = await TestDataFactory.createUser({
      username: "outro",
      email: "outro@teste.com",
    });
    const otherToken = TestDataFactory.generateAuthTokens(other).accessToken;
    await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ name: "Hacker" })
      .expect(403);
  });
});

describe("ChangeUsername", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve atualizar o nome de usuário com sucesso", async () => {
    const res = await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novouser", currentPassword: "Senha123!" })
      .expect(200);
    expect(res.body).toHaveProperty("username", "novouser");
  });

  it("deve retornar 400 se o username já existir", async () => {
    await TestDataFactory.createUser({ username: "jaexisteuser" });
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "jaexisteuser", currentPassword: "Senha123!" })
      .expect(400);
  });

  it("deve retornar 403 se tentar alterar o username de outro usuário", async () => {
    const other = await TestDataFactory.createUser({ username: "outro" });
    const otherToken = TestDataFactory.generateAuthTokens(other).accessToken;
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ newUsername: "hacker", currentPassword: "Senha123!" })
      .expect(403);
  });

  it("deve retornar 400 se a senha atual estiver incorreta", async () => {
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novouser", currentPassword: "errada" })
      .expect(400);
  });
});

describe("ChangePassword", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve retornar 403 se tentar alterar a senha de outro usuário", async () => {
    const other = await TestDataFactory.createUser({
      username: "outro",
      password: "SenhaOutro123!",
    });
    const otherToken = TestDataFactory.generateAuthTokens(other).accessToken;
    await request(app)
      .put(`/profile/usuarioteste/password`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({
        currentPassword: "SenhaOutro123!", // senha correta do usuário 'outro'
        newPassword: "NovaSenhaOutro123!",
        confirmPassword: "NovaSenhaOutro123!",
      })
      .expect(403);
  });

  it("deve retornar 401 se o usuário não existir", async () => {
    // Gera um token para um usuário que não existe no banco
    const fakeUser = {
      _id: new mongoose.Types.ObjectId(),
      name: "Fake User",
      email: "fake@fake.com",
      username: "naoexiste",
      password: "SenhaFake123!",
      role: "client",
      emailChanges: { count: 0 },
      usernameChanges: { count: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async () => false,
    };
    const fakeToken = TestDataFactory.generateAuthTokens(
      fakeUser as any
    ).accessToken;
    await request(app)
      .put(`/profile/naoexiste/password`)
      .set("Authorization", `Bearer ${fakeToken}`)
      .send({
        currentPassword: "qualquer",
        newPassword: "NovaSenhaValida123!",
        confirmPassword: "NovaSenhaValida123!",
      })
      .expect(401); // Espera 401 pois o middleware bloqueia antes do controller
  });

  it("deve retornar 400 se a senha atual estiver incorreta", async () => {
    await request(app)
      .put(`/profile/${user.username}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "errada",
        newPassword: "NovaSenha123!",
        confirmPassword: "NovaSenha123!",
      })
      .expect(400);
  });

  it("deve retornar 400 se a nova senha for a mesma que a atual", async () => {
    await request(app)
      .put(`/profile/${user.username}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Senha123!",
        newPassword: "Senha123!",
        confirmPassword: "Senha123!",
      })
      .expect(400);
  });

  it("deve retornar 500 se ocorrer um erro inesperado", async () => {
    // Simula erro em user.save()
    const spy = jest.spyOn(User.prototype, "save").mockImplementation(() => {
      throw new Error("fail");
    });
    await request(app)
      .put(`/profile/${user.username}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Senha123!",
        newPassword: "SenhaDiferente123!",
        confirmPassword: "SenhaDiferente123!",
      })
      .expect(500);
    spy.mockRestore();
  });
});

describe("Limite de alteração de email", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve bloquear alteração de email após 2 mudanças em 30 dias", async () => {
    // Primeira mudança
    await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo1@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    // Segunda mudança
    await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo2@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    // Terceira tentativa (deve bloquear)
    const res = await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo3@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      /limite de mudanças de email|tente novamente em/i
    );
  });
});

describe("Reset do contador de mudanças de email", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve permitir nova alteração de email após 30 dias do último bloqueio", async () => {
    // Primeira mudança
    await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo1@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    // Segunda mudança
    await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo2@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    // Simula passagem de 31 dias
    const userDoc = await User.findOne({ username: user.username });
    userDoc!.emailChanges.lastChangeAt = new Date(
      Date.now() - 31 * 24 * 60 * 60 * 1000
    );
    userDoc!.emailChanges.count = 2;
    await userDoc!.save();
    // Agora deve permitir nova alteração
    const res = await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "novo3@teste.com",
        currentPassword: "Senha123!",
      })
      .expect(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "novo3@teste.com");
  });
});

describe("bloqueio de alteração de username", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve bloquear alteração de username após 2 mudanças em 30 dias", async () => {
    // Primeira mudança
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo1", currentPassword: "Senha123!" })
      .expect(200);
    // Segunda mudança
    await request(app)
      .put(`/profile/novo1/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo2", currentPassword: "Senha123!" })
      .expect(200);
    // Terceira tentativa (deve bloquear)
    const res = await request(app)
      .put(`/profile/novo2/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo3", currentPassword: "Senha123!" })
      .expect(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      /limite de mudanças de nome de usuário|tente novamente em/i
    );
  });
});

describe("reset do contador de mudanças de username", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve permitir nova alteração de username após 30 dias do último bloqueio", async () => {
    // Primeira mudança
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo1", currentPassword: "Senha123!" })
      .expect(200);
    // Segunda mudança
    await request(app)
      .put(`/profile/novo1/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo2", currentPassword: "Senha123!" })
      .expect(200);
    // Simula passagem de 31 dias
    const userDoc = await User.findOne({ username: "novo2" });
    userDoc!.usernameChanges.lastChangeAt = new Date(
      Date.now() - 31 * 24 * 60 * 60 * 1000
    );
    userDoc!.usernameChanges.count = 2;
    await userDoc!.save();
    // Agora deve permitir nova alteração
    const res = await request(app)
      .put(`/profile/novo2/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo3", currentPassword: "Senha123!" })
      .expect(200);
    expect(res.body).toHaveProperty("username", "novo3");
  });
});

describe("username já existente com bloqueio", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve exibir mensagem de bloqueio ao tentar alterar para username já existente enquanto bloqueado", async () => {
    // Cria outro usuário com username de destino
    await TestDataFactory.createUser({ username: "jaexisteuser" });
    // Primeira mudança
    await request(app)
      .put(`/profile/${user.username}/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo1", currentPassword: "Senha123!" })
      .expect(200);
    // Segunda mudança
    await request(app)
      .put(`/profile/novo1/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "novo2", currentPassword: "Senha123!" })
      .expect(200);
    // Terceira tentativa para username já existente (deve prevalecer o bloqueio)
    const res = await request(app)
      .put(`/profile/novo2/change-username`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newUsername: "jaexisteuser", currentPassword: "Senha123!" })
      .expect(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      /limite de mudanças de nome de usuário|tente novamente em/i
    );
  });
});

describe("erro inesperado ao atualizar perfil", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve retornar 500 se ocorrer erro inesperado ao atualizar perfil", async () => {
    const spy = jest.spyOn(User.prototype, "save").mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await request(app)
      .put(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Novo Nome",
        currentPassword: "Senha123!",
      })
      .expect(500);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });
});

describe("erro inesperado ao deletar conta", () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: "Usuário Teste",
      email: "teste@teste.com",
      username: "usuarioteste",
      password: "Senha123!",
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it("deve retornar 500 se ocorrer erro inesperado ao deletar conta", async () => {
    const spy = jest.spyOn(User, "findByIdAndDelete").mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await request(app)
      .delete(`/profile/${user.username}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Senha123!",
        confirmation: "DELETE",
      })
      .expect(500);
    expect(res.body).toHaveProperty("message");
    spy.mockRestore();
  });
});
