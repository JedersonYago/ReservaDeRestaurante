import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import Reservation from "../../models/Reservation";
import Table from "../../models/Table";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/reservations", reservationRoutes);

describe("Cancelar Reserva (RF12)", () => {
  let user: any;
  let userToken: string;
  let admin: any;
  let adminToken: string;
  let otherUser: any;
  let otherToken: string;
  let table: any;
  let reservation: any;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser();
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    admin = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@admin.com",
      username: "admin",
    });
    adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    otherUser = await TestDataFactory.createUser({
      email: "other@teste.com",
      username: "otheruser",
    });
    otherToken = TestDataFactory.generateAuthTokens(otherUser).accessToken;
    table = await TestDataFactory.createTable();
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

  it("cliente deve cancelar a própria reserva", async () => {
    const res = await request(app)
      .put(`/reservations/${reservation._id}/cancel`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    // O endpoint retorna o objeto reserva atualizado
    expect(res.body).toHaveProperty("_id", reservation._id.toString());
    expect(res.body).toHaveProperty("status", "cancelled");
    const updated = await Reservation.findById(reservation._id);
    expect(updated!.status).toBe("cancelled");
  });

  it("admin deve cancelar qualquer reserva", async () => {
    // Este teste pode falhar se o controller não permitir admin cancelar reservas de outros usuários
    const res = await request(app)
      .put(`/reservations/${reservation._id}/cancel`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200); // Se falhar, ajustar controller para permitir
    expect(res.body).toHaveProperty("_id", reservation._id.toString());
    expect(res.body).toHaveProperty("status", "cancelled");
    const updated = await Reservation.findById(reservation._id);
    expect(updated!.status).toBe("cancelled");
  });

  it("cliente não pode cancelar reserva de outro usuário", async () => {
    // O controller atualmente retorna 404, mas o correto seria 403
    const res = await request(app)
      .put(`/reservations/${reservation._id}/cancel`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403); // Se falhar, ajustar controller para retornar 403
    // Se retornar 404, pode ser necessário ajustar o controller
    const stillExists = await Reservation.findById(reservation._id);
    expect(stillExists!.status).not.toBe("cancelled");
  });

  it("ao cancelar, a mesa deve ser liberada (se necessário)", async () => {
    // Simula mesa ocupada pela reserva
    table.reservations = [reservation._id];
    await table.save();
    await request(app)
      .put(`/reservations/${reservation._id}/cancel`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
    const updatedTable = await Table.findById(table._id);
    // O controller deve remover a reserva da mesa ao cancelar
    // Se falhar, ajustar controller para garantir isso
    expect(updatedTable!.reservations).not.toContainEqual(reservation._id);
  });
});
