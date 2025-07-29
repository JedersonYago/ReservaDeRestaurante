import React from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Monitor, Smartphone, Tablet, X, AlertTriangle } from "lucide-react";
import { useToast } from "../Toast";

const SessionManagerContainer = styled.div`
  margin: 20px 0;
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionItem = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${({ theme, $isCurrent }) =>
    $isCurrent ? theme.colors.primary.light : theme.colors.background.tertiary};
  border: 1px solid
    ${({ theme, $isCurrent }) =>
      $isCurrent ? theme.colors.primary.main : theme.colors.border};
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeviceIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 6px;
`;

const SessionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SessionName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SessionDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CurrentBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RevokeButton = styled.button<{ $isCurrent?: boolean }>`
  background: ${({ $isCurrent, theme }) =>
    $isCurrent ? theme.colors.error.light : theme.colors.error.main};
  color: ${({ $isCurrent, theme }) =>
    $isCurrent ? theme.colors.error.main : "white"};
  border: 1px solid ${({ theme }) => theme.colors.error.main};
  padding: 6px 10px;
  border-radius: 4px;
  cursor: ${({ $isCurrent }) => ($isCurrent ? "not-allowed" : "pointer")};
  opacity: ${({ $isCurrent }) => ($isCurrent ? 0.5 : 1)};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error.dark};
    color: white;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const getDeviceIcon = (session: any) => {
  // Lógica simples baseada na data de criação
  const hour = new Date(session.createdAt).getHours();

  if (hour >= 6 && hour <= 18) {
    return <Monitor size={16} />; // Desktop durante o dia
  } else {
    return <Smartphone size={16} />; // Mobile à noite
  }
};

const getDeviceName = (session: any) => {
  const hour = new Date(session.createdAt).getHours();

  if (hour >= 6 && hour <= 18) {
    return "Computador";
  } else {
    return "Dispositivo móvel";
  }
};

export const SessionManager: React.FC = () => {
  const { sessions, sessionsLoading, revokeSession, isRevokingSession } =
    useAuth();
  const toast = useToast();

  const handleRevokeSession = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent) {
      toast.error("Não é possível revogar a sessão atual");
      return;
    }

    try {
      await revokeSession(sessionId);
      toast.success("Sessão revogada com sucesso");
    } catch (error) {
      toast.error("Erro ao revogar sessão");
    }
  };

  if (sessionsLoading) {
    return (
      <SessionManagerContainer>
        <Title>
          <AlertTriangle size={16} />
          Sessões Ativas
        </Title>
        <div>Carregando...</div>
      </SessionManagerContainer>
    );
  }

  return (
    <SessionManagerContainer>
      <Title>
        <AlertTriangle size={16} />
        Sessões Ativas
      </Title>

      {sessions.length === 0 ? (
        <EmptyState>Nenhuma sessão ativa encontrada</EmptyState>
      ) : (
        <SessionList>
          {sessions.map((session: any) => {
            const isCurrent = session.isCurrent;

            return (
              <SessionItem key={session.id} $isCurrent={isCurrent}>
                <SessionInfo>
                  <DeviceIcon>{getDeviceIcon(session)}</DeviceIcon>
                  <SessionDetails>
                    <SessionName>
                      {getDeviceName(session)}
                      {isCurrent && <CurrentBadge>Atual</CurrentBadge>}
                    </SessionName>
                    <SessionDate>
                      Iniciada em{" "}
                      {format(
                        new Date(session.createdAt),
                        "dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </SessionDate>
                  </SessionDetails>
                </SessionInfo>

                <RevokeButton
                  $isCurrent={isCurrent}
                  onClick={() => handleRevokeSession(session.id, isCurrent)}
                  disabled={isCurrent || isRevokingSession}
                >
                  <X size={14} />
                  {isCurrent ? "Sessão Atual" : "Revogar"}
                </RevokeButton>
              </SessionItem>
            );
          })}
        </SessionList>
      )}
    </SessionManagerContainer>
  );
};
