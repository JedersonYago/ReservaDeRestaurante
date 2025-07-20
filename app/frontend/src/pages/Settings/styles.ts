import styled from "styled-components";
import { spin } from "../../styles/animations";

// PageWrapper removido - agora usando componente centralizado
// import { PageWrapper } from "../../components/Layout/PageWrapper";

export const HeaderSection = styled.header`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TitleSection = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding-bottom: 120px; /* Espaço para FixedActionBar */

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[6]};
  }

  @media (max-width: 768px) {
    padding-bottom: 140px; /* Mais espaço em mobile */
  }

  /* Garantir que o form herde o gap */
  & > form {
    display: flex;
    flex-direction: column;
    gap: inherit;
  }
`;

export const ConfigCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

export const ConfigSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  margin: 0;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.neutral[300]};
  }
`;

export const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

export const ToggleSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked, theme }) =>
    checked ? theme.colors.primary.main : theme.colors.neutral[300]};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${(props) => (props.checked ? "23px" : "3px")};
    top: 3px;
    background-color: ${({ theme }) => theme.colors.background.primary};
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export const ToggleLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-size: 0.75rem;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HelpText = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary.main}10;
  border-radius: 6px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary.main};
  line-height: 1.4;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const LoadingSpinner = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary.main};

  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  text-align: center;
`;

export const ErrorIcon = styled.div`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.semantic.error};
`;

export const ErrorContent = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

export const MessageContainer = styled.div<{ $variant: "error" | "success" }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ $variant, theme }) =>
    $variant === "error"
      ? `${theme.colors.semantic.error}15`
      : `${theme.colors.semantic.success}15`};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "error"
        ? `${theme.colors.semantic.error}30`
        : `${theme.colors.semantic.success}30`};
`;

export const MessageIcon = styled.div<{ $variant?: "error" | "success" }>`
  color: ${({ $variant, theme }) =>
    $variant === "error"
      ? theme.colors.semantic.error
      : theme.colors.semantic.success};
  flex-shrink: 0;
`;

export const MessageText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.75rem;
  font-weight: 500;
`;
