import { app } from './server.js';
import { env } from './config/env.js';
import { logger } from './services/logger.service.js';

const server = app.listen(env.PORT, () => {
  logger.info(`Server running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`Default Model: ${env.DEFAULT_MODEL}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
