import request from "supertest";
import express from "express";
import configRoutes from "../../routes/configRoutes";
import Config from "../../models/Config";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/config", configRoutes);

describe("Config Controller", () => {
  beforeEach(async () => {
    await TestCleanup.clearAll();
  });

  describe("GET /config", () => {
    it("deve retornar configuração existente", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      const existingConfig = await Config.create({
        maxReservationsPerUser: 5,
        reservationLimitHours: 24,
        minIntervalBetweenReservations: 30,
        openingHour: "18:00",
        closingHour: "23:00",
        isReservationLimitEnabled: true,
        isIntervalEnabled: true,
        isOpeningHoursEnabled: true,
        updatedBy: admin._id,
      });

      const res = await request(app)
        .get("/config")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body._id).toBe((existingConfig as any)._id.toString());
      expect(res.body.maxReservationsPerUser).toBe(5);
    });

    it("deve criar configuração padrão se não existir", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      const res = await request(app)
        .get("/config")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.maxReservationsPerUser).toBeDefined();
      expect(res.body.openingHour).toBeDefined();
      expect(res.body.closingHour).toBeDefined();
    });
  });

  describe("GET /config/public", () => {
    it("deve retornar configurações públicas", async () => {
      const res = await request(app).get("/config/public").expect(200);

      expect(res.body.openingHour).toBeDefined();
      expect(res.body.closingHour).toBeDefined();
      expect(res.body.isOpeningHoursEnabled).toBeDefined();
      expect(res.body.maxReservationsPerUser).toBeUndefined(); // Não deve incluir dados sensíveis
    });

    it("deve retornar configurações padrão se não existir configuração", async () => {
      const res = await request(app).get("/config/public").expect(200);

      expect(res.body.openingHour).toBeDefined();
      expect(res.body.closingHour).toBeDefined();
    });
  });

  describe("PUT /config", () => {
    it("deve atualizar configurações com dados válidos", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      const configData = {
        maxReservationsPerUser: 3,
        reservationLimitHours: 48,
        minIntervalBetweenReservations: 60,
        openingHour: "19:00",
        closingHour: "22:00",
        isReservationLimitEnabled: true,
        isIntervalEnabled: true,
        isOpeningHoursEnabled: true,
      };

      const res = await request(app)
        .put("/config")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(configData)
        .expect(200);

      expect(res.body.maxReservationsPerUser).toBe(3);
      expect(res.body.openingHour).toBe("19:00");
      expect(res.body.updatedBy).toBe(admin._id.toString());
    });

    it("deve rejeitar usuário não autenticado", async () => {
      const configData = {
        maxReservationsPerUser: 3,
        openingHour: "19:00",
        closingHour: "22:00",
        isOpeningHoursEnabled: true,
      };

      const res = await request(app)
        .put("/config")
        .send(configData)
        .expect(401);
    });
  });

  describe("GET /config/history", () => {
    it("deve retornar histórico de configurações", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Criar algumas configurações
      await Config.create([
        {
          maxReservationsPerUser: 3,
          openingHour: "19:00",
          closingHour: "22:00",
          updatedBy: admin._id,
        },
        {
          maxReservationsPerUser: 5,
          openingHour: "18:00",
          closingHour: "23:00",
          updatedBy: admin._id,
        },
      ]);

      const res = await request(app)
        .get("/config/history")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
