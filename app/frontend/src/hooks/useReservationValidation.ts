import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { tableService } from "../services/tableService";
import type { Table } from "../services/tableService";

const OPENING_HOUR = 11; // 11:00
const CLOSING_HOUR = 23; // 23:00

export function useReservationValidation() {
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateDateTime = (date: string, time: string) => {
    const selectedDate = new Date(`${date}T${time}`);
    const now = new Date();

    // Não permite reservas no passado
    if (selectedDate < now) {
      toast.error("Não é possível fazer reservas para datas/horários passados");
      return false;
    }

    // Valida horário de funcionamento
    const hour = selectedDate.getHours();
    if (hour < OPENING_HOUR || hour >= CLOSING_HOUR) {
      toast.error(
        `O restaurante funciona das ${OPENING_HOUR}:00 às ${CLOSING_HOUR}:00`
      );
      return false;
    }

    return true;
  };

  const validateCapacity = (tableId: string, numberOfPeople: number) => {
    const table = availableTables.find((t) => t.id === tableId);
    if (!table) return false;

    if (numberOfPeople > table.capacity) {
      toast.error(`Esta mesa suporta no máximo ${table.capacity} pessoas`);
      return false;
    }

    return true;
  };

  const loadAvailableTables = async (date: string, time: string) => {
    if (!date || !time) return;

    setIsLoading(true);
    try {
      const tables = await tableService.getAvailableTables(date, time);
      setAvailableTables(tables);
    } catch (error) {
      toast.error("Erro ao carregar mesas disponíveis");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availableTables,
    isLoading,
    validateDateTime,
    validateCapacity,
    loadAvailableTables,
  };
}
