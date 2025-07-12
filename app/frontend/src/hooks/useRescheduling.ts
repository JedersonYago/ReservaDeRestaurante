import { useMutation, useQuery } from "@tanstack/react-query";
import { tableService } from "../services/tableService";
import { reservationService } from "../services/reservationService";
import { useToast } from "../components/Toast";

interface ReschedulingAction {
  reservationId: string;
  action: "reschedule" | "cancel";
  newTableId?: string;
}

export function useRescheduling() {
  const toast = useToast();

  // Buscar mesas disponíveis para remanejamento
  const getAvailableTablesForRescheduling = (
    date: string,
    time: string,
    capacity: number,
    excludeTableId: string
  ) => {
    return useQuery({
      queryKey: [
        "available-tables-rescheduling",
        date,
        time,
        capacity,
        excludeTableId,
      ],
      queryFn: () =>
        tableService.getAvailableForRescheduling(
          date,
          time,
          capacity,
          excludeTableId
        ),
      enabled: !!date && !!time && !!capacity && !!excludeTableId,
    });
  };

  // Processar remanejamento
  const processRescheduling = useMutation({
    mutationFn: async (data: {
      tableId: string;
      actions: ReschedulingAction[];
    }) => {
      const { tableId, actions } = data;

      // Processar cada ação
      for (const action of actions) {
        if (action.action === "reschedule" && action.newTableId) {
          // Atualizar reserva com nova mesa
          await reservationService.update(action.reservationId, {
            tableId: action.newTableId,
          });
        } else if (action.action === "cancel") {
          // Cancelar reserva
          await reservationService.cancel(action.reservationId);
        }
      }

      // Forçar colocação em manutenção
      await tableService.forceMaintenance(tableId, false);
    },
    onSuccess: () => {
      toast.success("Remanejamento realizado com sucesso!");
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao processar remanejamento");
      }
    },
  });

  // Cancelar todas as reservas e colocar em manutenção
  const cancelAllAndMaintenance = useMutation({
    mutationFn: async (tableId: string) => {
      await tableService.forceMaintenance(tableId, true);
    },
    onSuccess: () => {
      toast.success("Mesa colocada em manutenção e reservas canceladas!");
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao cancelar reservas e colocar em manutenção");
      }
    },
  });

  return {
    getAvailableTablesForRescheduling,
    processRescheduling,
    cancelAllAndMaintenance,
  };
}
