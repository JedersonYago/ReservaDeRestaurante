import styled from "styled-components";

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "hover" | "info" | "profile";
  padding?: "small" | "medium" | "large";
  className?: string;
}

export function Card({
  children,
  onClick,
  variant = "default",
  padding = "medium",
  className,
}: CardProps) {
  return (
    <Container
      onClick={onClick}
      $variant={variant}
      $padding={padding}
      $clickable={!!onClick}
      className={className}
    >
      {children}
    </Container>
  );
}

const Container = styled.div<{
  $variant: string;
  $padding: string;
  $clickable: boolean;
}>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  /* Padding variants */
  ${({ $padding }) => {
    switch ($padding) {
      case "small":
        return "padding: 1rem;";
      case "medium":
        return "padding: 1.5rem;";
      case "large":
        return "padding: 2rem;";
      default:
        return "padding: 1.5rem;";
    }
  }}

  /* Interaction variants */
  ${({ $clickable, $variant }) => {
    if ($clickable) {
      return `
        cursor: pointer;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
      `;
    }

    if ($variant === "hover") {
      return `
        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
        }
      `;
    }

    return "";
  }}

  /* Variant styles */
  ${({ $variant }) => {
    switch ($variant) {
      case "info":
        return `
          border-left: 4px solid #007bff;
        `;
      case "profile":
        return `
          max-width: 600px;
          margin: 0 auto;
        `;
      default:
        return "";
    }
  }}

  h1, h2, h3, h4, h5, h6 {
    color: #333;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  p {
    color: #666;
    margin: 0;
    line-height: 1.5;
  }
`;
