/**
 * NextGen CMA — Study Plan Controller
 *
 * Receives incoming request payloads, calls StudyPlanService,
 * and formats API output using ApiResponse.
 */

import { StudyPlanService } from '../services/studyPlan.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createStudyPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const plan = await StudyPlanService.createPlan(userId, req.body);
    return ApiResponse.created('Study plan created and targets scheduled successfully', plan).send(res);
  } catch (error) {
    next(error);
  }
};

export const getActiveStudyPlan = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const plan = await StudyPlanService.getActivePlan(userId);
    return ApiResponse.ok('Active study plan retrieved successfully', plan).send(res);
  } catch (error) {
    next(error);
  }
};

export const getStudyPlanDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestorId = req.user.id;
    const role = req.user.role;

    const details = await StudyPlanService.getPlanDetails(id, requestorId, role);
    return ApiResponse.ok('Study plan details and stats retrieved successfully', details).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateStudyPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await StudyPlanService.updatePlan(id, userId, req.body, role);
    return ApiResponse.ok('Study plan parameters updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteStudyPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    await StudyPlanService.deletePlan(id, userId, role);
    return ApiResponse.ok('Study plan and all associated targets deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

// ── Subject Operations ──

export const addSubject = async (req, res, next) => {
  try {
    const { id } = req.params; // planId
    const userId = req.user.id;
    const role = req.user.role;

    const subject = await StudyPlanService.addSubject(id, userId, req.body, role);
    return ApiResponse.created('Subject added to study plan successfully', subject).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params; // subjectId
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await StudyPlanService.updateSubject(id, userId, req.body, role);
    return ApiResponse.ok('Subject details updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params; // subjectId
    const userId = req.user.id;
    const role = req.user.role;

    await StudyPlanService.deleteSubject(id, userId, role);
    return ApiResponse.ok('Subject removed from study plan successfully').send(res);
  } catch (error) {
    next(error);
  }
};

// ── Daily Target Operations ──

export const getDailyTargets = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const targets = await StudyPlanService.getDailyTargets(planId, userId, role);
    return ApiResponse.ok('Daily targets retrieved successfully', targets).send(res);
  } catch (error) {
    next(error);
  }
};

export const createDailyTarget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const target = await StudyPlanService.createDailyTarget(userId, req.body, role);
    return ApiResponse.created('Daily target added successfully', target).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateDailyTarget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await StudyPlanService.updateDailyTarget(id, userId, req.body, role);
    return ApiResponse.ok('Daily target status updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteDailyTarget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    await StudyPlanService.deleteDailyTarget(id, userId, role);
    return ApiResponse.ok('Daily target deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

export const generateSubjectTopics = async (req, res, next) => {
  try {
    const { id, subjectId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const result = await StudyPlanService.generateSubjectTopics(id, subjectId, userId, req.body, role);
    return ApiResponse.ok('Subject topics generated successfully', result).send(res);
  } catch (error) {
    next(error);
  }
};

export const generateAllSubjectsTopics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const result = await StudyPlanService.generateAllSubjectsTopics(id, userId, req.body, role);
    return ApiResponse.ok('All subject topics generated successfully', result).send(res);
  } catch (error) {
    next(error);
  }
};

export const suggestSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const suggestions = await StudyPlanService.suggestSchedule(id, userId, role, req.body);
    return ApiResponse.ok('Schedule suggestions generated successfully', suggestions).send(res);
  } catch (error) {
    next(error);
  }
};

export const applySuggestedSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const result = await StudyPlanService.applySuggestedSchedule(id, userId, req.body.suggestions, role);
    return ApiResponse.ok('Suggested schedule applied successfully', result).send(res);
  } catch (error) {
    next(error);
  }
};

// ── Weekly Target Operations ──

export const getWeeklyTargets = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const targets = await StudyPlanService.getWeeklyTargets(planId, userId, role);
    return ApiResponse.ok('Weekly targets retrieved successfully', targets).send(res);
  } catch (error) {
    next(error);
  }
};

export const createWeeklyTarget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const target = await StudyPlanService.createWeeklyTarget(userId, req.body, role);
    return ApiResponse.created('Weekly target added successfully', target).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateWeeklyTarget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updated = await StudyPlanService.updateWeeklyTarget(id, userId, req.body, role);
    return ApiResponse.ok('Weekly target details updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

// ── Revision Calendar Operations ──

export const getRevisionCalendar = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const calendar = await StudyPlanService.getRevisionCalendar(planId, userId, role);
    return ApiResponse.ok('Revision calendar retrieved successfully', calendar).send(res);
  } catch (error) {
    next(error);
  }
};
