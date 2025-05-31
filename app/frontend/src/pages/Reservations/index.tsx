import { useNavigate } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";
import styled from "styled-components";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { Button } from "../../components/Button";

export function Reservations() {
  const navigate = useNavigate();
  const { reservations, isLoading, cancelReservation } = useReservations();

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <Container>
      <Header>
        <h1>Minhas Reservas</h1>
        <Button onClick={() => navigate("/reservations/new")}>
          Nova Reserva
        </Button>
      </Header>

      <ReservationList>
        {reservations?.map((reservation) => (
          <ReservationCard key={reservation.id}>
            <ReservationInfo>
              <h3>{reservation.name}</h3>
              <p>
                Data:{" "}
                {formatInTimeZone(
                  new Date(reservation.date),
                  "America/Sao_Paulo",
                  "dd 'de' MMMM 'de' yyyy",
                  { locale: ptBR }
                )}
              </p>
              <p>Horário: {reservation.time}</p>
              <p>Pessoas: {reservation.numberOfPeople}</p>
              <StatusBadge status={reservation.status}>
                {getStatusText(reservation.status)}
              </StatusBadge>
            </ReservationInfo>

            <ReservationActions>
              <Button
                variant="secondary"
                onClick={() => navigate(`/reservations/${reservation.id}`)}
              >
                Detalhes
              </Button>
              {reservation.status === "pending" && (
                <Button
                  variant="danger"
                  onClick={() => cancelReservation(reservation.id)}
                >
                  Cancelar
                </Button>
              )}
            </ReservationActions>
          </ReservationCard>
        ))}

        {reservations?.length === 0 && (
          <EmptyState>
            <p>Você ainda não tem reservas.</p>
            <Button onClick={() => navigate("/reservations/new")}>
              Fazer uma reserva
            </Button>
          </EmptyState>
        )}
      </ReservationList>
    </Container>
  );
}

function getStatusText(status: string) {
  const statusMap = {
    pending: "Pendente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
  };

  return statusMap[status as keyof typeof statusMap] || status;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: #333;
  }
`;

const ReservationList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReservationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.3rem;
  }
`;

const ReservationInfo = styled.div`
  flex: 1;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;

  ${({ status }) => {
    switch (status) {
      case "pending":
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case "confirmed":
        return `
          background: #d4edda;
          color: #155724;
        `;
      case "cancelled":
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      default:
        return "";
    }
  }}
`;

const ReservationActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;
