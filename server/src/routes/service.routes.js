/**
 * NextGen CMA — Services & CMS Routes
 *
 * Defines endpoint paths for public catalog display
 * and authorized administrative management.
 */

import { Router } from 'express';
import {
  getActiveServices,
  getServiceDetails,
  getServicesByCategory,
  getAdminServices,
  createNewService,
  updateServiceDetails,
  toggleServiceStatus,
  deleteServiceRecord,
  reorderServicesOrder,
} from '../controllers/service.controller.js';
import {
  createServiceValidator,
  updateServiceValidator,
  reorderServicesValidator,
  updateStatusValidator,
} from '../validators/service.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ─────────────────────────────────────────────
// Public Catalog Routes
// ─────────────────────────────────────────────

// Get all active services
router.get('/services', getActiveServices);

// Get specific service details
router.get('/services/:id', getServiceDetails);

// Get active services filtered by category
router.get('/services/category/:category', getServicesByCategory);

// ─────────────────────────────────────────────
// Admin Only Routes
// ─────────────────────────────────────────────

// Get all services list (active & inactive) for CMS manager list
router.get(
  '/admin/services',
  authenticateUser,
  authorizeRoles('ADMIN'),
  getAdminServices
);

// Create a new service
router.post(
  '/admin/services',
  authenticateUser,
  authorizeRoles('ADMIN'),
  createServiceValidator,
  validateRequest,
  createNewService
);

// Update details, features, descriptions of a service
router.put(
  '/admin/services/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateServiceValidator,
  validateRequest,
  updateServiceDetails
);

// Toggle service activation/visibility status
router.patch(
  '/admin/services/status',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateStatusValidator,
  validateRequest,
  toggleServiceStatus
);

// Delete a service record
router.delete(
  '/admin/services/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  deleteServiceRecord
);

// Reorder services display position index
router.patch(
  '/admin/services/reorder',
  authenticateUser,
  authorizeRoles('ADMIN'),
  reorderServicesValidator,
  validateRequest,
  reorderServicesOrder
);

export default router;
