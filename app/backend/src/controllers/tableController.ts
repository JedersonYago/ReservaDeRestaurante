import { Request, Response } from "express";
import Table, { ITable } from "../models/Table";
import Reservation from "../models/Reservation";
import { IReservation } from "../models/Reservation";
import { tableSchema } from "../validations/schemas";
import { isDateInRange, isTimeInRange } from "../utils/dateUtils";
import { parseISO, getDay } from "date-fns";
import mongoose from "mongoose";
import { formatToYMD } from "../../../shared/utils/dateFormat";
import { updateTableStatus } from "./reservationController";
import { validateTableAvailabilityOverlaps } from "../utils/reservationUtils";

function getDayOfWeek(dateStr: string) {
  const dayIdx = getDay(parseISO(dateStr));
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][dayIdx];
}

interface AvailabilityBlock {
  date: string;
  times: string[];
}

export const tableController = {
  async list(req: Request, res: Response) {
    try {
      const tables = await Table.find().lean();
      const reservations = await Reservation.find({
        status: { $in: ["pending", "confirmed"] },
      }).lean();
      tables.forEach((table: ITable) => {
        (table as any).reservations = reservations.filter(
          (r: IReservation) =>
            r.tableId && r.tableId.toString() === table._id.toString()
        );
      });
      res.json(tables);
    } catch (error) {
      console.error("Erro ao listar mesas:", error);
      res.status(500).json({ message: "Erro ao listar mesas" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const table = await Table.findById(req.params.id).lean();
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }
      (table as any).reservations = await Reservation.find({
        tableId: table._id,
        status: { $in: ["pending", "confirmed"] },
      }).lean();
      res.json(table);
    } catch (error) {
      console.error("Erro ao buscar mesa:", error);
      res.status(500).json({ message: "Erro ao buscar mesa" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      // Validar dados da mesa
      const result = tableSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: result.error.errors[0].message,
        });
      }

      // Validar sobreposições de horários na disponibilidade
      if (req.body.availability && req.body.availability.length > 0) {
        const overlapValidation = validateTableAvailabilityOverlaps(
          req.body.availability
        );
        if (!overlapValidation.isValid) {
          return res.status(400).json({ message: overlapValidation.error });
        }
      }

      const table = await Table.create(req.body);
      res.status(201).json(table);
    } catch (error: any) {
      console.error("Erro ao criar mesa:", error);
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Já existe uma mesa com este nome" });
      }
      res.status(500).json({ message: "Erro ao criar mesa" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      // Validar dados da mesa
      const result = tableSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: result.error.errors[0].message,
        });
      }

      // Validar sobreposições de horários na disponibilidade
      if (req.body.availability && req.body.availability.length > 0) {
        const overlapValidation = validateTableAvailabilityOverlaps(
          req.body.availability
        );
        if (!overlapValidation.isValid) {
          return res.status(400).json({ message: overlapValidation.error });
        }
      }

      // Impedir que o status "expired" seja definido manualmente
      if (req.body.status === "expired") {
        return res.status(400).json({
          message:
            "O status 'expired' é controlado automaticamente pelo sistema",
        });
      }

      const currentTable = await Table.findById(req.params.id);
      if (!currentTable) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Se mesa estava expirada e admin está adicionando availability, reativar mesa
      if (
        currentTable.status === "expired" &&
        req.body.availability &&
        req.body.availability.length > 0
      ) {
        req.body.status = "available";
      }

      // Se o status está mudando para "maintenance", identificar reservas afetadas
      let affectedReservations: any[] = [];
      if (
        req.body.status === "maintenance" &&
        currentTable.status !== "maintenance"
      ) {
        affectedReservations = await Reservation.find({
          tableId: currentTable._id,
          status: { $in: ["pending", "confirmed"] },
        }).lean();

        // Se há reservas afetadas, retornar para o frontend processar remanejamento
        if (affectedReservations.length > 0) {
          return res.status(409).json({
            message: "Mesa tem reservas ativas que precisam ser remanejadas",
            affectedReservations,
            tableId: currentTable._id,
            tableName: currentTable.name,
          });
        }
      }

      const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Atualizar o status da mesa após a edição
      await updateTableStatus(table._id.toString());

      res.json(table);
    } catch (error: any) {
      console.error("Erro ao atualizar mesa:", error);
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Já existe uma mesa com este nome" });
      }
      res.status(500).json({ message: "Erro ao atualizar mesa" });
    }
  },

  // Força colocação em manutenção após processamento de remanejamento
  async forceMaintenance(req: Request, res: Response) {
    try {
      const { tableId, cancelReservations } = req.body;

      if (!tableId) {
        return res.status(400).json({ message: "ID da mesa é obrigatório" });
      }

      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Verificar reservas ativas
      const activeReservations = await Reservation.find({
        tableId: table._id,
        status: { $in: ["pending", "confirmed"] },
      });
      if (activeReservations.length > 0 && !cancelReservations) {
        return res.status(409).json({
          message:
            "Mesa tem reservas ativas que precisam ser remanejadas ou canceladas",
          affectedReservations: activeReservations,
          tableId: table._id,
          tableName: table.name,
        });
      }

      // Se cancelReservations for true, cancelar todas as reservas restantes
      if (cancelReservations) {
        await Reservation.updateMany(
          {
            tableId: table._id,
            status: { $in: ["pending", "confirmed"] },
          },
          { status: "cancelled" }
        );
      }

      // Atualizar status da mesa para manutenção
      const updatedTable = await Table.findByIdAndUpdate(
        tableId,
        { status: "maintenance" },
        { new: true }
      );

      res.json(updatedTable);
    } catch (error) {
      console.error("Erro ao forçar manutenção:", error);
      res.status(500).json({ message: "Erro ao colocar mesa em manutenção" });
    }
  },

  // Buscar mesas disponíveis para remanejamento
  async getAvailableForRescheduling(req: Request, res: Response) {
    try {
      const { date, time, capacity, excludeTableId } = req.query;

      if (!date || !time || !capacity) {
        return res.status(400).json({
          message: "Data, horário e capacidade são obrigatórios",
        });
      }

      // Buscar mesas que podem acomodar a capacidade e não estão em manutenção
      const query: any = {
        status: { $nin: ["maintenance", "expired"] },
        capacity: { $gte: Number(capacity) },
      };

      // Só adicionar exclusão se excludeTableId estiver definido
      if (excludeTableId) {
        query._id = { $ne: excludeTableId };
      }

      const tables = await Table.find(query);

      // Filtrar mesas disponíveis para o horário específico
      const availableTables = [];
      for (const table of tables) {
        // Verificar se o horário está na disponibilidade da mesa
        const availabilityBlock = table.availability.find(
          (block: AvailabilityBlock) => block.date === date
        );

        if (!availabilityBlock) continue;

        const isTimeAvailable = availabilityBlock.times.some(
          (timeRange: string) => {
            const [startTime] = timeRange.split("-");
            return startTime === time;
          }
        );

        if (!isTimeAvailable) continue;

        // Verificar se o horário não está ocupado
        const existingReservation = await Reservation.findOne({
          tableId: table._id,
          date,
          time,
          status: { $ne: "cancelled" },
        });

        if (!existingReservation) {
          availableTables.push({
            _id: table._id,
            name: table.name,
            capacity: table.capacity,
            status: table.status,
          });
        }
      }

      res.json(availableTables);
    } catch (error) {
      console.error("Erro ao buscar mesas para remanejamento:", error);
      res.status(500).json({ message: "Erro ao buscar mesas disponíveis" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const table = await Table.findById(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Atualiza o status de todas as reservas ativas para 'cancelled'
      await Reservation.updateMany(
        {
          tableId: table._id,
          status: { $in: ["pending", "confirmed"] },
        },
        { status: "cancelled" }
      );

      await table.deleteOne();
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir mesa:", error);
      res.status(500).json({ message: "Erro ao excluir mesa" });
    }
  },

  async getAvailability(req: Request, res: Response) {
    try {
      const { date, time } = req.query;
      const tableId = req.params.id;

      if (!date || !time) {
        return res.status(400).json({
          message: "Data e horário são obrigatórios",
        });
      }

      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Verificar se a data e horário estão dentro da disponibilidade da mesa
      const availabilityBlock = table.availability.find(
        (block) => block.date === date
      );

      if (!availabilityBlock) {
        return res.json(false);
      }

      const isTimeAvailable = availabilityBlock.times.some(
        (timeRange: string) => {
          const [startTime] = timeRange.split("-");
          return startTime === time;
        }
      );

      if (!isTimeAvailable) {
        return res.json(false);
      }

      // Verificar se já existe uma reserva para este horário
      const existingReservation = await Reservation.findOne({
        tableId: tableId,
        date,
        time,
        status: { $ne: "cancelled" },
      });

      res.json(!existingReservation);
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      res.status(500).json({ message: "Erro ao verificar disponibilidade" });
    }
  },

  async availableTables(req: Request, res: Response) {
    try {
      const { date, time, numberOfPeople } = req.query;

      if (!date || !time || !numberOfPeople) {
        return res
          .status(400)
          .json({ message: "Parâmetros obrigatórios ausentes" });
      }

      // Buscar todas as mesas que não estão em manutenção ou expiradas
      // (uma mesa pode ter reservas em outros horários e ainda estar disponível para este horário específico)
      const tables = await Table.find({
        status: { $nin: ["maintenance", "expired"] }, // Exclui mesas em manutenção e expiradas
        capacity: { $gte: Number(numberOfPeople) },
      });

      // Filtrar mesas que estão disponíveis para o horário específico solicitado
      const available = [];
      for (const table of tables) {
        // Verifica se o horário está dentro dos blocos de availability da mesa
        const availabilityBlock = table.availability.find(
          (block: AvailabilityBlock) => block.date === date
        );

        if (!availabilityBlock) continue;

        const isTimeAvailable = availabilityBlock.times.some(
          (timeRange: string) => {
            const [startTime] = timeRange.split("-");
            return startTime === time;
          }
        );

        if (!isTimeAvailable) continue;

        // Verificar se já existe uma reserva para ESTE horário específico
        const existingReservation = await Reservation.findOne({
          tableId: table._id,
          date,
          time,
          status: { $ne: "cancelled" },
        });

        // Se não há reserva para este horário específico, a mesa está disponível
        if (!existingReservation) {
          available.push(table);
        }
      }
      res.json(available);
    } catch (error) {
      console.error("Erro ao buscar mesas disponíveis:", error);
      res.status(500).json({ message: "Erro ao buscar mesas disponíveis" });
    }
  },

  async getStatus(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const tableId = req.params.id;
      if (!date) {
        return res.status(400).json({ message: "Data é obrigatória" });
      }
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }

      // Buscar reservas ativas para a data específica
      const reservations = await Reservation.find({
        tableId: tableId, // Corrigido: usar tableId ao invés de table
        date,
        status: { $in: ["pending", "confirmed"] },
      });

      // Mapear horários reservados
      const reservedTimes = new Set(
        reservations.map((r: IReservation) => r.time)
      );

      // Buscar horários disponíveis para a data
      const availabilityBlock = table.availability.find(
        (block: AvailabilityBlock) => block.date === date
      );

      if (!availabilityBlock || availabilityBlock.times.length === 0) {
        return res.json({ status: "unavailable" });
      }

      const total = availabilityBlock.times.length;
      const reserved = availabilityBlock.times.filter((timeRange: string) => {
        const [startTime] = timeRange.split("-");
        return reservedTimes.has(startTime);
      }).length;

      let status = "available";
      if (reserved === total && total > 0) {
        status = "reserved"; // Todos os horários estão reservados
      } else if (reserved > 0) {
        status = "partial"; // Alguns horários estão reservados
      }
      // Se reserved === 0, status permanece "available"

      return res.json({
        status,
        details: {
          totalSlots: total,
          reservedSlots: reserved,
          availableSlots: total - reserved,
        },
      });
    } catch (error) {
      console.error("Erro ao obter status dinâmico da mesa:", error);
      res.status(500).json({ message: "Erro ao obter status da mesa" });
    }
  },
};
