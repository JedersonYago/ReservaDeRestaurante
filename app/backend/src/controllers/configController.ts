import { Request, Response } from "express";
import Config from "../models/Config";
import {
  validateTimeSlot,
  validateTimeInterval,
} from "../utils/reservationUtils";

// Obter configurações atuais
export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await Config.findOne().sort({ updatedAt: -1 });
    if (!config) {
      // Se não existir configuração, criar uma com valores padrão
      const defaultConfig = await Config.create({
        maxReservationsPerTime: 5,
        minIntervalBetweenReservations: 30,
        openingHour: "11:00",
        closingHour: "23:00",
        timeSlots: 60,
        updatedBy: req.user?._id || "000000000000000000000000", // ID padrão se não houver usuário
      });
      return res.json(defaultConfig);
    }
    return res.json(config);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return res.status(500).json({
      error: "Erro ao buscar configurações",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// Atualizar configurações
export const updateConfig = async (req: Request, res: Response) => {
  try {
    const {
      maxReservationsPerTime,
      minIntervalBetweenReservations,
      openingHour,
      closingHour,
      timeSlots,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    // Validar horários
    if (
      !(await validateTimeSlot(openingHour)) ||
      !(await validateTimeSlot(closingHour))
    ) {
      return res.status(400).json({
        error: "Horários de funcionamento inválidos",
      });
    }

    // Validar intervalo
    if (
      !(await validateTimeInterval(openingHour)) ||
      !(await validateTimeInterval(closingHour))
    ) {
      return res.status(400).json({
        error: "Horários devem estar em intervalos válidos",
      });
    }

    // Validar ordem dos horários
    const [openingHours, openingMinutes] = openingHour.split(":").map(Number);
    const [closingHours, closingMinutes] = closingHour.split(":").map(Number);
    const openingInMinutes = openingHours * 60 + openingMinutes;
    const closingInMinutes = closingHours * 60 + closingMinutes;

    if (openingInMinutes >= closingInMinutes) {
      return res.status(400).json({
        error: "Horário de abertura deve ser anterior ao horário de fechamento",
      });
    }

    // Validar intervalo entre horários
    const totalMinutes = closingInMinutes - openingInMinutes;
    if (totalMinutes < timeSlots) {
      return res.status(400).json({
        error:
          "Intervalo entre abertura e fechamento deve ser maior que o intervalo de reservas",
      });
    }

    // Criar nova configuração
    const config = await Config.create({
      maxReservationsPerTime,
      minIntervalBetweenReservations,
      openingHour,
      closingHour,
      timeSlots,
      updatedBy: req.user._id,
    });

    return res.json(config);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return res.status(500).json({
      error: "Erro ao atualizar configurações",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// Obter histórico de configurações
export const getConfigHistory = async (_req: Request, res: Response) => {
  try {
    const configs = await Config.find()
      .sort({ updatedAt: -1 })
      .populate("updatedBy", "nome email");
    return res.json(configs);
  } catch (error) {
    console.error("Erro ao buscar histórico de configurações:", error);
    return res.status(500).json({
      error: "Erro ao buscar histórico de configurações",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
