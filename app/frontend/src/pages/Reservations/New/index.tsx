import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservations } from "../../../hooks/useReservations";
import { useReservationValidation } from "../../../hooks/useReservationValidation";
import styled from "styled-components";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { TableCard } from "../../../components/TableCard";

export function NewReservation() {
  const navigate = useNavigate();
  const { createReservation } = useReservations();
  const {
    availableTables,
    isLoading,
    validateDateTime,
    validateCapacity,
    loadAvailableTables,
  } = useReservationValidation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    numberOfPeople: "",
  });

  const [selectedTable, setSelectedTable] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDateTime(formData.date, formData.time)) {
      return;
    }

    if (!validateCapacity(selectedTable, Number(formData.numberOfPeople))) {
      return;
    }

    try {
      await createReservation({
        ...formData,
        numberOfPeople: Number(formData.numberOfPeople),
      });
      navigate("/reservations");
    } catch (error) {
      // Erro já é tratado no hook useReservations
    }
  };

  const handleDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "date" | "time"
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "date" && formData.time) {
      loadAvailableTables(value, formData.time);
    } else if (field === "time" && formData.date) {
      loadAvailableTables(formData.date, value);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Nova Reserva</h1>
        <Button variant="secondary" onClick={() => navigate("/reservations")}>
          Voltar
        </Button>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <h2>Informações Pessoais</h2>
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Input
            label="Telefone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            required
          />
        </FormSection>

        <FormSection>
          <h2>Data e Horário</h2>
          <Input
            label="Data"
            type="date"
            value={formData.date}
            onChange={(e) => handleDateTimeChange(e, "date")}
            required
          />
          <Input
            label="Horário"
            type="time"
            value={formData.time}
            onChange={(e) => handleDateTimeChange(e, "time")}
            required
          />
          <Input
            label="Número de Pessoas"
            type="number"
            value={formData.numberOfPeople}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                numberOfPeople: e.target.value,
              }))
            }
            required
          />
        </FormSection>

        <FormSection>
          <h2>Selecione uma Mesa</h2>
          {availableTables.length === 0 ? (
            <EmptyState>
              {formData.date && formData.time ? (
                <p>Nenhuma mesa disponível para este horário.</p>
              ) : (
                <p>
                  Selecione uma data e horário para ver as mesas disponíveis.
                </p>
              )}
            </EmptyState>
          ) : (
            <TableGrid>
              {availableTables.map((table) => (
                <TableCard
                  key={table.id}
                  selected={selectedTable === table.id}
                  onClick={() => setSelectedTable(table.id)}
                >
                  <h3>Mesa {table.number}</h3>
                  <p>Capacidade: {table.capacity} pessoas</p>
                </TableCard>
              ))}
            </TableGrid>
          )}
        </FormSection>

        <ButtonGroup>
          <Button type="submit">Criar Reserva</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/reservations")}
          >
            Cancelar
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
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
  display: grid;
  gap: 2rem;
`;

const FormSection = styled.section`
  h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }

  display: grid;
  gap: 1rem;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
