import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import reservationRoutes from "../../routes/reservationRoutes";
import tableRoutes from "../../routes/tableRoutes";
import { TestCleanup, TestDataFactory } from "../helpers";
import Config from "../../models/Config";
import { Types } from "mongoose";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/reservations", reservationRoutes);
app.use("/tables", tableRoutes);

describe("E2E - Fluxo completo do usuário", () => {
  let userToken: string;
  let userId: string;
  let tableId: string;
  let reservationId: string;
  const userData = {
    name: "Usuário E2E",
    email: "e2euser@example.com",
    username: "e2euser",
    password: "SenhaE2E123!",
    confirmPassword: "SenhaE2E123!",
  };

  beforeEach(async () => {
    await TestCleanup.clearAll();
    // Cria configuração padrão
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
    // Cria uma mesa diretamente no banco
    const table = await TestDataFactory.createTable({
      name: "Mesa E2E",
      capacity: 2,
      availability: [{ date: "2025-07-25", times: ["19:00"] }],
    });
    tableId = table._id.toString();
  });

  it("deve registrar, logar, criar reserva, listar e cancelar", async () => {
    // 1. Registrar usuário
    const registerRes = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(201);
    expect(registerRes.body).toHaveProperty("user");
    userId = registerRes.body.user._id;

    // 2. Login
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: userData.username, password: userData.password })
      .expect(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    userToken = loginRes.body.accessToken;

    // 3. (Mesa já criada no banco)

    // 4. Fazer reserva
    const reservationRes = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        tableId,
        customerName: userData.name,
        customerEmail: userData.email,
        date: "2025-07-25",
        time: "19:00",
      });
    expect(reservationRes.status).toBe(201);
    expect(reservationRes.body).toHaveProperty("_id");
    reservationId = reservationRes.body._id;

    // 5. Listar reservas
    const listRes = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.some((r: any) => r._id === reservationId)).toBe(true);

    // 6. Cancelar reserva
    const cancelRes = await request(app)
      .put(`/reservations/${reservationId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    expect(cancelRes.body).toHaveProperty("status", "cancelled");

    // 7. Listar reservas novamente e verificar status
    const listAfterCancel = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    const cancelled = listAfterCancel.body.find(
      (r: any) => r._id === reservationId
    );
    expect(cancelled).toBeTruthy();
    expect(cancelled.status).toBe("cancelled");
  });
});
