/**
 * NextGen CMA — Mentor Service
 *
 * Implements business logic and Prisma database operations for
 * managing mentor profiles, searching/filtering mentors, and availability schedules.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { formatAvailabilitySlots } from '../utils/availability.js';

export class MentorService {
  /**
   * Retrieves active mentors with optional specialization and minimum rating filters.
   * @param {Object} filters
   * @param {string} [filters.specialization]
   * @param {number} [filters.minRating]
   * @param {string} [filters.search]
   */
  static async getMentors(filters = {}) {
    const { specialization, minRating, search } = filters;
    const where = { isActive: true };

    if (specialization) {
      where.specialization = {
        contains: specialization,
        mode: 'insensitive',
      };
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating),
      };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const mentors = await prisma.mentor.findMany({
      where,
      include: {
        availabilities: {
          where: { isAvailable: true },
        },
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return mentors.map((m) => ({
      ...m,
      availability: m.availability || formatAvailabilitySlots(m.availabilities),
    }));
  }

  /**
   * Retrieves a single mentor profile by UUID.
   * @param {string} id - Mentor ID
   */
  static async getMentorById(id) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        availabilities: true,
        user: {
          select: {
            email: true,
            phone: true,
            cmaLevel: true,
          },
        },
        reviews: {
          orderBy: {
            reviewDate: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found');
    }

    return {
      ...mentor,
      availability: mentor.availability || formatAvailabilitySlots(mentor.availabilities),
    };
  }

  /**
   * Retrieves a mentor profile by associated User ID.
   * @param {string} userId
   */
  static async getMentorByUserId(userId) {
    const mentor = await prisma.mentor.findUnique({
      where: { userId },
      include: {
        availabilities: true,
      },
    });

    if (!mentor) return null;

    return {
      ...mentor,
      availability: mentor.availability || formatAvailabilitySlots(mentor.availabilities),
    };
  }

  /**
   * Admin: Creates a new Mentor profile. Ensures user exists and is a MENTOR.
   * @param {Object} data
   */
  static async createMentor(data) {
    const {
      userId,
      fullName,
      bio,
      profileImage,
      specialization,
      experience,
      qualification,
      availability,
      isActive,
      subjects,
      teachingStyle,
      languages,
      meetingPlatforms,
      responseTime,
      linkedinUrl,
      websiteUrl,
      professionalEmail,
      certificates,
      achievements,
    } = data;

    // Verify user exists and is a MENTOR
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('Target user for mentor profile not found');
    }

    if (user.role !== 'MENTOR' && user.role !== 'ADMIN') {
      // Force change role to MENTOR for compatibility
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'MENTOR' },
      });
    }

    // Check if mentor profile already exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { userId },
    });

    if (existingMentor) {
      throw ApiError.conflict('A mentor profile already exists for this user');
    }

    return await prisma.mentor.create({
      data: {
        userId,
        fullName,
        bio,
        profileImage: profileImage || user.profileImage,
        specialization,
        experience: parseInt(experience, 10),
        qualification,
        availability,
        isActive: isActive !== undefined ? isActive : true,
        subjects,
        teachingStyle,
        languages,
        meetingPlatforms,
        responseTime,
        linkedinUrl,
        websiteUrl,
        professionalEmail,
        certificates,
        achievements,
      },
    });
  }

  /**
   * Updates an existing mentor profile.
   * @param {string} id - Mentor ID
   * @param {Object} data - Updated fields
   * @param {string} requestorId - User ID making request
   * @param {string} role - Role of requestor
   */
  static async updateMentor(id, data, requestorId, role) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found');
    }

    // Authorization check: Admin or the Mentor themselves
    if (role !== 'ADMIN' && mentor.userId !== requestorId) {
      throw ApiError.forbidden('You are not authorized to edit this mentor profile');
    }

    const updateData = { ...data };
    if (updateData.experience !== undefined) {
      updateData.experience = parseInt(updateData.experience, 10);
    }

    return await prisma.mentor.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Admin: Deletes a mentor profile.
   * @param {string} id
   */
  static async deleteMentor(id) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found');
    }

    // Delete mentor profile (cascades or cleans availability, bookings, reviews)
    await prisma.mentor.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Updates recurring availability slots for a mentor.
   * Wipes previous availabilities and schedules new ones.
   * @param {string} mentorId
   * @param {Array} slots
   */
  static async updateAvailability(mentorId, slots = []) {
    // Verify mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor not found');
    }

    // Execute in transaction: delete old, insert new, and sync summary string
    return await prisma.$transaction(async (tx) => {
      await tx.mentorAvailability.deleteMany({
        where: { mentorId },
      });

      if (slots.length > 0) {
        await tx.mentorAvailability.createMany({
          data: slots.map((s) => ({
            mentorId,
            dayOfWeek: Number(s.dayOfWeek),
            startTime: s.startTime,
            endTime: s.endTime,
            slotDuration: s.slotDuration || 30,
            isAvailable: s.isAvailable !== undefined ? s.isAvailable : true,
          })),
        });
      }

      const formattedSummary = formatAvailabilitySlots(slots);
      await tx.mentor.update({
        where: { id: mentorId },
        data: { availability: formattedSummary },
      });

      return await tx.mentorAvailability.findMany({
        where: { mentorId },
      });
    });
  }
}
