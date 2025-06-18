import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";

export function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: "client",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedRole = watch("role");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  // Função para verificar força da senha
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  async function handleRegister(data: RegisterFormData) {
    try {
      const response = await authService.register({
        ...data,
        adminCode: data.adminCode || undefined,
      });
      localStorage.setItem("token", response.token);

      // Atualizar o estado de autenticação
      await queryClient.setQueryData(["user"], response.user);
      // Invalida todas as queries para garantir dados atualizados para o novo usuário
      queryClient.invalidateQueries();

      toast.success("Conta criada com sucesso!");

      // Redirecionar após atualizar o estado
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Erro completo:", error.response?.data);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.details) {
        // Mostrar cada erro individualmente
        error.response.data.details.forEach((detail: any) => {
          toast.error(`${detail.path.join(".")}: ${detail.message}`);
        });
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    }
  }

  return (
    <Container>
      <FormContainer>
        <h1>Criar Conta</h1>
        <p className="subtitle">Preencha os dados para se registrar</p>

        <form onSubmit={handleSubmit(handleRegister)}>
          <Input
            label="Nome"
            type="text"
            error={errors.name?.message}
            {...register("name")}
            placeholder="Seu nome completo"
          />

          <Input
            label="Nome de Usuário"
            type="text"
            error={errors.username?.message}
            {...register("username")}
            placeholder="Seu nome de usuário"
          />

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
            placeholder="Seu email"
          />

          <div>
            <Input
              label="Senha"
              type="password"
              error={errors.password?.message}
              {...register("password")}
              placeholder="Sua senha"
            />
            {passwordValue && (
              <PasswordStrength>
                {(() => {
                  const { checks, score } =
                    checkPasswordStrength(passwordValue);
                  const strengthLevel =
                    score === 5 ? "strong" : score >= 3 ? "medium" : "weak";

                  return (
                    <>
                      <StrengthBar level={strengthLevel}>
                        <StrengthFill level={strengthLevel} score={score} />
                      </StrengthBar>
                      <StrengthText level={strengthLevel}>
                        {score === 5
                          ? "🟢 Senha forte"
                          : score >= 3
                          ? "🟡 Senha média"
                          : "🔴 Senha fraca"}
                      </StrengthText>
                      <CheckList>
                        <CheckItem valid={checks.length}>
                          {checks.length ? "✅" : "❌"} Mínimo 8 caracteres
                        </CheckItem>
                        <CheckItem valid={checks.uppercase}>
                          {checks.uppercase ? "✅" : "❌"} Letra maiúscula
                        </CheckItem>
                        <CheckItem valid={checks.lowercase}>
                          {checks.lowercase ? "✅" : "❌"} Letra minúscula
                        </CheckItem>
                        <CheckItem valid={checks.number}>
                          {checks.number ? "✅" : "❌"} Número
                        </CheckItem>
                        <CheckItem valid={checks.special}>
                          {checks.special ? "✅" : "❌"} Caractere especial
                        </CheckItem>
                      </CheckList>
                    </>
                  );
                })()}
              </PasswordStrength>
            )}
          </div>

          <div>
            <Input
              label="Confirmar Senha"
              type="password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              placeholder="Confirme sua senha"
            />
            {confirmPasswordValue && passwordValue && (
              <PasswordMatch>
                {confirmPasswordValue === passwordValue ? (
                  <MatchText valid={true}>✅ As senhas conferem</MatchText>
                ) : (
                  <MatchText valid={false}>❌ As senhas não conferem</MatchText>
                )}
              </PasswordMatch>
            )}
          </div>

          <div className="role-selector">
            <label>Tipo de Conta</label>
            <div className="role-options">
              <label>
                <input type="radio" value="client" {...register("role")} />
                Cliente
              </label>
              <label>
                <input type="radio" value="admin" {...register("role")} />
                Administrador
              </label>
            </div>
            {errors.role && (
              <span className="error">{errors.role.message}</span>
            )}
          </div>

          {selectedRole === "admin" && (
            <Input
              label="Código de Administrador"
              type="password"
              error={errors.adminCode?.message}
              {...register("adminCode")}
              placeholder="Digite o código de administrador"
            />
          )}

          {passwordValue && checkPasswordStrength(passwordValue).score < 5 && (
            <SubmitWarning>
              ⚠️ Complete todos os critérios de senha para continuar
            </SubmitWarning>
          )}

          {confirmPasswordValue &&
            passwordValue &&
            confirmPasswordValue !== passwordValue && (
              <SubmitWarning>
                ⚠️ As senhas devem ser iguais para continuar
              </SubmitWarning>
            )}

          <Button
            type="submit"
            $fullWidth
            disabled={
              isSubmitting ||
              (!!passwordValue &&
                checkPasswordStrength(passwordValue).score < 5) ||
              (!!confirmPasswordValue &&
                !!passwordValue &&
                confirmPasswordValue !== passwordValue)
            }
          >
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <p className="login-text">
          Já tem uma conta? <Link to="/login">Faça login</Link>
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
  max-width: 500px;

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

  .role-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      color: #333;
      font-weight: 500;
    }

    .role-options {
      display: flex;
      gap: 1rem;

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
    }
  }

  .login-text {
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

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div<{ level: string }>`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StrengthFill = styled.div<{ level: string; score: number }>`
  height: 100%;
  width: ${(props) => (props.score / 5) * 100}%;
  background: ${(props) =>
    props.level === "strong"
      ? "#4caf50"
      : props.level === "medium"
      ? "#ff9800"
      : "#f44336"};
  transition: all 0.3s ease;
`;

const StrengthText = styled.div<{ level: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) =>
    props.level === "strong"
      ? "#4caf50"
      : props.level === "medium"
      ? "#ff9800"
      : "#f44336"};
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CheckItem = styled.div<{ valid: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.valid ? "#4caf50" : "#666")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PasswordMatch = styled.div`
  margin-top: 0.5rem;
`;

const MatchText = styled.div<{ valid: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.valid ? "#4caf50" : "#f44336")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitWarning = styled.div`
  font-size: 0.875rem;
  color: #ff9800;
  text-align: center;
  padding: 0.75rem;
  background: #fff3e0;
  border-radius: 4px;
  border-left: 3px solid #ff9800;
  margin-bottom: 1rem;
`;
