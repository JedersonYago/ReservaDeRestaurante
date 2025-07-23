import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import { TestCleanup, TestDataFactory } from "../helpers";
import { PasswordReset } from "../../models/PasswordReset";
import Config from "../../models/Config";
import { Types } from "mongoose";
import { emailService } from "../../services/emailService";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("E2E - Recuperação de Senha", () => {
  let user: any;
  let sendMailSpy: jest.SpyInstance;
  const userData = {
    name: "Usuário Recuperação",
    email: "recupera.e2e@example.com",
    username: "recuperae2e",
    password: "SenhaRecE2E123!",
    confirmPassword: "SenhaRecE2E123!",
  };

  beforeEach(async () => {
    await TestCleanup.clearAll();
    await Config.create({
      maxReservationsPerUser: 5,
      reservationLimitHours: 24,
      minIntervalBetweenReservations: 10,
      openingHour: "11:00",
      closingHour: "23:00",
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true,
      updatedBy: new Types.ObjectId(),
    });
    user = await TestDataFactory.createUser(userData);
    sendMailSpy = jest
      .spyOn(emailService, "sendPasswordResetEmail")
      .mockResolvedValue(true);
  });

  afterEach(() => {
    sendMailSpy.mockRestore();
  });

  it("deve recuperar senha e permitir login com nova senha", async () => {
    // 1. Solicita recuperação de senha
    const forgotRes = await request(app)
      .post("/auth/forgot-password")
      .send({ email: user.email })
      .expect(200);
    expect(forgotRes.body).toHaveProperty("message");
    expect(sendMailSpy).toHaveBeenCalled();

    // 2. Recupera o token gerado
    const resetDoc = await PasswordReset.findOne({
      userId: user._id,
      used: false,
    }).sort({ createdAt: -1 });
    expect(resetDoc).toBeTruthy();
    const resetToken = resetDoc!.token;

    // 3. Faz o reset de senha
    const newPassword = "NovaSenhaE2E123!";
    const resetRes = await request(app)
      .post("/auth/reset-password")
      .send({ token: resetToken, newPassword, confirmPassword: newPassword })
      .expect(200);
    expect(resetRes.body).toHaveProperty("message");

    // 4. Consegue logar com a nova senha
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: user.username, password: newPassword })
      .expect(200);
    expect(loginRes.body).toHaveProperty("accessToken");

    // 5. Token não pode ser reutilizado
    await request(app)
      .post("/auth/reset-password")
      .send({
        token: resetToken,
        newPassword: "OutraSenha123!",
        confirmPassword: "OutraSenha123!",
      })
      .expect(400);
  });
});
