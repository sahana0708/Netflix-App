import { Router } from 'express';

const router = Router();
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getOptions() {
  const key = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token && !key) {
    throw new Error('TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY required');
  }
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      accept: 'application/json',
    },
    searchParams: key ? { api_key: key } : undefined,
  };
}

function buildImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

router.get('/trending', async (req, res) => {
  try {
    const opts = getOptions();
    const url = new URL(`${TMDB_BASE}/trending/movie/week`);
    if (opts.searchParams) url.search = new URLSearchParams(opts.searchParams).toString();
    const r = await fetch(url.toString(), { headers: opts.headers });
    const data = await r.json();
    if (!r.ok) throw new Error(data.status_message || 'TMDB error');
    const results = (data.results || []).slice(0, 10).map((m) => ({
      ...m,
      poster_path: buildImageUrl(m.poster_path),
      backdrop_path: buildImageUrl(m.backdrop_path, 'original'),
    }));
    res.json({ results });
  } catch (err) {
    console.error('Trending error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch trending' });
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const opts = getOptions();
    const url = new URL(`${TMDB_BASE}/movie/popular`);
    if (opts.searchParams) url.search = new URLSearchParams(opts.searchParams).toString();
    const r = await fetch(url.toString(), { headers: opts.headers });
    const data = await r.json();
    if (!r.ok) throw new Error(data.status_message || 'TMDB error');
    const results = (data.results || []).map((m) => ({
      ...m,
      poster_path: buildImageUrl(m.poster_path),
      backdrop_path: buildImageUrl(m.backdrop_path, 'w300'),
    }));
    res.json({ results });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch recommendations' });
  }
});

router.get('/by-genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const opts = getOptions();
    const url = new URL(`${TMDB_BASE}/discover/movie`);
    url.searchParams.set('with_genres', genreId);
    if (opts.searchParams) {
      Object.entries(opts.searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const r = await fetch(url.toString(), { headers: opts.headers });
    const data = await r.json();
    if (!r.ok) throw new Error(data.status_message || 'TMDB error');
    const results = (data.results || []).map((m) => ({
      ...m,
      poster_path: buildImageUrl(m.poster_path),
      backdrop_path: buildImageUrl(m.backdrop_path, 'w300'),
    }));
    res.json({ results });
  } catch (err) {
    console.error('Genre error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch by genre' });
  }
});

export default router;
