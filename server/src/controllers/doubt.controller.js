/**
 * NextGen CMA — Doubt Controller
 *
 * Exposes endpoint handlers for student doubts submissions, listing, resolving,
 * and replying to conversation threads.
 */

import { DoubtService } from '../services/doubt.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createDoubt = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const doubt = await DoubtService.createDoubt(studentId, req.body);
    return ApiResponse.created('Doubt raised successfully', doubt).send(res);
  } catch (error) {
    next(error);
  }
};

export const getDoubts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
    };
    const doubts = await DoubtService.getDoubts(userId, role, filters);
    return ApiResponse.ok('Doubts list retrieved successfully', doubts).send(res);
  } catch (error) {
    next(error);
  }
};

export const getDoubtById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    const doubt = await DoubtService.getDoubtById(id, userId, role);
    return ApiResponse.ok('Doubt thread details retrieved successfully', doubt).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateDoubtStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    
    const updated = await DoubtService.updateDoubtStatus(id, status, userId, role);
    return ApiResponse.ok(`Doubt status updated to ${status} successfully`, updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const { id } = req.params; // doubtId
    const senderId = req.user.id;
    const { message, attachmentUrl } = req.body;
    
    const reply = await DoubtService.addReply(id, senderId, message, attachmentUrl);
    return ApiResponse.created('Reply added successfully', reply).send(res);
  } catch (error) {
    next(error);
  }
};
