import api from "./api";
import type { User, LoginData, RegisterData } from "../types";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  _refreshToken: null as string | null,

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    const { user, accessToken, refreshToken } = response.data;

    this.setTokens(accessToken, refreshToken);
    this.setUser(user);

    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    const { user, accessToken, refreshToken } = response.data;

    this.setTokens(accessToken, refreshToken);
    this.setUser(user);

    return response.data;
  },

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await api.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });

      const {
        user,
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data;

      this.setTokens(accessToken, newRefreshToken);
      this.setUser(user);

      return response.data;
    } catch (error) {
      console.error("[authService.refreshToken] Erro:", error);
      this.logout();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("[authService.logout] Erro:", error);
    } finally {
      this.clearAuth();
    }
  },

  async logoutAll(): Promise<void> {
    try {
      await api.post("/auth/logout-all");
    } catch (error) {
      console.error("[authService.logoutAll] Erro:", error);
    } finally {
      this.clearAuth();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>("/auth/me");
      const user = response.data;
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("[authService.getCurrentUser] Erro:", error);
      return null;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await api.get<{ valid: boolean }>("/auth/validate");
      return response.data.valid;
    } catch (error) {
      console.error("[authService.validateToken] Erro:", error);
      return false;
    }
  },

  // Métodos auxiliares para gerenciar tokens e usuário
  setTokens(accessToken: string, refreshToken: string): void {
    // Access token em memória ou sessionStorage para maior segurança
    sessionStorage.setItem(TOKEN_KEY, accessToken);

    // Refresh token deve ser armazenado como httpOnly cookie pelo backend
    // Aqui apenas atualizamos o estado local
    this._refreshToken = refreshToken;
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    // O refresh token deve vir dos cookies, não do storage
    return this._refreshToken;
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  clearAuth(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this._refreshToken = null;
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Verificar se o token está próximo de expirar (5 minutos antes)
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;

      // Considera expirando se faltar menos de 5 minutos
      return timeUntilExpiry < 300;
    } catch {
      return true;
    }
  },
};
