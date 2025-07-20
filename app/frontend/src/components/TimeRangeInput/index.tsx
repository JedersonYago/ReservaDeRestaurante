import { useState } from "react";
import styled from "styled-components";
import { DeleteButton } from "../Button/DeleteButton";
import { Input } from "../Input";

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangeInputProps {
  value: TimeRange[];
  onChange: (value: TimeRange[]) => void;
}

export function TimeRangeInput({ value, onChange }: TimeRangeInputProps) {
  const [newRange, setNewRange] = useState<TimeRange>({ start: "", end: "" });

  const handleAddRange = () => {
    if (newRange.start && newRange.end) {
      onChange([...value, newRange]);
      setNewRange({ start: "", end: "" });
    }
  };

  const handleRemoveRange = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <Container>
      <TimeRangeList>
        {value.map((range, index) => (
          <TimeRangeItem key={index}>
            <span>
              {range.start} - {range.end}
            </span>
            <DeleteButton
              type="button"
              onClick={() => handleRemoveRange(index)}
            >
              Remover
            </DeleteButton>
          </TimeRangeItem>
        ))}
      </TimeRangeList>

      <TimeRangeForm>
        <Input
          type="time"
          value={newRange.start}
          onChange={(e) => setNewRange({ ...newRange, start: e.target.value })}
          label="Início"
        />
        <Input
          type="time"
          value={newRange.end}
          onChange={(e) => setNewRange({ ...newRange, end: e.target.value })}
          label="Fim"
        />
        <AddButton type="button" onClick={handleAddRange}>
          Adicionar Horário
        </AddButton>
      </TimeRangeForm>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimeRangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TimeRangeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;

  span {
    color: #333;
  }
`;

const TimeRangeForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
`;

const AddButton = styled.button`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration[200]} ${({ theme }) => theme.transitions.timing.out};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral[300]};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;
