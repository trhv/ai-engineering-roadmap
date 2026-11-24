import { createServer } from "./server.js";
import { env } from "./config/env.js";
import { logger } from "./services/logger.service.js";

const app = createServer();

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      env: env.NODE_ENV,
      defaultModel: env.DEFAULT_MODEL,
    },
    `🚀 LLM Application Boundary Service running at http://localhost:${env.PORT}`
  );
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info({ signal }, "Received shutdown signal. Closing server...");
  server.close(() => {
    logger.info("Server closed gracefully. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced process shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
