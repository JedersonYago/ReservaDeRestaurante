import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import * as yup from "yup";

import { Input } from "../../components/Input";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import * as S from "./styles";

// Schema de validação
const forgotPasswordSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();
  const toast = useToast();

  async function handleForgotPassword(data: ForgotPasswordFormData) {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        setSentEmail(data.email);
        toast.success("Instruções enviadas para seu email!");
      } else {
        toast.error(result.message || "Erro ao solicitar recuperação");
      }
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  if (isEmailSent) {
    return (
      <S.Container>
        <S.BackgroundPattern />
        <S.ContentWrapper>
          <S.FormSection>
            <S.FormContainer>
              <S.BrandSection>
                <Logo size="lg" variant="full" onClick={() => navigate("/")} />
              </S.BrandSection>

              <S.SuccessSection>
                <S.SuccessIcon>
                  <CheckCircle size={64} />
                </S.SuccessIcon>

                <S.SuccessTitle>Email Enviado!</S.SuccessTitle>
                <S.SuccessSubtitle>
                  Enviamos as instruções de recuperação para:
                  <strong> {sentEmail}</strong>
                </S.SuccessSubtitle>

                <S.InstructionsList>
                  <S.InstructionItem>
                    <Clock size={16} />
                    <span>Verifique sua caixa de entrada e spam</span>
                  </S.InstructionItem>
                  <S.InstructionItem>
                    <Shield size={16} />
                    <span>O link é válido por apenas 1 hora</span>
                  </S.InstructionItem>
                  <S.InstructionItem>
                    <Mail size={16} />
                    <span>
                      Clique no link do email para redefinir sua senha
                    </span>
                  </S.InstructionItem>
                </S.InstructionsList>

                <S.WarningBox>
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Não recebeu o email?</strong>
                    <p>
                      Aguarde alguns minutos e verifique sua pasta de spam. Se
                      ainda não encontrar, tente solicitar novamente.
                    </p>
                  </div>
                </S.WarningBox>

                <S.ActionButtons>
                  <S.SecondaryButton
                    onClick={() => {
                      setIsEmailSent(false);
                      setSentEmail("");
                    }}
                  >
                    Tentar Outro Email
                  </S.SecondaryButton>
                  <S.PrimaryButton onClick={() => navigate("/login")}>
                    Voltar ao Login
                  </S.PrimaryButton>
                </S.ActionButtons>
              </S.SuccessSection>
            </S.FormContainer>
          </S.FormSection>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.BackgroundPattern />
      <S.ContentWrapper>
        <S.FormSection>
          <S.FormContainer>
            <S.BrandSection>
              <Logo size="lg" variant="full" onClick={() => navigate("/")} />
            </S.BrandSection>

            <S.BackButton onClick={() => navigate("/login")}>
              <ArrowLeft size={16} />
              Voltar ao Login
            </S.BackButton>

            <S.FormHeader>
              <S.WelcomeTitle>Esqueceu sua senha?</S.WelcomeTitle>
              <S.WelcomeSubtitle>
                Não se preocupe! Digite seu email e enviaremos instruções para
                redefinir sua senha.
              </S.WelcomeSubtitle>
            </S.FormHeader>

            <form onSubmit={handleSubmit(handleForgotPassword)}>
              <S.InputGroup>
                <S.InputWrapper>
                  <S.InputIcon>
                    <Mail size={18} />
                  </S.InputIcon>
                  <Input
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    hasIcon
                    autoComplete="email"
                    {...register("email")}
                    placeholder="Digite seu email cadastrado"
                  />
                </S.InputWrapper>
              </S.InputGroup>

              <S.SubmitButton
                type="submit"
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Instruções"}
              </S.SubmitButton>
            </form>

            <S.InfoBox>
              <S.InfoIcon>
                <Shield size={20} />
              </S.InfoIcon>
              <div>
                <strong>Sobre a Segurança</strong>
                <p>
                  Por segurança, sempre mostraremos esta mensagem, mesmo que o
                  email não esteja cadastrado. Se você possui uma conta conosco,
                  receberá as instruções.
                </p>
              </div>
            </S.InfoBox>

            <S.FooterLinks>
              <S.LoginLink to="/register">
                Não tem uma conta? <strong>Registre-se</strong>
              </S.LoginLink>
            </S.FooterLinks>
          </S.FormContainer>
        </S.FormSection>
      </S.ContentWrapper>
    </S.Container>
  );
}
