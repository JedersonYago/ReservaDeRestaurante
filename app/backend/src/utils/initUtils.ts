import Config from "../models/Config";
import { logger } from "./logger";

export async function initializeDefaultConfig() {
  try {
    logger.info("🔧 Verificando configurações padrão...");

    // Verificar se já existe alguma configuração
    const existingConfig = await Config.findOne().sort({ updatedAt: -1 });

    if (existingConfig) {
      logger.info("✅ Configurações já existem, pulando inicialização");
      return existingConfig;
    }

    logger.info("📝 Criando configurações padrão...");

    // Configurações padrão
    const defaultConfig = new Config({
      maxReservationsPerUser: 5,
      reservationLimitHours: 24,
      minIntervalBetweenReservations: 30,
      openingHour: "11:00",
      closingHour: "23:00",
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true,
      updatedBy: "system",
      updatedAt: new Date(),
    });

    await defaultConfig.save();

    logger.info("✅ Configurações padrão criadas com sucesso");
    logger.info("📋 Configurações padrão:");
    logger.info(
      `   - Horário de funcionamento: ${defaultConfig.openingHour} - ${defaultConfig.closingHour}`
    );
    logger.info(
      `   - Limite de reservas: ${defaultConfig.maxReservationsPerUser} por usuário`
    );
    logger.info(
      `   - Tempo de confirmação: ${defaultConfig.minIntervalBetweenReservations} minutos`
    );

    return defaultConfig;
  } catch (error) {
    logger.error("❌ Erro ao criar configurações padrão:", error);
    throw error;
  }
}
