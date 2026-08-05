/**
 * NextGen CMA — Protected Route Component
 *
 * Guards routes based on authentication state and optional role requirements.
 * Shows a full-screen loader while session is being hydrated.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './ui/Loader.jsx';

/**
 * @param {object}  props
 * @param {string[]} [props.allowedRoles] — e.g. ['ADMIN'] | ['STUDENT','MENTOR'] | undefined (any auth)
 * @param {string}  [props.redirectTo]   — where to send unauthenticated users (default: /login)
 */
const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // While the session is being hydrated from cookie/localStorage, show loader
  if (isLoading) {
    return <Loader fullScreen message="Authenticating…" />;
  }

  // Not logged in → redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check — if specific roles are required, verify user has one
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      // Wrong role → send to their appropriate home
      const fallback = user?.role === 'ADMIN' ? '/admin/dashboard' : '/';
      return <Navigate to={fallback} replace />;
    }
  }

  // Authorized → render children
  return <Outlet />;
};

export default ProtectedRoute;
