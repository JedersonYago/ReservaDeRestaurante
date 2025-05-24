import { Router } from "express";
import {
  getConfig,
  updateConfig,
  getConfigHistory,
} from "../controllers/configController";
import { authMiddleware, roleMiddleware } from "../middlewares/security";
import { validate } from "../middlewares/validate";
import Joi from "joi";

const router = Router();

// Schema de validação para configurações
const configSchema = Joi.object({
  maxReservationsPerTime: Joi.number().min(1).max(20).required().messages({
    "number.base": "O limite de reservas deve ser um número",
    "number.min": "O limite mínimo de reservas é 1",
    "number.max": "O limite máximo de reservas é 20",
    "any.required": "O limite de reservas é obrigatório",
  }),
  minIntervalBetweenReservations: Joi.number()
    .min(15)
    .max(120)
    .required()
    .messages({
      "number.base": "O intervalo mínimo deve ser um número",
      "number.min": "O intervalo mínimo é 15 minutos",
      "number.max": "O intervalo máximo é 120 minutos",
      "any.required": "O intervalo mínimo é obrigatório",
    }),
  openingHour: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Formato de hora inválido (use HH:mm)",
      "any.required": "O horário de abertura é obrigatório",
    }),
  closingHour: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Formato de hora inválido (use HH:mm)",
      "any.required": "O horário de fechamento é obrigatório",
    }),
  timeSlots: Joi.number().min(15).max(120).required().messages({
    "number.base": "O intervalo de tempo deve ser um número",
    "number.min": "O intervalo mínimo é 15 minutos",
    "number.max": "O intervalo máximo é 120 minutos",
    "any.required": "O intervalo de tempo é obrigatório",
  }),
});

// Todas as rotas requerem autenticação e papel de admin
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Rotas de configuração
router.get("/", getConfig);
router.get("/history", getConfigHistory);
router.put("/", validate(configSchema), updateConfig);

export default router;
