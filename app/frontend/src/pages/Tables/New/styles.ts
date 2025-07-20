import styled from "styled-components";
import { Button } from "../../../components/Button";
import { fadeIn } from "../../../styles/animations";

// PageWrapper removido - agora usando componente centralizado

export const Header = styled.header`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  animation: ${fadeIn} 0.6s ease-out;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

export const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.25;

  svg {
    color: #fa761f;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
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

export const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 120px; /* Espaço para FixedActionBar */
  animation: ${fadeIn} 0.6s ease-out 0.1s both;

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding-bottom: 140px; /* Mais espaço em mobile */
  }
`;

export const FormSection = styled.section`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;

  svg {
    color: #fa761f;
    flex-shrink: 0;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.625;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`;

export const AvailabilitySection = styled.div`
  margin-top: 1.5rem;
`;

export const AvailabilityModeSelector = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
`;

export const ModeOption = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: #FA761F;
    color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  `
      : `
    background: transparent;
    color: #6b7280;
    
    &:hover {
      background: white;
      color: #111827;
    }
  `}

  svg {
    flex-shrink: 0;
  }
`;

export const AvailabilityBlock = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #111827;

    svg {
      color: #fa761f;
    }
  }
`;

export const BlockActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const BlockContent = styled.div`
  padding: 1.5rem;
`;

export const TimeInputContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

export const TimeSlot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const TimeSlotActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  min-height: 40px; /* Garante altura mínima para alinhamento */
`;

export const WarningBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 500;
  margin-left: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`;

export const TimeIntervalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyTimeSlots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
`;

export const AddBlockButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem; /* Gap ainda menor para melhor alinhamento */
  width: auto;
  white-space: nowrap;
  height: fit-content;
  line-height: 1;

  svg {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -1px; /* Micro ajuste para compensar baseline */
  }

  span {
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
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

export const AddActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]} ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.neutral[50]};
    border-color: ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  svg {
    color: currentColor;
  }
`;
