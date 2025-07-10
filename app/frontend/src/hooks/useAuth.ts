import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { useEffect } from "react";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query para buscar usuário atual de forma simples
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Buscar usuário do localStorage primeiro (rápido)
      const localUser = authService.getUser();
      if (!localUser || !authService.getToken()) {
        return null;
      }

      // Tentar buscar dados atualizados do servidor
      try {
        const currentUser = await authService.getCurrentUser();
        return currentUser || localUser;
      } catch (error: any) {
        // Se der erro 401, tentar refresh
        if (error?.response?.status === 401) {
          try {
            const authData = await authService.refreshToken();
            return authData?.user || null;
          } catch {
            // Se refresh falhar, limpar dados e retornar null
            authService.clearAuth();
            return null;
          }
        }
        // Para outros erros, usar dados locais
        return localUser;
      }
    },
    retry: false, // Não fazer retry automático
    enabled: true, // Sempre habilitado
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async (logoutAll: boolean = false) => {
      if (logoutAll) {
        await authService.logoutAll();
      } else {
        await authService.logout();
      }
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("[useAuth.logout] Erro:", error);
      // Mesmo com erro, limpar dados locais
      authService.clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  // Mutation para refresh token
  const refreshMutation = useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (authData) => {
      if (authData) {
        queryClient.setQueryData(["user"], authData.user);
      }
    },
    onError: (error) => {
      console.error("[useAuth.refresh] Erro:", error);
      // Se falhar o refresh, apenas limpar dados sem navegar
      // O ProtectedRoute vai cuidar da navegação
      authService.clearAuth();
      queryClient.setQueryData(["user"], null);
    },
  });

  // Verificação mais simples quando necessário
  useEffect(() => {
    // Apenas verificar se não há token e limpar dados inconsistentes
    if (!authService.getToken() && user) {
      authService.clearAuth();
      queryClient.clear();
    }
  }, [user, queryClient]);

  const signOut = (logoutAll: boolean = false) => {
    logoutMutation.mutate(logoutAll);
  };

  const updateUser = (updatedUser: User) => {
    queryClient.setQueryData(["user"], updatedUser);
    authService.setUser(updatedUser);
  };

  const refreshUser = () => {
    refetch();
  };

  return {
    user,
    isLoading:
      isLoading || logoutMutation.isPending || refreshMutation.isPending,
    isAuthenticated: !!user,
    error,
    signOut,
    updateUser,
    refreshUser,
    logoutAll: () => signOut(true),
    isRefreshing: refreshMutation.isPending,
  };
}
