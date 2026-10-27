'use strict';
const express = require('express');
const { db } = require('./db.cjs');
const { authenticate } = require('./auth.cjs');

const router = express.Router();

// Get all contacts for user
router.get('/', authenticate, (req, res) => {
  const contacts = db.prepare('SELECT * FROM emergency_contacts WHERE user_id = ?').all(req.userId);
  res.json(contacts);
});

// Add contact
router.post('/', authenticate, (req, res) => {
  const { name, phone, relation } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const count = db.prepare('SELECT COUNT(*) as c FROM emergency_contacts WHERE user_id = ?').get(req.userId);
  if (count.c >= 5) return res.status(400).json({ error: 'Maximum 5 emergency contacts allowed' });
  const result = db.prepare(
    'INSERT INTO emergency_contacts (user_id, name, phone, relation) VALUES (?, ?, ?, ?)'
  ).run(req.userId, name, phone, relation || '');
  res.json({ id: result.lastInsertRowid, user_id: req.userId, name, phone, relation: relation || '' });
});

// Delete contact
router.delete('/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ success: true });
});

module.exports = router;
