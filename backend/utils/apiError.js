class ApiError extends Error {
  constructor(statusCode, message, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

module.exports = ApiError;
