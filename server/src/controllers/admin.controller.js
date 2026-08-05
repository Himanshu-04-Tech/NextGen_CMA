/**
 * NextGen CMA — Admin Controller
 *
 * Exposes handlers for admin login session, cookie management, and logout audit triggers.
 */

import { AdminService } from '../services/admin.service.js';
import { ActivityService } from '../services/activity.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { prisma } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AdminService.login(email, password);

    // Write audit log
    await ActivityService.logActivity({
      adminId: user.id,
      action: 'LOGIN',
      targetTable: 'users',
      targetId: user.id,
      description: `Administrator ${user.email} logged in successfully`,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
    });

    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';

    // Set refresh token in HTTP-only secure cookie
    res.cookie('nextgen_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching jwt configs
    });

    return ApiResponse.ok('Admin authenticated successfully', {
      user,
      accessToken,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const email = req.user?.email;

    // Delete refresh token
    const token = req.cookies?.nextgen_refresh_token;
    if (token) {
      await prisma.refreshToken.deleteMany({
        where: { token },
      });
    }

    // Write audit log
    if (adminId) {
      await ActivityService.logActivity({
        adminId,
        action: 'LOGOUT',
        targetTable: 'users',
        targetId: adminId,
        description: `Administrator ${email} logged out`,
        ipAddress: req.ip || req.headers['x-forwarded-for'],
      });
    }

    res.clearCookie('nextgen_refresh_token');
    return ApiResponse.ok('Admin logged out successfully').send(res);
  } catch (error) {
    next(error);
  }
};
