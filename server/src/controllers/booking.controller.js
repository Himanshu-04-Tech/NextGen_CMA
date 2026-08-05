/**
 * NextGen CMA — Booking Controller
 *
 * Implements handlers for creating, retrieving, updating status,
 * rescheduling, and deleting mentorship booking slots.
 */

import { BookingService } from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createBooking = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const booking = await BookingService.createBooking(studentId, req.body);
    return ApiResponse.created('Mentorship session booked successfully', booking).send(res);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const filters = {
      status: req.query.status,
    };
    const bookings = await BookingService.getBookings(userId, role, filters);
    return ApiResponse.ok('Bookings list retrieved successfully', bookings).send(res);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    const booking = await BookingService.getBookingById(id, userId, role);
    return ApiResponse.ok('Booking details retrieved successfully', booking).send(res);
  } catch (error) {
    next(error);
  }
};

export const rescheduleBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    const updated = await BookingService.rescheduleBooking(id, userId, role, req.body);
    return ApiResponse.ok('Booking rescheduled successfully', updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    
    const updated = await BookingService.updateBookingStatus(id, userId, role, status);
    return ApiResponse.ok(`Booking status updated to ${status} successfully`, updated).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    await BookingService.deleteBooking(id, userId, role);
    return ApiResponse.ok('Booking deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};
