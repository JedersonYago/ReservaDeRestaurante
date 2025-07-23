import request from 'supertest';
import express from 'express';
import tableRoutes from '../../routes/tableRoutes';
import Table from '../../models/Table';
import { TestDataFactory, TestCleanup } from '../helpers';


const app = express();
app.use(express.json());
app.use('/tables', tableRoutes);

// Utilitário para obter token de admin para autenticação
async function getAdminToken() {
  const adminUser = await TestDataFactory.createUser({
    role: 'admin',
    username: 'adminuser',
    email: 'admin@admin.com',
    password: 'Admin123!'
  });
  const tokens = TestDataFactory.generateAuthTokens(adminUser);
  return tokens.accessToken;
}


describe('Table Controller', () => {
  let userToken: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    // Cria usuário comum para autenticação nas rotas protegidas
    const user = await TestDataFactory.createUser();
    userToken = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  describe('GET /tables', () => {
    it('deve listar todas as mesas', async () => {
      const avail = [{ date: '2025-07-22', times: ['18:00', '19:00'] }];
      await TestDataFactory.createTable({ name: 'Mesa 1', capacity: 2, availability: avail });
      await TestDataFactory.createTable({ name: 'Mesa 2', capacity: 2, availability: avail });
      const response = await request(app)
        .get('/tables')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /tables/:id', () => {
    it('deve retornar uma mesa pelo id', async () => {
      const avail = [{ date: '2025-07-22', times: ['18:00', '19:00'] }];
      const table = await TestDataFactory.createTable({ name: 'Mesa Teste', capacity: 2, availability: avail });
      const response = await request(app)
        .get(`/tables/${table._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      expect(response.body).toHaveProperty('_id', String(table._id));
      expect(response.body).toHaveProperty('name', 'Mesa Teste');
    });
    it('deve retornar 404 para mesa não existente', async () => {
      const response = await request(app)
        .get('/tables/000000000000000000000000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('POST /tables', () => {
    it('deve criar uma nova mesa (admin)', async () => {
      const adminToken = await getAdminToken();
      const tableData = {
        name: 'Mesa Nova',
        capacity: 4,
        availability: [
          { date: '2025-07-22', times: ['18:00-20:00'] }
        ]
      };
      const response = await request(app)
        .post('/tables')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tableData)
        .expect(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Mesa Nova');
      expect(response.body.capacity).toBe(4);
    });
    it('deve negar criação sem token de admin', async () => {
      const tableData = {
        name: 'Mesa Sem Admin',
        capacity: 2,
        availability: [
          { date: '2025-07-22', times: ['18:00-20:00'] }
        ]
      };
      await request(app)
        .post('/tables')
        .send(tableData)
        .expect(401);
    });
  });

  describe('PUT /tables/:id', () => {
    it('deve atualizar uma mesa (admin)', async () => {
      const adminToken = await getAdminToken();
      const table = await TestDataFactory.createTable({ name: 'Mesa Editar', capacity: 2, availability: [ { date: '2025-07-22', times: ['18:00-20:00'] } ] });
      const response = await request(app)
        .put(`/tables/${table._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Mesa Editada', capacity: 6, availability: [ { date: '2025-07-23', times: ['19:00-21:00'] } ] })
        .expect(200);
      expect(response.body.name).toBe('Mesa Editada');
      expect(response.body.capacity).toBe(6);
    });
    it('deve negar atualização sem token de admin', async () => {
      const table = await TestDataFactory.createTable({ name: 'Mesa Editar2', capacity: 2, availability: [ { date: '2025-07-22', times: ['18:00-20:00'] } ] });
      await request(app)
        .put(`/tables/${table._id}`)
        .send({ name: 'Mesa Editada2', capacity: 8, availability: [ { date: '2025-07-24', times: ['20:00-22:00'] } ] })
        .expect(401);
    });
  });

  describe('DELETE /tables/:id', () => {
    it('deve deletar uma mesa (admin)', async () => {
      const adminToken = await getAdminToken();
      const avail = [{ date: '2025-07-22', times: ['18:00', '19:00'] }];
      const table = await TestDataFactory.createTable({ name: 'Mesa Deletar', capacity: 2, availability: avail });
      await request(app)
        .delete(`/tables/${table._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
      const deleted = await Table.findById(table._id);
      expect(deleted).toBeNull();
    });
    it('deve negar exclusão sem token de admin', async () => {
      const avail = [{ date: '2025-07-22', times: ['18:00', '19:00'] }];
      const table = await TestDataFactory.createTable({ name: 'Mesa Deletar2', capacity: 2, availability: avail });
      await request(app)
        .delete(`/tables/${table._id}`)
        .expect(401);
    });
  });
});
