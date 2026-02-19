// Vercel serverless function wrapper for Express app
// This file handles all /api/* routes
import app from '../backend/src/app.js';

// Export the Express app - Vercel will handle routing
export default app;
