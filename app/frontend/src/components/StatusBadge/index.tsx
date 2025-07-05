import React from "react";
import styled from "styled-components";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  XCircle,
  TimerOff,
} from "lucide-react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "expired";

export type BadgeStatus =
  | "available"
  | "reserved"
  | "maintenance"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

interface StatusBadgeProps {
  status?: BadgeStatus;
  variant?: BadgeVariant;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  iconOnly?: boolean;
}

// Sistema de Status Padronizado - Cores e Ícones
export const STATUS_CONFIG = {
  // Estados Positivos/Operacionais (Verde)
  available: {
    variant: "success" as BadgeVariant,
    icon: CheckCircle,
    label: "Disponível",
    description: "Pronto para uso/reserva",
  },
  confirmed: {
    variant: "success" as BadgeVariant,
    icon: CheckCircle,
    label: "Confirmada",
    description: "Reserva confirmada e ativa",
  },

  // Estados em Progresso (Azul)
  pending: {
    variant: "info" as BadgeVariant,
    icon: Clock,
    label: "Pendente",
    description: "Aguardando confirmação",
  },

  // Estados de Atenção/Ocupação (Laranja)
  reserved: {
    variant: "warning" as BadgeVariant,
    icon: AlertCircle,
    label: "Reservada",
    description: "Mesa ocupada/reservada",
  },

  // Estados Inativos/Manutenção (Cinza)
  maintenance: {
    variant: "neutral" as BadgeVariant,
    icon: Settings,
    label: "Em Manutenção",
    description: "Indisponível temporariamente",
  },

  // Estados Cancelados (Vermelho)
  cancelled: {
    variant: "danger" as BadgeVariant,
    icon: XCircle,
    label: "Cancelada",
    description: "Cancelado pelo usuário",
  },

  // Estados Expirados (Vermelho claro)
  expired: {
    variant: "expired" as BadgeVariant,
    icon: TimerOff,
    label: "Expirada",
    description: "Expirado automaticamente",
  },
} as const;

// Função helper para obter ícone padronizado
export function getStatusIcon(status: BadgeStatus, size: number = 16) {
  const IconComponent = STATUS_CONFIG[status]?.icon || Clock;
  return <IconComponent size={size} />;
}

// Função helper para obter texto padronizado
export function getStatusText(status: BadgeStatus): string {
  return STATUS_CONFIG[status]?.label || status;
}

// Função helper para obter descrição
export function getStatusDescription(status: BadgeStatus): string {
  return STATUS_CONFIG[status]?.description || "";
}

// Mapeamento de status para variantes
const statusToVariant: Record<BadgeStatus, BadgeVariant> = Object.entries(
  STATUS_CONFIG
).reduce((acc, [status, config]) => {
  acc[status as BadgeStatus] = config.variant;
  return acc;
}, {} as Record<BadgeStatus, BadgeVariant>);

export function StatusBadge({
  status,
  variant,
  children,
  size = "md",
  className,
  showIcon = true,
  iconOnly = false,
}: StatusBadgeProps) {
  // Se status for fornecido, usa o mapeamento; senão usa variant diretamente
  const finalVariant = status ? statusToVariant[status] : variant || "neutral";

  // Se não há children e status é fornecido, usar o texto padrão
  const content = children || (status ? getStatusText(status) : "");

  // Determinar tamanho do ícone baseado no size do badge
  const iconSize = size === "sm" ? 12 : size === "lg" ? 18 : 14;

  return (
    <Badge $variant={finalVariant} $size={size} className={className}>
      {showIcon && status && getStatusIcon(status, iconSize)}
      {!iconOnly && content}
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
          background: #10B98115;
          color: #065F46;
          border-color: #10B98130;
          
          svg {
            color: #10B981;
          }
        `;
      case "info":
        return `
          background: #3B82F615;
          color: #1E3A8A;
          border-color: #3B82F630;
          
          svg {
            color: #3B82F6;
          }
        `;
      case "warning":
        return `
          background: #F59E0B15;
          color: #92400E;
          border-color: #F59E0B30;
          
          svg {
            color: #F59E0B;
          }
        `;
      case "danger":
        return `
          background: #EF444415;
          color: #991B1B;
          border-color: #EF444430;
          
          svg {
            color: #EF4444;
          }
        `;
      case "expired":
        return `
          background: #F8717115;
          color: #7C2D12;
          border-color: #F8717130;
          
          svg {
            color: #F87171;
          }
        `;
      case "neutral":
        return `
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
          border-color: ${theme.colors.neutral[200]};
          
          svg {
            color: ${theme.colors.neutral[600]};
          }
        `;
      case "primary":
      default:
        return `
          background: #FA761F15;
          color: #8b4513;
          border-color: #FA761F30;
          
          svg {
            color: #FA761F;
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
