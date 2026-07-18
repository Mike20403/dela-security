export type AppErrorCode =
  | 'NETWORK'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'INTERNAL'
  | 'UNKNOWN'

interface AppErrorOptions {
  cause?: unknown
  retryable?: boolean
}

const UNKNOWN_ERROR_MESSAGE = 'Something went wrong. Please try again.'

export class AppError extends Error {
  readonly code: AppErrorCode
  readonly retryable: boolean

  constructor(
    code: AppErrorCode,
    message: string,
    options: AppErrorOptions = {},
  ) {
    super(message, 'cause' in options ? { cause: options.cause } : undefined)
    this.name = 'AppError'
    this.code = code
    this.retryable = options.retryable ?? false
  }
}

export function normalizeError(error: unknown): AppError {
  return error instanceof AppError
    ? error
    : new AppError('UNKNOWN', UNKNOWN_ERROR_MESSAGE, { cause: error })
}
