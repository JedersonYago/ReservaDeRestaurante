import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/Toast";
import { tableService } from "../services/tableService";
import type { CreateTableData, UpdateTableData, Table } from "../types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TOKEN_KEY = "token";

export function useTables() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: tables, isLoading } = useQuery<Table[], Error>({
    queryKey: ["tables"],
    queryFn: () => tableService.list(),
    retry: false,
  });

  useEffect(() => {
    const handleError = (error: any) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        navigate("/login");
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      } else {
        toast.error("Erro ao carregar mesas. Tente novamente.");
      }
    };

    if (tables === undefined && !isLoading) {
      handleError(new Error("Falha ao carregar mesas"));
    }
  }, [tables, isLoading, navigate]);

  const createTable = useMutation({
    mutationFn: tableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Mesa criada com sucesso!");
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro ao criar mesa. Tente novamente.");
      }
    },
  });

  const updateTable = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableData }) =>
      tableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Mesa atualizada com sucesso!");
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro ao atualizar mesa. Tente novamente.");
      }
    },
  });

  const { mutateAsync: deleteTable } = useMutation({
    mutationFn: tableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Mesa excluída com sucesso!");
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Erro ao excluir mesa. Tente novamente.");
      }
    },
  });

  return {
    tables,
    isLoading,
    createTable: (data: CreateTableData) => createTable.mutate(data),
    updateTable: (id: string, data: UpdateTableData) =>
      updateTable.mutate({ id, data }),
    deleteTable,
  };
}

export function useTableById(id: string | undefined) {
  return useQuery({
    queryKey: ["table", id],
    queryFn: () => tableService.getById(id!),
    enabled: !!id,
  });
}
