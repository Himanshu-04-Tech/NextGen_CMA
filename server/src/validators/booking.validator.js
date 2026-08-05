/**
 * NextGen CMA — Booking Validator Rules
 *
 * Validates request payloads for creating, rescheduling,
 * and updating status of mentorship bookings.
 */

import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('mentorId')
    .isUUID()
    .withMessage('Valid Mentor ID (UUID) is required'),

  body('scheduledAt')
    .trim()
    .notEmpty()
    .withMessage('Scheduled date and time is required')
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO8601 date and time')
    .custom((value) => {
      const scheduledDate = new Date(value);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('Scheduled slot must be in the future');
      }
      return true;
    }),

  body('meetingPlatform')
    .trim()
    .notEmpty()
    .withMessage('Meeting platform is required')
    .isIn(['GOOGLE_MEET', 'ZOOM', 'OFFLINE'])
    .withMessage('Meeting platform must be GOOGLE_MEET, ZOOM, or OFFLINE'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const rescheduleBookingValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid booking ID format'),

  body('scheduledAt')
    .trim()
    .notEmpty()
    .withMessage('New scheduled date and time is required')
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO8601 date and time')
    .custom((value) => {
      const scheduledDate = new Date(value);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('New scheduled slot must be in the future');
      }
      return true;
    }),

  body('meetingPlatform')
    .optional()
    .trim()
    .isIn(['GOOGLE_MEET', 'ZOOM', 'OFFLINE'])
    .withMessage('Meeting platform must be GOOGLE_MEET, ZOOM, or OFFLINE'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const updateBookingStatusValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid booking ID format'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Booking status is required')
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED'])
    .withMessage('Status must be PENDING, CONFIRMED, CANCELLED, RESCHEDULED, or COMPLETED'),
];
