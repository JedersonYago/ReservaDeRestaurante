import styled from "styled-components";
import { StatusBadge } from "../../../components/StatusBadge";

export { StatusBadge };

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

export const DetailsContainer = styled.div`
  display: grid;
  gap: 20px;
`;

export const InfoSection = styled.section`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  font-weight: 500;
  color: #666;
  width: 150px;
`;

export const DetailValue = styled.span`
  color: #333;
  flex: 1;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionsSection = styled.section`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const TimeRemaining = styled.span`
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "danger" | "success" | "warning";
}>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `;
      case "secondary":
        return `
          background-color: #6c757d;
          color: white;
          &:hover {
            background-color: #545b62;
          }
        `;
      case "danger":
        return `
          background-color: #dc3545;
          color: white;
          &:hover {
            background-color: #c82333;
          }
        `;
      case "success":
        return `
          background-color: #28a745;
          color: white;
          &:hover {
            background-color: #218838;
          }
        `;
      case "warning":
        return `
          background-color: #ffc107;
          color: #212529;
          &:hover {
            background-color: #e0a800;
          }
        `;
      default:
        return `
          background-color: #007bff;
          color: white;
          &:hover {
            background-color: #0056b3;
          }
        `;
    }
  }}
`;
