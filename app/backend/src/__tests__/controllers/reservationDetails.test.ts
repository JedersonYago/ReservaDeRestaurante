import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import Reservation from "../../models/Reservation";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/reservations", reservationRoutes);

describe("Detalhes da Reserva (RF09, RF10)", () => {
  let admin: any;
  let adminToken: string;
  let user: any;
  let userToken: string;
  let otherUser: any;
  let otherToken: string;
  let reservation: any;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    admin = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@admin.com",
      username: "admin",
    });
    adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    user = await TestDataFactory.createUser();
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    otherUser = await TestDataFactory.createUser({
      email: "other@teste.com",
      username: "otheruser",
    });
    otherToken = TestDataFactory.generateAuthTokens(otherUser).accessToken;
    reservation = await Reservation.create({
      tableId: (await TestDataFactory.createTable())._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "19:00",
      status: "pending",
      userId: user._id,
    });
  });

  it("cliente pode ver detalhes da própria reserva", async () => {
    const res = await request(app)
      .get(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", reservation._id.toString());
    expect(res.body).toHaveProperty("customerName", "Cliente Teste");
  });

  it("admin pode ver detalhes de qualquer reserva", async () => {
    const res = await request(app)
      .get(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", reservation._id.toString());
    expect(res.body).toHaveProperty("customerName", "Cliente Teste");
  });

  it("reserva inexistente retorna 404", async () => {
    await request(app)
      .get("/reservations/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });

  it("cliente não pode acessar reserva de outro usuário (403)", async () => {
    await request(app)
      .get(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403);
  });
});
