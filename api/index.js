// MUST be first: allow Aiven PostgreSQL self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED === '1' ? '1' : '0';

// Vercel serverless function - self-contained Express app
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import { query } from './db/pool.js';

const app = express();

// CORS - allow all origins
app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(express.json());

// Routes - Vercel passes full path including /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ 
      ok: true, 
      db: 'connected',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasTmdbKey: !!process.env.TMDB_API_KEY,
        tlsReject: process.env.NODE_TLS_REJECT_UNAUTHORIZED
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error', message: e.message, stack: e.stack });
  }
});

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

export default app;
