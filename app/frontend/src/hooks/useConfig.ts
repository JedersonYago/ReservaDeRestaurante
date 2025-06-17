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
    queryKey: ["config"],
    queryFn: configApi.getConfig,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  return {
    config: config as Config | undefined,
    isLoading,
    error,
    refetch,
  };
}
