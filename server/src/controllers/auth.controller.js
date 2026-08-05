/**
 * NextGen CMA — Authentication Controller
 *
 * Orchestrates request processing, cookies management, service invocation,
 * and standard REST response generation.
 */

import * as authService from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';

// Helper to set refresh token cookie
const setRefreshTokenCookie = (req, res, token) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax', // 'none' required for cross-site Cloudflare tunnels over HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * Handle user registration
 */
export const registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    // Set refresh token in secure HTTP-only cookie
    setRefreshTokenCookie(req, res, result.refreshToken);

    return ApiResponse.created('User registered successfully', {
      user: result.user,
      accessToken: result.accessToken,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login (Supports Email or Phone + Password)
 */
export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);

    // Set refresh token in secure HTTP-only cookie
    setRefreshTokenCookie(req, res, result.refreshToken);

    return ApiResponse.ok('Logged in successfully', {
      user: result.user,
      accessToken: result.accessToken,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle generating OTP for forgot password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    // Return 200 even if user doesn't exist for email privacy
    return ApiResponse.ok(
      'If your email is registered in our system, you will receive a 6-digit OTP shortly'
    ).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle resetting password with OTP
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);

    return ApiResponse.ok('Password has been reset successfully. Please log in with your new credentials.').send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve profile of currently authenticated user
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await authService.getProfile(userId);

    return ApiResponse.ok('Profile retrieved successfully', profile).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile of currently authenticated user
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await authService.updateProfile(userId, req.body);

    return ApiResponse.ok('Profile updated successfully', updatedProfile).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Log out user by invalidating refresh token and clearing cookie
 */
export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await authService.logout(token);
    }

    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || env.NODE_ENV === 'production';

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
    });

    return ApiResponse.ok('Logged out successfully').send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Issue new access token using refresh token stored in cookie
 */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await authService.refresh(token);

    return ApiResponse.ok('Access token refreshed successfully', result).send(res);
  } catch (error) {
    next(error);
  }
};
