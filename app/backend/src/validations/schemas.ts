import Joi from "joi";

// Esquema de validação para usuário
export const userSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      "string.min": "O nome deve ter no mínimo 3 caracteres",
      "string.max": "O nome deve ter no máximo 100 caracteres",
      "string.pattern.base": "O nome deve conter apenas letras e espaços",
      "any.required": "O nome é obrigatório",
    }),
  email: Joi.string().email().max(100).required().messages({
    "string.email": "Email inválido",
    "string.max": "O email deve ter no máximo 100 caracteres",
    "any.required": "O email é obrigatório",
  }),
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "O nome de usuário deve ter no mínimo 3 caracteres",
      "string.max": "O nome de usuário deve ter no máximo 30 caracteres",
      "string.pattern.base":
        "O nome de usuário deve conter apenas letras, números e underscore",
      "any.required": "O nome de usuário é obrigatório",
    }),
  senha: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "A senha deve ter no mínimo 8 caracteres",
      "string.pattern.base":
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
      "any.required": "A senha é obrigatória",
    }),
  role: Joi.string().valid("cliente", "admin").default("cliente").messages({
    "any.only": "O papel deve ser cliente ou admin",
  }),
  adminCode: Joi.string().when("role", {
    is: "admin",
    then: Joi.required().messages({
      "any.required":
        "Código de administrador é obrigatório para criar conta de admin",
    }),
    otherwise: Joi.forbidden().messages({
      "any.unknown":
        "Código de administrador não deve ser fornecido para contas de cliente",
    }),
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
  status: Joi.string()
    .valid("disponivel", "ocupada", "reservada", "manutencao")
    .default("disponivel")
    .messages({
      "any.only": "Status inválido",
    }),
});

// Esquema de validação para reserva
export const reservationSchema = Joi.object({
  data: Joi.date().min("now").max(Joi.ref("dataMaxima")).required().messages({
    "date.base": "Data inválida",
    "date.min": "A data deve ser futura",
    "date.max": "A data não pode ser mais que 30 dias no futuro",
    "any.required": "A data é obrigatória",
  }),
  dataMaxima: Joi.date().default(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
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
    .valid("pendente", "confirmada", "cancelada", "concluida")
    .default("pendente")
    .messages({
      "any.only": "Status inválido",
    }),
  observacoes: Joi.string().max(500).allow("").messages({
    "string.max": "As observações devem ter no máximo 500 caracteres",
  }),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\) \d{5}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Formato de telefone inválido (use (XX) XXXXX-XXXX)",
      "any.required": "O telefone é obrigatório",
    }),
});

// Esquema de validação para login
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "O nome de usuário é obrigatório",
  }),
  senha: Joi.string().required().messages({
    "any.required": "A senha é obrigatória",
  }),
});
