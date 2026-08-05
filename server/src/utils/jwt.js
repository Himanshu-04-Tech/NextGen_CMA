/**
 * NextGen CMA — JWT Utility Functions
 *
 * Handles generation and verification of Access and Refresh tokens.
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generates a short-lived JWT access token.
 * @param {Object} payload - Data to encode (userId, role)
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generates a long-lived JWT refresh token.
 * @param {Object} payload - Data to encode (userId)
 * @returns {string} Signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verifies a JWT access token.
 * @param {string} token - The JWT to verify
 * @returns {Object} Decoded token payload
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

/**
 * Verifies a JWT refresh token.
 * @param {string} token - The JWT to verify
 * @returns {Object} Decoded token payload
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

/**
 * Calculates the expiry date for a refresh token.
 * Parses the REFRESH_TOKEN_EXPIRY string (e.g., '7d') into a Date.
 * @returns {Date} Expiry date
 */
export const getRefreshTokenExpiry = () => {
  const expiry = env.REFRESH_TOKEN_EXPIRY;
  const value = parseInt(expiry, 10);
  const unit = expiry.replace(/\d/g, '');

  const ms = {
    s: value * 1000,
    m: value * 60 * 1000,
    h: value * 60 * 60 * 1000,
    d: value * 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + (ms[unit] || ms.d));
};
