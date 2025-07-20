import styled, { keyframes } from "styled-components";

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Page Layout
// PageWrapper removido - agora usando componente centralizado

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
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: stretch;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: stretch;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const StatusBadgeContainer = styled.div`
  display: flex;
`;

// Content Section
export const ContentSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    padding: ${({ theme }) => theme.spacing[2]};
    background: ${({ theme }) => theme.colors.primary.main}10;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const DetailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.neutral[50]};
  flex-shrink: 0;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  flex: 1;
`;

export const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ObservationsCard = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary},
    ${({ theme }) => theme.colors.neutral[50]}
  );
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
  animation: ${fadeIn} 0.5s ease-out;

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    background: ${({ theme }) => theme.colors.background.primary};
    padding: ${({ theme }) => theme.spacing[4]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  }
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]}
    ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

export const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

// Error State
export const ErrorContainer = styled.div`
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

export const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const ErrorTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
`;

export const ErrorDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 400px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const CancelActionButton = styled.button`
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
  justify-content: center;
  min-width: fit-content;

  background: ${({ theme }: any) => theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[300] : theme.colors.neutral[600]};
  color: ${({ theme }: any) => theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[900] : '#000000'};
  border: 1px solid ${({ theme }: any) => theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[300] : theme.colors.neutral[600]};

  &:hover {
    background: ${({ theme }: any) => theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[200] : theme.colors.neutral[700]};
    border-color: ${({ theme }: any) => theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[200] : theme.colors.neutral[700]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }: any) => theme.colors.neutral[300]}40;
  }

  svg {
    flex-shrink: 0;
  }
`;
