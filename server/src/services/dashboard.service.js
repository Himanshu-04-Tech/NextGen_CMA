/**
 * NextGen CMA — Admin Dashboard Statistics Service
 *
 * Gathers aggregate metrics, calculations for growth rates,
 * system health diagnostics, and recent dashboard activities.
 */

import { prisma } from '../config/db.js';

export class DashboardService {
  /**
   * Generates comprehensive statistics summary for the admin home view.
   */
  static async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Core aggregates
    const [
      totalStudents,
      totalMentors,
      activeStudyPlans,
      todayCheckins,
      totalBookings,
      pendingDoubts,
      completedReviews,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.mentor.count(),
      prisma.studyPlan.count({ where: { status: 'ACTIVE' } }),
      prisma.dailyCheckin.count({
        where: {
          date: {
            gte: today,
            lte: endOfToday,
          },
        },
      }),
      prisma.mentorshipBooking.count(),
      prisma.doubt.count({ where: { status: 'OPEN' } }),
      prisma.performanceReview.count(),
    ]);

    // 2. Calculate MoM growth rate of student accounts
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [currentMonthCount, lastMonthCount] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'STUDENT',
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
    ]);

    let growthRate = 0;
    if (lastMonthCount > 0) {
      growthRate = parseFloat((((currentMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(1));
    } else if (currentMonthCount > 0) {
      growthRate = 100.0;
    }

    // 3. Recent activity list
    const recentActivity = await prisma.activityLog.findMany({
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
      take: 5,
    });

    // 4. Recent students
    const recentStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        cmaLevel: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // 5. Recent mentors
    const recentMentors = await prisma.mentor.findMany({
      select: {
        id: true,
        fullName: true,
        specialization: true,
        rating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // 6. System health metrics mock placeholder
    const systemStatus = {
      apiStatus: 'HEALTHY',
      databaseStatus: 'CONNECTED',
      serverUptime: process.uptime(), // seconds
    };

    return {
      stats: {
        totalStudents,
        totalMentors,
        activeStudyPlans,
        todayCheckins,
        totalBookings,
        pendingDoubts,
        completedReviews,
        growthRate,
      },
      recentActivity,
      recentStudents,
      recentMentors,
      systemStatus,
    };
  }
}
