import {
  validateTimeSlot,
  validateTimeInterval,
  validateTableAvailabilityOverlaps,
} from "../../utils/reservationUtils";

import Reservation from "../../models/Reservation";
import Config from "../../models/Config";
import { checkReservationLimit } from "../../utils/reservationUtils";
import { validateUserReservationLimit } from "../../controllers/reservationController";

describe("reservationUtils", () => {
  beforeAll(() => {
    jest.spyOn(Config, "findOne").mockReturnValue({
      sort: () =>
        Promise.resolve({
          minIntervalBetweenReservations: 10,
          isIntervalEnabled: true,
        }),
    } as any);
  });
  it("validateTimeSlot deve aceitar horários dentro do funcionamento", async () => {
    expect(await validateTimeSlot("11:00")).toBe(true);
    expect(await validateTimeSlot("23:00")).toBe(true);
    expect(await validateTimeSlot("10:00")).toBe(false);
    expect(await validateTimeSlot("00:00")).toBe(false);
  }, 20000);

  it("validateTimeInterval deve aceitar horários válidos", async () => {
    expect(await validateTimeInterval("11:00")).toBe(true);
    expect(await validateTimeInterval("23:59")).toBe(true);
    expect(await validateTimeInterval("24:00")).toBe(false);
    expect(await validateTimeInterval("12:60")).toBe(false);
    expect(await validateTimeInterval("99:99")).toBe(false);
  });

  it("validateTableAvailabilityOverlaps deve detectar sobreposição de horários", () => {
    const valid = [
      { date: "2025-07-22", times: ["11:00-12:00", "12:00-13:00"] },
      { date: "2025-07-23", times: ["14:00-15:00"] },
    ];
    const invalid = [
      { date: "2025-07-22", times: ["11:00-13:00", "12:00-14:00"] },
    ];
    expect(validateTableAvailabilityOverlaps(valid).isValid).toBe(true);
    const result = validateTableAvailabilityOverlaps(invalid);
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/sobrepostos/);
  });

  it("validateTableAvailabilityOverlaps deve aceitar horários sem sobreposição", () => {
    const valid = [
      { date: "2025-07-22", times: ["11:00-12:00", "13:00-14:00"] },
      { date: "2025-07-23", times: ["15:00-16:00", "17:00-18:00"] },
    ];
    const result = validateTableAvailabilityOverlaps(valid);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("validateTableAvailabilityOverlaps deve detectar sobreposição parcial", () => {
    const invalid = [
      { date: "2025-07-22", times: ["11:00-13:00", "12:30-14:00"] },
    ];
    const result = validateTableAvailabilityOverlaps(invalid);
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/sobrepostos/);
  });

  describe("checkReservationLimit", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("deve retornar true se não houver reserva para o horário/mesa", async () => {
      jest.spyOn(Reservation, "findOne").mockResolvedValue(null);
      const result = await checkReservationLimit(
        "2025-07-25",
        "19:00",
        "mesa1"
      );
      expect(result).toBe(true);
    });

    it("deve retornar false se já houver reserva para o horário/mesa", async () => {
      jest
        .spyOn(Reservation, "findOne")
        .mockResolvedValue({ _id: "res1" } as any);
      const result = await checkReservationLimit(
        "2025-07-25",
        "19:00",
        "mesa1"
      );
      expect(result).toBe(false);
    });

    it("deve retornar true se não passar tableId (modo global)", async () => {
      const result = await checkReservationLimit("2025-07-25", "19:00");
      expect(result).toBe(true);
    });
  });

  describe("validateUserReservationLimit", () => {
    it("deve permitir se não houver config", async () => {
      jest
        .spyOn(Config, "findOne")
        .mockReturnValue({ sort: () => null } as any);
      const result = await validateUserReservationLimit("user1");
      expect(result.isValid).toBe(true);
    });
    it("deve permitir se limite estiver desabilitado", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () => Promise.resolve({ isReservationLimitEnabled: false }),
      } as any);
      const result = await validateUserReservationLimit("user1");
      expect(result.isValid).toBe(true);
    });
    it("deve bloquear se usuário excedeu o limite", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isReservationLimitEnabled: true,
            reservationLimitHours: 24,
            maxReservationsPerUser: 2,
          }),
      } as any);
      jest.spyOn(Reservation, "countDocuments").mockResolvedValue(2);
      const result = await validateUserReservationLimit("user1");
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Limite de 2 reservas/);
    });
    it("deve permitir se usuário não excedeu o limite", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isReservationLimitEnabled: true,
            reservationLimitHours: 24,
            maxReservationsPerUser: 2,
          }),
      } as any);
      jest.spyOn(Reservation, "countDocuments").mockResolvedValue(1);
      const result = await validateUserReservationLimit("user1");
      expect(result.isValid).toBe(true);
    });
    it("deve retornar erro se ocorrer exceção", async () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(Config, "findOne").mockImplementation(() => {
        throw new Error("fail");
      });
      const result = await validateUserReservationLimit("user1");
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Erro ao validar limite/);
      spy.mockRestore();
    });
  });
});
