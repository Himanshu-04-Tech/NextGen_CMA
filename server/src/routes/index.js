/**
 * NextGen CMA — Main Router Multiplexer
 *
 * Imports individual API route modules and mounts them under specific URL namespaces.
 */

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import siteContentRoutes from './siteContent.routes.js';
import serviceRoutes from './service.routes.js';
import studyPlanRoutes from './studyPlan.routes.js';
import accountabilityRoutes from './accountability.routes.js';
import mentorRoutes from './mentor.routes.js';
import bookingRoutes from './booking.routes.js';
import doubtRoutes from './doubt.routes.js';
import performanceReviewRoutes from './performanceReview.routes.js';
import adminRoutes from './admin.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import studentRoutes from './student.routes.js';
import mentorManagementRoutes from './mentorManagement.routes.js';
import activityRoutes from './activity.routes.js';
import contactRoutes from './contact.routes.js';
import socialRoutes from './social.routes.js';

const router = Router();

// Mount authentication and profile routes under '/auth'
// Resulting endpoints: /api/auth/register, /api/auth/login, etc.
router.use('/auth', authRoutes);

// Mount site content (homepage CMS) routes
router.use('/', siteContentRoutes);

// Mount services catalog & CMS routes
router.use('/', serviceRoutes);

// Mount contact and social integration routes
router.use('/', contactRoutes);
router.use('/', socialRoutes);

// Mount study planner routes
router.use('/', studyPlanRoutes);

// Mount accountability routes
router.use('/', accountabilityRoutes);

// Mount mentorship module routes
router.use('/', mentorRoutes);
router.use('/', bookingRoutes);
router.use('/', doubtRoutes);
router.use('/', performanceReviewRoutes);

// Mount administrative routes
router.use('/', adminRoutes);
router.use('/', dashboardRoutes);
router.use('/', studentRoutes);
router.use('/', mentorManagementRoutes);
router.use('/', activityRoutes);

export default router;

