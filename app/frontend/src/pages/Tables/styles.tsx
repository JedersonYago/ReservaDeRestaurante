import styled from "styled-components";
import { StatusBadge } from "../../components/StatusBadge";

export { StatusBadge };

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TableList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const TableItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.3rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;

    li {
      color: #666;
      margin-bottom: 0.2rem;
    }
  }
`;

export const TableInfo = styled.div`
  flex: 1;
`;

export const TableActions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
