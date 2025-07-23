import request from 'supertest';
import express from 'express';
import profileRoutes from '../../routes/profileRoutes';
import User from '../../models/User';
import { TestDataFactory, TestCleanup } from '../helpers';

const app = express();
app.use(express.json());
app.use('/profile', profileRoutes);

describe('Profile Controller', () => {
  let user: any;
  let token: string;
  beforeEach(async () => {
    await TestCleanup.clearAll();
    user = await TestDataFactory.createUser({
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      username: 'usuarioteste',
      password: 'Senha123!'
    });
    token = TestDataFactory.generateAuthTokens(user).accessToken;
  });

  it('deve obter perfil de usuário', async () => {
    const res = await request(app)
      .get(`/profile/${user.username}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('deve atualizar o perfil do usuário', async () => {
    const res = await request(app)
      .put(`/profile/${user.username}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome', email: 'novo@teste.com', currentPassword: 'Senha123!' })
      .expect(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('name', 'Novo Nome');
    expect(res.body.user).toHaveProperty('email', 'novo@teste.com');
  });

  it('deve alterar a senha do usuário', async () => {
    const res = await request(app)
      .put(`/profile/${user.username}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'Senha123!',
        newPassword: 'NovaSenha123!',
        confirmPassword: 'NovaSenha123!'
      })
      .expect(200);
    expect(res.body).toHaveProperty('message');
  });

  it('deve excluir a conta do usuário', async () => {
    const res = await request(app)
      .delete(`/profile/${user.username}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'Senha123!',
        confirmation: 'DELETE'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    const deleted = await User.findOne({ username: user.username });
    expect(deleted).toBeNull();
  });

  it('deve rejeitar atualização por outro usuário', async () => {
    const other = await TestDataFactory.createUser({ username: 'outro', email: 'outro@teste.com' });
    const otherToken = TestDataFactory.generateAuthTokens(other).accessToken;
    await request(app)
      .put(`/profile/${user.username}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Hacker' })
      .expect(403);
  });
});
