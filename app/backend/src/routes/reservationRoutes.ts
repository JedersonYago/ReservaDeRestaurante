import { Router } from "express";
import {
  createReservation,
  listReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  getAvailableTimes,
} from "../controllers/reservationController";
import { authMiddleware, roleMiddleware } from "../middlewares/security";
import { validate } from "../middlewares/validate";
import Joi from "joi";

const router = Router();

// Schema de validação para reservas
const reservationSchema = Joi.object({
  data: Joi.date().required().messages({
    "date.base": "Data inválida",
    "any.required": "Data é obrigatória",
  }),
  horario: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Formato de hora inválido (use HH:mm)",
      "any.required": "Horário é obrigatório",
    }),
  numeroPessoas: Joi.number().min(1).max(20).required().messages({
    "number.base": "Número de pessoas deve ser um número",
    "number.min": "Mínimo de 1 pessoa",
    "number.max": "Máximo de 20 pessoas",
    "any.required": "Número de pessoas é obrigatório",
  }),
  nome: Joi.string().required().messages({
    "string.base": "Nome deve ser um texto",
    "any.required": "Nome é obrigatório",
  }),
  telefone: Joi.string().required().messages({
    "string.base": "Telefone deve ser um texto",
    "any.required": "Telefone é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
});

// Rota pública para verificar horários disponíveis
router.get("/available-times", getAvailableTimes);

// Rotas que requerem autenticação
router.use(authMiddleware);

// Criar reserva
router.post("/", validate(reservationSchema), createReservation);

// Listar reservas do usuário
router.get("/", listReservations);

// Obter reserva específica
router.get("/:id", getReservation);

// Atualizar reserva
router.put("/:id", validate(reservationSchema), updateReservation);

// Cancelar reserva
router.put("/:id/cancel", cancelReservation);

// Rotas que requerem papel de admin
router.use(roleMiddleware(["admin"]));

// Listar todas as reservas (admin)
router.get("/admin/all", listReservations);

export default router;
