import api from "./api";
import type { User, LoginData, RegisterData } from "../types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await api.post<{ user: User; token: string }>(
      "/auth/login",
      data
    );
    const { user, token } = response.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post<{ user: User; token: string }>(
      "/auth/register",
      data
    );
    const { user, token } = response.data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
