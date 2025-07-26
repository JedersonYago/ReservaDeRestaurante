import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import Reservation from "../../models/Reservation";
import { TestDataFactory, TestCleanup } from "../helpers";

describe("Excluir Reserva Permanentemente (RF14)", () => {
  const app = express();
  app.use(express.json());
  app.use("/reservations", reservationRoutes);

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
    const table = await TestDataFactory.createTable();
    reservation = await Reservation.create({
      tableId: table._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "19:00",
      status: "pending",
      userId: user._id,
    });
  });

  it("admin deve excluir reserva permanentemente", async () => {
    await request(app)
      .delete(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204);
    const deleted = await Reservation.findById(reservation._id);
    expect(deleted).toBeNull();
  });

  it("cliente não pode excluir reserva de outro usuário", async () => {
    await request(app)
      .delete(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
    const stillExists = await Reservation.findById(reservation._id);
    expect(stillExists).not.toBeNull();
  });

  it("deve retornar 404 ao tentar deletar uma reserva inexistente", async () => {
    await request(app)
      .delete("/reservations/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao deletar reserva", async () => {
    const spy = jest
      .spyOn(Reservation, "findByIdAndDelete")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    await request(app)
      .delete(`/reservations/${reservation._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    spy.mockRestore();
  });
});
