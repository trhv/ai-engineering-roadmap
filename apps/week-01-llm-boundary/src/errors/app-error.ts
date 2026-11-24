export type ErrorCode =
  | "VALIDATION_ERROR"
  | "TIMEOUT_ERROR"
  | "RATE_LIMIT_ERROR"
  | "PROVIDER_ERROR"
  | "AUTHENTICATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, code: ErrorCode, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = "Request timed out while waiting for LLM provider") {
    super(message, "TIMEOUT_ERROR", 504);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "LLM provider rate limit exceeded") {
    super(message, "RATE_LIMIT_ERROR", 429);
  }
}

export class ProviderError extends AppError {
  constructor(message: string = "LLM provider returned an upstream error", details?: unknown) {
    super(message, "PROVIDER_ERROR", 502, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed with LLM provider") {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
}

/**
 * Normalizes any caught error into a safe AppError.
 * Ensures internal credentials, raw stack traces, and unhandled exceptions are sanitized.
 */
export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  const rawMessage = err instanceof Error ? err.message : String(err);

  // Check for timeout / abort
  if (
    rawMessage.includes("aborted") ||
    rawMessage.includes("timeout") ||
    rawMessage.includes("ETIMEDOUT")
  ) {
    return new TimeoutError("Operation timed out while communicating with the model provider.");
  }

  // Check for rate limit / 429
  if (rawMessage.includes("429") || rawMessage.toLowerCase().includes("quota") || rawMessage.toLowerCase().includes("rate limit")) {
    return new RateLimitError("Model rate limit or quota exceeded. Please retry later.");
  }

  // Check for auth / 401 / 403
  if (
    rawMessage.includes("401") ||
    rawMessage.includes("403") ||
    rawMessage.toLowerCase().includes("api key")
  ) {
    return new AuthenticationError("Invalid or missing API key for model provider.");
  }

  // General provider error
  return new ProviderError("An unexpected error occurred while communicating with the model provider.", {
    sanitizedReason: rawMessage.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]"),
  });
}
