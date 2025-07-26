import {
  userSchema,
  reservationSchema,
  configSchema,
  tableSchema,
} from "@shared/validation/schemas";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "../../validations/schemas";

describe("Schemas de validação Zod", () => {
  describe("userSchema", () => {
    it("valida usuário válido", () => {
      expect(() =>
        userSchema.parse({
          name: "João",
          email: "joao@email.com",
          username: "joao_123",
          password: "Senha123!",
          confirmPassword: "Senha123!",
          role: "client",
        })
      ).not.toThrow();
    });
    it("rejeita usuário com email inválido", () => {
      expect(() =>
        userSchema.parse({
          name: "João",
          email: "email-invalido",
          username: "joao_123",
          password: "Senha123!",
          confirmPassword: "Senha123!",
          role: "client",
        })
      ).toThrow(/Email inválido/);
    });
    it("rejeita username curto", () => {
      expect(() =>
        userSchema.parse({
          name: "João",
          email: "joao@email.com",
          username: "jo",
          password: "Senha123!",
          confirmPassword: "Senha123!",
          role: "client",
        })
      ).toThrow(/mínimo 3 caracteres/);
    });
  });

  describe("loginSchema", () => {
    it("valida login válido", () => {
      expect(() =>
        loginSchema.parse({ username: "joao", password: "Senha123!" })
      ).not.toThrow();
    });
    it("rejeita login sem username", () => {
      expect(() => loginSchema.parse({ password: "Senha123!" })).toThrow(
        /Required/
      );
    });
  });

  describe("reservationSchema", () => {
    it("valida reserva válida", () => {
      expect(() =>
        reservationSchema.parse({
          date: "2025-07-25",
          time: "19:00",
          tableId: "mesa1",
          customerName: "Cliente Teste",
          customerEmail: "cliente@teste.com",
        })
      ).not.toThrow();
    });
    it("rejeita data inválida", () => {
      expect(() =>
        reservationSchema.parse({
          date: "25/07/2025",
          time: "19:00",
          tableId: "mesa1",
          customerName: "Cliente Teste",
          customerEmail: "cliente@teste.com",
        })
      ).toThrow(/YYYY-MM-DD/);
    });
  });

  describe("configSchema", () => {
    it("valida configuração válida", () => {
      expect(() =>
        configSchema.parse({
          maxReservationsPerUser: 5,
          reservationLimitHours: 24,
          minIntervalBetweenReservations: 10,
          openingHour: "11:00",
          closingHour: "23:00",
          isReservationLimitEnabled: true,
          isIntervalEnabled: true,
          isOpeningHoursEnabled: true,
        })
      ).not.toThrow();
    });
    it("rejeita maxReservationsPerUser fora do limite", () => {
      expect(() =>
        configSchema.parse({
          maxReservationsPerUser: 0,
          reservationLimitHours: 24,
          minIntervalBetweenReservations: 10,
          openingHour: "11:00",
          closingHour: "23:00",
          isReservationLimitEnabled: true,
          isIntervalEnabled: true,
          isOpeningHoursEnabled: true,
        })
      ).toThrow();
    });
  });

  describe("tableSchema", () => {
    it("valida mesa válida", () => {
      expect(() =>
        tableSchema.parse({
          name: "Mesa 1",
          capacity: 4,
          status: "available",
          availability: [
            {
              date: "2025-07-25",
              times: ["18:00-19:00"],
            },
          ],
        })
      ).not.toThrow();
    });
    it("rejeita capacidade zero", () => {
      expect(() =>
        tableSchema.parse({
          name: "Mesa 1",
          capacity: 0,
          status: "available",
          availability: [
            {
              date: "2025-07-25",
              times: ["18:00-19:00"],
            },
          ],
        })
      ).toThrow();
    });
  });

  describe("forgotPasswordSchema", () => {
    it("valida email válido", () => {
      expect(() =>
        forgotPasswordSchema.parse({ email: "a@a.com" })
      ).not.toThrow();
    });
    it("rejeita email inválido", () => {
      expect(() => forgotPasswordSchema.parse({ email: "a" })).toThrow();
    });
  });

  describe("resetPasswordSchema", () => {
    it("valida payload válido", () => {
      expect(() =>
        resetPasswordSchema.parse({
          token: "abc",
          newPassword: "Senha123!",
          confirmPassword: "Senha123!",
        })
      ).not.toThrow();
    });
    it("rejeita senha curta", () => {
      expect(() =>
        resetPasswordSchema.parse({
          token: "abc",
          newPassword: "123",
          confirmPassword: "123",
        })
      ).toThrow();
    });
  });

  describe("updateProfileSchema", () => {
    it("valida payload mínimo", () => {
      expect(() =>
        updateProfileSchema.parse({ name: "Novo Nome" })
      ).not.toThrow();
    });
    it("rejeita email inválido", () => {
      expect(() => updateProfileSchema.parse({ email: "x" })).toThrow();
    });
  });

  describe("changePasswordSchema", () => {
    it("valida payload válido", () => {
      expect(() =>
        changePasswordSchema.parse({
          currentPassword: "Senha123!",
          newPassword: "NovaSenha123!",
          confirmPassword: "NovaSenha123!",
        })
      ).not.toThrow();
    });
    it("rejeita senha nova curta", () => {
      expect(() =>
        changePasswordSchema.parse({
          currentPassword: "Senha123!",
          newPassword: "123",
          confirmPassword: "123",
        })
      ).toThrow();
    });
  });

  describe("deleteAccountSchema", () => {
    it("valida payload válido", () => {
      expect(() =>
        deleteAccountSchema.parse({
          currentPassword: "Senha123!",
          confirmation: "DELETE",
        })
      ).not.toThrow();
    });
    it("rejeita confirmação errada", () => {
      expect(() =>
        deleteAccountSchema.parse({
          currentPassword: "Senha123!",
          confirmation: "REMOVER",
        })
      ).toThrow();
    });
  });
});
