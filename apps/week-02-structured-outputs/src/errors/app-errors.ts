export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SchemaValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'SCHEMA_VALIDATION_ERROR', details);
  }
}

export class ToolExecutionError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, 'TOOL_EXECUTION_ERROR', details);
  }
}

export class SecurityViolationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 403, 'SECURITY_VIOLATION_BLOCKED', details);
  }
}

export class TaskExtractionError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, 'TASK_EXTRACTION_FAILED', details);
  }
}
