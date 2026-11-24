import express, { Request, Response, NextFunction } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './services/logger.service.js';
import { TaskExtractorService } from './services/task-extractor.service.js';
import { AgentService } from './services/agent.service.js';
import { taskStore } from './storage/in-memory-task.store.js';
import { AppError } from './errors/app-errors.js';
import { env } from './config/env.js';

export const app = express();

app.use(express.json());
app.use(
  pinoHttp({
    logger,
    autoLogging: env.NODE_ENV !== 'test',
  })
);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    model: env.DEFAULT_MODEL,
    totalTasksInStore: taskStore.count(),
  });
});

// List all tasks in store
app.get('/api/tasks', (_req: Request, res: Response) => {
  res.json({
    tasks: taskStore.getAll(),
    count: taskStore.count(),
  });
});

// Extract task from unstructured text
app.post('/api/extract-task', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, model } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Field "text" (string) is required' });
      return;
    }
    const result = await TaskExtractorService.extractFromText(text, model);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Conversational Agent Chat endpoint (with tool execution)
app.post('/api/agent/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Field "prompt" (string) is required' });
      return;
    }
    const result = await AgentService.executePrompt(prompt, model);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Global error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn({ err }, `Application error: ${err.message}`);
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  logger.error({ err }, 'Unhandled server error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
    },
  });
});
