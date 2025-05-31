import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import styled from "styled-components";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { signIn } = useAuth();

  async function handleLogin(data: LoginFormData) {
    try {
      await signIn(data.email, data.password);
      toast.success("Login realizado com sucesso!");
      navigate("/reservations");
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    }
  }

  return (
    <Container>
      <FormContainer>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <InputGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Seu email"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Sua senha"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </InputGroup>

          <button type="submit">Entrar</button>
        </form>

        <p>
          Não tem uma conta? <a href="/register">Registre-se</a>
        </p>
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

  button {
    background: #007bff;
    color: white;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    margin-top: 1rem;

    &:hover {
      background: #0056b3;
    }
  }

  p {
    text-align: center;
    margin-top: 1rem;

    a {
      color: #007bff;
      text-decoration: underline;
    }
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
