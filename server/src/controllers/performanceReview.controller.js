/**
 * NextGen CMA — Performance Review Controller
 *
 * Implements handlers for creating, retrieving, and updating student
 * performance reviews and strategy advice by mentors.
 */

import { PerformanceReviewService } from '../services/performanceReview.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createReview = async (req, res, next) => {
  try {
    const mentorUserId = req.user.id;
    const review = await PerformanceReviewService.createReview(mentorUserId, req.body);
    return ApiResponse.created('Performance review created successfully', review).send(res);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    const reviews = await PerformanceReviewService.getReviews(userId, role);
    return ApiResponse.ok('Performance reviews retrieved successfully', reviews).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mentorUserId = req.user.id;
    const role = req.user.role;
    
    const updated = await PerformanceReviewService.updateReview(id, mentorUserId, role, req.body);
    return ApiResponse.ok('Performance review updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};
