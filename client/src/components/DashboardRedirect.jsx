import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'MENTOR') {
    return <Navigate to="/mentorship/dashboard" replace />;
  }

  // Renders the StudentDashboard directly for student roles
  return <StudentDashboard />;
};

export default DashboardRedirect;
