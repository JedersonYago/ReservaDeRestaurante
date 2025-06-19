import { Request, Response } from "express";
import Table, { ITable } from "../models/Table";
import Reservation from "../models/Reservation";
import { IReservation } from "../models/Reservation";
import { tableSchema } from "../validations/schemas";
import { isDateInRange, isTimeInRange } from "../utils/dateUtils";
import { parseISO, getDay } from "date-fns";
import mongoose from "mongoose";
import { formatToYMD } from "../../../shared/utils/dateFormat";

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
      const { error } = tableSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
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
      const { error } = tableSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!table) {
        return res.status(404).json({ message: "Mesa não encontrada" });
      }
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

      // Buscar todas as mesas que não estão em manutenção
      // (uma mesa pode ter reservas em outros horários e ainda estar disponível para este horário específico)
      const tables = await Table.find({
        status: { $ne: "maintenance" }, // Apenas exclui mesas em manutenção
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
