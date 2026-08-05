/**
 * NextGen CMA — Authentication & Authorization Middlewares
 *
 * Provides route protection via JWT verification (authenticateUser)
 * and role-based access control check (authorizeRoles).
 */

import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { prisma } from '../config/db.js';

/**
 * Middleware to authenticate requests using JWT Access Tokens.
 * Expects the token in the 'Authorization' header as 'Bearer <token>'.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication required: Missing or invalid token format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication required: Token is empty');
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token has expired');
      }
      throw ApiError.unauthorized('Invalid access token');
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User no longer exists on the platform');
    }

    // Attach user payload to the request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize access based on user roles.
 * Supports roles: STUDENT, MENTOR, ADMIN.
 * @param {...string} roles - Permitted roles (case-insensitive, compared in uppercase)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    const userRole = req.user.role.toUpperCase();
    
    // SUPER_ADMIN has full access bypass across all resources
    const authorized = userRole === 'SUPER_ADMIN' || roles.map((r) => r.toUpperCase()).includes(userRole);

    if (!authorized) {
      return next(new ApiError(403, 'Forbidden: You do not have permission to access this resource'));
    }

    next();
  };
};
