import { useState } from "react";
import { useTables } from "../../hooks/useTables";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export function Tables() {
  const { tables, isLoading, createTable, updateTable, deleteTable } =
    useTables();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
  });

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      number: Number(formData.number),
      capacity: Number(formData.capacity),
    };

    if (editingId) {
      updateTable(editingId, data);
      setEditingId(null);
    } else {
      createTable(data);
      setIsCreating(false);
    }

    setFormData({ number: "", capacity: "" });
  };

  const handleEdit = (table: any) => {
    setEditingId(table.id);
    setFormData({
      number: table.number.toString(),
      capacity: table.capacity.toString(),
    });
  };

  return (
    <Container>
      <Header>
        <h1>Gerenciar Mesas</h1>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)}>Nova Mesa</Button>
        )}
      </Header>

      {(isCreating || editingId) && (
        <Form onSubmit={handleSubmit}>
          <Input
            label="Número da Mesa"
            type="number"
            value={formData.number}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, number: e.target.value }))
            }
            required
          />
          <Input
            label="Capacidade"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, capacity: e.target.value }))
            }
            required
          />
          <ButtonGroup>
            <Button type="submit">
              {editingId ? "Atualizar" : "Criar"} Mesa
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setFormData({ number: "", capacity: "" });
              }}
            >
              Cancelar
            </Button>
          </ButtonGroup>
        </Form>
      )}

      <TableList>
        {tables?.map((table) => (
          <TableCard key={table.id}>
            <TableInfo>
              <h3>Mesa {table.number}</h3>
              <p>Capacidade: {table.capacity} pessoas</p>
              <StatusBadge status={table.status}>
                {getStatusText(table.status)}
              </StatusBadge>
            </TableInfo>

            <TableActions>
              <Button
                variant="secondary"
                onClick={() => handleEdit(table)}
                disabled={!!editingId}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteTable(table.id)}
                disabled={!!editingId}
              >
                Excluir
              </Button>
            </TableActions>
          </TableCard>
        ))}

        {tables?.length === 0 && (
          <EmptyState>
            <p>Nenhuma mesa cadastrada.</p>
            <Button onClick={() => setIsCreating(true)}>Criar Mesa</Button>
          </EmptyState>
        )}
      </TableList>
    </Container>
  );
}

function getStatusText(status: string) {
  const statusMap = {
    available: "Disponível",
    reserved: "Reservada",
    occupied: "Ocupada",
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

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const TableList = styled.div`
  display: grid;
  gap: 1rem;
`;

const TableCard = styled.div`
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

const TableInfo = styled.div`
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
      case "available":
        return `
          background: #d4edda;
          color: #155724;
        `;
      case "reserved":
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case "occupied":
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      default:
        return "";
    }
  }}
`;

const TableActions = styled.div`
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
