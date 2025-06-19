import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 3rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

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

export const AvailabilityBlock = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: #fa761f;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const BlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    color: #374151;

    svg {
      color: #fa761f;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const BlockActions = styled.div`
  display: flex;
  gap: 8px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  max-height: 280px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }

  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
`;

export const TimeSlotItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const TimeSlotInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  svg {
    color: #6b7280;
  }

  span {
    font-weight: 500;
    font-size: 0.875rem;
    color: #374151;
  }
`;

export const TimeSlotActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: stretch;
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
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
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #fa761f;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background-color: #fa761f;
    border-color: #fa761f;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(250, 118, 31, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(250, 118, 31, 0.15);
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
  gap: 8px;
  padding: 8px;
  background: linear-gradient(
    to bottom,
    rgba(249, 250, 251, 0.8),
    rgba(249, 250, 251, 1)
  );
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;

  svg {
    animation: bounce 1s infinite;
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
      transform: translateY(-3px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
`;
