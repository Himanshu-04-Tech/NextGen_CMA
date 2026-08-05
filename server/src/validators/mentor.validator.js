/**
 * NextGen CMA — Mentor Validator Rules
 *
 * Validates request payloads for creating/updating mentor profiles
 * and managing recurring availability slots.
 */

import { body, param } from 'express-validator';

export const createMentorValidator = [
  body('userId')
    .isUUID()
    .withMessage('Valid User ID (UUID) is required'),

  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),

  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Biography is required')
    .isLength({ min: 10 })
    .withMessage('Biography must be at least 10 characters long'),

  body('profileImage')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Profile image must be a valid string representation'),

  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),

  body('experience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a positive integer representing years (0 - 50)'),

  body('qualification')
    .trim()
    .notEmpty()
    .withMessage('Qualification is required'),

  body('availability')
    .optional({ checkFalsy: true })
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  body('subjects')
    .optional({ checkFalsy: true })
    .trim(),

  body('teachingStyle')
    .optional({ checkFalsy: true })
    .trim(),

  body('languages')
    .optional({ checkFalsy: true })
    .trim(),

  body('meetingPlatforms')
    .optional({ checkFalsy: true })
    .trim(),

  body('responseTime')
    .optional({ checkFalsy: true })
    .trim(),

  body('linkedinUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),

  body('websiteUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Website URL must be a valid URL'),

  body('professionalEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Professional email must be a valid email address'),

  body('certificates')
    .optional({ checkFalsy: true })
    .trim(),

  body('achievements')
    .optional({ checkFalsy: true })
    .trim(),
];

export const updateMentorValidator = [
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

  body('bio')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Biography cannot be empty')
    .isLength({ min: 10 })
    .withMessage('Biography must be at least 10 characters long'),

  body('profileImage')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Profile image must be a valid string representation'),

  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty'),

  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a positive integer representing years (0 - 50)'),

  body('qualification')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Qualification cannot be empty'),

  body('availability')
    .optional({ checkFalsy: true })
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  body('subjects')
    .optional({ checkFalsy: true })
    .trim(),

  body('teachingStyle')
    .optional({ checkFalsy: true })
    .trim(),

  body('languages')
    .optional({ checkFalsy: true })
    .trim(),

  body('meetingPlatforms')
    .optional({ checkFalsy: true })
    .trim(),

  body('responseTime')
    .optional({ checkFalsy: true })
    .trim(),

  body('linkedinUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),

  body('websiteUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Website URL must be a valid URL'),

  body('professionalEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Professional email must be a valid email address'),

  body('certificates')
    .optional({ checkFalsy: true })
    .trim(),

  body('achievements')
    .optional({ checkFalsy: true })
    .trim(),
];

export const updateAvailabilityValidator = [
  body('availabilities')
    .isArray({ min: 1 })
    .withMessage('Availabilities must be an array with at least one slot definition')
    .custom((slots) => {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      for (const slot of slots) {
        if (typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
          throw new Error('dayOfWeek must be an integer between 0 (Sunday) and 6 (Saturday)');
        }
        if (!slot.startTime || !timeRegex.test(slot.startTime)) {
          throw new Error('startTime must be a valid 24-hour time format (HH:MM)');
        }
        if (!slot.endTime || !timeRegex.test(slot.endTime)) {
          throw new Error('endTime must be a valid 24-hour time format (HH:MM)');
        }
        if (slot.slotDuration && (typeof slot.slotDuration !== 'number' || slot.slotDuration <= 0)) {
          throw new Error('slotDuration must be a positive integer representing minutes');
        }
        // Compare times
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        const startVal = startH * 60 + startM;
        const endVal = endH * 60 + endM;
        if (startVal >= endVal) {
          throw new Error('startTime must be strictly before endTime');
        }
      }
      return true;
    }),
];
