import styled, { keyframes } from "styled-components";

// Animações
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Page Layout
export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.spacing[16]});
  background: ${({ theme }) => theme.colors.background.secondary};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const TitleSection = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize["xl"]};
  }
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

// Content Layout
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

// Cards Base
const CardBase = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const InfoCard = styled(CardBase)``;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]} 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  }
`;

// Info Section
export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

export const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

export const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    flex-wrap: wrap;
  }
`;

export const DateSelector = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.neutral[50]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.shadows.focus};
    background: ${({ theme }) => theme.colors.background.primary};
  }

  option {
    padding: ${({ theme }) => theme.spacing[2]};
    background: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Availability Section
export const AvailabilitySection = styled(CardBase)``;

export const Legend = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  @media (max-width: 576px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const AvailabilityGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing[1]};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const AvailabilityBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

export const AvailabilityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.main};
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

export const AvailabilityPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 400px;
    opacity: 1;
  }
`;

export const ScrollableTimesList = styled.div`
  max-height: 280px;
  overflow-y: auto;
  animation: ${slideDown} 0.3s ease-out;
  padding-right: ${({ theme }) => theme.spacing[1]};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
`;

export const ScrollIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: linear-gradient(
    to bottom,
    transparent,
    ${({ theme }) => theme.colors.neutral[50]}
  );
  animation: ${bounce} 2s infinite;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const AvailabilityDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  strong {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const AvailabilityTimes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const AvailabilityTime = styled.div<{ $available: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid
    ${({ $available }) => ($available ? "#49A84C30" : "#FA761F30")};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-1px);
  }

  span {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }

  > svg {
    color: ${({ $available }) => ($available ? "#49A84C" : "#FA761F")};
    flex-shrink: 0;
  }
`;

export const EmptyAvailability = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary},
    ${({ theme }) => theme.colors.neutral[50]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[200]};

  svg {
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  div {
    max-width: 300px;

    h4 {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.text.primary};
      margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
    }

    p {
      font-size: ${({ theme }) => theme.typography.fontSize.md};
      color: ${({ theme }) => theme.colors.text.secondary};
      margin: 0;
      line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    }
  }
`;

// Reservations Section
export const ReservationsSection = styled(CardBase)`
  grid-column: 1 / -1;
`;

export const ReservationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  max-height: 500px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing[1]};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary.main};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-height: 400px;
  }
`;

export const ReservationCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  padding: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: #fa761f66;
    transform: translateY(-2px);
  }
`;

export const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

export const ReservationNumber = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #fa761f;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: "Monaco", "Menlo", "Courier New", monospace;

  svg {
    color: #fa761f;
  }
`;

export const ReservationStatus = styled.div`
  display: flex;
`;

export const ReservationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};

    svg {
      color: #fa761f;
      flex-shrink: 0;
    }

    &:first-child {
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.text.primary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
`;

export const DateTimeInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};

  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    svg {
      color: #fa761f;
      flex-shrink: 0;
    }
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const ReservationActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button<{
  $variant:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "cancel"
    | "success";
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
  min-width: fit-content;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return `
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          border: 1px solid ${theme.colors.primary.main};

          &:hover {
            background: ${theme.colors.primary.dark};
            border-color: ${theme.colors.primary.dark};
          }
        `;
      case "danger":
        return `
          background: ${theme.colors.semantic.error};
          color: ${theme.colors.background.primary};
          border: 1px solid ${theme.colors.semantic.error};

          &:hover {
            background: ${theme.colors.semantic.error}dd;
          }
        `;
      case "warning":
        return `
          background: ${theme.colors.semantic.warning};
          color: ${theme.colors.background.primary};
          border: 1px solid ${theme.colors.semantic.warning};

          &:hover {
            background: ${theme.colors.semantic.warning}dd;
          }
        `;
      case "cancel":
        return `
          background: ${theme.colors.neutral[600]};
          color: ${theme.colors.background.primary};
          border: 1px solid ${theme.colors.neutral[600]};

          &:hover {
            background: ${theme.colors.neutral[700]};
            border-color: ${theme.colors.neutral[700]};
          }
        `;
      case "success":
        return `
          background: ${theme.colors.semantic.success};
          color: ${theme.colors.background.primary};
          border: 1px solid ${theme.colors.semantic.success};

          &:hover {
            background: ${theme.colors.semantic.success}dd;
          }
        `;
      default:
        return `
          background: ${theme.colors.background.primary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.neutral[300]};

          &:hover {
            background: ${theme.colors.neutral[50]};
            border-color: ${theme.colors.primary.main};
          }
        `;
    }
  }}

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const EmptyReservations = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary},
    ${({ theme }) => theme.colors.neutral[50]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[200]};

  svg {
    color: ${({ theme }) => theme.colors.neutral[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  div {
    max-width: 300px;

    h4 {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.text.primary};
      margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
    }

    p {
      font-size: ${({ theme }) => theme.typography.fontSize.md};
      color: ${({ theme }) => theme.colors.text.secondary};
      margin: 0;
      line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    }
  }
`;

// Loading States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]}
    ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 3px solid #fa761f;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin: 0;
`;

// Not Found
export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]}
    ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary},
    ${({ theme }) => theme.colors.neutral[50]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[200]};
`;

export const NotFoundIcon = styled.div`
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const NotFoundContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 400px;
`;

export const NotFoundTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const NotFoundDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;
