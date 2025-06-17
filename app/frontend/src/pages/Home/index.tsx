import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <h1>Bem-vindo ao Sistema de Reservas</h1>
      <ButtonGroup>
        <button onClick={() => navigate("/register")}>Registrar</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;

  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background: #0056b3;
    }
  }
`;
