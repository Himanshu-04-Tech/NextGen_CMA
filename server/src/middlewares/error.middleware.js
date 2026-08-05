/**
 * NextGen CMA — Global Error Handling Middleware
 *
 * Catches all errors thrown in the application, standardizes their format,
 * logs them for debugging, and returns a JSON response.
 */

import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, wrap it in a 500 Internal Server Error
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong on the server';
    error = new ApiError(statusCode, message, err.errors || []);
  }

  // Log error stack trace for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err);

  const responseBody = {
    success: error.success,
    message: error.message,
    errors: error.errors,
  };

  // Include stack trace only in development environment
  if (env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  return res.status(error.statusCode).json(responseBody);
};
