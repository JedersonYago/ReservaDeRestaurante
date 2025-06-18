import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { loginSchema, type LoginFormData } from "../../schemas/auth";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(data: LoginFormData) {
    try {
      const response = await authService.login(data);
      await queryClient.setQueryData(["user"], response.user);
      // Invalida todas as queries para garantir dados atualizados para o novo usuário
      queryClient.invalidateQueries();
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage);
    }
  }

  return (
    <Container>
      <FormContainer>
        <h1>Bem-vindo de volta!</h1>
        <p className="subtitle">Faça login para acessar sua conta</p>

        <form onSubmit={handleSubmit(handleLogin)}>
          <Input
            label="Nome de Usuário"
            type="text"
            error={errors.username?.message}
            {...register("username")}
            placeholder="Seu nome de usuário"
          />

          <Input
            label="Senha"
            type="password"
            error={errors.password?.message}
            {...register("password")}
            placeholder="Sua senha"
          />

          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="register-text">
          Não tem uma conta? <Link to="/register">Registre-se</Link>
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
  background: #f5f5f5;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 1.8rem;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .register-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;

    a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
