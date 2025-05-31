import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { tableService } from "../services/tableService";
import type { CreateTableData } from "../services/tableService";

export function useTables() {
  const queryClient = useQueryClient();

  const { data: tables, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: tableService.getAll,
  });

  const createTable = useMutation({
    mutationFn: tableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Mesa criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar mesa. Tente novamente.");
    },
  });

  const updateTable = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTableData>;
    }) => tableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Mesa atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar mesa. Tente novamente.");
    },
  });

  const deleteTable = useMutation({
    mutationFn: tableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Mesa excluída com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir mesa. Tente novamente.");
    },
  });

  return {
    tables,
    isLoading,
    createTable: (data: CreateTableData) => createTable.mutate(data),
    updateTable: (id: string, data: Partial<CreateTableData>) =>
      updateTable.mutate({ id, data }),
    deleteTable: (id: string) => deleteTable.mutate(id),
  };
}
