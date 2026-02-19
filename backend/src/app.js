import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import { query } from './db/pool.js';

const app = express();

// CORS - allow all origins (Vercel handles security)
app.use(cors({ 
  origin: true, // Allow all origins
  credentials: true 
}));
app.use(express.json());

// Routes - Vercel passes full path including /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error' });
  }
});

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

export default app;
