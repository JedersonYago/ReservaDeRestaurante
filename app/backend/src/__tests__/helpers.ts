import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Table from '../models/Table';
import Reservation from '../models/Reservation';
import { generateTokenPair } from '../utils/jwt';

/**
 * Helpers para criação de dados de teste
 */
export class TestDataFactory {
  /**
   * Cria um usuário de teste
   */
  static async createUser(data: Partial<IUser> = {}): Promise<IUser> {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123!',
      role: 'client' as const,
    };

    const userData = { ...defaultUser, ...data };
    return await User.create(userData);
  }

  /**
   * Cria um administrador de teste
   */
  static async createAdmin(data: Partial<IUser> = {}): Promise<IUser> {
    return await this.createUser({
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      role: 'admin',
      ...data,
    });
  }

  /**
   * Cria uma mesa de teste
   */
  static async createTable(data: any = {}) {
    const defaultTable = {
      name: 'Mesa Test',
      capacity: 4,
      availability: [
        {
          date: '2025-07-25',
          times: ['18:00', '19:00', '20:00', '21:00']
        },
        {
          date: '2025-07-26',
          times: ['18:00', '19:00', '20:00', '21:00']
        }
      ],
    };

    const tableData = { ...defaultTable, ...data };
    return await Table.create(tableData);
  }

  /**
   * Cria uma reserva de teste
   */
  static async createReservation(data: any = {}) {
    let user, table;

    if (!data.userId) {
      user = await this.createUser();
      data.userId = user._id;
    }

    if (!data.tableId) {
      table = await this.createTable();
      data.tableId = table._id;
    }

    const defaultReservation = {
      date: '2025-07-25',
      time: '19:00',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      status: 'pending',
      ...data,
    };

    return await Reservation.create(defaultReservation);
  }

  /**
   * Gera tokens de autenticação para um usuário
   */
  static generateAuthTokens(user: IUser) {
    return generateTokenPair(user);
  }
}

/**
 * Mock helpers para Express Request/Response
 */
export class MockHelpers {
  /**
   * Cria um mock de Request
   */
  static mockRequest(data: any = {}): Partial<Request> {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: undefined,
      ...data,
    };
  }

  /**
   * Cria um mock de Response
   */
  static mockResponse(): Partial<Response> {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  }

  /**
   * Cria um mock de Request autenticado
   */
  static mockAuthenticatedRequest(user: IUser, data: any = {}): Partial<Request> {
    return this.mockRequest({
      user,
      headers: {
        authorization: `Bearer fake-token`,
        ...data.headers,
      },
      ...data,
    });
  }
}

/**
 * Helpers para validação em testes
 */
export class TestValidators {
  /**
   * Verifica se um objeto é um ObjectId válido do MongoDB
   */
  static isValidObjectId(id: any): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Verifica se uma data está no formato correto
   */
  static isValidDate(date: any): boolean {
    return !isNaN(Date.parse(date));
  }

  /**
   * Verifica se um token JWT tem estrutura válida
   */
  static isValidJWT(token: any): boolean {
    if (typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Verifica estrutura de resposta de erro
   */
  static hasErrorStructure(response: any): boolean {
    return (
      response &&
      typeof response.message === 'string' &&
      (response.errors === undefined || Array.isArray(response.errors))
    );
  }
}

/**
 * Helpers para limpeza de dados
 */
export class TestCleanup {
  /**
   * Remove todos os usuários de teste
   */
  static async clearUsers(): Promise<void> {
    await User.deleteMany({});
  }

  /**
   * Remove todas as mesas de teste
   */
  static async clearTables(): Promise<void> {
    await Table.deleteMany({});
  }

  /**
   * Remove todas as reservas de teste
   */
  static async clearReservations(): Promise<void> {
    await Reservation.deleteMany({});
  }

  /**
   * Limpa todos os dados de teste
   */
  static async clearAll(): Promise<void> {
    await Promise.all([
      this.clearUsers(),
      this.clearTables(),
      this.clearReservations(),
    ]);
  }
}
