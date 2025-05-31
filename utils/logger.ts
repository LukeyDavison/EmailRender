type LogLevel = "debug" | "info" | "warn" | "error"

// Configure log level based on environment
const LOG_LEVEL: LogLevel = process.env.NODE_ENV === "production" ? "warn" : "debug"

// Log level priorities
const LOG_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Check if we should log based on current log level
function shouldLog(level: LogLevel): boolean {
  return LOG_PRIORITIES[level] >= LOG_PRIORITIES[LOG_LEVEL]
}

// Format the log message
function formatMessage(message: string, context?: Record<string, any>): string {
  if (!context) return message

  try {
    const contextStr = JSON.stringify(context)
    return `${message} ${contextStr}`
  } catch (e) {
    return `${message} [Context serialization failed]`
  }
}

// Logger functions
export const logger = {
  debug(message: string, context?: Record<string, any>): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage(message, context))
    }
  },

  info(message: string, context?: Record<string, any>): void {
    if (shouldLog("info")) {
      console.info(formatMessage(message, context))
    }
  },

  warn(message: string, context?: Record<string, any>): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage(message, context))
    }
  },

  error(message: string, error?: unknown, context?: Record<string, any>): void {
    if (shouldLog("error")) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const stack = error instanceof Error ? error.stack : undefined

      console.error(
        formatMessage(message, {
          ...context,
          errorMessage,
          stack,
        }),
      )
    }
  },
}
