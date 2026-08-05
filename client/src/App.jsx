import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Component Wrappers & Shared Layout elements
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedLayout from './components/layouts/ProtectedLayout.jsx';
import AdaptiveLayout from './components/layouts/AdaptiveLayout.jsx';
import DashboardRedirect from './components/DashboardRedirect.jsx';
import NotFound from './components/ui/NotFound.jsx';
import Loader from './components/ui/Loader.jsx';

// Lazy load route pages for startup bundle performance optimization
const Home = lazy(() => import('./pages/Home.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const AdminHomepageCms = lazy(() => import('./pages/AdminHomepageCms.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const AdminServicesCms = lazy(() => import('./pages/AdminServicesCms.jsx'));
const Contact = lazy(() => import('./pages/contact/Contact.jsx'));
const ContactSuccess = lazy(() => import('./pages/contact/ContactSuccess.jsx'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Students = lazy(() => import('./pages/admin/Students.jsx'));
const StudentDetails = lazy(() => import('./pages/admin/StudentDetails.jsx'));
const AdminMentors = lazy(() => import('./pages/admin/Mentors.jsx'));
const CreateMentor = lazy(() => import('./pages/admin/CreateMentor.jsx'));
const EditMentor = lazy(() => import('./pages/admin/EditMentor.jsx'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs.jsx'));
const Settings = lazy(() => import('./pages/admin/Settings.jsx'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages.jsx'));
const SocialLinksManagement = lazy(() => import('./pages/admin/SocialLinksManagement.jsx'));

// Study Planner Pages
const StudyPlanner = lazy(() => import('./pages/study-planner/StudyPlanner.jsx'));
const CreatePlan = lazy(() => import('./pages/study-planner/CreatePlan.jsx'));
const StudyPlanDetails = lazy(() => import('./pages/study-planner/StudyPlanDetails.jsx'));
const RevisionCalendar = lazy(() => import('./pages/study-planner/RevisionCalendar.jsx'));
const ProgressDashboard = lazy(() => import('./pages/study-planner/ProgressDashboard.jsx'));

// Accountability Pages
const AccountabilityDashboard = lazy(() => import('./pages/accountability/AccountabilityDashboard.jsx'));
const DailyCheckIn = lazy(() => import('./pages/accountability/DailyCheckIn.jsx'));
const Habits = lazy(() => import('./pages/accountability/Habits.jsx'));
const HabitDetails = lazy(() => import('./pages/accountability/HabitDetails.jsx'));
const ProgressAnalytics = lazy(() => import('./pages/accountability/ProgressAnalytics.jsx'));
const ReminderSettings = lazy(() => import('./pages/accountability/ReminderSettings.jsx'));

// Mentorship Pages
const Mentors = lazy(() => import('./pages/mentorship/Mentors.jsx'));
const MentorProfile = lazy(() => import('./pages/mentorship/MentorProfile.jsx'));
const BookSession = lazy(() => import('./pages/mentorship/BookSession.jsx'));
const MyBookings = lazy(() => import('./pages/mentorship/MyBookings.jsx'));
const Doubts = lazy(() => import('./pages/mentorship/Doubts.jsx'));
const DoubtDetails = lazy(() => import('./pages/mentorship/DoubtDetails.jsx'));
const PerformanceReviews = lazy(() => import('./pages/mentorship/PerformanceReviews.jsx'));
const MentorDashboard = lazy(() => import('./pages/mentorship/MentorDashboard.jsx'));

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen message="Restoring secure workspace session..." />;
  }

  return (
    <Router>
      <Suspense fallback={<Loader fullScreen message="Loading page assets..." />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route
            path="/contact"
            element={
              <AdaptiveLayout featureName="Contact Us">
                <Contact />
              </AdaptiveLayout>
            }
          />
          <Route path="/contact-success" element={<ContactSuccess />} />

          {/* ── Public / Visitor Demo Routes ── */}
          <Route
            path="/study-planner"
            element={
              <AdaptiveLayout featureName="Study Planner">
                <StudyPlanner />
              </AdaptiveLayout>
            }
          />
          <Route
            path="/study-planner/create"
            element={
              <AdaptiveLayout featureName="Study Planner Generator">
                <CreatePlan />
              </AdaptiveLayout>
            }
          />
          <Route
            path="/accountability"
            element={
              <AdaptiveLayout featureName="Accountability Companion">
                <AccountabilityDashboard />
              </AdaptiveLayout>
            }
          />

          {/* ── Protected Student / Mentor / Admin Routes ── */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <DashboardRedirect />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <ProfilePage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/study-planner/plan/:id"
              element={
                <ProtectedLayout>
                  <StudyPlanDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/study-planner/calendar/:id"
              element={
                <ProtectedLayout>
                  <RevisionCalendar />
                </ProtectedLayout>
              }
            />
            <Route
              path="/study-planner/dashboard/:id"
              element={
                <ProtectedLayout>
                  <ProgressDashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/accountability/checkin"
              element={
                <ProtectedLayout>
                  <DailyCheckIn />
                </ProtectedLayout>
              }
            />
            <Route
              path="/accountability/habits"
              element={
                <ProtectedLayout>
                  <Habits />
                </ProtectedLayout>
              }
            />
            <Route
              path="/accountability/habits/:id"
              element={
                <ProtectedLayout>
                  <HabitDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/accountability/analytics"
              element={
                <ProtectedLayout>
                  <ProgressAnalytics />
                </ProtectedLayout>
              }
            />
            <Route
              path="/accountability/reminders"
              element={
                <ProtectedLayout>
                  <ReminderSettings />
                </ProtectedLayout>
              }
            />

            {/* Mentorship Module Routes */}
            <Route
              path="/mentorship/mentors"
              element={
                <ProtectedLayout>
                  <Mentors />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/mentor/:id"
              element={
                <ProtectedLayout>
                  <MentorProfile />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/book/:id"
              element={
                <ProtectedLayout>
                  <BookSession />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/bookings"
              element={
                <ProtectedLayout>
                  <MyBookings />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/doubts"
              element={
                <ProtectedLayout>
                  <Doubts />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/doubts/:id"
              element={
                <ProtectedLayout>
                  <DoubtDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/reviews"
              element={
                <ProtectedLayout>
                  <PerformanceReviews />
                </ProtectedLayout>
              }
            />
            <Route
              path="/mentorship/dashboard"
              element={
                <ProtectedLayout>
                  <MentorDashboard />
                </ProtectedLayout>
              }
            />
          </Route>

          {/* ── Protected Admin Only Routes ── */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/students/:id" element={<StudentDetails />} />
            <Route path="/admin/mentors" element={<AdminMentors />} />
            <Route path="/admin/mentors/create" element={<CreateMentor />} />
            <Route path="/admin/mentors/edit/:id" element={<EditMentor />} />
            <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/contact-messages" element={<ContactMessages />} />
            <Route path="/admin/social-links" element={<SocialLinksManagement />} />
            <Route
              path="/admin/cms"
              element={
                <ProtectedLayout>
                  <AdminHomepageCms />
                </ProtectedLayout>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedLayout>
                  <AdminServicesCms />
                </ProtectedLayout>
              }
            />
          </Route>

          {/* ── 404 Route ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
