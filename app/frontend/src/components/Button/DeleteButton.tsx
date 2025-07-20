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
}

export function DeleteButton({
  children,
  leftIcon,
  disabled = false,
  loading = false,
  type = "button",
  ...props
}: DeleteButtonProps) {
  const defaultIcon = <Trash2 size={16} />;
  const iconToShow = leftIcon || defaultIcon;

  return (
    <StyledDeleteButton disabled={disabled || loading} type={type} {...props}>
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

const StyledDeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 44px;
  gap: 8px;

  /* Estilo danger - vermelho para ações destrutivas */
  background: ${({ theme }) => theme.colors.semantic.error};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border: 1px solid ${({ theme }) => theme.colors.semantic.error};

  /* Garantir que ícones SVG sejam brancos */
  svg {
    color: ${({ theme }) => theme.colors.primary.contrast} !important;
  }

  &:hover:not(:disabled) {
    background: #B71C1C;
    border-color: #B71C1C;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    
    svg {
      color: ${({ theme }) => theme.colors.primary.contrast} !important;
    }
  }

  &:active:not(:disabled) {
    background: #8B0000;
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-height: 48px;
    flex: 1;
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
