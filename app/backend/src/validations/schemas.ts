import { z } from "zod";
import {
  reservationSchema,
  configSchema,
  tableSchema,
} from "@shared/validation/schemas";

// Schema de usuário para registro (sem confirmPassword)
export const userSchema = z.object({
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
  role: z.enum(["client", "admin"]).default("client"),
  adminCode: z.string().optional(),
});

// Schema de login
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

// Schema para atualizar perfil
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  currentPassword: z.string().min(1, "Senha atual é obrigatória").optional(),
});

// Schema para trocar senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirmação de senha é obrigatória"),
});

// Schema para deletar conta
export const deleteAccountSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Senha atual é obrigatória para deletar a conta"),
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: "Digite 'DELETE' para confirmar" }),
  }),
});

export { reservationSchema, configSchema, tableSchema };
