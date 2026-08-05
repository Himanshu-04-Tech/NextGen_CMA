/**
 * NextGen CMA — Accountability API Service
 *
 * Client-side handler wrapping all Axios API requests to the accountability endpoints.
 */

import api from './api.js';

export const AccountabilityService = {
  // ── Daily Check-ins ──

  /**
   * Submit daily check-in study hours, mood, energy ratings and notes
   */
  createCheckin: async (data) => {
    const res = await api.post('/checkins', data);
    return res.data;
  },

  /**
   * Fetch daily check-ins history log
   */
  getCheckins: async (params = {}) => {
    const res = await api.get('/checkins', { params });
    return res.data;
  },

  /**
   * Fetch specific daily check-in by ID
   */
  getCheckinById: async (id) => {
    const res = await api.get(`/checkins/${id}`);
    return res.data;
  },

  /**
   * Update study hours or ratings of a submitted check-in
   */
  updateCheckin: async (id, data) => {
    const res = await api.put(`/checkins/${id}`, data);
    return res.data;
  },

  /**
   * Delete study check-in record
   */
  deleteCheckin: async (id) => {
    const res = await api.delete(`/checkins/${id}`);
    return res.data;
  },

  // ── Habits Tracker ──

  /**
   * Create a new tracking habit
   */
  createHabit: async (data) => {
    const res = await api.post('/habits', data);
    return res.data;
  },

  /**
   * Retrieve habits catalog for the user
   */
  getHabits: async () => {
    const res = await api.get('/habits');
    return res.data;
  },

  /**
   * Update habit target parameters
   */
  updateHabit: async (id, data) => {
    const res = await api.put(`/habits/${id}`, data);
    return res.data;
  },

  /**
   * Delete tracking habit
   */
  deleteHabit: async (id) => {
    const res = await api.delete(`/habits/${id}`);
    return res.data;
  },

  // ── Habit Logs ──

  /**
   * Log completed check-off value for a specific habit
   */
  logHabit: async (habitId, data) => {
    const res = await api.post(`/habits/${habitId}/log`, data);
    return res.data;
  },

  /**
   * Fetch logs for a specific habit
   */
  getHabitLogs: async (habitId) => {
    const res = await api.get(`/habits/${habitId}/logs`);
    return res.data;
  },

  // ── Streak System ──

  /**
   * Fetch streak details and calendar consistency rate
   */
  getStreak: async () => {
    const res = await api.get('/streaks');
    return res.data;
  },

  // ── Reminders preferences ──

  /**
   * Fetch user notifications timing and preferences
   */
  getReminderSettings: async () => {
    const res = await api.get('/reminders/settings');
    return res.data;
  },

  /**
   * Update notifications configuration
   */
  updateReminderSettings: async (data) => {
    const res = await api.put('/reminders/settings', data);
    return res.data;
  },

  // ── Analytics ──

  /**
   * Fetch compiled hours comparison chart metrics and habits progress rates
   */
  getAnalytics: async () => {
    const res = await api.get('/accountability/analytics');
    return res.data;
  }
};
export default AccountabilityService;
