/**
 * NextGen CMA — Accountability Validators
 *
 * Input check-rules for daily check-ins, habits, habit logging,
 * and reminder configuration endpoints.
 */

import { body, param } from 'express-validator';

export const dailyCheckinValidator = [
  body('hoursStudied')
    .notEmpty()
    .withMessage('Hours studied is required')
    .isFloat({ min: 0.01, max: 24 })
    .withMessage('Hours studied must be a positive number up to 24'),

  body('topicsCovered')
    .optional({ nullable: true })
    .trim(),

  body('moodRating')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood rating must be an integer between 1 and 5'),

  body('energyRating')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Energy rating must be an integer between 1 and 5'),

  body('blockers')
    .optional({ nullable: true })
    .trim(),

  body('notes')
    .optional({ nullable: true })
    .trim(),

  body('date')
    .optional()
    .trim()
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date')
];

export const habitValidator = [
  body('habitName')
    .trim()
    .notEmpty()
    .withMessage('Habit name is required')
    .isLength({ max: 100 })
    .withMessage('Habit name cannot exceed 100 characters'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('frequency')
    .trim()
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(['DAILY', 'WEEKLY', 'CUSTOM'])
    .withMessage('Frequency must be DAILY, WEEKLY, or CUSTOM'),

  body('targetValue')
    .notEmpty()
    .withMessage('Target value is required')
    .isFloat({ min: 0.1 })
    .withMessage('Target value must be a positive number'),

  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit of measurement is required (e.g., MCQs, pages, minutes)')
];

export const habitLogValidator = [
  body('completed')
    .notEmpty()
    .withMessage('Completed status is required')
    .isBoolean()
    .withMessage('Completed must be a boolean value'),

  body('completedValue')
    .notEmpty()
    .withMessage('Completed progress value is required')
    .isFloat({ min: 0 })
    .withMessage('Completed value must be a non-negative number'),

  body('notes')
    .optional({ nullable: true })
    .trim(),

  body('date')
    .notEmpty()
    .withMessage('Log date is required')
    .isISO8601()
    .withMessage('Log date must be a valid date')
];

export const updateReminderSettingValidator = [
  body('dailyCheckinTime')
    .trim()
    .notEmpty()
    .withMessage('Daily checkin time is required')
    .matches(/^([0-1]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Time must be in 24-hour format HH:MM'),

  body('emailEnabled')
    .notEmpty()
    .withMessage('Email enabled preference is required')
    .isBoolean()
    .withMessage('Email preference must be a boolean value'),

  body('whatsappEnabled')
    .notEmpty()
    .withMessage('WhatsApp enabled preference is required')
    .isBoolean()
    .withMessage('WhatsApp preference must be a boolean value'),

  body('pushEnabled')
    .notEmpty()
    .withMessage('Push enabled preference is required')
    .isBoolean()
    .withMessage('Push preference must be a boolean value')
];
