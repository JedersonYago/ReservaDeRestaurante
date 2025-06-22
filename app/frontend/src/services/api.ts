import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
  baseURL: "/api",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;

export const configApi = {
  async getConfig() {
    const response = await api.get("/config");
    return response.data;
  },
  async updateConfig(data: any) {
    const response = await api.put("/config", data);
    return response.data;
  },
};
