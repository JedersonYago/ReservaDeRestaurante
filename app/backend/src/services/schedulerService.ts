import Reservation from "../models/Reservation";
import Config from "../models/Config";
import { updateTableStatus } from "../utils/reservationUtils";
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
      console.log(
        `🔄 Reserva ${String(
          reservation._id
        )} confirmada via verificação periódica`
      );
    }

    if (expiredPendingReservations.length > 0) {
      console.log(
        `✅ Verificação periódica: ${expiredPendingReservations.length} reservas confirmadas`
      );
    }
  } catch (error) {
    console.error("Erro na verificação periódica de reservas:", error);
  }
};

// Iniciar verificação periódica (a cada 30 segundos)
export const startPeriodicCheck = () => {
  setInterval(checkPendingReservations, 30 * 1000);
  console.log("🕐 Sistema de verificação periódica de reservas iniciado (30s)");
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
      console.log(
        `Reserva ${reservationId} não encontrada ou não está pendente`
      );
      return;
    }

    // Agenda a aprovação automática após o tempo configurado
    setTimeout(async () => {
      await approveReservation(reservationId);
    }, confirmationTimeMinutes * 60 * 1000); // Converte minutos para milissegundos

    console.log(
      `⏰ Reserva ${reservationId} agendada para confirmação automática em ${confirmationTimeMinutes} minutos`
    );
  } catch (error) {
    console.error("Erro ao agendar aprovação automática:", error);
  }
};

// Função auxiliar para aprovar uma reserva
const approveReservation = async (reservationId: string) => {
  try {
    console.log(`🔍 Verificando reserva ${reservationId} para confirmação...`);

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      console.error(
        `❌ Reserva ${reservationId} não encontrada para aprovação automática`
      );
      return;
    }

    console.log(
      `📋 Reserva ${reservationId} encontrada. Status atual: ${reservation.status}`
    );

    // Só aprova se ainda estiver pendente
    if (reservation.status === "pending") {
      reservation.status = "confirmed";
      await reservation.save();

      // Atualiza o status da mesa
      await updateTableStatus(reservation.tableId.toString(), "reserved");

      console.log(`✅ Reserva ${reservationId} confirmada automaticamente`);
    } else {
      console.log(
        `ℹ️  Reserva ${reservationId} já não está pendente. Status: ${reservation.status}`
      );
    }
  } catch (error) {
    console.error(
      `❌ Erro ao aprovar reserva ${reservationId} automaticamente:`,
      error
    );
  }
};
