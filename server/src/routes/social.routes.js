/**
 * NextGen CMA — Social Link & Community Integration Routes
 *
 * Defines API endpoints for retrieving public active social coordinates
 * and administrative console CRUD management.
 */

import { Router } from 'express';
import {
  getActiveSocials,
  getAdminSocials,
  createNewSocial,
  updateSocialDetails,
  toggleSocialActivation,
  deleteSocialRecord,
  reorderSocialLinksList,
} from '../controllers/social.controller.js';
import {
  createSocialValidator,
  updateSocialValidator,
  updateSocialStatusValidator,
  reorderSocialLinksValidator,
} from '../validators/social.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ─────────────────────────────────────────────
// Public Endpoints
// ─────────────────────────────────────────────

// Get all active social link buttons
router.get('/social-links', getActiveSocials);

// ─────────────────────────────────────────────
// Admin Only Endpoints
// ─────────────────────────────────────────────

// Get all social links (including inactive items)
router.get(
  '/admin/social-links',
  authenticateUser,
  authorizeRoles('ADMIN'),
  getAdminSocials
);

// Create a new social link option
router.post(
  '/admin/social-links',
  authenticateUser,
  authorizeRoles('ADMIN'),
  createSocialValidator,
  validateRequest,
  createNewSocial
);

// Update social link text, url, platform or displayOrder
router.put(
  '/admin/social-links/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateSocialValidator,
  validateRequest,
  updateSocialDetails
);

// Toggle social link active state (Enable / Disable)
router.patch(
  '/admin/social-links/:id/status',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateSocialStatusValidator,
  validateRequest,
  toggleSocialActivation
);

// Bulk reorder display order weights for sorting
router.patch(
  '/admin/social-links/reorder',
  authenticateUser,
  authorizeRoles('ADMIN'),
  reorderSocialLinksValidator,
  validateRequest,
  reorderSocialLinksList
);

// Delete social link option permanently
router.delete(
  '/admin/social-links/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  deleteSocialRecord
);

export default router;
