import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

let mongod: MongoMemoryServer;

export default async function globalSetup() {
  // Configurar MongoDB Memory Server
  mongod = await MongoMemoryServer.create({
    binary: {
      version: "7.0.0",
    },
    instance: {
      dbName: "reservafacil-test",
    },
  });

  const uri = mongod.getUri();

  // Persistir URI em arquivo para uso nos testes
  const uriFile = path.resolve(__dirname, "../../.test-mongo-uri");
  fs.writeFileSync(uriFile, uri, "utf-8");

  // Definir variável de ambiente para os testes (apenas para este processo)
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key-for-testing-only";
}

export { mongod };
