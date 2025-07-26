import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  newPassword: z
    .string()
    .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirmação de senha é obrigatória"),
});

import { Input } from "../../components/Input";
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Timer,
  XCircle,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import * as S from "./styles";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface TokenVerificationResult {
  valid: boolean;
  message: string;
  expiresAt?: string;
}

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenVerificationResult | null>(
    null
  );
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const token = searchParams.get("token");
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "", token: "" },
  });

  // Verificar token ao carregar a página
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setTokenInfo({
        valid: false,
        message: "Token não fornecido na URL",
      });
      return;
    }

    verifyToken();
  }, [token]);

  async function verifyToken() {
    try {
      const response = await fetch(
        `/api/auth/verify-reset-token?token=${token}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      setIsTokenValid(result.valid);
      setTokenInfo(result);

      if (result.valid && result.expiresAt) {
        setExpiresAt(result.expiresAt);
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      setIsTokenValid(false);
      setTokenInfo({
        valid: false,
        message: "Erro ao verificar token",
      });
    }
  }

  async function handleResetPassword(data: ResetPasswordFormData) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsPasswordReset(true);
        toast.success("Senha redefinida com sucesso!");
      } else {
        toast.error(result.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  }

  // Formatar tempo restante
  function formatTimeRemaining(expiresAt: string): string {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return "Expirado";

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  }

  // Tela de sucesso
  if (isPasswordReset) {
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

                <S.SuccessTitle>Senha Redefinida!</S.SuccessTitle>
                <S.SuccessSubtitle>
                  Sua senha foi redefinida com sucesso. Agora você pode fazer
                  login com sua nova senha.
                </S.SuccessSubtitle>

                <S.InfoBox>
                  <S.InfoIcon>
                    <Shield size={20} />
                  </S.InfoIcon>
                  <div>
                    <strong>Por sua segurança</strong>
                    <p>
                      Todos os seus dispositivos foram desconectados. Você
                      precisará fazer login novamente em todos os dispositivos.
                    </p>
                  </div>
                </S.InfoBox>

                <S.ActionButtons>
                  <S.PrimaryButton onClick={() => navigate("/login")}>
                    Fazer Login
                  </S.PrimaryButton>
                </S.ActionButtons>
              </S.SuccessSection>
            </S.FormContainer>
          </S.FormSection>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // Tela de token inválido
  if (isTokenValid === false) {
    return (
      <S.Container>
        <S.BackgroundPattern />
        <S.ContentWrapper>
          <S.FormSection>
            <S.FormContainer>
              <S.BrandSection>
                <Logo size="lg" variant="full" onClick={() => navigate("/")} />
              </S.BrandSection>

              <S.ErrorSection>
                <S.ErrorIcon>
                  <XCircle size={64} />
                </S.ErrorIcon>

                <S.ErrorTitle>Token Inválido</S.ErrorTitle>
                <S.ErrorSubtitle>
                  {tokenInfo?.message ||
                    "O link de recuperação é inválido ou expirou."}
                </S.ErrorSubtitle>

                <S.ErrorBox>
                  <S.ErrorBoxIcon>
                    <AlertTriangle size={20} />
                  </S.ErrorBoxIcon>
                  <div>
                    <strong>Possíveis causas:</strong>
                    <ul>
                      <li>O link expirou (válido por apenas 1 hora)</li>
                      <li>O link já foi usado</li>
                      <li>Uma nova solicitação foi feita</li>
                      <li>O link está malformado</li>
                    </ul>
                  </div>
                </S.ErrorBox>

                <S.ActionButtons>
                  <S.SecondaryButton
                    onClick={() => navigate("/forgot-password")}
                  >
                    Solicitar Novo Link
                  </S.SecondaryButton>
                  <S.PrimaryButton onClick={() => navigate("/login")}>
                    Ir para Login
                  </S.PrimaryButton>
                </S.ActionButtons>
              </S.ErrorSection>
            </S.FormContainer>
          </S.FormSection>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // Tela de carregamento
  if (isTokenValid === null) {
    return (
      <S.Container>
        <S.BackgroundPattern />
        <S.ContentWrapper>
          <S.FormSection>
            <S.FormContainer>
              <S.BrandSection>
                <Logo size="lg" variant="full" />
              </S.BrandSection>

              <S.LoadingSection>
                <S.LoadingSpinner />
                <S.LoadingText>Verificando token...</S.LoadingText>
              </S.LoadingSection>
            </S.FormContainer>
          </S.FormSection>
        </S.ContentWrapper>
      </S.Container>
    );
  }

  // Tela principal de redefinição
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
              <S.WelcomeTitle>Redefinir Senha</S.WelcomeTitle>
              <S.WelcomeSubtitle>
                Digite sua nova senha. Certifique-se de que seja segura e fácil
                de lembrar.
              </S.WelcomeSubtitle>
            </S.FormHeader>

            {expiresAt && (
              <S.TimerBox>
                <S.TimerIcon>
                  <Timer size={16} />
                </S.TimerIcon>
                <span>
                  Este link expira em:{" "}
                  <strong>{formatTimeRemaining(expiresAt)}</strong>
                </span>
              </S.TimerBox>
            )}

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <S.InputGroup>
                <S.InputWrapper>
                  <S.InputIcon>
                    <Lock size={18} />
                  </S.InputIcon>
                  <Input
                    label="Nova Senha"
                    type={showPassword ? "text" : "password"}
                    error={
                      typeof errors.newPassword?.message === "string"
                        ? errors.newPassword.message
                        : undefined
                    }
                    hasIcon
                    autoComplete="new-password"
                    {...register("newPassword")}
                    placeholder="Digite sua nova senha"
                  />
                  <S.PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </S.PasswordToggle>
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.InputIcon>
                    <Lock size={18} />
                  </S.InputIcon>
                  <Input
                    label="Confirmar Nova Senha"
                    type={showConfirmPassword ? "text" : "password"}
                    error={
                      typeof errors.confirmPassword?.message === "string"
                        ? errors.confirmPassword.message
                        : undefined
                    }
                    hasIcon
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    placeholder="Digite novamente sua nova senha"
                  />
                  <S.PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </S.PasswordToggle>
                </S.InputWrapper>
              </S.InputGroup>

              <S.SubmitButton
                type="submit"
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
              </S.SubmitButton>
            </form>

            <S.InfoBox>
              <S.InfoIcon>
                <Shield size={20} />
              </S.InfoIcon>
              <div>
                <strong>Dica de Segurança</strong>
                <p>
                  Use uma senha com pelo menos 8 caracteres, incluindo letras,
                  números e símbolos. Evite senhas fáceis de adivinhar.
                </p>
              </div>
            </S.InfoBox>
          </S.FormContainer>
        </S.FormSection>
      </S.ContentWrapper>
    </S.Container>
  );
}
