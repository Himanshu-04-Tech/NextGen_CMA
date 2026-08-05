# Task List — NextGen CMA Module 1: User Authentication & Profile Management

## Completed Tasks

### Database & Project Setup
- `[x]` Initialize Prisma ORM structure (`server/prisma/schema.prisma`)
  - [schema.prisma](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/prisma/schema.prisma)
- `[x]` Create environment config template (`server/.env.example`)
  - [.env.example](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/.env.example)
- `[x]` Configure ES Modules support in `package.json`
  - [package.json](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/package.json)
- `[x]` Create localized development environment file (`server/.env`)
  - [.env](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/.env)

### Server Bootstrapping & Configuration
- `[x]` Implement Express application foundation with security middlewares (Helmet, CORS, rate limits, cookie parser)
  - [app.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/app.js)
- `[x]` Create server initialization entrypoint
  - [server.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/server.js)
- `[x]` Create environment variable validation logic
  - [env.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/config/env.js)
- `[x]` Implement Prisma client singleton helper
  - [db.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/config/db.js)

### Utilities
- `[x]` Implement custom error class `ApiError.js`
  - [ApiError.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/utils/ApiError.js)
- `[x]` Implement standardized REST response utility `ApiResponse.js`
  - [ApiResponse.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/utils/ApiResponse.js)
- `[x]` Write JWT token helper utilities (Access / Refresh Token generator/verifier)
  - [jwt.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/utils/jwt.js)
- `[x]` Create cryptographically secure OTP generator and mock email sender
  - [otp.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/utils/otp.js)
- `[x]` Write password hashing helper utility using `bcryptjs`
  - [password.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/utils/password.js)

### Request Validation Rules
- `[x]` Implement authentication validators for registration, login, forgot password, reset password
  - [auth.validator.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/validators/auth.validator.js)
- `[x]` Implement profile edit validators
  - [profile.validator.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/validators/profile.validator.js)

### Middlewares
- `[x]` Implement global backend error handling middleware
  - [error.middleware.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/middlewares/error.middleware.js)
- `[x]` Create `validation.middleware.js` (Express validator result interceptor)
  - [validation.middleware.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/middlewares/validation.middleware.js)
- `[x]` Create `auth.middleware.js` (`authenticateUser` and `authorizeRoles` middlewares)
  - [auth.middleware.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/middlewares/auth.middleware.js)

---

## Remaining Tasks

### 1. Backend Middlewares
- `[x]` Create `auth.middleware.js` (`authenticateUser` and `authorizeRoles` middlewares)

### 2. Backend Services & Controllers
- `[x]` Create `auth.service.js` (DB operation encapsulation for registrations, logins, tokens, profile updates, and OTPs)
  - [auth.service.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/services/auth.service.js)
- `[x]` Create `auth.controller.js` (API endpoints logic matching routing handlers)
  - [auth.controller.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/controllers/auth.controller.js)

### 3. Backend Routes & Seeding
- `[x]` Create authentication and profile router configuration (`auth.routes.js` and `routes/index.js`)
  - `[x]` Create `auth.routes.js`
    - [auth.routes.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/routes/auth.routes.js)
  - `[x]` Create `routes/index.js`
    - [index.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/routes/index.js)
- `[x]` Implement DB Seed script (`server/prisma/seed.js`) to create mock user/admin records
  - [seed.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/prisma/seed.js)

### 4. Client Frontend Infrastructure
- `[x]` Initialize Vite React App inside `client/` folder
  - [package.json](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/package.json)
- `[x]` Setup Tailwind CSS configuration with Black, White, Gold, Purple theme colors
  - [tailwind.config.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/tailwind.config.js)
  - [postcss.config.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/postcss.config.js)
- `[x]` Setup Axios API service instance (`api.js`) with request interceptors for token refresh handling
- `[x]` Implement application global state authentication context `AuthContext.jsx`
- `[x]` Set up router protection component wrapper `ProtectedRoute.jsx`

### 5. Client Frontend Pages & Styling
- `[x]` Configure React Router DOM base mapping in `App.jsx`
- `[x]` Create premium, responsive pages using Tailwind CSS:
  - `[x]` Student Register Page (`/register`)
  - `[x]` User Login Page (`/login`)
  - `[x]` Admin Login Page (`/admin/login`)
  - `[x]` Forgot Password Page (`/forgot-password`)
  - `[x]` Reset Password Page (`/reset-password`)
  - `[x]` User Profile & Edit Page (`/profile`)

### 6. Verification and Integration
- `[x]` Synchronize schema models (`prisma db push`) and seed default administrator credentials
- `[x]` Verify all backend endpoints using REST queries
- `[x]` Run manual walkthrough, ensuring responsive behaviors and toast indicators work as expected

## Module 2 — Homepage & Brand CMS

### 1. Database Configuration
- `[x]` Add `site_content` model to schema.prisma and execute migrations ([schema.prisma](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/prisma/schema.prisma))

