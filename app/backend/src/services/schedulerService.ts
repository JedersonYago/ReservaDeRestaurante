import Reservation from "../models/Reservation";
import Table from "../models/Table";
import Config from "../models/Config";
import { AUTO_APPROVAL_MINUTES } from "../config/constants";

// Sistema de backup para confirmar reservas pendentes
export const checkPendingReservations = async () => {
  try {
    const config = await Config.findOne().sort({ updatedAt: -1 });

    // Se o sistema de confirmação automática estiver desabilitado, não fazer nada
    if (!config || !config.isIntervalEnabled) {
      return;
    }

    const confirmationTimeMinutes = config.minIntervalBetweenReservations;
    const cutoffTime = new Date(
      Date.now() - confirmationTimeMinutes * 60 * 1000
    );

    // Buscar reservas pendentes que deveriam ter sido confirmadas
    const expiredPendingReservations = await Reservation.find({
      status: "pending",
      createdAt: { $lt: cutoffTime },
    });

    for (const reservation of expiredPendingReservations) {
      await approveReservation(String(reservation._id));
    }

    if (expiredPendingReservations.length > 0) {
    }
  } catch (error) {
    console.error("Erro na verificação periódica de reservas:", error);
  }
};

// Limpeza diária de mesas e reservas expiradas
export const cleanExpiredTablesAndReservations = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Buscar todas as mesas que podem ter availability expirada
    const tables = await Table.find({
      "availability.date": { $exists: true },
    });

    let expiredTablesCount = 0;
    let expiredReservationsCount = 0;

    for (const table of tables) {
      if (table.availability.length === 0) {
        continue; // Mesa já não tem availability
      }

      // Encontrar última data de availability
      const lastAvailableDate = table.availability.reduce(
        (latest, block) => (block.date > latest ? block.date : latest),
        table.availability[0].date
      );

      if (lastAvailableDate < today) {
        // Mesa expirou completamente - limpar toda availability
        await Table.findByIdAndUpdate(table._id, {
          availability: [],
          status: "expired",
        });

        // Marcar todas as reservas dessa mesa como expiradas
        const result = await Reservation.updateMany(
          {
            tableId: table._id,
            status: { $in: ["pending", "confirmed"] },
          },
          { status: "expired" }
        );

        expiredTablesCount++;
        expiredReservationsCount += result.modifiedCount;

      } else {
        // Mesa ainda válida - limpar apenas datas passadas
        const validAvailability = table.availability.filter(
          (block) => block.date >= today
        );

        if (validAvailability.length !== table.availability.length) {
          await Table.findByIdAndUpdate(table._id, {
            availability: validAvailability,
          });
        }
      }
    }

    // Marcar reservas passadas como expiradas (independente das mesas)
    const pastReservationsResult = await Reservation.updateMany(
      {
        date: { $lt: today },
        status: { $in: ["pending", "confirmed"] },
      },
      { status: "expired" }
    );

    expiredReservationsCount += pastReservationsResult.modifiedCount;

  } catch (error) {
    console.error("Erro na limpeza diária de mesas e reservas:", error);
  }
};

// Iniciar verificação periódica (a cada 30 segundos)
export const startPeriodicCheck = () => {
  setInterval(checkPendingReservations, 30 * 1000);
};

// Iniciar limpeza diária (todo dia às 00:01)
export const startDailyCleanup = () => {
  // Calcular tempo até próxima meia-noite + 1 minuto
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 1, 0, 0); // 00:01:00

  const timeUntilMidnight = tomorrow.getTime() - now.getTime();

  // Executar primeira limpeza após tempo calculado
  setTimeout(() => {
    cleanExpiredTablesAndReservations();

    // Depois executar diariamente (24 horas)
    setInterval(cleanExpiredTablesAndReservations, 24 * 60 * 60 * 1000);
  }, timeUntilMidnight);

};

export const scheduleAutoApproval = async (reservationId: string) => {
  try {
    // Buscar configuração atual para obter o tempo de confirmação
    const config = await Config.findOne().sort({ updatedAt: -1 });

    // Se a configuração de tempo de confirmação estiver desabilitada, aprovar imediatamente
    if (!config || !config.isIntervalEnabled) {
      await approveReservation(reservationId);
      return;
    }

    const confirmationTimeMinutes = config.minIntervalBetweenReservations;

    // Buscar a reserva para verificar se existe e está pendente
    const reservation = await Reservation.findById(reservationId);
    if (!reservation || reservation.status !== "pending") {
      return;
    }

    // Agenda a aprovação automática após o tempo configurado
    setTimeout(async () => {
      await approveReservation(reservationId);
    }, confirmationTimeMinutes * 60 * 1000); // Converte minutos para milissegundos

  } catch (error) {
    console.error("Erro ao agendar aprovação automática:", error);
  }
};

// Função auxiliar para aprovar uma reserva
const approveReservation = async (reservationId: string) => {
  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      console.error(
        `Reserva ${reservationId} não encontrada para aprovação automática`
      );
      return;
    }

    // Só aprova se ainda estiver pendente
    if (reservation.status === "pending") {
      reservation.status = "confirmed";
      await reservation.save();

      // Atualizar status da mesa com a nova lógica (apenas se TODOS os horários estão ocupados)
      const { updateTableStatus } = await import(
        "../controllers/reservationController"
      );
      await updateTableStatus(reservation.tableId.toString());

    } else {
    }
  } catch (error) {
    console.error(
      `Erro ao aprovar reserva ${reservationId} automaticamente:`,
      error
    );
  }
};
