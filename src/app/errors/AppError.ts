class AppError extends Error {
  statusCode: number;
  type?: string;
  constructor(
    statusCode: number,
    message: string | undefined,
    type?: string,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    if (type) {
      this.type = type;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default AppError;
