import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { authMiddleware, signToken } from './auth.js';
import { getOrCreateState, initDatabase, query, saveState } from './db.js';
import { createDefaultState } from './defaultState.js';
import { deepMerge, normalizeList } from './utils.js';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'health-hub-api' });
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const insert = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), passwordHash, 'member']
    );

    const user = { id: insert.insertId, name, email: email.toLowerCase(), role: 'member' };
    await saveState(user.id, createDefaultState(user));
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const rows = await query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [
      email.toLowerCase()
    ]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role
    };
    const token = signToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/demo', async (req, res, next) => {
  try {
    const demoEmail = 'demo@example.com';
    let rows = await query('SELECT id, name, email, role FROM users WHERE email = ?', [demoEmail]);
    
    let user;
    if (!rows.length) {
      const passwordHash = await bcrypt.hash('demo_password', 12);
      const insert = await query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Demo User', demoEmail, passwordHash, 'member']
      );
      user = { id: insert.insertId, name: 'Demo User', email: demoEmail, role: 'member' };
      await saveState(user.id, createDefaultState(user));
    } else {
      user = rows[0];
    }
    
    const token = signToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res, next) => {
  try {
    const rows = await query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', authMiddleware, async (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/reset-request', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const rows = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!rows.length) {
      return res.status(404).json({ message: 'No account found with that email.' });
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [
      token,
      expires,
      rows[0].id
    ]);

    res.json({
      message: 'Password reset link generated.',
      resetToken: token,
      resetLink: `${process.env.PUBLIC_APP_URL || 'http://localhost:5173'}/reset-password?token=${token}`
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required.' });
    }

    const rows = await query(
      'SELECT id, reset_token_expires FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    if (!rows.length) {
      return res.status(400).json({ message: 'Reset token is invalid or expired.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [passwordHash, rows[0].id]
    );

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/state', authMiddleware, async (req, res, next) => {
  try {
    const userRows = await query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    const profile = userRows[0];
    const state = await getOrCreateState(req.user.id, profile);
    res.json({ state });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/diagnostics', authMiddleware, async (req, res, next) => {
  try {
    const [userRows, stateRows, currentUserRows] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query('SELECT COUNT(*) AS count FROM user_states'),
      query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id])
    ]);

    const state = await getOrCreateState(req.user.id, currentUserRows[0]);
    const currentStateSize = JSON.stringify(state).length;

    res.json({
      database: {
        connected: true,
        users: Number(userRows[0].count),
        states: Number(stateRows[0].count)
      },
      auth: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      },
      currentUser: currentUserRows[0],
      stateSummary: {
        bytes: currentStateSize,
        meals: state.meals?.length || 0,
        waterLogs: state.water?.length || 0,
        metrics: state.metrics?.length || 0,
        recipes: state.recipes?.length || 0
      },
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/state', authMiddleware, async (req, res, next) => {
  try {
    const userRows = await query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    const profile = userRows[0];
    const current = await getOrCreateState(req.user.id, profile);
    const patch = req.body || {};
    const nextState = deepMerge(current, patch);
    await saveState(req.user.id, nextState);
    res.json({ state: nextState });
  } catch (error) {
    next(error);
  }
});

app.post('/api/ai-fallback', authMiddleware, async (req, res, next) => {
  try {
    const { type, query: userQuery, profile } = req.body || {};
    if (!type) {
      return res.status(400).json({ message: 'Type is required for fallback.' });
    }

    // Determine target keywords based on user profile preferences
    let targetKeyword = 'default';
    if (profile?.preferences?.length > 0) {
      // Find a matching fallback for the first profile preference (e.g. 'vegan', 'keto', etc.)
      const pref = profile.preferences[0].toLowerCase();
      const prefMatch = await query('SELECT output_json FROM ai_fallback_knowledge WHERE type = ? AND LOWER(input_keyword) LIKE ? LIMIT 1', [type, `%${pref}%`]);
      if (prefMatch.length) {
        targetKeyword = pref;
      }
    }

    // Try to find a specific match based on input keyword (overrides profile preference)
    let rows = [];
    if (userQuery) {
      const q = `%${userQuery.toLowerCase()}%`;
      rows = await query('SELECT output_json FROM ai_fallback_knowledge WHERE type = ? AND LOWER(input_keyword) LIKE ? LIMIT 1', [type, q]);
    }

    // If no specific match, use the target keyword (which is either the preference or 'default')
    if (!rows.length) {
      rows = await query('SELECT output_json FROM ai_fallback_knowledge WHERE type = ? AND LOWER(input_keyword) LIKE ? LIMIT 1', [type, `%${targetKeyword}%`]);
    }
    
    // Ultimate fallback if targetKeyword failed
    if (!rows.length) {
      rows = await query('SELECT output_json FROM ai_fallback_knowledge WHERE type = ? AND input_keyword = "default" LIMIT 1', [type]);
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'No fallback data available for this type.' });
    }

    res.json({ data: rows[0].output_json });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error?.status || 500;
  res.status(status).json({
    message: error?.message || 'Unexpected server error.'
  });
});

async function start() {
  await initDatabase();
  app.listen(port, () => {
    console.log(`Health Hub API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API server:', error);
  process.exit(1);
});
