import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton variant={variant} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ variant: string; fullWidth: boolean }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  transition: background-color 0.2s;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: #007bff;
          color: white;
          &:hover {
            background: #0056b3;
          }
        `;
      case "secondary":
        return `
          background: #6c757d;
          color: white;
          &:hover {
            background: #5a6268;
          }
        `;
      case "danger":
        return `
          background: #dc3545;
          color: white;
          &:hover {
            background: #c82333;
          }
        `;
      default:
        return "";
    }
  }}

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
