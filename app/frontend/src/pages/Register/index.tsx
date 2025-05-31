import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface FormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();

  const password = watch("password");

  async function handleRegister(data: FormInputs) {
    try {
      if (data.password !== data.confirmPassword) {
        return;
      }
      // TODO: Implementar registro
      navigate("/login");
    } catch (error) {
      // TODO: Tratar erro
    }
  }

  return (
    <Container>
      <FormContainer>
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit(handleRegister)}>
          <InputGroup>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Nome é obrigatório" })}
              placeholder="Seu nome completo"
            />
            {errors.name && <span>{errors.name.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
              placeholder="seu@email.com"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "Mínimo de 6 caracteres",
                },
              })}
              placeholder="Sua senha"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === password || "Senhas não conferem",
              })}
              placeholder="Confirme sua senha"
            />
            {errors.confirmPassword && (
              <span>{errors.confirmPassword.message}</span>
            )}
          </InputGroup>

          <ButtonGroup>
            <button type="button" onClick={() => navigate("/login")}>
              Voltar
            </button>
            <button type="submit">Cadastrar</button>
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
  max-width: 400px;

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

  input {
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
