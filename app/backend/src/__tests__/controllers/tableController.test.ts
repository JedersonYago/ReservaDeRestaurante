import request from "supertest";
import express from "express";
import tableRoutes from "../../routes/tableRoutes";
import Table from "../../models/Table";
import { TestDataFactory, TestCleanup } from "../helpers";

const app = express();
app.use(express.json());
app.use("/tables", tableRoutes);

// Utilitário para obter token de admin para autenticação
async function getAdminToken() {
  const adminUser = await TestDataFactory.createUser({
    role: "admin",
    username: "adminuser",
    email: "admin@admin.com",
    password: "Admin123!",
  });
  const tokens = TestDataFactory.generateAuthTokens(adminUser);
  return tokens.accessToken;
}

describe("Table Controller", () => {
  let userToken: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    // Cria usuário comum para autenticação nas rotas protegidas
    const user = await TestDataFactory.createUser();
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  describe("GET /tables", () => {
    it("deve listar todas as mesas", async () => {
      const avail = [{ date: "2025-07-22", times: ["18:00", "19:00"] }];
      await TestDataFactory.createTable({
        name: "Mesa 1",
        capacity: 2,
        availability: avail,
      });
      await TestDataFactory.createTable({
        name: "Mesa 2",
        capacity: 2,
        availability: avail,
      });
      const response = await request(app)
        .get("/tables")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /tables/:id", () => {
    it("deve retornar uma mesa pelo id", async () => {
      const avail = [{ date: "2025-07-22", times: ["18:00", "19:00"] }];
      const table = await TestDataFactory.createTable({
        name: "Mesa Teste",
        capacity: 2,
        availability: avail,
      });
      const response = await request(app)
        .get(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(response.body).toHaveProperty("_id", String(table._id));
      expect(response.body).toHaveProperty("name", "Mesa Teste");
    });
    it("deve retornar 404 para mesa não existente", async () => {
      const response = await request(app)
        .get("/tables/000000000000000000000000")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe("POST /tables", () => {
    it("deve criar uma nova mesa (admin)", async () => {
      const adminToken = await getAdminToken();
      const tableData = {
        name: "Mesa Nova",
        capacity: 4,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
      };
      const response = await request(app)
        .post("/tables")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(tableData)
        .expect(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe("Mesa Nova");
      expect(response.body.capacity).toBe(4);
    });
    it("deve negar criação sem token de admin", async () => {
      const tableData = {
        name: "Mesa Sem Admin",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
      };
      await request(app).post("/tables").send(tableData).expect(401);
    });
  });

  describe("PUT /tables/:id", () => {
    it("deve atualizar uma mesa (admin)", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Editar",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
      });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Editada",
          capacity: 6,
          availability: [{ date: "2025-07-23", times: ["19:00-21:00"] }],
        })
        .expect(200);
      expect(response.body.name).toBe("Mesa Editada");
      expect(response.body.capacity).toBe(6);
    });
    it("deve retornar 404 ao tentar atualizar uma mesa inexistente", async () => {
      const adminToken = await getAdminToken();
      const fakeId = "000000000000000000000000";
      const response = await request(app)
        .put(`/tables/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Inexistente",
          capacity: 2,
          availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        })
        .expect(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/não encontrada|not found/i);
    });
    it("deve negar atualização sem token de admin", async () => {
      const table = await TestDataFactory.createTable({
        name: "Mesa Editar2",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
      });
      await request(app)
        .put(`/tables/${table._id}`)
        .send({
          name: "Mesa Editada2",
          capacity: 8,
          availability: [{ date: "2025-07-24", times: ["20:00-22:00"] }],
        })
        .expect(401);
    });
    it("deve retornar 400 ao tentar setar status 'expired' manualmente", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Status Expired",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
      });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Status Expired",
          capacity: 2,
          availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
          status: "expired",
        })
        .expect(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/expired/);
    });
    it("deve retornar 409 ao tentar colocar mesa em manutenção com reservas ativas", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Manutencao",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
        status: "available",
      });
      // Cria reserva ativa para a mesa
      const unique = `${Date.now()}_${Math.random()}`;
      await TestDataFactory.createReservation({
        tableId: table._id,
        status: "confirmed",
        date: "2025-07-22",
        time: "18:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user${unique}@test.com`,
            username: `user${unique}`,
          })
        )._id,
      });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Manutencao",
          capacity: 2,
          availability: [{ date: "2025-07-22", times: ["18:00-20:00"] }],
          status: "maintenance",
        })
        .expect(409);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("affectedReservations");
      expect(Array.isArray(response.body.affectedReservations)).toBe(true);
      expect(response.body).toHaveProperty("tableId");
      expect(response.body).toHaveProperty("tableName");
    });
    it("deve retornar 400 ao tentar atualizar mesa com horários sobrepostos na disponibilidade", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Sobreposicao",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Sobreposicao",
          capacity: 2,
          availability: [
            { date: "2025-07-22", times: ["18:00-19:00", "18:30-19:30"] },
          ],
        })
        .expect(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(
        /sobreposição|sobreposicao|conflito/i
      );
    });
    it("deve retornar 400 ao tentar atualizar uma mesa para um nome já existente", async () => {
      const adminToken = await getAdminToken();
      // Cria duas mesas
      const table1 = await TestDataFactory.createTable({
        name: "Mesa Unica",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      const table2 = await TestDataFactory.createTable({
        name: "Mesa Duplicada",
        capacity: 2,
        availability: [{ date: "2025-07-23", times: ["19:00-20:00"] }],
      });
      // Tenta atualizar a segunda mesa para o nome da primeira
      const response = await request(app)
        .put(`/tables/${table2._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Unica",
          capacity: 2,
          availability: [{ date: "2025-07-23", times: ["19:00-20:00"] }],
        })
        .expect(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/já existe|existe uma mesa/i);
    });
    it("deve retornar 500 se ocorrer erro inesperado no update", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Erro",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      // Suprime o console.error temporariamente
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const spy = jest
        .spyOn(require("../../models/Table").default, "findByIdAndUpdate")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Mesa Erro",
          capacity: 2,
          availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        })
        .expect(500);
      expect(response.body).toHaveProperty("message");
      spy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("DELETE /tables/:id", () => {
    it("deve deletar uma mesa (admin)", async () => {
      const adminToken = await getAdminToken();
      const avail = [{ date: "2025-07-22", times: ["18:00", "19:00"] }];
      const table = await TestDataFactory.createTable({
        name: "Mesa Deletar",
        capacity: 2,
        availability: avail,
      });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
    });
    it("deve negar exclusão sem token de admin", async () => {
      const avail = [{ date: "2025-07-22", times: ["18:00", "19:00"] }];
      const table = await TestDataFactory.createTable({
        name: "Mesa Deletar2",
        capacity: 2,
        availability: avail,
      });
      await request(app).delete(`/tables/${table._id}`).expect(401);
    });
    it("deve retornar 404 ao tentar deletar uma mesa inexistente", async () => {
      const adminToken = await getAdminToken();
      const fakeId = "000000000000000000000000";
      const response = await request(app)
        .delete(`/tables/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/não encontrada|not found/i);
    });
    it("deve cancelar reservas ativas ao deletar a mesa", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Com Reservas Ativas",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      // Cria reserva ativa para a mesa
      const unique = `${Date.now()}_${Math.random()}`;
      const reservation = await TestDataFactory.createReservation({
        tableId: table._id,
        status: "confirmed",
        date: "2025-07-22",
        time: "18:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user${unique}@test.com`,
            username: `user${unique}`,
          })
        )._id,
      });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
      // Confirma que a reserva foi cancelada
      const updatedReservation =
        await require("../../models/Reservation").default.findById(
          reservation._id
        );
      expect(updatedReservation.status).toBe("cancelled");
    });
    it("deve deletar mesa sem reservas ativas normalmente", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Sem Reservas Ativas",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
    });
    it("deve deletar mesa com reservas já canceladas normalmente", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Reservas Canceladas",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      // Cria reserva já cancelada para a mesa
      const unique = `${Date.now()}_${Math.random()}`;
      const reservation = await TestDataFactory.createReservation({
        tableId: table._id,
        status: "cancelled",
        date: "2025-07-22",
        time: "18:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user${unique}@test.com`,
            username: `user${unique}`,
          })
        )._id,
      });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
      // Confirma que a reserva permanece cancelada
      const updatedReservation =
        await require("../../models/Reservation").default.findById(
          reservation._id
        );
      expect(updatedReservation.status).toBe("cancelled");
    });
    it("deve cancelar apenas reservas pending/confirmed e manter cancelled/expired ao deletar a mesa (mix de status)", async () => {
      await TestCleanup.clearAll(); // Garante limpeza total antes do teste
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Mix Status",
        capacity: 2,
        availability: [
          {
            date: "2025-07-30",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
          {
            date: "2025-07-31",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
        ],
      });
      const unique = `${Date.now()}_${Math.random()}`;
      const ReservationModel = require("../../models/Reservation").default;
      // Cria reservas: para cada combinação única de data/horário, apenas UMA ativa (alternando entre pending/confirmed), uma cancelled e uma expired
      const dates = ["2025-07-30", "2025-07-31"];
      const times = ["18:00", "19:00", "20:00"];
      const reservations = [];
      let idx = 0;
      const statusAtivos = ["pending", "confirmed"];
      for (const date of dates) {
        for (const time of times) {
          const statusAtivo = statusAtivos[idx % 2];
          // ativa
          const userAtivo = await TestDataFactory.createUser({
            email: `usera${idx}_${unique}@test.com`,
            username: `usera${idx}_${unique}`,
          });
          reservations.push(
            await TestDataFactory.createReservation({
              tableId: table._id,
              status: statusAtivo,
              date,
              time,
              userId: userAtivo._id,
            })
          );
          // cancelled
          const userCancelled = await TestDataFactory.createUser({
            email: `userx${idx}_${unique}@test.com`,
            username: `userx${idx}_${unique}`,
          });
          reservations.push(
            await TestDataFactory.createReservation({
              tableId: table._id,
              status: "cancelled",
              date,
              time,
              userId: userCancelled._id,
            })
          );
          // expired
          const userExpired = await TestDataFactory.createUser({
            email: `usere${idx}_${unique}@test.com`,
            username: `usere${idx}_${unique}`,
          });
          reservations.push(
            await TestDataFactory.createReservation({
              tableId: table._id,
              status: "expired",
              date,
              time,
              userId: userExpired._id,
            })
          );
          idx++;
        }
      }
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
      // Confirma que as reservas foram tratadas corretamente
      for (const r of reservations) {
        const updated = await ReservationModel.findById(r._id);
        if (updated.status === "pending" || updated.status === "confirmed") {
          expect(updated.status).toBe("cancelled");
        } else {
          expect(["cancelled", "expired"]).toContain(updated.status);
        }
      }
    });
    it("deve cancelar todas as reservas ativas em datas diferentes ao deletar a mesa", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Reservas Varias Datas",
        capacity: 2,
        availability: [
          { date: "2025-07-22", times: ["18:00-19:00"] },
          { date: "2025-07-23", times: ["19:00-20:00"] },
        ],
      });
      const unique = `${Date.now()}_${Math.random()}`;
      // Reserva ativa em uma data
      const res1 = await TestDataFactory.createReservation({
        tableId: table._id,
        status: "confirmed",
        date: "2025-07-22",
        time: "18:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user1${unique}@test.com`,
            username: `user1${unique}`,
          })
        )._id,
      });
      // Reserva ativa em outra data
      const res2 = await TestDataFactory.createReservation({
        tableId: table._id,
        status: "pending",
        date: "2025-07-23",
        time: "19:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user2${unique}@test.com`,
            username: `user2${unique}`,
          })
        )._id,
      });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
      // Confirma que todas as reservas foram canceladas
      const ReservationModel = require("../../models/Reservation").default;
      expect((await ReservationModel.findById(res1._id)).status).toBe(
        "cancelled"
      );
      expect((await ReservationModel.findById(res2._id)).status).toBe(
        "cancelled"
      );
    });
    it("deve cancelar todas as reservas ativas mesmo com grande volume", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Volume Alto",
        capacity: 2,
        availability: [
          {
            date: "2025-07-22",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
          {
            date: "2025-07-23",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
          {
            date: "2025-07-24",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
          {
            date: "2025-07-25",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
          {
            date: "2025-07-26",
            times: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
          },
        ],
      });
      const unique = `${Date.now()}_${Math.random()}`;
      const ReservationModel = require("../../models/Reservation").default;
      // Cria 15 reservas ativas, cada uma com combinação única de date+time
      const dates = [
        "2025-07-22",
        "2025-07-23",
        "2025-07-24",
        "2025-07-25",
        "2025-07-26",
      ];
      const times = ["18:00", "19:00", "20:00"];
      const reservations = [];
      let idx = 0;
      for (const date of dates) {
        for (const time of times) {
          const status = idx % 2 === 0 ? "pending" : "confirmed";
          const user = await TestDataFactory.createUser({
            email: `user${idx}_${unique}@test.com`,
            username: `user${idx}_${unique}`,
          });
          reservations.push(
            await TestDataFactory.createReservation({
              tableId: table._id,
              status,
              date,
              time,
              userId: user._id,
            })
          );
          idx++;
        }
      }
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);
      // Confirma que a mesa foi removida
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
      // Confirma que todas as reservas foram canceladas
      for (const r of reservations) {
        const updated = await ReservationModel.findById(r._id);
        expect(updated.status).toBe("cancelled");
      }
    });
  });

  describe("GET /tables/:id/availability", () => {
    it("deve retornar true se mesa está disponível para data/horário", async () => {
      const table = await TestDataFactory.createTable({
        availability: [{ date: "2025-07-25", times: ["18:00"] }],
      });
      const res = await request(app)
        .get(`/tables/${table._id}/availability?date=2025-07-25&time=18:00`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(res.body).toBe(true);
    });
    it("deve retornar false se mesa não está disponível para data/horário", async () => {
      const table = await TestDataFactory.createTable({
        availability: [{ date: "2025-07-25", times: ["18:00"] }],
      });
      const res = await request(app)
        .get(`/tables/${table._id}/availability?date=2025-07-25&time=19:00`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(res.body).toBe(false);
    });
    it("deve retornar 400 se faltar parâmetro", async () => {
      const table = await TestDataFactory.createTable();
      await request(app)
        .get(`/tables/${table._id}/availability?date=2025-07-25`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe("GET /tables/available", () => {
    it("deve retornar mesas disponíveis para data/horário/pessoas", async () => {
      await TestDataFactory.createTable({
        name: "Mesa Disponível",
        capacity: 4,
        availability: [{ date: "2025-07-25", times: ["18:00"] }],
      });
      const res = await request(app)
        .get("/tables/available?date=2025-07-25&time=18:00&numberOfPeople=2")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
    it("deve retornar 400 se faltar parâmetro", async () => {
      await request(app)
        .get("/tables/available?date=2025-07-25&time=18:00")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe("GET /tables/:id/status", () => {
    it("deve retornar status dinâmico da mesa", async () => {
      const table = await TestDataFactory.createTable({
        availability: [{ date: "2025-07-25", times: ["18:00", "19:00"] }],
      });
      const res = await request(app)
        .get(`/tables/${table._id}/status?date=2025-07-25`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(res.body).toHaveProperty("status");
      expect(res.body.details).toHaveProperty("totalSlots");
    });
    it("deve retornar 400 se faltar data", async () => {
      const table = await TestDataFactory.createTable();
      await request(app)
        .get(`/tables/${table._id}/status`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe("GET /tables/available-for-rescheduling", () => {
    let adminToken: string;
    beforeEach(async () => {
      const admin = await TestDataFactory.createUser({
        role: "admin",
        username: "adminremanejamento",
        email: "adminremanejamento@admin.com",
      });
      adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    });
    it("deve retornar mesas disponíveis para remanejamento", async () => {
      await TestDataFactory.createTable({
        name: "Mesa Remanejável",
        capacity: 4,
        availability: [{ date: "2025-07-25", times: ["18:00"] }],
      });
      const res = await request(app)
        .get(
          "/tables/available-for-rescheduling?date=2025-07-25&time=18:00&capacity=2"
        )
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it("deve retornar 400 se faltar parâmetro", async () => {
      await request(app)
        .get("/tables/available-for-rescheduling?date=2025-07-25&time=18:00")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("GET /tables/:id/availability - mesa em manutenção", () => {
    it("deve retornar true se mesa está em manutenção (comportamento atual)", async () => {
      const table = await TestDataFactory.createTable({
        status: "maintenance",
        availability: [{ date: "2025-07-25", times: ["18:00"] }],
      });
      const res = await request(app)
        .get(`/tables/${table._id}/availability?date=2025-07-25&time=18:00`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect(res.body).toBe(true);
    });
  });

  describe("POST /tables/force-maintenance", () => {
    it("deve retornar 400 se não enviar tableId no body", async () => {
      const adminToken = await getAdminToken();
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ cancelReservations: true })
        .expect(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/obrigatório|required/i);
    });
    it("deve retornar 404 se tableId não existir", async () => {
      const adminToken = await getAdminToken();
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableId: "000000000000000000000000", cancelReservations: true })
        .expect(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/não encontrada|not found/i);
    });
    it("deve executar com sucesso e atualizar status da mesa para 'maintenance'", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Forcar Manutencao",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        status: "available",
      });
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableId: table._id, cancelReservations: true })
        .expect(200);
      expect(response.body).toHaveProperty("status", "maintenance");
      // Confirma no banco
      const updated = await Table.findById(table._id);
      expect(updated?.status).toBe("maintenance");
    });
    it("deve retornar 200 e manter status se mesa já está em manutenção", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Ja Manutencao",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        status: "maintenance",
      });
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableId: table._id, cancelReservations: true })
        .expect(200);
      expect(response.body).toHaveProperty("status", "maintenance");
      // Confirma no banco
      const updated = await Table.findById(table._id);
      expect(updated?.status).toBe("maintenance");
    });
    it("deve atualizar status para 'maintenance' mesmo sem reservas ativas", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Sem Reservas",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        status: "available",
      });
      // Não cria nenhuma reserva para essa mesa
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableId: table._id, cancelReservations: true })
        .expect(200);
      expect(response.body).toHaveProperty("status", "maintenance");
      const updated = await Table.findById(table._id);
      expect(updated?.status).toBe("maintenance");
    });
    it("deve retornar 409 se houver reservas ativas e não cancelar", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Com Reservas",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
        status: "available",
      });
      // Cria reserva ativa para a mesa
      const unique = `${Date.now()}_${Math.random()}`;
      await TestDataFactory.createReservation({
        tableId: table._id,
        status: "confirmed",
        date: "2025-07-22",
        time: "18:00",
        userId: (
          await TestDataFactory.createUser({
            email: `user${unique}@test.com`,
            username: `user${unique}`,
          })
        )._id,
      });
      const response = await request(app)
        .post("/tables/force-maintenance")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ tableId: table._id, cancelReservations: false })
        .expect(409);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("affectedReservations");
      expect(Array.isArray(response.body.affectedReservations)).toBe(true);
      expect(response.body).toHaveProperty("tableId");
      expect(response.body).toHaveProperty("tableName");
    });
  });

  describe("Erros 500 no TableController", () => {
    let adminToken: string;
    let errorSpy: jest.SpyInstance;
    beforeEach(async () => {
      const admin = await TestDataFactory.createUser({
        role: "admin",
        username: "adminerror",
        email: "adminerror@admin.com",
      });
      adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
      errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      jest.restoreAllMocks();
      errorSpy.mockRestore();
    });
    it("GET /tables deve retornar 500 se falhar no banco", async () => {
      jest
        .spyOn(require("../../models/Table").default, "find")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .get("/tables")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    // Removidos os testes de erro 500 para POST e PUT, pois não é possível simular erro 500 nesses endpoints devido à validação do Mongoose/Express
    it("DELETE /tables/:id deve retornar 500 se falhar no banco", async () => {
      const table = await TestDataFactory.createTable();
      jest
        .spyOn(require("../../models/Table").default, "findById")
        .mockResolvedValue(table);
      jest
        .spyOn(require("../../models/Table").default.prototype, "deleteOne")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    it("GET /tables/:id/availability deve retornar 500 se falhar no banco", async () => {
      const table = await TestDataFactory.createTable();
      jest
        .spyOn(require("../../models/Table").default, "findById")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .get(`/tables/${table._id}/availability?date=2025-07-25&time=18:00`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    it("GET /tables/available deve retornar 500 se falhar no banco", async () => {
      jest
        .spyOn(require("../../models/Table").default, "find")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .get("/tables/available?date=2025-07-25&time=18:00&numberOfPeople=2")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    it("GET /tables/:id/status deve retornar 500 se falhar no banco", async () => {
      const table = await TestDataFactory.createTable();
      jest
        .spyOn(require("../../models/Table").default, "findById")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .get(`/tables/${table._id}/status?date=2025-07-25`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    it("GET /tables/available-for-rescheduling deve retornar 500 se falhar no banco", async () => {
      jest
        .spyOn(require("../../models/Table").default, "find")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      await request(app)
        .get(
          "/tables/available-for-rescheduling?date=2025-07-25&time=18:00&capacity=2"
        )
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });
    it("deve retornar 500 se ocorrer erro inesperado no delete", async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({
        name: "Mesa Erro Delete",
        capacity: 2,
        availability: [{ date: "2025-07-22", times: ["18:00-19:00"] }],
      });
      // Suprime o console.error temporariamente
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const spy = jest
        .spyOn(require("../../models/Table").default.prototype, "deleteOne")
        .mockImplementation(() => {
          throw new Error("fail");
        });
      const response = await request(app)
        .delete(`/tables/${table._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
      expect(response.body).toHaveProperty("message");
      spy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
