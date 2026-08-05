/**
 * NextGen CMA — Mentor Controller
 *
 * Exposes handlers for getting active mentors, retrieving single profiles,
 * and performing Admin CRUD operations on mentor records.
 */

import { MentorService } from '../services/mentor.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMentors = async (req, res, next) => {
  try {
    const filters = {
      specialization: req.query.specialization,
      minRating: req.query.minRating,
      search: req.query.search,
    };
    const mentors = await MentorService.getMentors(filters);
    return ApiResponse.ok('Mentors retrieved successfully', mentors).send(res);
  } catch (error) {
    next(error);
  }
};

export const getMentorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mentor = await MentorService.getMentorById(id);
    return ApiResponse.ok('Mentor profile retrieved successfully', mentor).send(res);
  } catch (error) {
    next(error);
  }
};

export const createMentor = async (req, res, next) => {
  try {
    const newMentor = await MentorService.createMentor(req.body);
    return ApiResponse.created('Mentor profile created successfully', newMentor).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requestorId = req.user.id;
    const role = req.user.role;
    
    const updated = await MentorService.updateMentor(id, req.body, requestorId, role);
    return ApiResponse.ok('Mentor profile updated successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MentorService.deleteMentor(id);
    return ApiResponse.ok('Mentor profile deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find associated mentor profile
    const mentor = await MentorService.getMentorByUserId(userId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found for this user account',
      });
    }

    const updatedSlots = await MentorService.updateAvailability(mentor.id, req.body.availabilities);
    return ApiResponse.ok('Availability calendar slots updated successfully', updatedSlots).send(res);
  } catch (error) {
    next(error);
  }
};

export const getMyMentorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mentor = await MentorService.getMentorByUserId(userId);
    if (!mentor) {
      return ApiResponse.ok('No mentor profile associated with this user account', null).send(res);
    }
    const fullProfile = await MentorService.getMentorById(mentor.id);
    return ApiResponse.ok('My mentor profile retrieved successfully', fullProfile).send(res);
  } catch (error) {
    next(error);
  }
};
