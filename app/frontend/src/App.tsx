import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
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
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Não fazer retry para erros 409 (parte do fluxo normal)
        if (error?.response?.status === 409) {
          return false;
        }
        return failureCount < 3;
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
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
