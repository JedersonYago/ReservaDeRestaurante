import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/Card";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { getStatusText } from "../../utils/textUtils";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientStats, adminStats, loading, error, isAdmin } = useDashboard();

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Dashboard</Title>
        </Header>
        <LoadingMessage>Carregando dados do dashboard...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Dashboard</Title>
        </Header>
        <ErrorMessage>
          Erro ao carregar dados do dashboard. Tente novamente.
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>
          Bem-vindo, <strong>{user?.name}</strong>!
          {isAdmin
            ? " Aqui está o resumo do restaurante:"
            : " Aqui estão suas informações:"}
        </Subtitle>
      </Header>

      {isAdmin ? (
        <AdminDashboard stats={adminStats} />
      ) : (
        <ClientDashboard stats={clientStats} />
      )}
    </Container>
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
        <SectionTitle>Suas Próximas Reservas</SectionTitle>
        {stats.personal.upcomingReservations.length > 0 ? (
          <ReservationsList>
            {stats.personal.upcomingReservations.map((reservation: any) => (
              <ReservationCard
                key={reservation._id}
                onClick={() => navigate(`/reservations/${reservation._id}`)}
              >
                <ReservationHeader>
                  <ReservationTitle>
                    {reservation.tableId?.name || "Mesa"}
                  </ReservationTitle>
                  <StatusBadge status={reservation.status}>
                    {getStatusText(reservation.status)}
                  </StatusBadge>
                </ReservationHeader>
                <ReservationDetails>
                  <ReservationDate>
                    📅 {formatDate(reservation.date)} às{" "}
                    {formatTime(reservation.time)}
                  </ReservationDate>
                  <ReservationCustomer>
                    👤 {reservation.customerName}
                  </ReservationCustomer>
                </ReservationDetails>
              </ReservationCard>
            ))}
          </ReservationsList>
        ) : (
          <EmptyState>
            <EmptyIcon>📅</EmptyIcon>
            <EmptyTitle>Nenhuma reserva próxima</EmptyTitle>
            <EmptyDescription>Que tal fazer uma nova reserva?</EmptyDescription>
            <Button onClick={() => navigate("/reservations/new")}>
              Nova Reserva
            </Button>
          </EmptyState>
        )}
      </Section>

      {/* Estatísticas Pessoais */}
      <Section>
        <SectionTitle>Suas Estatísticas</SectionTitle>
        <StatsGrid>
          <StatCard
            title="Total de Reservas"
            value={stats.personal.totalReservations}
            icon="📊"
            color="primary"
          />
          <StatCard
            title="Este Mês"
            value={stats.personal.thisMonthReservations}
            icon="📆"
            color="info"
          />
          <StatCard
            title="Confirmadas"
            value={stats.personal.confirmedReservations}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Mesa Favorita"
            value={stats.personal.favoriteTable || "Nenhuma"}
            icon="⭐"
            color="warning"
          />
        </StatsGrid>
      </Section>

      {/* Ações Rápidas */}
      <Section>
        <SectionTitle>Ações Rápidas</SectionTitle>
        <Card padding="large">
          <ButtonGroup gap="large" justify="center">
            <Button onClick={() => navigate("/reservations/new")}>
              📝 Nova Reserva
            </Button>
            <Button
              $variant="secondary"
              onClick={() => navigate("/reservations")}
            >
              📋 Minhas Reservas
            </Button>
            <Button $variant="secondary" onClick={() => navigate("/profile")}>
              👤 Meu Perfil
            </Button>
          </ButtonGroup>
        </Card>
      </Section>

      {/* Informações do Restaurante */}
      <Section>
        <SectionTitle>Informações do Restaurante</SectionTitle>
        <StatsGrid $columns={2}>
          <StatCard
            title="Total de Mesas"
            value={stats.restaurant.totalTables}
            icon="🪑"
            color="info"
          />
          <StatCard
            title="Disponíveis Hoje"
            value={stats.restaurant.availableTablesToday}
            icon="✅"
            color="success"
          />
        </StatsGrid>
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
        <SectionTitle>Visão Geral</SectionTitle>
        <StatsGrid>
          <StatCard
            title="Total de Reservas"
            value={stats.overview.totalReservations}
            icon="📊"
            color="primary"
          />
          <StatCard
            title="Reservas Hoje"
            value={stats.overview.todayReservations}
            icon="📅"
            color="info"
          />
          <StatCard
            title="Este Mês"
            value={stats.overview.thisMonthReservations}
            icon="📆"
            color="success"
          />
          <StatCard
            title="Clientes Únicos"
            value={stats.overview.uniqueClients}
            icon="👥"
            color="warning"
          />
        </StatsGrid>
      </Section>

      {/* Status das Reservas */}
      <Section>
        <SectionTitle>Status das Reservas</SectionTitle>
        <StatsGrid $columns={3}>
          <StatCard
            title="Pendentes"
            value={stats.reservationsByStatus.pending}
            icon="⏳"
            color="warning"
          />
          <StatCard
            title="Confirmadas"
            value={stats.reservationsByStatus.confirmed}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Canceladas"
            value={stats.reservationsByStatus.cancelled}
            icon="❌"
            color="danger"
          />
        </StatsGrid>
      </Section>

      {/* Status das Mesas */}
      <Section>
        <SectionTitle>Status das Mesas</SectionTitle>
        <StatsGrid>
          <StatCard
            title="Disponíveis"
            value={stats.tables.available}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Ocupadas"
            value={stats.tables.occupied}
            icon="🔴"
            color="danger"
          />
          <StatCard
            title="Reservadas"
            value={stats.tables.reserved}
            icon="🟡"
            color="warning"
          />
          <StatCard
            title="Manutenção"
            value={stats.tables.maintenance}
            icon="🔧"
            color="info"
          />
        </StatsGrid>
      </Section>

      {/* Alertas */}
      {stats.alerts.reservationsNeedingAttention.length > 0 && (
        <Section>
          <SectionTitle>⚠️ Reservas Pendentes</SectionTitle>
          <Card variant="info" padding="large">
            <AlertsList>
              {stats.alerts.reservationsNeedingAttention
                .slice(0, 5)
                .map((reservation: any) => (
                  <AlertItem key={reservation._id}>
                    <AlertInfo>
                      <strong>{reservation.tableId?.name}</strong> -{" "}
                      {reservation.customerName}
                      <br />
                      <small>
                        📅 {formatDate(reservation.date)} às{" "}
                        {formatTime(reservation.time)}
                      </small>
                    </AlertInfo>
                    <Button
                      $variant="secondary"
                      onClick={() =>
                        navigate(`/reservations/${reservation._id}`)
                      }
                    >
                      Ver Detalhes
                    </Button>
                  </AlertItem>
                ))}
            </AlertsList>
          </Card>
        </Section>
      )}

      {/* Ações Administrativas */}
      <Section>
        <SectionTitle>Ações Administrativas</SectionTitle>
        <Card padding="large">
          <ButtonGroup gap="large" justify="center">
            <Button onClick={() => navigate("/reservations/new")}>
              📝 Nova Reserva
            </Button>
            <Button $variant="secondary" onClick={() => navigate("/tables")}>
              🪑 Gerenciar Mesas
            </Button>
            <Button $variant="secondary" onClick={() => navigate("/settings")}>
              ⚙️ Configurações
            </Button>
            <Button
              $variant="secondary"
              onClick={() => navigate("/reservations")}
            >
              📋 Todas as Reservas
            </Button>
          </ButtonGroup>
        </Card>
      </Section>
    </Content>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const StatsGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  ${({ $columns }) =>
    $columns &&
    `
    grid-template-columns: repeat(${$columns}, 1fr);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `}
`;

const ReservationsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReservationCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReservationTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const ReservationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ReservationDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ReservationCustomer = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
  font-size: 1.1rem;
`;
