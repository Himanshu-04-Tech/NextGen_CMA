/**
 * NextGen CMA — Booking Service
 *
 * Implements business logic and Prisma database operations for
 * booking mentorship sessions, checking slot availability, rescheduling, and status tracking.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export class BookingService {
  /**
   * Helper to check if a mentor is available at a given time and has no conflicts.
   * @param {string} mentorId
   * @param {Date} scheduledAt
   * @returns {Promise<boolean>}
   */
  static async isSlotAvailable(mentorId, scheduledAt) {
    const dateObj = new Date(scheduledAt);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Format hours & minutes to HH:MM
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const timeVal = hours * 60 + parseInt(minutes, 10);

    // 1. Check if the mentor has designated availability for this day of week
    const availabilities = await prisma.mentorAvailability.findMany({
      where: {
        mentorId,
        dayOfWeek,
        isAvailable: true,
      },
    });

    if (availabilities.length === 0) {
      return false; // No availability on this day
    }

    // Check if the scheduled time falls within any availability window
    let matchesAvailability = false;
    let slotDuration = 30; // default duration

    for (const avail of availabilities) {
      const [startH, startM] = avail.startTime.split(':').map(Number);
      const [endH, endM] = avail.endTime.split(':').map(Number);
      const startVal = startH * 60 + startM;
      const endVal = endH * 60 + endM;

      if (timeVal >= startVal && timeVal < endVal) {
        matchesAvailability = true;
        slotDuration = avail.slotDuration;
        break;
      }
    }

    if (!matchesAvailability) {
      return false; // Outside of availability windows
    }

    // 2. Check for conflicting bookings at the same time (overlapping slot duration)
    // Find all bookings for this mentor on the same day that are not cancelled
    const startOfOverlap = new Date(dateObj.getTime() - (slotDuration - 1) * 60 * 1000);
    const endOfOverlap = new Date(dateObj.getTime() + (slotDuration - 1) * 60 * 1000);

    const conflicts = await prisma.mentorshipBooking.findFirst({
      where: {
        mentorId,
        scheduledAt: {
          gte: startOfOverlap,
          lte: endOfOverlap,
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'],
        },
      },
    });

    return !conflicts; // Available if no conflicts exist
  }

  /**
   * Creates a new mentorship booking.
   * @param {string} studentId - Student User ID
   * @param {Object} data - Booking payload
   */
  static async createBooking(studentId, data) {
    const { mentorId, scheduledAt, meetingPlatform, notes } = data;

    // Verify mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor || !mentor.isActive) {
      throw ApiError.badRequest('Selected mentor is not active or does not exist');
    }

    const dateScheduled = new Date(scheduledAt);

    // Verify slot availability
    const available = await this.isSlotAvailable(mentorId, dateScheduled);
    if (!available) {
      throw ApiError.conflict('The selected time slot is unavailable or conflicts with another booking');
    }

    // Generate meeting link placeholder or mock integration
    let meetingLink = null;
    if (meetingPlatform === 'GOOGLE_MEET') {
      meetingLink = `https://meet.google.com/cma-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
    } else if (meetingPlatform === 'ZOOM') {
      meetingLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
    }

    return await prisma.mentorshipBooking.create({
      data: {
        studentId,
        mentorId,
        scheduledAt: dateScheduled,
        meetingPlatform,
        meetingLink,
        status: 'PENDING',
        notes,
      },
      include: {
        mentor: {
          select: {
            fullName: true,
            specialization: true,
            profileImage: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves bookings based on user identity and filters.
   * @param {string} userId
   * @param {string} role
   * @param {Object} [filters]
   */
  static async getBookings(userId, role, filters = {}) {
    const where = {};

    if (role === 'STUDENT') {
      where.studentId = userId;
    } else if (role === 'MENTOR') {
      // Find the mentor profile first
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

    return await prisma.mentorshipBooking.findMany({
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
        scheduledAt: 'asc',
      },
    });
  }

  /**
   * Retrieves detail of a single booking.
   * @param {string} id
   * @param {string} userId
   * @param {string} role
   */
  static async getBookingById(id, userId, role) {
    const booking = await prisma.mentorshipBooking.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            cmaLevel: true,
            profileImage: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Auth check: Admin, the booking student, or the booking mentor
    if (role === 'STUDENT' && booking.studentId !== userId) {
      throw ApiError.forbidden('Access denied to this booking details');
    }

    if (role === 'MENTOR' && booking.mentor.userId !== userId) {
      throw ApiError.forbidden('Access denied to this booking details');
    }

    return booking;
  }

  /**
   * Reschedules an existing booking.
   * @param {string} id - Booking ID
   * @param {string} userId - User ID requesting
   * @param {string} role - Role
   * @param {Object} data - Update data
   */
  static async rescheduleBooking(id, userId, role, data) {
    const booking = await this.getBookingById(id, userId, role);

    // Block rescheduling completed or cancelled bookings
    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw ApiError.badRequest('Cannot reschedule bookings that are already completed or cancelled');
    }

    const { scheduledAt, meetingPlatform, notes } = data;
    const newScheduledDate = new Date(scheduledAt);

    // Verify slot availability
    const available = await this.isSlotAvailable(booking.mentorId, newScheduledDate);
    if (!available) {
      throw ApiError.conflict('The selected reschedule slot is unavailable or conflicts with another booking');
    }

    const updateData = {
      scheduledAt: newScheduledDate,
      status: 'RESCHEDULED',
    };

    if (meetingPlatform) {
      updateData.meetingPlatform = meetingPlatform;
      if (meetingPlatform === 'GOOGLE_MEET') {
        updateData.meetingLink = `https://meet.google.com/cma-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
      } else if (meetingPlatform === 'ZOOM') {
        updateData.meetingLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
      } else {
        updateData.meetingLink = null;
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    return await prisma.mentorshipBooking.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Updates booking status (CONFIRMED, CANCELLED, COMPLETED).
   * @param {string} id
   * @param {string} userId
   * @param {string} role
   * @param {string} status
   */
  static async updateBookingStatus(id, userId, role, status) {
    const booking = await this.getBookingById(id, userId, role);

    if (role === 'STUDENT' && status !== 'CANCELLED') {
      throw ApiError.forbidden('Students are only authorized to cancel bookings');
    }

    return await prisma.mentorshipBooking.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Deletes a booking from the database (or marks cancelled).
   * @param {string} id
   * @param {string} userId
   * @param {string} role
   */
  static async deleteBooking(id, userId, role) {
    const booking = await this.getBookingById(id, userId, role);

    // Delete or cancel depending on policy
    await prisma.mentorshipBooking.delete({
      where: { id },
    });

    return true;
  }
}
