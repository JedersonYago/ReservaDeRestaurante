import {
  applyConfigToReservation,
  generateAvailableTimeSlots,
} from "../../utils/configUtils";

describe("configUtils", () => {
  const baseConfig: any = {
    openingHour: "11:00",
    closingHour: "23:00",
    isOpeningHoursEnabled: true,
    isReservationLimitEnabled: true,
    isIntervalEnabled: true,
    minIntervalBetweenReservations: 10,
    maxReservationsPerUser: 5,
    reservationLimitHours: 24,
    updatedBy: "user",
    _id: "id",
    __v: 0,
    updatedAt: new Date(),
  };

  it("applyConfigToReservation deve aceitar reserva dentro do horário", async () => {
    const result = await applyConfigToReservation(
      baseConfig,
      "2025-07-25",
      "12:00",
      []
    );
    expect(result.isValid).toBe(true);
  });

  it("applyConfigToReservation deve rejeitar reserva antes do horário de abertura", async () => {
    const result = await applyConfigToReservation(
      baseConfig,
      "2025-07-25",
      "10:00",
      []
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/apenas a partir das/);
  });

  it("applyConfigToReservation deve rejeitar reserva após o horário de fechamento", async () => {
    const result = await applyConfigToReservation(
      baseConfig,
      "2025-07-25",
      "23:30",
      []
    );
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/encerrado/);
  });

  it("generateAvailableTimeSlots deve gerar todos horários sem reservas", () => {
    const slots = generateAvailableTimeSlots(baseConfig, "2025-07-25", []);
    expect(slots.length).toBe(24);
    expect(slots[0]).toBe("00:00");
    expect(slots[23]).toBe("23:00");
  });

  it("generateAvailableTimeSlots deve omitir horários já reservados", () => {
    const slots = generateAvailableTimeSlots(baseConfig, "2025-07-25", [
      { date: "2025-07-25", time: "12:00" },
      { date: "2025-07-25", time: "18:00" },
    ]);
    expect(slots).not.toContain("12:00");
    expect(slots).not.toContain("18:00");
  });

  it("applyConfigToReservation deve aceitar reserva quando horários de funcionamento estão desabilitados", async () => {
    const configWithoutHours = {
      ...baseConfig,
      isOpeningHoursEnabled: false,
    };

    const result = await applyConfigToReservation(
      configWithoutHours,
      "2025-07-25",
      "03:00", // Horário fora do funcionamento normal
      []
    );
    expect(result.isValid).toBe(true);
  });

  it("generateAvailableTimeSlots deve gerar horários mesmo com reservas existentes em outras datas", () => {
    const slots = generateAvailableTimeSlots(baseConfig, "2025-07-25", [
      { date: "2025-07-26", time: "12:00" }, // Reserva em data diferente
    ]);
    expect(slots.length).toBe(24);
    expect(slots).toContain("12:00"); // Deve incluir o horário pois a reserva é de outra data
  });
});
