/**
 * NextGen CMA — Mentor Router Configuration
 *
 * Defines route endpoints for browsing mentors, configuring availability,
 * and performing administrative CRUD operations on mentor records.
 */

import { Router } from 'express';
import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  updateAvailability,
  getMyMentorProfile
} from '../controllers/mentor.controller.js';
import {
  createMentorValidator,
  updateMentorValidator,
  updateAvailabilityValidator
} from '../validators/mentor.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticateUser);

// ─────────────────────────────────────────────
// Student / General Mentor Endpoints
// ─────────────────────────────────────────────

router.get(
  '/mentors',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getMentors
);

router.get(
  '/mentors/my-profile',
  authorizeRoles('MENTOR'),
  getMyMentorProfile
);

router.get(
  '/mentors/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getMentorById
);

router.put(
  '/mentors/availability',
  authorizeRoles('MENTOR'),
  updateAvailabilityValidator,
  validateRequest,
  updateAvailability
);

// ─────────────────────────────────────────────
// Admin Only Endpoints
// ─────────────────────────────────────────────

router.post(
  '/admin/mentors',
  authorizeRoles('ADMIN'),
  createMentorValidator,
  validateRequest,
  createMentor
);

router.put(
  '/admin/mentors/:id',
  authorizeRoles('ADMIN', 'MENTOR'),
  updateMentorValidator,
  validateRequest,
  updateMentor
);

router.delete(
  '/admin/mentors/:id',
  authorizeRoles('ADMIN'),
  deleteMentor
);

export default router;
