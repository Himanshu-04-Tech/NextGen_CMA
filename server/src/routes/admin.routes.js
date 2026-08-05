/**
 * NextGen CMA — Admin Session Router Configuration
 *
 * Exposes endpoints for administrative login and session invalidations.
 */

import { Router } from 'express';
import { login, logout } from '../controllers/admin.controller.js';
import { adminLoginValidator } from '../validators/admin.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Public Admin Login
router.post(
  '/admin/login',
  adminLoginValidator,
  validateRequest,
  login
);

// Protected Admin Logout
router.post(
  '/admin/logout',
  authenticateUser,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  logout
);

export default router;
