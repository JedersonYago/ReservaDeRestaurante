import styled, { keyframes } from "styled-components";
import { Button } from "../../components/Button";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
  z-index: 0;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  z-index: 1;
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.background.primary};
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    transform: scale(1.05);
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary[100]};
  }
`;

export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const WelcomeSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 1.6;
`;

export const TimerBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[100]};
  border: 1px solid ${({ theme }) => theme.colors.semantic.warning};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  strong {
    color: ${({ theme }) => theme.colors.semantic.warning};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

export const TimerIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.warning};
  flex-shrink: 0;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[3]};
  transition: color ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const SubmitButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const InfoBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[100]};
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  div {
    flex: 1;

    strong {
      display: block;
      color: ${({ theme }) => theme.colors.primary.main};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }

    p {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      line-height: 1.5;
    }
  }
`;

export const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

// Estilos para seção de sucesso
export const SuccessSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const SuccessIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.success};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const SuccessTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SuccessSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 1.6;
  max-width: 400px;
`;

// Estilos para seção de erro
export const ErrorSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ErrorSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: 1.6;
  max-width: 400px;
`;

export const ErrorBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[100]};
  border: 1px solid ${({ theme }) => theme.colors.semantic.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: left;
  width: 100%;
  max-width: 400px;

  div {
    flex: 1;

    strong {
      display: block;
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-bottom: ${({ theme }) => theme.spacing[2]};
    }

    ul {
      margin: 0;
      padding-left: ${({ theme }) => theme.spacing[4]};
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      line-height: 1.5;

      li {
        margin-bottom: ${({ theme }) => theme.spacing[1]};
      }
    }
  }
`;

export const ErrorBoxIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

// Estilos para seção de carregamento
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Estilos para botões de ação
export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  max-width: 400px;
  margin-top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled(Button)`
  flex: 1;
`;

export const SecondaryButton = styled(Button).attrs({ variant: "outline" })`
  flex: 1;
`;
