import { useQuery } from "@tanstack/react-query";
import { configApi } from "../services/api";
import type { Config } from "../types/config";

export function useAdminConfig() {
  const {
    data: config,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["config", "admin"],
    queryFn: configApi.getConfig,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Para erros de autenticação, não fazer retry
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Para outros erros, retry normal
      return failureCount < 2;
    },
  });

  return {
    config: config as Config | undefined,
    isLoading,
    error,
    refetch,
  };
}
