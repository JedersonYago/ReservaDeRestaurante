import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { reservationService } from "../../services/reservationService";
import { toast } from "react-toastify";

export function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["reservation", id],
    queryFn: () => reservationService.getById(id!),
    enabled: !!id,
  });

  async function handleCancelReservation() {
    try {
      await reservationService.cancel(id!);
      toast.success("Reserva cancelada com sucesso!");
      navigate("/reservations");
    } catch (error) {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    }
  }

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
        <ButtonGroup>
          <Button variant="secondary" onClick={() => navigate("/reservations")}>
            Voltar
          </Button>
          {reservation.status === "pending" && (
            <Button variant="danger" onClick={handleCancelReservation}>
              Cancelar Reserva
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <DetailsCard>
        <DetailItem>
          <Label>Nome</Label>
          <Value>{reservation.name}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Email</Label>
          <Value>{reservation.email}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Telefone</Label>
          <Value>{reservation.phone}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Data</Label>
          <Value>
            {formatInTimeZone(
              new Date(reservation.date),
              "America/Sao_Paulo",
              "dd 'de' MMMM 'de' yyyy",
              { locale: ptBR }
            )}
          </Value>
        </DetailItem>

        <DetailItem>
          <Label>Horário</Label>
          <Value>{reservation.time}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Número de Pessoas</Label>
          <Value>{reservation.numberOfPeople}</Value>
        </DetailItem>

        <DetailItem>
          <Label>Status</Label>
          <StatusValue status={reservation.status}>
            {getStatusText(reservation.status)}
          </StatusValue>
        </DetailItem>
      </DetailsCard>
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
  max-width: 800px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const DetailsCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.1rem;
  color: #333;
`;

const StatusValue = styled(Value)<{ status: string }>`
  color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "confirmed":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#333";
    }
  }};
  font-weight: 500;
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
