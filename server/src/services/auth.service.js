/**
 * NextGen CMA — Authentication Service
 *
 * Contains core business logic for user signup, credentials verification,
 * JWT token creation/refresh/invalidation, profile lookup/updates, and password recovery via OTP.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { generateOTP, getOTPExpiry, sendOTP } from '../utils/otp.js';

export const register = async (userData) => {
  const { name, email, phone, password } = userData;

  // Check if email or phone is already registered
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      throw ApiError.conflict('A user with this email address already exists');
    }
    if (existingUser.phone === phone) {
      throw ApiError.conflict('A user with this phone number already exists');
    }
  }

  // Hash user password
  const hashedPassword = await hashPassword(password);

  // Save new user in the database (Default role = STUDENT)
  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'STUDENT',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role });
  const refreshToken = generateRefreshToken({ userId: newUser.id });

  // Persist refresh token
  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
};

export const login = async (identifier, password) => {
  // Find user by either email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email/phone or password');
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email/phone or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  // Store refresh token in DB
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  // Select clean user object to return
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    cmaLevel: user.cmaLevel,
    targetAttempt: user.targetAttempt,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

export const refresh = async (token) => {
  if (!token) {
    throw ApiError.unauthorized('Refresh token is required');
  }

  // Verify JWT structure and sign
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  // Check if token exists in DB and is not expired
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  if (new Date() > storedToken.expiresAt) {
    // Delete expired token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw ApiError.unauthorized('Refresh token has expired');
  }

  // Generate a new access token
  const newAccessToken = generateAccessToken({
    userId: storedToken.user.id,
    role: storedToken.user.role,
  });

  return {
    accessToken: newAccessToken,
  };
};

export const logout = async (token) => {
  if (!token) return;

  // Remove refresh token from database if it exists
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      profileImage: true,
      cmaLevel: true,
      targetAttempt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User profile not found');
  }

  return user;
};

export const updateProfile = async (userId, profileData) => {
  const { name, phone, profileImage, cmaLevel, targetAttempt, password } = profileData;

  // If phone is updated, check for uniqueness
  if (phone) {
    const existingPhoneUser = await prisma.user.findFirst({
      where: {
        phone,
        NOT: { id: userId },
      },
    });

    if (existingPhoneUser) {
      throw ApiError.conflict('This phone number is already taken by another user');
    }
  }

  const updatePayload = {
    ...(name && { name }),
    ...(phone && { phone }),
    ...(profileImage !== undefined && { profileImage }),
    ...(cmaLevel && { cmaLevel }),
    ...(targetAttempt !== undefined && { targetAttempt }),
  };

  if (password) {
    updatePayload.password = await hashPassword(password);
  }

  // Update fields
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      profileImage: true,
      cmaLevel: true,
      targetAttempt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const forgotPassword = async (email) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Return true to prevent email harvesting, but we won't log anything or throw.
    // However, in our system, we should let the controller return success either way.
    return true;
  }

  // Generate 6-digit OTP
  const otp = generateOTP();
  const expiresAt = getOTPExpiry();

  // Save OTP in database (overwriting previous FORGOT_PASSWORD OTPs for this user if any)
  await prisma.otpVerification.deleteMany({
    where: {
      userId: user.id,
      purpose: 'FORGOT_PASSWORD',
    },
  });

  await prisma.otpVerification.create({
    data: {
      userId: user.id,
      otp,
      purpose: 'FORGOT_PASSWORD',
      expiresAt,
    },
  });

  // Trigger mock email
  await sendOTP(user.email, otp);

  return true;
};

export const resetPassword = async (email, otp, newPassword) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw ApiError.notFound('User with this email address does not exist');
  }

  // Find valid OTP record
  const otpRecord = await prisma.otpVerification.findFirst({
    where: {
      userId: user.id,
      otp,
      purpose: 'FORGOT_PASSWORD',
    },
  });

  if (!otpRecord) {
    throw ApiError.badRequest('Invalid or expired OTP code');
  }

  // Check expiry
  if (new Date() > otpRecord.expiresAt) {
    // Delete expired OTP
    await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
    throw ApiError.badRequest('OTP code has expired. Please request a new one.');
  }

  // Hash new password
  const newHashedPassword = await hashPassword(newPassword);

  // Update password and delete OTP verification record in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword },
    }),
    prisma.otpVerification.delete({
      where: { id: otpRecord.id },
    }),
    // Also clean up any active refresh tokens to force re-login on all devices
    prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  return true;
};
