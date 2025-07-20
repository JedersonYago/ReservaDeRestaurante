import { useQuery } from "@tanstack/react-query";
import { configApi } from "../services/api";
import type { Config } from "../types/config";
import { useEffect, useState } from "react";

export function useConfig() {
  const [initialDelay, setInitialDelay] = useState(true);

  // Pequeno delay inicial para dar tempo ao backend inicializar
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelay(false);
    }, 15000); // 15 segundo de delay

    return () => clearTimeout(timer);
  }, []);

  const {
    data: config,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["config", "public"],
    queryFn: configApi.getPublicConfig,
    enabled: !initialDelay, // Só executa após o delay inicial
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Se for erro de conexão (backend não iniciou), fazer retry
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
        return failureCount < 5; // Retry até 5 vezes
      }
      // Para outros erros, retry normal
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Delay exponencial até 5s
    refetchInterval: (query) => {
      // Se ainda não temos dados e houve erro, tentar novamente a cada 3 segundos
      if (!query.state.data && query.state.error) {
        return 3000;
      }
      return false;
    },
  });

  return {
    config: config as Config | undefined,
    isLoading: initialDelay || isLoading,
    error,
    refetch,
  };
}
