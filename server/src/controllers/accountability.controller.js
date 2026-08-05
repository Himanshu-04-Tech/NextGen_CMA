/**
 * NextGen CMA — Accountability Controller
 *
 * Exposes controllers for study check-ins, streaks, habit tracking, and reminder settings.
 */

import { AccountabilityService } from '../services/accountability.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// ── Daily Check-ins ──

export const createCheckin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const checkin = await AccountabilityService.createCheckin(userId, req.body);
    return ApiResponse.created('Daily check-in submitted successfully', checkin).send(res);
  } catch (error) {
    next(error);
  }
};

export const getCheckins = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const checkins = await AccountabilityService.getCheckins(userId, req.query);
    return ApiResponse.ok('Check-in records retrieved successfully', checkins).send(res);
  } catch (error) {
    next(error);
  }
};

export const getCheckinById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestorId = req.user.id;
    const role = req.user.role;

    const checkin = await AccountabilityService.getCheckinById(id, requestorId, role);
    return ApiResponse.ok('Check-in details retrieved successfully', checkin).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateCheckin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await AccountabilityService.updateCheckin(id, userId, req.body, role);
    return ApiResponse.ok('Check-in details updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteCheckin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    await AccountabilityService.deleteCheckin(id, userId, role);
    return ApiResponse.ok('Check-in record deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

// ── Habits Tracker ──

export const createHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habit = await AccountabilityService.createHabit(userId, req.body);
    return ApiResponse.created('Habit created successfully', habit).send(res);
  } catch (error) {
    next(error);
  }
};

export const getHabits = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const habits = await AccountabilityService.getHabits(userId);
    return ApiResponse.ok('Habits list retrieved successfully', habits).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await AccountabilityService.updateHabit(id, userId, req.body, role);
    return ApiResponse.ok('Habit parameters updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    await AccountabilityService.deleteHabit(id, userId, role);
    return ApiResponse.ok('Habit removed successfully').send(res);
  } catch (error) {
    next(error);
  }
};

// ── Habit Logs ──

export const logHabit = async (req, res, next) => {
  try {
    const { id } = req.params; // habitId
    const userId = req.user.id;
    const role = req.user.role;

    const log = await AccountabilityService.logHabit(id, userId, req.body, role);
    return ApiResponse.created('Habit progress logged successfully', log).send(res);
  } catch (error) {
    next(error);
  }
};

export const getHabitLogs = async (req, res, next) => {
  try {
    const { id } = req.params; // habitId
    const userId = req.user.id;
    const role = req.user.role;

    const logs = await AccountabilityService.getHabitLogs(id, userId, role);
    return ApiResponse.ok('Habit logs history retrieved successfully', logs).send(res);
  } catch (error) {
    next(error);
  }
};

// ── Streaks ──

export const getStreak = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const streak = await AccountabilityService.getStreak(userId);
    return ApiResponse.ok('Streak statistics retrieved successfully', streak).send(res);
  } catch (error) {
    next(error);
  }
};

// ── Reminders ──

export const getReminderSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settings = await AccountabilityService.getReminderSettings(userId);
    return ApiResponse.ok('Reminder preferences retrieved successfully', settings).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateReminderSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updated = await AccountabilityService.updateReminderSettings(userId, req.body);
    return ApiResponse.ok('Reminder preferences updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

// ── Analytics ──

export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const analytics = await AccountabilityService.getAnalytics(userId);
    return ApiResponse.ok('Progress analytics compiled successfully', analytics).send(res);
  } catch (error) {
    next(error);
  }
};