### 2. Backend API Implementation
- `[x]` Create site content validator rules ([siteContent.validator.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/validators/siteContent.validator.js))
- `[x]` Create site content CRUD database services ([siteContent.service.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/services/siteContent.service.js))
- `[x]` Create HTTP handler controller ([siteContent.controller.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/controllers/siteContent.controller.js))
- `[x]` Define routing bindings and mount under main multiplexer router ([siteContent.routes.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/routes/siteContent.routes.js))

### 3. Frontend Landing Page Components
- `[x]` Create sticky main Navigation Bar ([Navbar.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/Navbar.jsx))
- `[x]` Create responsive Hero banner section ([Hero.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/Hero.jsx))
- `[x]` Create animated milestones counter Stats block ([Stats.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/Stats.jsx))
- `[x]` Create four pillars Services cards panel ([ServicesPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/ServicesPreview.jsx))
- `[x]` Create custom slider Testimonials carousel ([TestimonialsPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/TestimonialsPreview.jsx))
- `[x]` Create community engagement Gallery photo grid ([GalleryPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/GalleryPreview.jsx))
- `[x]` Create featured SEO articles cards preview ([BlogPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/BlogPreview.jsx))
- `[x]` Create interactive plans and Pricing comparison section ([PricingPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/PricingPreview.jsx))
- `[x]` Create message dispatch Contact form and social channels links ([ContactPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/ContactPreview.jsx))
- `[x]` Create Footer links block ([Footer.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/Footer.jsx))

### 4. CMS Administration Dashboard
- `[x]` Implement Admin Homepage CMS editor workspace with dynamic reordering, editing, toggling, and live preview ([AdminHomepageCms.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/pages/AdminHomepageCms.jsx))
- `[x]` Configure page route bindings in routing index mapping ([App.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/App.jsx))

## Module 3 — Services Module

### 1. Database Configuration
- `[x]` Add `Service` model to schema.prisma and execute migrations ([schema.prisma](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/prisma/schema.prisma))

### 2. Backend API Implementation
- `[x]` Create services validation rules ([service.validator.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/validators/service.validator.js))
- `[x]` Create services database querying services ([service.service.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/services/service.service.js))
- `[x]` Create services HTTP request controllers ([service.controller.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/controllers/service.controller.js))
- `[x]` Define public & admin routing namespaces and register routes ([service.routes.js](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/server/src/routes/service.routes.js))

### 3. Frontend Catalog & Detail Pages
- `[x]` Create dynamic Services catalog page with categories filters, search bar and sort dropdown ([Services.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/pages/Services.jsx))
- `[x]` Create modular Services subcomponents ([components/services/](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services))
  - `[x]` Service Card with lucide icon resolver ([ServiceCard.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/ServiceCard.jsx))
  - `[x]` Service Hero header block ([ServiceHero.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/ServiceHero.jsx))
  - `[x]` Category Selection Tab links ([CategoryTabs.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/CategoryTabs.jsx))
  - `[x]` Search input wrapper ([SearchBar.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/SearchBar.jsx))
  - `[x]` Sorting dropdown option selector ([FilterDropdown.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/FilterDropdown.jsx))
  - `[x]` Breathing placeholder loader card ([LoadingSkeleton.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/LoadingSkeleton.jsx))
  - `[x]` Empty query results view panel ([EmptyState.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/EmptyState.jsx))
- `[x]` Create dedicated single Service Details page ([ServiceDetailPage.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/pages/ServiceDetailPage.jsx))
  - `[x]` Render features checklist, benefits checklist and related recommendations list ([ServiceDetail.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/services/ServiceDetail.jsx))

