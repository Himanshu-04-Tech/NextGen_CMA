/**
 * NextGen CMA — Student Management Controller
 *
 * Exposes handlers for admin student listing, pagination, details mapping,
 * and deactivation toggle triggers.
 */

import { StudentService } from '../services/student.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getStudents = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      status: req.query.status,
      cmaLevel: req.query.cmaLevel,
      page: req.query.page,
      limit: req.query.limit,
    };
    const data = await StudentService.getStudents(filters);
    return ApiResponse.ok('Students retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await StudentService.getStudentById(id);
    return ApiResponse.ok('Student full details retrieved successfully', details).send(res);
  } catch (error) {
    next(error);
  }
};

export const toggleStudentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'ACTIVATE' or 'DEACTIVATE'
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    const result = await StudentService.toggleStudentStatus(id, action, adminId, ipAddress);
    return ApiResponse.ok(`Student status changed successfully to ${result.status.toLowerCase()}`, result).send(res);
  } catch (error) {
    next(error);
  }
};
