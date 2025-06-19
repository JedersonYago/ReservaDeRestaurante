import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { getStatusText } from "../../utils/textUtils";
import { Container as LayoutContainer } from "../../components/Layout/Container";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Plus,
  FileText,
  User,
  Utensils,
  Clock,
  Users,
  XCircle,
  Wrench,
  Settings,
  CalendarDays,
  CalendarCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientStats, adminStats, loading, error, isAdmin, refetch } =
    useDashboard();

  // Estado para mostrar loading de refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      // Feedback visual opcional - você pode adicionar um toast aqui se houver
    } catch (error) {
      console.error("Erro ao atualizar dashboard:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Pequeno delay para feedback visual
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <Header>
            <HeaderContent>
              <LoadingSpinner />
            </HeaderContent>
          </Header>
          <LoadingState>
            <LoadingIcon>
              <Activity size={48} />
            </LoadingIcon>
            <LoadingMessage>Carregando dados do dashboard...</LoadingMessage>
          </LoadingState>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <Header>
            <HeaderContent></HeaderContent>
          </Header>
          <ErrorState>
            <ErrorIcon>
              <AlertTriangle size={48} />
            </ErrorIcon>
            <ErrorMessage>
              Erro ao carregar dados do dashboard. Tente novamente.
            </ErrorMessage>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </ErrorState>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <LayoutContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <WelcomeMessage>
                Bem-vindo, <UserName>{user?.name}</UserName>!
                <Subtitle>
                  {isAdmin
                    ? "Aqui está o resumo do restaurante"
                    : "Aqui estão suas informações"}
                </Subtitle>
              </WelcomeMessage>
            </TitleSection>
            {isAdmin && (
              <HeaderActions>
                <RefreshButton
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  title="Atualizar dados"
                >
                  <Activity
                    size={20}
                    className={isRefreshing ? "spinning" : ""}
                  />
                  <span>Atualizar</span>
                </RefreshButton>
                <AutoUpdateIndicator>
                  <UpdateDot $active />
                  <span>Atualização automática ativa</span>
                </AutoUpdateIndicator>
              </HeaderActions>
            )}
          </HeaderContent>
        </Header>

        {isAdmin ? (
          <AdminDashboard stats={adminStats} />
        ) : (
          <ClientDashboard stats={clientStats} />
        )}
      </LayoutContainer>
    </PageWrapper>
  );
}

