import { useNavigate } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";
import styled from "styled-components";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

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
        <button onClick={() => navigate("/reservations/new")}>
          Nova Reserva
        </button>
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
              <p>Status: {getStatusText(reservation.status)}</p>
            </ReservationInfo>

            <ReservationActions>
              <button
                onClick={() => navigate(`/reservations/${reservation.id}`)}
              >
                Detalhes
              </button>
              {reservation.status === "pending" && (
                <button
                  onClick={() => cancelReservation(reservation.id)}
                  className="cancel"
                >
                  Cancelar
                </button>
              )}
            </ReservationActions>
          </ReservationCard>
        ))}

        {reservations?.length === 0 && (
          <EmptyState>
            <p>Você ainda não tem reservas.</p>
            <button onClick={() => navigate("/reservations/new")}>
              Fazer uma reserva
            </button>
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

  button {
    background: #007bff;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;

    &:hover {
      background: #0056b3;
    }
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

const ReservationActions = styled.div`
  display: flex;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    background: #007bff;
    color: white;

    &:hover {
      background: #0056b3;
    }

    &.cancel {
      background: #dc3545;

      &:hover {
        background: #c82333;
      }
    }
  }
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

  button {
    background: #007bff;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;

    &:hover {
      background: #0056b3;
    }
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
