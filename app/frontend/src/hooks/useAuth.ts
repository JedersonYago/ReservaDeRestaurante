import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getUser(),
    retry: false,
    enabled: !!authService.getToken(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const signOut = () => {
    authService.logout();
    queryClient.clear(); // Limpa todo o cache do React Query
    navigate("/login", { replace: true });
  };

  const updateUser = (updatedUser: User) => {
    queryClient.setQueryData(["user"], updatedUser);
    // Também atualizar no localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    updateUser,
  };
}
