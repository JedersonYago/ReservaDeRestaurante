import api from "./api";
import type { Table, CreateTableData } from "../types";

export const tableService = {
  async list(date?: string): Promise<Table[]> {
    try {
      const params = date ? { date } : {};
      const response = await api.get<Table[]>("/tables", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar mesas:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Table> {
    const response = await api.get<Table>(`/tables/${id}`);
    return response.data;
  },

  async create(data: CreateTableData): Promise<Table> {
    const response = await api.post<Table>("/tables", data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateTableData>): Promise<Table> {
    const response = await api.put<Table>(`/tables/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/tables/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Mesa não encontrada");
      }
      throw new Error(error.response?.data?.message || "Erro ao excluir mesa");
    }
  },

  async getAvailability(
    id: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const response = await api.get<boolean>(`/tables/${id}/availability`, {
      params: { date, time },
    });
    return response.data;
  },

  async getAvailableTables(
    date: string,
    time: string,
    numberOfPeople: number
  ): Promise<Table[]> {
    const response = await api.get<Table[]>("/tables/available", {
      params: { date, time, numberOfPeople },
    });
    return response.data;
  },

  async getStatus(id: string, date: string): Promise<{ status: string }> {
    const response = await api.get<{ status: string }>(`/tables/${id}/status`, {
      params: { date },
    });
    return response.data;
  },

  async getAvailableForRescheduling(
    date: string,
    time: string,
    capacity: number,
    excludeTableId: string
  ): Promise<Table[]> {
    const response = await api.get<Table[]>(
      "/tables/available-for-rescheduling",
      {
        params: { date, time, capacity, excludeTableId },
      }
    );
    return response.data;
  },

  async forceMaintenance(
    tableId: string,
    cancelReservations: boolean
  ): Promise<Table> {
    const response = await api.post<Table>("/tables/force-maintenance", {
      tableId,
      cancelReservations,
    });
    return response.data;
  },
};
