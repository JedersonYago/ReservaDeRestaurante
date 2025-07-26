import request from "supertest";
import express from "express";
import reservationRoutes from "../../routes/reservationRoutes";
import User from "../../models/User";
import Table from "../../models/Table";
import Reservation from "../../models/Reservation";
import Config from "../../models/Config";
import { TestDataFactory, TestCleanup } from "../helpers";
const { Types } = require("mongoose");
// jest.mock("../../models/Reservation");

const app = express();
app.use(express.json());
app.use("/reservations", reservationRoutes);

describe("Reservation Controller", () => {
  let testUser: any;
  let testTable: any;
  let accessToken: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    await Reservation.deleteMany({});
    await Config.deleteMany({});
    testUser = await TestDataFactory.createUser();
    testTable = await TestDataFactory.createTable();
    testTable.status = "available";
    testTable.availability = [
      {
        date: "2025-07-25",
        times: ["11:00", "12:00", "13:00", "14:00", "15:00", "20:00"],
      },
    ];
    await testTable.save();
    const tokens = TestDataFactory.generateAuthTokens(testUser);
    accessToken = tokens.accessToken;
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });
  it("não deve permitir reservas fora do horário comercial", async () => {
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
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "05:00",
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
      .send(reservationData)
      .expect(401);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      /token não fornecido|não autorizado|autenticado/i
    );
  });

  it("não deve permitir reserva se o usuário exceder o limite de reserva", async () => {
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

  it("deve permitir apenas uma reserva para o mesmo horário (concorrência)", async () => {
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
    const user2 = await TestDataFactory.createUser({
      email: "user2@teste.com",
      username: "user2",
    });
    const token2 = TestDataFactory.generateAuthTokens(user2).accessToken;
    const reservationData = {
      tableId: testTable._id,
      customerName: "Concorrente 1",
      customerEmail: "conc1@teste.com",
      date: "2025-07-25",
      time: "20:00",
      observations: "Concorrência",
    };
    const reservationData2 = {
      ...reservationData,
      customerName: "Concorrente 2",
      customerEmail: "conc2@teste.com",
    };
    // Dispara as duas requisições quase ao mesmo tempo
    const [res1, res2] = await Promise.all([
      request(app)
        .post("/reservations")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(reservationData),
      request(app)
        .post("/reservations")
        .set("Authorization", `Bearer ${token2}`)
        .send(reservationData2),
    ]);
    // Um deve ser 201, outro 400
    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 400]);
    // O erro deve ser de conflito de horário
    expect(res1.status === 400 || res2.status === 400).toBe(true);
    const conflictRes = res1.status === 400 ? res1 : res2;
    expect(conflictRes.body).toHaveProperty("error");
    expect(conflictRes.body.error).toMatch(/reservado|conflito|horário/i);
  });

  it("não deve permitir criar reserva em mesa em manutenção", async () => {
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
    // Deixa a mesa em manutenção
    testTable.status = "maintenance";
    await testTable.save();
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "12:00",
      observations: "Tentando reservar mesa em manutenção",
    };
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/manuten/i);
  });

  it("não deve permitir criar reserva para horário fora da disponibilidade da mesa", async () => {
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
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "23:59", // horário não disponível
      observations: "Tentando reservar fora do horário disponível",
    };
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/dispon[ií]vel|hor[áa]rio/i);
  });

  it("não deve permitir criar reserva com campos obrigatórios faltando", async () => {
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
    const camposObrigatorios = [
      "tableId",
      "customerName",
      "customerEmail",
      "date",
      "time",
    ];
    for (const campo of camposObrigatorios) {
      const reservationData: any = {
        tableId: testTable._id,
        customerName: "Cliente Teste",
        customerEmail: "cliente@example.com",
        date: "2025-07-25",
        time: "12:00",
        observations: "Teste campo obrigatório faltando",
      };
      delete reservationData[campo];
      const response = await request(app)
        .post("/reservations")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(reservationData)
        .expect(400);
      // Aceita tanto { error } quanto { message, details }
      if (response.body.error) {
        expect(response.body.error).toMatch(
          /obrigat[óo]rio|preenchido|required/i
        );
      } else {
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toMatch(
          /obrigat[óo]rio|preenchido|required/i
        );
        if (response.body.details) {
          expect(Array.isArray(response.body.details)).toBe(true);
        }
      }
    }
  });

  it("não deve permitir criar reserva duplicada para a mesma mesa, data e horário", async () => {
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
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "12:00",
      observations: "Primeira reserva",
    };
    // Cria a primeira reserva
    await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(201);
    // Tenta criar a segunda reserva para o mesmo slot
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/reservado|conflito|hor[áa]rio/i);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao salvar a reserva", async () => {
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
    const saveSpy = jest
      .spyOn(Reservation.prototype, "save")
      .mockImplementation(() => {
        throw new Error("Erro inesperado no banco");
      });
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "12:00",
      observations: "Teste erro 500",
    };
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/erro/i);
    saveSpy.mockRestore();
  });

  it("deve retornar 500 se não houver configurações do sistema ao criar reserva", async () => {
    // NÃO cria Config no banco!
    const user = await TestDataFactory.createUser();
    const table = await TestDataFactory.createTable({
      name: "Mesa Teste " + Date.now() + Math.random(),
    });
    const accessToken = TestDataFactory.generateAuthTokens(user).accessToken;
    const reservationData = {
      tableId: table._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "18:00", // horário disponível!
      observations: "Teste sem config",
    };
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData);
    if (response.status !== 500) {
      console.error("Status inesperado:", response.status, response.body);
    }
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/configuraç/i);
  });

  it("não deve permitir criar reserva com e-mail inválido", async () => {
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
    const reservationData = {
      tableId: testTable._id,
      customerName: "Cliente Teste",
      customerEmail: "email-invalido",
      date: "2025-07-25",
      time: "12:00",
      observations: "Teste e-mail inválido",
    };
    const response = await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(reservationData)
      .expect(400);

    // Aceita tanto 'error' quanto 'message' na resposta
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/email|inv[aá]lido|valida/i);
    if (response.body.details) {
      expect(Array.isArray(response.body.details)).toBe(true);
    }
  });
});

