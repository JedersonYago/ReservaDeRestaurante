import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "../services/reservationService";
import type { Reservation } from "../types";
import { useToast } from "../components/Toast";
import { useAuth } from "./useAuth";

// Interface local para reserva com tableId populado
interface PopulatedReservation extends Omit<Reservation, "tableId"> {
  tableId: string | { _id: string; name: string; capacity: number };
}

export const useReservations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  const {
    data: reservations = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservations", user?._id], // Adiciona o ID do usuário como dependência
    queryFn: reservationService.list,
    staleTime: 10000, // 10 segundos para capturar mudanças de status mais rapidamente
    refetchInterval: 15000, // Atualiza a cada 15 segundos automaticamente
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!user, // Só executa se houver um usuário logado
  });

  const createReservation = useMutation({
    mutationFn: reservationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao criar reserva");
    },
  });

  const deleteReservation = useMutation({
    mutationFn: reservationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva excluída com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao excluir reserva");
    },
  });

  const clearReservation = useMutation({
    mutationFn: reservationService.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva removida da sua lista!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao limpar reserva");
    },
  });

  const cancelReservation = useMutation({
    mutationFn: reservationService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva cancelada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao cancelar reserva");
    },
  });

  const confirmReservation = useMutation<Reservation, unknown, string>({
    mutationFn: async (id: string) => {
      return await reservationService.confirm(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva confirmada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao confirmar reserva");
    },
  });

  const getReservationById = async (id: string) => {
    try {
      const response = await reservationService.getById(id);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao buscar reserva");
      throw error;
    }
  };

  return {
    reservations,
    loading,
    error,
    refetch,
    createReservation,
    deleteReservation,
    clearReservation,
    cancelReservation,
    confirmReservation,
    getReservationById,
  };
};

export function useReservationById(id: string | undefined) {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: () => reservationService.getById(id!),
    enabled: !!id,
  });
}

export function useReservationsByTable(tableId: string) {
  const {
    data: allReservations = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationService.list,
    staleTime: 10000, // 10 segundos para dados mais frescos
    refetchInterval: 15000, // Atualiza a cada 15 segundos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const reservations = allReservations.filter((res: PopulatedReservation) => {
    if (!res.tableId) return false;
    return typeof res.tableId === "string"
      ? res.tableId === tableId
      : res.tableId._id === tableId;
  });

  return { reservations, loading, error, refetch };
}
