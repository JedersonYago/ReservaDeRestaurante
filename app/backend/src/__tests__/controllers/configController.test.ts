import request from 'supertest';
import express from 'express';
import configRoutes from '../../routes/configRoutes';
import { TestDataFactory, TestCleanup } from '../helpers';
import Config from '../../models/Config';

describe('Config Controller', () => {
  const app = express();
  app.use(express.json());
  app.use('/config', configRoutes);

  let admin: any;
  let adminToken: string;
  let user: any;
  let userToken: string;

  beforeEach(async () => {
    await TestCleanup.clearAll();
    admin = await TestDataFactory.createUser({ role: 'admin', email: 'admin_config@admin.com', username: 'admin_config' });
    adminToken = TestDataFactory.generateAuthTokens(admin).accessToken;
    user = await TestDataFactory.createUser({ email: 'user_config@user.com', username: 'user_config' });
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it('deve permitir que admin atualize configurações válidas', async () => {
    // Payload totalmente válido conforme schema e limites
    const payload = {
      maxReservationsPerUser: 5,
      reservationLimitHours: 24,
      minIntervalBetweenReservations: 10,
      openingHour: '11:00',
      closingHour: '23:00',
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true
    };
    const res = await request(app)
      .put('/config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(200);
    expect(res.body).toMatchObject(payload);
    expect(res.body).toHaveProperty('_id');
  });

  it('deve negar atualização de configuração para usuário comum', async () => {
    const payload = {
      maxReservationsPerUser: 8,
      reservationLimitHours: 24,
      minIntervalBetweenReservations: 10,
      openingHour: '11:00',
      closingHour: '23:00',
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true
    };
    await request(app)
      .put('/config')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload)
      .expect(403);
  });

  it('deve negar atualização sem autenticação', async () => {
    await request(app)
      .put('/config')
      .send({})
      .expect(401);
  });

  it('deve negar atualização com dados inválidos', async () => {
    const payload = {
      maxReservationsPerUser: 0, // inválido
      reservationLimitHours: 9999, // inválido
      minIntervalBetweenReservations: -1, // inválido
      openingHour: '25:00', // inválido
      closingHour: '10:00', // inválido
      isReservationLimitEnabled: true,
      isIntervalEnabled: true,
      isOpeningHoursEnabled: true
    };
    const res = await request(app)
      .put('/config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(400);
    // Aceita formato de erro do Zod
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('deve permitir admin consultar configuração atual', async () => {
    const res = await request(app)
      .get('/config')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('maxReservationsPerUser');
    expect(res.body).toHaveProperty('openingHour');
  });

  it('deve negar consulta de configuração para usuário comum', async () => {
    await request(app)
      .get('/config')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('deve permitir consulta pública das configurações não sensíveis', async () => {
    const res = await request(app)
      .get('/config/public')
      .expect(200);
    expect(res.body).toHaveProperty('openingHour');
    expect(res.body).toHaveProperty('closingHour');
    expect(res.body).toHaveProperty('isOpeningHoursEnabled');
    expect(res.body).not.toHaveProperty('maxReservationsPerUser');
  });

  it('deve permitir admin consultar histórico de configurações', async () => {
    const res = await request(app)
      .get('/config/history')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
