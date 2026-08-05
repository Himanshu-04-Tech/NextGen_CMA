-- AlterTable
ALTER TABLE "mentors" ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "certificates" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "meeting_platforms" TEXT DEFAULT 'GOOGLE_MEET',
ADD COLUMN     "professional_email" TEXT,
ADD COLUMN     "response_time" TEXT DEFAULT '< 2 hours',
ADD COLUMN     "subjects" TEXT,
ADD COLUMN     "teaching_style" TEXT,
ADD COLUMN     "website_url" TEXT;
