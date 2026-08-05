/**
 * NextGen CMA — Site Content Service
 *
 * Implements database queries and transactions for site content management using Prisma Client.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Retrieve all active site content records ordered by section and display order.
 */
export const getAllActiveContent = async () => {
  return await prisma.siteContent.findMany({
    where: { isActive: true },
    orderBy: [
      { sectionKey: 'asc' },
      { displayOrder: 'asc' }
    ],
  });
};

/**
 * Retrieve active content records filtered by a specific section key.
 * @param {string} sectionKey
 */
export const getActiveContentBySection = async (sectionKey) => {
  return await prisma.siteContent.findMany({
    where: {
      sectionKey,
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Retrieve all site content records (active and inactive) for administrative management.
 */
export const getAllContentForAdmin = async () => {
  return await prisma.siteContent.findMany({
    orderBy: [
      { sectionKey: 'asc' },
      { displayOrder: 'asc' }
    ],
  });
};

/**
 * Create a new site content record.
 * @param {object} contentData
 */
export const createContent = async (contentData) => {
  return await prisma.siteContent.create({
    data: contentData,
  });
};

/**
 * Update an existing site content record.
 * @param {string} id
 * @param {object} updateData
 */
export const updateContent = async (id, updateData) => {
  const existing = await prisma.siteContent.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound('Site content block not found');
  }

  return await prisma.siteContent.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Delete a site content record.
 * @param {string} id
 */
export const deleteContent = async (id) => {
  const existing = await prisma.siteContent.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound('Site content block not found');
  }

  return await prisma.siteContent.delete({
    where: { id },
  });
};

/**
 * Bulk reorder site content records using a transaction.
 * @param {Array<{ id: string, displayOrder: number }>} orders
 */
export const reorderContent = async (orders) => {
  const updates = orders.map((item) =>
    prisma.siteContent.update({
      where: { id: item.id },
      data: { displayOrder: item.displayOrder },
    })
  );

  return await prisma.$transaction(updates);
};