describe("Erros 500 no ReservationController", () => {
  let errorSpy: jest.SpyInstance;
  let testUser: any;
  let testTable: any;
  let accessToken: string;

  beforeEach(async () => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Preparação do ambiente (igual ao primeiro describe)
    await TestCleanup.clearAll();
    await Reservation.deleteMany({});
    testUser = await TestDataFactory.createUser();
    testTable = await TestDataFactory.createTable();
    testTable.status = "available";
    testTable.availability = [
      {
        date: "2025-07-25",
        times: ["11:00", "12:00", "13:00", "14:00", "15:00", "20:00"],
      },
    ];
    await testTable.save();
    const tokens = TestDataFactory.generateAuthTokens(testUser);
    accessToken = tokens.accessToken;
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
  afterEach(() => {
    errorSpy.mockRestore();
    jest.restoreAllMocks();
  });
  it("POST /reservations deve retornar 500 se falhar no banco", async () => {
    const saveSpy = jest
      .spyOn(Reservation.prototype, "save")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    await request(app)
      .post("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        tableId: testTable._id,
        customerName: "Erro 500",
        customerEmail: "erro@teste.com",
        date: "2025-07-25",
        time: "11:00",
        observations: "Teste erro 500",
      })
      .expect(500);
    saveSpy.mockRestore();
  });
  it("GET /reservations deve retornar 500 se falhar no banco", async () => {
    const findSpy = jest.spyOn(Reservation, "find").mockImplementation(() => {
      throw new Error("fail");
    });
    await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    findSpy.mockRestore();
  });
  it("GET /reservations/:id deve retornar 500 se falhar no banco", async () => {
    const findByIdSpy = jest
      .spyOn(Reservation, "findById")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    // Cria uma reserva válida para garantir que o ID existe e o usuário tem acesso
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste Erro 500",
      customerEmail: "erro@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "confirmed",
    });
    await request(app)
      .get(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    findByIdSpy.mockRestore();
  });
  it("PUT /reservations/:id/cancel deve retornar 500 se falhar no banco", async () => {
    const findByIdSpy = jest
      .spyOn(Reservation, "findById")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    // Cria uma reserva válida para garantir que o ID existe e o usuário tem acesso
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste Erro 500",
      customerEmail: "erro@teste.com",
      date: "2025-07-25",
      time: "13:00",
      status: "confirmed",
    });
    await request(app)
      .put(`/reservations/${reserva._id}/cancel`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    findByIdSpy.mockRestore();
  });
  it("DELETE /reservations/:id deve retornar 500 se falhar no banco", async () => {
    // Cria um usuário admin e gera o token
    const adminUser = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@teste.com",
      username: "adminuser",
    });
    const adminTokens = TestDataFactory.generateAuthTokens(adminUser);
    const adminToken = adminTokens.accessToken;
    // Cria uma reserva válida
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id, // pode ser qualquer usuário
      customerName: "Teste Erro 500",
      customerEmail: "erro@teste.com",
      date: "2025-07-25",
      time: "11:00",
      status: "confirmed",
    });
    // Mocka findById para retornar a reserva válida
    const findByIdSpy = jest
      .spyOn(Reservation, "findById")
      .mockResolvedValue(reserva);
    // Mocka findByIdAndDelete para lançar erro
    const deleteSpy = jest
      .spyOn(Reservation, "findByIdAndDelete")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    await request(app)
      .delete(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    findByIdSpy.mockRestore();
    deleteSpy.mockRestore();
  });
});

