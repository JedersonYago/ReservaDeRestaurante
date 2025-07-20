import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag para evitar múltiplas requisições de refresh simultâneas
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config: any) => {
    const token = authService.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Verificar se é erro de conexão (backend iniciando)
    const isConnectionError = !error.response && (
      error.code === 'ECONNREFUSED' || 
      error.code === 'ERR_NETWORK' || 
      error.message?.includes('Network Error')
    );

    // Log estruturado do erro (exceto 409 que é parte do fluxo normal e erros de conexão durante inicialização)
    if (error.response?.status !== 409 && !isConnectionError) {
      console.error("[API Response Error]", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      });
    } else if (isConnectionError) {
      // Log mais amigável para erros de conexão
      console.log(`⏳ Tentando conectar ao backend (${error.config?.url})...`);
    }

    // Tratar erros específicos
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Tempo limite da requisição excedido"));
    }

    if (!error.response) {
      // Para erros de conexão, retornar erro mais amigável
      if (isConnectionError) {
        return Promise.reject(new Error("Aguardando backend inicializar..."));
      }
      return Promise.reject(new Error("Erro de conexão com o servidor"));
    }

    // URLs que não devem ser tratadas como erro de token expirado
    const authUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];
    const isAuthRequest = authUrls.some((url) =>
      originalRequest.url?.includes(url)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const authData = await authService.refreshToken();
        if (authData) {
          processQueue(null, authData.accessToken);
          originalRequest.headers.Authorization =
            "Bearer " + authData.accessToken;
          return api(originalRequest);
        } else {
          throw new Error("Falha no refresh do token");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearAuth();

        // Só redirecionar se não estivermos já na página de login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?error=session_expired";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Tratar outros erros HTTP comuns
    switch (error.response.status) {
      case 403:
        return Promise.reject(new Error("Acesso não autorizado"));
      case 404:
        return Promise.reject(new Error("Recurso não encontrado"));
      case 429:
        return Promise.reject(
          new Error("Muitas requisições. Tente novamente em alguns minutos")
        );
      case 500:
        return Promise.reject(new Error("Erro interno do servidor"));
      default:
        return Promise.reject(error);
    }
  }
);

export default api;

export const configApi = {
  async getPublicConfig() {
    const response = await api.get("/config/public");
    return response.data;
  },
  async getConfig() {
    const response = await api.get("/config");
    return response.data;
  },
  async updateConfig(data: any) {
    const response = await api.put("/config", data);
    return response.data;
  },
};
