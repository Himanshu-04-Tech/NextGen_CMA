/**
 * NextGen CMA — Admin Student Management Router Configuration
 *
 * Exposes routes to fetch student lists, summaries, and toggle status.
 */

import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  toggleStudentStatus
} from '../controllers/student.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN'));

router.get('/admin/students', getStudents);
router.get('/admin/students/:id', getStudentById);
router.patch('/admin/students/:id/status', toggleStudentStatus);

export default router;
