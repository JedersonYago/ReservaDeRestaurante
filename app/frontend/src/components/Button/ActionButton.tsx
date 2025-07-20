import React from "react";
import styled from "styled-components";

type ActionButtonVariant = "primary" | "secondary" | "warning" | "success";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ActionButtonVariant;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ActionButton({
  children,
  variant = "secondary",
  leftIcon,
  disabled = false,
  loading = false,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <StyledActionButton
      disabled={disabled || loading}
      type={type}
      $variant={variant}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      <span>{children}</span>
    </StyledActionButton>
  );
}

const LoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
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

const StyledActionButton = styled.button<{
  $variant: ActionButtonVariant;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]}
    ${({ theme }) => theme.transitions.timing.out};
  flex: 1;
  justify-content: center;
  border: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1;
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return `
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.primary.dark};
            transform: translateY(1px);
          }
        `;
      case "warning":
        return `
          background: ${theme.colors.semantic.warning};
          color: #ffffff;

          &:hover:not(:disabled) {
            background: ${theme.colors.semantic.warning}dd;
          }

          &:active:not(:disabled) {
            background: ${theme.colors.semantic.warning}dd;
            transform: translateY(1px);
          }
        `;
      case "success":
        return `
          background: ${theme.colors.semantic.success};
          color: #ffffff;

          &:hover:not(:disabled) {
            background: ${theme.colors.semantic.success}dd;
          }

          &:active:not(:disabled) {
            background: ${theme.colors.semantic.success}dd;
            transform: translateY(1px);
          }
        `;
      default: // secondary
        return `
          background: ${theme.colors.background.primary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.neutral[300]};

          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[50]};
            border-color: ${theme.colors.primary.main};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.neutral[100]};
            transform: translateY(1px);
          }
        `;
    }
  }}

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
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
