import { z } from "zod";
import {
  userSchema,
  reservationSchema,
  configSchema,
  tableSchema,
} from "@shared/validation/schemas";

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
  phone: z.string().optional(),
});

// Schema para trocar senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirmação de senha é obrigatória"),
});

// Schema para deletar conta
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Senha é obrigatória para confirmar exclusão"),
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: "Digite 'DELETE' para confirmar" }),
  }),
});

export { userSchema, reservationSchema, configSchema, tableSchema };
