/**
 * NextGen CMA — Contact Controller
 *
 * Maps Express request payloads to contact service calls and wraps responses with ApiResponse.
 */

import * as contactService from '../services/contact.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Public: Submit contact form message.
 */
export const submitContactForm = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const data = await contactService.createMessage(req.body, ipAddress);
    return ApiResponse.created('Your message was submitted successfully. We will contact you soon.', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get general company contact information and FAQ preview.
 */
export const getContactSettings = async (req, res, next) => {
  try {
    const data = await contactService.getContactInfo();
    return ApiResponse.ok('Contact info and settings retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Get list of contact messages with pagination and status filters.
 */
export const getAdminContactMessages = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const data = await contactService.getMessagesForAdmin({
      page: parsedPage,
      limit: parsedLimit,
      status,
      search,
    });

    return ApiResponse.ok('Contact messages list retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Get a single contact message details.
 */
export const getContactMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactService.getMessageById(id);
    return ApiResponse.ok('Contact message details retrieved successfully', data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Update contact message status (read, replied, deleted).
 */
export const patchContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await contactService.updateMessageStatus(id, status);
    return ApiResponse.ok(`Inquiry status successfully marked as '${status}'`, data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Only: Delete contact message (soft or hard).
 */
export const deleteContactMessageRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactService.deleteMessage(id);
    const msg = data.isHardDeleted
      ? 'Contact message permanently deleted from database'
      : 'Contact message successfully moved to trash (soft-deleted)';
    return ApiResponse.ok(msg, data).send(res);
  } catch (error) {
    next(error);
  }
};