describe("Confirmação de reserva (PUT /reservations/:id/confirm)", () => {
  let testUser: any;
  let adminUser: any;
  let testTable: any;
  let accessToken: string;
  let adminToken: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await TestCleanup.clearAll();
    await Reservation.deleteMany({});
    testUser = await TestDataFactory.createUser();
    adminUser = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@teste.com",
      username: "adminuser",
    });
    testTable = await TestDataFactory.createTable();
    testTable.status = "available";
    testTable.availability = [
      {
        date: "2025-07-25",
        times: ["11:00", "12:00", "13:00", "14:00", "15:00", "20:00"],
      },
    ];
    await testTable.save();
    accessToken = TestDataFactory.generateAuthTokens(testUser).accessToken;
    adminToken = TestDataFactory.generateAuthTokens(adminUser).accessToken;
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

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("deve retornar 403 se usuário não for admin ao confirmar reserva", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    await request(app)
      .put(`/reservations/${reserva._id}/confirm`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);
  });

  it("deve retornar 404 se reserva não for encontrada ao confirmar", async () => {
    await request(app)
      .put(`/reservations/000000000000000000000000/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });

  it("deve retornar 400 se reserva já estiver confirmada", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "13:00",
      status: "confirmed",
    });
    await request(app)
      .put(`/reservations/${reserva._id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao confirmar reserva", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "14:00",
      status: "pending",
    });
    const findByIdSpy = jest
      .spyOn(Reservation, "findById")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    await request(app)
      .put(`/reservations/${reserva._id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    findByIdSpy.mockRestore();
  });
});

describe("Busca de reservas por data (GET /reservations/date/:date)", () => {
  let admin: any;
  let adminToken: string;
  let user: any;
  let userToken: string;
  let table: any;
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
    table = await TestDataFactory.createTable();
    // Cria reservas para a data
    await Reservation.create({
      tableId: table._id,
      userId: user._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "19:00",
      status: "pending",
    });
    await Reservation.create({
      tableId: table._id,
      userId: user._id,
      customerName: "Outro Cliente",
      customerEmail: "outro@teste.com",
      date: "2025-07-25",
      time: "20:00",
      status: "confirmed",
    });
  });

  it("deve retornar reservas para uma data existente", async () => {
    const res = await request(app)
      .get("/reservations/date/2025-07-25")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("date", "2025-07-25");
  });

  it("deve retornar array vazio se não houver reservas para a data", async () => {
    const res = await request(app)
      .get("/reservations/date/2099-01-01")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao buscar reservas por data", async () => {
    const findSpy = jest.spyOn(Reservation, "find").mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await request(app)
      .get("/reservations/date/2025-07-25")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    expect(res.body).toHaveProperty("error");
    findSpy.mockRestore();
  });
});

describe("Busca de reservas por mesa (GET /reservations/table/:tableId)", () => {
  let admin: any;
  let adminToken: string;
  let user: any;
  let userToken: string;
  let table: any;
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
    table = await TestDataFactory.createTable();
    // Cria reservas para a mesa
    await Reservation.create({
      tableId: table._id,
      userId: user._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "19:00",
      status: "pending",
    });
    await Reservation.create({
      tableId: table._id,
      userId: user._id,
      customerName: "Outro Cliente",
      customerEmail: "outro@teste.com",
      date: "2025-07-26",
      time: "20:00",
      status: "confirmed",
    });
  });

  it("deve retornar reservas para uma mesa existente", async () => {
    const res = await request(app)
      .get(`/reservations/table/${table._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("tableId");
    expect(res.body[0].tableId._id.toString()).toBe(table._id.toString());
  });

  it("deve retornar array vazio se não houver reservas para a mesa", async () => {
    const newTable = await TestDataFactory.createTable({
      name: "Mesa Teste Unica " + Date.now(),
    });
    const res = await request(app)
      .get(`/reservations/table/${newTable._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao buscar reservas por mesa", async () => {
    const findSpy = jest.spyOn(Reservation, "find").mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await request(app)
      .get(`/reservations/table/${table._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    expect(res.body).toHaveProperty("error");
    findSpy.mockRestore();
  });
});

describe("Listar reservas (GET /reservations)", () => {
  let adminUser: any;
  let clientUser: any;
  let adminToken: string;
  let clientToken: string;
  let table: any;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    adminUser = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@admin.com",
      username: "adminuser",
    });
    clientUser = await TestDataFactory.createUser({
      role: "client",
      email: "client@client.com",
      username: "clientuser",
    });
    adminToken = TestDataFactory.generateAuthTokens(adminUser).accessToken;
    clientToken = TestDataFactory.generateAuthTokens(clientUser).accessToken;
    table = await TestDataFactory.createTable();
    // Cria reservas para ambos
    await Reservation.create({
      tableId: table._id,
      userId: adminUser._id,
      customerName: "Admin Reserva",
      customerEmail: "admin@admin.com",
      date: "2025-07-25",
      time: "12:00",
      status: "confirmed",
    });
    await Reservation.create({
      tableId: table._id,
      userId: clientUser._id,
      customerName: "Cliente Reserva",
      customerEmail: "client@client.com",
      date: "2025-07-25",
      time: "13:00",
      status: "pending",
    });
  });

  it("admin deve receber todas as reservas", async () => {
    const res = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Deve conter as duas reservas
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const users = res.body.map(
      (r: any) => r.userId && (r.userId._id || r.userId)
    );
    expect(users).toContainEqual(adminUser._id.toString());
    expect(users).toContainEqual(clientUser._id.toString());
  });

  it("cliente deve receber apenas suas reservas", async () => {
    const res = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Deve conter apenas reservas do cliente
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    for (const reserva of res.body) {
      expect(reserva.userId._id.toString()).toBe(clientUser._id.toString());
    }
  });

  it("não autenticado deve receber 401", async () => {
    await request(app).get("/reservations").expect(401);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao listar reservas", async () => {
    const user = await TestDataFactory.createUser();
    const accessToken = TestDataFactory.generateAuthTokens(user).accessToken;
    const spy = jest.spyOn(Reservation, "find").mockImplementation(() => {
      throw new Error("fail");
    });
    await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    spy.mockRestore();
  });
});

