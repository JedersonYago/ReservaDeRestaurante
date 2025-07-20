import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "../../components/Layout/Container";
import { PageWrapper } from "../../components/Layout/PageWrapper";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";
import { useThemeContext } from "../../components/ThemeProvider";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import {
  ErrorContainer,
  ErrorContent,
  ErrorCode,
  ErrorTitle,
  ErrorMessage,
  ErrorActions,
  ErrorIllustration,
  BackgroundPattern,
} from "./styles";

interface ErrorPageProps {
  errorCode?: string;
  errorTitle?: string;
  errorMessage?: string;
  showReload?: boolean;
}

export function ErrorPage({
  errorCode = "404",
  errorTitle = "Página não encontrada",
  errorMessage = "A página que você está procurando não existe ou foi removida.",
  showReload = false,
}: ErrorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToTop } = useScrollToTop();
  const [countdown, setCountdown] = useState(10);
  const { isDark } = useThemeContext();

  // Scroll para o topo ao carregar a página de erro
  useEffect(() => {
    scrollToTop("auto");
  }, [scrollToTop]);

  // Countdown para redirecionamento automático em caso de erro 500
  useEffect(() => {
    if (errorCode === "500" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (errorCode === "500" && countdown === 0) {
      navigate("/dashboard");
    }
  }, [countdown, errorCode, navigate]);

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getErrorIcon = () => {
    switch (errorCode) {
      case "404":
        return "🔍";
      case "500":
        return "⚠️";
      case "403":
        return "🔒";
      default:
        return "❌";
    }
  };

  return (
    <PageWrapper>
      <Container>
        <ErrorContainer>
          <BackgroundPattern />

          <ErrorContent>
            <Logo key={isDark ? "dark" : "light"} />

            <ErrorIllustration>{getErrorIcon()}</ErrorIllustration>

            <ErrorCode>{errorCode}</ErrorCode>
            <ErrorTitle>{errorTitle}</ErrorTitle>
            <ErrorMessage>{errorMessage}</ErrorMessage>

            {errorCode === "500" && countdown > 0 && (
              <ErrorMessage>
                Redirecionando automaticamente em {countdown} segundos...
              </ErrorMessage>
            )}

            <ErrorActions>
              <Button onClick={handleGoHome}>Ir para Dashboard</Button>

              <Button variant="outline" onClick={handleGoBack}>
                Voltar
              </Button>

              {showReload && (
                <Button variant="outline" onClick={handleReload}>
                  Recarregar Página
                </Button>
              )}
            </ErrorActions>

            {process.env.NODE_ENV === "development" && (
              <details
                style={{ marginTop: "2rem", fontSize: "0.8rem", opacity: 0.7 }}
              >
                <summary>Debug Info (apenas desenvolvimento)</summary>
                <pre style={{ marginTop: "1rem", textAlign: "left" }}>
                  {`Current Path: ${location.pathname}
Error Code: ${errorCode}
Timestamp: ${new Date().toISOString()}`}
                </pre>
              </details>
            )}
          </ErrorContent>
        </ErrorContainer>
      </Container>
    </PageWrapper>
  );
}
