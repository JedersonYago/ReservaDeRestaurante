import Reservation from "../models/Reservation";
import Table from "../models/Table";
import Config from "../models/Config";
import { AUTO_APPROVAL_MINUTES } from "../config/constants";
import { format } from "date-fns";
import { logger } from "../utils/logger";

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
      logger.debug(
        `${expiredPendingReservations.length} reservas confirmadas automaticamente`
      );
    }
  } catch (error) {
    console.error("Erro na verificação periódica de reservas:", error);
  }
};

// Limpeza diária de mesas e reservas expiradas
export const cleanExpiredTablesAndReservations = async () => {
  try {
    // Usar format do date-fns para garantir formato correto
    const today = format(new Date(), "yyyy-MM-dd");

    logger.debug(
      `Iniciando limpeza para data: ${today}`
    );

    // Buscar todas as mesas que podem ter availability expirada
    const tables = await Table.find({
      "availability.date": { $exists: true },
    });

    let expiredTablesCount = 0;
    let expiredReservationsCount = 0;

    // Debug apenas se houver mesas para verificar
    if (tables.length > 0) {
      logger.debug(`Verificando ${tables.length} mesas`);
    }

    for (const table of tables) {
      if (table.availability.length === 0) {
        continue; // Mesa já não tem availability
      }

      // Encontrar última data de availability
      const lastAvailableDate = table.availability.reduce(
        (latest, block) => (block.date > latest ? block.date : latest),
        table.availability[0].date
      );

      logger.debug(
        `[cleanExpiredTablesAndReservations] Mesa ${table.name}: última data = ${lastAvailableDate}, hoje = ${today}`
      );

      // Usar comparação de strings mais robusta
      if (lastAvailableDate < today) {
        logger.debug(
          `[cleanExpiredTablesAndReservations] Mesa ${table.name} expirada, atualizando status`
        );

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

        logger.debug(
          `[cleanExpiredTablesAndReservations] Mesa ${table.name} expirada: ${result.modifiedCount} reservas atualizadas`
        );
      } else {
        // Mesa ainda válida - limpar apenas datas passadas
        const validAvailability = table.availability.filter(
          (block) => block.date >= today
        );

        if (validAvailability.length !== table.availability.length) {
          logger.debug(
            `[cleanExpiredTablesAndReservations] Mesa ${table.name}: removendo datas passadas`
          );

          await Table.findByIdAndUpdate(table._id, {
            availability: validAvailability,
          });
        }
      }
    }

    // Marcar reservas passadas como expiradas (independente das mesas)
    logger.debug(
      `[cleanExpiredTablesAndReservations] Verificando reservas passadas antes de ${today}`
    );

    const pastReservationsResult = await Reservation.updateMany(
      {
        date: { $lt: today },
        status: { $in: ["pending", "confirmed"] },
      },
      { status: "expired" }
    );

    expiredReservationsCount += pastReservationsResult.modifiedCount;

    // Só mostrar resumo se houver limpeza
    if (expiredTablesCount > 0 || expiredReservationsCount > 0) {
      logger.debug(`Limpeza concluída: ${expiredTablesCount} mesas, ${expiredReservationsCount} reservas expiradas`);
    }
  } catch (error) {
    console.error("Erro na limpeza diária de mesas e reservas:", error);
  }
};

// Iniciar verificação periódica (a cada 30 segundos)
export const startPeriodicCheck = () => {
  logger.debug(
    "[startPeriodicCheck] Iniciando verificação periódica de reservas"
  );
  setInterval(checkPendingReservations, 30 * 1000);
};

// Iniciar limpeza diária (todo dia às 00:01)
export const startDailyCleanup = () => {
  logger.debug("Configurando limpeza diária");

  // Calcular tempo até próxima meia-noite + 1 minuto
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 1, 0, 0); // 00:01:00

  const timeUntilMidnight = tomorrow.getTime() - now.getTime();

  logger.debug(
    `Próxima limpeza em: ${Math.round(
      timeUntilMidnight / 1000 / 60
    )} minutos`
  );

  // Executar primeira limpeza após tempo calculado
  setTimeout(() => {
    logger.debug("[startDailyCleanup] Executando primeira limpeza");
    cleanExpiredTablesAndReservations();

    // Depois executar diariamente (24 horas)
    setInterval(() => {
      logger.debug("[startDailyCleanup] Executando limpeza diária programada");
      cleanExpiredTablesAndReservations();
    }, 24 * 60 * 60 * 1000);
  }, timeUntilMidnight);

  // ADICIONAR: Executar limpeza imediatamente na inicialização se necessário
  // Isso garante que dados já expirados sejam limpos imediatamente
  logger.debug("[startDailyCleanup] Executando limpeza inicial");
  cleanExpiredTablesAndReservations();
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

    logger.debug(
      `[scheduleAutoApproval] Agendando aprovação da reserva ${reservationId} em ${confirmationTimeMinutes} minutos`
    );

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

      logger.debug(
        `[approveReservation] Reserva ${reservationId} aprovada automaticamente`
      );

      // Atualizar status da mesa com a nova lógica (apenas se TODOS os horários estão ocupados)
      const { updateTableStatus } = await import(
        "../controllers/reservationController"
      );
      await updateTableStatus(reservation.tableId.toString());
    } else {
      logger.debug(
        `[approveReservation] Reserva ${reservationId} já não está pendente (status: ${reservation.status})`
      );
    }
  } catch (error) {
    console.error(
      `Erro ao aprovar reserva ${reservationId} automaticamente:`,
      error
    );
  }
};
