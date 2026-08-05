/**
 * NextGen CMA — Service Controller
 *
 * Coordinates request payloads, service calls, and generates API responses.
 */

import * as serviceService from '../services/service.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Public: Get all active services.
 */
export const getActiveServices = async (req, res, next) => {
  try {
    const data = await serviceService.getAllActiveServices();
    return ApiResponse.ok('Services retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get a single service by ID.
 */
export const getServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await serviceService.getServiceById(id);
    return ApiResponse.ok('Service details retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get active services by category.
 */
export const getServicesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const data = await serviceService.getActiveServicesByCategory(category);
    return ApiResponse.ok(`Services for category '${category}' retrieved successfully`, data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Get all services for management.
 */
export const getAdminServices = async (req, res, next) => {
  try {
    const data = await serviceService.getAllServicesForAdmin();
    return ApiResponse.ok('All administrative services retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Create new service.
 */
export const createNewService = async (req, res, next) => {
  try {
    const data = await serviceService.createService(req.body);
    return ApiResponse.created('Service created successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Update existing service details.
 */
export const updateServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await serviceService.updateService(id, req.body);
    return ApiResponse.ok('Service updated successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Toggle service status.
 */
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    const data = await serviceService.updateServiceStatus(id, isActive);
    return ApiResponse.ok('Service visibility status updated successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Delete a service.
 */
export const deleteServiceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceService.deleteService(id);
    return ApiResponse.ok('Service deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Bulk reorder services display positions.
 */
export const reorderServicesOrder = async (req, res, next) => {
  try {
    const { orders } = req.body;
    await serviceService.reorderServices(orders);
    return ApiResponse.ok('Services display order synchronized successfully').send(res);
  } catch (error) {
    next(error);
  }
};
