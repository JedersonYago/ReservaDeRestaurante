import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../../routes/dashboardRoutes';
import Reservation from '../../models/Reservation';
import Table from '../../models/Table';
import { TestDataFactory, TestCleanup } from '../helpers';

describe('Dashboard Controller', () => {
  it('deve retornar contadores zerados para cliente sem reservas', async () => {
    await TestCleanup.clearAll();
    const user = await TestDataFactory.createUser();
    const userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    const res = await request(app)
      .get('/dashboard/client')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(res.body.personal).toMatchObject({
      totalReservations: 0,
      confirmedReservations: 0,
      cancelledReservations: 0
    });
    expect(Array.isArray(res.body.personal.upcomingReservations)).toBe(true);
    expect(res.body.personal.upcomingReservations.length).toBe(0);
  });

  it('deve negar acesso ao dashboard do admin para usuário comum', async () => {
    // Garante email único
    const user = await TestDataFactory.createUser({ email: 'user_dashboard_' + Date.now() + '@test.com', username: 'user_dashboard_' + Date.now() });
    const userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    await request(app)
      .get('/dashboard/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('deve negar acesso sem token', async () => {
    await request(app)
      .get('/dashboard/client')
      .expect(401);
    await request(app)
      .get('/dashboard/admin')
      .expect(401);
  });

  it('deve retornar totais corretos para admin com múltiplos usuários e reservas', async () => {
    await TestCleanup.clearAll();
    const admin = await TestDataFactory.createUser({ role: 'admin', email: 'admin2@admin.com', username: 'admin2' });
    const adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    const user1 = await TestDataFactory.createUser({ email: 'u1@teste.com', username: 'u1' });
    const user2 = await TestDataFactory.createUser({ email: 'u2@teste.com', username: 'u2' });
    const table = await TestDataFactory.createTable();
    await Reservation.create({ tableId: table._id, customerName: 'A', customerEmail: 'a@a.com', date: '2025-07-25', time: '19:00', status: 'confirmed', userId: user1._id });
    await Reservation.create({ tableId: table._id, customerName: 'B', customerEmail: 'b@b.com', date: '2025-07-26', time: '20:00', status: 'cancelled', userId: user2._id });
    await Reservation.create({ tableId: table._id, customerName: 'C', customerEmail: 'c@c.com', date: '2025-07-27', time: '21:00', status: 'pending', userId: user2._id });
    const res = await request(app)
      .get('/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body.overview.totalReservations).toBe(3);
    expect(res.body.reservationsByStatus.confirmed).toBe(1);
    expect(res.body.reservationsByStatus.cancelled).toBe(1);
    expect(res.body.reservationsByStatus.pending).toBe(1);
    expect(res.body.tables.total).toBe(1);
    expect(res.body.overview.uniqueClients).toBeGreaterThanOrEqual(2);
  });
  const app = express();
  app.use(express.json());
  app.use('/dashboard', dashboardRoutes);

  let user: any;
  let userToken: string;
  let admin: any;
  let adminToken: string;
  let table: any;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser();
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
    admin = await TestDataFactory.createUser({ role: 'admin', email: 'admin@admin.com', username: 'admin' });
    adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    table = await TestDataFactory.createTable();
    // Cria reservas para o usuário
    await Reservation.create({
      tableId: table._id,
      customerName: 'Cliente Teste',
      customerEmail: 'cliente@teste.com',
      date: '2025-07-25',
      time: '19:00',
      status: 'confirmed',
      userId: user._id
    });
    await Reservation.create({
      tableId: table._id,
      customerName: 'Cliente Teste',
      customerEmail: 'cliente@teste.com',
      date: '2025-07-26',
      time: '20:00',
      status: 'cancelled',
      userId: user._id
    });
  });

  it('deve retornar estatísticas e próximas reservas do cliente', async () => {
    const res = await request(app)
      .get('/dashboard/client')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    // Verifica estrutura aninhada
    expect(res.body).toHaveProperty('personal');
    expect(res.body.personal).toHaveProperty('totalReservations', 2);
    expect(res.body.personal).toHaveProperty('confirmedReservations', 1);
    expect(res.body.personal).toHaveProperty('cancelledReservations', 1);
    expect(res.body.personal).toHaveProperty('upcomingReservations');
    expect(Array.isArray(res.body.personal.upcomingReservations)).toBe(true);
  });

  it('deve retornar estatísticas globais para admin', async () => {
    const res = await request(app)
      .get('/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    // overview
    expect(res.body).toHaveProperty('overview');
    expect(res.body.overview).toHaveProperty('totalReservations', 2);
    expect(res.body.overview).toHaveProperty('thisMonthReservations');
    expect(res.body.overview).toHaveProperty('todayReservations');
    expect(res.body.overview).toHaveProperty('uniqueClients');
    // reservationsByStatus
    expect(res.body).toHaveProperty('reservationsByStatus');
    expect(res.body.reservationsByStatus).toHaveProperty('confirmed', 1);
    expect(res.body.reservationsByStatus).toHaveProperty('cancelled', 1);
    expect(res.body.reservationsByStatus).toHaveProperty('pending', 0);
    // tables
    expect(res.body).toHaveProperty('tables');
    expect(res.body.tables).toHaveProperty('total', 1);
  });
});