// Dashboard do Cliente
function ClientDashboard({ stats }: { stats: any }) {
  const navigate = useNavigate();

  if (!stats) return null;

  return (
    <Content>
      {/* Próximas Reservas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Calendar size={24} />
          </SectionIcon>
          <SectionTitle>Suas Próximas Reservas</SectionTitle>
        </SectionHeader>

        {stats.personal.upcomingReservations.length > 0 ? (
          <ReservationsList>
            {stats.personal.upcomingReservations.map((reservation: any) => (
              <ModernReservationCard
                key={reservation._id}
                onClick={() => navigate(`/reservations/${reservation._id}`)}
              >
                <ReservationCardHeader>
                  <ReservationTable>
                    <Utensils size={20} />
                    <span>{reservation.tableId?.name || "Mesa"}</span>
                  </ReservationTable>
                  <StatusBadge status={reservation.status}>
                    {getStatusText(reservation.status)}
                  </StatusBadge>
                </ReservationCardHeader>

                <ReservationCardContent>
                  <ReservationDetail>
                    <CalendarDays size={16} />
                    <span>
                      {formatDate(reservation.date)} às{" "}
                      {formatTime(reservation.time)}
                    </span>
                  </ReservationDetail>
                  <ReservationDetail>
                    <User size={16} />
                    <span>{reservation.customerName}</span>
                  </ReservationDetail>
                </ReservationCardContent>

                <ReservationCardAction>
                  <span>Ver Detalhes</span>
                  <ChevronRight size={16} />
                </ReservationCardAction>
              </ModernReservationCard>
            ))}
          </ReservationsList>
        ) : (
          <ModernEmptyState>
            <EmptyStateIcon>
              <Calendar size={64} />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyTitle>Nenhuma reserva próxima</EmptyTitle>
              <EmptyDescription>
                Que tal fazer uma nova reserva e descobrir nossos sabores?
              </EmptyDescription>
              <Button
                variant="primary"
                onClick={() => navigate("/reservations/new")}
              >
                <Plus size={20} />
                Nova Reserva
              </Button>
            </EmptyStateContent>
          </ModernEmptyState>
        )}
      </Section>

      {/* Estatísticas Pessoais */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <BarChart3 size={24} />
          </SectionIcon>
          <SectionTitle>Suas Estatísticas</SectionTitle>
        </SectionHeader>
        <ModernStatsGrid>
          <ModernStatCard $color="primary">
            <StatIcon>
              <BarChart3 size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Total de Reservas</StatTitle>
              <StatValue>{stats.personal.totalReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="info">
            <StatIcon>
              <CalendarCheck size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Este Mês</StatTitle>
              <StatValue>{stats.personal.thisMonthReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="success">
            <StatIcon>
              <CheckCircle size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Confirmadas</StatTitle>
              <StatValue>{stats.personal.confirmedReservations}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ModernStatsGrid>
      </Section>

      {/* Ações Rápidas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <TrendingUp size={24} />
          </SectionIcon>
          <SectionTitle>Ações Rápidas</SectionTitle>
        </SectionHeader>
        <ActionsCard>
          <ActionButton
            onClick={() => navigate("/reservations/new")}
            $variant="primary"
          >
            <Plus size={24} />
            <ActionContent>
              <ActionTitle>Nova Reserva</ActionTitle>
              <ActionDescription>Fazer uma nova reserva</ActionDescription>
            </ActionContent>
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/reservations")}
            $variant="secondary"
          >
            <FileText size={24} />
            <ActionContent>
              <ActionTitle>Minhas Reservas</ActionTitle>
              <ActionDescription>Ver todas as reservas</ActionDescription>
            </ActionContent>
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/profile")}
            $variant="secondary"
          >
            <User size={24} />
            <ActionContent>
              <ActionTitle>Meu Perfil</ActionTitle>
              <ActionDescription>Editar informações</ActionDescription>
            </ActionContent>
          </ActionButton>
        </ActionsCard>
      </Section>

      {/* Informações do Restaurante */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Utensils size={24} />
          </SectionIcon>
          <SectionTitle>Informações do Restaurante</SectionTitle>
        </SectionHeader>
        <RestaurantInfoGrid>
          <ModernStatCard $color="info">
            <StatIcon>
              <Utensils size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Total de Mesas</StatTitle>
              <StatValue>{stats.restaurant.totalTables}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="success">
            <StatIcon>
              <CheckCircle size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Disponíveis Hoje</StatTitle>
              <StatValue>{stats.restaurant.availableTablesToday}</StatValue>
            </StatContent>
          </ModernStatCard>
        </RestaurantInfoGrid>
      </Section>
    </Content>
  );
}

// Dashboard do Admin
function AdminDashboard({ stats }: { stats: any }) {
  const navigate = useNavigate();

  if (!stats) return null;

  return (
    <Content>
      {/* Visão Geral */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <TrendingUp size={24} />
          </SectionIcon>
          <SectionTitle>Visão Geral</SectionTitle>
        </SectionHeader>
        <ModernStatsGrid>
          <ModernStatCard $color="primary">
            <StatIcon>
              <BarChart3 size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Total de Reservas</StatTitle>
              <StatValue>{stats.overview.totalReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="info">
            <StatIcon>
              <Calendar size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Reservas Hoje</StatTitle>
              <StatValue>{stats.overview.todayReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="success">
            <StatIcon>
              <CalendarCheck size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Este Mês</StatTitle>
              <StatValue>{stats.overview.thisMonthReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="warning">
            <StatIcon>
              <Users size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Clientes Únicos</StatTitle>
              <StatValue>{stats.overview.uniqueClients}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ModernStatsGrid>
      </Section>

      {/* Status das Reservas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Activity size={24} />
          </SectionIcon>
          <SectionTitle>Status das Reservas</SectionTitle>
        </SectionHeader>
        <ReservationStatusGrid>
          <ModernStatCard $color="warning">
            <StatIcon>
              <Clock size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Pendentes</StatTitle>
              <StatValue>{stats.reservationsByStatus.pending}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="success">
            <StatIcon>
              <CheckCircle size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Confirmadas</StatTitle>
              <StatValue>{stats.reservationsByStatus.confirmed}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="primary">
            <StatIcon>
              <XCircle size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Canceladas</StatTitle>
              <StatValue>{stats.reservationsByStatus.cancelled}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ReservationStatusGrid>
      </Section>

      {/* Status das Mesas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Utensils size={24} />
          </SectionIcon>
          <SectionTitle>Status das Mesas</SectionTitle>
        </SectionHeader>
        <ModernStatsGrid>
          <ModernStatCard $color="success">
            <StatIcon>
              <CheckCircle size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Disponíveis</StatTitle>
              <StatValue>{stats.tables.available}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="warning">
            <StatIcon>
              <Clock size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Reservadas</StatTitle>
              <StatValue>{stats.tables.reserved}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="info">
            <StatIcon>
              <Wrench size={32} />
            </StatIcon>
            <StatContent>
              <StatTitle>Manutenção</StatTitle>
              <StatValue>{stats.tables.maintenance}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ModernStatsGrid>
      </Section>

      {/* Alertas */}
      {stats.alerts.reservationsNeedingAttention.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionIcon>
              <AlertTriangle size={24} />
            </SectionIcon>
            <SectionTitle>Reservas Pendentes</SectionTitle>
          </SectionHeader>
          <AlertsCard>
            <AlertsList>
              {stats.alerts.reservationsNeedingAttention.map(
                (reservation: any) => (
                  <ModernAlertItem key={reservation._id}>
                    <AlertContent>
                      <AlertTableName>
                        <Utensils size={16} />
                        {reservation.tableId?.name}
                      </AlertTableName>
                      <AlertCustomer>{reservation.customerName}</AlertCustomer>
                      <AlertDateTime>
                        <CalendarDays size={14} />
                        {formatDate(reservation.date)} às{" "}
                        {formatTime(reservation.time)}
                      </AlertDateTime>
                    </AlertContent>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`/reservations/${reservation._id}`)
                      }
                    >
                      Ver Detalhes
                    </Button>
                  </ModernAlertItem>
                )
              )}
            </AlertsList>
          </AlertsCard>
        </Section>
      )}

      {/* Ações Administrativas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Settings size={24} />
          </SectionIcon>
          <SectionTitle>Ações Administrativas</SectionTitle>
        </SectionHeader>
        <AdminActionsGrid>
          <ActionButton
            onClick={() => navigate("/reservations/new")}
            $variant="primary"
          >
            <Plus size={24} />
            <ActionContent>
              <ActionTitle>Nova Reserva</ActionTitle>
              <ActionDescription>Criar nova reserva</ActionDescription>
            </ActionContent>
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/tables")}
            $variant="secondary"
          >
            <Utensils size={24} />
            <ActionContent>
              <ActionTitle>Gerenciar Mesas</ActionTitle>
              <ActionDescription>Configurar mesas</ActionDescription>
            </ActionContent>
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/reservations")}
            $variant="secondary"
          >
            <FileText size={24} />
            <ActionContent>
              <ActionTitle>Todas as Reservas</ActionTitle>
              <ActionDescription>Gerenciar reservas</ActionDescription>
            </ActionContent>
          </ActionButton>
        </AdminActionsGrid>
      </Section>
    </Content>
  );
}

// Styled Components
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.spacing[16]});
  background: ${({ theme }) => theme.colors.background.secondary};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: left;
    margin-bottom: ${({ theme }) => theme.spacing[10]};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
`;

const ReservationsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const AlertsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  max-height: 200px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing[2]};

  /* Garantir que mostra apenas uma "linha" de 3 itens */
  grid-auto-rows: min-content;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    max-height: 300px; /* Altura ajustada para 2 colunas */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-height: 250px; /* Altura ajustada para 1 coluna */
  }

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

// Modern Styled Components
const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const WelcomeMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const HeaderDecoration = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main}20,
    ${({ theme }) => theme.colors.secondary.main}20
  );
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: absolute;
  right: -60px;
  top: -60px;
  z-index: -1;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const LoadingIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  animation: ${pulse} 2s infinite;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
`;

const ModernReservationCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

const ReservationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReservationTable = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ReservationCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReservationDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

const ReservationCardAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary.main};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const ModernEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]}
    ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary},
    ${({ theme }) => theme.colors.neutral[50]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[200]};
`;

const EmptyStateIcon = styled.div`
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ModernStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ModernStatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme, $color }) => {
      switch ($color) {
        case "primary":
          return theme.colors.primary.main;
        case "success":
          return theme.colors.semantic.success;
        case "warning":
          return theme.colors.semantic.warning;
        case "info":
          return theme.colors.semantic.info;
        default:
          return theme.colors.primary.main;
      }
    }};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatIcon = styled.div<{ $color?: string }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $color }) => {
    switch ($color) {
      case "primary":
        return `${theme.colors.primary.main}15`;
      case "success":
        return `${theme.colors.semantic.success}15`;
      case "warning":
        return `${theme.colors.semantic.warning}15`;
      case "info":
        return `${theme.colors.semantic.info}15`;
      default:
        return `${theme.colors.primary.main}15`;
    }
  }};
  color: ${({ theme, $color }) => {
    switch ($color) {
      case "primary":
        return theme.colors.primary.main;
      case "success":
        return theme.colors.semantic.success;
      case "warning":
        return theme.colors.semantic.warning;
      case "info":
        return theme.colors.semantic.info;
      default:
        return theme.colors.primary.main;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ActionsCard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`
      : theme.colors.background.primary};
  color: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.primary.contrast
      : theme.colors.text.primary};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? "transparent" : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme, $variant }) =>
      $variant === "primary" ? "transparent" : theme.colors.primary.main};
  }

  svg {
    flex-shrink: 0;
  }
`;

const ActionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ActionDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.8;
`;

const RestaurantInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ReservationStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const AlertsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ModernAlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
`;

const AlertTableName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const AlertCustomer = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AlertDateTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const AdminActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RefreshButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.text.secondary : theme.colors.primary.contrast};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  }

  svg {
    flex-shrink: 0;

    &.spinning {
      animation: ${spin} 1s linear infinite;
    }
  }
`;

const AutoUpdateIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UpdateDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.semantic.success : theme.colors.neutral[400]};
`;
