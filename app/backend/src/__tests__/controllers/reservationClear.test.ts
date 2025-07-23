import request from 'supertest';
import express from 'express';
import reservationRoutes from '../../routes/reservationRoutes';
import Reservation from '../../models/Reservation';
import { TestDataFactory, TestCleanup } from '../helpers';

describe('Limpar Reserva (RF13)', () => {
  const app = express();
  app.use(express.json());
  app.use('/reservations', reservationRoutes);

  let user: any;
  let token: string;
  let reservation: any;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser();
    token = TestDataFactory.generateAuthTokens(user).accessToken;
    const table = await TestDataFactory.createTable();
    reservation = await Reservation.create({
      tableId: table._id,
      customerName: 'Cliente Teste',
      customerEmail: 'cliente@teste.com',
      date: '2025-07-25',
      time: '19:00',
      status: 'cancelled',
      userId: user._id
    });
  });

  it('deve esconder reserva cancelada da visualização do cliente, mas manter para admin', async () => {
    // Cliente limpa a reserva
    const res = await request(app)
      .patch(`/reservations/${reservation._id}/clear`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('message');

    // Reserva deve estar marcada como hiddenFromUser
    const updated = await Reservation.findById(reservation._id);
    expect(updated!.hiddenFromUser).toBe(true);

    // Cliente não vê mais a reserva na listagem
    const listRes = await request(app)
      .get('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const ids = listRes.body.map((r: any) => r._id);
    expect(ids).not.toContain(reservation._id.toString());

    // Admin ainda vê a reserva
    const admin = await TestDataFactory.createUser({ role: 'admin', email: 'admin@admin.com', username: 'admin' });
    const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    const adminList = await request(app)
      .get('/reservations')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const adminIds = adminList.body.map((r: any) => r._id);
    expect(adminIds).toContain(reservation._id.toString());
  });
});
