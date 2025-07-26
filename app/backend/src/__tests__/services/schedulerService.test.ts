import * as schedulerService from "../../services/schedulerService";
import Config from "../../models/Config";
import Table from "../../models/Table";
import Reservation from "../../models/Reservation";
import { logger } from "../../utils/logger";

let errorSpy: jest.SpyInstance;
let warnSpy: jest.SpyInstance;
describe("schedulerService", () => {
  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("checkPendingReservations", () => {
    it("não faz nada se confirmação automática estiver desabilitada", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () => Promise.resolve(null),
      } as any);
      // Não deve chamar Reservation.find
      const findSpy = jest.spyOn(Reservation, "find");
      await schedulerService.checkPendingReservations();
      expect(findSpy).not.toHaveBeenCalled();
    });

    it("aprova reservas pendentes expiradas", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isIntervalEnabled: true,
            minIntervalBetweenReservations: 10,
          }),
      } as any);
      const approveMock = jest.fn();
      jest.mock("../../controllers/reservationController", () => ({
        updateTableStatus: jest.fn(),
      }));
      jest
        .spyOn(Reservation, "find")
        .mockResolvedValue([{ _id: "1" }, { _id: "2" }] as any);
      jest.spyOn(Reservation, "findById").mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: "pending",
          save: approveMock,
          tableId: "t1",
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.checkPendingReservations();
      expect(approveMock).toHaveBeenCalledTimes(2);
    });

    it("não lança se checkPendingReservations der erro ao buscar config", async () => {
      jest.spyOn(Config, "findOne").mockImplementation(() => {
        throw new Error("fail");
      });
      await expect(
        schedulerService.checkPendingReservations()
      ).resolves.toBeUndefined();
    });

    it("não lança se checkPendingReservations der erro ao aprovar reserva", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isIntervalEnabled: true,
            minIntervalBetweenReservations: 10,
          }),
      } as any);
      jest.spyOn(Reservation, "find").mockResolvedValue([{ _id: "1" }] as any);
      await expect(
        schedulerService.checkPendingReservations()
      ).resolves.toBeUndefined();
    });
  });

  describe("cleanExpiredTablesAndReservations", () => {
    it("limpa mesas e reservas expiradas corretamente", async () => {
      jest
        .spyOn(Table, "find")
        .mockResolvedValue([
          { _id: "t1", name: "Mesa 1", availability: [{ date: "2024-01-01" }] },
        ] as any);
      jest.spyOn(Reservation, "updateMany").mockResolvedValue({
        acknowledged: true,
        matchedCount: 2,
        modifiedCount: 2,
        upsertedCount: 0,
        upsertedId: null,
      });
      jest.spyOn(Table, "findByIdAndUpdate").mockResolvedValue({} as any);
      jest.spyOn(logger, "debug").mockImplementation(() => {});
      await schedulerService.cleanExpiredTablesAndReservations();
      expect(Table.findByIdAndUpdate).toHaveBeenCalled();
      expect(Reservation.updateMany).toHaveBeenCalled();
    });

    it("não lança se cleanExpiredTablesAndReservations der erro ao buscar mesas", async () => {
      jest.spyOn(Table, "find").mockImplementation(() => {
        throw new Error("fail");
      });
      await expect(
        schedulerService.cleanExpiredTablesAndReservations()
      ).resolves.toBeUndefined();
    });

    it("não lança se cleanExpiredTablesAndReservations der erro ao atualizar mesa", async () => {
      jest
        .spyOn(Table, "find")
        .mockResolvedValue([
          { _id: "t1", name: "Mesa 1", availability: [{ date: "2024-01-01" }] },
        ] as any);
      jest.spyOn(Table, "findByIdAndUpdate").mockImplementation(() => {
        throw new Error("fail");
      });
      jest.spyOn(Reservation, "updateMany").mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      });
      await expect(
        schedulerService.cleanExpiredTablesAndReservations()
      ).resolves.toBeUndefined();
    });
  });

  describe("scheduleAutoApproval", () => {
    it("aprova imediatamente se confirmação automática desabilitada", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () => Promise.resolve(null),
      } as any);
      const approveMock = jest.fn();
      jest.spyOn(Reservation, "findById").mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: "pending",
          save: approveMock,
          tableId: "t1",
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.scheduleAutoApproval("res1");
      expect(approveMock).toHaveBeenCalled();
    });
    it("agenda aprovação automática se reserva está pendente", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isIntervalEnabled: true,
            minIntervalBetweenReservations: 1,
          }),
      } as any);
      const approveMock = jest.fn();
      jest.spyOn(Reservation, "findById").mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: "pending",
          save: approveMock,
          tableId: "t1",
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.scheduleAutoApproval("r1");
      jest.advanceTimersByTime(60 * 1000);
      await Promise.resolve();
      expect(approveMock).toHaveBeenCalled();
    });

    it("não lança se scheduleAutoApproval der erro ao buscar config", async () => {
      jest.spyOn(Config, "findOne").mockImplementation(() => {
        throw new Error("fail");
      });
      await expect(
        schedulerService.scheduleAutoApproval("res1")
      ).resolves.toBeUndefined();
    });

    it("não lança se scheduleAutoApproval der erro ao aprovar reserva", async () => {
      jest.spyOn(Config, "findOne").mockReturnValue({
        sort: () =>
          Promise.resolve({
            isIntervalEnabled: true,
            minIntervalBetweenReservations: 1,
          }),
      } as any);
      jest.spyOn(Reservation, "findById").mockResolvedValue({
        _id: "r1",
        status: "pending",
        save: jest.fn(),
        tableId: "t1",
      });
      await expect(
        schedulerService.scheduleAutoApproval("r1")
      ).resolves.toBeUndefined();
    });
  });
});
