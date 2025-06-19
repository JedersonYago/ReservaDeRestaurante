import { useEffect, useRef } from "react";

export function useFocusManagement() {
  const trapRef = useRef<HTMLElement | null>(null);

  // Foca no primeiro elemento focável
  const focusFirst = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  };

  // Foca no último elemento focável
  const focusLast = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;
    lastElement?.focus();
  };

  // Gerencia o trap de foco (para modals e menus)
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab - indo para trás
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab - indo para frente
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Callback para fechar o modal/menu será definido externamente
        const closeEvent = new CustomEvent("focusTrapEscape");
        container.dispatchEvent(closeEvent);
      }
    };

    container.addEventListener("keydown", handleTabKey);
    container.addEventListener("keydown", handleEscapeKey);

    // Foca no primeiro elemento quando ativa o trap
    firstElement.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
      container.removeEventListener("keydown", handleEscapeKey);
    };
  };

  // Hook para gerenciar foco automático quando elemento entra/sai de view
  const useAutoFocus = (shouldFocus: boolean) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (shouldFocus && elementRef.current) {
        focusFirst(elementRef.current);
      }
    }, [shouldFocus]);

    return elementRef;
  };

  // Hook para trap de foco com cleanup automático
  const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (isActive && containerRef.current) {
        const cleanup = trapFocus(containerRef.current);
        return cleanup;
      }
    }, [isActive]);

    return containerRef;
  };

  // Gerencia foco ao retornar de navegação
  const restoreFocus = (element: HTMLElement) => {
    element.focus();
  };

  // Salva elemento focado atual para restaurar depois
  const saveFocus = () => {
    return document.activeElement as HTMLElement;
  };

  return {
    focusFirst,
    focusLast,
    trapFocus,
    useAutoFocus,
    useFocusTrap,
    restoreFocus,
    saveFocus,
  };
}
