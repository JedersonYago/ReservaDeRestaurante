import React from "react";
import styled from "styled-components";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  compact?: boolean;
}

export function DeleteButton({
  children,
  leftIcon,
  disabled = false,
  loading = false,
  type = "button",
  compact = false,
  ...props
}: DeleteButtonProps) {
  const defaultIcon = <Trash2 size={16} />;
  const iconToShow = leftIcon || defaultIcon;

  return (
    <StyledDeleteButton
      disabled={disabled || loading}
      type={type}
      $compact={compact}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && <IconWrapper>{iconToShow}</IconWrapper>}
      <span>{children}</span>
    </StyledDeleteButton>
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledDeleteButton = styled.button<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  border: none;

  /* Flex behavior baseado na prop compact */
  flex: ${({ $compact }) => ($compact ? "none" : "1")};

  /* Estilo danger - vermelho para ações destrutivas */
  background: ${({ theme }) => theme.colors.semantic.error};
  color: ${({ theme }) => theme.colors.primary.contrast};

  /* Garantir que ícones SVG sejam brancos */
  svg {
    color: ${({ theme }) => theme.colors.primary.contrast} !important;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: #b71c1c;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};

    svg {
      color: ${({ theme }) => theme.colors.primary.contrast} !important;
    }
  }

  &:active:not(:disabled) {
    background: #8b0000;
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: ${({ $compact }) => ($compact ? "none" : "1")};
    padding: ${({ theme }) => theme.spacing[2]}
      ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
