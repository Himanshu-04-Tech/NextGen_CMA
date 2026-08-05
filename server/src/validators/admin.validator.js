/**
 * NextGen CMA — Admin Validator Rules
 *
 * Validates request payloads for administrative actions, including
 * admin login, mentor profile creation/update, and student-mentor assignments.
 */

import { body, param } from 'express-validator';

export const adminLoginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Must be a valid email address'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

export const adminCreateMentorValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be a valid 10-digit number'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),

  body('qualification')
    .trim()
    .notEmpty()
    .withMessage('Qualification is required'),

  body('experience')
    .notEmpty()
    .withMessage('Experience is required')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a positive integer representing years (0 - 50)'),

  body('profileImage')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Profile image must be a valid URL'),
];

export const adminUpdateMentorValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid mentor ID format'),

  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),

  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email address'),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be a valid 10-digit number'),

  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty'),

  body('qualification')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Qualification cannot be empty'),

  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a positive integer representing years (0 - 50)'),

  body('profileImage')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Profile image must be a valid URL'),
];

export const adminAssignStudentsValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid mentor ID format'),

  body('studentIds')
    .isArray({ min: 1 })
    .withMessage('studentIds must be an array with at least one student ID (UUID)')
    .custom((ids) => {
      if (!ids.every((id) => typeof id === 'string' && id.trim().length > 0)) {
        throw new Error('All student IDs must be non-empty strings');
      }
      return true;
    }),
];
