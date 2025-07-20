import styled from "styled-components";
import { fadeIn } from "../../styles/animations";

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

// Filters Section - Exatamente igual às reservas
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
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.semantic.error}15;
    border-color: ${({ theme }) => theme.colors.semantic.error};
    color: ${({ theme }) => theme.colors.semantic.error};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

// Content Section
export const ContentSection = styled.div`
  /* Content styles */
`;

export const ResultsCounter = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

// Grid de mesas - 3 colunas
export const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: ${({ theme }) => theme.spacing[5]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  animation: ${fadeIn} 0.3s ease-out;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  word-wrap: break-word;

  /* Flexbox para garantir posicionamento consistente dos botões */
  display: flex;
  flex-direction: column;
  min-height: 180px; /* Altura mínima reduzida para melhor proporção */

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary.light};
    transform: translateY(-2px);
  }
`;

// Card Header - Exatamente igual às reservas
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  gap: ${({ theme }) => theme.spacing[3]};
  min-width: 0;
`;

export const TableInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  flex: 1;
  min-width: 0;
  overflow: hidden;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StatusBadgeContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  min-width: 0;
`;

// Card Content - Exatamente igual às reservas
export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex: 1; /* Expande para empurrar os botões para baixo */
  min-height: 60px; /* Altura mínima para manter espaço consistente */
`;

export const CapacityInfo = styled.div`
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

export const WarningInfo = styled.div`
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

// Card Actions - Otimizado para até 3 botões (incluindo excluir)
export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  margin-top: auto; /* Sempre empurra para o final do card */

  /* Para layout responsivo dos botões */
  > * {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    /* Em telas menores, reduz gap e padding dos botões */
    gap: ${({ theme }) => theme.spacing[1]};
    
    > * {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[2]};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
    
    /* Em mobile, empilha os botões verticalmente */
    > * {
      flex: none;
      width: 100%;
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
    }
  }
`;

// Empty State - Exatamente igual às reservas
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

// Estilos legados para outras páginas (manter compatibilidade)
export const Container = styled.div`
  width: 100%;
  padding: 2rem;
`;

export const LegacyTitle = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TableList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const TableItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.3rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;

    li {
      color: #666;
      margin-bottom: 0.2rem;
    }
  }
`;

export const LegacyTableInfo = styled.div`
  flex: 1;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

// ResultsCounter para mostrar quantas mesas foram encontradas
