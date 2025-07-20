import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "../../pages/Error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para mostrar a UI de erro
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para desenvolvimento/monitoramento
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // Exemplo: enviar para serviço de monitoramento
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Se um fallback customizado foi fornecido, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Senão, renderize a página de erro padrão
      return (
        <ErrorPage
          errorCode="500"
          errorTitle="Ops! Algo deu errado"
          errorMessage="Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema."
          showReload={true}
        />
      );
    }

    // Se não há erro, renderize os children normalmente
    return this.props.children;
  }
}

// Hook para usar o ErrorBoundary de forma mais simples
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
