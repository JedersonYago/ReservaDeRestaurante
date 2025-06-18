import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "./useAuth";

interface ClientStats {
  personal: {
    upcomingReservations: any[];
    totalReservations: number;
    thisMonthReservations: number;
    confirmedReservations: number;
    cancelledReservations: number;
    favoriteTable: string | null;
  };
  restaurant: {
    totalTables: number;
    availableTablesToday: number;
  };
}

interface AdminStats {
  overview: {
    totalReservations: number;
    todayReservations: number;
    thisMonthReservations: number;
    uniqueClients: number;
  };
  reservationsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  tables: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    maintenance: number;
  };
  charts: {
    weeklyReservations: { date: string; count: number }[];
    popularTimes: { _id: string; count: number }[];
  };
  alerts: {
    reservationsNeedingAttention: any[];
  };
}

const dashboardService = {
  async getClientStats(): Promise<ClientStats> {
    const response = await api.get<ClientStats>("/dashboard/client");
    return response.data;
  },

  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>("/dashboard/admin");
    return response.data;
  },
};

export function useDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    data: clientStats,
    isLoading: clientLoading,
    error: clientError,
    refetch: refetchClient,
  } = useQuery({
    queryKey: ["dashboard", "client", user?._id],
    queryFn: dashboardService.getClientStats,
    enabled: !!user && !isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });

  const {
    data: adminStats,
    isLoading: adminLoading,
    error: adminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ["dashboard", "admin", user?._id],
    queryFn: dashboardService.getAdminStats,
    enabled: !!user && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutos (dados mais dinâmicos para admin)
    refetchOnWindowFocus: true,
  });

  return {
    // Client data
    clientStats,
    clientLoading,
    clientError,
    refetchClient,

    // Admin data
    adminStats,
    adminLoading,
    adminError,
    refetchAdmin,

    // Helper
    isAdmin,
    loading: isAdmin ? adminLoading : clientLoading,
    error: isAdmin ? adminError : clientError,
    refetch: isAdmin ? refetchAdmin : refetchClient,
  };
}
