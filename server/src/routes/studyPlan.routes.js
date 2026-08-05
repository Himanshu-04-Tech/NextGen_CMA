/**
 * NextGen CMA — Study Plan Router
 *
 * Exposes endpoints for managing student study plans,
 * subjects, daily/weekly targets, and revision logs.
 */

import { Router } from 'express';
import {
  createStudyPlan,
  getActiveStudyPlan,
  getStudyPlanDetails,
  updateStudyPlan,
  deleteStudyPlan,
  addSubject,
  updateSubject,
  deleteSubject,
  getDailyTargets,
  createDailyTarget,
  updateDailyTarget,
  deleteDailyTarget,
  generateSubjectTopics,
  generateAllSubjectsTopics,
  suggestSchedule,
  applySuggestedSchedule,
  getWeeklyTargets,
  createWeeklyTarget,
  updateWeeklyTarget,
  getRevisionCalendar
} from '../controllers/studyPlan.controller.js';
import {
  createStudyPlanValidator,
  updateStudyPlanValidator,
  addSubjectValidator,
  updateSubjectValidator,
  createDailyTargetValidator,
  updateDailyTargetValidator,
  createWeeklyTargetValidator,
  updateWeeklyTargetValidator
} from '../validators/studyPlan.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication to all endpoints
router.use(authenticateUser);

// ─────────────────────────────────────────────
// Study Plan Endpoints
// ─────────────────────────────────────────────

router.post(
  '/study-plans',
  authorizeRoles('STUDENT', 'ADMIN'),
  createStudyPlanValidator,
  validateRequest,
  createStudyPlan
);

router.get(
  '/study-plans',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getActiveStudyPlan
);

router.get(
  '/study-plans/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getStudyPlanDetails
);

router.put(
  '/study-plans/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  updateStudyPlanValidator,
  validateRequest,
  updateStudyPlan
);

router.delete(
  '/study-plans/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteStudyPlan
);

router.post(
  '/study-plans/:id/subjects/:subjectId/generate-topics',
  authorizeRoles('STUDENT', 'ADMIN'),
  generateSubjectTopics
);

router.post(
  '/study-plans/:id/generate-all-topics',
  authorizeRoles('STUDENT', 'ADMIN'),
  generateAllSubjectsTopics
);

router.post(
  '/study-plans/:id/suggest-schedule',
  authorizeRoles('STUDENT', 'ADMIN'),
  suggestSchedule
);

router.post(
  '/study-plans/:id/apply-schedule',
  authorizeRoles('STUDENT', 'ADMIN'),
  applySuggestedSchedule
);

// ─────────────────────────────────────────────
// Subject Endpoints
// ─────────────────────────────────────────────

router.post(
  '/study-plans/:id/subjects',
  authorizeRoles('STUDENT', 'ADMIN'),
  addSubjectValidator,
  validateRequest,
  addSubject
);

router.put(
  '/study-plans/subjects/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  updateSubjectValidator,
  validateRequest,
  updateSubject
);

router.delete(
  '/study-plans/subjects/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteSubject
);

// ─────────────────────────────────────────────
// Daily Target Endpoints
// ─────────────────────────────────────────────

router.post(
  '/daily-targets',
  authorizeRoles('STUDENT', 'ADMIN'),
  createDailyTargetValidator,
  validateRequest,
  createDailyTarget
);

router.patch(
  '/daily-targets/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  updateDailyTargetValidator,
  validateRequest,
  updateDailyTarget
);

router.delete(
  '/daily-targets/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteDailyTarget
);

router.get(
  '/daily-targets/:planId',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getDailyTargets
);

// ─────────────────────────────────────────────
// Weekly Target Endpoints
// ─────────────────────────────────────────────

router.post(
  '/weekly-targets',
  authorizeRoles('STUDENT', 'ADMIN'),
  createWeeklyTargetValidator,
  validateRequest,
  createWeeklyTarget
);

router.patch(
  '/weekly-targets/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  updateWeeklyTargetValidator,
  validateRequest,
  updateWeeklyTarget
);

router.get(
  '/weekly-targets/:planId',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getWeeklyTargets
);

// ─────────────────────────────────────────────
// Revision Calendar Endpoints
// ─────────────────────────────────────────────

router.get(
  '/revision-calendar/:planId',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getRevisionCalendar
);

export default router;
