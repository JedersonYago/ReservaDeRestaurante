import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "../services/reservationService";
import type {
  CreateReservationData,
  UpdateReservationData,
} from "../types/reservation";
import { toast } from "react-toastify";

export function useReservations() {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationService.list,
  });

  const createReservation = useMutation({
    mutationFn: reservationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar reserva. Tente novamente.");
    },
  });

  const updateReservation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationData }) =>
      reservationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar reserva. Tente novamente.");
    },
  });

  const cancelReservation = useMutation({
    mutationFn: reservationService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva cancelada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    },
  });

  return {
    reservations,
    isLoading,
    createReservation: (data: CreateReservationData) =>
      createReservation.mutate(data),
    updateReservation: (id: string, data: UpdateReservationData) =>
      updateReservation.mutate({ id, data }),
    cancelReservation: (id: string) => cancelReservation.mutate(id),
  };
}
