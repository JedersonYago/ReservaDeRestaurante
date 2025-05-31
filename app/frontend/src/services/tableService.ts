import api from "./api";

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "reserved" | "occupied";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableData {
  number: number;
  capacity: number;
}

export const tableService = {
  async getAll(): Promise<Table[]> {
    const response = await api.get<Table[]>("/tables");
    return response.data;
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
    await api.delete(`/tables/${id}`);
  },

  async getAvailableTables(date: string, time: string): Promise<Table[]> {
    const response = await api.get<Table[]>("/tables/available", {
      params: { date, time },
    });
    return response.data;
  },
};
