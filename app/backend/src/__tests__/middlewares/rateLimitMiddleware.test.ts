import request from "supertest";
import express from "express";
import { authLimiter } from "../../config/rateLimit";

const app = express();
app.use(express.json());
// Rota protegida pelo rate limiter
app.post("/test-login", authLimiter, (req, res) => {
  res.status(200).json({ ok: true });
});

describe("Rate Limiting Middleware", () => {
  it("permite requisições dentro do limite", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/test-login").send({});
      expect(res.status).toBe(200);
    }
  });

  it("bloqueia requisições acima do limite", async () => {
    // O limite em ambiente de teste é 50 por janela
    let lastStatus = 200;
    for (let i = 0; i < 105; i++) {
      const res = await request(app).post("/test-login").send({});
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
