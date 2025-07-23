import mongoose from "mongoose";

export default async function globalTeardown() {
  // Fechar todas as conexões
  await mongoose.disconnect();

  // Força o exit do processo se necessário
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}
