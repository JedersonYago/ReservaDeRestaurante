import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useReservations } from "../../hooks/useReservations";
import { toast } from "react-toastify";
import styled from "styled-components";
import { format } from "date-fns";
import type { CreateReservationData } from "../../types/reservation";
// import { ptBR } from "date-fns/locale";

const schema = yup.object().shape({
  date: yup.string().required("Data é obrigatória"),
  time: yup.string().required("Horário é obrigatório"),
  numberOfPeople: yup
    .number()
    .required("Número de pessoas é obrigatório")
    .min(1, "Mínimo de 1 pessoa")
    .max(20, "Máximo de 20 pessoas"),
  name: yup.string().required("Nome é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
});

export function NewReservation() {
  const navigate = useNavigate();
  const { createReservation } = useReservations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReservationData>({
    resolver: yupResolver(schema),
  });

  async function handleCreateReservation(data: CreateReservationData) {
    try {
      await createReservation(data);
      navigate("/reservations");
    } catch (error) {
      toast.error("Erro ao criar reserva. Tente novamente.");
    }
  }

  return (
    <Container>
      <FormContainer>
        <h1>Nova Reserva</h1>
        <form onSubmit={handleSubmit(handleCreateReservation)}>
          <InputGroup>
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              {...register("date")}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {errors.date && <span>{errors.date.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="time">Horário</label>
            <select id="time" {...register("time")}>
              <option value="">Selecione um horário</option>
              {/* Horários serão carregados dinamicamente */}
            </select>
            {errors.time && <span>{errors.time.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="numberOfPeople">Número de Pessoas</label>
            <input
              type="number"
              id="numberOfPeople"
              {...register("numberOfPeople")}
              min="1"
              max="20"
            />
            {errors.numberOfPeople && (
              <span>{errors.numberOfPeople.message}</span>
            )}
          </InputGroup>

          <InputGroup>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              {...register("name")}
              placeholder="Seu nome completo"
            />
            {errors.name && <span>{errors.name.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              placeholder="(00) 00000-0000"
            />
            {errors.phone && <span>{errors.phone.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="seu@email.com"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </InputGroup>

          <ButtonGroup>
            <button type="button" onClick={() => navigate("/reservations")}>
              Cancelar
            </button>
            <button type="submit">Criar Reserva</button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #666;
  }

  input,
  select {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  span {
    color: #dc3545;
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &[type="submit"] {
      background: #007bff;
      color: white;

      &:hover {
        background: #0056b3;
      }
    }

    &[type="button"] {
      background: #6c757d;
      color: white;

      &:hover {
        background: #5a6268;
      }
    }
  }
`;
