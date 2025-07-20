import styled from "styled-components";
import { Card } from "../../components/Card";
import { fadeIn, spin, pulse } from "../../styles/animations";

export const LoadingMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

export const ErrorMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: left;
    margin-bottom: ${({ theme }) => theme.spacing[10]};
  }
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
`;

export const ReservationsList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const AlertsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }: any) => theme.spacing[4]};
  max-height: 200px;
  overflow-y: auto;
  padding-right: ${({ theme }: any) => theme.spacing[2]};

  /* Garantir que mostra apenas uma "linha" de 3 itens */
  grid-auto-rows: min-content;

  @media (max-width: ${({ theme }: any) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    max-height: 300px; /* Altura ajustada para 2 colunas */
  }

  @media (max-width: ${({ theme }: any) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-height: 250px; /* Altura ajustada para 1 coluna */
  }

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }: any) => theme.colors.neutral[100]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }: any) => theme.colors.neutral[300]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }: any) => theme.colors.neutral[400]};
  }
`;

export const ClientReservationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }: any) => theme.spacing[4]};
  max-height: 280px; /* Altura para mostrar exatamente 1 linha de cards */
  overflow-y: auto;
  padding-right: ${({ theme }: any) => theme.spacing[2]};

  /* Garantir que mostra apenas uma "linha" de 3 itens visível */
  grid-auto-rows: min-content;

  @media (max-width: ${({ theme }: any) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    max-height: 280px; /* Altura para mostrar 1 linha de 2 cards */
  }

  @media (max-width: ${({ theme }: any) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-height: 280px; /* Altura para mostrar 1 card por vez */
  }

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }: any) => theme.colors.neutral[100]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }: any) => theme.colors.neutral[300]};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }: any) => theme.colors.neutral[400]};
  }
`;

export const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const TitleSection = styled.div`
  flex: 1;
`;

export const UserName = styled.span`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const WelcomeMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const LoadingIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  animation: ${pulse} 2s infinite;
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} 0;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const SectionIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
`;

export const ModernReservationCard = styled(Card)`
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

export const ReservationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const ReservationTable = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const ReservationCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ReservationDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }
`;

export const ReservationCardAction = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const ModernEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]}
    ${({ theme }) => theme.spacing[4]};
  text-align: center;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  animation: ${fadeIn} 0.3s ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[16]}
      ${({ theme }) => theme.spacing[8]};
  }
`;

export const EmptyStateIcon = styled.div`
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  max-width: 400px;
`;

export const ModernStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const ModernStatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ $color }) => $color}40;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color }) => $color};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[5]};
  }
`;

export const StatIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ $color, theme }) =>
    $color ? `${$color}15` : `${theme.colors.primary.main}15`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ $color, theme }) => $color || theme.colors.primary.main};
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const StatTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
`;

export const ActionsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[5]};
  }
`;

export const ActionButton = styled.button<{
  $variant: "primary" | "secondary";
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.primary.main
      : theme.colors.background.primary};
  color: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.primary.contrast
      : theme.colors.text.primary};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? "transparent" : theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme, $variant }) =>
      $variant === "primary" ? "transparent" : theme.colors.primary.main};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const ActionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const ActionTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const ActionDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.8;
`;

export const RestaurantInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: ${({ theme }) => theme.spacing[8]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const ReservationStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const AlertsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const ModernAlertItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing[3]};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
`;

export const AlertTableName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const AlertCustomer = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const AlertDateTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const AdminActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const RefreshButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.text.secondary : theme.colors.primary.contrast};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral[200] : theme.colors.primary.main};
  }

  svg {
    flex-shrink: 0;

    &.spinning {
      animation: ${spin} 1s linear infinite;
    }
  }
`;

export const AutoUpdateIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const UpdateDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.semantic.success : theme.colors.neutral[400]};
`;
