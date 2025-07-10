import Joi from "joi";
import { VALIDATION_LIMITS } from "../config/constants";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "../config/validationPatterns";

// Esquema de validação para login
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "O nome de usuário é obrigatório",
    "any.required": "O nome de usuário é obrigatório",
  }),
  password: Joi.string().required().messages({
    "string.empty": "A senha é obrigatória",
    "any.required": "A senha é obrigatória",
  }),
});

// Esquema de validação para usuário
export const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome é obrigatório",
    "any.required": "O nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "string.empty": "O email é obrigatório",
    "any.required": "O email é obrigatório",
  }),
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(VALIDATION_PATTERNS.USERNAME)
    .required()
    .messages({
      "string.min": "O nome de usuário deve ter no mínimo 3 caracteres",
      "string.max": "O nome de usuário deve ter no máximo 30 caracteres",
      "string.pattern.base": VALIDATION_MESSAGES.USERNAME,
      "any.required": "O nome de usuário é obrigatório",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "A senha deve ter no mínimo 8 caracteres",
    "string.empty": "A senha é obrigatória",
    "any.required": "A senha é obrigatória",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "As senhas não conferem",
    "any.required": "Confirmação de senha é obrigatória",
  }),
  role: Joi.string().valid("client", "admin").default("client"),
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

// Esquema de validação para mudança de senha
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "A senha atual é obrigatória",
    "any.required": "A senha atual é obrigatória",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(VALIDATION_PATTERNS.STRONG_PASSWORD)
    .required()
    .messages({
      "string.min": "A nova senha deve ter no mínimo 8 caracteres",
      "string.pattern.base": VALIDATION_MESSAGES.STRONG_PASSWORD,
      "string.empty": "A nova senha é obrigatória",
      "any.required": "A nova senha é obrigatória",
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "As senhas não conferem",
      "any.required": "Confirmação da nova senha é obrigatória",
    }),
});

// Esquema de validação para deletar conta
export const deleteAccountSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "A senha atual é obrigatória para deletar a conta",
    "any.required": "A senha atual é obrigatória para deletar a conta",
  }),
});

// Esquema de validação para registro (reutiliza userSchema)
export const registerSchema = userSchema;

// Esquema de validação para atualização de perfil (campos opcionais)
export const updateProfileSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.empty": "O nome não pode estar vazio",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email inválido",
    "string.empty": "O email não pode estar vazio",
  }),
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(VALIDATION_PATTERNS.USERNAME)
    .optional()
    .messages({
      "string.min": "O nome de usuário deve ter no mínimo 3 caracteres",
      "string.max": "O nome de usuário deve ter no máximo 30 caracteres",
      "string.pattern.base": VALIDATION_MESSAGES.USERNAME,
      "string.empty": "O nome de usuário não pode estar vazio",
    }),
  // Senha obrigatória quando alterando email ou username
  currentPassword: Joi.string()
    .when("email", {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .when("username", {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .messages({
      "any.required":
        "Senha atual é obrigatória para alterar email ou nome de usuário",
    }),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });

// Schema helper para intervalo de horário
const timeIntervalSchema = Joi.object({
  start: Joi.string().pattern(VALIDATION_PATTERNS.TIME).required(),
  end: Joi.string().pattern(VALIDATION_PATTERNS.TIME).required(),
});

// Schema helper para array de horários por dia
const dayHoursSchema = Joi.array().items(timeIntervalSchema).required();

// Esquema Joi para horários flexíveis por dia da semana
const availableHoursByDayJoi = Joi.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

const availabilityBlockJoi = Joi.object({
  daysOfWeek: Joi.array().items(
    Joi.string().valid(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    )
  ),
  specificDate: Joi.string().pattern(VALIDATION_PATTERNS.DATE),
  times: Joi.array()
    .items(Joi.string().pattern(VALIDATION_PATTERNS.TIME).required())
    .min(1)
    .required(),
}).or("daysOfWeek", "specificDate");

// Esquema de validação para mesa
export const tableSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome da mesa é obrigatório",
    "any.required": "O nome da mesa é obrigatório",
  }),
  capacity: Joi.number().min(1).required().messages({
    "number.base": "A capacidade deve ser um número",
    "number.min": "A capacidade deve ser maior que zero",
    "any.required": "A capacidade é obrigatória",
  }),
  status: Joi.string()
    .valid("available", "reserved", "maintenance")
    .default("available")
    .messages({
      "any.only": "Status inválido",
    }),
  availability: Joi.array()
    .items(
      Joi.object({
        date: Joi.string()
          .pattern(VALIDATION_PATTERNS.DATE)
          .required()
          .messages({
            "string.pattern.base": VALIDATION_MESSAGES.DATE,
            "any.required": "Data é obrigatória",
          }),
        times: Joi.array()
          .items(
            Joi.string()
              .pattern(VALIDATION_PATTERNS.TIME_INTERVAL)
              .required()
              .messages({
                "string.pattern.base": VALIDATION_MESSAGES.TIME_INTERVAL,
                "any.required": "Horário é obrigatório",
              })
          )
          .min(1)
          .required()
          .messages({
            "array.min": "Pelo menos um horário deve ser informado",
            "any.required": "Horários são obrigatórios",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Disponibilidade deve ser um array de blocos",
      "array.min": "Pelo menos um bloco de disponibilidade deve ser informado",
      "any.required": "Disponibilidade é obrigatória",
    }),
});

// Esquema de validação para reserva
export const reservationSchema = Joi.object({
  tableId: Joi.string().required().messages({
    "string.empty": "A mesa é obrigatória",
    "any.required": "A mesa é obrigatória",
  }),
  date: Joi.string().pattern(VALIDATION_PATTERNS.DATE).required().messages({
    "string.pattern.base": VALIDATION_MESSAGES.DATE,
    "any.required": "Data é obrigatória",
  }),
  time: Joi.string().pattern(VALIDATION_PATTERNS.TIME).required().messages({
    "string.pattern.base": VALIDATION_MESSAGES.TIME,
    "any.required": "Horário é obrigatório",
  }),
  customerName: Joi.string().required().messages({
    "string.empty": "O nome do cliente é obrigatório",
    "any.required": "O nome do cliente é obrigatório",
  }),
  customerEmail: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "string.empty": "O email do cliente é obrigatório",
    "any.required": "O email do cliente é obrigatório",
  }),
  observations: Joi.string().allow("").optional(),
  userId: Joi.string().required().messages({
    "string.empty": "O ID do usuário é obrigatório",
    "any.required": "O ID do usuário é obrigatório",
  }),
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),
});

