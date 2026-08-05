/**
 * NextGen CMA — Activity Log Service
 *
 * Captures administrative changes and user logins for security audit trails.
 */

import { prisma } from '../config/db.js';

export class ActivityService {
  /**
   * Logs a new administrative or security action.
   * @param {Object} logData
   * @param {string} [logData.adminId]
   * @param {string} logData.action
   * @param {string} logData.targetTable
   * @param {string} [logData.targetId]
   * @param {string} logData.description
   * @param {string} [logData.ipAddress]
   */
  static async logActivity(logData) {
    try {
      const { adminId, action, targetTable, targetId, description, ipAddress } = logData;
      return await prisma.activityLog.create({
        data: {
          adminId,
          action,
          targetTable,
          targetId,
          description,
          ipAddress,
        },
      });
    } catch (err) {
      // Prevent logging failures from crashing requests
      console.error('Failed to write audit log:', err);
    }
  }

  /**
   * Retrieves activity logs with optional search, sorting, and pagination.
   * @param {Object} query
   * @param {number} [query.page]
   * @param {number} [query.limit]
   * @param {string} [query.search]
   */
  static async getActivityLogs(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { action: { contains: query.search, mode: 'insensitive' } },
        { targetTable: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
