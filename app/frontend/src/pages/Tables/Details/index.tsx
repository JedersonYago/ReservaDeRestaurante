import { useParams, useNavigate } from "react-router-dom";
import { useTables } from "../../../hooks/useTables";
import styled from "styled-components";
import { Button } from "../../../components/Button";

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tables, isLoading, updateTable, deleteTable } = useTables();

  const table = tables?.find((t) => t.id === id);

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  if (!table) {
    return <NotFound>Mesa não encontrada</NotFound>;
  }

  return (
    <Container>
      <Header>
        <h1>Detalhes da Mesa {table.number}</h1>
        <Button variant="secondary" onClick={() => navigate("/tables")}>
          Voltar
        </Button>
      </Header>

      <Content>
        <InfoCard>
          <h2>Informações</h2>
          <InfoItem>
            <Label>Número:</Label>
            <Value>{table.number}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Capacidade:</Label>
            <Value>{table.capacity} pessoas</Value>
          </InfoItem>
          <InfoItem>
            <Label>Status:</Label>
            <StatusBadge status={table.status}>
              {getStatusText(table.status)}
            </StatusBadge>
          </InfoItem>
        </InfoCard>

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => navigate(`/tables/${table.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm("Tem certeza que deseja excluir esta mesa?")) {
                deleteTable(table.id);
                navigate("/tables");
              }
            }}
          >
            Excluir
          </Button>
        </ButtonGroup>
      </Content>
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
  width: 100px;
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