// Esquema de validação para configurações
export const configSchema = Joi.object({
  maxReservationsPerUser: Joi.number()
    .min(VALIDATION_LIMITS.maxReservationsPerUser.min)
    .max(VALIDATION_LIMITS.maxReservationsPerUser.max)
    .required()
    .messages({
      "number.base": "O limite de reservas por usuário deve ser um número",
      "number.min": `O limite mínimo de reservas por usuário é ${VALIDATION_LIMITS.maxReservationsPerUser.min}`,
      "number.max": `O limite máximo de reservas por usuário é ${VALIDATION_LIMITS.maxReservationsPerUser.max}`,
      "any.required": "O limite de reservas por usuário é obrigatório",
    }),
  reservationLimitHours: Joi.number()
    .min(VALIDATION_LIMITS.reservationLimitHours.min)
    .max(VALIDATION_LIMITS.reservationLimitHours.max)
    .required()
    .messages({
      "number.base": "O período de limitação deve ser um número",
      "number.min": `O período mínimo é ${VALIDATION_LIMITS.reservationLimitHours.min} hora`,
      "number.max": `O período máximo é ${VALIDATION_LIMITS.reservationLimitHours.max} horas`,
      "any.required": "O período de limitação é obrigatório",
    }),
  minIntervalBetweenReservations: Joi.number()
    .min(VALIDATION_LIMITS.minIntervalBetweenReservations.min)
    .max(VALIDATION_LIMITS.minIntervalBetweenReservations.max)
    .required()
    .messages({
      "number.base": "O tempo de confirmação deve ser um número",
      "number.min": `O tempo mínimo de confirmação é ${VALIDATION_LIMITS.minIntervalBetweenReservations.min} minutos`,
      "number.max": `O tempo máximo de confirmação é ${VALIDATION_LIMITS.minIntervalBetweenReservations.max} minutos`,
      "any.required": "O tempo de confirmação é obrigatório",
    }),
  openingHour: Joi.string()
    .pattern(VALIDATION_PATTERNS.TIME)
    .when("isOpeningHoursEnabled", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.pattern.base": VALIDATION_MESSAGES.TIME,
      "any.required":
        "O horário de abertura é obrigatório quando horários estão ativados",
    }),
  closingHour: Joi.string()
    .pattern(VALIDATION_PATTERNS.TIME)
    .when("isOpeningHoursEnabled", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.pattern.base": VALIDATION_MESSAGES.TIME,
      "any.required":
        "O horário de fechamento é obrigatório quando horários estão ativados",
    }),

  isReservationLimitEnabled: Joi.boolean().required(),
  isIntervalEnabled: Joi.boolean().required(),
  isOpeningHoursEnabled: Joi.boolean().required(),
});

// Esquema de validação para solicitar recuperação de senha
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "string.empty": "O email é obrigatório",
    "any.required": "O email é obrigatório",
  }),
});

// Esquema de validação para redefinir senha
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token é obrigatório",
    "any.required": "Token é obrigatório",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(VALIDATION_PATTERNS.STRONG_PASSWORD)
    .required()
    .messages({
      "string.min": "A nova senha deve ter no mínimo 8 caracteres",
      "string.pattern.base": VALIDATION_MESSAGES.STRONG_PASSWORD,
      "string.empty": "A nova senha é obrigatória",
      "any.required": "A nova senha é obrigatória",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "As senhas não conferem",
      "any.required": "Confirmação de senha é obrigatória",
    }),
});