describe("Buscar reserva por ID (GET /reservations/:id)", () => {
  let adminUser: any;
  let clientUser: any;
  let otherUser: any;
  let adminToken: string;
  let clientToken: string;
  let otherToken: string;
  let table: any;
  let reserva: any;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    adminUser = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@admin.com",
      username: "adminuser",
    });
    clientUser = await TestDataFactory.createUser({
      role: "client",
      email: "client@client.com",
      username: "clientuser",
    });
    otherUser = await TestDataFactory.createUser({
      role: "client",
      email: "other@client.com",
      username: "otheruser",
    });
    adminToken = TestDataFactory.generateAuthTokens(adminUser).accessToken;
    clientToken = TestDataFactory.generateAuthTokens(clientUser).accessToken;
    otherToken = TestDataFactory.generateAuthTokens(otherUser).accessToken;
    table = await TestDataFactory.createTable();
    reserva = await Reservation.create({
      tableId: table._id,
      userId: clientUser._id,
      customerName: "Cliente Reserva",
      customerEmail: "client@client.com",
      date: "2025-07-25",
      time: "13:00",
      status: "pending",
    });
  });

  it("deve retornar 404 se reserva não for encontrada", async () => {
    await request(app)
      .get("/reservations/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });

  it("deve retornar 403 se usuário não for dono nem admin", async () => {
    await request(app)
      .get(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403);
  });

  it("admin pode acessar qualquer reserva", async () => {
    const res = await request(app)
      .get(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", reserva._id.toString());
  });

  it("cliente só pode acessar sua própria reserva", async () => {
    const res = await request(app)
      .get(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("_id", reserva._id.toString());
  });
});

describe("Limpar reserva da lista do usuário (PUT /reservations/:id/clear)", () => {
  let clientUser: any;
  let otherUser: any;
  let clientToken: string;
  let otherToken: string;
  let table: any;
  let reserva: any;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    clientUser = await TestDataFactory.createUser({
      role: "client",
      email: "client@client.com",
      username: "clientuser",
    });
    otherUser = await TestDataFactory.createUser({
      role: "client",
      email: "other@client.com",
      username: "otheruser",
    });
    clientToken = TestDataFactory.generateAuthTokens(clientUser).accessToken;
    otherToken = TestDataFactory.generateAuthTokens(otherUser).accessToken;
    table = await TestDataFactory.createTable();
    reserva = await Reservation.create({
      tableId: table._id,
      userId: clientUser._id,
      customerName: "Cliente Reserva",
      customerEmail: "client@client.com",
      date: "2025-07-25",
      time: "13:00",
      status: "pending",
      hiddenFromUser: false,
    });
  });

  it("usuário remove reserva da sua lista", async () => {
    const res = await request(app)
      .patch(`/reservations/${reserva._id}/clear`)
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("message");
    const updated = await Reservation.findById(reserva._id);
    expect(updated?.hiddenFromUser).toBe(true);
  });

  it("reserva não encontrada retorna 404", async () => {
    await request(app)
      .patch(`/reservations/000000000000000000000000/clear`)
      .set("Authorization", `Bearer ${clientToken}`)
      .expect(404);
  });

  it("usuário tenta limpar reserva de outro usuário retorna 404", async () => {
    // O controller retorna 404 se não encontrar reserva do user
    await request(app)
      .patch(`/reservations/${reserva._id}/clear`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(404);
  });

  it("erro inesperado retorna 500", async () => {
    const testUser = await TestDataFactory.createUser();
    const testTable = await TestDataFactory.createTable({
      name: "Mesa Teste " + Date.now() + Math.random(),
    });
    const accessToken =
      TestDataFactory.generateAuthTokens(testUser).accessToken;
    const spy = jest
      .spyOn(Reservation.prototype, "save")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
      hiddenFromUser: false,
    });
    await request(app)
      .patch(`/reservations/${reserva._id}/clear`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(500);
    spy.mockRestore();
  });
});

describe("Atualização de reserva (PUT /reservations/:id)", () => {
  let testUser: any;
  let adminUser: any;
  let testTable: any;
  let accessToken: string;
  let adminToken: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await TestCleanup.clearAll();
    await Reservation.deleteMany({});
    testUser = await TestDataFactory.createUser();
    adminUser = await TestDataFactory.createUser({
      role: "admin",
      email: "admin@teste.com",
      username: "adminuser",
    });
    testTable = await TestDataFactory.createTable();
    testTable.status = "available";
    testTable.availability = [
      {
        date: "2025-07-25",
        times: ["11:00", "12:00", "13:00", "14:00", "15:00", "20:00"],
      },
    ];
    await testTable.save();
    accessToken = TestDataFactory.generateAuthTokens(testUser).accessToken;
    adminToken = TestDataFactory.generateAuthTokens(adminUser).accessToken;
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("deve retornar 403 se usuário não for admin ao atualizar reserva", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        tableId: testTable._id,
        date: "2025-07-25",
        time: "12:00",
      })
      .expect(403);
  });

  it("não deve permitir atualizar reserva para mesa inexistente", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: "000000000000000000000000",
        date: "2025-07-25",
        time: "12:00",
      })
      .expect(404);
  });

  it("não deve permitir atualizar reserva inexistente", async () => {
    await request(app)
      .put(`/reservations/000000000000000000000000`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: testTable._id,
        date: "2025-07-25",
        time: "12:00",
      })
      .expect(404);
  });

  it("deve retornar 400 se reserva já estiver confirmada", async () => {
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "13:00",
      status: "confirmed",
    });
    await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);
  });

  it("deve retornar 500 se ocorrer erro inesperado ao atualizar reserva", async () => {
    const findByIdSpy = jest
      .spyOn(Reservation, "findById")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Teste",
      customerEmail: "teste@teste.com",
      date: "2025-07-25",
      time: "14:00",
      status: "pending",
    });
    await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(500);
    findByIdSpy.mockRestore();
  });

  it("não deve permitir atualizar reserva para horário já reservado", async () => {
    // Cria duas reservas em horários diferentes
    const reserva1 = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente 1",
      customerEmail: "cliente1@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    const reserva2 = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente 2",
      customerEmail: "cliente2@teste.com",
      date: "2025-07-25",
      time: "13:00",
      status: "pending",
    });
    // Tenta atualizar a reserva2 para o mesmo horário da reserva1
    const response = await request(app)
      .put(`/reservations/${reserva2._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: testTable._id,
        date: "2025-07-25",
        time: "12:00",
      })
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/reservado|conflito|hor[áa]rio/i);
  });

  it("não deve permitir atualizar reserva para mesa em manutenção", async () => {
    // Cria uma mesa em manutenção
    const mesaManutencao = await TestDataFactory.createTable({
      status: "maintenance",
      name: "Mesa Manutenção " + Date.now(),
      availability: [
        {
          date: "2025-07-25",
          times: ["11:00", "12:00", "13:00"],
        },
      ],
    });
    // Cria uma reserva válida
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@teste.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    // Tenta atualizar para a mesa em manutenção
    const response = await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: mesaManutencao._id,
        date: "2025-07-25",
        time: "12:00",
      })
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/manuten/i);
  });

  it("não deve permitir atualizar reserva para data fora da disponibilidade da mesa", async () => {
    // Cria uma mesa com disponibilidade restrita
    const mesaRestrita = await TestDataFactory.createTable({
      name: "Mesa Restrita " + Date.now(),
      availability: [
        {
          date: "2025-07-25",
          times: ["11:00", "12:00", "13:00"],
        },
      ],
    });
    // Cria uma reserva válida
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    // Tenta atualizar para uma data fora da disponibilidade
    const response = await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: mesaRestrita._id,
        date: "2099-01-01", // data fora da disponibilidade
        time: "12:00",
      })
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/dispon[ií]vel|período|data/i);
  });

  it("não deve permitir atualizar reserva para horário fora do período de disponibilidade da mesa", async () => {
    // Cria uma mesa com disponibilidade restrita
    const mesaRestrita = await TestDataFactory.createTable({
      name: "Mesa Restrita " + Date.now(),
      availability: [
        {
          date: "2025-07-25",
          times: ["11:00", "12:00", "13:00"],
        },
      ],
    });
    // Cria uma reserva válida
    const reserva = await Reservation.create({
      tableId: testTable._id,
      userId: testUser._id,
      customerName: "Cliente Teste",
      customerEmail: "cliente@example.com",
      date: "2025-07-25",
      time: "12:00",
      status: "pending",
    });
    // Tenta atualizar para um horário fora do período disponível
    const response = await request(app)
      .put(`/reservations/${reserva._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        table: mesaRestrita._id,
        date: "2025-07-25",
        time: "23:59", // horário não disponível
      })
      .expect(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/hor[áa]rio|dispon[ií]vel|período/i);
  });
});

