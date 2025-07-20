import React from "react";
import styled from "styled-components";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: "warning" | "success";
  fullWidth?: boolean;
}

export function SubmitButton({
  children,
  leftIcon,
  disabled = false,
  loading = false,
  variant = "warning",
  fullWidth = false,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <StyledSubmitButton
      disabled={disabled || loading}
      type={type}
      $variant={variant}
      $fullWidth={fullWidth}
      $loading={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      <span>{children}</span>
    </StyledSubmitButton>
  );
}

const LoadingSpinner = styled.div`
  width: 14px;
  height: 14px;
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

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    flex-shrink: 0;
    color: inherit;
  }
`;

const StyledSubmitButton = styled.button<{
  $variant: "warning" | "success";
  $fullWidth: boolean;
  $loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  border: none;
  min-height: ${({ theme }) => theme.spacing[12]};
  white-space: nowrap;
  line-height: 1;
  position: relative;

  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  /* Garantir alinhamento vertical perfeito */
  > span {
    display: flex;
    align-items: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-height: ${({ theme }) => theme.spacing[10]};
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "warning":
        return `
          background: ${theme.colors.semantic.warning};
          color: #ffffff;

          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: #ffffff !important;
          }

          &:hover:not(:disabled) {
            background: ${theme.colors.semantic.warning}dd;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.semantic.warning}dd;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case "success":
        return `
          background: ${theme.colors.semantic.success};
          color: #ffffff;

          /* Garantir que ícones SVG sejam brancos */
          svg {
            color: #ffffff !important;
          }

          &:hover:not(:disabled) {
            background: ${theme.colors.semantic.success}dd;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.semantic.success}dd;
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      default:
        return "";
    }
  }}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Efeito de loading */
  &:disabled {
    > span {
      opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
    }
  }
`;
