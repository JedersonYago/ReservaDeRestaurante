import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalStyle } from "./styles/global";
import { initializeAuthCleanup } from "./utils/authUtils";
import { useEffect } from "react";
import { ConfigProvider } from "./components/ConfigProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não fazer retry para erros 409 (parte do fluxo normal)
        if (error?.response?.status === 409) {
          return false;
        }
        // Não fazer retry para erros 429 (too many requests)
        if (error?.response?.status === 429) {
          return false;
        }
        // Para erros de conexão (backend iniciando), fazer mais tentativas
        if (
          error?.code === "ECONNREFUSED" ||
          error?.code === "ERR_NETWORK" ||
          error?.message?.includes("Network Error")
        ) {
          return failureCount < 5;
        }
        return failureCount < 2; // Para outros erros, manter 2 tentativas
      },
      retryDelay: (attemptIndex, error: any) => {
        // Para erros de conexão, delay menor para reconectar mais rápido
        if (
          error?.code === "ECONNREFUSED" ||
          error?.code === "ERR_NETWORK" ||
          error?.message?.includes("Network Error")
        ) {
          return Math.min(1000 * attemptIndex, 3000); // 1s, 2s, 3s...
        }
        return Math.min(1000 * 2 ** attemptIndex, 30000); // Delay exponencial para outros erros
      },
      staleTime: 5 * 60 * 1000, // 5 minutos padrão
      refetchOnWindowFocus: false, // Desabilita refetch automático no foco
      refetchOnReconnect: true, // Habilita refetch quando reconectar (útil quando backend volta)
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Não fazer retry para erros 409 (parte do fluxo normal)
        if (error?.response?.status === 409) {
          return false;
        }
        // Não fazer retry para erros 429 (too many requests)
        if (error?.response?.status === 429) {
          return false;
        }
        return failureCount < 1; // Reduzido para 1 retry apenas
      },
    },
  },
});

function App() {
  // Inicializar limpeza de dados antigos na primeira execução
  useEffect(() => {
    initializeAuthCleanup();

    // Debug da configuração da API
    if (import.meta.env.PROD) {
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <ThemeProvider>
          <GlobalStyle />
          <ErrorBoundary>
            <ToastProvider>
              <ScrollToTop />
              <AppRoutes />
            </ToastProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
