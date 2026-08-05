/**
 * NextGen CMA — Password Utility Functions
 *
 * Handles password hashing and comparison using bcryptjs.
 */

import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Bcrypt hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
