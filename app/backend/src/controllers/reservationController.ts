import { Request, Response } from "express";
import Reservation, { IReservation } from "../models/Reservation";
import Table, { ITable } from "../models/Table";
import User from "../models/User";
import mongoose from "mongoose";
import { reservationSchema } from "../validations/schemas";
import { isDateInRange, isTimeInRange } from "../utils/dateUtils";
import { getDay, parseISO } from "date-fns";
import Config from "../models/Config";
import {
  applyConfigToReservation,
  generateAvailableTimeSlots,
} from "../utils/configUtils";
import { scheduleAutoApproval } from "../services/schedulerService";
import { formatToYMD } from "../../../shared/utils/dateFormat";

interface AvailabilityBlock {
  date: string;
  times: string[];
}

// Listar todas as reservas
export const listReservations = async (req: Request, res: Response) => {
  try {
    // Se não houver usuário autenticado, retorna erro
    if (!req.user) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    // Se for admin, retorna todas as reservas
    // Se for cliente, retorna apenas as reservas dele que não estão escondidas
    const query =
      req.user.role === "admin"
        ? {}
        : { userId: req.user._id, hiddenFromUser: false };

    const reservations = await Reservation.find(query)
      .populate("tableId")
      .populate("userId", "name email")
      .sort({ date: 1, time: 1 });

    return res.json(reservations);
  } catch (error) {
    console.error("[listReservations] Erro ao listar reservas:", error);
    return res.status(500).json({
      error: "Erro ao listar reservas",
    });
  }
};

// Buscar reserva por ID
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("tableId", "name capacity")
      .populate("userId", "name email");

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    return res.json(reservation);
  } catch (error) {
    console.error("[getReservationById] Erro ao buscar reserva:", error);
    return res.status(500).json({ error: "Erro ao buscar reserva" });
  }
};

// Função para verificar se um horário específico está disponível
async function isTimeSlotAvailable(
  tableId: string,
  date: string,
  time: string
): Promise<boolean> {
  const existingReservation = await Reservation.findOne({
    tableId: tableId,
    date: date.slice(0, 10),
    time,
    status: { $ne: "cancelled" },
  });

  return !existingReservation;
}

