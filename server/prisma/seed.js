/**
 * NextGen CMA — Database Seeding Script
 *
 * Resets database tables and inserts seed records for development testing:
 * - 1 Admin User (role = ADMIN)
 * - 1 Student User (role = STUDENT)
 * - 2 Mentor Users (role = MENTOR) with active profiles and slots
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ----------------------------------------------------
  // 1. Clean Database (Deletes in order of relations)
  // ----------------------------------------------------
  console.log('🧹 Cleaning old records...');
  await prisma.performanceReview.deleteMany();
  await prisma.doubtReply.deleteMany();
  await prisma.doubt.deleteMany();
  await prisma.mentorshipBooking.deleteMany();
  await prisma.mentorAvailability.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.user.deleteMany();

  // Hashing salt rounds matching server.env defaults
  const BCRYPT_SALT_ROUNDS = 12;

  // ----------------------------------------------------
  // 2. Seed Admin User (SUPER_ADMIN)
  // ----------------------------------------------------
  console.log('👤 Seeding Admin user...');
  const adminEmail = 'admin@nextgencma.com';
  const adminPasswordHash = await bcrypt.hash('Admin@123', BCRYPT_SALT_ROUNDS);

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        phone: '9876543210',
        password: adminPasswordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`✅ Created Admin: ${admin.email} (Password: Admin@123)`);
  } else {
    admin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: 'SUPER_ADMIN',
        password: adminPasswordHash,
      },
    });
    console.log(`✅ Updated existing Admin to SUPER_ADMIN: ${admin.email}`);
  }

  // ----------------------------------------------------
  // 3. Seed Student User
  // ----------------------------------------------------
  console.log('👤 Seeding Student user...');
  const studentPasswordHash = await bcrypt.hash('Student@12345', BCRYPT_SALT_ROUNDS);
  const student = await prisma.user.create({
    data: {
      name: 'Default Student',
      email: 'student@nextgencma.com',
      phone: '8765432109',
      password: studentPasswordHash,
      role: 'STUDENT',
      cmaLevel: 'FOUNDATION',
      targetAttempt: 'Dec 2026',
    },
  });
  console.log(`✅ Created Student: ${student.email} (Password: Student@12345)`);

  // ----------------------------------------------------
  // 4. Seed Mentor 1: Business Law Specialist
  // ----------------------------------------------------
  console.log('👤 Seeding Mentor 1...');
  const mentor1PasswordHash = await bcrypt.hash('Mentor@12345', BCRYPT_SALT_ROUNDS);
  const mentor1User = await prisma.user.create({
    data: {
      name: 'CA Harish Sharma',
      email: 'harish@nextgencma.com',
      phone: '7654321098',
      password: mentor1PasswordHash,
      role: 'MENTOR',
    },
  });

  const mentor1Profile = await prisma.mentor.create({
    data: {
      userId: mentor1User.id,
      fullName: 'CA Harish Sharma',
      bio: 'Expert in Corporate & Business Laws with over 8 years of teaching experience. Helped 500+ students clear CMA Intermediate and Final Law exams.',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      specialization: 'Business Laws & Ethics',
      experience: 8,
      qualification: 'CA, CS, LL.B',
      availability: 'Mon, Wed, Fri (4:00 PM - 7:00 PM)',
      rating: 4.8,
    },
  });

  // Seed availability slots for Mentor 1
  // Mon, Wed, Fri (day of week: 1, 3, 5) from 16:00 to 19:00, 60min slots
  await prisma.mentorAvailability.createMany({
    data: [
      { mentorId: mentor1Profile.id, dayOfWeek: 1, startTime: '16:00', endTime: '19:00', slotDuration: 60 },
      { mentorId: mentor1Profile.id, dayOfWeek: 3, startTime: '16:00', endTime: '19:00', slotDuration: 60 },
      { mentorId: mentor1Profile.id, dayOfWeek: 5, startTime: '16:00', endTime: '19:00', slotDuration: 60 },
    ],
  });
  console.log(`✅ Created Mentor 1: ${mentor1User.email} (Password: Mentor@12345)`);

  // ----------------------------------------------------
  // 5. Seed Mentor 2: Taxation & Costing Specialist
  // ----------------------------------------------------
  console.log('👤 Seeding Mentor 2...');
  const mentor2PasswordHash = await bcrypt.hash('Mentor@12345', BCRYPT_SALT_ROUNDS);
  const mentor2User = await prisma.user.create({
    data: {
      name: 'CMA Rajesh Patel',
      email: 'rajesh@nextgencma.com',
      phone: '6543210987',
      password: mentor2PasswordHash,
      role: 'MENTOR',
    },
  });

  const mentor2Profile = await prisma.mentor.create({
    data: {
      userId: mentor2User.id,
      fullName: 'CMA Rajesh Patel',
      bio: 'Practicing CMA specializing in Direct & Indirect Taxation and Strategic Cost Management. Passionate about mentoring students for CMA Finals.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialization: 'Taxation & Cost Accounting',
      experience: 12,
      qualification: 'FCMA, M.Com',
      availability: 'Tue, Thu, Sat (10:00 AM - 1:00 PM)',
      rating: 4.9,
    },
  });

  // Seed availability slots for Mentor 2
  // Tue, Thu, Sat (day of week: 2, 4, 6) from 10:00 to 13:00, 30min slots
  await prisma.mentorAvailability.createMany({
    data: [
      { mentorId: mentor2Profile.id, dayOfWeek: 2, startTime: '10:00', endTime: '13:00', slotDuration: 30 },
      { mentorId: mentor2Profile.id, dayOfWeek: 4, startTime: '10:00', endTime: '13:00', slotDuration: 30 },
      { mentorId: mentor2Profile.id, dayOfWeek: 6, startTime: '10:00', endTime: '13:00', slotDuration: 30 },
    ],
  });
  console.log(`✅ Created Mentor 2: ${mentor2User.email} (Password: Mentor@12345)`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

