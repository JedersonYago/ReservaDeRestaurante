import { z } from "zod";

// Schema de Usuário
export const userSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    username: z
      .string()
      .min(3, "O nome de usuário deve ter no mínimo 3 caracteres")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "O nome de usuário deve conter apenas letras, números e underscore"
      ),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
    role: z.enum(["client", "admin"]).default("client"),
    adminCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UserSchema = z.infer<typeof userSchema>;

// Schema de Reserva
export const reservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário inválido. Use o formato HH:mm"
    ),
  tableId: z.string().min(1, "A mesa é obrigatória"),
  customerName: z.string().min(1, "O nome do cliente é obrigatório"),
  customerEmail: z.string().email("Email inválido"),
  observations: z.string().optional(),
});

export type ReservationSchema = z.infer<typeof reservationSchema>;

// Schema de Configuração
export const configSchema = z.object({
  maxReservationsPerUser: z.number().min(1).max(20),
  reservationLimitHours: z.number().min(1).max(168),
  minIntervalBetweenReservations: z.number().min(1).max(120),
  openingHour: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário inválido. Use o formato HH:mm"
    ),
  closingHour: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário inválido. Use o formato HH:mm"
    ),
  isReservationLimitEnabled: z.boolean(),
  isIntervalEnabled: z.boolean(),
  isOpeningHoursEnabled: z.boolean(),
});

export type ConfigSchema = z.infer<typeof configSchema>;

// Schema de Mesa
export const tableSchema = z.object({
  name: z.string().min(1, "O nome da mesa é obrigatório"),
  capacity: z.number().min(1, "A capacidade deve ser maior que zero"),
  status: z
    .enum(["available", "reserved", "maintenance", "expired"])
    .default("available"),
  availability: z
    .array(
      z.object({
        date: z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Data deve estar no formato YYYY-MM-DD"
          ),
        times: z
          .array(
            z
              .string()
              .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                "Horário deve estar no formato HH:mm-HH:mm"
              )
          )
          .min(1, "Pelo menos um horário deve ser informado"),
      })
    )
    .min(1, "Pelo menos um bloco de disponibilidade deve ser informado"),
});

export type TableSchema = z.infer<typeof tableSchema>;

// Schema de Login
export const loginSchema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

// Esquema de validação para solicitar recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

// Esquema de validação para redefinir senha
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  newPassword: z
    .string()
    .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirmação de senha é obrigatória"),
});
