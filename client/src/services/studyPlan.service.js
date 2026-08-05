/**
 * NextGen CMA — Study Plan API Service
 *
 * Client-side handler wrapping all Axios API requests to the study planner endpoints.
 */

import api from './api.js';

export const StudyPlanService = {
  /**
   * Create a new study plan
   */
  createPlan: async (data) => {
    const res = await api.post('/study-plans', data);
    return res.data;
  },

  /**
   * Get active study plan for student
   */
  getActivePlan: async (userId = null) => {
    const params = userId ? { userId } : {};
    const res = await api.get('/study-plans', { params });
    return res.data;
  },

  /**
   * Get complete plan details including targets, subjects, and stats
   */
  getPlanDetails: async (planId) => {
    const res = await api.get(`/study-plans/${planId}`);
    return res.data;
  },

  /**
   * Update basic study plan details (exam date, daily study hours)
   */
  updatePlan: async (planId, data) => {
    const res = await api.put(`/study-plans/${planId}`, data);
    return res.data;
  },

  /**
   * Delete study plan and associated schedules
   */
  deletePlan: async (planId) => {
    const res = await api.delete(`/study-plans/${planId}`);
    return res.data;
  },

  /**
   * Add a new custom subject to active plan
   */
  addSubject: async (planId, data) => {
    const res = await api.post(`/study-plans/${planId}/subjects`, data);
    return res.data;
  },

  /**
   * Update subject targets progress (e.g. topic completed counters)
   */
  updateSubject: async (subjectId, data) => {
    const res = await api.put(`/study-plans/subjects/${subjectId}`, data);
    return res.data;
  },

  /**
   * Remove subject from study plan
   */
  deleteSubject: async (subjectId) => {
    const res = await api.delete(`/study-plans/subjects/${subjectId}`);
    return res.data;
  },

  /**
   * Fetch daily targets
   */
  getDailyTargets: async (planId) => {
    const res = await api.get(`/daily-targets/${planId}`);
    return res.data;
  },

  /**
   * Create custom daily target
   */
  createDailyTarget: async (data) => {
    const res = await api.post('/daily-targets', data);
    return res.data;
  },

  /**
   * Toggle daily target status (Pending, Completed, Missed, Rescheduled)
   */
  updateDailyTarget: async (targetId, data) => {
    const res = await api.patch(`/daily-targets/${targetId}`, data);
    return res.data;
  },

  /**
   * Delete a daily target / topic
   */
  deleteDailyTarget: async (targetId) => {
    const res = await api.delete(`/daily-targets/${targetId}`);
    return res.data;
  },

  /**
   * Generate topics for a single subject
   */
  generateSubjectTopics: async (planId, subjectId, data = {}) => {
    const res = await api.post(`/study-plans/${planId}/subjects/${subjectId}/generate-topics`, data);
    return res.data;
  },

  /**
   * Generate topics for all subjects
   */
  generateAllSubjectsTopics: async (planId, data = {}) => {
    const res = await api.post(`/study-plans/${planId}/generate-all-topics`, data);
    return res.data;
  },

  /**
   * Request AI schedule suggestions
   */
  suggestSchedule: async (planId, data = {}) => {
    const res = await api.post(`/study-plans/${planId}/suggest-schedule`, data);
    return res.data;
  },

  /**
   * Apply accepted AI schedule suggestions
   */
  applySuggestedSchedule: async (planId, data = {}) => {
    const res = await api.post(`/study-plans/${planId}/apply-schedule`, data);
    return res.data;
  },

  /**
   * Fetch weekly targets
   */
  getWeeklyTargets: async (planId) => {
    const res = await api.get(`/weekly-targets/${planId}`);
    return res.data;
  },

  /**
   * Create custom weekly target
   */
  createWeeklyTarget: async (data) => {
    const res = await api.post('/weekly-targets', data);
    return res.data;
  },

  /**
   * Toggle/Edit weekly targets
   */
  updateWeeklyTarget: async (targetId, data) => {
    const res = await api.patch(`/weekly-targets/${targetId}`, data);
    return res.data;
  },

  /**
   * Fetch revision calendar
   */
  getRevisionCalendar: async (planId) => {
    const res = await api.get(`/revision-calendar/${planId}`);
    return res.data;
  }
};
