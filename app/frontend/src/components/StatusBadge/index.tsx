import React from "react";
import styled from "styled-components";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

export type BadgeStatus =
  | "available"
  | "reserved"
  | "maintenance"
  | "pending"
  | "confirmed"
  | "cancelled";

interface StatusBadgeProps {
  status?: BadgeStatus;
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Mapeamento de status para variantes
const statusToVariant: Record<BadgeStatus, BadgeVariant> = {
  available: "success",
  confirmed: "success",
  reserved: "warning",
  pending: "warning",
  cancelled: "danger",
  maintenance: "neutral",
};

export function StatusBadge({
  status,
  variant,
  children,
  size = "md",
  className,
}: StatusBadgeProps) {
  // Se status for fornecido, usa o mapeamento; senão usa variant diretamente
  const finalVariant = status ? statusToVariant[status] : variant || "neutral";

  return (
    <Badge $variant={finalVariant} $size={size} className={className}>
      {children}
    </Badge>
  );
}

const Badge = styled.span<{
  $variant: BadgeVariant;
  $size: "sm" | "md" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme, $size }) => {
    switch ($size) {
      case "sm":
        return theme.spacing[1];
      case "lg":
        return theme.spacing[2];
      default:
        return theme.spacing[1.5];
    }
  }};
  padding: ${({ theme, $size }) => {
    switch ($size) {
      case "sm":
        return `${theme.spacing[1]} ${theme.spacing[2]}`;
      case "lg":
        return `${theme.spacing[2]} ${theme.spacing[4]}`;
      default:
        return `${theme.spacing[1.5]} ${theme.spacing[3]}`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case "sm":
        return theme.typography.fontSize.xs;
      case "lg":
        return theme.typography.fontSize.md;
      default:
        return theme.typography.fontSize.sm;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  line-height: 1;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.duration[200]}ms
    ${({ theme }) => theme.transitions.timing.out};

  svg {
    flex-shrink: 0;
    width: ${({ $size }) => {
      switch ($size) {
        case "sm":
          return "12px";
        case "lg":
          return "18px";
        default:
          return "14px";
      }
    }};
    height: ${({ $size }) => {
      switch ($size) {
        case "sm":
          return "12px";
        case "lg":
          return "18px";
        default:
          return "14px";
      }
    }};
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return `
          background: ${theme.colors.semantic.success}15;
          color: #0f5132;
          border-color: ${theme.colors.semantic.success}30;
          
          svg {
            color: ${theme.colors.semantic.success};
          }
        `;
      case "warning":
        return `
          background: #FA761F15;
          color: #8b4513;
          border-color: #FA761F30;
          
          svg {
            color: #FA761F;
          }
        `;
      case "danger":
        return `
          background: ${theme.colors.semantic.error}15;
          color: #8b1538;
          border-color: ${theme.colors.semantic.error}30;
          
          svg {
            color: ${theme.colors.semantic.error};
          }
        `;
      case "info":
        return `
          background: #0ea5e915;
          color: #0c4a6e;
          border-color: #0ea5e930;
          
          svg {
            color: #0ea5e9;
          }
        `;
      case "primary":
        return `
          background: #FA761F15;
          color: #8b4513;
          border-color: #FA761F30;
          
          svg {
            color: #FA761F;
          }
        `;
      case "neutral":
      default:
        return `
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
          border-color: ${theme.colors.neutral[200]};
          
          svg {
            color: ${theme.colors.neutral[600]};
          }
        `;
    }
  }}

  /* Estados hover para badges interativos */
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;
