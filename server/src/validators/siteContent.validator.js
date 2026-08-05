/**
 * NextGen CMA — Site Content Validator
 *
 * Validation rules for creating, updating, and reordering homepage/landing page content.
 */

import { body, param } from 'express-validator';

export const createContentValidator = [
  body('sectionKey')
    .trim()
    .notEmpty()
    .withMessage('Section key is required')
    .isString()
    .withMessage('Section key must be a string'),

  body('title')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Title must be a string'),

  body('subtitle')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Subtitle must be a string'),

  body('body')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Body must be a string'),

  body('buttonText')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Button text must be a string'),

  body('buttonLink')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Button link must be a string'),

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
    .withMessage('isActive must be a boolean value'),
];

export const updateContentValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  body('sectionKey')
    .optional()
    .trim()
    .isString()
    .withMessage('Section key must be a string'),

  body('title')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Title must be a string'),

  body('subtitle')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Subtitle must be a string'),

  body('body')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Body must be a string'),

  body('buttonText')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Button text must be a string'),

  body('buttonLink')
    .optional({ nullable: true })
    .trim()
    .isString()
    .withMessage('Button link must be a string'),

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
    .withMessage('isActive must be a boolean value'),
];

export const reorderContentValidator = [
  body('orders')
    .isArray({ min: 1 })
    .withMessage('Orders must be an array with at least one element'),

  body('orders.*.id')
    .trim()
    .notEmpty()
    .withMessage('Order item ID is required')
    .isUUID()
    .withMessage('Order item ID must be a valid UUID'),

  body('orders.*.displayOrder')
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];
