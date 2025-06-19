import React from "react";
import styled, { keyframes } from "styled-components";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "../Button";

export type ConfirmationType = "danger" | "warning" | "success" | "info";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const typeConfig: Record<
  ConfirmationType,
  {
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    confirmVariant: "primary" | "danger" | "success" | "warning";
  }
> = {
  danger: {
    icon: XCircle,
    color: "#DC2626",
    confirmVariant: "danger",
  },
  warning: {
    icon: AlertTriangle,
    color: "#D97706",
    confirmVariant: "warning",
  },
  success: {
    icon: CheckCircle,
    color: "#059669",
    confirmVariant: "success",
  },
  info: {
    icon: Info,
    color: "#0284C7",
    confirmVariant: "primary",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconContainer $color={config.color}>
            <IconComponent size={24} />
          </IconContainer>
          <Title>{title}</Title>
        </Header>

        <Message>{message}</Message>

        <Actions>
          <CancelButton onClick={onClose} disabled={isLoading}>
            {cancelText}
          </CancelButton>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </Actions>
      </Content>
    </Overlay>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

const Content = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  min-width: 400px;
  max-width: 90%;
  max-width: 500px;
  animation: ${slideUp} 0.2s ease-out;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: 480px) {
    min-width: 90%;
    margin: ${({ theme }) => theme.spacing[4]};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]}
    ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const IconContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color}15;

  svg {
    color: ${({ $color }) => $color};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Message = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]}
    ${({ theme }) => theme.spacing[6]};
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 44px;

  /* Estilo neutro e discreto */
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.neutral[700]};
    border-color: ${({ theme }) => theme.colors.neutral[300]};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral[300]};
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;
