import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { useEffect } from "react";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query para buscar usuário atual com validação
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Primeiro validar o token
      const isValid = await authService.validateToken();
      if (!isValid) {
        // Tentar refresh se o token for inválido
        const authData = await authService.refreshToken();
        if (authData) {
          return authData.user;
        }
        // Se não conseguir refresh, buscar do localStorage como fallback
        const localUser = authService.getUser();
        if (localUser) {
          // Verificar se o usuário ainda existe no backend
          try {
            const currentUser = await authService.getCurrentUser();
            return currentUser || localUser;
          } catch {
            return localUser;
          }
        }
        return null;
      }

      // Se o token for válido, buscar usuário atualizado
      const currentUser = await authService.getCurrentUser();
      return currentUser || authService.getUser();
    },
    retry: 1,
    enabled: !!authService.getToken(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false, // Não revalidar ao focar a janela
    refetchOnMount: false, // Não revalidar ao montar o componente
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
      // Se falhar o refresh, fazer logout
      authService.clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  // Verificar token periodicamente
  useEffect(() => {
    if (!authService.getToken()) return;

    const checkTokenInterval = setInterval(async () => {
      try {
        const isValid = await authService.validateToken();
        if (!isValid) {
          // Token inválido, tentar refresh
          await refreshMutation.mutateAsync();
        }
      } catch (error) {
        console.error("[useAuth.tokenCheck] Erro:", error);
      }
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos

    return () => clearInterval(checkTokenInterval);
  }, [refreshMutation]);

  // Verificar token quando a janela ganha foco
  useEffect(() => {
    const handleFocus = async () => {
      if (authService.getToken()) {
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            await refreshMutation.mutateAsync();
          }
        } catch (error) {
          console.error("[useAuth.windowFocus] Erro:", error);
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshMutation]);

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
