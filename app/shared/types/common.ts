/**
 * Tipos e enums comuns compartilhados entre frontend e backend
 */

// Status de reserva padronizado
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

// Status de mesa padronizado
export type TableStatus = "available" | "occupied" | "reserved" | "maintenance";

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
