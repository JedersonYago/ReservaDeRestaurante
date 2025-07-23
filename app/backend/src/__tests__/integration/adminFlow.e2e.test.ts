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

describe("E2E - Fluxo Administrativo", () => {
  let adminToken: string;
  let userToken: string;
  let tableId: string;
  let reservationId: string;
  const adminData = {
    name: "Admin E2E",
    email: "admin.e2e@example.com",
    username: "admine2e",
    password: "SenhaAdminE2E123!",
    confirmPassword: "SenhaAdminE2E123!",
    role: "admin",
    adminCode: "admin123", // ajuste conforme seu config real
  };
  const userData = {
    name: "Usuário E2E",
    email: "usere2e@example.com",
    username: "usere2e",
    password: "SenhaUserE2E123!",
    confirmPassword: "SenhaUserE2E123!",
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
  });

  it("deve permitir fluxo admin completo", async () => {
    // 1. Admin registra e faz login
    const registerAdmin = await request(app)
      .post("/auth/register")
      .send(adminData)
      .expect(201);
    const loginAdmin = await request(app)
      .post("/auth/login")
      .send({ username: adminData.username, password: adminData.password })
      .expect(200);
    adminToken = loginAdmin.body.accessToken;

    // 2. Admin cadastra uma nova mesa
    const tableRes = await request(app)
      .post("/tables")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Mesa Admin E2E",
        capacity: 4,
        availability: [{ date: "2025-07-25", times: ["20:00-21:00"] }],
      });
    expect(tableRes.status).toBe(201);
    tableId = tableRes.body._id;

    // 3. Usuário comum registra, loga e faz reserva
    await request(app).post("/auth/register").send(userData).expect(201);
    const loginUser = await request(app)
      .post("/auth/login")
      .send({ username: userData.username, password: userData.password })
      .expect(200);
    userToken = loginUser.body.accessToken;
    const reservationRes = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        tableId,
        customerName: userData.name,
        customerEmail: userData.email,
        date: "2025-07-25",
        time: "20:00",
      })
      .expect(201);
    reservationId = reservationRes.body._id;

    // 4. Admin confirma a reserva
    const confirmRes = await request(app)
      .put(`/reservations/${reservationId}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(confirmRes.body).toHaveProperty("status", "confirmed");

    // 5. Admin edita a mesa
    const editRes = await request(app)
      .put(`/tables/${tableId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Mesa Admin E2E Editada",
        capacity: 6,
        availability: [{ date: "2025-07-26", times: ["21:00-22:00"] }],
      })
      .expect(200);
    expect(editRes.body).toHaveProperty("name", "Mesa Admin E2E Editada");
    expect(editRes.body).toHaveProperty("capacity", 6);

    // 6. Admin exclui a mesa
    await request(app)
      .delete(`/tables/${tableId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204);

    // 7. Admin lista todas as reservas e vê detalhes
    const listRes = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.some((r: any) => r._id === reservationId)).toBe(true);
    const detailsRes = await request(app)
      .get(`/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(detailsRes.body).toHaveProperty("_id", reservationId);
    expect(detailsRes.body).toHaveProperty("status", "cancelled");
  });
});
