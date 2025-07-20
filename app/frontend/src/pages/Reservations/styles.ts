import styled, { keyframes } from "styled-components";

// Animações
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
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

// Filters Section
export const FiltersSection = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const FiltersTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }

  .input-wrapper {
    position: relative;

    svg {
      position: absolute;
      left: ${({ theme }) => theme.spacing[3]};
      top: 50%;
      transform: translateY(-50%);
      color: ${({ theme }) => theme.colors.text.secondary};
      z-index: 1;
    }

    input {
      padding-left: ${({ theme }) => theme.spacing[10]};
      width: 100%;
    }
  }
`;

export const FilterContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: auto;
  }
`;

export const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  width: 100%;

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

export const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.main};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      border-color: ${({ theme }) => theme.colors.neutral[300]};
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: color ${({ theme }) => theme.transitions.duration[200]}
      ${({ theme }) => theme.transitions.timing.out};
  }
`;

// Content Section
export const ContentSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const ResultsCounter = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main}08,
    ${({ theme }) => theme.colors.secondary.main}08
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary.main}20;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

export const ReservationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const ReservationCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.3s ease-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary.main}40;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

export const ReservationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;

  .reservation-number {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: ${({ theme }) => theme.typography.fontSize.md};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
      flex-shrink: 0;
    }

    span {
      font-family: "Monaco", "Menlo", "Courier New", monospace;
      background: ${({ theme }) => theme.colors.primary.main}10;
      padding: ${({ theme }) => theme.spacing[1]}
        ${({ theme }) => theme.spacing[2]};
      border-radius: ${({ theme }) => theme.borderRadius.md};
      border: 1px solid ${({ theme }) => theme.colors.primary.main}20;
    }
  }
`;

export const TableInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
    flex-shrink: 0;
  }
`;

export const StatusBadgeContainer = styled.div`
  display: flex;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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
      color: ${({ theme }) => theme.colors.primary.main};
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
  gap: ${({ theme }) => theme.spacing[4]};

  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    svg {
      color: ${({ theme }) => theme.colors.primary.main};
      flex-shrink: 0;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const ObservationsText = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 3px solid ${({ theme }) => theme.colors.primary.main};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
    margin-top: 1px;
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const ActionButton = styled.button<{
  $variant: "primary" | "secondary" | "danger" | "warning" | "cancel";
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  flex: 1;
  justify-content: center;

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
          color: #ffffff;
          border: 1px solid ${theme.colors.semantic.error};

          &:hover {
            background: ${theme.colors.semantic.error}dd;
          }
        `;
      case "warning":
        return `
          background: ${theme.colors.semantic.warning};
          color: #ffffff;
          border: 1px solid ${theme.colors.semantic.warning};

          &:hover {
            background: ${theme.colors.semantic.warning}dd;
          }
        `;
      case "cancel":
        return `
          background: ${theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[300] : theme.colors.neutral[600]};
          color: ${theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[900] : '#000000'};
          border: 1px solid ${theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[300] : theme.colors.neutral[600]};

          &:hover {
            background: ${theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[200] : theme.colors.neutral[700]};
            border-color: ${theme.colors.background.primary === '#0F0F0F' ? theme.colors.neutral[200] : theme.colors.neutral[700]};
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

// Empty State
export const EmptyState = styled.div`
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

export const EmptyStateIcon = styled.div`
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 500px;
`;

export const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;
