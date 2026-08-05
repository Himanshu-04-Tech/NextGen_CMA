/**
 * NextGen CMA — Admin Dashboard Stats Router Configuration
 *
 * Defines routes to retrieve core application summary counts.
 */

import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/admin/dashboard-stats',
  authenticateUser,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  getStats
);

export default router;
