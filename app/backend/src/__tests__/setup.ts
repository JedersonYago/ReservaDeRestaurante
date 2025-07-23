import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    binary: { version: '7.0.0' },
    instance: { dbName: 'reservafacil-test' },
  });
  const mongoUri = mongod.getUri();
  console.log('[setup.ts] MongoMemoryServer URI:', mongoUri);
  process.env.MONGODB_URI = mongoUri;
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
  mongoose.connection.on('error', (err) => {
    console.error('[setup.ts] Mongoose connection error:', err);
  });
  if (mongoose.connection.readyState === 0) {
    mongoose.set('strictQuery', false);
    try {
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('[setup.ts] Mongoose connected:', mongoose.connection.readyState);
    } catch (err) {
      console.error('[setup.ts] Mongoose connect threw:', err);
    }
  } else {
    console.log('[setup.ts] Mongoose already connected:', mongoose.connection.readyState);
  }
});

// Limpeza entre testes
beforeEach(async () => {
  // Limpar todas as collections antes de cada teste
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup após todos os testes
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    mongoose.connection.removeAllListeners();
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    console.log('🛑 MongoMemoryServer stopped');
  }
});
