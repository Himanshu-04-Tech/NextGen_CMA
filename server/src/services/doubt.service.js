/**
 * NextGen CMA — Doubt Service
 *
 * Implements business logic and database queries for student doubts support,
 * replies conversation history, and status resolutions.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export class DoubtService {
  /**
   * Raises a new student doubt.
   * @param {string} studentId
   * @param {Object} data
   */
  static async createDoubt(studentId, data) {
    const { mentorId, subject, questionTitle, questionText, attachmentUrl, priority } = data;

    // Verify mentor profile exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      throw ApiError.notFound('Selected mentor profile not found');
    }

    return await prisma.doubt.create({
      data: {
        studentId,
        mentorId,
        subject,
        questionTitle,
        questionText,
        attachmentUrl,
        priority,
        status: 'OPEN',
      },
      include: {
        mentor: {
          select: {
            fullName: true,
            specialization: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves doubts based on actor role and filters.
   * @param {string} userId
   * @param {string} role
   * @param {Object} [filters]
   */
  static async getDoubts(userId, role, filters = {}) {
    const where = {};

    if (role === 'STUDENT') {
      where.studentId = userId;
    } else if (role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { userId },
      });
      if (!mentor) {
        throw ApiError.notFound('Mentor profile not found for this user');
      }
      where.mentorId = mentor.id;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    return await prisma.doubt.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        mentor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Retrieves single doubt thread with complete conversation history.
   * @param {string} id
   * @param {string} userId
   * @param {string} role
   */
  static async getDoubtById(id, userId, role) {
    const doubt = await prisma.doubt.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        replies: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!doubt) {
      throw ApiError.notFound('Doubt record not found');
    }

    // Role-based auth check: Student who raised it, the assigned Mentor, or Admin
    if (role === 'STUDENT' && doubt.studentId !== userId) {
      throw ApiError.forbidden('You do not have access to view this doubt thread');
    }

    if (role === 'MENTOR' && doubt.mentor.userId !== userId) {
      throw ApiError.forbidden('You do not have access to view this doubt thread');
    }

    return doubt;
  }

  /**
   * Updates doubt status (e.g. RESOLVED).
   * @param {string} id
   * @param {string} status
   * @param {string} userId
   * @param {string} role
   */
  static async updateDoubtStatus(id, status, userId, role) {
    // Validate doubt exists and actor has access
    const doubt = await this.getDoubtById(id, userId, role);

    return await prisma.doubt.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Appends a new message reply to a doubt thread.
   * @param {string} doubtId
   * @param {string} senderId - User ID of replier
   * @param {string} message
   * @param {string} [attachmentUrl]
   */
  static async addReply(doubtId, senderId, message, attachmentUrl) {
    // Validate doubt exists (requires a user role context check; sender must belong to doubt)
    const user = await prisma.user.findUnique({
      where: { id: senderId },
      select: { role: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User sending reply does not exist');
    }

    const doubt = await this.getDoubtById(doubtId, senderId, user.role);

    // Create the reply and update status automatically
    return await prisma.$transaction(async (tx) => {
      const reply = await tx.doubtReply.create({
        data: {
          doubtId,
          senderId,
          message,
          attachmentUrl,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
              profileImage: true,
            },
          },
        },
      });

      // Update doubt status to PENDING_REPLY if student replies, or keep OPEN / mark pending student review
      const newStatus = user.role === 'STUDENT' ? 'OPEN' : 'PENDING_REPLY';

      await tx.doubt.update({
        where: { id: doubtId },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      return reply;
    });
  }
}
