import styled from "styled-components";

interface ButtonGroupProps {
  children: React.ReactNode;
  justify?: "start" | "center" | "end" | "space-between";
  gap?: "small" | "medium" | "large";
  direction?: "row" | "column";
  className?: string;
}

export function ButtonGroup({
  children,
  justify = "start",
  gap = "medium",
  direction = "row",
  className,
}: ButtonGroupProps) {
  return (
    <Container
      $justify={justify}
      $gap={gap}
      $direction={direction}
      className={className}
    >
      {children}
    </Container>
  );
}

const Container = styled.div<{
  $justify: string;
  $gap: string;
  $direction: string;
}>`
  display: flex;
  align-items: center;

  /* Direction */
  flex-direction: ${({ $direction }) => $direction};

  /* Justify content */
  ${({ $justify }) => {
    switch ($justify) {
      case "center":
        return "justify-content: center;";
      case "end":
        return "justify-content: flex-end;";
      case "space-between":
        return "justify-content: space-between;";
      default:
        return "justify-content: flex-start;";
    }
  }}

  /* Gap */
  ${({ $gap }) => {
    switch ($gap) {
      case "small":
        return "gap: 0.5rem;";
      case "medium":
        return "gap: 1rem;";
      case "large":
        return "gap: 1.5rem;";
      default:
        return "gap: 1rem;";
    }
  }}

  /* Responsive behavior */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
`;
