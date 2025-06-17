import * as yup from "yup";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "../utils/validationPatterns";

// Schema para login
export const loginSchema = yup.object().shape({
  username: yup.string().required("Nome de usuário é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

// Schema para alterar senha
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Senha atual é obrigatória"),
  newPassword: yup
    .string()
    .min(8, "A nova senha deve ter no mínimo 8 caracteres")
    .matches(
      VALIDATION_PATTERNS.STRONG_PASSWORD,
      VALIDATION_MESSAGES.STRONG_PASSWORD
    )
    .required("Nova senha é obrigatória"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não conferem")
    .required("Confirmação da nova senha é obrigatória"),
});

// Schema para registro
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .matches(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.NAME)
    .required("Nome é obrigatório"),
  username: yup
    .string()
    .min(3, "O nome de usuário deve ter no mínimo 3 caracteres")
    .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
    .matches(VALIDATION_PATTERNS.USERNAME, VALIDATION_MESSAGES.USERNAME)
    .required("Nome de usuário é obrigatório"),
  email: yup
    .string()
    .email("Email inválido")
    .max(100, "O email deve ter no máximo 100 caracteres")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(
      VALIDATION_PATTERNS.STRONG_PASSWORD,
      VALIDATION_MESSAGES.STRONG_PASSWORD
    )
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não conferem")
    .required("Confirmação de senha é obrigatória"),
  role: yup
    .string()
    .oneOf(["client", "admin"])
    .required("Tipo de conta é obrigatório"),
  adminCode: yup
    .string()
    .nullable()
    .default(undefined)
    .when("role", {
      is: "admin",
      then: (schema) =>
        schema.required("Código de administrador é obrigatório"),
    }),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "client" | "admin";
  adminCode?: string | null;
}
