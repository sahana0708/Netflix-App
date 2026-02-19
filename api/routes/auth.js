import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query, ensureUsersTable } from '../db/pool.js';

const router = Router();
const SALT_ROUNDS = 12;

router.post('/signup', async (req, res) => {
  try {
    await ensureUsersTable();
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username.trim(), email.trim().toLowerCase(), password_hash]
    );
    const user = result.rows[0];
    res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    console.error('Signup error:', err);
    // Return detailed error to help debug
    res.status(500).json({ 
      error: 'Registration failed', 
      message: err.message,
      code: err.code,
      details: err.toString()
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
