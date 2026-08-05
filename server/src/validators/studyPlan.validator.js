/**
 * NextGen CMA — Study Plan Validators
 *
 * Input validation rules for creating/updating study plans,
 * subjects, daily targets, and weekly targets.
 */

import { body, param } from 'express-validator';

export const createStudyPlanValidator = [
  body('cmaLevel')
    .trim()
    .notEmpty()
    .withMessage('CMA Level is required')
    .isIn(['FOUNDATION', 'INTER', 'FINAL'])
    .withMessage('Invalid CMA Level. Must be FOUNDATION, INTER, or FINAL'),

  body('subjects')
    .isArray({ min: 1 })
    .withMessage('Subjects must be an array with at least one subject name')
    .custom((subjects) => {
      if (!subjects.every((s) => typeof s === 'string' && s.trim().length > 0)) {
        throw new Error('All subjects must be non-empty strings');
      }
      return true;
    }),

  body('examAttempt')
    .trim()
    .notEmpty()
    .withMessage('Exam attempt target is required'),

  body('examDate')
    .trim()
    .notEmpty()
    .withMessage('Exam date is required')
    .isISO8601()
    .withMessage('Exam date must be a valid ISO8601 date (YYYY-MM-DD)')
    .custom((value) => {
      const examDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (examDate <= today) {
        throw new Error('Exam date must be in the future');
      }
      return true;
    }),

  body('dailyStudyHours')
    .notEmpty()
    .withMessage('Daily study hours is required')
    .isFloat({ min: 0.5, max: 24 })
    .withMessage('Daily study hours must be a number between 0.5 and 24'),
];

export const updateStudyPlanValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid study plan ID'),

  body('examDate')
    .optional()
    .trim()
    .isISO8601()
    .withMessage('Exam date must be a valid date')
    .custom((value) => {
      const examDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (examDate <= today) {
        throw new Error('Exam date must be in the future');
      }
      return true;
    }),

  body('dailyStudyHours')
    .optional()
    .isFloat({ min: 0.5, max: 24 })
    .withMessage('Daily study hours must be a number between 0.5 and 24'),

  body('status')
    .optional()
    .trim()
    .isIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
    .withMessage('Invalid status'),
];

export const addSubjectValidator = [
  param('id')
    .custom((val) => {
      if (val === 'active') return true;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(val)) return true;
      throw new Error('Invalid study plan ID');
    }),

  body('subjectName')
    .trim()
    .notEmpty()
    .withMessage('Subject name is required'),

  body('totalTopics')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Total topics must be a non-negative integer'),

  body('completedTopics')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Completed topics must be a non-negative integer'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];

export const updateSubjectValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid subject ID'),

  body('completedTopics')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Completed topics must be a non-negative integer'),

  body('totalTopics')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total topics must be an integer of at least 1'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];

export const createDailyTargetValidator = [
  body('planId')
    .isUUID()
    .withMessage('Invalid plan ID'),

  body('date')
    .optional({ nullable: true })
    .trim()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),

  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required'),

  body('studyHours')
    .optional()
    .isFloat({ min: 0.1, max: 24 })
    .withMessage('Study hours must be a positive number'),

  body('priority')
    .optional()
    .isIn(['HIGH', 'MEDIUM', 'LOW'])
    .withMessage('Priority must be HIGH, MEDIUM, or LOW'),
];

export const updateDailyTargetValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid daily target ID'),

  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'RESCHEDULED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, COMPLETED, MISSED, or RESCHEDULED'),

  body('date')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true;
      if (typeof val === 'string' && !isNaN(Date.parse(val))) return true;
      throw new Error('Rescheduled date must be a valid date or null');
    }),

  body('studyHours')
    .optional()
    .isFloat({ min: 0.1, max: 24 })
    .withMessage('Study hours must be a positive number'),

  body('priority')
    .optional()
    .isIn(['HIGH', 'MEDIUM', 'LOW'])
    .withMessage('Priority must be HIGH, MEDIUM, or LOW'),
];

export const createWeeklyTargetValidator = [
  body('planId')
    .isUUID()
    .withMessage('Invalid plan ID'),

  body('weekStart')
    .trim()
    .notEmpty()
    .withMessage('Week start date is required')
    .isISO8601()
    .withMessage('Week start must be a valid date'),

  body('goalDescription')
    .trim()
    .notEmpty()
    .withMessage('Goal description is required'),
];

export const updateWeeklyTargetValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid weekly target ID'),

  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'COMPLETED'])
    .withMessage('Status must be PENDING or COMPLETED'),

  body('goalDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Goal description cannot be empty'),
];
