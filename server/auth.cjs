'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./db.cjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smart_safety_secret';

// Register
router.post('/register', (req, res) => {
  const { name, phone, password, state, dob, gender, language } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) return res.status(409).json({ error: 'Phone already registered' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    `INSERT INTO users (name, phone, password, state, dob, gender, language)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(name, phone, hash, state || '', dob || '', gender || '', language || 'English');

  const token = jwt.sign({ id: result.lastInsertRowid, phone }, JWT_SECRET, { expiresIn: '30d' });
  const user = db.prepare('SELECT id, name, phone, state, dob, gender, language, notifications, volunteer, about_me FROM users WHERE id = ?')
    .get(result.lastInsertRowid);
  res.json({ token, user });
});

// Login
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });

  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// Get profile (protected)
router.get('/profile', authenticate, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, phone, state, dob, gender, language, notifications, volunteer, about_me FROM users WHERE id = ?'
  ).get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update profile (protected)
router.put('/profile', authenticate, (req, res) => {
  const { name, state, dob, gender, language, notifications, volunteer, about_me } = req.body;
  db.prepare(
    `UPDATE users SET name=?, state=?, dob=?, gender=?, language=?, notifications=?, volunteer=?, about_me=?
     WHERE id=?`
  ).run(name, state, dob, gender, language, notifications ? 1 : 0, volunteer ? 1 : 0, about_me, req.userId);
  const user = db.prepare(
    'SELECT id, name, phone, state, dob, gender, language, notifications, volunteer, about_me FROM users WHERE id = ?'
  ).get(req.userId);
  res.json(user);
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { router, authenticate };
