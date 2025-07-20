import React from "react";
import styled from "styled-components";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 4px;
`;

const StyledSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}20;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Estilização das opções */
  option {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    padding: 8px 12px;
  }

  option:checked {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
  }
`;

export function Select({ label, children, ...props }: SelectProps) {
  return (
    <SelectContainer>
      {label && <Label>{label}</Label>}
      <StyledSelect {...props}>{children}</StyledSelect>
    </SelectContainer>
  );
}
