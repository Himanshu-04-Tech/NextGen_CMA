/**
 * NextGen CMA — Profile Validators
 *
 * Express-validator rules for profile update endpoint.
 */

import { body } from 'express-validator';

/**
 * Profile update validation rules.
 * All fields are optional — only provided fields are validated.
 */
export const updateProfileValidator = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number'),

  body('profileImage')
    .optional({ nullable: true })
    .isString()
    .withMessage('Profile image must be a valid string representation'),

  body('cmaLevel')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['FOUNDATION', 'INTER', 'FINAL'])
    .withMessage('CMA Level must be one of: FOUNDATION, INTER, FINAL'),

  body('targetAttempt')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Target attempt must be a valid target attempt string (e.g. Dec 2026)'),

  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
