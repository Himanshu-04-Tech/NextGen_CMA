/**
 * NextGen CMA — Doubt Router Configuration
 *
 * Maps endpoints for raising study doubts, querying doubt details and thread histories,
 * resolving doubts, and adding discussion replies.
 */

import { Router } from 'express';
import {
  createDoubt,
  getDoubts,
  getDoubtById,
  updateDoubtStatus,
  addReply
} from '../controllers/doubt.controller.js';
import {
  createDoubtValidator,
  updateDoubtStatusValidator,
  createDoubtReplyValidator
} from '../validators/doubt.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.post(
  '/doubts',
  authorizeRoles('STUDENT'),
  createDoubtValidator,
  validateRequest,
  createDoubt
);

router.get(
  '/doubts',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getDoubts
);

router.get(
  '/doubts/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getDoubtById
);

router.patch(
  '/doubts/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  updateDoubtStatusValidator,
  validateRequest,
  updateDoubtStatus
);

router.post(
  '/doubts/:id/reply',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  createDoubtReplyValidator,
  validateRequest,
  addReply
);

export default router;
