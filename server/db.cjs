'use strict';
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'safety.db');
const db = new DatabaseSync(dbPath);

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      state TEXT,
      dob TEXT,
      gender TEXT,
      language TEXT DEFAULT 'English',
      notifications INTEGER DEFAULT 1,
      volunteer INTEGER DEFAULT 0,
      about_me TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      relation TEXT DEFAULT '',
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sos_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      maps_link TEXT,
      silent INTEGER DEFAULT 0,
      volunteer_assist INTEGER DEFAULT 0,
      status TEXT DEFAULT 'sent',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed demo account
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get('9999999999');
  if (!existing) {
    const hash = bcrypt.hashSync('demo123', 10);
    db.prepare(`INSERT INTO users (name, phone, password, state, dob, gender, language)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run('Demo User', '9999999999', hash, 'Maharashtra', '1990-01-01', 'Other', 'English');
    console.log('Demo account seeded: 9999999999 / demo123');
  }
}

init();

module.exports = { db };
