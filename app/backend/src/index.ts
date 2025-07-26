import { createApp } from "./app";
import { connectDB } from "./config/database";
import { config } from "./config";
import {
  startPeriodicCheck,
  startDailyCleanup,
} from "./services/schedulerService";

// Inicialização do servidor
const startServer = async () => {
  try {
    await connectDB();
    startPeriodicCheck();
    startDailyCleanup();
    const app = createApp();
    const server = app.listen(config.server.port, () => {});
    process.on("SIGTERM", () => {
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}
