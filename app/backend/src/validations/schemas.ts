import Joi from "joi";

// Esquema de validação para usuário
export const userSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    "string.min": "O nome deve ter no mínimo 3 caracteres",
    "string.max": "O nome deve ter no máximo 100 caracteres",
    "any.required": "O nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "O email é obrigatório",
  }),
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "O nome de usuário deve ter no mínimo 3 caracteres",
    "string.max": "O nome de usuário deve ter no máximo 30 caracteres",
    "any.required": "O nome de usuário é obrigatório",
  }),
  senha: Joi.string().min(6).required().messages({
    "string.min": "A senha deve ter no mínimo 6 caracteres",
    "any.required": "A senha é obrigatória",
  }),
  role: Joi.string().valid("cliente", "admin").default("cliente").messages({
    "any.only": "O papel deve ser cliente ou admin",
  }),
});

// Esquema de validação para mesa
export const tableSchema = Joi.object({
  numero: Joi.number().integer().positive().required().messages({
    "number.base": "O número da mesa deve ser um número",
    "number.integer": "O número da mesa deve ser um número inteiro",
    "number.positive": "O número da mesa deve ser positivo",
    "any.required": "O número da mesa é obrigatório",
  }),
  capacidade: Joi.number().integer().min(1).max(20).required().messages({
    "number.base": "A capacidade deve ser um número",
    "number.integer": "A capacidade deve ser um número inteiro",
    "number.min": "A capacidade mínima é 1 pessoa",
    "number.max": "A capacidade máxima é 20 pessoas",
    "any.required": "A capacidade é obrigatória",
  }),
});

// Esquema de validação para reserva
export const reservationSchema = Joi.object({
  data: Joi.date().min("now").required().messages({
    "date.base": "Data inválida",
    "date.min": "A data deve ser futura",
    "any.required": "A data é obrigatória",
  }),
  hora: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Formato de hora inválido (use HH:mm)",
      "any.required": "A hora é obrigatória",
    }),
  numeroPessoas: Joi.number().integer().min(1).max(20).required().messages({
    "number.base": "O número de pessoas deve ser um número",
    "number.integer": "O número de pessoas deve ser um número inteiro",
    "number.min": "O número mínimo de pessoas é 1",
    "number.max": "O número máximo de pessoas é 20",
    "any.required": "O número de pessoas é obrigatório",
  }),
  status: Joi.string()
    .valid("pendente", "confirmada", "cancelada")
    .default("pendente")
    .messages({
      "any.only": "Status inválido",
    }),
});
