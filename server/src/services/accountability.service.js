/**
 * NextGen CMA — Accountability Service
 *
 * Implements business operations for daily check-ins, habit tracking,
 * automated streaks updating, reminder configurations, and progress comparisons.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export class AccountabilityService {
  
  // ── Daily Check-ins ──

  /**
   * Submit a daily check-in and update streaks
   */
  static async createCheckin(userId, data) {
    const { hoursStudied, topicsCovered, moodRating, energyRating, blockers, notes } = data;
    
    // Parse target date to midnight UTC
    const checkinDate = data.date ? new Date(data.date) : new Date();
    checkinDate.setUTCHours(0, 0, 0, 0);

    const addedHours = parseFloat(hoursStudied) || 0;
    const finalTopics = topicsCovered?.trim() || 'General Study';
    const finalMood = moodRating ? parseInt(moodRating) : 3;
    const finalEnergy = energyRating ? parseInt(energyRating) : 3;

    // Check if check-in for the same day exists
    const existingCheckin = await prisma.dailyCheckin.findUnique({
      where: {
        userId_date: {
          userId,
          date: checkinDate
        }
      }
    });

    if (existingCheckin) {
      // Accumulate hours and combine notes/topics for the day
      const newHours = Math.min(24, Math.round((existingCheckin.hoursStudied + addedHours) * 100) / 100);
      const combinedNotes = notes?.trim()
        ? (existingCheckin.notes ? `${existingCheckin.notes}\n${notes.trim()}` : notes.trim())
        : existingCheckin.notes;
      const combinedTopics = topicsCovered?.trim()
        ? (existingCheckin.topicsCovered && existingCheckin.topicsCovered !== 'General Study'
            ? `${existingCheckin.topicsCovered}, ${topicsCovered.trim()}`
            : topicsCovered.trim())
        : existingCheckin.topicsCovered;

      return await prisma.dailyCheckin.update({
        where: { id: existingCheckin.id },
        data: {
          hoursStudied: newHours,
          topicsCovered: combinedTopics,
          notes: combinedNotes,
          moodRating: moodRating ? parseInt(moodRating) : existingCheckin.moodRating,
          energyRating: energyRating ? parseInt(energyRating) : existingCheckin.energyRating,
          blockers: blockers?.trim() || existingCheckin.blockers
        }
      });
    }

    // Read today's active study plan
    const activePlan = await prisma.studyPlan.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    const checkin = await prisma.dailyCheckin.create({
      data: {
        userId,
        studyPlanId: activePlan ? activePlan.id : null,
        date: checkinDate,
        hoursStudied: addedHours,
        topicsCovered: finalTopics,
        moodRating: finalMood,
        energyRating: finalEnergy,
        blockers: blockers?.trim() || null,
        notes: notes?.trim() || null
      }
    });

    // ── Streak Calculation System ──
    let streak = await prisma.streak.findUnique({
      where: { userId }
    });

    if (!streak) {
      // First check-in ever
      await prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastCheckinDate: checkinDate,
          totalCheckins: 1
        }
      });
    } else {
      const lastDate = new Date(streak.lastCheckinDate);
      lastDate.setUTCHours(0, 0, 0, 0);

      const diffTime = checkinDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      let newCurrentStreak = streak.currentStreak;
      let newLongestStreak = streak.longestStreak;

      if (diffDays === 1) {
        // Consecutive check-in
        newCurrentStreak += 1;
        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }
      } else if (diffDays > 1) {
        // Streak broken
        newCurrentStreak = 1;
      } else if (diffDays === 0) {
        // Same day checkin (handled by unique constraint, but safe fallback)
        return checkin;
      }

      await prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastCheckinDate: checkinDate,
          totalCheckins: { increment: 1 }
        }
      });
    }

    // Automatically check off the matching daily study plan targets for this date
    if (activePlan) {
      // Try to find target scheduled for checkinDate
      const activeTargets = await prisma.dailyTarget.findMany({
        where: {
          planId: activePlan.id,
          date: {
            gte: checkinDate,
            lt: new Date(checkinDate.getTime() + 24 * 60 * 60 * 1000)
          },
          status: 'PENDING'
        }
      });

      if (activeTargets.length > 0) {
        for (const target of activeTargets) {
          await prisma.dailyTarget.update({
            where: { id: target.id },
            data: { status: 'COMPLETED' }
          });

          // Increment study_plan_subjects completed count
          const parts = target.topic.split(':');
          if (parts.length > 1) {
            const subjectName = parts[0].trim();
            const subjectRecord = await prisma.studyPlanSubject.findFirst({
              where: { planId: activePlan.id, subjectName: { contains: subjectName } }
            });

            if (subjectRecord && subjectRecord.completedTopics < subjectRecord.totalTopics) {
              await prisma.studyPlanSubject.update({
                where: { id: subjectRecord.id },
                data: { completedTopics: { increment: 1 } }
              });
            }
          }
        }
      }
    }

    return checkin;
  }

  static async getCheckins(userId, queryOptions = {}) {
    const { startDate, endDate } = queryOptions;
    const filter = { userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.gte = new Date(startDate);
      if (endDate) filter.date.lte = new Date(endDate);
    }

    return await prisma.dailyCheckin.findMany({
      where: filter,
      orderBy: { date: 'desc' }
    });
  }

  static async getCheckinById(checkinId, requestorId, role) {
    const checkin = await prisma.dailyCheckin.findUnique({
      where: { id: checkinId }
    });

    if (!checkin) {
      throw ApiError.notFound('Checkin record not found.');
    }

    if (role === 'STUDENT' && checkin.userId !== requestorId) {
      throw ApiError.forbidden('Forbidden: You can only view your own check-ins.');
    }

    return checkin;
  }

  static async updateCheckin(checkinId, userId, data, role) {
    const checkin = await prisma.dailyCheckin.findUnique({
      where: { id: checkinId }
    });

    if (!checkin) {
      throw ApiError.notFound('Checkin record not found.');
    }

    if (role === 'STUDENT' && checkin.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this check-in.');
    }

    const { hoursStudied, topicsCovered, moodRating, energyRating, blockers, notes } = data;

    return await prisma.dailyCheckin.update({
      where: { id: checkinId },
      data: {
        hoursStudied: hoursStudied !== undefined ? parseFloat(hoursStudied) : undefined,
        topicsCovered,
        moodRating: moodRating !== undefined ? parseInt(moodRating) : undefined,
        energyRating: energyRating !== undefined ? parseInt(energyRating) : undefined,
        blockers,
        notes
      }
    });
  }

  static async deleteCheckin(checkinId, userId, role) {
    const checkin = await prisma.dailyCheckin.findUnique({
      where: { id: checkinId }
    });

    if (!checkin) {
      throw ApiError.notFound('Checkin record not found.');
    }

    if (role === 'STUDENT' && checkin.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot delete this check-in.');
    }

    await prisma.dailyCheckin.delete({
      where: { id: checkinId }
    });

    return { success: true };
  }

  // ── Habits Tracker ──

  static async createHabit(userId, habitData) {
    const { habitName, description, frequency, targetValue, unit } = habitData;

    if (!habitName || !habitName.trim()) {
      throw ApiError.badRequest('Habit name is required.');
    }

    const existing = await prisma.habit.findFirst({
      where: {
        userId,
        isActive: true,
        habitName: { equals: habitName.trim(), mode: 'insensitive' }
      }
    });

    if (existing) {
      throw ApiError.badRequest('A habit with this name already exists.');
    }

    return await prisma.habit.create({
      data: {
        userId,
        habitName: habitName.trim(),
        description: description ? description.trim() : null,
        frequency: frequency || 'DAILY',
        targetValue: parseFloat(targetValue),
        unit: unit ? unit.trim() : 'Session',
        isActive: true
      }
    });
  }

  static async getHabits(userId) {
    return await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 30 // fetch last 30 logs for trends
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateHabit(habitId, userId, data, role) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (!habit) {
      throw ApiError.notFound('Habit not found.');
    }

    if (role === 'STUDENT' && habit.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this habit.');
    }

    const { habitName, description, frequency, targetValue, unit, isActive } = data;

    if (habitName && habitName.trim()) {
      const duplicate = await prisma.habit.findFirst({
        where: {
          userId: habit.userId,
          id: { not: habitId },
          isActive: true,
          habitName: { equals: habitName.trim(), mode: 'insensitive' }
        }
      });
      if (duplicate) {
        throw ApiError.badRequest('Another habit with this name already exists.');
      }
    }

    return await prisma.habit.update({
      where: { id: habitId },
      data: {
        habitName: habitName !== undefined ? habitName.trim() : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        frequency,
        targetValue: targetValue !== undefined ? parseFloat(targetValue) : undefined,
        unit: unit !== undefined ? unit.trim() : undefined,
        isActive
      }
    });
  }

  static async deleteHabit(habitId, userId, role) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (!habit) {
      throw ApiError.notFound('Habit not found.');
    }

    if (role === 'STUDENT' && habit.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot delete this habit.');
    }

    await prisma.habit.delete({
      where: { id: habitId }
    });

    return { success: true };
  }

  // ── Habit Logging ──

  static async logHabit(habitId, userId, logData, role) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (!habit) {
      throw ApiError.notFound('Habit not found.');
    }

    if (role === 'STUDENT' && habit.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot log progress for this habit.');
    }

    const { completed, completedValue, notes } = logData;
    const logDate = new Date(logData.date);
    logDate.setUTCHours(0, 0, 0, 0);

    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: logDate
        }
      },
      update: {
        completed,
        completedValue: parseFloat(completedValue),
        notes
      },
      create: {
        habitId,
        date: logDate,
        completed,
        completedValue: parseFloat(completedValue),
        notes
      }
    });

    return log;
  }

  static async getHabitLogs(habitId, userId, role) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (!habit) {
      throw ApiError.notFound('Habit not found.');
    }

    if (role === 'STUDENT' && habit.userId !== userId) {
      throw ApiError.forbidden('Forbidden: Access denied.');
    }

    return await prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' }
    });
  }

  // ── Streaks ──

  static async getStreak(userId) {
    let streak = await prisma.streak.findUnique({
      where: { userId }
    });

    if (!streak) {
      // Return default empty state
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCheckins: 0,
        consistencyPercentage: 0,
        missedDays: 0
      };
    }

    // Calculate missed days & consistency rate since plan creation
    const activePlan = await prisma.studyPlan.findFirst({
      where: { userId, status: 'ACTIVE' }
    });

    let missedDays = 0;
    let consistencyPercentage = 0;

    if (activePlan) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const planStart = new Date(activePlan.createdAt);
      planStart.setUTCHours(0, 0, 0, 0);

      const diffTime = today.getTime() - planStart.getTime();
      const totalPassedDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

      missedDays = Math.max(0, totalPassedDays - streak.totalCheckins);
      consistencyPercentage = Math.min(100, Math.round((streak.totalCheckins / totalPassedDays) * 100));
    }

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalCheckins: streak.totalCheckins,
      lastCheckinDate: streak.lastCheckinDate,
      consistencyPercentage,
      missedDays
    };
  }

  // ── Reminders preferences ──

  static async getReminderSettings(userId) {
    let settings = await prisma.reminderSetting.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await prisma.reminderSetting.create({
        data: {
          userId,
          dailyCheckinTime: '20:00',
          emailEnabled: true,
          whatsappEnabled: false,
          pushEnabled: false
        }
      });
    }

    return settings;
  }

  static async updateReminderSettings(userId, settingsData) {
    const { dailyCheckinTime, emailEnabled, whatsappEnabled, pushEnabled } = settingsData;

    return await prisma.reminderSetting.upsert({
      where: { userId },
      update: {
        dailyCheckinTime,
        emailEnabled,
        whatsappEnabled,
        pushEnabled
      },
      create: {
        userId,
        dailyCheckinTime,
        emailEnabled,
        whatsappEnabled,
        pushEnabled
      }
    });
  }

  // ── Progress Analytics integration with Module 4 ──

  static async getAnalytics(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get last 30 days checkins
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    startDate.setUTCHours(0, 0, 0, 0);

    const checkins = await prisma.dailyCheckin.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: today
        }
      },
      orderBy: { date: 'asc' }
    });

    // 1. Study Hours comparison (Planned vs Actual)
    // Read study targets from Module 4
    const activePlan = await prisma.studyPlan.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        dailyTargets: true
      }
    });

    const plannedHoursMap = {};
    if (activePlan) {
      activePlan.dailyTargets.forEach((target) => {
        const d = new Date(target.date);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        plannedHoursMap[key] = (plannedHoursMap[key] || 0) + target.studyHours;
      });
    }

    const comparisonData = [];
    const dateCursor = new Date(startDate);

    while (dateCursor <= today) {
      const year = dateCursor.getUTCFullYear();
      const month = String(dateCursor.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateCursor.getUTCDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const checkinRecord = checkins.find((c) => {
        const cd = new Date(c.date);
        const cKey = `${cd.getUTCFullYear()}-${String(cd.getUTCMonth() + 1).padStart(2, '0')}-${String(cd.getUTCDate()).padStart(2, '0')}`;
        return cKey === dateKey;
      });

      const actualHours = checkinRecord ? checkinRecord.hoursStudied : 0;
      // Default planned to activePlan hours if target not specified
      const plannedHours = plannedHoursMap[dateKey] !== undefined ? plannedHoursMap[dateKey] : (activePlan ? activePlan.dailyStudyHours : 0);

      comparisonData.push({
        date: dateKey,
        label: dateCursor.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        plannedHours,
        actualHours,
        difference: actualHours - plannedHours,
        completionPercentage: plannedHours > 0 ? Math.round((actualHours / plannedHours) * 100) : 0
      });

      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    // 2. Habits Completion success rate
    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        logs: {
          where: {
            date: {
              gte: startDate,
              lte: today
            }
          }
        }
      }
    });

    const habitsSuccessRate = habits.map((habit) => {
      const totalLoggedDays = habit.logs.length;
      const completedDays = habit.logs.filter(l => l.completed).length;
      const successRate = totalLoggedDays > 0 ? Math.round((completedDays / totalLoggedDays) * 100) : 0;
      
      return {
        habitId: habit.id,
        habitName: habit.habitName,
        successRate,
        completedCount: completedDays,
        loggedCount: totalLoggedDays
      };
    });

    // 3. Calendar Heatmap representation (last 90 days)
    const heatmapStartDate = new Date();
    heatmapStartDate.setDate(today.getDate() - 90);
    heatmapStartDate.setUTCHours(0,0,0,0);

    const heatmapCheckins = await prisma.dailyCheckin.findMany({
      where: {
        userId,
        date: {
          gte: heatmapStartDate,
          lte: today
        }
      }
    });

    const heatmapData = heatmapCheckins.map((c) => {
      const cd = new Date(c.date);
      const formattedDate = `${cd.getUTCFullYear()}-${String(cd.getUTCMonth() + 1).padStart(2, '0')}-${String(cd.getUTCDate()).padStart(2, '0')}`;
      return {
        date: formattedDate,
        value: c.hoursStudied,
        mood: c.moodRating,
        energy: c.energyRating
      };
    });

    return {
      comparisonData,
      habitsSuccessRate,
      heatmapData,
      overallStats: {
        totalStudiedHours: checkins.reduce((sum, c) => sum + c.hoursStudied, 0),
        averageMood: checkins.length > 0 ? parseFloat((checkins.reduce((sum, c) => sum + c.moodRating, 0) / checkins.length).toFixed(1)) : 0,
        averageEnergy: checkins.length > 0 ? parseFloat((checkins.reduce((sum, c) => sum + c.energyRating, 0) / checkins.length).toFixed(1)) : 0
      }
    };
  }
}
