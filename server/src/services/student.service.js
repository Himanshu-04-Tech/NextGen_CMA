/**
 * NextGen CMA — Student Management Service
 *
 * Implements search, pagination, detailed profiles summaries,
 * and activation/deactivation triggers using the activity logs table.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ActivityService } from './activity.service.js';

export class StudentService {
  /**
   * Helper to check if a student user is deactivated by reading the audit logs.
   * @param {string} studentId
   * @returns {Promise<boolean>} - True if deactivated, false if active
   */
  static async isStudentDeactivated(studentId) {
    const lastLog = await prisma.activityLog.findFirst({
      where: {
        targetTable: 'users',
        targetId: studentId,
        action: {
          in: ['DEACTIVATE_STUDENT', 'ACTIVATE_STUDENT'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return !!(lastLog && lastLog.action === 'DEACTIVATE_STUDENT');
  }

  /**
   * Lists student users with filters, search, and page settings.
   * @param {Object} query
   */
  static async getStudents(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const where = { role: 'STUDENT' };

    // Search query mapping
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.cmaLevel) {
      where.cmaLevel = query.cmaLevel;
    }

    const [students, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cmaLevel: true,
          targetAttempt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Attach activation status to students by querying activity log state
    const studentsWithStatus = await Promise.all(
      students.map(async (student) => {
        const isDeactivated = await this.isStudentDeactivated(student.id);
        return {
          ...student,
          status: isDeactivated ? 'DEACTIVATED' : 'ACTIVE',
        };
      })
    );

    // If query.status filter is active
    let finalStudents = studentsWithStatus;
    let finalTotal = total;
    if (query.status) {
      finalStudents = studentsWithStatus.filter((s) => s.status === query.status);
      finalTotal = finalStudents.length;
    }

    return {
      students: finalStudents,
      pagination: {
        total: finalTotal,
        page,
        limit,
        pages: Math.ceil(finalTotal / limit),
      },
    };
  }

  /**
   * Retrieves complete student profile, planner targets, habits, and sessions.
   * @param {string} studentId
   */
  static async getStudentById(studentId) {
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        cmaLevel: true,
        targetAttempt: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user || user.role !== 'STUDENT') {
      throw ApiError.notFound('Student record not found');
    }

    const isDeactivated = await this.isStudentDeactivated(studentId);

    // Gather sub-modules summaries
    const [studyPlans, dailyCheckins, habits, bookings, doubts] = await Promise.all([
      // Study planner summary
      prisma.studyPlan.findMany({
        where: { userId: studentId },
        include: { subjects: true },
        orderBy: { createdAt: 'desc' },
      }),
      // Accountability checkins summary
      prisma.dailyCheckin.findMany({
        where: { userId: studentId },
        orderBy: { date: 'desc' },
        take: 10,
      }),
      // Habits list
      prisma.habit.findMany({
        where: { userId: studentId },
        include: { logs: { take: 5, orderBy: { date: 'desc' } } },
      }),
      // Bookings history
      prisma.mentorshipBooking.findMany({
        where: { studentId },
        include: {
          mentor: {
            select: { fullName: true, specialization: true },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5,
      }),
      // Doubts support history
      prisma.doubt.findMany({
        where: { studentId },
        include: {
          mentor: {
            select: { fullName: true, specialization: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      profile: {
        ...user,
        status: isDeactivated ? 'DEACTIVATED' : 'ACTIVE',
      },
      studyPlannerSummary: studyPlans,
      accountabilitySummary: {
        dailyCheckins,
        habits,
      },
      mentorshipSummary: {
        bookings,
        doubts,
      },
    };
  }

  /**
   * Activates or deactivates student accounts.
   * @param {string} studentId
   * @param {string} action - ACTIVATE_STUDENT or DEACTIVATE_STUDENT
   * @param {string} adminId
   * @param {string} ipAddress
   */
  static async toggleStudentStatus(studentId, action, adminId, ipAddress) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== 'STUDENT') {
      throw ApiError.notFound('Student not found');
    }

    const actionText = action === 'ACTIVATE' ? 'ACTIVATE_STUDENT' : 'DEACTIVATE_STUDENT';
    const descriptionText = action === 'ACTIVATE' 
      ? `Student account ${student.email} was activated`
      : `Student account ${student.email} was deactivated`;

    // Write to Activity Logs to track status
    await ActivityService.logActivity({
      adminId,
      action: actionText,
      targetTable: 'users',
      targetId: studentId,
      description: descriptionText,
      ipAddress,
    });

    return {
      studentId,
      status: action === 'ACTIVATE' ? 'ACTIVE' : 'DEACTIVATED',
    };
  }
}
