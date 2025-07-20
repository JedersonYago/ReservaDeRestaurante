import styled from "styled-components";
import { spin } from "../../styles/animations";

// PageWrapper removido - agora usando componente centralizado
// import { PageWrapper } from "../../components/Layout/PageWrapper";

export const HeaderSection = styled.header`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;

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
  color: #111827;
  margin: 0 0 8px 0;

  svg {
    color: #fa761f;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 120px; /* Espaço para FixedActionBar */

  @media (max-width: 768px) {
    padding-bottom: 140px; /* Mais espaço em mobile */
  }
`;

export const ConfigCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

export const ConfigSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  color: #111827;
  margin: 0;

  svg {
    color: #fa761f;
  }
`;

export const SectionDescription = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
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
  background-color: ${(props) => (props.checked ? "#fa761f" : "#d1d5db")};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${(props) => (props.checked ? "23px" : "3px")};
    top: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
`;

export const ToggleLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-size: 0.75rem;

  svg {
    color: #fa761f;
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
  color: #6b7280;
  margin-top: 8px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #0ea5e9;
  line-height: 1.4;

  svg {
    color: #0ea5e9;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const LoadingSpinner = styled.div`
  margin-bottom: 16px;
  color: #fa761f;

  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

export const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  text-align: center;
`;

export const ErrorIcon = styled.div`
  margin-bottom: 24px;
  color: #dc2626;
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
  color: #111827;
  margin: 0;
`;

export const ErrorDescription = styled.p`
  color: #6b7280;
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
  background-color: ${(props) =>
    props.$variant === "error" ? "#fef2f2" : "#f0fdf4"};
  border: 1px solid
    ${(props) => (props.$variant === "error" ? "#fecaca" : "#bbf7d0")};
`;

export const MessageIcon = styled.div<{ $variant?: "error" | "success" }>`
  color: ${(props) => (props.$variant === "error" ? "#dc2626" : "#16a34a")};
  flex-shrink: 0;
`;

export const MessageText = styled.span`
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
`;
