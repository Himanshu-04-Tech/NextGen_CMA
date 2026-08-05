/**
 * NextGen CMA — Site Content Controller
 *
 * Coordinates request payloads, invokes content database services,
 * and formats standardized REST responses.
 */

import * as siteContentService from '../services/siteContent.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Public: Get all active site content records.
 */
export const getActiveSiteContent = async (req, res, next) => {
  try {
    const data = await siteContentService.getAllActiveContent();
    return ApiResponse.ok('Site content retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get active site content records for a specific section key.
 */
export const getActiveSectionContent = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const data = await siteContentService.getActiveContentBySection(sectionKey);
    return ApiResponse.ok(`Site content for section '${sectionKey}' retrieved successfully`, data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Get all site content records (active & inactive) for management.
 */
export const getAdminSiteContent = async (req, res, next) => {
  try {
    const data = await siteContentService.getAllContentForAdmin();
    return ApiResponse.ok('All admin site content retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Create new site content record.
 */
export const createSiteContent = async (req, res, next) => {
  try {
    const newContent = await siteContentService.createContent(req.body);
    return ApiResponse.created('Site content created successfully', newContent).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Update an existing site content record.
 */
export const updateSiteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContent = await siteContentService.updateContent(id, req.body);
    return ApiResponse.ok('Site content updated successfully', updatedContent).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Delete a site content record.
 */
export const deleteSiteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await siteContentService.deleteContent(id);
    return ApiResponse.ok('Site content block deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Bulk reorder display ordering of site content blocks.
 */
export const reorderSiteContent = async (req, res, next) => {
  try {
    const { orders } = req.body;
    await siteContentService.reorderContent(orders);
    return ApiResponse.ok('Site content order synchronized successfully').send(res);
  } catch (error) {
    next(error);
  }
};
