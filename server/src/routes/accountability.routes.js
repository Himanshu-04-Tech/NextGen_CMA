/**
 * NextGen CMA — Accountability Router
 *
 * Implements endpoints for daily check-ins, habits, streaks, settings,
 * and integration metrics.
 */

import { Router } from 'express';
import {
  createCheckin,
  getCheckins,
  getCheckinById,
  updateCheckin,
  deleteCheckin,
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  logHabit,
  getHabitLogs,
  getStreak,
  getReminderSettings,
  updateReminderSettings,
  getAnalytics
} from '../controllers/accountability.controller.js';
import {
  dailyCheckinValidator,
  habitValidator,
  habitLogValidator,
  updateReminderSettingValidator
} from '../validators/accountability.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Secure all endpoints with authentication middleware
router.use(authenticateUser);

// ── Daily Check-ins ──
router.post(
  '/checkins',
  authorizeRoles('STUDENT', 'ADMIN'),
  dailyCheckinValidator,
  validateRequest,
  createCheckin
);

router.get(
  '/checkins',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getCheckins
);

router.get(
  '/checkins/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getCheckinById
);

router.put(
  '/checkins/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  dailyCheckinValidator,
  validateRequest,
  updateCheckin
);

router.delete(
  '/checkins/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteCheckin
);

// ── Habits Tracker ──
router.post(
  '/habits',
  authorizeRoles('STUDENT', 'ADMIN'),
  habitValidator,
  validateRequest,
  createHabit
);

router.get(
  '/habits',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getHabits
);

router.put(
  '/habits/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  habitValidator,
  validateRequest,
  updateHabit
);

router.delete(
  '/habits/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteHabit
);

// ── Habit Logs ──
router.post(
  '/habits/:id/log',
  authorizeRoles('STUDENT', 'ADMIN'),
  habitLogValidator,
  validateRequest,
  logHabit
);

router.get(
  '/habits/:id/logs',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getHabitLogs
);

// ── Streaks ──
router.get(
  '/streaks',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getStreak
);

// ── Reminders Configuration ──
router.get(
  '/reminders/settings',
  authorizeRoles('STUDENT', 'ADMIN'),
  getReminderSettings
);

router.put(
  '/reminders/settings',
  authorizeRoles('STUDENT', 'ADMIN'),
  updateReminderSettingValidator,
  validateRequest,
  updateReminderSettings
);

// ── Analytics ──
router.get(
  '/accountability/analytics',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getAnalytics
);

export default router;
