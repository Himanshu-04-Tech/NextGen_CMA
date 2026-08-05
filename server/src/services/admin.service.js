/**
 * NextGen CMA — Admin Service
 *
 * Handles administrator authentication, access token generations, and permission sets.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry
} from '../utils/jwt.js';

export class AdminService {
  /**
   * Authenticates an administrative user (ADMIN or SUPER_ADMIN).
   * @param {string} email
   * @param {string} password
   */
  static async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw ApiError.forbidden('Access denied: Unauthorized role');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate credentials tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Invalidate old refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    // Persist new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Check or create admin permission record
    let adminProfile = await prisma.adminUser.findUnique({
      where: { userId: user.id },
    });

    if (!adminProfile) {
      const defaultPermissions = user.role === 'SUPER_ADMIN' ? '["all"]' : '["cms", "students", "mentors", "reports"]';
      adminProfile = await prisma.adminUser.create({
        data: {
          userId: user.id,
          permissionsJson: defaultPermissions,
        },
      });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: JSON.parse(adminProfile.permissionsJson),
      },
      accessToken,
      refreshToken,
    };
  }
}
