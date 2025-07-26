import {
  generateAvailableHours,
  isDateInRange,
  isValidReservationDate,
  isValidReservationTime,
  isTimeInRange,
  isWithinTableAvailability,
  isValidDate,
  formatTime,
} from "../../utils/dateUtils";

describe("dateUtils", () => {
  it("generateAvailableHours deve gerar intervalos de 1h das 11:00 às 22:00", () => {
    const hours = generateAvailableHours();
    expect(hours.length).toBe(12);
    expect(hours[0]).toEqual({ start: "11:00", end: "12:00" });
    expect(hours[hours.length - 1]).toEqual({ start: "22:00", end: "23:00" });
  });

  it("isDateInRange deve aceitar datas de hoje até um dia antes do limite", () => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 29); // Limite exclusivo
    expect(isDateInRange(today)).toBe(true);
    expect(isDateInRange(max)).toBe(true);
  });

  it("isDateInRange deve rejeitar datas fora do limite", () => {
    const before = new Date();
    before.setDate(before.getDate() - 1);
    const after = new Date();
    after.setDate(after.getDate() + 31);
    expect(isDateInRange(before)).toBe(false);
    expect(isDateInRange(after)).toBe(false);
  });

  it("isValidReservationDate só aceita hoje ou futuro", () => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 1);
    expect(isValidReservationDate(today.toISOString())).toBe(true);
    expect(isValidReservationDate(past.toISOString())).toBe(false);
  });

  it("isValidReservationTime só aceita entre 11:00 e 22:00", () => {
    expect(isValidReservationTime("11:00")).toBe(true);
    expect(isValidReservationTime("22:00")).toBe(true);
    expect(isValidReservationTime("10:00")).toBe(false);
    expect(isValidReservationTime("23:00")).toBe(false);
  });

  it("isTimeInRange deve validar corretamente", () => {
    expect(isTimeInRange("12:00", "11:00", "14:00")).toBe(true);
    expect(isTimeInRange("10:00", "11:00", "14:00")).toBe(false);
    expect(isTimeInRange("15:00", "11:00", "14:00")).toBe(false);
  });

  it("isWithinTableAvailability deve validar datas e horários", () => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 1);
    const to = new Date(today);
    to.setDate(today.getDate() + 1);
    expect(
      isWithinTableAvailability(
        today.toISOString(),
        "12:00",
        from.toISOString(),
        to.toISOString()
      )
    ).toBe(true);
    expect(
      isWithinTableAvailability(
        today.toISOString(),
        "10:00",
        from.toISOString(),
        to.toISOString()
      )
    ).toBe(false);
  });

  it("formatTime retorna string original ou vazia", () => {
    expect(formatTime("12:00")).toBe("12:00");
    expect(formatTime("")).toBe("");
  });

  it("isValidDate só aceita hoje até um dia antes do limite", () => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 29); // Limite exclusivo
    const before = new Date();
    before.setDate(today.getDate() - 1);
    const after = new Date();
    after.setDate(after.getDate() + 31);
    expect(isValidDate(today.toISOString())).toBe(true);
    expect(isValidDate(max.toISOString())).toBe(true);
    expect(isValidDate(before.toISOString())).toBe(false);
    expect(isValidDate(after.toISOString())).toBe(false);
  });
});
