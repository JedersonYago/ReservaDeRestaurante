import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "warning"
    | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <IconContainer>{leftIcon}</IconContainer>}
      <span>{children}</span>
      {!loading && rightIcon && <IconContainer>{rightIcon}</IconContainer>}
    </StyledButton>
  );
}

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;

  /* Garantir que os ícones herdem a cor do texto do botão */
  svg {
    color: inherit;
    display: block;
    vertical-align: top;
  }
`;

const StyledButton = styled.button<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
}>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  position: relative;
  white-space: nowrap;
  line-height: 1;

  /* Garantir alinhamento vertical perfeito */
  > span {
    display: flex;
    align-items: center;
  }

  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  /* Focus para acessibilidade */
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Tamanhos */
  ${({ $size, theme }) => {
    switch ($size) {
      case "sm":
        return `
          font-size: ${theme.typography.fontSize.xs};
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          min-height: ${theme.spacing[8]};
        `;
      case "lg":
        return `
          font-size: ${theme.typography.fontSize.lg};
          padding: ${theme.spacing[4]} ${theme.spacing[6]};
          min-height: ${theme.spacing[12]};
        `;
      default:
        return `
          font-size: ${theme.typography.fontSize.sm};
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          min-height: ${theme.spacing[10]};
        `;
    }
  }}

  /* Variantes */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return `
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          
          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: ${theme.colors.primary.contrast} !important;
          }
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
            
            svg {
              color: ${theme.colors.primary.contrast} !important;
            }
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "secondary":
        return `
          background: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrast};
          
          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: ${theme.colors.secondary.contrast} !important;
          }
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary.dark};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
            
            svg {
              color: ${theme.colors.secondary.contrast} !important;
            }
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "outline":
        return `
          background: transparent !important;
          color: ${theme.colors.primary.main} !important;
          border: 1px solid ${theme.colors.primary.main} !important;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.main} !important;
            color: ${theme.colors.primary.contrast} !important;
            border-color: ${theme.colors.primary.main} !important;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.primary.dark} !important;
            color: ${theme.colors.primary.contrast} !important;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "ghost":
        return `
          background: transparent;
          color: ${theme.colors.text.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[100]};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            background: ${theme.colors.neutral[200]};
          }
        `;
      case "danger":
        return `
          background: ${theme.colors.semantic.error};
          color: ${theme.colors.primary.contrast};
          
          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: ${theme.colors.primary.contrast} !important;
          }
          
          &:hover:not(:disabled) {
            background: #B71C1C;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
            
            svg {
              color: ${theme.colors.primary.contrast} !important;
            }
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "warning":
        return `
          background: ${theme.colors.semantic.warning};
          color: ${theme.colors.primary.contrast};
          
          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: ${theme.colors.primary.contrast} !important;
          }
          
          &:hover:not(:disabled) {
            background: #E65100;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
            
            svg {
              color: ${theme.colors.primary.contrast} !important;
            }
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "success":
        return `
          background: ${theme.colors.semantic.success};
          color: ${theme.colors.primary.contrast};
          
          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: ${theme.colors.primary.contrast} !important;
          }
          
          &:hover:not(:disabled) {
            background: #218838;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
            
            svg {
              color: ${theme.colors.primary.contrast} !important;
            }
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      default:
        return "";
    }
  }}

  /* Estados */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Motion reduzido para acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    &:hover:not(:disabled) {
      transform: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

// export { CancelButton } from "./CancelButton";
