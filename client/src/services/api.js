/**
 * NextGen CMA — Axios API Client
 *
 * Configures Axios with base headers, credentials support, and interceptors
 * to handle automatic JWT Access Token insertion and seamless Refresh Token execution.
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create modular axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Crucial for reading/writing HTTP-only cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory access token storage (XSS protection)
let memoryToken = null;

// Callback hooks to notify React AuthContext of token refreshes or invalidation
let onTokenRefreshCallback = () => {};
let onSessionExpiredCallback = () => {};

export const setAccessToken = (token) => {
  memoryToken = token;
};

export const registerAuthCallbacks = (onRefresh, onExpired) => {
  onTokenRefreshCallback = onRefresh;
  onSessionExpiredCallback = onExpired;
};

// Queue for pending requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------
// Request Interceptor: Attach Access Token
// ----------------------------------------------------
api.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------
// Response Interceptor: Handle Token Expiration
// ----------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/admin/login') ||
      requestUrl.includes('/auth/refresh-token') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password');

    // Check if error is 401 Unauthorized and request has not been retried yet (and is not an auth endpoint)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint && memoryToken) {
      // If we are currently refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit refresh-token route (uses HTTP-only cookie automatically)
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;

        // Update active in-memory tokens
        setAccessToken(accessToken);
        onTokenRefreshCallback(accessToken);

        // Process queue with new token
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Invalidation failed -> logout user
        isRefreshing = false;
        processQueue(refreshError, null);
        setAccessToken(null);
        onSessionExpiredCallback();
        return Promise.reject(refreshError);
      }
    }

    // Pass standard API errors directly
    return Promise.reject(error);
  }
);

export default api;
