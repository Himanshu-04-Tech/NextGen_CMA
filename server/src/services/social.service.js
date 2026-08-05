/**
 * NextGen CMA — Social Link Service
 *
 * Implements database queries and transactions for managing public and administrative
 * social media integration links using Prisma Client.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Public: Get active social links sorted by displayOrder.
 */
export const getActiveSocialLinks = async () => {
  return await prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Admin Only: Get all social links (active & inactive) sorted by displayOrder.
 */
export const getAllSocialLinksForAdmin = async () => {
  return await prisma.socialLink.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Admin Only: Create a new social link.
 * @param {object} data
 */
export const createSocialLink = async (data) => {
  // If displayOrder not provided, find the current max and add 1
  let displayOrder = data.displayOrder;
  if (displayOrder === undefined || displayOrder === null) {
    const maxOrder = await prisma.socialLink.aggregate({
      _max: { displayOrder: true },
    });
    displayOrder = (maxOrder._max.displayOrder || 0) + 1;
  }

  return await prisma.socialLink.create({
    data: {
      platform: data.platform.toUpperCase(),
      displayName: data.displayName,
      url: data.url,
      icon: data.icon,
      displayOrder,
      isActive: data.isActive !== false,
    },
  });
};

/**
 * Admin Only: Update an existing social link.
 * @param {string} id
 * @param {object} data
 */
export const updateSocialLink = async (id, data) => {
  const link = await prisma.socialLink.findUnique({
    where: { id },
  });

  if (!link) {
    throw ApiError.notFound('Social link not found');
  }

  const updatePayload = { ...data };
  if (data.platform) {
    updatePayload.platform = data.platform.toUpperCase();
  }

  return await prisma.socialLink.update({
    where: { id },
    data: updatePayload,
  });
};

/**
 * Admin Only: Toggle a social link's isActive status.
 * @param {string} id
 * @param {boolean} isActive
 */
export const toggleSocialLinkStatus = async (id, isActive) => {
  const link = await prisma.socialLink.findUnique({
    where: { id },
  });

  if (!link) {
    throw ApiError.notFound('Social link not found');
  }

  return await prisma.socialLink.update({
    where: { id },
    data: { isActive },
  });
};

/**
 * Admin Only: Delete a social link.
 * @param {string} id
 */
export const deleteSocialLink = async (id) => {
  const link = await prisma.socialLink.findUnique({
    where: { id },
  });

  if (!link) {
    throw ApiError.notFound('Social link not found');
  }

  await prisma.socialLink.delete({
    where: { id },
  });

  return { id };
};

/**
 * Admin Only: Reorder social links in bulk transaction.
 * @param {Array<{ id: string, displayOrder: number }>} orders
 */
export const reorderSocialLinks = async (orders) => {
  const transactions = orders.map((order) =>
    prisma.socialLink.update({
      where: { id: order.id },
      data: { displayOrder: order.displayOrder },
    })
  );

  await prisma.$transaction(transactions);
  
  return await prisma.socialLink.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};
