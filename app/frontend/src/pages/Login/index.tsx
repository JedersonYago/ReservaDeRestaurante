import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import { theme } from "../../styles/theme";
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
    <Container>
      <BackgroundPattern />
      <ContentWrapper>
        <LeftSection>
          <FormSection>
            <FormContainer>
              <BrandSection>
                <Logo size="lg" variant="full" onClick={() => navigate("/")} />
              </BrandSection>

              <BackButton onClick={() => navigate("/")}>
                <ArrowLeft size={16} />
                Voltar
              </BackButton>
              <FormHeader>
                <WelcomeTitle>Bem-vindo de volta!</WelcomeTitle>
                <WelcomeSubtitle>
                  Acesse sua conta para gerenciar suas reservas
                </WelcomeSubtitle>
              </FormHeader>

              <form onSubmit={handleSubmit(handleLogin)}>
                <InputGroup>
                  <InputWrapper>
                    <InputIcon>
                      <User size={18} />
                    </InputIcon>
                    <Input
                      label="Nome de Usuário"
                      type="text"
                      error={errors.username?.message}
                      hasIcon
                      {...register("username")}
                      placeholder="Digite seu nome de usuário"
                    />
                  </InputWrapper>

                  <InputWrapper>
                    <InputIcon>
                      <Lock size={18} />
                    </InputIcon>
                    <Input
                      label="Senha"
                      type="password"
                      error={errors.password?.message}
                      hasIcon
                      {...register("password")}
                      placeholder="Digite sua senha"
                    />
                  </InputWrapper>
                </InputGroup>

                <SubmitButton
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </SubmitButton>
              </form>

              <FooterLinks>
                <RegisterLink to="/register">
                  Não tem uma conta? <strong>Registre-se</strong>
                </RegisterLink>
              </FooterLinks>
            </FormContainer>
          </FormSection>
        </LeftSection>

        <RightSection>
          <HeroContent>
            <HeroTitle>
              Gerencie suas <GradientText>reservas</GradientText>
              <br />
              de forma inteligente
            </HeroTitle>
            <HeroSubtitle>
              Tenha controle total sobre as mesas, horários e clientes do seu
              restaurante.
            </HeroSubtitle>
            <FeaturesList>
              <FeatureItem>
                <Sparkles size={16} />
                Interface responsiva
              </FeatureItem>
              <FeatureItem>
                <Shield size={16} />
                Segurança e privacidade
              </FeatureItem>
              <FeatureItem>
                <Zap size={16} />
                Sincronização em tempo real
              </FeatureItem>
              <FeatureItem>
                <BarChart3 size={16} />
                Relatórios e analytics
              </FeatureItem>
            </FeaturesList>
          </HeroContent>
        </RightSection>
      </ContentWrapper>
    </Container>
  );
}

// Animações
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.main} 0%,
    ${theme.colors.secondary.main} 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div`
  background: ${theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: ${theme.breakpoints.lg}) {
    min-height: 100vh;
  }
`;

const BrandSection = styled.div`
  padding: 0 0 ${theme.spacing[4]};
  text-align: left;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 0 ${theme.spacing[3]};
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-bottom: ${theme.spacing[8]};
  padding: ${theme.spacing[2]} 0;
  transition: all ${theme.transitions.timing.out} 0.2s;
  align-self: flex-start;
  width: fit-content;

  &:hover {
    color: ${theme.colors.primary.main};
    transform: translateX(-4px);
  }
`;

const FormContainer = styled.div`
  max-width: 400px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const FormHeader = styled.div`
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: ${theme.typography.fontSize["xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[3]};
  line-height: ${theme.typography.lineHeight.tight};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 44px;
  left: ${theme.spacing[3]};
  color: ${theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.main} 0%,
    ${theme.colors.primary.dark} 100%
  );
  border: none;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  transition: all ${theme.transitions.timing.out} 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const FooterLinks = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[8]};
`;

const RegisterLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.timing.out} 0.2s;

  strong {
    color: ${theme.colors.primary.main};
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  &:hover {
    color: ${theme.colors.primary.main};

    strong {
      text-decoration: underline;
    }
  }
`;

const RightSection = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.main}15 0%,
    ${theme.colors.secondary.main}15 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.colors.primary.main.replace(
      "#",
      ""
    )}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const HeroContent = styled.div`
  max-width: 500px;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h2`
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.tight};
  margin-bottom: ${theme.spacing[6]};
`;

const GradientText = styled.span`
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.main} 0%,
    ${theme.colors.secondary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
  margin-bottom: ${theme.spacing[8]};
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  text-align: left;
`;

const FeatureItem = styled.div`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.2s);

  svg {
    color: ${theme.colors.primary.main};
    flex-shrink: 0;
  }

  &:nth-child(1) {
    --i: 0;
  }
  &:nth-child(2) {
    --i: 1;
  }
  &:nth-child(3) {
    --i: 2;
  }
  &:nth-child(4) {
    --i: 3;
  }
`;
