import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import Reservation from "../../models/Reservation";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/reservations", reservationRoutes);

describe("Confirmar Reserva (RF11, TI03)", () => {
  let admin: any;
  let adminToken: string;
  let user: any;
  let userToken: string;
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

  it("admin deve confirmar reserva pendente com sucesso", async () => {
    const res = await request(app)
      .put(`/reservations/${reservation._id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", reservation._id.toString());
    expect(res.body).toHaveProperty("status", "confirmed");
    const updated = await Reservation.findById(reservation._id);
    expect(updated!.status).toBe("confirmed");
  });

  it("cliente não pode confirmar reserva (403)", async () => {
    await request(app)
      .put(`/reservations/${reservation._id}/confirm`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
    const notConfirmed = await Reservation.findById(reservation._id);
    expect(notConfirmed!.status).toBe("pending");
  });

  it("reserva já confirmada não pode ser confirmada novamente", async () => {
    // Confirma a reserva
    await request(app)
      .put(`/reservations/${reservation._id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    // Tenta confirmar novamente
    const res = await request(app)
      .put(`/reservations/${reservation._id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);
    expect(res.body).toHaveProperty("error");
    const updated = await Reservation.findById(reservation._id);
    expect(updated!.status).toBe("confirmed");
  });

  it("reserva inexistente retorna 404", async () => {
    await request(app)
      .put("/reservations/000000000000000000000000/confirm")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });
});
