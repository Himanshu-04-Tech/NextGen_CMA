/**
 * NextGen CMA — Contact Service
 *
 * Implements database queries and transactions for contact submissions
 * and administrative inquiry management using Prisma Client.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { sendAdminNotification, sendVisitorAcknowledgement } from './email.service.js';

/**
 * Creates a contact message record and triggers background email dispatches.
 * @param {object} messageData
 * @param {string} ipAddress
 */
export const createMessage = async (messageData, ipAddress) => {
  const { name, email, phone, subject, message } = messageData;

  const newMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      subject,
      message,
      ipAddress,
      status: 'UNREAD',
    },
  });

  // Trigger emails asynchronously in background without blocking API response
  sendAdminNotification(newMessage).catch((err) =>
    console.error('Failed to dispatch background admin notification email:', err)
  );
  sendVisitorAcknowledgement(newMessage).catch((err) =>
    console.error('Failed to dispatch background visitor acknowledgement email:', err)
  );

  return newMessage;
};

/**
 * Retrieves general contact settings and FAQ lists from the SiteContent (CMS) table.
 * Fallbacks to default values if not defined in the DB.
 */
export const getContactInfo = async () => {
  // Query site_content for navbar, contact, and footer keys
  const content = await prisma.siteContent.findMany({
    where: {
      sectionKey: {
        in: ['contact', 'footer', 'business_hours', 'faq'],
      },
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Helper to find setting by section key
  const findSect = (key) => content.find((c) => c.sectionKey === key);

  // Load business hours and FAQs
  const businessHoursSect = findSect('business_hours');
  const faqSect = findSect('faq');

  let businessHours = null;
  try {
    businessHours = businessHoursSect?.body ? JSON.parse(businessHoursSect.body) : null;
  } catch (e) {
    console.error('Error parsing business hours from SiteContent:', e);
  }

  let faqs = [];
  try {
    faqs = faqSect?.body ? JSON.parse(faqSect.body) : [];
  } catch (e) {
    console.error('Error parsing FAQs from SiteContent:', e);
  }

  // Construct structured data
  return {
    companyName: 'NextGen CMA Academy',
    address: '4th Floor, Premium Plaza, Sector 62, Noida, UP, India',
    phone: '+91 98765 43210',
    email: 'nextgencma18@gmail.com',
    businessHours: businessHours || [
      { dayRange: 'Monday - Friday', timeRange: '09:00 AM - 07:00 PM' },
      { dayRange: 'Saturday', timeRange: '10:00 AM - 04:00 PM' },
      { dayRange: 'Sunday', timeRange: 'Closed' },
    ],
    faqs: faqs.length > 0 ? faqs : [
      {
        question: 'Who are the professional mentors in NextGen CMA?',
        answer: 'Our mentors are qualified Cost & Management Accountants (CMAs) and Chartered Accountants (CAs) with years of teaching and corporate practice experience.',
      },
      {
        question: 'How does the accountability system operate?',
        answer: 'Students submit daily check-ins on study targets. Missing a streak triggers automated reminder alerts and updates the student log checked by mentors.',
      },
      {
        question: 'Can I book one-on-one sessions?',
        answer: 'Yes, students can browse availability slots of active mentors on the dashboard and schedule direct online consultations.',
      },
    ],
    mapCoordinates: {
      lat: 28.6289,
      lng: 77.3794,
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620138982365!2d77.37722957599026!3d28.627885975667362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceff135555555%3A0x6bba83818e6988ad!2sSector%2062%20Noida!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
  };
};

/**
 * Paginated admin messages retrieval with status filter and keyword search.
 * @param {object} filters
 */
export const getMessagesForAdmin = async ({ page = 1, limit = 10, status, search }) => {
  const skip = (page - 1) * limit;

  // Build query where clause
  const where = {};

  if (status) {
    where.status = status.toUpperCase();
  } else {
    // By default, do not show deleted messages unless explicitly requested
    where.status = { not: 'DELETED' };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, data] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    messages: data,
  };
};

/**
 * Fetches single contact message detail.
 * @param {string} id
 */
export const getMessageById = async (id) => {
  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    throw ApiError.notFound('Contact message not found');
  }

  return message;
};

/**
 * Update message status (UNREAD, READ, REPLIED, DELETED).
 * @param {string} id
 * @param {string} status
 */
export const updateMessageStatus = async (id, status) => {
  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    throw ApiError.notFound('Contact message not found');
  }

  return await prisma.contactMessage.update({
    where: { id },
    data: { status: status.toUpperCase() },
  });
};

/**
 * Handle delete action for message.
 * Sets status to DELETED (soft delete).
 * If already DELETED, removes the record permanently (hard delete).
 * @param {string} id
 */
export const deleteMessage = async (id) => {
  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    throw ApiError.notFound('Contact message not found');
  }

  if (message.status === 'DELETED') {
    // Hard delete
    await prisma.contactMessage.delete({
      where: { id },
    });
    return { id, isHardDeleted: true };
  } else {
    // Soft delete
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    return { id, isHardDeleted: false, message: updated };
  }
};
