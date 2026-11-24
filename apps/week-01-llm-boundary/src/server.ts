import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./services/logger.service.js";
import { llmService } from "./services/llm.service.js";
import { generateRequestSchema } from "./schemas/prompt.schema.js";
import { AppError, ValidationError } from "./errors/app-error.js";
import { ZodError } from "zod";

export function createServer() {
  const app = express();

  // Middleware: Request ID
  app.use((req: Request, res: Response, next: NextFunction) => {
    const headerId = req.headers["x-request-id"];
    const requestId = (typeof headerId === "string" && headerId) ? headerId : uuidv4();
    req.id = requestId;
    res.setHeader("X-Request-Id", requestId);
    next();
  });

  // Middleware: HTTP Logging with Pino
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
      genReqId: (req) => (req as any).id,
    })
  );

  // Body parser
  app.use(express.json({ limit: "1mb" }));

  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      defaultModel: env.DEFAULT_MODEL,
    });
  });

  // LLM Generation endpoint
  app.post("/v1/chat/generate", async (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).id as string;

    try {
      // Validate input schema
      const parseResult = generateRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError("Invalid request payload", parseResult.error.format());
      }

      const response = await llmService.generate(parseResult.data, requestId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  // Centralized Error Handler
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const requestId = ((req as any).id as string) || uuidv4();

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message,
          requestId,
          details: err.details,
        },
      });
    }

    if (err instanceof ZodError) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          requestId,
          details: err.format(),
        },
      });
    }

    // Unhandled / Internal Server Error
    req.log?.error({ err, requestId }, "Unhandled internal server error");
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal server error occurred",
        requestId,
      },
    });
  });

  return app;
}
