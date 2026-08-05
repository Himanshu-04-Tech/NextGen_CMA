/**
 * NextGen CMA — OTP Utility Functions
 *
 * Generates secure OTPs and provides a mock email sender.
 * Replace sendOTP with a real email service (e.g., Nodemailer, SendGrid)
 * in production.
 */

import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit OTP.
 * @returns {string} 6-digit OTP string
 */
export const generateOTP = () => {
  // Generate a random number between 100000 and 999999
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
};

/**
 * Calculates the OTP expiry time (10 minutes from now).
 * @returns {Date} Expiry timestamp
 */
export const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Mock OTP sender — logs OTP to console.
 *
 * In production, replace this with an actual email/SMS service like:
 * - Nodemailer + SMTP
 * - SendGrid API
 * - Twilio SMS
 *
 * @param {string} email - Recipient email address
 * @param {string} otp - The OTP to send
 * @returns {Promise<boolean>} Always resolves true (mock)
 */
export const sendOTP = async (email, otp) => {
  // ===================================================
  // 🔔 MOCK IMPLEMENTATION — Replace in production
  // ===================================================
  console.log('═══════════════════════════════════════');
  console.log('📧 OTP Email (Mock)');
  console.log('═══════════════════════════════════════');
  console.log(`   To:  ${email}`);
  console.log(`   OTP: ${otp}`);
  console.log(`   Expires in: 10 minutes`);
  console.log('═══════════════════════════════════════');

  return true;
};
