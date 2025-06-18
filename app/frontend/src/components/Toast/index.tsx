import React, { createContext, useContext, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// Tipos
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Animações
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled Components
const ToastContainerStyled = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  width: 100%;
  pointer-events: none;

  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
`;

const ToastItem = styled.div<{ $type: ToastType; $isLeaving?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  border-left: 4px solid;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${({ $isLeaving }) => ($isLeaving ? slideOut : slideIn)} 0.3s
    ease-out;
  pointer-events: auto;
  min-height: 64px;

  border-left-color: ${({ theme, $type }) => {
    switch ($type) {
      case "success":
        return theme.colors.semantic.success;
      case "error":
        return theme.colors.semantic.error;
      case "warning":
        return theme.colors.semantic.warning;
      case "info":
        return theme.colors.semantic.info;
      default:
        return theme.colors.neutral[300];
    }
  }};
`;

const ToastIconContainer = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;
  margin-top: 2px;

  color: ${({ theme, $type }) => {
    switch ($type) {
      case "success":
        return theme.colors.semantic.success;
      case "error":
        return theme.colors.semantic.error;
      case "warning":
        return theme.colors.semantic.warning;
      case "info":
        return theme.colors.semantic.info;
      default:
        return theme.colors.neutral[500];
    }
  }};
`;

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToastMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};
`;

const ToastCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    success: (message: string, duration?: number) =>
      context.showToast("success", message, duration),
    error: (message: string, duration?: number) =>
      context.showToast("error", message, duration),
    warning: (message: string, duration?: number) =>
      context.showToast("warning", message, duration),
    info: (message: string, duration?: number) =>
      context.showToast("info", message, duration),
  };
}

// Componente do Toast Individual
function ToastComponent({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <ToastItem $type={toast.type} $isLeaving={isLeaving}>
      <ToastIconContainer $type={toast.type}>
        {getIcon(toast.type)}
      </ToastIconContainer>

      <ToastContent>
        <ToastMessage>{toast.message}</ToastMessage>
      </ToastContent>

      <ToastCloseButton onClick={handleRemove} aria-label="Fechar notificação">
        <X size={16} />
      </ToastCloseButton>
    </ToastItem>
  );
}

// Container dos Toasts
function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)!;

  if (toasts.length === 0) return null;

  return (
    <ToastContainerStyled>
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </ToastContainerStyled>
  );
}
