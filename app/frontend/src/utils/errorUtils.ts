export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export function getErrorPageProps(error: unknown) {
  // Se é um erro de API conhecido
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return {
          errorCode: "400",
          errorTitle: "Requisição inválida",
          errorMessage:
            "Os dados enviados são inválidos. Verifique as informações e tente novamente.",
          showReload: false,
        };
      case 401:
        return {
          errorCode: "401",
          errorTitle: "Acesso negado",
          errorMessage: "Você precisa fazer login para acessar esta página.",
          showReload: false,
        };
      case 403:
        return {
          errorCode: "403",
          errorTitle: "Acesso proibido",
          errorMessage: "Você não tem permissão para acessar este recurso.",
          showReload: false,
        };
      case 404:
        return {
          errorCode: "404",
          errorTitle: "Recurso não encontrado",
          errorMessage: "O recurso solicitado não foi encontrado no servidor.",
          showReload: false,
        };
      case 429:
        return {
          errorCode: "429",
          errorTitle: "Muitas tentativas",
          errorMessage:
            "Você fez muitas tentativas. Aguarde alguns minutos antes de tentar novamente.",
          showReload: true,
        };
      case 500:
        return {
          errorCode: "500",
          errorTitle: "Erro interno do servidor",
          errorMessage:
            "Ocorreu um erro interno no servidor. Nossa equipe foi notificada.",
          showReload: true,
        };
      case 502:
      case 503:
      case 504:
        return {
          errorCode: error.status.toString(),
          errorTitle: "Serviço indisponível",
          errorMessage:
            "O serviço está temporariamente indisponível. Tente novamente em alguns instantes.",
          showReload: true,
        };
      default:
        return {
          errorCode: error.status.toString(),
          errorTitle: "Erro no servidor",
          errorMessage:
            error.message || "Ocorreu um erro inesperado. Tente novamente.",
          showReload: true,
        };
    }
  }

  // Se é um erro de rede
  if (isNetworkError(error)) {
    return {
      errorCode: "NETWORK",
      errorTitle: "Erro de conexão",
      errorMessage: "Verifique sua conexão com a internet e tente novamente.",
      showReload: true,
    };
  }

  // Erro genérico
  return {
    errorCode: "500",
    errorTitle: "Ops! Algo deu errado",
    errorMessage: "Ocorreu um erro inesperado. Nossa equipe foi notificada.",
    showReload: true,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as any).status === "number"
  );
}

export function isNetworkError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    return (
      err.code === "NETWORK_ERROR" ||
      err.message?.includes("Network Error") ||
      err.message?.includes("fetch") ||
      !navigator.onLine
    );
  }
  return false;
}

export function logError(error: unknown, context?: string) {
  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.error("Error logged:", errorInfo);

  // Em produção, você pode enviar para serviços como Sentry
  if (process.env.NODE_ENV === "production") {
    // Exemplo: Sentry.captureException(error, { extra: errorInfo });
  }
}
