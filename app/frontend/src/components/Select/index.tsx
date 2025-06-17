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
  color: #333;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
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
