import { z } from "zod";

// Schema para login (Zod)
export const loginSchema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para registro (Zod)
export const registerSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    username: z
      .string()
      .min(1, "O nome de usuário é obrigatório")
      .min(3, "O nome de usuário deve ter no mínimo 3 caracteres")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "O nome de usuário deve conter apenas letras, números e underscore"
      ),
    password: z
      .string()
      .min(1, "A senha é obrigatória")
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    role: z.enum(["client", "admin"]).default("client"),
    adminCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
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

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});
