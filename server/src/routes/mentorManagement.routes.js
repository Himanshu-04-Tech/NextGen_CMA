/**
 * NextGen CMA — Admin Mentor Management Router Configuration
 *
 * Mapped endpoints for creating, updating, resetting password, and deleting mentor profiles.
 */

import { Router } from 'express';
import {
  getMentors,
  createMentor,
  updateMentor,
  deleteMentor,
  generateTempPassword,
  assignStudents
} from '../controllers/mentorManagement.controller.js';
import {
  adminCreateMentorValidator,
  adminUpdateMentorValidator,
  adminAssignStudentsValidator
} from '../validators/admin.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN'));

router.get('/admin/mentor-management', getMentors);

router.post(
  '/admin/mentor-management',
  adminCreateMentorValidator,
  validateRequest,
  createMentor
);

router.put(
  '/admin/mentor-management/:id',
  adminUpdateMentorValidator,
  validateRequest,
  updateMentor
);

router.delete('/admin/mentor-management/:id', deleteMentor);

router.post('/admin/mentor-management/:id/reset-password', generateTempPassword);

router.post(
  '/admin/mentor-management/:id/assign',
  adminAssignStudentsValidator,
  validateRequest,
  assignStudents
);

export default router;
