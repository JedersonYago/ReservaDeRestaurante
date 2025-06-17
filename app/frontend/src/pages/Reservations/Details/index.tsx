import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReservations } from "../../../hooks/useReservations";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "./styles";
import { toast } from "react-toastify";
import {
  Container,
  Title,
  DetailsContainer,
  DetailItem,
  DetailLabel,
  DetailValue,
  ButtonGroup,
  StatusBadge,
  SectionTitle,
  InfoSection,
  ActionsSection,
} from "./styles";
import { formatDate, formatTime } from "../../../utils/dateUtils";

export function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getReservationById,
    deleteReservation,
    cancelReservation,
    confirmReservation,
  } = useReservations();
  const { user } = useAuth();
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isDeleting) return;
    const fetchReservation = async () => {
      try {
        const data = await getReservationById(id!);
        setReservation(data);
      } catch (error: any) {
        console.error("Erro ao buscar reserva:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao buscar detalhes da reserva. Tente novamente.";
        toast.error(errorMessage);
        navigate("/reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, getReservationById, navigate, isDeleting]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta reserva?")) {
      try {
        setIsDeleting(true);
        await deleteReservation.mutateAsync(reservation._id);
        navigate("/reservations");
        return;
      } catch (error: any) {
        setIsDeleting(false);
        console.error("Erro ao excluir reserva:", error);
        toast.error(error.response?.data?.error || "Erro ao excluir reserva");
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      try {
        await cancelReservation.mutateAsync(reservation._id);
        setReservation({ ...reservation, status: "cancelled" });
      } catch (error: any) {
        console.error("Erro ao cancelar reserva:", error);
        toast.error(error.response?.data?.error || "Erro ao cancelar reserva");
      }
    }
  };

  const handleConfirm = async () => {
    if (window.confirm("Tem certeza que deseja confirmar esta reserva?")) {
      try {
        await confirmReservation.mutateAsync(reservation._id);
        setReservation({ ...reservation, status: "confirmed" });
      } catch (error: any) {
        console.error("Erro ao confirmar reserva:", error);
        toast.error(error.response?.data?.error || "Erro ao confirmar reserva");
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!reservation) {
    return <div>Reserva não encontrada</div>;
  }

  return (
    <Container>
      <Title>Detalhes da Reserva</Title>

      <DetailsContainer>
        <InfoSection>
          <SectionTitle>Informações da Mesa</SectionTitle>
          <DetailItem>
            <DetailLabel>Mesa:</DetailLabel>
            <DetailValue>
              {reservation.tableId ? reservation.tableId.name : "Mesa excluída"}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Capacidade:</DetailLabel>
            <DetailValue>
              {reservation.tableId
                ? `${reservation.tableId.capacity} pessoas`
                : "---"}
            </DetailValue>
          </DetailItem>
        </InfoSection>

        <InfoSection>
          <SectionTitle>Informações da Reserva</SectionTitle>
          <DetailItem>
            <DetailLabel>Data:</DetailLabel>
            <DetailValue>{formatDate(reservation.date)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Horário:</DetailLabel>
            <DetailValue>{formatTime(reservation.time)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Status:</DetailLabel>
            <DetailValue>
              <StatusBadge status={reservation.status}>
                {getStatusText(reservation.status)}
              </StatusBadge>
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Observações:</DetailLabel>
            <DetailValue>{reservation.observations || "Nenhuma"}</DetailValue>
          </DetailItem>
        </InfoSection>

        <InfoSection>
          <SectionTitle>Informações do Cliente</SectionTitle>
          <DetailItem>
            <DetailLabel>Nome:</DetailLabel>
            <DetailValue>{reservation.customerName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Email:</DetailLabel>
            <DetailValue>{reservation.customerEmail}</DetailValue>
          </DetailItem>
        </InfoSection>

        {reservation.observations && (
          <InfoSection>
            <SectionTitle>Observações</SectionTitle>
            <DetailItem>
              <DetailValue>{reservation.observations}</DetailValue>
            </DetailItem>
          </InfoSection>
        )}
      </DetailsContainer>
      <ActionsSection>
        <ButtonGroup>
          <Button type="button" onClick={() => navigate("/reservations")}>
            Voltar
          </Button>
          {reservation.status === "pending" && (
            <>
              {user?.role === "admin" && (
                <Button
                  type="button"
                  onClick={handleConfirm}
                  $variant="success"
                >
                  Confirmar
                </Button>
              )}
              <Button type="button" onClick={handleCancel} $variant="warning">
                Cancelar
              </Button>
            </>
          )}
          {user?.role === "admin" && (
            <Button type="button" onClick={handleDelete} $variant="danger">
              Excluir
            </Button>
          )}
        </ButtonGroup>
      </ActionsSection>
    </Container>
  );
}
