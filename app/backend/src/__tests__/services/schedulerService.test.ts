import * as schedulerService from '../../services/schedulerService';
import Reservation from '../../models/Reservation';
import Table from '../../models/Table';
import Config from '../../models/Config';
import { logger } from '../../utils/logger';

describe('schedulerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkPendingReservations', () => {
    it('não faz nada se confirmação automática estiver desabilitada', async () => {
      jest.spyOn(Config, 'findOne').mockReturnValue({
        sort: () => Promise.resolve(null)
      } as any);
      // Não deve chamar Reservation.find
      const findSpy = jest.spyOn(Reservation, 'find');
      await schedulerService.checkPendingReservations();
      expect(findSpy).not.toHaveBeenCalled();
    });

    it('aprova reservas pendentes expiradas', async () => {
      jest.spyOn(Config, 'findOne').mockReturnValue({
        sort: () => Promise.resolve({ isIntervalEnabled: true, minIntervalBetweenReservations: 10 })
      } as any);
      const approveMock = jest.fn();
      // Mock dynamic import de updateTableStatus
      jest.mock('../../controllers/reservationController', () => ({
        updateTableStatus: jest.fn(),
      }));
      // Mock Reservation.findById e save
      jest.spyOn(Reservation, 'find').mockResolvedValue([
        { _id: '1' },
        { _id: '2' }
      ] as any);
      jest.spyOn(Reservation, 'findById').mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: 'pending',
          save: approveMock,
          tableId: 't1',
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.checkPendingReservations();
      expect(approveMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('cleanExpiredTablesAndReservations', () => {
    it('limpa mesas e reservas expiradas corretamente', async () => {
      jest.spyOn(Table, 'find').mockResolvedValue([
        { _id: 't1', name: 'Mesa 1', availability: [{ date: '2024-01-01' }] }
      ] as any);
      jest.spyOn(Reservation, 'updateMany').mockResolvedValue({
        acknowledged: true,
        matchedCount: 2,
        modifiedCount: 2,
        upsertedCount: 0,
        upsertedId: null,
      });
      jest.spyOn(Table, 'findByIdAndUpdate').mockResolvedValue({} as any);
      jest.spyOn(logger, 'debug').mockImplementation(() => {});
      await schedulerService.cleanExpiredTablesAndReservations();
      expect(Table.findByIdAndUpdate).toHaveBeenCalled();
      expect(Reservation.updateMany).toHaveBeenCalled();
    });
  });

  describe('scheduleAutoApproval', () => {
    it('aprova imediatamente se confirmação automática desabilitada', async () => {
      jest.spyOn(Config, 'findOne').mockReturnValue({
        sort: () => Promise.resolve(null)
      } as any);
      const approveMock = jest.fn();
      jest.spyOn(Reservation, 'findById').mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: 'pending',
          save: approveMock,
          tableId: 't1',
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.scheduleAutoApproval('res1');
      expect(approveMock).toHaveBeenCalled();
    });
    it('agenda aprovação automática se reserva está pendente', async () => {
      jest.spyOn(Config, 'findOne').mockReturnValue({
        sort: () => Promise.resolve({ isIntervalEnabled: true, minIntervalBetweenReservations: 1 })
      } as any);
      const approveMock = jest.fn();
      jest.spyOn(Reservation, 'findById').mockImplementation(((id: any) => {
        return Promise.resolve({
          _id: id,
          status: 'pending',
          save: approveMock,
          tableId: 't1',
        });
      }) as unknown as typeof Reservation.findById);
      await schedulerService.scheduleAutoApproval('r1');
      jest.advanceTimersByTime(60 * 1000);
      await Promise.resolve(); // Garante execução do callback do setTimeout
      expect(approveMock).toHaveBeenCalled();
    });
  });
});
