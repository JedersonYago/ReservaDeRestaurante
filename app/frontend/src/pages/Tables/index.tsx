import { useTables } from "../../hooks/useTables";
import { Button } from "../../components/Button";
import { toast } from "react-toastify";
import {
  Container,
  Title,
  TableList,
  TableItem,
  TableInfo,
  TableActions,
  StatusBadge,
  EmptyMessage,
} from "./styles";
import { useNavigate } from "react-router-dom";

export function Tables() {
  const { tables, isLoading, deleteTable } = useTables();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const table = tables?.find((t) => t._id === id);
    const hasActiveReservations =
      table?.reservations && table.reservations.length > 0;

    if (hasActiveReservations) {
      const confirm = window.confirm(
        "Esta mesa possui reservas ativas. Ao excluí-la, todas as reservas serão canceladas. Deseja continuar?"
      );
      if (!confirm) return;
    }

    try {
      await deleteTable(id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <Title>Mesas Existentes</Title>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/tables/new")}
      >
        Nova Mesa
      </Button>
      {isLoading ? (
        <p>Carregando...</p>
      ) : tables && tables.length > 0 ? (
        <TableList>
          {tables.map((table) => (
            <TableItem key={table._id}>
              <TableInfo>
                <h3>{table.name}</h3>
                <p>Capacidade: {table.capacity} pessoas</p>
                <StatusBadge status={table.status}>
                  {table.status === "available"
                    ? "Disponível"
                    : table.status === "reserved"
                    ? "Reservada"
                    : "Em Manutenção"}
                </StatusBadge>
                {table.reservations && table.reservations.length > 0 && (
                  <p style={{ color: "#e74c3c", marginTop: "8px" }}>
                    ⚠️ Possui {table.reservations.length} reserva(s) ativa(s)
                  </p>
                )}
              </TableInfo>
              <TableActions>
                <Button
                  type="button"
                  onClick={() => navigate(`/tables/${table._id}`)}
                  $variant="primary"
                >
                  Detalhes
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(`/tables/${table._id}/edit`)}
                  $variant="secondary"
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDelete(table._id)}
                  $variant="danger"
                >
                  Excluir
                </Button>
              </TableActions>
            </TableItem>
          ))}
        </TableList>
      ) : (
        <EmptyMessage>Nenhuma mesa cadastrada</EmptyMessage>
      )}
    </Container>
  );
}
