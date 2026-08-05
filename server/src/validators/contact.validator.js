/**
 * NextGen CMA — Contact Validator
 *
 * Defines validation rules for public contact submission
 * and administrative contact message status updates.
 */

import { body, param } from 'express-validator';

export const createContactValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9\s\-()]{10,20}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
];

export const updateStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['UNREAD', 'READ', 'REPLIED', 'DELETED'])
    .withMessage('Status must be one of: UNREAD, READ, REPLIED, DELETED'),
];
