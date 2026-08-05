/**
 * NextGen CMA — Validation Middleware
 *
 * Intercepts request flows, evaluates express-validator validation rules,
 * and handles any validation failures by passing a structured ApiError to the global error handler.
 */

import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map express-validator errors into a simplified format
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    // Pass structured error to the error-handling middleware
    return next(ApiError.badRequest('Validation failed', formattedErrors));
  }
  next();
};
