/**
 * NextGen CMA — Services Database Service
 *
 * Implements CRUD actions, bulk transactions, reordering,
 * and status updates for the Services database table.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Retrieve all active services, sorted by display order.
 */
export const getAllActiveServices = async () => {
  return await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Retrieve a specific service by ID.
 */
export const getServiceById = async (id) => {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    throw ApiError.notFound('Requested service not found');
  }

  return service;
};

/**
 * Retrieve active services by category.
 * @param {string} category
 */
export const getActiveServicesByCategory = async (category) => {
  return await prisma.service.findMany({
    where: {
      category,
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Retrieve all services (active & inactive) for administrative management.
 */
export const getAllServicesForAdmin = async () => {
  return await prisma.service.findMany({
    orderBy: [
      { category: 'asc' },
      { displayOrder: 'asc' },
    ],
  });
};

/**
 * Create a new service record.
 * @param {object} serviceData
 */
export const createService = async (serviceData) => {
  return await prisma.service.create({
    data: serviceData,
  });
};

/**
 * Update an existing service record.
 * @param {string} id
 * @param {object} updateData
 */
export const updateService = async (id, updateData) => {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound('Requested service not found');
  }

  return await prisma.service.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Toggle the visibility status of a service.
 * @param {string} id
 * @param {boolean} isActive
 */
export const updateServiceStatus = async (id, isActive) => {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound('Requested service not found');
  }

  return await prisma.service.update({
    where: { id },
    data: { isActive },
  });
};

/**
 * Delete a service record.
 * @param {string} id
 */
export const deleteService = async (id) => {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound('Requested service not found');
  }

  return await prisma.service.delete({
    where: { id },
  });
};

/**
 * Bulk reorder display ordering of services.
 * @param {Array<{ id: string, displayOrder: number }>} orders
 */
export const reorderServices = async (orders) => {
  const updates = orders.map((item) =>
    prisma.service.update({
      where: { id: item.id },
      data: { displayOrder: item.displayOrder },
    })
  );

  return await prisma.$transaction(updates);
};
