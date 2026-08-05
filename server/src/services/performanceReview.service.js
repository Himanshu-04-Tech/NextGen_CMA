/**
 * NextGen CMA — Performance Review Service
 *
 * Implements business logic and DB transactions for creating, updating,
 * and listing student progress reviews and strategy recommendations.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export class PerformanceReviewService {
  /**
   * Creates a student performance review. (Mentor only)
   * @param {string} mentorUserId - User ID of evaluating mentor
   * @param {Object} data - Review contents
   */
  static async createReview(mentorUserId, data) {
    const { studentId, overallScore, strengths, weaknesses, actionItems, mentorNotes, nextReviewDate } = data;

    // Find mentor profile
    const mentor = await prisma.mentor.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found for current session');
    }

    // Verify student exists and has STUDENT role
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== 'STUDENT') {
      throw ApiError.badRequest('Selected user is not a student');
    }

    return await prisma.performanceReview.create({
      data: {
        studentId,
        mentorId: mentor.id,
        reviewDate: new Date(),
        overallScore: parseFloat(overallScore),
        strengths,
        weaknesses,
        actionItems,
        mentorNotes,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves list of reviews depending on user role.
   * @param {string} userId
   * @param {string} role
   */
  static async getReviews(userId, role) {
    const where = {};

    if (role === 'STUDENT') {
      where.studentId = userId;
    } else if (role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { userId },
      });
      if (!mentor) {
        throw ApiError.notFound('Mentor profile not found for current user');
      }
      where.mentorId = mentor.id;
    }

    return await prisma.performanceReview.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            cmaLevel: true,
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
        reviewDate: 'desc',
      },
    });
  }

  /**
   * Updates an existing performance review.
   * @param {string} id - Review ID
   * @param {string} mentorUserId - User ID of updating mentor
   * @param {string} role - Role
   * @param {Object} data - Updated fields
   */
  static async updateReview(id, mentorUserId, role, data) {
    const review = await prisma.performanceReview.findUnique({
      where: { id },
      include: {
        mentor: true,
      },
    });

    if (!review) {
      throw ApiError.notFound('Performance review not found');
    }

    // Auth check: Admin or the Mentor who wrote it
    if (role !== 'ADMIN' && review.mentor.userId !== mentorUserId) {
      throw ApiError.forbidden('You are not authorized to edit this review');
    }

    const updateData = { ...data };
    
    if (updateData.overallScore !== undefined) {
      updateData.overallScore = parseFloat(updateData.overallScore);
    }
    if (updateData.nextReviewDate !== undefined) {
      updateData.nextReviewDate = updateData.nextReviewDate ? new Date(updateData.nextReviewDate) : null;
    }

    return await prisma.performanceReview.update({
      where: { id },
      data: updateData,
    });
  }
}
