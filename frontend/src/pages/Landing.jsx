import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api/movies';

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

function MovieCard({ movie, size = 'normal' }) {
  const poster = movie.poster_path || movie.backdrop_path;
  const w = size === 'large' ? 'w-40 min-w-[10rem] sm:w-52 sm:min-w-[13rem]' : 'w-28 min-w-[7rem] sm:w-36 sm:min-w-[9rem]';
  return (
    <div className={`${w} flex-shrink-0 group cursor-pointer transition transform hover:scale-105 hover:z-10`}>
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-netflix-gray shadow-lg">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No image</div>
        )}
      </div>
      <p className="mt-1 text-xs sm:text-sm text-gray-300 truncate group-hover:text-white">{movie.title}</p>
    </div>
  );
}

function Carousel({ title, movies }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!movies?.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-gray-600 transition"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-gray-600 transition"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-thin px-4 sm:px-6 pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}

export default function Landing() {
  const { user, logout } = useAuth();
  const [heroMovie, setHeroMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setError('');
        const [trendRes, recRes] = await Promise.all([
          fetch(`${API_BASE}/trending`),
          fetch(`${API_BASE}/recommendations`),
        ]);
        const trendData = await trendRes.json();
        const recData = await recRes.json();
        if (!trendRes.ok) throw new Error(trendData.error || 'Trending failed');
        if (!recRes.ok) throw new Error(recData.error || 'Recommendations failed');

        const trendList = trendData.results || [];
        setHeroMovie(trendList[0] || null);
        setRecommendations(recData.results || []);

        const byGenre = {};
        await Promise.all(
          GENRES.map(async (g) => {
            const r = await fetch(`${API_BASE}/by-genre/${g.id}`);
            const d = await r.json();
            byGenre[g.id] = d.results || [];
          })
        );
        setGenreMovies(byGenre);
      } catch (err) {
        setError(err.message || 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-netflix-red text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <span className="text-netflix-red font-bold text-2xl tracking-tight">NETFLIX</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:inline">{user?.username}</span>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-netflix-red text-white text-sm font-semibold rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero */}
      {heroMovie && (
        <section className="relative h-[50vh] min-h-[320px] sm:h-[70vh] flex items-end pb-16 sm:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: heroMovie.backdrop_path
                ? `url(${heroMovie.backdrop_path})`
                : 'none',
              backgroundColor: '#0d0d0d',
            }}
          />
          <div className="absolute inset-0 bg-gradient-bottom" />
          <div className="absolute inset-0 bg-gradient-right" />
          <div className="relative z-10 px-4 sm:px-8 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-lg">{heroMovie.title}</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-300 line-clamp-2">{heroMovie.overview}</p>
          </div>
        </section>
      )}

      {error && (
        <div className="px-4 sm:px-8 py-4 text-netflix-red bg-red-500/10 border-b border-red-500/30">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="pt-6 -mt-6 relative z-10">
        <Carousel title="Movies Recommendation" movies={recommendations} />
        {GENRES.map((g) => (
          <Carousel key={g.id} title={g.name} movies={genreMovies[g.id]} />
        ))}
      </div>
    </div>
  );
}
