/**
 * NextGen CMA — Admin Dashboard statistics controller
 *
 * Mapped endpoint handlers returning aggregated calculations for admin widgets.
 */

import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await DashboardService.getStats();
    return ApiResponse.ok('Dashboard stats retrieved successfully', stats).send(res);
  } catch (error) {
    next(error);
  }
};
