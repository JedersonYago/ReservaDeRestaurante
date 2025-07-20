import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { getStatusText } from "../../utils/textUtils";
import { Container as LayoutContainer } from "../../components/Layout/Container";
import { PageWrapper as BasePageWrapper } from "../../components/Layout/PageWrapper";
import {
  LoadingMessage,
  ErrorMessage,
  Header,
  Subtitle,
  Content,
  Section,
  SectionTitle,
  AlertsList,
  EmptyTitle,
  EmptyDescription,
  HeaderContent,
  TitleSection,
  UserName,
  WelcomeMessage,
  LoadingSpinner,
  LoadingState,
  LoadingIcon,
  ErrorState,
  ErrorIcon,
  SectionHeader,
  SectionIcon,
  ModernReservationCard,
  ReservationCardHeader,
  ReservationTable,
  ReservationCardContent,
  ReservationDetail,
  ModernEmptyState,
  EmptyStateIcon,
  EmptyStateContent,
  ModernStatsGrid,
  ModernStatCard,
  StatIcon,
  StatContent,
  StatTitle,
  StatValue,
  ActionsCard,
  ActionButton,
  ActionContent,
  ActionTitle,
  ActionDescription,
  RestaurantInfoGrid,
  ReservationStatusGrid,
  AlertsCard,
  ModernAlertItem,
  AlertContent,
  AlertTableName,
  AlertCustomer,
  AlertDateTime,
  AdminActionsGrid,
  HeaderActions,
  RefreshButton,
  ClientReservationsList,
} from "./styles";
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
  Settings,
  CalendarDays,
  TrendingUp,
  Activity,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const { user } = useAuth();
  const { clientStats, adminStats, loading, error, isAdmin, refetch } =
    useDashboard();

  // Estado para mostrar loading de refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar dashboard:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  if (loading) {
    return (
      <BasePageWrapper>
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
      </BasePageWrapper>
    );
  }

  if (error) {
    return (
      <BasePageWrapper>
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
      </BasePageWrapper>
    );
  }

  return (
    <BasePageWrapper>
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
    </BasePageWrapper>
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
          <AlertsCard>
            <ClientReservationsList>
              {stats.personal.upcomingReservations.map((reservation: any) => (
                <ModernReservationCard key={reservation._id}>
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

                  <ActionButton
                    onClick={() => navigate(`/reservations/${reservation._id}`)}
                    $variant="secondary"
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      padding: "8px 16px",
                      marginTop: "8px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Eye size={16} />
                    Detalhes
                  </ActionButton>
                </ModernReservationCard>
              ))}
            </ClientReservationsList>
          </AlertsCard>
        ) : (
          <ModernEmptyState>
            <EmptyStateIcon>
              <Calendar size={48} />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyTitle>Nenhuma reserva encontrada</EmptyTitle>
              <EmptyDescription>
                Você não possui reservas próximas. Que tal fazer uma nova
                reserva?
              </EmptyDescription>
              <Button
                variant="primary"
                onClick={() => navigate("/reservations/new")}
                leftIcon={<Plus size={18} />}
              >
                Nova Reserva
              </Button>
            </EmptyStateContent>
          </ModernEmptyState>
        )}
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
          <ActionsCard>
            <SectionHeader>
              <SectionIcon>
                <Calendar size={20} />
              </SectionIcon>
              <SectionTitle>Fazer Reserva</SectionTitle>
            </SectionHeader>
            <ActionButton
              onClick={() => navigate("/reservations/new")}
              $variant="primary"
            >
              <Plus size={24} />
              <ActionContent>
                <ActionTitle>Nova Reserva</ActionTitle>
                <ActionDescription>Reservar uma mesa</ActionDescription>
              </ActionContent>
            </ActionButton>
          </ActionsCard>

          <ActionsCard>
            <SectionHeader>
              <SectionIcon>
                <FileText size={20} />
              </SectionIcon>
              <SectionTitle>Suas Reservas</SectionTitle>
            </SectionHeader>
            <ActionButton
              onClick={() => navigate("/reservations")}
              $variant="secondary"
            >
              <FileText size={24} />
              <ActionContent>
                <ActionTitle>Ver Todas</ActionTitle>
                <ActionDescription>Gerenciar reservas</ActionDescription>
              </ActionContent>
            </ActionButton>
          </ActionsCard>
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
      {/* Estatísticas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <BarChart3 size={24} />
          </SectionIcon>
          <SectionTitle>Estatísticas do Restaurante</SectionTitle>
        </SectionHeader>

        <ModernStatsGrid>
          <ModernStatCard $color="#10b981">
            <StatIcon $color="#10b981">
              <Users />
            </StatIcon>
            <StatContent>
              <StatTitle>Total de Clientes</StatTitle>
              <StatValue>{stats.overview.uniqueClients}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="#3b82f6">
            <StatIcon $color="#3b82f6">
              <Calendar />
            </StatIcon>
            <StatContent>
              <StatTitle>Reservas Hoje</StatTitle>
              <StatValue>{stats.overview.todayReservations}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="#f59e0b">
            <StatIcon $color="#f59e0b">
              <Utensils />
            </StatIcon>
            <StatContent>
              <StatTitle>Mesas Disponíveis</StatTitle>
              <StatValue>{stats.tables.available}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ModernStatsGrid>
      </Section>

      {/* Status das Reservas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <TrendingUp size={24} />
          </SectionIcon>
          <SectionTitle>Status das Reservas</SectionTitle>
        </SectionHeader>

        <ReservationStatusGrid>
          <ModernStatCard $color="#10b981">
            <StatIcon $color="#10b981">
              <CheckCircle />
            </StatIcon>
            <StatContent>
              <StatTitle>Confirmadas</StatTitle>
              <StatValue>{stats.reservationsByStatus.confirmed}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="#f59e0b">
            <StatIcon $color="#f59e0b">
              <Clock />
            </StatIcon>
            <StatContent>
              <StatTitle>Pendentes</StatTitle>
              <StatValue>{stats.reservationsByStatus.pending}</StatValue>
            </StatContent>
          </ModernStatCard>

          <ModernStatCard $color="#ef4444">
            <StatIcon $color="#ef4444">
              <XCircle />
            </StatIcon>
            <StatContent>
              <StatTitle>Canceladas</StatTitle>
              <StatValue>{stats.reservationsByStatus.cancelled}</StatValue>
            </StatContent>
          </ModernStatCard>
        </ReservationStatusGrid>
      </Section>

      {/* Alertas e Próximas Reservas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <AlertTriangle size={24} />
          </SectionIcon>
          <SectionTitle>Reservas que Precisam de Atenção</SectionTitle>
        </SectionHeader>

        {stats.alerts.reservationsNeedingAttention.length > 0 ? (
          <AlertsCard>
            <AlertsList>
              {stats.alerts.reservationsNeedingAttention
                .slice(0, 6)
                .map((reservation: any) => (
                  <ModernAlertItem
                    key={reservation._id}
                    onClick={() => navigate(`/reservations/${reservation._id}`)}
                  >
                    <AlertContent>
                      <AlertTableName>
                        <Utensils size={16} />
                        <span>{reservation.tableId?.name || "Mesa"}</span>
                      </AlertTableName>
                      <AlertCustomer>{reservation.customerName}</AlertCustomer>
                      <AlertDateTime>
                        <Clock size={16} />
                        <span>
                          {formatDate(reservation.date)} às{" "}
                          {formatTime(reservation.time)}
                        </span>
                      </AlertDateTime>
                    </AlertContent>
                    <ActionButton
                      $variant="secondary"
                      style={{
                        width: "100%",
                        fontSize: "14px",
                        padding: "8px 16px",
                        marginTop: "4px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Eye size={16} />
                      Detalhes
                    </ActionButton>
                  </ModernAlertItem>
                ))}
            </AlertsList>
          </AlertsCard>
        ) : (
          <ModernEmptyState>
            <EmptyStateIcon>
              <Calendar size={48} />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyTitle>Nenhuma reserva pendente</EmptyTitle>
              <EmptyDescription>
                Todas as reservas estão organizadas e confirmadas.
              </EmptyDescription>
            </EmptyStateContent>
          </ModernEmptyState>
        )}
      </Section>

      {/* Ações Rápidas */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <Settings size={24} />
          </SectionIcon>
          <SectionTitle>Ações Rápidas</SectionTitle>
        </SectionHeader>

        <AdminActionsGrid>
          <ActionButton
            onClick={() => navigate("/reservations/new")}
            $variant="primary"
          >
            <Plus size={24} />
            <ActionContent>
              <ActionTitle>Nova Reserva</ActionTitle>
              <ActionDescription>Criar reserva</ActionDescription>
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
