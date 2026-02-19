import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      login(data.user);
      navigate('/');
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      <header className="p-6">
        <Link to="/login" className="text-netflix-red font-bold text-2xl tracking-tight">
          NETFLIX
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-netflix-red text-sm bg-red-500/10 border border-red-500/50 rounded px-3 py-2">
                {error}
              </p>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-netflix-gray text-white rounded px-4 py-3 placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-netflix-gray text-white rounded px-4 py-3 placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red text-white font-semibold py-3 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
          <p className="mt-6 text-gray-400">
            New to Netflix?{' '}
            <Link to="/signup" className="text-white hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
