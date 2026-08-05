/**
 * NextGen CMA — Environment Configuration
 *
 * Centralizes all environment variables with validation.
 * Fails fast if required variables are missing.
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that all required environment variables are present.
 * Throws an error listing all missing variables if any are absent.
 */
const requiredEnvVars = [
  'DATABASE_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'CLIENT_URL',
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `❌ Missing required environment variables:\n${missingVars
      .map((v) => `  - ${v}`)
      .join('\n')}\n\nCopy .env.example to .env and fill in the values.`
  );
}

export const env = {
  // Server
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',

  // Client
  CLIENT_URL: process.env.CLIENT_URL,

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  // SMTP (Module 11)
  SMTP_HOST: process.env.SMTP_HOST || null,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || null,
  SMTP_PASS: process.env.SMTP_PASS || null,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
};
