/**
 * NextGen CMA — Booking Router Configuration
 *
 * Defines endpoints for students to book sessions, cancel, reschedule,
 * and for mentors to manage scheduled bookings.
 */

import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  rescheduleBooking,
  updateBookingStatus,
  deleteBooking
} from '../controllers/booking.controller.js';
import {
  createBookingValidator,
  rescheduleBookingValidator,
  updateBookingStatusValidator
} from '../validators/booking.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.post(
  '/mentorship-bookings',
  authorizeRoles('STUDENT'),
  createBookingValidator,
  validateRequest,
  createBooking
);

router.get(
  '/mentorship-bookings',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getBookings
);

router.get(
  '/mentorship-bookings/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  getBookingById
);

router.put(
  '/mentorship-bookings/:id',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  rescheduleBookingValidator,
  validateRequest,
  rescheduleBooking
);

router.patch(
  '/mentorship-bookings/:id/status',
  authorizeRoles('STUDENT', 'MENTOR', 'ADMIN'),
  updateBookingStatusValidator,
  validateRequest,
  updateBookingStatus
);

router.delete(
  '/mentorship-bookings/:id',
  authorizeRoles('STUDENT', 'ADMIN'),
  deleteBooking
);

export default router;
