/**
 * NextGen CMA — Services Validator
 *
 * Validation rules for creating, updating, reordering, and toggling status of services.
 */

import { body, param } from 'express-validator';

export const createServiceValidator = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Study Planning', 'Accountability', 'Mentorship', 'Exam Support'])
    .withMessage('Category must be one of: Study Planning, Accountability, Mentorship, Exam Support'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),

  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ min: 10, max: 300 })
    .withMessage('Short description must be between 10 and 300 characters'),

  body('fullDescription')
    .trim()
    .notEmpty()
    .withMessage('Full description is required')
    .isLength({ min: 20 })
    .withMessage('Full description must be at least 20 characters'),

  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon class name or key is required'),

  body('imageUrl')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Image URL must be a string'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('ctaText')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('CTA text must be a string'),

  body('ctaLink')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('CTA link must be a string'),
];

export const updateServiceValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  body('category')
    .optional()
    .trim()
    .isIn(['Study Planning', 'Accountability', 'Mentorship', 'Exam Support'])
    .withMessage('Category must be one of: Study Planning, Accountability, Mentorship, Exam Support'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),

  body('shortDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Short description must be between 10 and 300 characters'),

  body('fullDescription')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('Full description must be at least 20 characters'),

  body('icon')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Icon is required'),

  body('imageUrl')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Image URL must be a string'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('ctaText')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('CTA text must be a string'),

  body('ctaLink')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('CTA link must be a string'),
];

export const reorderServicesValidator = [
  body('orders')
    .isArray({ min: 1 })
    .withMessage('Orders must be an array with at least one element'),

  body('orders.*.id')
    .trim()
    .notEmpty()
    .withMessage('Service ID is required')
    .isUUID()
    .withMessage('Service ID must be a valid UUID'),

  body('orders.*.displayOrder')
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];

export const updateStatusValidator = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Service ID is required')
    .isUUID()
    .withMessage('Service ID must be a valid UUID'),

  body('isActive')
    .isBoolean()
    .withMessage('isActive status is required and must be a boolean'),
];
