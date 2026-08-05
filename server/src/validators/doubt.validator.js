/**
 * NextGen CMA — Doubt Validator Rules
 *
 * Validates request payloads for raising student doubts,
 * updating status (e.g. resolving), and submitting replies.
 */

import { body, param } from 'express-validator';

export const createDoubtValidator = [
  body('mentorId')
    .isUUID()
    .withMessage('Valid Mentor ID (UUID) is required'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),

  body('questionTitle')
    .trim()
    .notEmpty()
    .withMessage('Question title is required')
    .isLength({ max: 200 })
    .withMessage('Question title cannot exceed 200 characters'),

  body('questionText')
    .trim()
    .notEmpty()
    .withMessage('Question text details are required')
    .isLength({ min: 10 })
    .withMessage('Question text must be at least 10 characters long'),

  body('attachmentUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
];

export const updateDoubtStatusValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid doubt ID format'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Doubt status is required')
    .isIn(['OPEN', 'PENDING_REPLY', 'RESOLVED'])
    .withMessage('Status must be OPEN, PENDING_REPLY, or RESOLVED'),
];

export const createDoubtReplyValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid doubt ID format'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Reply message cannot be empty'),

  body('attachmentUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Attachment URL must be a valid URL'),
];