// Função para ajustar a data para o início do dia no fuso horário local
function adjustToLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayOfWeek(dateStr: string) {
  // 0 = domingo, 1 = segunda, ...
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

// Função para atualizar o status da mesa com base nas reservas ativas
// Função para validar limite de reservas por usuário baseado na configuração
async function validateUserReservationLimit(
  userId: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    // Buscar configuração atual
    const config = await Config.findOne().sort({ updatedAt: -1 });
    if (!config || !config.isReservationLimitEnabled) {
      return { isValid: true }; // Se não há config ou está desabilitado, permite
    }

    // Calcular data limite (x horas atrás)
    const limitDate = new Date();
    limitDate.setHours(limitDate.getHours() - config.reservationLimitHours);

    // Contar reservas do usuário no período
    const userReservationsInPeriod = await Reservation.countDocuments({
      userId,
      status: { $in: ["pending", "confirmed"] },
      createdAt: { $gte: limitDate },
    });

    if (userReservationsInPeriod >= config.maxReservationsPerUser) {
      const hours = config.reservationLimitHours;
      const periodText =
        hours === 24
          ? "últimas 24 horas"
          : hours === 1
          ? "última hora"
          : `últimas ${hours} horas`;

      return {
        isValid: false,
        error: `Limite de ${config.maxReservationsPerUser} reservas por usuário nas ${periodText} atingido.`,
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("[validateUserReservationLimit] Erro:", error);
    return { isValid: false, error: "Erro ao validar limite de reservas" };
  }
}

export async function updateTableStatus(tableId: string | null) {
  if (!tableId) return;

  const table = await Table.findById(tableId);
  if (!table) return;

  // Não alterar status se a mesa estiver em manutenção ou expirada (controlado pelo admin)
  if (table.status === "maintenance" || table.status === "expired") {
    return;
  }

  // Calcular total de slots disponíveis
  const totalSlots = table.availability.reduce((total, block) => {
    return total + block.times.length;
  }, 0);

  if (totalSlots === 0) {
    // Se não há horários configurados, manter como available
    if (table.status !== "available") {
      await Table.findByIdAndUpdate(tableId, { status: "available" });
    }
    return;
  }

  // Buscar todas as reservas ativas da mesa
  const activeReservations = await Reservation.find({
    tableId,
    status: { $in: ["pending", "confirmed"] },
  });

  // Contar slots reservados verificando se cada reserva corresponde a um slot válido
  let reservedSlots = 0;
  for (const reservation of activeReservations) {
    // Verificar se a reserva corresponde a um slot válido na disponibilidade
    const block = table.availability.find((b) => b.date === reservation.date);
    if (block) {
      const timeSlot = block.times.find((timeRange) => {
        const [startTime] = timeRange.split("-");
        return startTime === reservation.time;
      });
      if (timeSlot) {
        reservedSlots++;
      }
    }
  }

  // Determinar novo status baseado na ocupação
  let newStatus: "available" | "reserved";
  if (reservedSlots === totalSlots && totalSlots > 0) {
    newStatus = "reserved"; // Todos os horários estão ocupados
  } else {
    newStatus = "available"; // Há pelo menos um horário livre
  }

  // Atualizar status apenas se mudou
  if (table.status !== newStatus) {
    await Table.findByIdAndUpdate(tableId, { status: newStatus });
  }
}

// Criar nova reserva
export const createReservation = async (req: Request, res: Response) => {
  try {
    const {
      tableId,
      customerName,
      customerEmail,
      date,
      time,
      observations,
    } = req.body;

    // Obter userId do usuário autenticado
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Verificar se a mesa existe
    const tableExists = await Table.findById(tableId);
    if (!tableExists) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    // Verificar se a mesa está em manutenção ou expirada
    if (tableExists.status === "maintenance") {
      return res.status(400).json({
        error: "Mesa está em manutenção e não está disponível para reserva",
      });
    }

    if (tableExists.status === "expired") {
      return res.status(400).json({
        error: "Mesa expirou e não está disponível para reserva",
      });
    }

    // Verificar se o horário está dentro dos horários disponíveis
    const availabilityBlock = tableExists.availability.find(
      (block: AvailabilityBlock) => block.date === date.slice(0, 10)
    );

    if (!availabilityBlock) {
      return res.status(400).json({
        error: "Data fora do período de disponibilidade da mesa",
      });
    }

    const isTimeAvailable = availabilityBlock.times.some(
      (timeRange: string) => {
        const [startTime] = timeRange.split("-");
        return startTime === time;
      }
    );

    if (!isTimeAvailable) {
      return res.status(400).json({
        error: "Horário fora do período de disponibilidade da mesa",
      });
    }

    // Verificar se o horário específico está disponível
    const isSlotAvailable = !(await Reservation.findOne({
      tableId,
      date: date.slice(0, 10),
      time,
      status: { $in: ["pending", "confirmed"] },
    }));

    if (!isSlotAvailable) {
      return res.status(400).json({
        error: "Horário já está reservado",
      });
    }

    // Buscar configurações para validação
    const config = await Config.findOne().sort({ updatedAt: -1 });
    if (!config) {
      return res.status(500).json({
        error: "Configurações do sistema não encontradas",
      });
    }

    // Aplicar validações de configuração (incluindo horários de funcionamento)
    const configValidation = await applyConfigToReservation(
      config,
      date.slice(0, 10),
      time,
      []
    );

    if (!configValidation.isValid) {
      return res.status(400).json({
        error: configValidation.error,
      });
    }

    // Validar limite de reservas por usuário baseado na configuração
    const limitValidation = await validateUserReservationLimit(userId);
    if (!limitValidation.isValid) {
      return res.status(400).json({
        error: limitValidation.error,
      });
    }

    const reservationData = {
      tableId,
      customerName,
      customerEmail,
      date: date.slice(0, 10),
      time,
      observations,
      userId,
      status: "pending" as const,
    };

    const reservation = new Reservation(reservationData);
    await reservation.save();

    // Agendar confirmação automática da reserva
    await scheduleAutoApproval(String(reservation._id));

    // Atualizar o status da mesa após criar a reserva
    await updateTableStatus(tableId);

    return res.status(201).json(reservation);
  } catch (error: any) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({
      error: error.response?.data?.error || "Erro ao fazer reserva",
    });
  }
};

// Buscar horários disponíveis
export const getAvailableTimes = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    // Buscar configurações atuais
    const config = await Config.findOne().sort({ updatedAt: -1 });
    if (!config) {
      return res.status(500).json({
        error: "Configurações do sistema não encontradas",
      });
    }

    // Buscar reservas existentes para a data
    const existingReservations = await Reservation.find({
      date,
      status: { $ne: "cancelled" },
    }).select("date time");

    // Gerar horários disponíveis
    const availableTimes = generateAvailableTimeSlots(
      config,
      date,
      existingReservations
    );

    return res.json(availableTimes);
  } catch (error) {
    console.error("[getAvailableTimes] Erro ao buscar horários:", error);
    return res.status(500).json({
      error: "Erro ao buscar horários disponíveis",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// Cancelar reserva
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { status: "cancelled" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Atualizar status da mesa
    await updateTableStatus(
      reservation.tableId ? reservation.tableId.toString() : null
    );

    return res.json(reservation);
  } catch (error) {
    console.error("[cancelReservation] Erro ao cancelar reserva:", error);
    return res.status(500).json({ error: "Erro ao cancelar reserva" });
  }
};

// Deletar reserva (apenas admins podem excluir permanentemente)
export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se é admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        error: "Apenas administradores podem excluir reservas permanentemente",
      });
    }

    // Verificar se a reserva existe
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Excluir a reserva
    await Reservation.findByIdAndDelete(id);

    // Atualizar o status da mesa
    await updateTableStatus(
      reservation.tableId ? reservation.tableId.toString() : null
    );

    res.status(204).send();
  } catch (error) {
    console.error("[deleteReservation] Erro ao deletar reserva:", error);
    res.status(500).json({ error: "Erro ao deletar reserva" });
  }
};

