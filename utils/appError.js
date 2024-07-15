class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //passing error into

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // needed nbecause of the non operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
