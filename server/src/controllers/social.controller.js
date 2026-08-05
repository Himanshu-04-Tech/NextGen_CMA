/**
 * NextGen CMA — Social Controller
 *
 * Maps Express request payloads to social link service calls and wraps responses with ApiResponse.
 */

import * as socialService from '../services/social.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Public: Get active social links.
 */
export const getActiveSocials = async (req, res, next) => {
  try {
    const data = await socialService.getActiveSocialLinks();
    return ApiResponse.ok('Active social links retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Get all social links (active & inactive).
 */
export const getAdminSocials = async (req, res, next) => {
  try {
    const data = await socialService.getAllSocialLinksForAdmin();
    return ApiResponse.ok('All social links retrieved for administrative view', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Create a new social link.
 */
export const createNewSocial = async (req, res, next) => {
  try {
    const data = await socialService.createSocialLink(req.body);
    return ApiResponse.created('Social link created successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Update an existing social link details.
 */
export const updateSocialDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await socialService.updateSocialLink(id, req.body);
    return ApiResponse.ok('Social link details updated successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Toggle social link activation status.
 */
export const toggleSocialActivation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const data = await socialService.toggleSocialLinkStatus(id, isActive);
    return ApiResponse.ok('Social link visibility status updated successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Delete a social link.
 */
export const deleteSocialRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await socialService.deleteSocialLink(id);
    return ApiResponse.ok('Social link deleted successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Bulk reorder social links.
 */
export const reorderSocialLinksList = async (req, res, next) => {
  try {
    const { orders } = req.body;
    const data = await socialService.reorderSocialLinks(orders);
    return ApiResponse.ok('Social links displaying order re-arranged successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};
