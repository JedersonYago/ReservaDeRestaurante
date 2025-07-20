import styled from "styled-components";

interface ContainerProps {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin: 0 auto;

  ${({ padding = true, theme }) => padding && `padding: 0 ${theme.spacing[4]};`}

  ${({ maxWidth = "xl", theme }) => {
    const maxWidths = {
      sm: theme.breakpoints.sm,
      md: theme.breakpoints.md,
      lg: theme.breakpoints.lg, // 992px - novo padrão mais compacto
      xl: theme.breakpoints.xl, // 1200px - para casos especiais
      "2xl": theme.breakpoints["2xl"], // 1400px - para casos especiais
      full: "100%", // Largura total da tela
    };
    return `max-width: ${maxWidths[maxWidth]};`;
  }}

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0
      ${({ theme, padding = true }) => (padding ? theme.spacing[6] : "0")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0
      ${({ theme, padding = true }) => (padding ? theme.spacing[8] : "0")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0
      ${({ theme, padding = true }) => (padding ? theme.spacing[10] : "0")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0
      ${({ theme, padding = true }) => (padding ? theme.spacing[12] : "0")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints["2xl"]}) {
    padding: 0
      ${({ theme, padding = true }) => (padding ? theme.spacing[16] : "0")};
  }
`;
