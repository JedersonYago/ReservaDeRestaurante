import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import Table from "../models/Table";
import {
  validateTimeSlot,
  validateTimeInterval,
  checkReservationLimit,
  getAvailableTimeSlots,
} from "../utils/reservationUtils";

// Criar uma nova reserva
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { data, horario, numeroPessoas, nome, telefone, email } = req.body;

    console.log("Dados recebidos:", {
      data,
      horario,
      numeroPessoas,
      nome,
      telefone,
      email,
    });

    // Validar horário
    if (!(await validateTimeSlot(horario))) {
      return res.status(400).json({
        error: "Horário fora do horário de funcionamento",
      });
    }

    // Validar intervalo
    if (!(await validateTimeInterval(horario))) {
      return res.status(400).json({
        error: "Horário deve estar em intervalos válidos",
      });
    }

    // Verificar limite de reservas
    const isAvailable = await checkReservationLimit(data, horario);
    if (!isAvailable) {
      return res.status(400).json({
        error: "Horário não disponível",
      });
    }

    const reservation = await Reservation.create({
      data,
      horario,
      numeroPessoas,
      nome,
      telefone,
      email,
      status: "pendente",
    });

    console.log("Reserva criada:", reservation);

    return res.status(201).json(reservation);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({
      error: "Erro ao criar reserva",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// Listar todas as reservas
export const listReservations = async (_req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find().sort({ data: 1, horario: 1 });
    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar reservas" });
  }
};

// Obter uma reserva específica
export const getReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar reserva" });
  }
};

// Atualizar uma reserva
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { data, horario, numeroPessoas, nome, telefone, email, status } =
      req.body;

    // Validar horário se foi alterado
    if (horario) {
      if (!(await validateTimeSlot(horario))) {
        return res.status(400).json({
          error: "Horário fora do horário de funcionamento",
        });
      }

      if (!(await validateTimeInterval(horario))) {
        return res.status(400).json({
          error: "Horário deve estar em intervalos válidos",
        });
      }

      // Verificar limite de reservas
      const isAvailable = await checkReservationLimit(data, horario);
      if (!isAvailable) {
        return res.status(400).json({
          error: "Horário não disponível",
        });
      }
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        data,
        horario,
        numeroPessoas,
        nome,
        telefone,
        email,
        status,
      },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar reserva" });
  }
};

// Cancelar uma reserva
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelada" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cancelar reserva" });
  }
};

// Obter horários disponíveis
export const getAvailableTimes = async (req: Request, res: Response) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({ error: "Data é obrigatória" });
    }

    const availableTimes = await getAvailableTimeSlots(data as string);
    return res.json(availableTimes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar horários disponíveis" });
  }
};
