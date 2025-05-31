import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nome: string;
  username: string;
  email: string;
  senha: string;
  role: "cliente" | "admin";
  adminCode?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    username: string;
    role: "cliente" | "admin";
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      await api.get("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch {
      return false;
    }
  },
};
