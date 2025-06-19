import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hasIcon?: boolean;
}

export function Input({ label, error, hasIcon, ...props }: InputProps) {
  return (
    <InputGroup>
      {label && <label htmlFor={props.id}>{label}</label>}
      <StyledInput $hasIcon={hasIcon} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroup>
  );
}

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const StyledInput = styled.input<{ $hasIcon?: boolean }>`
  padding: ${({ theme, $hasIcon }) =>
    `${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]} ${
      $hasIcon ? theme.spacing[10] : theme.spacing[4]
    }`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.duration["200"]}
    ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.neutral[50]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.shadows.focus};
    background: ${({ theme }) => theme.colors.background.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.8;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Estilos específicos para inputs de data e tempo */
  &[type="date"],
  &[type="time"] {
    position: relative;

    /* Webkit browsers (Chrome, Safari, Edge) */
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      width: 20px;
      height: 20px;
      opacity: 1;
      filter: invert(45%) sepia(78%) saturate(2476%) hue-rotate(11deg)
        brightness(103%) contrast(101%);
    }

    /* Firefox */
    &::-moz-calendar-picker-indicator {
      cursor: pointer;
      width: 20px;
      height: 20px;
      opacity: 1;
      filter: invert(45%) sepia(78%) saturate(2476%) hue-rotate(11deg)
        brightness(103%) contrast(101%);
    }
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
