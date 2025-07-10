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
  const { isAuthenticated, isLoading, user } = useAuth();

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

  // Não autenticado - redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=true" replace />;
  }

  // Verificar permissão de admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
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
