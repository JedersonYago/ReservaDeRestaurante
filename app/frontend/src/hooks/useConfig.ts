import { useQuery } from "@tanstack/react-query";
import { configApi } from "../services/api";
import type { Config } from "../types/config";

export function useConfig() {
  const {
    data: config,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["config", "public"],
    queryFn: configApi.getPublicConfig,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Para erro 404, não fazer retry (rota não existe)
      if (error?.response?.status === 404) {
        return false;
      }
      // Para outros erros, retry normal
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  return {
    config: config as Config | undefined,
    isLoading,
    error,
    refetch,
  };
}
