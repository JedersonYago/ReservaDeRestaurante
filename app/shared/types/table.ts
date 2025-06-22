import type {
  BaseEntity,
  TableStatus,
  AvailabilityBlock,
  ReservationStatus,
} from "./common";

/**
 * Interface unificada para mesa
 */
export interface Table extends BaseEntity {
  name: string;
  capacity: number;
  status: TableStatus;
  availability?: AvailabilityBlock[];
  reservations?: ReservationSummary[];
}

/**
 * Resumo de reserva para incluir na mesa
 */
export interface ReservationSummary {
  _id: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  status: ReservationStatus;
}

/**
 * Dados para criação de mesa
 */
export interface CreateTableData {
  name: string;
  capacity: number;
  availability?: AvailabilityBlock[];
}

/**
 * Dados para atualização de mesa
 */
export interface UpdateTableData extends Partial<CreateTableData> {
  status?: TableStatus;
}
