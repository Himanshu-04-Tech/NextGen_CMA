import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import ProtectedLayout from './ProtectedLayout.jsx';
import VisitorLayout from './VisitorLayout.jsx';

/**
 * Renders ProtectedLayout for logged-in users and VisitorLayout for visitors.
 */
const AdaptiveLayout = ({ children, featureName = 'Feature Demo' }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
  }

  return <VisitorLayout activeFeature={featureName}>{children}</VisitorLayout>;
};

export default AdaptiveLayout;
