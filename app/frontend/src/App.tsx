import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalStyle } from "./styles/global";
import { initializeAuthCleanup } from "./utils/authUtils";
import { useEffect } from "react";

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
        return failureCount < 2; // Reduzido de 3 para 2
      },
      staleTime: 5 * 60 * 1000, // 5 minutos padrão
      refetchOnWindowFocus: false, // Desabilita refetch automático no foco
      refetchOnReconnect: false, // Desabilita refetch automático na reconexão
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
  }, []);

  return (
    <ThemeProvider>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ToastProvider>
            <ScrollToTop />
            <AppRoutes />
          </ToastProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
