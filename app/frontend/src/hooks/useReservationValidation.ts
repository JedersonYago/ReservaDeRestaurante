import { useState } from "react";
import { toast } from "react-toastify";
import { tableService } from "../services/tableService";
import type { Table } from "../types";

export function useReservationValidation() {
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateDateTime = (date: string, time: string) => {
    const selectedDate = new Date(`${date}T${time}`);
    const now = new Date();

    // Não permite reservas no passado
    if (selectedDate < now) {
      toast.error(
        "Não é possível fazer reservas para datas/horários passados. Por favor, selecione uma data/horário futuros."
      );
      return false;
    }

    return true;
  };

  const validateCapacity = (tableId: string, numberOfPeople: number) => {
    const table = availableTables.find((t) => t._id === tableId);
    if (!table) return false;

    if (numberOfPeople > table.capacity) {
      toast.error(
        `Esta mesa suporta no máximo ${table.capacity} pessoas. Por favor, selecione outra mesa ou reduza o número de pessoas.`
      );
      return false;
    }

    return true;
  };

  const loadAvailableTables = async (
    date: string,
    time: string,
    numberOfPeople?: string | number
  ) => {
    if (!date || !time || !numberOfPeople) return;

    setIsLoading(true);
    try {
      const tables = await tableService.getAvailableTables(
        date,
        time,
        Number(numberOfPeople)
      );
      setAvailableTables(tables);
    } catch (error) {
      toast.error(
        "Erro ao carregar mesas disponíveis. Por favor, tente novamente mais tarde."
      );
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
