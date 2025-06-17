import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { toast } from "react-toastify";
import {
  Container,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ButtonGroup,
  SearchContainer,
  StatusBadge,
  Select,
} from "./styles";
import { formatDate, formatTime } from "../../utils/dateUtils";

export function Reservations() {
  const navigate = useNavigate();
  const {
    reservations,
    deleteReservation,
    clearReservation,
    cancelReservation,
  } = useReservations();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
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
          reservation.tableId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta reserva permanentemente?"
      )
    ) {
      try {
        await deleteReservation.mutateAsync(id);
        // Toast de sucesso é exibido pelo hook useReservations
      } catch (error: any) {
        console.error("Erro ao excluir reserva:", error);
        // Toast de erro já é exibido pelo hook, mas podemos manter este para casos específicos
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao excluir reserva. Tente novamente.";
        toast.error(errorMessage);
      }
    }
  };

  const handleClear = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta reserva da sua lista?"
      )
    ) {
      try {
        await clearReservation.mutateAsync(id);
        // Toast de sucesso é exibido pelo hook useReservations
      } catch (error: any) {
        console.error("Erro ao limpar reserva:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao limpar reserva. Tente novamente.";
        toast.error(errorMessage);
      }
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      try {
        await cancelReservation.mutateAsync(id);
        // Toast de sucesso é exibido pelo hook useReservations
      } catch (error: any) {
        console.error("Erro ao cancelar reserva:", error);
        // Toast de erro já é exibido pelo hook, mas podemos manter este para casos específicos
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao cancelar reserva. Tente novamente.";
        toast.error(errorMessage);
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Pendente";
      case "confirmed":
        return "✅ Confirmada";
      case "cancelled":
        return "❌ Cancelada";
      default:
        return status;
    }
  };

  return (
    <Container>
      <Title>Reservas</Title>
      <SearchContainer>
        <Input
          type="text"
          placeholder="Buscar por nome, email ou mesa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
      </SearchContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Mesa</TableHeader>
            <TableHeader>Cliente</TableHeader>
            <TableHeader>Data</TableHeader>
            <TableHeader>Horário</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Observações</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredReservations?.map((reservation) => (
            <TableRow key={reservation._id}>
              <TableCell>
                {reservation.tableId
                  ? reservation.tableId.name
                  : "Mesa excluída"}
              </TableCell>
              <TableCell>
                {reservation.customerName}
                <br />
                <small>{reservation.customerEmail}</small>
              </TableCell>
              <TableCell>{formatDate(reservation.date)}</TableCell>
              <TableCell>{formatTime(reservation.time)}</TableCell>
              <TableCell>
                <StatusBadge status={reservation.status}>
                  {getStatusText(reservation.status)}
                </StatusBadge>
              </TableCell>
              <TableCell title={reservation.observations || ""}>
                {truncateText(reservation.observations || "", 10)}
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => navigate(`/reservations/${reservation._id}`)}
                    $variant="secondary"
                  >
                    Detalhes
                  </Button>
                  {user?.role === "admin" ? (
                    // Admin: sempre pode excluir
                    <Button
                      type="button"
                      onClick={() => handleDelete(reservation._id)}
                      $variant="danger"
                    >
                      Excluir
                    </Button>
                  ) : (
                    // Cliente: cancelar se não cancelada, limpar se cancelada
                    <>
                      {reservation.status !== "cancelled" && (
                        <Button
                          type="button"
                          onClick={() => handleCancel(reservation._id)}
                          $variant="secondary"
                        >
                          Cancelar
                        </Button>
                      )}
                      {reservation.status === "cancelled" && (
                        <Button
                          type="button"
                          onClick={() => handleClear(reservation._id)}
                          $variant="secondary"
                        >
                          Limpar
                        </Button>
                      )}
                    </>
                  )}
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <ButtonGroup>
        <Button type="button" onClick={() => navigate("/reservations/new")}>
          Nova Reserva
        </Button>
      </ButtonGroup>
    </Container>
  );
}
