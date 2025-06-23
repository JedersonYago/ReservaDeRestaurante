import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

import { Input } from "../../components/Input";
import { authService } from "../../services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";
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
import * as S from "./styles";

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
                <S.WelcomeTitle>Criar sua conta</S.WelcomeTitle>
                <S.WelcomeSubtitle>
                  Preencha os dados para começar a usar nossa plataforma
                </S.WelcomeSubtitle>
              </S.FormHeader>

              <form onSubmit={handleSubmit(handleRegister)}>
                <S.InputGroup>
                  <S.InputWrapper>
                    <S.InputIcon>
                      <User size={18} />
                    </S.InputIcon>
                    <Input
                      label="Nome"
                      type="text"
                      error={errors.name?.message}
                      hasIcon
                      {...register("name")}
                      placeholder="Digite seu nome completo"
                    />
                  </S.InputWrapper>

                  <S.InputWrapper>
                    <S.InputIcon>
                      <User size={18} />
                    </S.InputIcon>
                    <Input
                      label="Nome de Usuário"
                      type="text"
                      error={errors.username?.message}
                      hasIcon
                      {...register("username")}
                      placeholder="Escolha um nome de usuário"
                    />
                  </S.InputWrapper>

                  <S.InputWrapper>
                    <S.InputIcon>
                      <Mail size={18} />
                    </S.InputIcon>
                    <Input
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      hasIcon
                      {...register("email")}
                      placeholder="Digite seu email"
                    />
                  </S.InputWrapper>

                  <S.PasswordSection>
                    <S.InputWrapper>
                      <S.InputIcon>
                        <Lock size={18} />
                      </S.InputIcon>
                      <Input
                        label="Senha"
                        type="password"
                        error={errors.password?.message}
                        hasIcon
                        {...register("password")}
                        placeholder="Crie uma senha segura"
                      />
                    </S.InputWrapper>
                    {passwordValue && (
                      <S.PasswordStrength>
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
                              <S.StrengthBar level={strengthLevel}>
                                <S.StrengthFill
                                  level={strengthLevel}
                                  score={score}
                                />
                              </S.StrengthBar>
                              <S.StrengthText level={strengthLevel}>
                                <S.StrengthIcon level={strengthLevel}>
                                  {score === 5 ? (
                                    <CheckCircle size={14} />
                                  ) : score >= 3 ? (
                                    <AlertTriangle size={14} />
                                  ) : (
                                    <X size={14} />
                                  )}
                                </S.StrengthIcon>
                                {score === 5
                                  ? "Senha forte"
                                  : score >= 3
                                  ? "Senha média"
                                  : "Senha fraca"}
                              </S.StrengthText>
                              <S.CheckList>
                                <S.CheckItem valid={checks.length}>
                                  {checks.length ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Mínimo 8 caracteres
                                </S.CheckItem>
                                <S.CheckItem valid={checks.uppercase}>
                                  {checks.uppercase ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Letra maiúscula
                                </S.CheckItem>
                                <S.CheckItem valid={checks.lowercase}>
                                  {checks.lowercase ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Letra minúscula
                                </S.CheckItem>
                                <S.CheckItem valid={checks.number}>
                                  {checks.number ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Número
                                </S.CheckItem>
                                <S.CheckItem valid={checks.special}>
                                  {checks.special ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <X size={12} />
                                  )}{" "}
                                  Caractere especial
                                </S.CheckItem>
                              </S.CheckList>
                            </>
                          );
                        })()}
                      </S.PasswordStrength>
                    )}
                  </S.PasswordSection>

                  <S.PasswordSection>
                    <S.InputWrapper>
                      <S.InputIcon>
                        <Lock size={18} />
                      </S.InputIcon>
                      <Input
                        label="Confirmar Senha"
                        type="password"
                        error={errors.confirmPassword?.message}
                        hasIcon
                        {...register("confirmPassword")}
                        placeholder="Confirme sua senha"
                      />
                    </S.InputWrapper>
                    {confirmPasswordValue && passwordValue && (
                      <S.PasswordMatch>
                        {confirmPasswordValue === passwordValue ? (
                          <S.MatchText valid={true}>
                            <CheckCircle size={14} /> As senhas conferem
                          </S.MatchText>
                        ) : (
                          <S.MatchText valid={false}>
                            <X size={14} /> As senhas não conferem
                          </S.MatchText>
                        )}
                      </S.PasswordMatch>
                    )}
                  </S.PasswordSection>

                  <S.RoleSelector>
                    <S.RoleLabel>Tipo de Conta</S.RoleLabel>
                    <S.RoleOptions>
                      <S.RoleOption>
                        <S.RoleInput
                          type="radio"
                          value="client"
                          {...register("role")}
                        />
                        <S.RoleCard selected={selectedRole === "client"}>
                          <Users size={20} />
                          <S.RoleInfo>
                            <S.RoleTitle>Cliente</S.RoleTitle>
                            <S.RoleDescription>
                              Para fazer reservas
                            </S.RoleDescription>
                          </S.RoleInfo>
                        </S.RoleCard>
                      </S.RoleOption>
                      <S.RoleOption>
                        <S.RoleInput
                          type="radio"
                          value="admin"
                          {...register("role")}
                        />
                        <S.RoleCard selected={selectedRole === "admin"}>
                          <Shield size={20} />
                          <S.RoleInfo>
                            <S.RoleTitle>Administrador</S.RoleTitle>
                            <S.RoleDescription>
                              Para gerenciar reservas
                            </S.RoleDescription>
                          </S.RoleInfo>
                        </S.RoleCard>
                      </S.RoleOption>
                    </S.RoleOptions>
                    {errors.role && (
                      <S.ErrorText>{errors.role.message}</S.ErrorText>
                    )}
                  </S.RoleSelector>

                  {selectedRole === "admin" && (
                    <S.InputWrapper>
                      <S.InputIcon>
                        <Shield size={18} />
                      </S.InputIcon>
                      <Input
                        label="Código de Administrador"
                        type="password"
                        error={errors.adminCode?.message}
                        hasIcon
                        {...register("adminCode")}
                        placeholder="Digite o código de administrador"
                      />
                    </S.InputWrapper>
                  )}
                </S.InputGroup>

                {((passwordValue &&
                  checkPasswordStrength(passwordValue).score < 5) ||
                  (confirmPasswordValue &&
                    passwordValue &&
                    confirmPasswordValue !== passwordValue)) && (
                  <S.SubmitWarning>
                    <AlertTriangle size={16} />
                    Complete todos os critérios para continuar
                  </S.SubmitWarning>
                )}

                <S.SubmitButton
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
                </S.SubmitButton>
              </form>

              <S.FooterLinks>
                <S.LoginLink to="/login">
                  Já tem uma conta? <strong>Faça login</strong>
                </S.LoginLink>
              </S.FooterLinks>
            </S.FormContainer>
          </S.FormSection>
        </S.LeftSection>

        <S.RightSection>
          <S.HeroContent>
            <S.HeroTitle>
              Junte-se à nossa <S.GradientText>comunidade</S.GradientText>
              <br />
              de restaurantes
            </S.HeroTitle>
            <S.HeroSubtitle>
              Gerencie suas reservas de forma eficiente.
            </S.HeroSubtitle>
            <S.BenefitsList>
              <S.BenefitItem>
                <S.BenefitIcon>
                  <Rocket size={24} />
                </S.BenefitIcon>
                <S.BenefitText>
                  <S.BenefitTitle>Setup rápido</S.BenefitTitle>
                  <S.BenefitDescription>
                    Configure tudo em menos de 5 minutos
                  </S.BenefitDescription>
                </S.BenefitText>
              </S.BenefitItem>
              <S.BenefitItem>
                <S.BenefitIcon>
                  <Briefcase size={24} />
                </S.BenefitIcon>
                <S.BenefitText>
                  <S.BenefitTitle>Gestão profissional</S.BenefitTitle>
                  <S.BenefitDescription>
                    Ferramentas completas para seu negócio
                  </S.BenefitDescription>
                </S.BenefitText>
              </S.BenefitItem>
              <S.BenefitItem>
                <S.BenefitIcon>
                  <TrendingUp size={24} />
                </S.BenefitIcon>
                <S.BenefitText>
                  <S.BenefitTitle>Aumente a eficiência</S.BenefitTitle>
                  <S.BenefitDescription>
                    Otimize o tempo e reduza o trabalho manual
                  </S.BenefitDescription>
                </S.BenefitText>
              </S.BenefitItem>
            </S.BenefitsList>
          </S.HeroContent>
        </S.RightSection>
      </S.ContentWrapper>
    </S.Container>
  );
}
