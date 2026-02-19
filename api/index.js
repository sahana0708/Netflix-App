// Vercel serverless function - handles all /api/* routes
import app from '../backend/src/app.js';

// Vercel calls this function for /api/* requests
// Express app receives the full path including /api prefix
export default app;
