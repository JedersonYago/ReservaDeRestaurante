import Reservation from "../models/Reservation";
import Table from "../models/Table";
import Config from "../models/Config";
import { AUTO_APPROVAL_MINUTES } from "../config/constants";
import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";
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

// Função para extrair horário final de um timeRange (ex: "19:00-20:00" -> "20:00")
const getEndTimeFromRange = (timeRange: string): string => {
  const parts = timeRange.split("-");
  return parts.length === 2 ? parts[1] : parts[0];
};

// Função para verificar se um horário já passou
const isTimePassed = (date: string, time: string): boolean => {
  const now = new Date();
  const reservationDateTime = parseISO(`${date}T${time}`);
  return isBefore(reservationDateTime, now);
};

// Função para verificar se o último horário de disponibilidade de uma mesa passou
const isTableLastTimePassed = (table: any): boolean => {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");

  // Encontrar blocos de disponibilidade para hoje
  const todayBlocks = table.availability.filter(
    (block: any) => block.date === today
  );

  if (todayBlocks.length === 0) {
    // Se não há disponibilidade para hoje, verificar se a última data já passou
    const lastAvailableDate = table.availability.reduce(
      (latest: string, block: any) =>
        block.date > latest ? block.date : latest,
      table.availability[0].date
    );
    return lastAvailableDate < today;
  }

  // Encontrar o último horário de hoje
  const lastTimeRange = todayBlocks[0].times[todayBlocks[0].times.length - 1];
  const lastEndTime = getEndTimeFromRange(lastTimeRange);

  // Verificar se o último horário já passou (adicionar 1 minuto para ser mais preciso)
  const lastEndDateTime = parseISO(`${today}T${lastEndTime}`);
  const cutoffTime = addMinutes(lastEndDateTime, 1);

  return isBefore(cutoffTime, now);
};

// Nova função de limpeza baseada em horário real
export const cleanExpiredTablesAndReservations = async () => {
  try {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const currentTime = format(now, "HH:mm");

    logger.debug(
      `[cleanExpiredTablesAndReservations] Verificando expirações - Data: ${today}, Hora: ${currentTime}`
    );

    // 1. EXPIRAR RESERVAS BASEADO NO HORÁRIO FINAL
    logger.debug(
      "[cleanExpiredTablesAndReservations] Verificando reservas expiradas por horário..."
    );

    const activeReservations = await Reservation.find({
      status: { $in: ["pending", "confirmed"] },
    }).populate("tableId");

    let expiredReservationsCount = 0;

    for (const reservation of activeReservations) {
      // Calcular horário final da reserva
      const reservationTime = reservation.time; // ex: "19:00"
      const table = reservation.tableId as any;

      if (!table) continue;

      // Encontrar o timeRange que contém este horário
      const availabilityBlock = table.availability.find(
        (block: any) => block.date === reservation.date
      );
      if (!availabilityBlock) continue;

      const timeRange = availabilityBlock.times.find((range: string) => {
        const [startTime] = range.split("-");
        return startTime === reservationTime;
      });

      if (!timeRange) continue;

      // Extrair horário final do timeRange
      const endTime = getEndTimeFromRange(timeRange);

      // Verificar se o horário final já passou
      if (isTimePassed(reservation.date, endTime)) {
        logger.debug(
          `[cleanExpiredTablesAndReservations] Reserva ${reservation._id} expirada: ${reservation.date} ${endTime}`
        );

        await Reservation.findByIdAndUpdate(reservation._id, {
          status: "expired",
        });

        expiredReservationsCount++;
      }
    }

    // 2. EXPIRAR MESAS BASEADO NO ÚLTIMO HORÁRIO DE DISPONIBILIDADE
    logger.debug(
      "[cleanExpiredTablesAndReservations] Verificando mesas expiradas por horário..."
    );

    const tables = await Table.find({
      "availability.date": { $exists: true },
      status: { $ne: "expired" }, // Só verificar mesas não expiradas
    });

    let expiredTablesCount = 0;

    for (const table of tables) {
      if (table.availability.length === 0) continue;

      // Verificar se o último horário de disponibilidade passou
      if (isTableLastTimePassed(table)) {
        logger.debug(
          `[cleanExpiredTablesAndReservations] Mesa ${table.name} expirada por horário`
        );

        // Mesa expirou - limpar toda availability e marcar como expired
        await Table.findByIdAndUpdate(table._id, {
          availability: [],
          status: "expired",
        });

        // Marcar todas as reservas ativas dessa mesa como expiradas
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
        // Mesa ainda válida - limpar apenas horários passados
        const updatedAvailability = table.availability
          .map((block: any) => {
            if (block.date < today) {
              return null; // Remover blocos de datas passadas
            }

            if (block.date === today) {
              // Para hoje, filtrar apenas horários que ainda não passaram
              const validTimes = block.times.filter((timeRange: string) => {
                const endTime = getEndTimeFromRange(timeRange);
                return !isTimePassed(block.date, endTime);
              });

              return validTimes.length > 0
                ? { ...block, times: validTimes }
                : null;
            }

            return block; // Manter blocos futuros
          })
          .filter(Boolean); // Remover nulls

        if (updatedAvailability.length !== table.availability.length) {
          logger.debug(
            `[cleanExpiredTablesAndReservations] Mesa ${table.name}: removendo horários passados`
          );

          await Table.findByIdAndUpdate(table._id, {
            availability: updatedAvailability,
          });
        }
      }
    }

    // 3. LIMPEZA DE RESERVAS DE DATAS PASSADAS (fallback)
    logger.debug(
      "[cleanExpiredTablesAndReservations] Verificando reservas de datas passadas..."
    );

    const pastReservationsResult = await Reservation.updateMany(
      {
        date: { $lt: today },
        status: { $in: ["pending", "confirmed"] },
      },
      { status: "expired" }
    );

    expiredReservationsCount += pastReservationsResult.modifiedCount;

    // Log do resumo
    if (expiredTablesCount > 0 || expiredReservationsCount > 0) {
      logger.debug(
        `[cleanExpiredTablesAndReservations] Limpeza concluída: ${expiredTablesCount} mesas, ${expiredReservationsCount} reservas expiradas`
      );
    } else {
      logger.debug(
        "[cleanExpiredTablesAndReservations] Nenhuma expiração encontrada"
      );
    }
  } catch (error) {
    console.error("Erro na limpeza de mesas e reservas expiradas:", error);
  }
};

// Iniciar verificação periódica (a cada 30 segundos para reservas pendentes)
export const startPeriodicCheck = () => {
  logger.debug(
    "[startPeriodicCheck] Iniciando verificação periódica de reservas pendentes"
  );
  setInterval(checkPendingReservations, 30 * 1000);
};

// Iniciar verificação de expiração baseada em horário (a cada 1 minuto)
export const startExpirationCheck = () => {
  logger.debug(
    "[startExpirationCheck] Iniciando verificação de expiração por horário"
  );

  // Executar imediatamente na inicialização
  cleanExpiredTablesAndReservations();

  // Depois executar a cada 1 minuto
  setInterval(() => {
    logger.debug("[startExpirationCheck] Executando verificação de expiração");
    cleanExpiredTablesAndReservations();
  }, 1 * 60 * 1000); // 1 minuto
};

// Função legada para compatibilidade (mantida para não quebrar código existente)
export const startDailyCleanup = () => {
  logger.debug(
    "[startDailyCleanup] Função legada - usando startExpirationCheck"
  );
  startExpirationCheck();
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
