import styled from "styled-components";
import { Link } from "react-router-dom";
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
  top: 70%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
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

export const FooterLinks = styled.div`
  text-align: center;
`;

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};

  strong {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

// Estilos para a tela de sucesso
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

  strong {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  width: 100%;
  max-width: 400px;
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

export const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }

  span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

export const WarningBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[100]};
  border: 1px solid ${({ theme }) => theme.colors.semantic.warning};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: left;
  width: 100%;
  max-width: 400px;

  svg {
    color: ${({ theme }) => theme.colors.semantic.warning};
    flex-shrink: 0;
    margin-top: ${({ theme }) => theme.spacing[1]};
  }

  div {
    flex: 1;

    strong {
      display: block;
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }

    p {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      line-height: 1.5;
      margin: 0;
    }
  }
`;

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
