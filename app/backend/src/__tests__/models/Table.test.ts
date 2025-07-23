import { Types } from 'mongoose';
import Table, { ITable } from '../../models/Table';
import { TestDataFactory, TestCleanup } from '../helpers';

describe('Table Model', () => {
  beforeEach(async () => {
    await TestCleanup.clearAll();
  });

  describe('Criação de Mesa', () => {
    it('deve criar uma mesa com dados válidos', async () => {
      const tableData = {
        name: 'Mesa Principal',
        capacity: 6,
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00', '20:00', '21:00']
          }
        ]
      };

      const table = await Table.create(tableData);

      expect(table._id).toBeDefined();
      expect(table.name).toBe('Mesa Principal');
      expect(table.capacity).toBe(6);
      expect(table.status).toBe('available'); // default
      expect(table.availability).toHaveLength(1);
      expect(table.availability[0].date).toBe('2025-07-25');
      expect(table.availability[0].times).toHaveLength(4);
    });

    it('deve definir o status padrão como disponível', async () => {
      const table = await TestDataFactory.createTable({
        name: 'Test Table'
      });

      expect(table.status).toBe('available');
    });

    it('deve permitir múltiplos blocos de disponibilidade', async () => {
      const table = await TestDataFactory.createTable({
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00', '20:00']
          },
          {
            date: '2025-07-26',
            times: ['18:00', '19:00', '20:00', '21:00']
          }
        ]
      });

      expect(table.availability).toHaveLength(2);
      expect(table.availability[0].date).toBe('2025-07-25');
      expect(table.availability[1].date).toBe('2025-07-26');
    });

    it('deve permitir um array de reservas vazio inicialmente', async () => {
      const table = await TestDataFactory.createTable();

      expect(table.reservations).toEqual([]);
    });
  });

  describe('Validação de Mesa', () => {
    it('deve exigir o campo name', async () => {
      const tableData = {
        // name ausente
        capacity: 4,
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00']
          }
        ]
      };

      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve exigir o campo capacity', async () => {
      const tableData = {
        name: 'Test Table',
        // capacity ausente
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00']
          }
        ]
      };

      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve exigir disponibilidade com o campo date', async () => {
      const tableData = {
        name: 'Test Table',
        capacity: 4,
        availability: [
          {
            // date ausente
            times: ['18:00', '19:00']
          }
        ]
      };

      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve rejeitar um array de horários vazio', async () => {
      const tableData = {
        name: 'Test Table',
        capacity: 4,
        availability: [
          {
            date: '2025-07-25',
            times: [] // Array vazio não é mais válido
          }
        ]
      };
      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve validar valores de enumeração de status', async () => {
      const validStatuses = ['available', 'reserved', 'maintenance', 'expired'];
      
      for (let i = 0; i < validStatuses.length; i++) {
        const status = validStatuses[i];
        const table = await TestDataFactory.createTable({ 
          status,
          name: `Status Test Table ${i + 1}` // Nome único para cada teste
        });
        expect(table.status).toBe(status);
      }
    });

    it('deve rejeitar valores de status inválidos', async () => {
      const tableData = {
        name: 'Test Table',
        capacity: 4,
        status: 'invalid-status',
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00']
          }
        ]
      };

      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve exigir nomes de mesa exclusivos', async () => {
      await TestDataFactory.createTable({ name: 'Unique Table' });

      const duplicateTableData = {
        name: 'Unique Table',
        capacity: 4,
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00']
          }
        ]
      };

      await expect(Table.create(duplicateTableData)).rejects.toThrow();
    });
  });

  describe('Regras de Negócio de Mesa', () => {
    it('deve rejeitar capacidade zero', async () => {
      const tableData = {
        name: 'Zero Capacity Table',
        capacity: 0,
        availability: [
          {
            date: '2025-07-25',
            times: ['18:00', '19:00']
          }
        ]
      };
      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve permitir a atualização do status da mesa', async () => {
      const table = await TestDataFactory.createTable({ status: 'available' });

      table.status = 'maintenance';
      await table.save();

      expect(table.status).toBe('maintenance');
    });

    it('deve permitir a adição de referências de reserva', async () => {
      const table = await TestDataFactory.createTable();
      const reservationId = new Types.ObjectId();

      table.reservations = [reservationId];
      await table.save();

      expect(table.reservations).toHaveLength(1);
      expect(table.reservations![0]).toEqual(reservationId);
    });

    it('deve permitir a atualização da disponibilidade', async () => {
      const table = await TestDataFactory.createTable();

      table.availability.push({
        date: '2025-07-27',
        times: ['19:00', '20:00', '21:00']
      });
      await table.save();

      expect(table.availability).toHaveLength(3); // 2 from factory + 1 added
      expect(table.availability[2].date).toBe('2025-07-27');
      expect(table.availability[2].times).toHaveLength(3);
    });
  });

  describe('Consultas de Mesa', () => {
    beforeEach(async () => {
      // Criar algumas mesas de teste
      await TestDataFactory.createTable({
        name: 'Mesa VIP',
        capacity: 8,
        status: 'available'
      });

      await TestDataFactory.createTable({
        name: 'Mesa Externa',
        capacity: 4,
        status: 'maintenance'
      });

      await TestDataFactory.createTable({
        name: 'Mesa Reservada',
        capacity: 6,
        status: 'reserved'
      });
    });

    it('deve encontrar mesas por status', async () => {
      const availableTables = await Table.find({ status: 'available' });
      const maintenanceTables = await Table.find({ status: 'maintenance' });
      const reservedTables = await Table.find({ status: 'reserved' });

      expect(availableTables).toHaveLength(1);
      expect(maintenanceTables).toHaveLength(1);
      expect(reservedTables).toHaveLength(1);
    });

    it('deve encontrar mesas por faixa de capacidade', async () => {
      const smallTables = await Table.find({ capacity: { $lte: 4 } });
      const largeTables = await Table.find({ capacity: { $gte: 6 } });

      expect(smallTables).toHaveLength(1);
      expect(largeTables).toHaveLength(2);
    });

    it('deve encontrar mesas por nome', async () => {
      const vipTable = await Table.findOne({ name: 'Mesa VIP' });
      
      expect(vipTable).toBeDefined();
      expect(vipTable!.name).toBe('Mesa VIP');
      expect(vipTable!.capacity).toBe(8);
    });

    it('deve encontrar mesas disponíveis (não reservadas ou em manutenção)', async () => {
      const availableTables = await Table.find({ 
        status: { $nin: ['reserved', 'maintenance'] } 
      });

      expect(availableTables).toHaveLength(1);
      expect(availableTables[0].status).toBe('available');
    });

    it('deve encontrar mesas com data de disponibilidade específica', async () => {
      const tablesAvailable25 = await Table.find({ 
        'availability.date': '2025-07-25'
      });

      expect(tablesAvailable25).toHaveLength(3); // Todas as mesas de teste têm esta data
    });

    it('deve encontrar mesas com disponibilidade de horário específica', async () => {
      const tablesWithTime1900 = await Table.find({
        'availability.times': '19:00'
      });

      expect(tablesWithTime1900).toHaveLength(3); // Todas as mesas de teste têm este horário
    });
  });

  describe('Integridade dos Dados da Mesa', () => {
    it('deve manter a consistência dos dados ao atualizar', async () => {
      const table = await TestDataFactory.createTable({
        name: 'Consistency Test',
        capacity: 4
      });

      const originalId = table._id;
      
      table.name = 'Updated Name';
      table.capacity = 6;
      await table.save();

      const updatedTable = await Table.findById(originalId);
      
      expect(updatedTable!.name).toBe('Updated Name');
      expect(updatedTable!.capacity).toBe(6);
      expect(updatedTable!._id).toEqual(originalId);
    });

    it('deve rejeitar array de disponibilidade vazio', async () => {
      const tableData = {
        name: 'Empty Availability Table',
        capacity: 4,
        availability: [] // Array vazio não é mais permitido
      };
      await expect(Table.create(tableData)).rejects.toThrow();
    });

    it('deve popular corretamente as referências de reserva', async () => {
      const table = await TestDataFactory.createTable();

      // Simulando a adição de referência de reserva
      const mockReservationId = new Types.ObjectId();
      table.reservations = [mockReservationId];
      await table.save();

      const populatedTable = await Table.findById(table._id);
      
      expect(populatedTable!.reservations).toHaveLength(1);
      expect(populatedTable!.reservations![0]).toEqual(mockReservationId);
    });
  });
});
