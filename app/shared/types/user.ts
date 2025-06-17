import { BaseEntity, UserRole } from "./common";

/**
 * Interface unificada para usuário
 */
export interface User extends BaseEntity {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  // Controle de mudanças de email
  emailChanges?: {
    count: number;
    remaining: number;
    lastChangeAt?: Date;
    blockedUntil?: Date;
  };
  // Controle de mudanças de username
  usernameChanges?: {
    count: number;
    remaining: number;
    lastChangeAt?: Date;
    blockedUntil?: Date;
  };
}

/**
 * Dados para login
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Dados para registro
 */
export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  adminCode?: string;
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
  token: string;
  user: User;
}
