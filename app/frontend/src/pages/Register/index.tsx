import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../components/Toast";
import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";
import { theme } from "../../styles/theme";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  Users,
  Rocket,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  X,
} from "lucide-react";
import { Logo } from "../../components/Logo";

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
  const toast = useToast();
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
                <WelcomeTitle>Criar sua conta</WelcomeTitle>
                <WelcomeSubtitle>
                  Preencha os dados para começar a usar nossa plataforma
                </WelcomeSubtitle>
              </FormHeader>

              <form onSubmit={handleSubmit(handleRegister)}>
                <InputGroup>
                  <InputWrapper>
                    <InputIcon>
                      <User size={18} />
                    </InputIcon>
                    <Input
                      label="Nome"
                      type="text"
                      error={errors.name?.message}
                      hasIcon
                      {...register("name")}
                      placeholder="Digite seu nome completo"
                    />
                  </InputWrapper>

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
                      placeholder="Escolha um nome de usuário"
                    />
                  </InputWrapper>

                  <InputWrapper>
                    <InputIcon>
                      <Mail size={18} />
                    </InputIcon>
                    <Input
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      hasIcon
                      {...register("email")}
                      placeholder="Digite seu email"
                    />
                  </InputWrapper>

                  <PasswordSection>
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
                        placeholder="Crie uma senha segura"
                      />
                    </InputWrapper>
                    {passwordValue && (
                      <PasswordStrength>
                        {(() => {
                          const { checks, score } =
                            checkPasswordStrength(passwordValue);
                          const strengthLevel =
                            score === 5
                              ? "strong"
                              : score >= 3
                              ? "medium"
                              : "weak";

                          return (
                            <>
                              <StrengthBar level={strengthLevel}>
                                <StrengthFill
                                  level={strengthLevel}
                                  score={score}
                                />
                              </StrengthBar>
                              <StrengthText level={strengthLevel}>
                                <StrengthIcon level={strengthLevel}>
                                  {score === 5 ? (
                                    <CheckCircle size={14} />
                                  ) : score >= 3 ? (
                                    <AlertTriangle size={14} />
                                  ) : (
                                    <X size={14} />
                                  )}
                                </StrengthIcon>
                                {score === 5
                                  ? "Senha forte"
                                  : score >= 3
                                  ? "Senha média"
                                  : "Senha fraca"}
                              </StrengthText>
                              <CheckList>
                                <CheckItem valid={checks.length}>
                                  {checks.length ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Mínimo 8 caracteres
                                </CheckItem>
                                <CheckItem valid={checks.uppercase}>
                                  {checks.uppercase ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Letra maiúscula
                                </CheckItem>
                                <CheckItem valid={checks.lowercase}>
                                  {checks.lowercase ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Letra minúscula
                                </CheckItem>
                                <CheckItem valid={checks.number}>
                                  {checks.number ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Número
                                </CheckItem>
                                <CheckItem valid={checks.special}>
                                  {checks.special ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Caractere especial
                                </CheckItem>
                              </CheckList>
                            </>
                          );
                        })()}
                      </PasswordStrength>
                    )}
                  </PasswordSection>

                  <PasswordSection>
                    <InputWrapper>
                      <InputIcon>
                        <Lock size={18} />
                      </InputIcon>
                      <Input
                        label="Confirmar Senha"
                        type="password"
                        error={errors.confirmPassword?.message}
                        hasIcon
                        {...register("confirmPassword")}
                        placeholder="Confirme sua senha"
                      />
                    </InputWrapper>
                    {confirmPasswordValue && passwordValue && (
                      <PasswordMatch>
                        {confirmPasswordValue === passwordValue ? (
                          <MatchText valid={true}>
                            <CheckCircle size={14} /> As senhas conferem
                          </MatchText>
                        ) : (
                          <MatchText valid={false}>
                            <X size={14} /> As senhas não conferem
                          </MatchText>
                        )}
                      </PasswordMatch>
                    )}
                  </PasswordSection>

                  <RoleSelector>
                    <RoleLabel>Tipo de Conta</RoleLabel>
                    <RoleOptions>
                      <RoleOption>
                        <RoleInput
                          type="radio"
                          value="client"
                          {...register("role")}
                        />
                        <RoleCard selected={selectedRole === "client"}>
                          <Users size={20} />
                          <RoleInfo>
                            <RoleTitle>Cliente</RoleTitle>
                            <RoleDescription>
                              Para fazer reservas
                            </RoleDescription>
                          </RoleInfo>
                        </RoleCard>
                      </RoleOption>
                      <RoleOption>
                        <RoleInput
                          type="radio"
                          value="admin"
                          {...register("role")}
                        />
                        <RoleCard selected={selectedRole === "admin"}>
                          <Shield size={20} />
                          <RoleInfo>
                            <RoleTitle>Administrador</RoleTitle>
                            <RoleDescription>
                              Para gerenciar reservas
                            </RoleDescription>
                          </RoleInfo>
                        </RoleCard>
                      </RoleOption>
                    </RoleOptions>
                    {errors.role && (
                      <ErrorText>{errors.role.message}</ErrorText>
                    )}
                  </RoleSelector>

                  {selectedRole === "admin" && (
                    <InputWrapper>
                      <InputIcon>
                        <Shield size={18} />
                      </InputIcon>
                      <Input
                        label="Código de Administrador"
                        type="password"
                        error={errors.adminCode?.message}
                        hasIcon
                        {...register("adminCode")}
                        placeholder="Digite o código de administrador"
                      />
                    </InputWrapper>
                  )}
                </InputGroup>

                {((passwordValue &&
                  checkPasswordStrength(passwordValue).score < 5) ||
                  (confirmPasswordValue &&
                    passwordValue &&
                    confirmPasswordValue !== passwordValue)) && (
                  <SubmitWarning>
                    <AlertTriangle size={16} />
                    Complete todos os critérios para continuar
                  </SubmitWarning>
                )}

                <SubmitButton
                  type="submit"
                  fullWidth
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
                </SubmitButton>
              </form>

              <FooterLinks>
                <LoginLink to="/login">
                  Já tem uma conta? <strong>Faça login</strong>
                </LoginLink>
              </FooterLinks>
            </FormContainer>
          </FormSection>
        </LeftSection>

        <RightSection>
          <HeroContent>
            <HeroTitle>
              Junte-se à nossa <GradientText>comunidade</GradientText>
              <br />
              de restaurantes
            </HeroTitle>
            <HeroSubtitle>
              Gerencie suas reservas de forma eficiente.
            </HeroSubtitle>
            <BenefitsList>
              <BenefitItem>
                <BenefitIcon>
                  <Rocket size={24} />
                </BenefitIcon>
                <BenefitText>
                  <BenefitTitle>Setup rápido</BenefitTitle>
                  <BenefitDescription>
                    Configure tudo em menos de 5 minutos
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>
                  <Briefcase size={24} />
                </BenefitIcon>
                <BenefitText>
                  <BenefitTitle>Gestão profissional</BenefitTitle>
                  <BenefitDescription>
                    Ferramentas completas para seu negócio
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>
                  <TrendingUp size={24} />
                </BenefitIcon>
                <BenefitText>
                  <BenefitTitle>Aumente a eficiência</BenefitTitle>
                  <BenefitDescription>
                    Otimize o tempo e reduza o trabalho manual
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
            </BenefitsList>
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
    transform: translateY(-5px);
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.primary.main} 100%
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
  padding: ${theme.spacing[4]} ${theme.spacing[8]} ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]} ${theme.spacing[6]} ${theme.spacing[6]};
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
  margin-bottom: ${theme.spacing[6]};
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
  max-width: 480px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const FormHeader = styled.div`
  margin-bottom: ${theme.spacing[6]};
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
  gap: ${theme.spacing[5]};
  margin-bottom: ${theme.spacing[6]};
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

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const PasswordStrength = styled.div`
  margin-top: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.neutral[200]};
`;

const StrengthBar = styled.div<{ level: string }>`
  width: 100%;
  height: 4px;
  background: ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing[2]};
