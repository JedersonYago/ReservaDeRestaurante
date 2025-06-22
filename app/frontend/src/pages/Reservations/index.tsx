import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useToast } from "../../components/Toast";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { Container as LayoutContainer } from "../../components/Layout/Container";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  X,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Utensils,
  FileText,
  FilterX,
} from "lucide-react";
import { PageWrapper } from "../../components/Layout/PageWrapper";
import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  FiltersSection,
  FiltersHeader,
  FiltersTitle,
  FiltersGrid,
  SearchContainer,
  FilterContainer,
  Select,
  ClearFiltersButton,
  ContentSection,
  ReservationsGrid,
  ReservationCard,
  CardHeader,
  ReservationInfo,
  TableInfo,
  StatusBadgeContainer,
  CardContent,
  CustomerInfo,
  DateTimeInfo,
  ObservationsText,
  CardActions,
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateContent,
  EmptyTitle,
  EmptyDescription,
  ResultsCounter,
} from "./styles";
import { StatusBadge } from "../../components/StatusBadge";

export function Reservations() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    reservations,
    loading,
    deleteReservation,
    clearReservation,
    cancelReservation,
  } = useReservations();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "delete" | "clear" | "cancel";
    reservationId: string;
    title: string;
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // Função para gerar número da reserva amigável a partir do ID
  const getReservationNumber = (id: string) => {
    // Pega os últimos 6 caracteres do ID e converte para um número
    const lastChars = id.slice(-6);
    const num = parseInt(lastChars, 16) % 999999; // Garante que seja menor que 1 milhão
    return num.toString().padStart(6, "0"); // Formata com zeros à esquerda
  };

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];

    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.customerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (reservation.tableId &&
          typeof reservation.tableId === "object" &&
          "name" in reservation.tableId &&
          (reservation.tableId as any).name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const handleDeleteClick = (id: string) => {
    setModalConfig({
      type: "delete",
      reservationId: id,
      title: "Excluir Reserva",
      message:
        "Tem certeza que deseja excluir esta reserva permanentemente? Esta ação não pode ser desfeita.",
    });
    setShowModal(true);
  };

  const handleClearClick = (id: string) => {
    setModalConfig({
      type: "clear",
      reservationId: id,
      title: "Remover da Lista",
      message:
        "Tem certeza que deseja remover esta reserva da sua lista? Você ainda poderá visualizá-la em detalhes.",
    });
    setShowModal(true);
  };

  const handleCancelClick = (id: string) => {
    setModalConfig({
      type: "cancel",
      reservationId: id,
      title: "Cancelar Reserva",
      message:
        "Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.",
    });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!modalConfig) return;

    setIsProcessing(true);
    try {
      switch (modalConfig.type) {
        case "delete":
          await deleteReservation.mutateAsync(modalConfig.reservationId);
          break;
        case "clear":
          await clearReservation.mutateAsync(modalConfig.reservationId);
          break;
        case "cancel":
          await cancelReservation.mutateAsync(modalConfig.reservationId);
          break;
      }
      setShowModal(false);
      setModalConfig(null);
    } catch (error: any) {
      console.error(`Erro ao ${modalConfig.type} reserva:`, error);
      const errorMessage =
        error.response?.data?.error ||
        `Erro ao ${
          modalConfig.type === "delete"
            ? "excluir"
            : modalConfig.type === "clear"
            ? "remover"
            : "cancelar"
        } reserva. Tente novamente.`;
      toast.error(errorMessage);
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

  if (loading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <div>Carregando reservas...</div>
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
                Reservas
              </Title>
              <Subtitle>Gerencie todas as reservas do restaurante</Subtitle>
            </TitleSection>
            <HeaderActions>
              <Button
                variant="primary"
                onClick={() => navigate("/reservations/new")}
                leftIcon={<Plus size={18} />}
              >
                Nova Reserva
              </Button>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <FiltersSection>
          <FiltersHeader>
            <Filter size={20} />
            <FiltersTitle>Filtros de Busca</FiltersTitle>
          </FiltersHeader>

          <FiltersGrid>
            <SearchContainer>
              <label>
                <Search size={16} />
                Buscar reservas
              </label>
              <div className="input-wrapper">
                <Search size={18} />
                <Input
                  type="text"
                  placeholder="Nome, email ou mesa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </SearchContainer>

            <FilterContainer>
              <label>
                <Filter size={16} />
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </Select>
            </FilterContainer>

            <ClearFiltersButton
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              title="Limpar todos os filtros"
            >
              <FilterX size={16} />
              Limpar
            </ClearFiltersButton>
          </FiltersGrid>
        </FiltersSection>

        <ContentSection>
          {filteredReservations?.length > 0 ? (
            <>
              {hasActiveFilters && (
                <ResultsCounter>
                  <strong>{filteredReservations.length}</strong> reserva
                  {filteredReservations.length !== 1 ? "s" : ""} encontrada
                  {filteredReservations.length !== 1 ? "s" : ""}
                </ResultsCounter>
              )}
              <ReservationsGrid>
                {filteredReservations.map((reservation) => (
                  <ReservationCard key={reservation._id}>
                    <CardHeader>
                      <ReservationInfo>
                        <div className="reservation-number">
                          <Calendar size={18} />
                          <span>#{getReservationNumber(reservation._id)}</span>
                        </div>
                        <TableInfo>
                          <Utensils size={16} />
                          <span>
                            {reservation.tableId &&
                            typeof reservation.tableId === "object" &&
                            "name" in reservation.tableId
                              ? (reservation.tableId as any).name
                              : "Mesa excluída"}
                          </span>
                        </TableInfo>
                      </ReservationInfo>
                      <StatusBadgeContainer>
                        <StatusBadge status={reservation.status as any}>
                          {getStatusIcon(reservation.status)}
                          {getStatusText(reservation.status)}
                        </StatusBadge>
                      </StatusBadgeContainer>
                    </CardHeader>

                    <CardContent>
                      <CustomerInfo>
                        <div>
                          <User size={16} />
                          <span>{reservation.customerName}</span>
                        </div>
                        <div>
                          <Mail size={16} />
                          <span>{reservation.customerEmail}</span>
                        </div>
                      </CustomerInfo>

                      <DateTimeInfo>
                        <div>
                          <Calendar size={16} />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div>
                          <Clock size={16} />
                          <span>{formatTime(reservation.time)}</span>
                        </div>
                      </DateTimeInfo>

                      {reservation.observations && (
                        <ObservationsText>
                          <FileText size={16} />
                          <span title={reservation.observations}>
                            {truncateText(reservation.observations, 50)}
                          </span>
                        </ObservationsText>
                      )}
                    </CardContent>

                    <CardActions>
                      <ActionButton
                        onClick={() =>
                          navigate(`/reservations/${reservation._id}`)
                        }
                        $variant="secondary"
                      >
                        <Eye size={16} />
                        Detalhes
                      </ActionButton>

                      {user?.role === "admin" ? (
                        <ActionButton
                          onClick={() => handleDeleteClick(reservation._id)}
                          $variant="danger"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </ActionButton>
                      ) : (
                        <>
                          {reservation.status !== "cancelled" && (
                            <ActionButton
                              onClick={() => handleCancelClick(reservation._id)}
                              $variant="cancel"
                            >
                              <X size={16} />
                              Cancelar
                            </ActionButton>
                          )}
                          {reservation.status === "cancelled" && (
                            <ActionButton
                              onClick={() => handleClearClick(reservation._id)}
                              $variant="secondary"
                            >
                              <Trash2 size={16} />
                              Limpar
                            </ActionButton>
                          )}
                        </>
                      )}
                    </CardActions>
                  </ReservationCard>
                ))}
              </ReservationsGrid>
            </>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <Calendar size={64} />
              </EmptyStateIcon>
              <EmptyStateContent>
                <EmptyTitle>
                  {searchTerm || statusFilter !== "all"
                    ? "Nenhuma reserva encontrada"
                    : "Nenhuma reserva ainda"}
                </EmptyTitle>
                <EmptyDescription>
                  {searchTerm || statusFilter !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando sua primeira reserva"}
                </EmptyDescription>
                {!searchTerm && statusFilter === "all" && (
                  <Button
                    onClick={() => navigate("/reservations/new")}
                    variant="primary"
                    leftIcon={<Plus size={18} />}
                  >
                    Nova Reserva
                  </Button>
                )}
              </EmptyStateContent>
            </EmptyState>
          )}
        </ContentSection>

        <ConfirmationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          type={
            modalConfig?.type === "delete"
              ? "danger"
              : modalConfig?.type === "cancel"
              ? "warning"
              : "info"
          }
          title={modalConfig?.title || ""}
          message={modalConfig?.message || ""}
          confirmText={
            modalConfig?.type === "delete"
              ? "Sim, Excluir"
              : modalConfig?.type === "cancel"
              ? "Sim, Cancelar"
              : modalConfig?.type === "clear"
              ? "Sim, Remover"
              : "Confirmar"
          }
          cancelText="Não"
          isLoading={isProcessing}
        />
      </LayoutContainer>
    </PageWrapper>
  );
}