describe("Unitários reservationController", () => {
  it("reservationController.create deve retornar 404 se a mesa não existir", async () => {
    const req = {
      body: {
        tableId: "000000000000000000000000",
        customerName: "Teste",
        customerEmail: "teste@teste.com",
        date: "2025-07-25",
        time: "18:00",
        observations: "Teste mesa inexistente",
        userId: "fakeid",
      },
      user: { _id: "fakeid" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await require("../../controllers/reservationController").reservationController.create(
      req,
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  it("reservationController.create deve retornar 400 se o horário estiver fora da disponibilidade da mesa", async () => {
    const mesa = await TestDataFactory.createTable({
      availability: [
        {
          date: "2025-07-25",
          times: ["18:00", "19:00"],
        },
      ],
    });
    const req = {
      body: {
        tableId: mesa._id,
        customerName: "Teste",
        customerEmail: "teste@teste.com",
        date: "2025-07-25",
        time: "20:00", // horário NÃO disponível
        observations: "Teste horário fora",
        userId: "fakeid",
      },
      user: { _id: "fakeid" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await require("../../controllers/reservationController").reservationController.create(
      req,
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringMatching(/disponível|horário/i),
      })
    );
  });

  it("reservationController.create deve retornar 400 se o horário já estiver reservado", async () => {
    const mesa = await TestDataFactory.createTable({
      availability: [
        {
          date: "2025-07-25",
          times: ["18:00", "19:00"],
        },
      ],
    });
    // Reserva já existente para o mesmo horário
    await Reservation.create({
      tableId: mesa._id,
      customerName: "Cliente Existente",
      customerEmail: "existente@teste.com",
      date: "2025-07-25",
      time: "18:00",
      status: "pending",
      userId: new Types.ObjectId(), // Corrigido aqui!
    });
    const req = {
      body: {
        tableId: mesa._id,
        customerName: "Novo Cliente",
        customerEmail: "novo@teste.com",
        date: "2025-07-25",
        time: "18:00", // mesmo horário já reservado
        observations: "Teste horário já reservado",
        userId: "user2",
      },
      user: { _id: "user2" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await require("../../controllers/reservationController").reservationController.create(
      req,
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringMatching(/reservado|conflito|horário/i),
      })
    );
  });

  it("reservationController.create deve retornar 500 se ocorrer erro inesperado ao buscar a mesa", async () => {
    // Simula erro no Model
    const findByIdSpy = jest.spyOn(Table, "findById").mockImplementation(() => {
      throw new Error("Erro inesperado");
    });

    const req = {
      body: {
        tableId: "000000000000000000000000",
        customerName: "Teste",
        customerEmail: "teste@teste.com",
        date: "2025-07-25",
        time: "18:00",
        observations: "Teste erro inesperado",
        userId: "fakeid",
      },
      user: { _id: "fakeid" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await require("../../controllers/reservationController").reservationController.create(
      req,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringMatching(/erro/i) })
    );

    findByIdSpy.mockRestore();
  });
});
