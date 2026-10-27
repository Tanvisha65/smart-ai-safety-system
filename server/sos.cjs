'use strict';
const express = require('express');
const { db } = require('./db.cjs');
const { authenticate } = require('./auth.cjs');

const router = express.Router();

// Get SOS history
router.get('/', authenticate, (req, res) => {
  const history = db.prepare(
    'SELECT * FROM sos_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(req.userId);
  res.json(history);
});

// Save SOS event
router.post('/', authenticate, (req, res) => {
  const { type, latitude, longitude, maps_link, silent, volunteer_assist } = req.body;
  const result = db.prepare(
    `INSERT INTO sos_history (user_id, type, latitude, longitude, maps_link, silent, volunteer_assist)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.userId, type || 'Emergency', latitude || null, longitude || null,
    maps_link || '', silent ? 1 : 0, volunteer_assist ? 1 : 0);
  res.json({ id: result.lastInsertRowid, success: true });
});

module.exports = router;