// Limpar reserva da lista do usuário (não exclui, apenas esconde)
export const clearReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { hiddenFromUser: true },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    return res.json({ message: "Reserva removida da sua lista" });
  } catch (error) {
    console.error("[clearReservation] Erro ao limpar reserva:", error);
    return res.status(500).json({ error: "Erro ao limpar reserva" });
  }
};

// Listar reservas por mesa
export const getReservationsByTable = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({
      tableId: req.params.tableId,
    })
      .populate("tableId")
      .populate("userId", "name email")
      .sort({ date: 1, time: 1 });

    return res.json(reservations);
  } catch (error) {
    console.error("[getReservationsByTable] Erro:", error);
    return res.status(500).json({
      error: "Erro ao buscar reservas da mesa",
    });
  }
};

// Buscar reservas por data
export const getReservationsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const reservations = await Reservation.find({ date })
      .populate("tableId", "name capacity")
      .populate("userId", "name email")
      .sort({ time: 1 });
    return res.json(reservations);
  } catch (error) {
    console.error("[getReservationsByDate] Erro ao buscar reservas:", error);
    return res.status(500).json({ error: "Erro ao buscar reservas" });
  }
};

// Confirmar reserva
export const confirmReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id },
      { status: "confirmed" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Atualizar status da mesa
    await updateTableStatus(
      reservation.tableId ? reservation.tableId.toString() : null
    );

    return res.json(reservation);
  } catch (error) {
    console.error("[confirmReservation] Erro ao confirmar reserva:", error);
    return res.status(500).json({ error: "Erro ao confirmar reserva" });
  }
};

