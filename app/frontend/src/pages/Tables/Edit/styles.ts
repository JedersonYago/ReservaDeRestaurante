import styled from "styled-components";
import { spin } from "../../../styles/animations";

// PageWrapper removido - agora usando componente centralizado

export const Header = styled.header`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
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
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 120px; /* Espaço para FixedActionBar */

  @media (max-width: 768px) {
    padding-bottom: 140px; /* Mais espaço em mobile */
  }
`;

export const FormSection = styled.section`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0 0 ${({ theme }) => theme.spacing[6]} 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const AvailabilitySection = styled.section`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const AvailabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: ${({ theme }) => theme.spacing[3]};
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const AvailabilityBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.duration[200]} ease;
  background: ${({ theme }) => theme.colors.background.primary};
  height: fit-content;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const BlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.neutral[50]},
    ${({ theme }) => theme.colors.neutral[100]}
  );
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  > div:first-child {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    flex: 1;

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[3]};
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const BlockActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

export const BlockContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const TimeSlotsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin: ${({ theme }) => theme.spacing[3]} 0;
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    max-height: 450px;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    max-height: 350px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${({ theme }) => theme.spacing[2]};
    max-height: 300px;
    padding: ${({ theme }) => theme.spacing[2]};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    max-height: 250px;
    gap: ${({ theme }) => theme.spacing[2]};
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.neutral[500]};
    }
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.neutral[400]}
    ${({ theme }) => theme.colors.neutral[100]};
`;

export const TimeSlotItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.duration[200]} ease;
  min-height: 80px;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
    border-color: ${({ theme }) => theme.colors.primary.main};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  @media (max-width: 480px) {
    min-height: auto;
    padding: ${({ theme }) => theme.spacing[2]};
  }
`;

export const TimeSlotInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;

  .time-display {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
      flex-shrink: 0;
    }

    span {
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const TimeSlotActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transitions.duration[200]} ease;

  ${TimeSlotItem}:hover & {
    opacity: 1;
  }

  @media (max-width: 480px) {
    position: static;
    opacity: 1;
    justify-content: flex-end;
    margin-top: auto;
  }
`;

export const TimeInputContainer = styled.div`
  margin-top: 12px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const TimeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  input[type="time"] {
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.75rem;
    color: #6b7280;
    background-color: #f9fafb;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #fa761f;
      box-shadow: 0 0 0 3px rgba(250, 118, 31, 0.1);
      background-color: white;
    }
  }

  span {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;

    span {
      text-align: center;
    }
  }
`;

export const AddTimeButton = styled.button`
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
  margin-top: ${({ theme }) => theme.spacing[3]};

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

export const EmptyTimeSlots = styled.div`
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

  h4 {
    margin: 0 0 4px 0;
    color: #374151;
    font-size: 0.875rem;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const AddBlockButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.neutral[50]},
    ${({ theme }) => theme.colors.neutral[100]}
  );
  border: 2px dashed ${({ theme }) => theme.colors.primary.main}40;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]} ease;
  margin-top: ${({ theme }) => theme.spacing[6]};

  &:hover {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary.main},
      ${({ theme }) => theme.colors.primary.dark}
    );
    border-color: ${({ theme }) => theme.colors.primary.main};
    border-style: solid;
    color: ${({ theme }) => theme.colors.primary.contrast};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  svg {
    color: currentColor;
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
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #fa761f;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

export const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const NotFoundContainer = styled.div`
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

export const NotFoundIcon = styled.div`
  margin-bottom: 24px;
  color: #d1d5db;
`;

export const NotFoundContent = styled.div`
  max-width: 400px;
`;

export const NotFoundTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const NotFoundDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

export const WarningBadge = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background-color: #fef3c7;
  color: #92400e;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: 1px solid #fbbf24;

  svg {
    color: currentColor;
  }
`;

export const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #49a84c15;
  color: #49a84c;
  border: 1px solid #49a84c30;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 8px;

  svg {
    flex-shrink: 0;
    color: currentColor;
  }

  span {
    color: currentColor;
  }
`;

export const ScrollIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  background: linear-gradient(
    to bottom,
    rgba(250, 118, 31, 0.05),
    rgba(250, 118, 31, 0.1)
  );
  border: 1px solid ${({ theme }) => theme.colors.primary.main}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  svg {
    animation: bounce 1.5s infinite;
    color: ${({ theme }) => theme.colors.primary.main};
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    padding: ${({ theme }) => theme.spacing[2]};
  }
`;
