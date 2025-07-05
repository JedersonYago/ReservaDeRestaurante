/**
 * Tipos e enums comuns compartilhados entre frontend e backend
 */

// Status de reserva padronizado
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

// Status de mesa padronizado
// - "available": Mesa operacional e disponível para configuração de horários
// - "maintenance": Mesa fora de operação, não aceita reservas
// - "reserved": Mesa totalmente reservada (caso especial, não usado automaticamente)
// - "expired": Mesa sem availability válida (datas de disponibilidade expiraram)
export type TableStatus = "available" | "reserved" | "maintenance" | "expired";

// Roles de usuário
export type UserRole = "client" | "admin";

// Interface base para entidades com timestamp
export interface BaseEntity {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Interface para blocos de disponibilidade
export interface AvailabilityBlock {
  date: string;
  times: string[];
}
