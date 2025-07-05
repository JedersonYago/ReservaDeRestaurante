import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styled from "styled-components";
import { Activity } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <Activity size={32} />
        </LoadingSpinner>
        <LoadingText>Verificando autenticação...</LoadingText>
      </LoadingContainer>
    );
  }

  // Erro de autenticação
  if (error && !isAuthenticated) {
    return (
      <ErrorContainer>
        <ErrorText>Erro ao verificar autenticação</ErrorText>
        <RetryButton onClick={() => window.location.reload()}>
          Tentar Novamente
        </RetryButton>
      </ErrorContainer>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar permissão de admin
  if (adminOnly && user?.role !== "admin") {
    // Redireciona para o dashboard, sem forçar revalidação do token
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return <>{children}</>;
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
  }
`;
