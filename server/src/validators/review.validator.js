/**
 * NextGen CMA — Performance Review Validator Rules
 *
 * Validates request payloads for creating and updating student
 * performance reviews by mentors.
 */

import { body, param } from 'express-validator';

export const createReviewValidator = [
  body('studentId')
    .isUUID()
    .withMessage('Valid Student ID (UUID) is required'),

  body('overallScore')
    .notEmpty()
    .withMessage('Overall score is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Overall score must be a number between 0 and 100'),

  body('strengths')
    .trim()
    .notEmpty()
    .withMessage('Strengths feedback is required'),

  body('weaknesses')
    .trim()
    .notEmpty()
    .withMessage('Weaknesses feedback is required'),

  body('actionItems')
    .trim()
    .notEmpty()
    .withMessage('Action items and study strategy plan is required'),

  body('mentorNotes')
    .optional({ checkFalsy: true })
    .trim(),

  body('nextReviewDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Next review date must be a valid ISO8601 date')
    .custom((value) => {
      if (!value) return true;
      const reviewDate = new Date(value);
      const now = new Date();
      if (reviewDate <= now) {
        throw new Error('Next review date must be in the future');
      }
      return true;
    }),
];

export const updateReviewValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid review ID format'),

  body('overallScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Overall score must be a number between 0 and 100'),

  body('strengths')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Strengths feedback cannot be empty'),

  body('weaknesses')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Weaknesses feedback cannot be empty'),

  body('actionItems')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Action items cannot be empty'),

  body('mentorNotes')
    .optional({ checkFalsy: true })
    .trim(),

  body('nextReviewDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Next review date must be a valid ISO8601 date')
    .custom((value) => {
      if (!value) return true;
      const reviewDate = new Date(value);
      const now = new Date();
      if (reviewDate <= now) {
        throw new Error('Next review date must be in the future');
      }
      return true;
    }),
];
