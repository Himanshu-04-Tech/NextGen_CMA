/**
 * NextGen CMA — Social Validator
 *
 * Validation rules for creating, updating, and reordering social links.
 */

import { body, param } from 'express-validator';

const allowedPlatforms = [
  'WHATSAPP',
  'TELEGRAM',
  'INSTAGRAM',
  'YOUTUBE',
  'FACEBOOK',
  'LINKEDIN',
  'TWITTER',
  'EMAIL',
  'WEBSITE',
];

export const createSocialValidator = [
  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required')
    .toUpperCase()
    .isIn(allowedPlatforms)
    .withMessage(`Platform must be one of: ${allowedPlatforms.join(', ')}`),

  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('Display name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Display name must be between 2 and 100 characters'),

  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required'),

  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon class name or Lucide identifier is required'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateSocialValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  body('platform')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(allowedPlatforms)
    .withMessage(`Platform must be one of: ${allowedPlatforms.join(', ')}`),

  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Display name must be between 2 and 100 characters'),

  body('url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('URL cannot be empty'),

  body('icon')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Icon cannot be empty'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateSocialStatusValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  body('isActive')
    .notEmpty()
    .withMessage('isActive is required')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const reorderSocialLinksValidator = [
  body('orders')
    .isArray({ min: 1 })
    .withMessage('Orders must be a non-empty array')
    .custom((value) => {
      for (const item of value) {
        if (!item.id || typeof item.displayOrder !== 'number') {
          throw new Error('Each order item must contain an id (UUID) and displayOrder (number)');
        }
      }
      return true;
    }),
];
