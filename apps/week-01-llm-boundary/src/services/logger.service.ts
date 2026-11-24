import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : "info",
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers['x-api-key']",
      "GOOGLE_GENERATIVE_AI_API_KEY",
      "apiKey",
      "*.apiKey",
    ],
    censor: "[REDACTED]",
  },
});

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}
