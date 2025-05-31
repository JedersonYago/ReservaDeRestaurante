import styled from "styled-components";

interface TableCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function TableCard({ selected, onClick, children }: TableCardProps) {
  return (
    <Container selected={selected} onClick={onClick}>
      {children}
    </Container>
  );
}

const Container = styled.div<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? "#e3f2fd" : "white")};
  border: 2px solid ${({ selected }) => (selected ? "#2196f3" : "#e0e0e0")};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2196f3;
  }

  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }
`;
