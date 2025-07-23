import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import User from "../../models/User";
import { TestDataFactory, TestCleanup } from "../helpers";
import { emailService } from "../../services/emailService";
import { PasswordReset } from "../../models/PasswordReset";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Recuperação de Senha (RF05)", () => {
  let user: any;
  let resetToken: string;
  let sendMailSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      email: "recupera@teste.com",
      username: "recuperauser",
    });
    // Espiona o envio de e-mail na instância, retornando true para simular sucesso
    sendMailSpy = jest
      .spyOn(emailService, "sendPasswordResetEmail")
      .mockResolvedValue(true);
  });

  afterEach(() => {
    sendMailSpy.mockRestore();
  });

  it("solicitação de recuperação envia e-mail (mock)", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: user.email })
      .expect(200);
    expect(sendMailSpy).toHaveBeenCalledWith(
      user.email,
      expect.any(String),
      user.username
    );
    expect(res.body).toHaveProperty("message");
  });

  it("não vaza se e-mail não existe (resposta genérica)", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "naoexiste@teste.com" })
      .expect(200);
    expect(res.body).toHaveProperty("message");
    expect(sendMailSpy).not.toHaveBeenCalled();
  });

  it("reset com token válido altera senha", async () => {
    // Solicita recuperação para gerar token
    await request(app)
      .post("/auth/forgot-password")
      .send({ email: user.email })
      .expect(200);
    // Busca o token gerado na coleção PasswordReset
    const resetDoc = await PasswordReset.findOne({
      userId: user._id,
      used: false,
    }).sort({ createdAt: -1 });
    expect(resetDoc).toBeTruthy();
    resetToken = resetDoc!.token;
    const res = await request(app)
      .post("/auth/reset-password")
      .send({
        token: resetToken,
        newPassword: "NovaSenha123!",
        confirmPassword: "NovaSenha123!",
      })
      .expect(200);
    expect(res.body).toHaveProperty("message");
    // Senha realmente alterada
    const afterReset = await User.findOne({ email: user.email });
    expect(await afterReset!.comparePassword("NovaSenha123!")).toBe(true);
  });

  it("reset com token inválido retorna erro", async () => {
    const res = await request(app)
      .post("/auth/reset-password")
      .send({
        token: "tokeninvalido",
        newPassword: "NovaSenha123!",
        confirmPassword: "NovaSenha123!",
      })
      .expect(400);
    // O controller retorna { message } para erros
    expect(res.body).toHaveProperty("message");
  });
});
