import axios from "axios";
import type { Table, CreateTableData } from "../types";

const API_URL = "/api";
const TOKEN_KEY = "token";

export const tableService = {
  async list(date?: string): Promise<Table[]> {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const params = date ? { date } : {};
      const response = await axios.get<Table[]>(`${API_URL}/tables`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar mesas:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Table> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.get<Table>(`${API_URL}/tables/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async create(data: CreateTableData): Promise<Table> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.post<Table>(`${API_URL}/tables`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async update(id: string, data: Partial<CreateTableData>): Promise<Table> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.put<Table>(`${API_URL}/tables/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    try {
      await axios.delete(`${API_URL}/tables/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.get<boolean>(
      `${API_URL}/tables/${id}/availability`,
      {
        params: { date, time },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async getAvailableTables(
    date: string,
    time: string,
    numberOfPeople: number
  ): Promise<Table[]> {
    const response = await axios.get<Table[]>("/tables/available", {
      params: { date, time, numberOfPeople },
    });
    return response.data;
  },

  async getStatus(id: string, date: string): Promise<{ status: string }> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Token não encontrado");
    }
    const response = await axios.get<{ status: string }>(
      `${API_URL}/tables/${id}/status`,
      {
        params: { date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
