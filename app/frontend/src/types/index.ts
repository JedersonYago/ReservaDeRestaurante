// Re-exportação de tipos
export * from "./user";
export * from "./table";
export * from "./reservation";

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
