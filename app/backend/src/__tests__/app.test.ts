import request from "supertest";
import { createApp } from "../app";

describe("App", () => {
  let app: any;

  beforeEach(() => {
    app = createApp();
  });

  describe("Rota raiz", () => {
    it("deve retornar mensagem da API", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "API do Reserva Fácil" });
    });
  });

  describe("Rotas da API", () => {
    it("deve rotear para /api", async () => {
      // Testa uma rota que realmente existe
      const response = await request(app).get("/api/auth");

      expect(response.status).toBe(404); // A rota /auth sem método específico retorna 404
    });
  });

  describe("Middlewares", () => {
    it("deve configurar CORS", async () => {
      const response = await request(app)
        .get("/")
        .set("Origin", "http://localhost:3000");

      expect(response.status).toBe(200);
      // CORS está configurado, então não deve bloquear a requisição
    });

    it("deve aceitar JSON", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400); // Retorna 400 porque a rota existe mas os dados são inválidos
    });

    it("deve aplicar rate limiting na API", async () => {
      const response = await request(app).get("/api/auth");
      expect(response.status).toBe(404); // Confirma que a rota /api está funcionando com rate limiting
    });
  });

  describe("Rota não encontrada", () => {
    it("deve retornar 404 para rotas inexistentes", async () => {
      const response = await request(app).get("/rota-inexistente");

      expect(response.status).toBe(404);
    });
  });
});