export const reservationController = {
  async list(req: Request, res: Response) {
    try {
      const reservations = await Reservation.find()
        .populate("tableId", "name capacity")
        .sort({ date: 1, time: 1 });
      res.json(reservations);
    } catch (error) {
      console.error("Erro ao listar reservas:", error);
      res.status(500).json({ message: "Erro ao listar reservas" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const reservation = await Reservation.findById(req.params.id).populate(
        "tableId",
        "name capacity"
      );
      if (!reservation) {
        return res.status(404).json({ message: "Reserva não encontrada" });
      }
      res.json(reservation);
    } catch (error) {
      console.error("Erro ao buscar reserva:", error);
      res.status(500).json({ message: "Erro ao buscar reserva" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {
        tableId,
        customerName,
        customerEmail,
        date,
        time,
        observations,
        userId,
      } = req.body;

      // Verificar se a mesa existe
      const tableExists = await Table.findById(tableId);
      if (!tableExists) {
        return res.status(404).json({ error: "Mesa não encontrada" });
      }

      // Verificar se a mesa está em manutenção
      if (tableExists.status === "maintenance") {
        return res.status(400).json({
          error: "Mesa está em manutenção e não está disponível para reserva",
        });
      }

      // Verificar se o horário está dentro dos horários disponíveis
      const availabilityBlock = tableExists.availability.find(
        (block: AvailabilityBlock) => block.date === date.slice(0, 10)
      );

      if (!availabilityBlock) {
        return res.status(400).json({
          error: "Data fora do período de disponibilidade da mesa",
        });
      }

      const isTimeAvailable = availabilityBlock.times.some(
        (timeRange: string) => {
          const [startTime] = timeRange.split("-");
          return startTime === time;
        }
      );

      if (!isTimeAvailable) {
        return res.status(400).json({
          error: "Horário fora do período de disponibilidade da mesa",
        });
      }

      // Verificar se o horário específico está disponível
      const isSlotAvailable = !(await Reservation.findOne({
        tableId,
        date: date.slice(0, 10),
        time,
        status: { $in: ["pending", "confirmed"] },
      }));

      if (!isSlotAvailable) {
        return res.status(400).json({
          error: "Horário já está reservado",
        });
      }

      // Validar limite de reservas por usuário baseado na configuração
      const limitValidation = await validateUserReservationLimit(userId);
      if (!limitValidation.isValid) {
        return res.status(400).json({
          error: limitValidation.error,
        });
      }

      const reservationData = {
        tableId,
        customerName,
        customerEmail,
        date: date.slice(0, 10),
        time,
        observations,
        userId,
        status: "pending" as const,
      };

      const reservation = new Reservation(reservationData);
      await reservation.save();

      // Agendar confirmação automática da reserva
      await scheduleAutoApproval(String(reservation._id));

      // Atualizar o status da mesa após criar a reserva
      await updateTableStatus(tableId);

      return res.status(201).json(reservation);
    } catch (error: any) {
      console.error("Erro ao criar reserva:", error);
      res.status(500).json({
        error: error.response?.data?.error || "Erro ao fazer reserva",
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { table, date, time, status } = req.body;

      // Verificar se a reserva existe
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      // Se estiver mudando a mesa ou o horário, verificar disponibilidade
      if (
        (table && table !== reservation.tableId?.toString()) ||
        (date && date !== reservation.date) ||
        (time && time !== reservation.time)
      ) {
        // Verificar se a nova mesa existe
        const newTable = await Table.findById(table);
        if (!newTable) {
          return res.status(404).json({ error: "Mesa não encontrada" });
        }

        // Verificar se a mesa está em manutenção
        if (newTable.status === "maintenance") {
          return res.status(400).json({
            error: "Mesa está em manutenção e não está disponível para reserva",
          });
        }

        // Verificar se o horário está dentro dos horários disponíveis
        const availabilityBlock = newTable.availability.find(
          (block: AvailabilityBlock) => block.date === date.slice(0, 10)
        );

        if (!availabilityBlock) {
          return res.status(400).json({
            error: "Data fora do período de disponibilidade da mesa",
          });
        }

        const isTimeAvailable = availabilityBlock.times.some(
          (timeRange: string) => {
            const [startTime] = timeRange.split("-");
            return startTime === time;
          }
        );

        if (!isTimeAvailable) {
          return res.status(400).json({
            error: "Horário fora do período de disponibilidade da mesa",
          });
        }

        // Verificar se o novo horário está disponível
        const isSlotAvailable = !(await Reservation.findOne({
          _id: { $ne: id },
          tableId: table,
          date: date.slice(0, 10),
          time,
          status: { $in: ["pending", "confirmed"] },
        }));

        if (!isSlotAvailable) {
          return res.status(400).json({
            error: "Horário já está reservado",
          });
        }
      }

      // Atualizar a reserva
      const updatedReservation = await Reservation.findByIdAndUpdate(
        id,
        {
          ...req.body,
          date: date ? date.slice(0, 10) : undefined,
        },
        { new: true }
      );

      // Atualizar o status da mesa antiga e nova (se mudou)
      if (table && table !== reservation.tableId?.toString()) {
        if (reservation.tableId) {
          const tableId = reservation.tableId.toString();
          await updateTableStatus(typeof tableId === "string" ? tableId : null);
        }
        await updateTableStatus(typeof table === "string" ? table : null);
      } else if (reservation.tableId) {
        const tableId = reservation.tableId.toString();
        await updateTableStatus(typeof tableId === "string" ? tableId : null);
      }

      res.json(updatedReservation);
    } catch (error: any) {
      console.error("Erro ao atualizar reserva:", error);
      res.status(500).json({
        error: error.response?.data?.error || "Erro ao atualizar reserva",
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se a reserva existe
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      // Excluir a reserva
      await Reservation.findByIdAndDelete(id);

      // Atualizar o status da mesa
      await updateTableStatus(
        reservation.tableId ? reservation.tableId.toString() : null
      );

      res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao excluir reserva:", error);
      res.status(500).json({
        error: error.response?.data?.error || "Erro ao excluir reserva",
      });
    }
  },

  async cancel(req: Request, res: Response) {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        { status: "cancelled" },
        { new: true }
      );

      if (!reservation) {
        return res.status(404).json({ message: "Reserva não encontrada" });
      }

      res.json(reservation);
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      res.status(500).json({ message: "Erro ao cancelar reserva" });
    }
  },
};
