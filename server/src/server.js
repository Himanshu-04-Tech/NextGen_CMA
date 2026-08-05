/**
 * NextGen CMA — Server Entry Point
 *
 * Initializes the database connection and starts the Express server.
 */

import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/db.js';

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start HTTP server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 NextGen CMA API running on port ${PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Client URL: ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdwwn
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
