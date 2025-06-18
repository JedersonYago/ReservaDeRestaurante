import styled from "styled-components";
import { Card } from "../Card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card padding="medium">
        <LoadingContainer>
          <SkeletonTitle />
          <SkeletonValue />
        </LoadingContainer>
      </Card>
    );
  }

  return (
    <Card padding="medium" variant="hover">
      <StatContent>
        <StatInfo>
          <StatTitle>{title}</StatTitle>
          <StatValue $color={color}>{value}</StatValue>
          {subtitle && <StatSubtitle>{subtitle}</StatSubtitle>}
        </StatInfo>
        {icon && <StatIcon>{icon}</StatIcon>}
      </StatContent>
    </Card>
  );
}

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div<{ $color: string }>`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;

  ${({ $color }) => {
    switch ($color) {
      case "success":
        return "color: #28a745;";
      case "warning":
        return "color: #ffc107;";
      case "danger":
        return "color: #dc3545;";
      case "info":
        return "color: #17a2b8;";
      default:
        return "color: #007bff;";
    }
  }}
`;

const StatSubtitle = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #999;
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.7;
  margin-left: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonTitle = styled.div`
  height: 1rem;
  width: 70%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonValue = styled.div`
  height: 2rem;
  width: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-top: 0.5rem;
`;
