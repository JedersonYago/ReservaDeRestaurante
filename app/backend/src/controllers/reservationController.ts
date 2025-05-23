import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import Table from "../models/Table";
import { AuthRequest } from "../middlewares/auth";

// Criar reserva
export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { data, hora, numeroPessoas } = req.body;
    const clienteId = req.user?._id;

    // Verificar se já existe reserva para a mesma data/hora/mesa
    const reservaExistente = await Reservation.findOne({
      data,
      hora,
      status: { $ne: "cancelada" },
    });

    if (reservaExistente) {
      return res
        .status(400)
        .json({ error: "Já existe uma reserva para este horário" });
    }

    // Encontrar mesa disponível com capacidade adequada
    const mesa = await Table.findOne({
      capacidade: { $gte: numeroPessoas },
    }).sort({ capacidade: 1 });

    if (!mesa) {
      return res
        .status(400)
        .json({
          error: "Não há mesas disponíveis para este número de pessoas",
        });
    }

    const reserva = await Reservation.create({
      data,
      hora,
      numeroPessoas,
      mesa: mesa._id,
      cliente: clienteId,
      status: "pendente",
    });

    await reserva.populate("mesa");
    await reserva.populate("cliente", "-senha");

    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar reserva" });
  }
};

// Listar reservas
export const getReservations = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin ? {} : { cliente: req.user?._id };

    const reservas = await Reservation.find(query)
      .populate("mesa")
      .populate("cliente", "-senha")
      .sort({ data: 1, hora: 1 });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar reservas" });
  }
};

// Buscar reserva por ID
export const getReservationById = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, cliente: req.user?._id };

    const reserva = await Reservation.findOne(query)
      .populate("mesa")
      .populate("cliente", "-senha");

    if (!reserva) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar reserva" });
  }
};

// Atualizar reserva
export const updateReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { data, hora, numeroPessoas, status } = req.body;
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, cliente: req.user?._id };

    // Verificar se reserva existe e pertence ao usuário
    const reservaExistente = await Reservation.findOne(query);
    if (!reservaExistente) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Se estiver alterando data/hora, verificar disponibilidade
    if (data || hora) {
      const reservaConflitante = await Reservation.findOne({
        data: data || reservaExistente.data,
        hora: hora || reservaExistente.hora,
        status: { $ne: "cancelada" },
        _id: { $ne: req.params.id },
      });

      if (reservaConflitante) {
        return res
          .status(400)
          .json({ error: "Já existe uma reserva para este horário" });
      }
    }

    // Se estiver alterando número de pessoas, verificar capacidade da mesa
    if (numeroPessoas) {
      const mesa = await Table.findById(reservaExistente.mesa);
      if (numeroPessoas > mesa?.capacidade) {
        return res
          .status(400)
          .json({ error: "Número de pessoas excede a capacidade da mesa" });
      }
    }

    const reserva = await Reservation.findByIdAndUpdate(
      req.params.id,
      { data, hora, numeroPessoas, status },
      { new: true, runValidators: true }
    )
      .populate("mesa")
      .populate("cliente", "-senha");

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar reserva" });
  }
};

// Excluir reserva
export const deleteReservation = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, cliente: req.user?._id };

    const reserva = await Reservation.findOneAndDelete(query);

    if (!reserva) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    res.json({ message: "Reserva excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir reserva" });
  }
};
