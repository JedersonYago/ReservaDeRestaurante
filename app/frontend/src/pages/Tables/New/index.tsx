import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../../../hooks/useTables";
import styled from "styled-components";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export function NewTable() {
  const navigate = useNavigate();
  const { createTable } = useTables();
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTable({
        number: Number(formData.number),
        capacity: Number(formData.capacity),
      });
      navigate("/tables");
    } catch (error) {
      // Erro já é tratado no hook useTables
    }
  };

  return (
    <Container>
      <Header>
        <h1>Nova Mesa</h1>
        <Button variant="secondary" onClick={() => navigate("/tables")}>
          Voltar
        </Button>
      </Header>

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
          <Button type="submit">Criar Mesa</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/tables")}
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
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
