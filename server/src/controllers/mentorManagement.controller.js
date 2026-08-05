/**
 * NextGen CMA — Mentor Management Controller
 *
 * Implements handlers for creating new mentors, editing attributes, deleting profiles,
 * resetting passwords, and assigning lists of students.
 */

import { MentorManagementService } from '../services/mentorManagement.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMentors = async (req, res, next) => {
  try {
    const filters = { search: req.query.search };
    const mentors = await MentorManagementService.getMentors(filters);
    return ApiResponse.ok('Mentors management list retrieved', mentors).send(res);
  } catch (error) {
    next(error);
  }
};

export const createMentor = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const newMentor = await MentorManagementService.createMentor(req.body, adminId, ipAddress);
    return ApiResponse.created('Mentor account and profile created successfully', newMentor).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const updated = await MentorManagementService.updateMentor(id, req.body, adminId, ipAddress);
    return ApiResponse.ok('Mentor profile updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    await MentorManagementService.deleteMentor(id, adminId, ipAddress);
    return ApiResponse.ok('Mentor account deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

export const generateTempPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const tempPassword = await MentorManagementService.generateTempPassword(id, adminId, ipAddress);
    return ApiResponse.ok('Temporary password generated successfully', { tempPassword }).send(res);
  } catch (error) {
    next(error);
  }
};

export const assignStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;
    const adminId = req.user.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    await MentorManagementService.assignStudents(id, studentIds, adminId, ipAddress);
    return ApiResponse.ok('Students assigned to mentor successfully').send(res);
  } catch (error) {
    next(error);
  }
};
