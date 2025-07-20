import { z } from "zod";
import {
  userSchema as registerSchemaShared,
  loginSchema as loginSchemaShared,
  forgotPasswordSchema as forgotPasswordSchemaShared,
} from "@restaurant-reservation/shared";

// Schema para login (Zod)
export const loginSchema = loginSchemaShared;
export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para registro (Zod)
export const registerSchema = registerSchemaShared;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Schema para alterar senha (Zod)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),
    confirmNewPassword: z
      .string()
      .min(1, "Confirmação da nova senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não conferem",
    path: ["confirmNewPassword"],
  });

export const forgotPasswordSchema = forgotPasswordSchemaShared;
