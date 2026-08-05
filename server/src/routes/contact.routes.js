/**
 * NextGen CMA — Contact & Inquiry Routes
 *
 * Defines API endpoints for public contact submissions and
 * administrative review/management of user messages.
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitContactForm,
  getContactSettings,
  getAdminContactMessages,
  getContactMessageById,
  patchContactMessageStatus,
  deleteContactMessageRecord,
} from '../controllers/contact.controller.js';
import {
  createContactValidator,
  updateStatusValidator,
} from '../validators/contact.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Stricter rate limiter for contact inquiries to prevent email/DB spamming
const contactSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact submissions per windowMs
  message: {
    success: false,
    message: 'Too many inquiry submissions from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────
// Public Endpoints
// ─────────────────────────────────────────────

// Send a contact/inquiry message
router.post(
  '/contact',
  contactSubmitLimiter,
  createContactValidator,
  validateRequest,
  submitContactForm
);

// Get contact info settings (FAQs, coordinates, hours, map embed)
router.get('/contact-info', getContactSettings);

// ─────────────────────────────────────────────
// Admin Only Endpoints
// ─────────────────────────────────────────────

// Get all contact messages with filtering and searching
router.get(
  '/admin/contact-messages',
  authenticateUser,
  authorizeRoles('ADMIN'),
  getAdminContactMessages
);

// Get single contact message details
router.get(
  '/admin/contact-messages/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  getContactMessageById
);

// Update status of a contact message (UNREAD, READ, REPLIED)
router.patch(
  '/admin/contact-messages/:id/status',
  authenticateUser,
  authorizeRoles('ADMIN'),
  updateStatusValidator,
  validateRequest,
  patchContactMessageStatus
);

// Delete/Trash a contact message
router.delete(
  '/admin/contact-messages/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  deleteContactMessageRecord
);

export default router;
