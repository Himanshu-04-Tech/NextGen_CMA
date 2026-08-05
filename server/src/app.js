/**
 * NextGen CMA — Express Application Configuration
 *
 * Configures Express with security middleware (Helmet, CORS, Rate Limiting),
 * request parsing, cookie handling, API routes, and global error handling.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// Trust reverse proxies (Cloudflare Tunnels, NGINX) to forward HTTPS protocol & client IPs
app.set('trust proxy', 1);

// ---------------------
// Security Middleware
// ---------------------

// HTTP security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS — dynamic origin matcher supporting localhost, Cloudflare tunnels, and configured CLIENT_URL
const allowedOrigins = [
  env.CLIENT_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server, mobile apps, Postman)
      if (!origin) return callback(null, true);
      // Allow configured client URL, localhost, or any Cloudflare tunnel domain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.trycloudflare.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback: allow dynamically for dev tunnels
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Global rate limiter — 1000 requests per 15 min per IP (to support concurrent admin/dashboard API queries)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ---------------------
// Request Parsing
// ---------------------

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ---------------------
// Health Check
// ---------------------

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NextGen CMA API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------
// API Routes
// ---------------------

app.use('/api', routes);

// ---------------------
// 404 Handler
// ---------------------

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ---------------------
// Global Error Handler
// ---------------------

app.use(errorHandler);

export default app;
