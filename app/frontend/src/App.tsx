import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { GlobalStyle } from "./styles/global";
import { initializeAuthCleanup } from "./utils/authUtils";
import { useEffect } from "react";

const queryClient = new QueryClient();

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
