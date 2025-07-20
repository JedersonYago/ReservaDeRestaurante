import React from "react";
import styled from "styled-components";

interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function BackButton({
  children,
  leftIcon,
  disabled = false,
  type = "button",
  ...props
}: BackButtonProps) {
  return (
    <StyledBackButton disabled={disabled} type={type} {...props}>
      {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
    </StyledBackButton>
  );
}

const StyledBackButton = styled.button`
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

  /* Estilo outline - discreto para ações de voltar/cancelar operações */
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.main};
  border: 1px solid ${({ theme }) => theme.colors.primary.main};

  /* Garantir que ícones SVG sigam a cor do texto */
  svg {
    color: ${({ theme }) => theme.colors.primary.main} !important;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border-color: ${({ theme }) => theme.colors.primary.main};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    
    svg {
      color: ${({ theme }) => theme.colors.primary.contrast} !important;
    }
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary.dark};
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
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
