import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReservations } from "../../../hooks/useReservations";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/Toast";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { Container as LayoutContainer } from "../../../components/Layout/Container";
import { ConfirmationModal } from "../../../components/Modal/ConfirmationModal";
import { CancelButton } from "../../../components/Button/CancelButton";
import { StatusBadge } from "../../../components/StatusBadge";
import { ButtonGroup } from "../../../components/ButtonGroup";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Utensils,
  Users,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import {
  PageWrapper,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  ContentSection,
  InfoGrid,
  InfoCard,
  CardHeader,
  CardTitle,
  CardContent,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  ActionsContainer,
  StatusBadgeContainer,
  CancelActionButton,
  ObservationsCard,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorDescription,
  BackButton,
} from "./styles";

export function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
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
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "delete" | "cancel" | "confirm";
    title: string;
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, getReservationById, navigate, isDeleting]);

  const handleDeleteClick = () => {
    setModalConfig({
      type: "delete",
      title: "Excluir Reserva",
      message:
        "Tem certeza que deseja excluir esta reserva permanentemente? Esta ação não pode ser desfeita.",
    });
    setShowModal(true);
  };

  const handleCancelClick = () => {
    setModalConfig({
      type: "cancel",
      title: "Cancelar Reserva",
      message:
        "Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.",
    });
    setShowModal(true);
  };

  const handleConfirmClick = () => {
    setModalConfig({
      type: "confirm",
      title: "Confirmar Reserva",
      message: "Tem certeza que deseja confirmar esta reserva?",
    });
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (!modalConfig || !reservation) return;

    setIsProcessing(true);
    try {
      switch (modalConfig.type) {
        case "delete":
          setIsDeleting(true);
          await deleteReservation.mutateAsync(reservation._id);
          navigate("/reservations");
          return;
        case "cancel":
          await cancelReservation.mutateAsync(reservation._id);
          setReservation({ ...reservation, status: "cancelled" });
          // Toast já é exibido pelo hook useReservations
          break;
        case "confirm":
          await confirmReservation.mutateAsync(reservation._id);
          setReservation({ ...reservation, status: "confirmed" });
          // Toast já é exibido pelo hook useReservations
          break;
      }
      setShowModal(false);
      setModalConfig(null);
    } catch (error: any) {
      console.error(`Erro ao ${modalConfig.type} reserva:`, error);
      toast.error(
        error.response?.data?.error ||
          `Erro ao ${
            modalConfig.type === "delete"
              ? "excluir"
              : modalConfig.type === "cancel"
              ? "cancelar"
              : "confirmar"
          } reserva`
      );
      if (modalConfig.type === "delete") {
        setIsDeleting(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalConfig(null);
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "confirmed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando confirmação";
      case "confirmed":
        return "Reserva confirmada";
      case "cancelled":
        return "Reserva cancelada";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <LoadingContainer>
            <LoadingSpinner>
              <Loader2 size={32} />
            </LoadingSpinner>
            <LoadingText>Carregando detalhes da reserva...</LoadingText>
          </LoadingContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  if (!reservation) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <ErrorContainer>
            <ErrorIcon>
              <AlertTriangle size={48} />
            </ErrorIcon>
            <ErrorTitle>Reserva não encontrada</ErrorTitle>
            <ErrorDescription>
              A reserva que você está procurando não existe ou foi removida.
            </ErrorDescription>
            <BackButton onClick={() => navigate("/reservations")}>
              <ArrowLeft size={18} />
              Voltar para Reservas
            </BackButton>
          </ErrorContainer>
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
              <Title>
                <Calendar size={32} />
                Detalhes da Reserva
              </Title>
              <Subtitle>
                Informações completas da reserva #
                {reservation._id?.slice(-6)?.toUpperCase()}
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              <ActionsContainer>
                <ButtonGroup>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/reservations")}
                    leftIcon={<ArrowLeft size={16} />}
                  >
                    Voltar
                  </Button>

                  {/* Botão Confirmar - só aparece para admin e status pending */}
                  {reservation.status === "pending" &&
                    user?.role === "admin" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleConfirmClick}
                        leftIcon={<CheckCircle size={16} />}
                      >
                        Confirmar
                      </Button>
                    )}

                  {/* Botão Cancelar - aparece para status pending ou confirmed, mas não cancelled */}
                  {reservation.status !== "cancelled" && (
                    <CancelActionButton onClick={handleCancelClick}>
                      <XCircle size={16} />
                      Cancelar
                    </CancelActionButton>
                  )}

                  {/* Botão Excluir - só para admin */}
                  {user?.role === "admin" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      leftIcon={
                        isDeleting ? (
                          <Loader2 size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )
                      }
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                  )}
                </ButtonGroup>

                <StatusBadgeContainer>
                  <StatusBadge status={reservation.status as any}>
                    {getStatusIcon(reservation.status)}
                    Reserva {getStatusText(reservation.status)}
                  </StatusBadge>
                </StatusBadgeContainer>
              </ActionsContainer>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <ContentSection>
          <InfoGrid>
            {/* Card da Mesa */}
            <InfoCard>
              <CardHeader>
                <Utensils size={34} />
                <CardTitle>Informações da Mesa</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailItem>
                  <DetailIcon>
                    <MapPin size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Mesa</DetailLabel>
                    <DetailValue>
                      {reservation.tableId &&
                      typeof reservation.tableId === "object" &&
                      "name" in reservation.tableId
                        ? (reservation.tableId as any).name
                        : "Mesa excluída"}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <Users size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Capacidade</DetailLabel>
                    <DetailValue>
                      {reservation.tableId &&
                      typeof reservation.tableId === "object" &&
                      "capacity" in reservation.tableId
                        ? `${(reservation.tableId as any).capacity} pessoas`
                        : "---"}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>
              </CardContent>
            </InfoCard>

            {/* Card do Cliente */}
            <InfoCard>
              <CardHeader>
                <User size={34} />
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailItem>
                  <DetailIcon>
                    <User size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Nome</DetailLabel>
                    <DetailValue>{reservation.customerName}</DetailValue>
                  </DetailContent>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <Mail size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{reservation.customerEmail}</DetailValue>
                  </DetailContent>
                </DetailItem>
              </CardContent>
            </InfoCard>

            {/* Card da Reserva */}
            <InfoCard>
              <CardHeader>
                <Calendar size={34} />
                <CardTitle>Data e Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailItem>
                  <DetailIcon>
                    <Calendar size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Data</DetailLabel>
                    <DetailValue>{formatDate(reservation.date)}</DetailValue>
                  </DetailContent>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <Clock size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Horário</DetailLabel>
                    <DetailValue>{formatTime(reservation.time)}</DetailValue>
                  </DetailContent>
                </DetailItem>
              </CardContent>
            </InfoCard>
          </InfoGrid>

          {/* Card de Observações */}
          {reservation.observations && (
            <ObservationsCard>
              <CardHeader>
                <FileText size={34} />
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{reservation.observations}</p>
              </CardContent>
            </ObservationsCard>
          )}
        </ContentSection>

        <ConfirmationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
          type={
            modalConfig?.type === "delete"
              ? "danger"
              : modalConfig?.type === "cancel"
              ? "warning"
              : modalConfig?.type === "confirm"
              ? "success"
              : "info"
          }
          title={modalConfig?.title || ""}
          message={modalConfig?.message || ""}
          confirmText={
            modalConfig?.type === "delete"
              ? "Sim, Excluir"
              : modalConfig?.type === "cancel"
              ? "Sim, Cancelar"
              : modalConfig?.type === "confirm"
              ? "Sim, Confirmar"
              : "Confirmar"
          }
          cancelText="Não"
          isLoading={isProcessing}
        />
      </LayoutContainer>
    </PageWrapper>
  );
}
