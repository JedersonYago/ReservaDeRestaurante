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
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 4px;
`;

const StyledSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100%;
  background-color: white;
  color: #374151;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #fa761f;
    box-shadow: 0 0 0 3px rgba(250, 118, 31, 0.1);
  }

  &:hover:not(:disabled) {
    border-color: #fa761f;
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Estilização das opções */
  option {
    color: #374151;
    background-color: white;
    padding: 8px 12px;
  }

  option:checked {
    background-color: #fa761f;
    color: white;
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
