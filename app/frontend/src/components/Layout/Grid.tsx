import styled from "styled-components";
import type { Spacing } from "../../styles/theme";

interface GridProps {
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: Spacing;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${({ gap = 4, theme }) => theme.spacing[gap as Spacing]};

  ${({ align }) => align && `align-items: ${align};`}

  ${({ justify }) => {
    if (justify) {
      const justifyValues = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        between: "space-between",
        around: "space-around",
        evenly: "space-evenly",
      };
      return `justify-content: ${justifyValues[justify]};`;
    }
  }}
  
  /* Mobile First - começa com 1 coluna */
  grid-template-columns: repeat(${({ cols }) => cols?.xs || 1}, 1fr);

  /* Small screens (576px+) */
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(
      ${({ cols }) => cols?.sm || cols?.xs || 1},
      1fr
    );
  }

  /* Medium screens (768px+) */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(
      ${({ cols }) => cols?.md || cols?.sm || cols?.xs || 1},
      1fr
    );
  }

  /* Large screens (992px+) */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(
      ${({ cols }) => cols?.lg || cols?.md || cols?.sm || cols?.xs || 1},
      1fr
    );
  }

  /* Extra large screens (1200px+) */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(
      ${({ cols }) =>
        cols?.xl || cols?.lg || cols?.md || cols?.sm || cols?.xs || 1},
      1fr
    );
  }
`;

// Componente auxiliar para flex layout
export const Flex = styled.div<{
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: Spacing;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  align-items: ${({ align = "stretch" }) => align};
  gap: ${({ gap = 4, theme }) => theme.spacing[gap as Spacing]};

  ${({ justify }) => {
    if (justify) {
      const justifyValues = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        between: "space-between",
        around: "space-around",
        evenly: "space-evenly",
      };
      return `justify-content: ${justifyValues[justify]};`;
    }
  }}

  ${({ wrap = false }) => wrap && "flex-wrap: wrap;"}
`;
