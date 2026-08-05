/**
 * NextGen CMA — Auth Context
 *
 * Global authentication state management using React Context.
 * Persists session via localStorage (user snapshot) and in-memory
 * access token managed by the Axios service layer.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import api, {
  setAccessToken,
  registerAuthCallbacks,
} from '../services/api.js';

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // true on mount while we hydrate session

  // ── Helpers ───────────────────────────────

  const persistUser = (userData) => {
    localStorage.setItem('nextgen_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('nextgen_user');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Register Axios callbacks ───────────────

  useEffect(() => {
    registerAuthCallbacks(
      // onTokenRefresh — a silent token was issued; no state changes needed
      (_newToken) => { },
      // onSessionExpired — refresh failed, force logout
      () => {
        clearSession();
      }
    );
  }, [clearSession]);

  // ── Hydrate session on mount ───────────────

  useEffect(() => {
    const hydrate = async () => {
      const cached = localStorage.getItem('nextgen_user');
      if (!cached) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get a fresh access token using HTTP-only refresh token cookie directly
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.post(`${apiUrl}/auth/refresh-token`, {}, { withCredentials: true });
        const { accessToken } = res.data.data;
        setAccessToken(accessToken);

        // Re-fetch the canonical profile to keep state fresh
        const profileRes = await api.get('/auth/profile');
        persistUser(profileRes.data.data);
      } catch (err) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          clearSession();
        } else {
          try {
            const parsed = JSON.parse(cached);
            setUser(parsed);
            setIsAuthenticated(true);
          } catch {
            clearSession();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────
  // Auth Actions
  // ─────────────────────────────────────────────

  /**
   * Register a new student account.
   * @param {{ name, email, phone, password }} data
   */
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { user: newUser, accessToken } = res.data.data;
    setAccessToken(accessToken);
    persistUser(newUser);
    return res.data;
  };

  /**
   * Log in with email/phone + password.
   * @param {{ identifier, password }} data
   */
  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    const { user: loggedInUser, accessToken } = res.data.data;
    setAccessToken(accessToken);
    persistUser(loggedInUser);
    return res.data;
  };

  /**
   * Log out the current user.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Regardless of server response, clear client session
    } finally {
      clearSession();
    }
  };

  /**
   * Re-fetch latest profile from the server and sync context.
   */
  const refreshUser = async () => {
    const res = await api.get('/auth/profile');
    persistUser(res.data.data);
    return res.data.data;
  };

  /**
   * Update profile fields and sync context.
   * @param {object} profileData
   */
  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    persistUser(res.data.data);
    return res.data.data;
  };

  /**
   * Send forgot-password OTP to email.
   * @param {string} email
   */
  const forgotPassword = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  /**
   * Reset password using OTP.
   * @param {{ email, otp, newPassword }} data
   */
  const resetPassword = async (data) => {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  };

  // ─────────────────────────────────────────────
  // Context Value
  // ─────────────────────────────────────────────

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    refreshUser,
    updateProfile,
    forgotPassword,
    resetPassword,
    adminLogin: async (data) => {
      const res = await api.post('/admin/login', data);
      const { user: loggedInUser, accessToken } = res.data.data;
      setAccessToken(accessToken);
      persistUser(loggedInUser);
      return res.data;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default AuthContext;