### 4. Admin Services CMS Workspace
- `[x]` Implement Admin Services management panel with create/edit forms, status toggles, displayOrder settings, custom icon grid selects and live preview cards ([AdminServicesCms.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/pages/AdminServicesCms.jsx))
- `[x]` Configure page route bindings in routing index mapping ([App.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/App.jsx))
- `[x]` Add quick link button on main administrative console dashboard ([AdminDashboard.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/pages/AdminDashboard.jsx))
- `[x]` Connect homepage services preview section to query active catalog database values dynamically ([ServicesPreview.jsx](file:///d:/HIMANSHU_CHINDHALORE/STUDY/PROJECTS/NEXTGEN/client/src/components/home/ServicesPreview.jsx))

## Module 4 — Study Planning Module

### 1. Database Configuration
- `[x]` Add `StudyPlan` and associated models to schema.prisma and execute migrations

### 2. Backend API Implementation
- `[x]` Create study plan validators
- `[x]` Create study plan database services
- `[x]` Create study plan HTTP controllers
- `[x]` Define routing bindings and mount under main router

### 3. Frontend Pages & Components
- `[x]` Create Study Planner main page
- `[x]` Create plan configuration and subjects selection
- `[x]` Create Revision Calendar view
- `[x]` Create Progress Analytics Dashboard

## Module 5 — Accountability Module

### 1. Database Configuration
- `[x]` Add `DailyCheckin`, `Habit`, `HabitLog`, `Streak`, `ReminderSetting` to schema.prisma and execute migrations

### 2. Backend API Implementation
- `[x]` Create checkin and habit validators
- `[x]` Create accountability database services
- `[x]` Create accountability HTTP controllers
- `[x]` Register routes on the main router

### 3. Frontend Pages & Components
- `[x]` Create Accountability Dashboard
- `[x]` Create Daily Check-in Form page
- `[x]` Create Habit Tracking and detail views
- `[x]` Create progress analytics charts page
- `[x]` Create reminders preferences config page

## Module 6 — Mentorship Module

### 1. Database Configuration
- `[x]` Define new Prisma models: `Mentor`, `MentorAvailability`, `MentorshipBooking`, `Doubt`, `DoubtReply`, `PerformanceReview` in `schema.prisma`
- `[ ]` Execute Prisma migrations/push to update database tables

### 2. Backend API Implementation
- `[x]` Create request parameter validators:
  - `[x]` `validators/mentor.validator.js`
  - `[x]` `validators/booking.validator.js`
  - `[x]` `validators/doubt.validator.js`
  - `[x]` `validators/review.validator.js`
- `[x]` Implement business logic services:
  - `[x]` `services/mentor.service.js`
  - `[x]` `services/booking.service.js`
  - `[x]` `services/doubt.service.js`
  - `[x]` `services/performanceReview.service.js`
- `[x]` Create request handling controllers:
  - `[x]` `controllers/mentor.controller.js`
  - `[x]` `controllers/booking.controller.js`
  - `[x]` `controllers/doubt.controller.js`
  - `[x]` `controllers/performanceReview.controller.js`
- `[x]` Define routing bindings:
  - `[x]` `routes/mentor.routes.js`
  - `[x]` `routes/booking.routes.js`
  - `[x]` `routes/doubt.routes.js`
  - `[x]` `routes/performanceReview.routes.js`
- `[x]` Mount all router scopes onto `routes/index.js`

### 3. Frontend Components
- `[x]` Create `components/mentorship/` reusable components:
  - `[x]` `MentorCard.jsx`
  - `[x]` `MentorProfileCard.jsx`
  - `[x]` `AvailabilityCalendar.jsx`
  - `[x]` `BookingForm.jsx`
  - `[x]` `BookingCard.jsx`
  - `[x]` `DoubtForm.jsx`
  - `[x]` `DoubtCard.jsx`
  - `[x]` `ReplyBox.jsx`
  - `[x]` `PerformanceCard.jsx`
  - `[x]` `ReviewForm.jsx`
  - `[x]` `RatingStars.jsx`
  - `[x]` `LoadingSkeleton.jsx`
  - `[x]` `EmptyState.jsx`

### 4. Frontend Pages
- `[x]` Create `pages/mentorship/` pages:
  - `[x]` `Mentors.jsx`
  - `[x]` `MentorProfile.jsx`
  - `[x]` `BookSession.jsx`
  - `[x]` `MyBookings.jsx`
  - `[x]` `Doubts.jsx`
  - `[x]` `DoubtDetails.jsx`
  - `[x]` `PerformanceReviews.jsx`
  - `[x]` `MentorDashboard.jsx`

### 5. Integration and Route Registration
- `[x]` Extend `client/src/App.jsx` with routes
- `[x]` Extend `client/src/components/layouts/ProtectedLayout.jsx` with navigation sidebar / header links
- `[x]` Update database seeding script `prisma/seed.js` to create demo mentors
- `[ ]` Execute seeds and verify flows

## Module 13 — Admin Dashboard

### 1. Database Configuration
- `[x]` Add SUPER_ADMIN to Role enum in `schema.prisma`
- `[x]` Add models `AdminUser` and `ActivityLog` in `schema.prisma`

### 2. Backend API Implementation
- `[x]` Create validators under `validators/admin.validator.js`
- `[x]` Create service layers for admin credentials and audits
- `[x]` Create controllers for dashboard widgets and management directories
- `[x]` Setup endpoints routers for admin, dashboard-stats, students, mentor-management, activity-logs
- `[x]` Mount all admin routes onto root multiplexer `routes/index.js`
- `[x]` Extend Prisma seed script to register SUPER_ADMIN user

### 3. Frontend Layout & Reusable Components
- `[x]` Create `AdminLayout.jsx`, `Sidebar.jsx`, `Topbar.jsx` under `components/admin/`
- `[x]` Create `StatsCard.jsx`, `StudentTable.jsx`, `MentorTable.jsx`, `SearchBar.jsx`, `FilterBar.jsx`, `Pagination.jsx`, `ActivityTable.jsx`, `CreateMentorForm.jsx`, `LoadingSkeleton.jsx`, `EmptyState.jsx`, `ConfirmationModal.jsx`

### 4. Frontend Governance Pages
- `[x]` Create `AdminLogin.jsx`
- `[x]` Create `Dashboard.jsx` (Home stats view)
- `[x]` Create `Students.jsx` and `StudentDetails.jsx` profile tracking view
- `[x]` Create `Mentors.jsx`, `CreateMentor.jsx`, `EditMentor.jsx` profile and assignment wizard
- `[x]` Create `ActivityLogs.jsx` system audit trails view
- `[x]` Create `Settings.jsx` profile configuration page
- `[x]` Map all governance page routes inside `client/src/App.jsx`



