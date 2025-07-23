import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

(async () => {
  try {
    const mongod = await MongoMemoryServer.create({
      binary: { version: '7.0.0' },
      instance: { dbName: 'test-connection' },
    });
    const uri = mongod.getUri();
    console.log('MongoMemoryServer URI:', uri);
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Mongoose connected:', mongoose.connection.readyState);
    await mongoose.disconnect();
    await mongod.stop();
    console.log('Test completed successfully.');
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  }
})();
