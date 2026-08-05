/**
 * NextGen CMA — Performance Review Router Configuration
 *
 * Defines endpoints for mentors to post student evaluations and study strategies,
 * and for students to check their review histories.
 */

import { Router } from 'express';
import {
  createReview,
  getReviews,
  updateReview
} from '../controllers/performanceReview.controller.js';
import {
  createReviewValidator,
  updateReviewValidator
} from '../validators/review.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.post(
  '/performance-reviews',
  authorizeRoles('MENTOR'),
  createReviewValidator,
  validateRequest,
  createReview
);

router.get(
  '/performance-reviews',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getReviews
);

router.put(
  '/performance-reviews/:id',
  authorizeRoles('MENTOR', 'ADMIN'),
  updateReviewValidator,
  validateRequest,
  updateReview
);

export default router;
