import Reservation from '../../models/Reservation';
import { TestDataFactory, TestCleanup, TestValidators } from '../helpers';

describe('Reservation Model', () => {
  let testUser: any;
  let testTable: any;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    testUser = await TestDataFactory.createUser();
    testTable = await TestDataFactory.createTable();
  });

  describe('Criação de Reserva', () => {
    it('deve criar uma reserva com dados válidos', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        customerName: 'João Silva',
        customerEmail: 'joao@example.com',
        status: 'pending',
      };

      const reservation = await Reservation.create(reservationData);

      expect(reservation).toBeDefined();
      expect(reservation.userId.toString()).toBe(testUser._id.toString());
      expect(reservation.tableId.toString()).toBe(testTable._id.toString());
      expect(reservation.date).toBe(reservationData.date);
      expect(reservation.time).toBe(reservationData.time);
      expect(reservation.customerName).toBe(reservationData.customerName);
      expect(reservation.customerEmail).toBe(reservationData.customerEmail);
      expect(reservation.status).toBe('pending');
      expect(reservation.hiddenFromUser).toBe(false);
      expect(TestValidators.isValidObjectId(reservation._id)).toBe(true);
      expect(TestValidators.isValidDate(reservation.createdAt)).toBe(true);
      expect(TestValidators.isValidDate(reservation.updatedAt)).toBe(true);
    });

    it('deve definir o status padrão como pendente', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        // status não especificado
      });

      expect(reservation.status).toBe('pending');
    });

    it('deve permitir observações vazias', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        observations: '',
      });

      expect(reservation.observations).toBe('');
    });

    it('deve permitir observações com texto', async () => {
      const observations = 'Mesa próxima à janela, aniversário';
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        observations,
      });

      expect(reservation.observations).toBe(observations);
    });
  });

  describe('Validação de Reserva', () => {
    it('deve exigir o campo userId', async () => {
      const reservationData = {
        // userId ausente
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve exigir o campo tableId', async () => {
      const reservationData = {
        userId: testUser._id,
        // tableId ausente
        date: '2025-07-25',
        time: '19:00',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve exigir o campo date', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        // date ausente
        time: '19:00',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve exigir o campo time', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        // time ausente
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve exigir o campo customerName', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        // customerName ausente
        customerEmail: 'test@example.com',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve exigir o campo customerEmail', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        customerName: 'Test Customer',
        // customerEmail ausente
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });

    it('deve validar valores de status válidos', async () => {
      const validStatuses = ['pending', 'confirmed', 'cancelled'];
      
      for (let i = 0; i < validStatuses.length; i++) {
        const status = validStatuses[i];
        const reservation = await TestDataFactory.createReservation({
          userId: testUser._id,
          tableId: testTable._id,
          status,
          time: `${19 + i}:00`, // Horários únicos para evitar conflito no índice único
        });
        expect(reservation.status).toBe(status);
      }
    });

    it('deve rejeitar valores de status inválidos', async () => {
      const reservationData = {
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        status: 'invalid-status',
      };

      await expect(Reservation.create(reservationData)).rejects.toThrow();
    });
  });

  describe('Regras de Negócio de Reserva', () => {
    it('deve permitir a criação de reservas válidas', async () => {
      const validReservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        customerName: 'Valid Customer',
        customerEmail: 'valid@example.com',
      });

      expect(validReservation.customerName).toBe('Valid Customer');
      expect(validReservation.customerEmail).toBe('valid@example.com');
    });

    it('deve permitir transições de status: pending -> confirmed', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        status: 'pending',
      });

      reservation.status = 'confirmed';
      await reservation.save();

      expect(reservation.status).toBe('confirmed');
    });

    it('deve permitir transições de status: pending -> cancelled', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        status: 'pending',
      });

      reservation.status = 'cancelled';
      await reservation.save();

      expect(reservation.status).toBe('cancelled');
    });

    it('deve permitir transições de status: confirmed -> cancelled', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        status: 'confirmed',
      });

      reservation.status = 'cancelled';
      await reservation.save();

      expect(reservation.status).toBe('cancelled');
    });
  });

  describe('Consultas de Reserva', () => {
    beforeEach(async () => {
      // Criar algumas reservas de teste
      await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '19:00',
        status: 'pending',
        customerName: 'Pending Reservation',
      });

      await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-25',
        time: '20:00',
        status: 'confirmed',
        customerName: 'Confirmed Reservation',
      });

      await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
        date: '2025-07-26',
        time: '19:00',
        status: 'cancelled',
        customerName: 'Cancelled Reservation',
      });
    });

    it('deve encontrar reservas por usuário', async () => {
      const userReservations = await Reservation.find({ userId: testUser._id });
      expect(userReservations).toHaveLength(3);
    });

    it('deve encontrar reservas por mesa', async () => {
      const tableReservations = await Reservation.find({ tableId: testTable._id });
      expect(tableReservations).toHaveLength(3);
    });

    it('deve encontrar reservas por status', async () => {
      const pendingReservations = await Reservation.find({ status: 'pending' });
      const confirmedReservations = await Reservation.find({ status: 'confirmed' });
      const cancelledReservations = await Reservation.find({ status: 'cancelled' });

      expect(pendingReservations).toHaveLength(1);
      expect(confirmedReservations).toHaveLength(1);
      expect(cancelledReservations).toHaveLength(1);
    });

    it('deve encontrar reservas por data', async () => {
      const reservationsDate25 = await Reservation.find({ date: '2025-07-25' });
      const reservationsDate26 = await Reservation.find({ date: '2025-07-26' });

      expect(reservationsDate25).toHaveLength(2);
      expect(reservationsDate26).toHaveLength(1);
    });

    it('deve encontrar reservas por data e hora', async () => {
      const specificReservations = await Reservation.find({ 
        date: '2025-07-25', 
        time: '19:00' 
      });

      expect(specificReservations).toHaveLength(1);
      expect(specificReservations[0].customerName).toBe('Pending Reservation');
    });

    it('deve encontrar reservas ativas (não canceladas)', async () => {
      const activeReservations = await Reservation.find({ 
        status: { $ne: 'cancelled' } 
      });

      expect(activeReservations).toHaveLength(2);
    });
  });

  describe('Integridade dos Dados de Reserva', () => {
    it('deve manter a integridade referencial com o Usuário', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
      });

      // Populate user data
      const populatedReservation = await Reservation.findById(reservation._id).populate('userId');
      
      expect(populatedReservation?.userId).toBeDefined();
      // @ts-ignore - userId pode ser populated
      expect(populatedReservation?.userId.username).toBe(testUser.username);
    });

    it('deve manter a integridade referencial com a Mesa', async () => {
      const reservation = await TestDataFactory.createReservation({
        userId: testUser._id,
        tableId: testTable._id,
      });

      // Populate table data
      const populatedReservation = await Reservation.findById(reservation._id).populate('tableId');
      
      expect(populatedReservation?.tableId).toBeDefined();
      // @ts-ignore - tableId pode ser populated
      expect(populatedReservation?.tableId.name).toBe(testTable.name);
    });
  });
});
