import styled from "styled-components";
import { spin } from "../../../styles/animations";

// PageWrapper removido - agora usando componente centralizado

export const Header = styled.header`
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;

  svg {
    color: #fa761f;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 36px;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border: 1px solid #fbbf24;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const InfoIcon = styled.div`
  flex-shrink: 0;
  color: #92400e;

  @media (max-width: 768px) {
    align-self: center;
  }
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoTitle = styled.h3`
  color: #92400e;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

export const InfoDescription = styled.p`
  color: #78350f;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;

  strong {
    font-weight: 600;
    color: #451a03;
  }
`;

export const FormSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;

  svg {
    color: #fa761f;
  }
`;

export const SectionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 24px 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

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

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const TextAreaGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;

export const TextAreaContainer = styled.div`
  position: relative;

  textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px 16px 32px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    background-color: white;
    color: #374151;
    resize: vertical;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #fa761f;
      box-shadow: 0 0 0 3px rgba(250, 118, 31, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
  }
`;

export const CharCounter = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: #6b7280;
  background: white;
  padding: 2px 4px;
  border-radius: 4px;
`;

export const TimeSlotSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
`;

export const TimeSlotItem = styled.button<{
  $selected?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 12px;
  border: 2px solid
    ${(props) =>
      props.$selected ? "#fa761f" : props.$disabled ? "#e5e7eb" : "#d1d5db"};
  border-radius: 8px;
  background-color: ${(props) =>
    props.$selected ? "#fa761f" : props.$disabled ? "#f3f4f6" : "white"};
  color: ${(props) =>
    props.$selected ? "white" : props.$disabled ? "#9ca3af" : "#374151"};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Garantir que não submeta o formulário */
  &[type="button"] {
    /* Estilos específicos para type="button" */
  }

  &:hover:not(:disabled) {
    ${(props) =>
      !props.$selected &&
      `
      border-color: #fa761f;
      background-color: rgba(250, 118, 31, 0.05);
      color: #fa761f;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #fa761f;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;

  svg {
    color: #d1d5db;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
