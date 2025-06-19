import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { GlobalStyle } from "./styles/global";

const queryClient = new QueryClient();

function App() {
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
