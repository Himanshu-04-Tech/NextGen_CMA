/**
 * NextGen CMA — Authentication & Profile Routes
 *
 * Defines the public and protected endpoints for credentials management,
 * user sessions, and profile updates.
 */

import { Router } from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  refreshAccessToken,
} from '../controllers/auth.controller.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';
import { updateProfileValidator } from '../validators/profile.validator.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

// ---------------------
// Public Routes
// ---------------------

// Student Registration
router.post('/register', registerValidator, validateRequest, registerUser);

// Login (Email or Phone + Password)
router.post('/login', loginValidator, validateRequest, loginUser);

// Forgot Password — Request OTP
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);

// Reset Password — Verify OTP and Update Password
router.post('/reset-password', resetPasswordValidator, validateRequest, resetPassword);

// Refresh Access Token
router.post('/refresh-token', refreshAccessToken);

// ---------------------
// Protected Routes (Required Authentication)
// ---------------------

// User Logout
router.post('/logout', authenticateUser, logoutUser);

// Retrieve Profile
router.get('/profile', authenticateUser, getUserProfile);

// Update Profile (Fields: Name, Phone, Profile Image, CMA Level, Target Attempt)
router.put('/profile', authenticateUser, updateProfileValidator, validateRequest, updateUserProfile);

export default router;