`;

const StrengthFill = styled.div<{ level: string; score: number }>`
  height: 100%;
  width: ${(props) => (props.score / 5) * 100}%;
  background: ${(props) =>
    props.level === "strong"
      ? theme.colors.semantic.success
      : props.level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
  transition: all 0.3s ease;
`;

const StrengthText = styled.div<{ level: string }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  color: ${(props) =>
    props.level === "strong"
      ? theme.colors.semantic.success
      : props.level === "medium"
      ? theme.colors.semantic.warning
      : theme.colors.semantic.error};
`;

const StrengthIcon = styled.span<{ level: string }>`
  display: flex;
  align-items: center;

  svg {
    color: ${(props) =>
      props.level === "strong"
        ? theme.colors.semantic.success
        : props.level === "medium"
        ? theme.colors.semantic.warning
        : theme.colors.semantic.error};
  }
`;

const CheckList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[1]};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CheckItem = styled.div<{ valid: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  color: ${(props) =>
    props.valid ? theme.colors.semantic.success : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  svg {
    color: ${(props) =>
      props.valid
        ? theme.colors.semantic.success
        : theme.colors.semantic.error};
    flex-shrink: 0;
  }
`;

const PasswordMatch = styled.div`
  margin-top: ${theme.spacing[2]};
`;

const MatchText = styled.div<{ valid: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${(props) =>
    props.valid ? theme.colors.semantic.success : theme.colors.semantic.error};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  svg {
    color: ${theme.colors.semantic.success};
  }
`;

const RoleSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const RoleLabel = styled.label`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
`;

const RoleOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[3]};
`;

const RoleOption = styled.label`
  position: relative;
  cursor: pointer;
`;

const RoleInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const RoleCard = styled.div<{ selected: boolean }>`
  padding: ${theme.spacing[4]};
  border: 2px solid
    ${(props) =>
      props.selected ? theme.colors.primary.main : theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.lg};
  background: ${(props) =>
    props.selected
      ? `${theme.colors.primary.main}10`
      : theme.colors.background.primary};
  transition: all ${theme.transitions.timing.out} 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};

  &:hover {
    border-color: ${theme.colors.primary.main};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  svg {
    color: ${(props) =>
      props.selected ? theme.colors.primary.main : theme.colors.text.secondary};
  }
`;

const RoleInfo = styled.div`
  text-align: center;
`;

const RoleTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing[1]};
`;

const RoleDescription = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

const ErrorText = styled.span`
  color: ${theme.colors.semantic.error};
  font-size: ${theme.typography.fontSize.sm};
`;

const SubmitWarning = styled.div`
  background: ${theme.colors.semantic.warning}15;
  color: ${theme.colors.semantic.warning};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.semantic.warning}30;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  svg {
    flex-shrink: 0;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.secondary.dark} 100%
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
  margin-top: ${theme.spacing[6]};
`;

const LoginLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.timing.out} 0.2s;

  strong {
    color: ${theme.colors.secondary.main};
    font-weight: ${theme.typography.fontWeight.semibold};
  }

  &:hover {
    color: ${theme.colors.secondary.main};

    strong {
      text-decoration: underline;
    }
  }
`;

const RightSection = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.colors.secondary.main}15 0%,
    ${theme.colors.primary.main}15 100%
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
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.colors.secondary.main.replace(
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
    ${theme.colors.secondary.main} 0%,
    ${theme.colors.primary.main} 100%
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

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  text-align: left;
`;

const BenefitItem = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: flex-start;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.3s);

  &:nth-child(1) {
    --i: 0;
  }
  &:nth-child(2) {
    --i: 1;
  }
  &:nth-child(3) {
    --i: 2;
  }
`;

const BenefitIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.secondary.main};
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.5s);
`;

const BenefitText = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const BenefitDescription = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;
