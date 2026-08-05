/**
 * NextGen CMA — Admin Activity Logs Router Configuration
 *
 * Defines routes to retrieve system-wide administrative audit logs.
 */

import { Router } from 'express';
import { getActivityLogs } from '../controllers/activity.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/admin/activity-logs',
  authenticateUser,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  getActivityLogs
);

export default router;
