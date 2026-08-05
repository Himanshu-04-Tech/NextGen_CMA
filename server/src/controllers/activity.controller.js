/**
 * NextGen CMA — Activity logs controller
 *
 * Mapped endpoints handler for retrieving system audit trails.
 */

import { ActivityService } from '../services/activity.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const query = {
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    };
    const data = await ActivityService.getActivityLogs(query);
    return ApiResponse.ok('Activity logs retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};
