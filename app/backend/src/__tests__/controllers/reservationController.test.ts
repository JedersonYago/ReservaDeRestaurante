import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import User from "../../models/User";
import Table from "../../models/Table";
import Reservation from "../../models/Reservation";
import Config from "../../models/Config";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/reservations", reservationRoutes);

describe("Reservation Controller", () => {
  let testUser: any;
  let testTable: any;
  let accessToken: string;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    await Reservation.deleteMany({});
    testUser = await TestDataFactory.createUser();
    testTable = await TestDataFactory.createTable();
    // Garante que a mesa está ativa e disponível para todos os horários
    testTable.status = "available";
    testTable.availability = [
      {
        date: "2025-07-25",
        times: ["11:00", "12:00", "13:00", "14:00", "15:00", "20:00"],
      },
    ];
    await testTable.save();
    // Gera token de autenticação para o usuário
    const tokens = TestDataFactory.generateAuthTokens(testUser);
    accessToken = tokens.accessToken;

    // Cria configuração do sistema necessária para o controller
    await Config.create({
      maxReservationsPerUser: 5,
      reservationLimitHours: 24,
      minIntervalBetweenReservations: 10,
      openingHour: "11:00",
      closingHour: "23:00",
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true,
      updatedBy: testUser._id,
    });
  });
  it("não deve permitir reservas fora do horário comercial", async () => {
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "05:00", // Fora do horário de funcionamento (11:00 - 23:00)
      observations: "Reserva fora do horário",
    };

    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/funcionamento|dispon[ií]vel/i);
  });

  it("deve retornar 404 ao tentar reservar uma mesa inexistente", async () => {
    const reservationData = {
      tableId: "000000000000000000000000", // ObjectId inexistente
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "19:00",
      observations: "Mesa inexistente",
    };

    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(404);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/mesa não encontrada/i);
  });

  it("deve retornar 401 ao tentar reservar sem autenticação", async () => {
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "19:00",
      observations: "Sem autenticação",
    };

    const response = await request(app)
      .post("/reservations")
      // Não envia o header Authorization
      .send(reservationData)
      .expect(401);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      /token não fornecido|não autorizado|autenticado/i
    );
  });

  it("não deve permitir reserva se o usuário exceder o limite de reserva", async () => {
    // Cria reservas até o limite
    const validTimes = ["11:00", "12:00", "13:00", "14:00", "15:00"];
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/reservations")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          tableId: testTable._id,
          customerName: "Cliente Teste",
          customerEmail: "cliente@example.com",
          date: "2025-07-25",
          time: validTimes[i],
          observations: `Reserva ${i + 1}`,
        });
      if (res.status !== 201) {
        console.error("Falha ao criar reserva", i + 1, res.body);
      }
      expect(res.status).toBe(201);
    }

    // Tenta criar uma reserva além do limite
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        tableId: testTable._id,
        customerName: "Cliente Teste",
        customerEmail: "cliente@example.com",
        date: "2025-07-25",
        time: "20:00",
        observations: "Excedendo limite",
      })
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/limite|reservas/i);
  });
});
