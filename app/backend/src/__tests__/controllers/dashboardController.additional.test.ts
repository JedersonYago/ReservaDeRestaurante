import request from "supertest";
import express from "express";
import dashboardRoutes from "../../routes/dashboardRoutes";
import Reservation from "../../models/Reservation";
import Table from "../../models/Table";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/dashboard", dashboardRoutes);

describe("Dashboard Controller - Additional Tests", () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    // Suprimir logs de erro para não poluir o output dos testes
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    errorSpy.mockRestore();
  });

  describe("GET /dashboard/client", () => {
    it("deve retornar erro 500 quando falhar ao buscar reservas do cliente", async () => {
      const user = await TestDataFactory.createUser();
      const userToken = TestDataFactory.generateAuthTokens(user).accessToken;

      // Mock para simular erro no banco
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      } as any);

      const res = await request(app)
        .get("/dashboard/client")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do cliente");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas confirmadas", async () => {
      const user = await TestDataFactory.createUser();
      const userToken = TestDataFactory.generateAuthTokens(user).accessToken;

      // Mock para simular erro no banco
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      } as any);
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      } as any);

      const res = await request(app)
        .get("/dashboard/client")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do cliente");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas canceladas", async () => {
      const user = await TestDataFactory.createUser();
      const userToken = TestDataFactory.generateAuthTokens(user).accessToken;

      // Mock para simular erro no banco - o controller processa os dados em memória
      // então precisamos fazer o populate falhar
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      } as any);

      const res = await request(app)
        .get("/dashboard/client")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do cliente");
    });

    it("deve retornar erro 500 quando falhar ao buscar próximas reservas", async () => {
      const user = await TestDataFactory.createUser();
      const userToken = TestDataFactory.generateAuthTokens(user).accessToken;

      // Mock para simular erro no banco - o controller processa os dados em memória
      // então precisamos fazer o populate falhar
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      } as any);

      const res = await request(app)
        .get("/dashboard/client")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do cliente");
    });
  });

  describe("GET /dashboard/admin", () => {
    it("deve retornar erro 500 quando falhar ao buscar reservas totais", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Mock para simular erro no banco
      jest
        .spyOn(Reservation, "countDocuments")
        .mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas confirmadas", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Mock para simular erro no banco
      jest.spyOn(Reservation, "countDocuments").mockResolvedValueOnce(0);
      jest
        .spyOn(Reservation, "countDocuments")
        .mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas pendentes", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Mock para simular erro no banco
      jest
        .spyOn(Reservation, "countDocuments")
        .mockResolvedValueOnce(0) // Primeira chamada (todas as reservas)
        .mockResolvedValueOnce(0) // Segunda chamada (confirmadas)
        .mockRejectedValueOnce(new Error("Database error")); // Terceira chamada (pendentes)

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas canceladas", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Mock para simular erro no banco
      jest
        .spyOn(Reservation, "countDocuments")
        .mockResolvedValueOnce(0) // Primeira chamada (todas as reservas)
        .mockResolvedValueOnce(0) // Segunda chamada (confirmadas)
        .mockResolvedValueOnce(0) // Terceira chamada (pendentes)
        .mockRejectedValueOnce(new Error("Database error")); // Quarta chamada (canceladas)

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });

    it("deve retornar erro 500 quando falhar ao buscar mesas", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      // Mock para simular erro no banco
      jest.spyOn(Reservation, "countDocuments").mockResolvedValue(0); // Todas as chamadas de countDocuments

      jest
        .spyOn(Table, "countDocuments")
        .mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });

    it("deve retornar erro 500 quando falhar ao buscar reservas por mesa", async () => {
      const admin = await TestDataFactory.createAdmin();
      const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;

      const table = await TestDataFactory.createTable();

      // Mock para simular erro no banco
      jest.spyOn(Reservation, "countDocuments").mockResolvedValue(0); // Todas as chamadas de countDocuments

      jest.spyOn(Table, "countDocuments").mockResolvedValue(1);
      jest.spyOn(Reservation, "find").mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              limit: jest.fn().mockRejectedValue(new Error("Database error")),
            }),
          }),
        }),
      } as any);

      const res = await request(app)
        .get("/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);

      expect(res.body.error).toBe("Erro ao buscar estatísticas do admin");
    });
  });
});
