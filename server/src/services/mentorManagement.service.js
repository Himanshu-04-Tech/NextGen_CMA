/**
 * NextGen CMA — Mentor Management Service
 *
 * Implements business operations for creating, editing, and deleting mentor accounts,
 * resetting credentials, generating temp passwords, and recording student assignments.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword } from '../utils/password.js';
import { ActivityService } from './activity.service.js';

export class MentorManagementService {
  /**
   * Lists all mentors inside database.
   */
  static async getMentors(query = {}) {
    const where = {};
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { specialization: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.mentor.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Creates a User account of role MENTOR and creates their Mentor profile.
   */
  static async createMentor(data, adminId, ipAddress) {
    const { fullName, email, phone, password, specialization, qualification, experience, profileImage } = data;

    // Verify email and phone uniqueness
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone },
        ],
      },
    });

    if (existing) {
      throw ApiError.conflict('User with this email or phone already exists');
    }

    const hashedPassword = await hashPassword(password);

    return await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name: fullName,
          email: email.toLowerCase(),
          phone,
          password: hashedPassword,
          role: 'MENTOR',
          profileImage,
        },
      });

      // 2. Create Mentor Profile
      const mentor = await tx.mentor.create({
        data: {
          userId: user.id,
          fullName,
          bio: `CMA Mentor specializing in ${specialization}.`,
          profileImage,
          specialization,
          experience: parseInt(experience, 10),
          qualification,
          isActive: true,
        },
      });

      // 3. Log Action
      await ActivityService.logActivity({
        adminId,
        action: 'CREATE_MENTOR',
        targetTable: 'mentors',
        targetId: mentor.id,
        description: `Created mentor profile for ${email}`,
        ipAddress,
      });

      return { user, mentor };
    });
  }

  /**
   * Updates mentor profile fields and optionally their User fields.
   */
  static async updateMentor(id, data, adminId, ipAddress) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found');
    }

    return await prisma.$transaction(async (tx) => {
      const updateMentorData = {};
      const updateUserData = {};

      if (data.fullName) {
        updateMentorData.fullName = data.fullName;
        updateUserData.name = data.fullName;
      }
      if (data.specialization) updateMentorData.specialization = data.specialization;
      if (data.qualification) updateMentorData.qualification = data.qualification;
      if (data.experience) updateMentorData.experience = parseInt(data.experience, 10);
      if (data.profileImage) {
        updateMentorData.profileImage = data.profileImage;
        updateUserData.profileImage = data.profileImage;
      }
      if (data.isActive !== undefined) updateMentorData.isActive = data.isActive;

      if (data.email) {
        // Unique check
        const dup = await tx.user.findFirst({
          where: {
            email: data.email.toLowerCase(),
            NOT: { id: mentor.userId },
          },
        });
        if (dup) throw ApiError.conflict('Email already taken');
        updateUserData.email = data.email.toLowerCase();
      }

      if (data.phone) {
        const dup = await tx.user.findFirst({
          where: {
            phone: data.phone,
            NOT: { id: mentor.userId },
          },
        });
        if (dup) throw ApiError.conflict('Phone already taken');
        updateUserData.phone = data.phone;
      }

      // Update User
      if (Object.keys(updateUserData).length > 0) {
        await tx.user.update({
          where: { id: mentor.userId },
          data: updateUserData,
        });
      }

      // Update Mentor profile
      const updatedMentor = await tx.mentor.update({
        where: { id },
        data: updateMentorData,
      });

      await ActivityService.logActivity({
        adminId,
        action: 'UPDATE_MENTOR',
        targetTable: 'mentors',
        targetId: id,
        description: `Updated mentor profile details for ${mentor.fullName}`,
        ipAddress,
      });

      return updatedMentor;
    });
  }

  /**
   * Admin: Deletes a mentor account (Cascades to user, bookings, etc.).
   */
  static async deleteMentor(id, adminId, ipAddress) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found');
    }

    await prisma.$transaction(async (tx) => {
      // Deleting the User cascades and deletes the Mentor profile
      await tx.user.delete({
        where: { id: mentor.userId },
      });

      await ActivityService.logActivity({
        adminId,
        action: 'DELETE_MENTOR',
        targetTable: 'users',
        targetId: mentor.userId,
        description: `Deleted mentor account for ${mentor.fullName}`,
        ipAddress,
      });
    });

    return true;
  }

  /**
   * Resets credentials and issues a temporary password.
   */
  static async generateTempPassword(id, adminId, ipAddress) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor not found');
    }

    const tempPassword = `Temp@${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedPassword = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: mentor.userId },
      data: { password: hashedPassword },
    });

    await ActivityService.logActivity({
      adminId,
      action: 'RESET_MENTOR_PASSWORD',
      targetTable: 'users',
      targetId: mentor.userId,
      description: `Generated temporary password for mentor ${mentor.fullName}`,
      ipAddress,
    });

    return tempPassword;
  }

  /**
   * Registers a list of student-mentor associations.
   */
  static async assignStudents(id, studentIds, adminId, ipAddress) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
    });

    if (!mentor) {
      throw ApiError.notFound('Mentor not found');
    }

    // Verify students exist
    const studentsCount = await prisma.user.count({
      where: {
        id: { in: studentIds },
        role: 'STUDENT',
      },
    });

    if (studentsCount !== studentIds.length) {
      throw ApiError.badRequest('One or more selected student IDs are invalid or not students');
    }

    // Log the assignments in the Audit Trail
    await ActivityService.logActivity({
      adminId,
      action: 'ASSIGN_STUDENT_MENTOR',
      targetTable: 'mentors',
      targetId: id,
      description: `Assigned students [${studentIds.join(', ')}] to mentor ${mentor.fullName}`,
      ipAddress,
    });

    return true;
  }
}
