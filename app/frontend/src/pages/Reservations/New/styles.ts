import styled from "styled-components";
import { spin } from "../../../styles/animations";

// PageWrapper removido - agora usando componente centralizado

export const Header = styled.header`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;

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
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  line-height: 1.25;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.625;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 120px; /* Espaço para FixedActionBar */

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding-bottom: 140px; /* Mais espaço em mobile */
  }
`;

export const InfoCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.semantic.warning}15;
  border: 1px solid ${({ theme }) => theme.colors.semantic.warning}40;
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.warning};
  flex-shrink: 0;
  margin-top: 2px; /* Alinhamento óptico com texto */
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.semantic.warning};
  margin: 0 0 0.5rem 0;
  line-height: 1.25;
`;

export const InfoDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

export const Section = styled.section`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 0.5rem;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.625;
`;

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.primary.main}15;
  border: 1px solid ${({ theme }) => theme.colors.primary.main}30;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.main};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const TableSuggestion = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.5rem;
  margin-top: 1rem;
`;

export const SuggestionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const SuggestionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SuggestionItem = styled.button`
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const LoadingSpinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 3px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.semantic.error}15;
  border: 1px solid ${({ theme }) => theme.colors.semantic.error}30;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;

  svg {
    color: ${({ theme }) => theme.colors.semantic.error};
    flex-shrink: 0;
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.semantic.success}15;
  border: 1px solid ${({ theme }) => theme.colors.semantic.success}30;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.semantic.success};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;

  svg {
    color: ${({ theme }) => theme.colors.semantic.success};
    flex-shrink: 0;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Melhorar visibilidade do ícone de calendário no input date */
  input[type="date"] {
    position: relative;

    &::-webkit-calendar-picker-indicator {
      opacity: 1;
      cursor: pointer;
      filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(351deg)
        brightness(97%) contrast(96%);
      width: 18px;
      height: 18px;
    }

    /* Para Firefox */
    &::-moz-calendar-picker-indicator {
      opacity: 1;
      cursor: pointer;
      filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(351deg)
        brightness(97%) contrast(96%);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const TextAreaGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

export const TextAreaContainer = styled.div`
  position: relative;

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px 16px 32px 16px;
    border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    resize: vertical;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary.main};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}20;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.background.secondary};
      color: ${({ theme }) => theme.colors.text.secondary};
      cursor: not-allowed;
    }
  }
`;

export const CharCounter = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2px 4px;
  border-radius: 4px;
`;

export const TimeSlotSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.5rem;
`;

export const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
`;

export const TimeSlotItem = styled.button<{
  $selected?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.875rem 0.75rem;
  border: 2px solid
    ${({ $selected, $disabled, theme }) =>
      $selected
        ? theme.colors.primary.main
        : $disabled
        ? theme.colors.neutral[200]
        : theme.colors.neutral[300]};
  border-radius: 0.5rem;
  background-color: ${({ $selected, $disabled, theme }) =>
    $selected
      ? theme.colors.primary.main
      : $disabled
      ? theme.colors.neutral[100]
      : theme.colors.background.primary};
  color: ${({ $selected, $disabled, theme }) =>
    $selected
      ? theme.colors.primary.contrast
      : $disabled
      ? theme.colors.text.disabled
      : theme.colors.text.primary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  /* Garantir que não submeta o formulário */
  &[type="button"] {
    /* Estilos específicos para type="button" */
  }

  &:hover:not(:disabled) {
    ${({ $selected, theme }) =>
      !$selected &&
      `
      border-color: ${theme.colors.primary.main};
      background-color: ${theme.colors.primary.main}10;
      color: ${theme.colors.primary.main};
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    `}
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    color: currentColor;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
`;

export const TimeSlotHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const TimeSlotHeaderText = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

export const TimeSlotBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const ObservationLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Legacy exports for compatibility
export const Container = styled.div`
  width: 100%;
  padding: 2rem;
`;

export const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;
