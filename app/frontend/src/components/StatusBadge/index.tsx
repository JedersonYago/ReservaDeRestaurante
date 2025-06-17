import styled from "styled-components";

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <Badge status={status}>{children}</Badge>;
}

const Badge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "available":
        return `
          background: #d4edda;
          color: #155724;
        `;
      case "reserved":
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case "occupied":
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      case "maintenance":
        return `
          background: #e2e3e5;
          color: #383d41;
        `;
      case "pending":
        return `
          background: #cce5ff;
          color: #004085;
        `;
      case "confirmed":
        return `
          background: #d4edda;
          color: #155724;
        `;
      case "cancelled":
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      default:
        return "";
    }
  }}
`;
