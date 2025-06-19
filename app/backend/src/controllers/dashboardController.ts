import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import Table from "../models/Table";
import User from "../models/User";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

// Interfaces para dados populados
interface PopulatedTable {
  _id: string;
  name: string;
  capacity?: number;
}

interface PopulatedReservation {
  _id: string;
  tableId: PopulatedTable;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  status: string;
  userId: string;
  observations?: string;
}

// Estatísticas para o cliente
export const getClientStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const thisMonth = format(new Date(), "yyyy-MM");

    // Buscar reservas do usuário
    const userReservations = await Reservation.find({
      userId,
      hiddenFromUser: false,
    }).populate("tableId", "name");

    // Próximas reservas (não canceladas)
    const upcomingReservations = userReservations
      .filter((r) => r.status !== "cancelled" && r.date >= today)
      .sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      )
      .slice(0, 3);

    // Estatísticas pessoais
    const totalReservations = userReservations.length;
    const thisMonthReservations = userReservations.filter((r) =>
      r.date.startsWith(thisMonth)
    ).length;
    const confirmedReservations = userReservations.filter(
      (r) => r.status === "confirmed"
    ).length;
    const cancelledReservations = userReservations.filter(
      (r) => r.status === "cancelled"
    ).length;

    // Informações do restaurante
    const totalTables = await Table.countDocuments();
    const availableTablesToday = await Table.countDocuments({
      status: "available",
    });

    const stats = {
      personal: {
        upcomingReservations,
        totalReservations,
        thisMonthReservations,
        confirmedReservations,
        cancelledReservations,
      },
      restaurant: {
        totalTables,
        availableTablesToday,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("[getClientStats] Erro:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar estatísticas do cliente" });
  }
};

// Estatísticas para o admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const todayFormatted = format(today, "yyyy-MM-dd");
    const thisWeek = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), i), "yyyy-MM-dd")
    ).reverse();
    const thisMonth = format(new Date(), "yyyy-MM");

    // Reservas gerais
    const totalReservations = await Reservation.countDocuments({
      hiddenFromUser: false,
    });

    // Reservas de hoje - usando query mais robusta
    const todayReservations = await Reservation.countDocuments({
      $or: [
        { date: todayFormatted }, // formato yyyy-MM-dd
        {
          date: {
            $gte: format(todayStart, "yyyy-MM-dd"),
            $lte: format(todayEnd, "yyyy-MM-dd"),
          },
        },
      ],
      hiddenFromUser: false,
    });

    const thisMonthReservations = await Reservation.countDocuments({
      date: { $regex: `^${thisMonth}` },
      hiddenFromUser: false,
    });

    // Reservas por status
    const pendingReservations = await Reservation.countDocuments({
      status: "pending",
      hiddenFromUser: false,
    });
    const confirmedReservations = await Reservation.countDocuments({
      status: "confirmed",
      hiddenFromUser: false,
    });
    const cancelledReservations = await Reservation.countDocuments({
      status: "cancelled",
      hiddenFromUser: false,
    });

    // Estatísticas de mesas
    const totalTables = await Table.countDocuments();
    const availableTables = await Table.countDocuments({ status: "available" });
    const reservedTables = await Table.countDocuments({ status: "reserved" });
    const maintenanceTables = await Table.countDocuments({
      status: "maintenance",
    });

    // Clientes únicos
    const uniqueClients = await User.countDocuments({ role: "client" });

    // Reservas dos últimos 7 dias
    const weeklyReservations = await Promise.all(
      thisWeek.map(async (date) => {
        const count = await Reservation.countDocuments({
          date,
          hiddenFromUser: false,
        });
        return { date, count };
      })
    );

    // Horários mais populares
    const timeSlots = await Reservation.aggregate([
      { $match: { hiddenFromUser: false } },
      { $group: { _id: "$time", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Reservas que precisam de atenção
    const reservationsNeedingAttention = await Reservation.find({
      status: "pending",
      hiddenFromUser: false,
      date: { $gte: todayFormatted },
    })
      .populate("tableId", "name")
      .populate("userId", "name email")
      .sort({ date: 1, time: 1 })
      .limit(10);

    const stats = {
      overview: {
        totalReservations,
        todayReservations,
        thisMonthReservations,
        uniqueClients,
      },
      reservationsByStatus: {
        pending: pendingReservations,
        confirmed: confirmedReservations,
        cancelled: cancelledReservations,
      },
      tables: {
        total: totalTables,
        available: availableTables,
        reserved: reservedTables,
        maintenance: maintenanceTables,
      },
      charts: {
        weeklyReservations,
        popularTimes: timeSlots,
      },
      alerts: {
        reservationsNeedingAttention,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("[getAdminStats] Erro:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar estatísticas do admin" });
  }
};
