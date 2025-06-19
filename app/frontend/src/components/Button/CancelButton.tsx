import React from "react";
import styled from "styled-components";

interface CancelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export function CancelButton({
  children,
  leftIcon,
  disabled = false,
  ...props
}: CancelButtonProps) {
  return (
    <StyledCancelButton disabled={disabled} {...props}>
      {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
    </StyledCancelButton>
  );
}

const StyledCancelButton = styled.button`
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

  /* Estilo neutro e discreto */
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.neutral[700]};
    border-color: ${({ theme }) => theme.colors.neutral[300]};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral[300]};
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
