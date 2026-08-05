/**
 * NextGen CMA — Site Content & Brand CMS Routes
 *
 * Defines API routing for public display and administrative controls
 * of website landing page copy, images, and section orders.
 */

import { Router } from 'express';
import {
  getActiveSiteContent,
  getActiveSectionContent,
  getAdminSiteContent,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
  reorderSiteContent,
} from '../controllers/siteContent.controller.js';
import {
  createContentValidator,
  updateContentValidator,
  reorderContentValidator,
} from '../validators/siteContent.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────

// Retrieve all active content blocks for homepage rendering
router.get('/site-content', getActiveSiteContent);

// Retrieve active content blocks for a specific landing section (e.g. Hero, Testimonials)
router.get('/site-content/:sectionKey', getActiveSectionContent);

// ─────────────────────────────────────────────
// Admin Only Routes
// ─────────────────────────────────────────────

// Get all site content blocks (active and inactive) for the CMS workspace
router.get(
  '/admin/site-content',
  authenticateUser,
  authorizeRoles('ADMIN'),
  getAdminSiteContent
);

// Create a new site content block
router.post(
  '/admin/site-content',
  authenticateUser,
  authorizeRoles('ADMIN'),
  createContentValidator,
  validateRequest,
  createSiteContent
);

// Update details, images, text or links of a site content block
router.put(
  '/admin/site-content/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateContentValidator,
  validateRequest,
  updateSiteContent
);

// Delete a site content block
router.delete(
  '/admin/site-content/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  deleteSiteContent
);

// Synchronize display order sequence of multiple site content blocks
router.patch(
  '/admin/site-content/reorder',
  authenticateUser,
  authorizeRoles('ADMIN'),
  reorderContentValidator,
  validateRequest,
  reorderSiteContent
);

export default router;
