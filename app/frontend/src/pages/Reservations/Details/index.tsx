import { useParams, useNavigate } from "react-router-dom";
import { useReservations } from "../../../hooks/useReservations";
import styled from "styled-components";
import { Button } from "../../../components/Button";

export function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservations, isLoading, cancelReservation } = useReservations();

  const reservation = reservations?.find((r) => r.id === id);

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  if (!reservation) {
    return <NotFound>Reserva não encontrada</NotFound>;
  }

  return (
    <Container>
      <Header>
        <h1>Detalhes da Reserva</h1>
        <Button variant="secondary" onClick={() => navigate("/reservations")}>
          Voltar
        </Button>
      </Header>

      <Content>
        <InfoCard>
          <h2>Informações</h2>
          <InfoItem>
            <Label>Nome:</Label>
            <Value>{reservation.name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email:</Label>
            <Value>{reservation.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Telefone:</Label>
            <Value>{reservation.phone}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Data:</Label>
            <Value>{reservation.date}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Horário:</Label>
            <Value>{reservation.time}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Número de Pessoas:</Label>
            <Value>{reservation.numberOfPeople} pessoas</Value>
          </InfoItem>
          <InfoItem>
            <Label>Status:</Label>
            <StatusBadge status={reservation.status}>
              {getStatusText(reservation.status)}
            </StatusBadge>
          </InfoItem>
        </InfoCard>

        <ButtonGroup>
          <Button
            variant="danger"
            onClick={() => {
              if (
                window.confirm("Tem certeza que deseja cancelar esta reserva?")
              ) {
                cancelReservation(reservation.id);
                navigate("/reservations");
              }
            }}
          >
            Cancelar Reserva
          </Button>
        </ButtonGroup>
      </Content>
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

const Content = styled.div`
  display: grid;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
  width: 150px;
`;

const Value = styled.span`
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const NotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;
