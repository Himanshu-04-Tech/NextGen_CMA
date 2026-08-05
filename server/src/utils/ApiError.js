/**
 * NextGen CMA — Custom API Error Class
 *
 * Extends the native Error class to include HTTP status codes
 * and structured error data for consistent API error responses.
 */

export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 404, 500)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of validation errors or details
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.name = 'ApiError';

    // Capture stack trace (excludes constructor from trace)
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory method for 400 Bad Request errors.
   * @param {string} message
   * @param {Array} errors
   * @returns {ApiError}
   */
  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors);
  }

  /**
   * Factory method for 401 Unauthorized errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /**
   * Factory method for 403 Forbidden errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /**
   * Factory method for 404 Not Found errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  /**
   * Factory method for 409 Conflict errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message);
  }

  /**
   * Factory method for 429 Too Many Requests errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  /**
   * Factory method for 500 Internal Server errors.
   * @param {string} message
   * @returns {ApiError}
   */
  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}
