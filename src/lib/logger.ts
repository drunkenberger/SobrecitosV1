/**
 * Centralized logging system
 * Replaces console.log with structured logging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const logData = {
        ...entry,
        ...(context && { context }),
        ...(error && { error: error.message, stack: error.stack }),
      };

      switch (level) {
        case LogLevel.DEBUG:
          console.log(`[DEBUG]`, message, logData);
          break;
        case LogLevel.INFO:
          console.info(`[INFO]`, message, logData);
          break;
        case LogLevel.WARN:
          console.warn(`[WARN]`, message, logData);
          break;
        case LogLevel.ERROR:
          console.error(`[ERROR]`, message, logData);
          break;
      }
    }

    // In production, send to analytics/monitoring service
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    // TODO: Integrate with Sentry, LogRocket, or similar
    // For now, just store in sessionStorage for debugging
    try {
      const stored = sessionStorage.getItem('error_logs') || '[]';
      const logs = JSON.parse(stored);
      logs.push(entry);
      sessionStorage.setItem('error_logs', JSON.stringify(logs.slice(-50)));
    } catch (e) {
      // Silently fail if sessionStorage is unavailable
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

// ============================================
// ERROR UTILITIES
// ============================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Authentication
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // Data
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DATA_CONFLICT: 'DATA_CONFLICT',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Cloud Storage
  CLOUD_SYNC_FAILED: 'CLOUD_SYNC_FAILED',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',

  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export function handleError(error: unknown, context?: string): AppError {
  logger.error(
    `Error in ${context || 'unknown context'}`,
    error instanceof Error ? error : new Error(String(error)),
    { context }
  );

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      500,
      false
    );
  }

  return new AppError(
    'An unexpected error occurred',
    ErrorCodes.UNKNOWN_ERROR,
    500,
    false
  );
}

// ============================================
// ASYNC ERROR WRAPPER
// ============================================

export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = handleError(error, context);
      throw appError;
    }
  }) as T;
}
