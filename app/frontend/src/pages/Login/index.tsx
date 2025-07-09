import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import {
  ArrowLeft,
  User,
  Lock,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import * as S from "./styles";

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
  const toast = useToast();

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
    <S.Container>
      <S.BackgroundPattern />
      <S.ContentWrapper>
        <S.LeftSection>
          <S.FormSection>
            <S.FormContainer>
              <S.BrandSection>
                <Logo size="lg" variant="full" onClick={() => navigate("/")} />
              </S.BrandSection>

              <S.BackButton onClick={() => navigate("/")}>
                <ArrowLeft size={16} />
                Voltar
              </S.BackButton>
              <S.FormHeader>
                <S.WelcomeTitle>Bem-vindo de volta!</S.WelcomeTitle>
                <S.WelcomeSubtitle>
                  Acesse sua conta para gerenciar suas reservas
                </S.WelcomeSubtitle>
              </S.FormHeader>

              <form onSubmit={handleSubmit(handleLogin)}>
                <S.InputGroup>
                  <S.InputWrapper>
                    <S.InputIcon>
                      <User size={18} />
                    </S.InputIcon>
                    <Input
                      label="Nome de Usuário"
                      type="text"
                      error={errors.username?.message}
                      hasIcon
                      autoComplete="username"
                      {...register("username")}
                      placeholder="Digite seu nome de usuário"
                    />
                  </S.InputWrapper>

                  <S.InputWrapper>
                    <S.InputIcon>
                      <Lock size={18} />
                    </S.InputIcon>
                    <Input
                      label="Senha"
                      type="password"
                      error={errors.password?.message}
                      hasIcon
                      autoComplete="current-password"
                      {...register("password")}
                      placeholder="Digite sua senha"
                    />
                  </S.InputWrapper>
                </S.InputGroup>

                <S.SubmitButton
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </S.SubmitButton>
              </form>

              <S.FooterLinks>
                <S.RegisterLink to="/register">
                  Não tem uma conta? <strong>Registre-se</strong>
                </S.RegisterLink>
              </S.FooterLinks>
            </S.FormContainer>
          </S.FormSection>
        </S.LeftSection>

        <S.RightSection>
          <S.HeroContent>
            <S.HeroTitle>
              Gerencie suas <S.GradientText>reservas</S.GradientText>
              <br />
              de forma inteligente
            </S.HeroTitle>
            <S.HeroSubtitle>
              Tenha controle total sobre as mesas, horários e clientes do seu
              restaurante.
            </S.HeroSubtitle>
            <S.FeaturesList>
              <S.FeatureItem>
                <Sparkles size={16} />
                Interface responsiva
              </S.FeatureItem>
              <S.FeatureItem>
                <Shield size={16} />
                Segurança e privacidade
              </S.FeatureItem>
              <S.FeatureItem>
                <Zap size={16} />
                Sincronização em tempo real
              </S.FeatureItem>
              <S.FeatureItem>
                <BarChart3 size={16} />
                Relatórios e analytics
              </S.FeatureItem>
            </S.FeaturesList>
          </S.HeroContent>
        </S.RightSection>
      </S.ContentWrapper>
    </S.Container>
  );
}
